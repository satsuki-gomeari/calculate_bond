export async function allocateGifts(glpk, inventory, caps, experience, deadline) {
    const allocations = caps.map(() => inventory.map(() => 0));
    const stock = inventory.map((count, gift) => ({ count, gift, terms: [] }));
    const bounds = [];
    const decisions = [];
    const constraints = [];
    const effective = [];
    const term = (name, coef = 1) => ({ name, coef });
    const fixed = (value) => ({ type: glpk.GLP_FX, lb: value, ub: value });
    const upper = (value) => ({ type: glpk.GLP_UP, lb: 0, ub: value });

    caps.forEach((cap, student) => {
        if (!cap) return;
        const earnings = [];
        stock.forEach(({ count, gift, terms }) => {
            const xp = experience[student][gift];
            if (!count || !xp) return;
            const name = `x_${student}_${gift}`;
            const limit = Math.min(count, Math.ceil(cap / xp));
            const bound = { name, type: glpk.GLP_DB, lb: 0, ub: limit };
            bounds.push(bound);
            decisions.push({ student, gift, name, limit, bound });
            terms.push(term(name));
            earnings.push(term(name, -xp));
        });
        if (!earnings.length) return;
        const name = `xp_${student}`;
        bounds.push({ name, type: glpk.GLP_DB, lb: 0, ub: cap });
        effective.push(term(name));
        constraints.push({ name: `earnings_${student}`, vars: [term(name), ...earnings], bnds: upper(0) });
    });
    stock.forEach(({ count, gift, terms }) => {
        if (terms.length) constraints.push({ name: `stock_${gift}`, vars: terms, bnds: upper(count) });
    });

    if (decisions.length) {
        const giftExperience = decisions.map(({ name, student, gift }) =>
            term(name, experience[student][gift]),
        );
        const usage = decisions.map(({ name }) => term(name));
        const model = {
            name: 'gift_allocation', bounds, subjectTo: constraints,
            generals: decisions.map(({ name }) => name),
        };
        const solve = async (direction, vars) => {
            const remaining = deadline - performance.now();
            if (remaining <= 0) throw new Error('Allocation timed out');
            const { result } = await glpk.solve({ ...model, objective: { direction, name: 'score', vars } }, {
                msglev: glpk.GLP_MSG_OFF, presol: true, mipgap: 0, tmlim: Math.ceil(remaining / 1000),
            });
            if (result.status !== glpk.GLP_OPT) throw new Error('Optimal allocation was not proven');
            return result.vars;
        };
        const countFor = (solution, name) => Math.round(solution[name]);
        const total = (vars, solution) => vars.reduce((sum, { name, coef }) => sum + coef * countFor(solution, name), 0);

        const bestXp = await solve(glpk.GLP_MAX, effective);
        constraints.push({ name: 'best_xp', vars: effective, bnds: fixed(total(effective, bestXp)) });
        let solution = await solve(glpk.GLP_MIN, giftExperience);
        constraints.push({ name: 'least_experience_waste', vars: giftExperience, bnds: fixed(total(giftExperience, solution)) });
        solution = await solve(glpk.GLP_MIN, usage);
        constraints.push({ name: 'least_items', vars: usage, bnds: fixed(total(usage, solution)) });

        if (decisions.length <= 30) {
            for (let start = 0; start < decisions.length;) {
            let end = start;
            let radix = 1;
            while (end < decisions.length && radix * (decisions[end].limit + 1) <= 100000) {
                radix *= decisions[end].limit + 1;
                end++;
            }
            if (end === start) end++;
            const group = decisions.slice(start, end);
            if (group.some(({ name, limit }) => countFor(solution, name) < limit)) {
                let weight = 1;
                const priorities = group.slice().reverse().map(({ name, limit }) => {
                    const priority = term(name, weight);
                    weight *= limit + 1;
                    return priority;
                });
                solution = await solve(glpk.GLP_MAX, priorities);
            }
            start = end;
            }
        }
        decisions.forEach(({ student, gift, name }) => {
            allocations[student][gift] = countFor(solution, name);
        });
    }

    const unused = inventory.map((count, gift) => allocations.reduce((left, row) => left - row[gift], count));
    const earned = allocations.map((row, student) => Math.min(caps[student], row.reduce(
        (sum, count, gift) => sum + count * experience[student][gift], 0,
    )));
    return { allocations, earned, unused };
}