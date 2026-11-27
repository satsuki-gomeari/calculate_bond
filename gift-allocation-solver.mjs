export function allocateGifts(inventory, caps, experience) {
    const allocations = caps.map(() => inventory.map(() => 0));
    const unused = inventory.slice();
    const earned = caps.map(() => 0);
    const candidates = [];

    experience.forEach((row, student) => {
        if (!caps[student]) return;
        row.forEach((xp, gift) => {
            if (inventory[gift] > 0 && xp > 0) candidates.push({ student, gift, xp });
        });
    });
    candidates.sort((left, right) => right.xp - left.xp || left.student - right.student || left.gift - right.gift);

    for (const { student, gift, xp } of candidates) {
        const remaining = caps[student] - earned[student];
        if (!remaining || !unused[gift]) continue;
        const count = Math.min(unused[gift], Math.ceil(remaining / xp));
        allocations[student][gift] = count;
        unused[gift] -= count;
        earned[student] += Math.min(remaining, count * xp);
    }
    return { allocations, earned, unused };
}