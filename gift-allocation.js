function initGiftAllocation(dataReady) {
    const form = document.getElementById('gift-allocation-form');
    const students = document.getElementById('allocation-students');
    const stock = document.getElementById('allocation-stock');
    const add = document.getElementById('allocation-add');
    const calculate = document.getElementById('allocation-calculate');
    const reset = document.getElementById('allocation-reset');
    const exportButton = document.getElementById('allocation-export');
    const importButton = document.getElementById('allocation-import');
    const fileInput = document.getElementById('allocation-file');
    const fileStatus = document.getElementById('allocation-file-status');
    const status = document.getElementById('allocation-status');
    const results = document.getElementById('allocation-results');
    const minStudents = 1;
    const maxStudents = 6;
    const giftKeys = ['gift_orange_s', 'gift_orange_m', 'gift_orange_l', 'gift_orange_ex_l',
        'gift_purple_s', 'gift_purple_m', 'gift_purple_l', 'gift_purple_ex_l'];
    const rows = [];
    const gifts = [];
    let sequence = 0;

    function element(tag, attributes = {}, text = '') {
        const node = document.createElement(tag);
        for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
        if (text) node.textContent = text;
        return node;
    }

    function invalidate() {
        form.querySelectorAll('[aria-invalid]').forEach(input => input.removeAttribute('aria-invalid'));
        results.replaceChildren();
        status.replaceChildren('ここに結果が表示されます。', document.createElement('br'), '計算ボタンを押してください。');
        calculate.disabled = false;
    }

    function updateRows() {
        rows.forEach((row, index) => {
            row.label.textContent = `生徒${index + 1}:`;
            row.remove.disabled = rows.length <= minStudents;
        });
        add.disabled = rows.length >= maxStudents;
    }

    function addRow() {
        if (rows.length >= maxStudents) return;
        const rowId = `allocation-student-${++sequence}`;
        const container = element('div', { class: 'allocation-student' });
        const wrapper = element('div', { class: 'custom-select-wrapper' });
        const label = element('label', { for: rowId });
        const trigger = element('button', { type: 'button', id: rowId, class: 'custom-select-trigger',
            'aria-expanded': 'false', 'aria-controls': `${rowId}-options` });
        const placeholder = element('span', {}, studentOptionsTab4[0].text);
        trigger.append(placeholder, element('span', { class: 'custom-select-arrow', 'aria-hidden': 'true' }, '▾'));
        const options = element('div', { class: 'custom-options', id: `${rowId}-options` });
        const search = element('input', { type: 'search', class: 'custom-option-search',
            placeholder: '検索', 'aria-label': '生徒名を検索' });
        options.append(search);
        wrapper.append(label, trigger, options);

        const rankField = element('div', { class: 'allocation-rank-field' });
        const rank = element('input', { type: 'number', min: '1', max: '100', value: '1',
            inputmode: 'numeric', id: `${rowId}-rank` });
        rank.addEventListener('input', () => {
            if (rank.value.length > 3) rank.value = rank.value.slice(0, 3);
        });
        rankField.append(element('label', { for: rank.id }, '現在の絆ランク:'), rank);
        const remove = element('button', { type: 'button', class: 'allocation-remove' }, '削除');
        container.append(wrapper, rankField, remove);
        students.append(container);
        renderCustomStudentOptions(options.id, studentOptionsTab4);
        const row = { trigger, label, rank, remove, student: 0, name: '' };
        rows.push(row);

        const close = () => {
            closeCustomStudentOptions(options.id);
            trigger.setAttribute('aria-expanded', 'false');
        };
        row.close = close;
        const filter = () => {
            options.querySelector('.custom-no-results')?.remove();
            filterCustomStudentOptions(options.id, search.value.trim().toLowerCase());
        };
        trigger.addEventListener('click', () => {
            const wasOpen = options.classList.contains('open');
            rows.forEach(other => other.close());
            closeAllCustomStudentOptions();
            if (wasOpen) return;
            search.value = '';
            filter();
            openCustomStudentOptions(options.id);
            trigger.setAttribute('aria-expanded', 'true');
            search.focus();
        });
        const choose = (option) => {
            const student = Number(option.dataset.value) || 0;
            if (student !== row.student) {
                row.student = student;
                row.name = student ? option.textContent : '';
                placeholder.textContent = option.textContent;
                rank.value = '1';
                invalidate();
            }
            close();
            trigger.focus();
        };
        search.addEventListener('input', filter);
        options.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.isComposing) {
                event.preventDefault();
                const match = options.querySelector('.custom-option:not(.hidden):not(.disabled)');
                if (match) choose(match);
            } else if (event.key === 'Escape') {
                close();
                trigger.focus();
            }
        });
        options.addEventListener('click', event => {
            const option = event.target.closest('.custom-option:not(.disabled)');
            if (option) choose(option);
        });
        remove.addEventListener('click', () => {
            rows.splice(rows.indexOf(row), 1);
            container.remove();
            updateRows();
            invalidate();
            add.focus();
        });
        updateRows();
        return row;
    }

    function buildStock() {
        const titles = giftCompatibilityList[0].replace(/\r$/, '').split(',');
        if (titles.length !== giftImgPathList.length || titles.length <= ORANGE_GIFT_INDEX_MAX ||
            giftCompatibilityList.length < 3 || giftCompatibilityList.slice(1).some(data => data.split(',').length !== titles.length)) {
            throw new Error('Gift CSV columns do not match');
        }
        const definitions = giftImgPathList.slice(1).map((src, index) => ({ src, name: titles[index + 1] }));
        definitions.push({ name: '贈り物選択ボックス', src: './img/gift/gift_box.png' });
        definitions.forEach(({ name, src }, index) => {
            const cell = element('div');
            const input = element('input', { type: 'number', min: '0', max: '9999', value: '0',
                inputmode: 'numeric', id: `allocation-stock-${index}`, 'aria-label': `${name}の保有数` });
            const image = element('img', { class: 'grid-gift_detail_img', src, alt: name, title: name });
            input.addEventListener('input', () => {
                if (input.value.length > 4) input.value = input.value.slice(0, 4);
            });
            cell.append(image, input);
            stock.append(cell);
            gifts.push({ name, src, input });
        });
    }

    function readInputs() {
        const selected = rows.filter(row => row.student);
        const reject = (control, message) => {
            control.setAttribute('aria-invalid', 'true');
            control.focus();
            throw new Error(message);
        };
        if (selected.length < minStudents) reject(rows[0].trigger, '生徒を1人以上選んでください。');
        const seen = new Set();
        const selection = selected.map(({ student, name, rank, trigger }) => {
            if (seen.has(student)) reject(trigger, `${name}が重複しています。別の生徒を選んでください。`);
            seen.add(student);
            const level = rank.valueAsNumber;
            if (!Number.isInteger(level) || level < 1 || level > 100) reject(rank, `${name}の現在ランクを1〜100の整数で入力してください。`);
            return { student, name, level };
        });
        return { selection, inventory: readInventory(reject) };
    }

    function validCount(count) {
        return Number.isInteger(count) && count >= 0 && count <= 9999;
    }

    function readInventory(reject) {
        return gifts.map(({ name, input }) => {
            const count = input.value === '' && !input.validity.badInput ? 0 : input.valueAsNumber;
            if (!validCount(count)) reject(input, `${name}の保有数を0〜9999の整数で入力してください。`);
            return count;
        });
    }

    function setInventory(counts) {
        gifts.forEach(({ input }, index) => {
            const value = String(counts[index]);
            if (input.value === value) return;
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        invalidate();
    }

    function exportInventory() {
        try {
            const inventory = readInventory((input, message) => {
                input.focus();
                throw new Error(message);
            });
            const counts = Object.fromEntries(gifts.map(({ src }, index) => [src, inventory[index]]));
            const data = JSON.stringify({ version: 1, counts }, null, 2);
            const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
            const link = element('a', { href: url, download: 'gift-inventory.json', hidden: '' });
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
            fileStatus.textContent = '';
        } catch (error) {
            fileStatus.textContent = error.message;
        }
    }

    async function importInventory() {
        const file = fileInput.files[0];
        fileInput.value = '';
        if (!file) return;
        importButton.disabled = true;
        fileStatus.textContent = '';
        try {
            if (file.size > 64 * 1024) throw new Error('Inventory file is too large');
            const data = JSON.parse(await file.text());
            const counts = data?.counts;
            if (data?.version !== 1 || !counts || typeof counts !== 'object' || Array.isArray(counts) ||
                Object.keys(counts).length !== gifts.length ||
                !gifts.every(({ src }) => Object.hasOwn(counts, src) && validCount(counts[src]))) {
                throw new Error('Invalid inventory file');
            }
            setInventory(gifts.map(({ src }) => counts[src]));
            fileStatus.textContent = '贈り物の個数を読み込みました。';
        } catch (error) {
            fileStatus.textContent = '個数を読み込めませんでした。このサイトから書き出したJSONファイルを選んでください。';
        } finally {
            importButton.disabled = false;
        }
    }

    function listGifts(counts, emptyText) {
        if (!counts.some(Boolean)) return element('p', {}, emptyText);
        const list = element('ul', { class: 'allocation-results-list' });
        counts.forEach((count, index) => {
            if (!count) return;
            const { name, src } = gifts[index];
            const item = element('li');
            item.append(element('img', { class: 'img_gift', src, alt: name }), `× ${count}個`);
            list.append(item);
        });
        return list;
    }

    function render(selection, { allocations, earned, unused }) {
        selection.forEach(({ student, name, level }, index) => {
            const reached = calculator.calculateEx2Lv(calculator.getCurrentEx(level) + earned[index]);
            const studentImage = element('img', {
                class: 'allocation-result-student-image',
                alt: name,
            });
            studentImage.addEventListener('error', () => {
                studentImage.src = TEMP_IMG_PATH;
            }, { once: true });
            studentImage.src = studentImgPathList[student] || TEMP_IMG_PATH;
            const studentResult = element('div', { class: 'allocation-student-result image-wrapper' });
            const summary = element('p', { class: 'allocation-result-student-summary' });
            summary.append(
                '・絆 ', element('strong', {}, String(level)), 'から', element('strong', {}, String(reached)), 'まで到達できます。',
                element('br'), '・', element('strong', {}, String(earned[index])), 'の経験値が獲得できます。',
            );
            studentResult.append(
                element('h3', {}, name),
                summary,
                studentImage,
            );
            results.append(studentResult);
        });
        const usedGifts = element('section');
        usedGifts.append(element('h3', {}, '利用した贈り物一覧'));
        selection.forEach(({ name }, index) => {
            usedGifts.append(element('h4', {}, name), listGifts(allocations[index], '割り当てなし'));
        });
        results.append(usedGifts, element('h3', {}, '未使用在庫'), listGifts(unused, '未使用なし'));
        status.textContent = '';
    }

    function readActivityExperience() {
        const read = (id, message) => {
            const input = document.getElementById(id);
            if (!input.validity.valid) {
                input.setAttribute('aria-invalid', 'true');
                input.focus();
                throw new Error(message);
            }
            return Number(input.value);
        };
        const cafe = read('allocation-cafe', 'カフェタッチ回数を0〜10の整数で入力してください。');
        const schedule = read('allocation-schedule', 'スケジュール訪問回数を0〜100の範囲で0.1刻みで入力してください。');
        const days = read('allocation-days', 'タッチ・訪問日数を0〜1000の整数で入力してください。');
        const experience = calculator.calculateGift2Ex(0, 0, 0, 0, 0, 0, 0, 0, cafe, schedule, days);
        return Math.round(experience * 2) / 2;
    }

    function runAllocation(selection, inventory, allocateGifts) {
        const caps = selection.map(({ level }) => calculator.getCurrentEx(100) - calculator.getCurrentEx(level));
        const activity = readActivityExperience();
        const activityEarned = caps.map(cap => Math.min(cap, activity));
        const giftCaps = caps.map((cap, index) => cap - activityEarned[index]);
        const experience = selection.map(({ student }) => {
            const codes = giftCompatibilityList[student].replace(/\r$/, '').split(',').map(Number);
            const orange = codes.slice(ORANGE_GIFT_INDEX_MIN, ORANGE_GIFT_INDEX_MAX);
            const best = Math.max(...orange);
            if (!Number.isInteger(best) || best < 1 || best > 4) throw new Error('選択ボックスの相性データに不整合があります。');
            const values = [...codes.slice(1), best].map(code => calculator.giftType2exDict[giftKeys[code - 1]]);
            if (values.some(value => !Number.isInteger(value))) throw new Error('贈り物の相性データに不整合があります。');
            return values;
        });
        const { allocations, earned, unused } = allocateGifts(inventory, giftCaps, experience);
        render(selection, { allocations, earned: earned.map((xp, index) => xp + activityEarned[index]), unused });
    }

    Promise.all([dataReady, import('./gift-allocation-solver.mjs')]).then(([, { allocateGifts }]) => {
        buildStock();
        addRow();
        reset.disabled = false;
        exportButton.disabled = false;
        importButton.disabled = false;
        invalidate();
        document.addEventListener('click', event => {
            if (!students.contains(event.target)) rows.forEach(row => row.close());
        });
        form.addEventListener('input', event => {
            if (event.target === fileInput || event.target.matches('.custom-option-search')) return;
            if (stock.contains(event.target)) event.target.classList.toggle('allocation-stock-filled', event.target.valueAsNumber > 0);
            invalidate();
        });
        form.addEventListener('focusin', event => {
            if (event.target.matches('input[type="number"]')) event.target.select();
        });
        add.addEventListener('click', () => { addRow().trigger.focus(); invalidate(); });
        reset.addEventListener('click', () => setInventory(gifts.map(() => 0)));
        exportButton.addEventListener('click', exportInventory);
        importButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', importInventory);
        form.addEventListener('submit', event => {
            event.preventDefault();
            invalidate();
            try {
                const { selection, inventory } = readInputs();
                runAllocation(selection, inventory, allocateGifts);
            } catch (error) {
                status.textContent = error.message;
            }
        });
    }).catch(error => {
        console.error(error);
        status.textContent = '贈り物データを読み込めませんでした。ページを再読み込みしてください。';
    });
}