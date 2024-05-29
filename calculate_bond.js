function openTab(evt, tabName) {
    // 全てのタブコンテンツを非表示にする
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }

    // 全てのタブリンクのactiveクラスを削除する
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // 指定されたタブコンテンツを表示し、タブリンクをactiveにする
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // 日付の取得
    var today = new Date();
    today.setDate(today.getDate());
    var yyyy = today.getFullYear();
    var mm = ("0"+(today.getMonth()+1)).slice(-2);
    var dd = ("0"+today.getDate()).slice(-2);
    document.getElementById("input1-tab2").value=yyyy+'-'+mm+'-'+dd;
    document.getElementById("input2-tab2").value=yyyy+'-'+"08"+'-'+"05";
}

// 初期状態で最初のタブを開く
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab").click();
});


function updateResult(tabId) {
    const resultDisplay = document.getElementById(`result-display-${tabId}`);
    let result = '';

    if (tabId === 'tab1') {
        
        const current_lv = Number(document.getElementById('input1-tab1').value);
        const gift_o_s_num = Number(document.getElementById('input3-tab1').value);
        const gift_o_m_num = Number(document.getElementById('input4-tab1').value);
        const gift_o_l_num = Number(document.getElementById('input5-tab1').value);
        const gift_o_ex_num = Number(document.getElementById('input6-tab1').value);
        const gift_p_s_num = Number(document.getElementById('input7-tab1').value);
        const gift_p_m_num = Number(document.getElementById('input8-tab1').value);
        const gift_p_l_num = Number(document.getElementById('input9-tab1').value);
        const gift_p_ex_num = Number(document.getElementById('input10-tab1').value);
        const cafe_touch_per_day = Number(document.getElementById('input11-tab1').value);
        const schedule_touch_per_day = Number(document.getElementById('input12-tab1').value);
        const number_of_day = Number(document.getElementById('input13-tab1').value);

        let gift2ex = calculator.calculateGift2Ex(
            gift_o_s_num,
            gift_o_m_num,
            gift_o_l_num,
            gift_o_ex_num,
            gift_p_s_num,
            gift_p_m_num,
            gift_p_l_num,
            gift_p_ex_num,
            cafe_touch_per_day,
            schedule_touch_per_day,
            number_of_day
        )
        let current_ex = calculator.getCurrentEx(current_lv);

        let target_lv = calculator.calculateEx2Lv(gift2ex+current_ex)

        if (current_lv > 0 && current_lv <= 100 && cafe_touch_per_day >= 0 && schedule_touch_per_day >= 0 && number_of_day >= 0 && gift2ex >= 0 && Number.isInteger(current_lv)) {
            result = `
            ・保有している贈り物で、絆ランク<b>${current_lv}</b>から<b>${target_lv}</b>まで到達できます。<br>
            ・<b>${gift2ex}</b>の経験値が獲得できます。
        `;
        }
        else {
            result = `
                下記の点を確認してください。 <br>
                ・「現在の絆ランク」は、1~100(半角整数)の値となっているか <br>
                ・「贈り物保有数」は、0~9999(半角整数)の値となっているか <br>
                ・「カフェタッチ回数」は、0以上(半角整数)の値となっているか <br>
                ・「スケジュール訪問回数」は、0以上(半角)となっているか <br>
                ・「タッチ・訪問日数」は、0以上(半角整数)の値となっているか
            `;
        }

    } else if (tabId === 'tab2') {
        const current_day = document.getElementById('input1-tab2').value;
        const target_day = document.getElementById('input2-tab2').value;
        const current_lv = document.getElementById('input3-tab2').value;
        const target_lv = document.getElementById('input4-tab2').value;
        const cafe_touch_per_day = document.getElementById('input5-tab2').value;
        const schedule_touch_per_day = document.getElementById('input6-tab2').value;

        let diff = calculator.calculateDiffDate(current_day, target_day);
        let required_o_s_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_orange_s", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_o_m_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_orange_m", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_o_l_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_orange_l", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_o_ex_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_orange_ex_l", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_p_s_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_purple_s", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_p_m_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_purple_m", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_p_l_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_purple_l", cafe_touch_per_day, schedule_touch_per_day, diff);
        let required_p_ex_num = calculator.calculateGiftNum(current_lv, target_lv, "gift_purple_ex_l", cafe_touch_per_day, schedule_touch_per_day, diff);
        
        let required_ex = calculator.calculateRequiredEx(
            current_lv,
            target_lv
        );

        if (required_ex >= 0 && cafe_touch_per_day >= 0 && schedule_touch_per_day >= 0 && diff >= 0 && Number.isInteger(Number(cafe_touch_per_day))) {
            result = `
            ・目標日までに到達するには、以下が必要数となります。 <br>
            &emsp;&emsp;橙-小の場合：<b>${Math.ceil(required_o_s_num/diff)}</b>個/日、合計<b>${required_o_s_num}</b>個、
             紫-小の場合：<b>${Math.ceil(required_p_s_num/diff)}</b>個/日、合計<b>${required_p_s_num}</b>個<br>
            &emsp;&emsp;橙-中の場合：<b>${Math.ceil(required_o_m_num/diff)}</b>個/日、合計<b>${required_o_m_num}</b>個、
             紫-中の場合：<b>${Math.ceil(required_p_m_num/diff)}</b>個/日、合計<b>${required_p_m_num}</b>個<br>
            &emsp;&emsp;橙-大の場合：<b>${Math.ceil(required_o_l_num/diff)}</b>個/日、合計<b>${required_o_l_num}</b>個、
             紫-大の場合：<b>${Math.ceil(required_p_l_num/diff)}</b>個/日、合計<b>${required_p_l_num}</b>個<br>
            &emsp;&emsp;橙-特大の場合：<b>${Math.ceil(required_o_ex_num/diff)}</b>個/日、合計<b>${required_o_ex_num}</b>個、
             紫-特大の場合：<b>${Math.ceil(required_p_ex_num/diff)}</b>個/日、合計<b>${required_p_ex_num}</b>個<br><br>
            ・目標の絆ランク到達には、およそ <b>${required_ex}</b> 経験値が必要です。 <br>
            ・橙-大の贈り物 5, 6個/日がおおよそ現実的な数値になります。 <br><br>
            カフェRANKは最大値, スケジュールBOUNUSは無しの想定で計算しています。
        `;
        }
        else {
            result = `
                下記の点を確認してください。 <br>
                ・「本日の日付」<=「目標日」となっているか <br>
                ・「現在の絆ランク」<=「目標の絆ランク」となっているか <br>
                ・「現在の絆ランク」と「目標の絆ランク」は、1~100(半角整数)の値となっているか <br>
                ・「カフェタッチ回数」は、0以上(半角整数)の値となっているか <br>
                ・「スケジュール訪問回数」は、0以上(半角)となっているか
            `;
        }
    } else if (tabId === 'tab3') {
        
        const current_lv = document.getElementById('input1-tab3').value;
        const target_lv = document.getElementById('input2-tab3').value;
        const gift_per_day = document.getElementById('input3-tab3').value;
        const cafe_touch_per_day = document.getElementById('input4-tab3').value;
        const schedule_touch_per_day = document.getElementById('input5-tab3').value;
        let gift_type = '';

        let giftRadio = document.getElementsByName('radio-tab3');
        let giftRadioLen = giftRadio.length;
        let checkValue = '';
        for (let i = 0; i < giftRadioLen; i++){
            if (giftRadio.item(i).checked){
              checkValue = giftRadio.item(i).value;
            }
        }
        if (checkValue == 'radio1'){
            gift_type = 'gift_orange_s';
        }
        else if (checkValue == 'radio2'){
            gift_type = 'gift_orange_m';
        }
        else if (checkValue == 'radio3'){
            gift_type = 'gift_orange_l';
        }
        else if (checkValue == 'radio4'){
            gift_type = 'gift_orange_ex_l';
        }
        else if (checkValue == 'radio5'){
            gift_type = 'gift_purple_s';
        }
        else if (checkValue == 'radio6'){
            gift_type = 'gift_purple_m';
        }
        else if (checkValue == 'radio7'){
            gift_type = 'gift_purple_l';
        }
        else if(checkValue == 'radio8'){
            gift_type = 'gift_purple_ex_l';
        };

        let required_day = calculator.calculateTime(
            current_lv, 
            target_lv, 
            gift_type, 
            gift_per_day, 
            cafe_touch_per_day, 
            schedule_touch_per_day
        );
        let required_ex = calculator.calculateRequiredEx(
            current_lv,
            target_lv
        );
        console.log(required_day)

        if (required_day >= 0 && required_ex >= 0 && cafe_touch_per_day >= 0 && schedule_touch_per_day >= 0 && gift_per_day >= 0 && Number.isInteger(Number(gift_per_day)) && Number.isInteger(Number(cafe_touch_per_day))) {
            result = `
            ・目標の絆ランク到達には、およそ <b>${required_day}</b> 日が必要です。 <br>
            ・目標の絆ランク到達には、およそ <b>${required_ex}</b> 経験値が必要です。 <br><br>
            カフェRANKは最大値, スケジュールBOUNUSは無しの想定で計算しています。
        `;
        }
        else {
            result = `
                下記の点を確認してください。 <br>
                ・「現在の絆ランク」<=「目標の絆ランク」となっているか <br>
                ・「現在の絆ランク」と「目標の絆ランク」が1~100(半角整数)の値となっているか <br>
                ・「1日に送る贈り物の想定個数」は、0以上(半角整数)の値となっているか <br>
                ・「カフェタッチ回数」は、0以上(半角整数)の値となっているか <br>
                ・「スケジュール訪問回数」は、0以上(半角)となっているか
            `;
        }
    }
    resultDisplay.innerHTML = result;
}


const BOND_EX_TABLE_PATH = './../02_dataset/bond_experience_point.txt';
const GIFT_TYPE_TABLE_PATH = './../02_dataset/gift_type.txt';

class CalculateBond {
    constructor() {
        this.bondTablePath = BOND_EX_TABLE_PATH;
        this.giftTablePath = GIFT_TYPE_TABLE_PATH;
        this.giftNumMax = 9999;
        this.giftNumMin = 0;
        this.bond2exDict = {
            1:[15,0],
            2:[30,15],
            3:[30,45],
            4:[35,75],
            5:[35,110],
            6:[35,145],
            7:[40,180],
            8:[40,220],
            9:[40,260],
            10:[60,300],
            11:[90,360],
            12:[105,450],
            13:[120,555],
            14:[140,675],
            15:[160,815],
            16:[180,975],
            17:[205,1155],
            18:[230,1360],
            19:[255,1590],
            20:[285,1845],
            21:[315,2130],
            22:[345,2445],
            23:[375,2790],
            24:[410,3165],
            25:[445,3575],
            26:[480,4020],
            27:[520,4500],
            28:[560,5020],
            29:[600,5580],
            30:[645,6180],
            31:[690,6825],
            32:[735,7515],
            33:[780,8250],
            34:[830,9030],
            35:[880,9860],
            36:[930,10740],
            37:[985,11670],
            38:[1040,12655],
            39:[1095,13695],
            40:[1155,14790],
            41:[1215,15945],
            42:[1275,17160],
            43:[1335,18435],
            44:[1400,19770],
            45:[1465,21170],
            46:[1530,22635],
            47:[1600,24165],
            48:[1670,25765],
            49:[1740,27435],
            50:[1815,29175],
            51:[1890,30990],
            52:[1965,32880],
            53:[2040,34845],
            54:[2120,36885],
            55:[2200,39005],
            56:[2280,41205],
            57:[2365,43485],
            58:[2450,45850],
            59:[2535,48300],
            60:[2625,50835],
            61:[2715,53460],
            62:[2805,56175],
            63:[2895,58980],
            64:[2990,61875],
            65:[3085,64865],
            66:[3180,67950],
            67:[3280,71130],
            68:[3380,74410],
            69:[3480,77790],
            70:[3585,81270],
            71:[3690,84855],
            72:[3795,88545],
            73:[3900,92340],
            74:[4010,96240],
            75:[4120,100250],
            76:[4230,104370],
            77:[4345,108600],
            78:[4460,112945],
            79:[4575,117405],
            80:[4695,121980],
            81:[4815,126675],
            82:[4935,131490],
            83:[5055,136425],
            84:[5180,141480],
            85:[5305,146660],
            86:[5430,151965],
            87:[5560,157395],
            88:[5690,162955],
            89:[5820,168645],
            90:[5955,174465],
            91:[6090,180420],
            92:[6225,186510],
            93:[6360,192735],
            94:[6500,199095],
            95:[6640,205595],
            96:[6780,212235],
            97:[6925,219015],
            98:[7070,225940],
            99:[7215,233010],
            100:[7365,240225]
        };
        this.giftType2exDict = {
            "cafe_ex":15,
            "schedule_ex":25,
            "gift_orange_s":20,
            "gift_orange_m":40,
            "gift_orange_l":60,
            "gift_orange_ex_l":80,
            "gift_purple_s":60,
            "gift_purple_m":120,
            "gift_purple_l":180,
            "gift_purple_ex_l":240
        };
    }

    printExTable() {
        console.log(this.bond2exDict);
        console.log("ex table num:", Object.keys(this.bond2exDict).length);
    }

    printGiftTypeTable() {
        console.log(this.giftType2exDict);
        console.log("gift type table num:", Object.keys(this.giftType2exDict).length);
    }

    checkLv(currentLv, targetLv) {
        if (!(currentLv in this.bond2exDict) || !(targetLv in this.bond2exDict)) {
            console.log('Specified bond Lv is out of range');
            return false;
        }
        else if (this.bond2exDict[targetLv][1] - this.bond2exDict[currentLv][1] < 0) {
            console.log('Make target_lv more than current_lv.');
            return false;
        }
        else {
            return true;
        }
    }

    checkGiftType(giftType) {
        if (!(giftType in this.giftType2exDict)) {
            console.log('Specified gift type is out of range');
            return false;
        }
        else {
            return true;
        }
    }

    checkDate(diff) {
        if (diff <= 0) {
            console.log('Target date must be later than today');
            return false;
        }
        else {
            return true;
        }
    }

    calculateRequiredEx(currentLv, targetLv) {
        if (this.checkLv(currentLv, targetLv)){
            return this.bond2exDict[targetLv][1] - this.bond2exDict[currentLv][1];
        }
        return -1;
    }

    calculateGift2Ex(
        gift_o_s_num,
        gift_o_m_num,
        gift_o_l_num,
        gift_o_ex_num,
        gift_p_s_num,
        gift_p_m_num,
        gift_p_l_num,
        gift_p_ex_num,
        cafe_touch_per_day,
        schedule_touch_per_day,
        number_of_day
    ) {
        if (
            Number.isInteger(gift_o_s_num) != true ||
            Number.isInteger(gift_o_m_num) != true ||
            Number.isInteger(gift_o_l_num) != true ||
            Number.isInteger(gift_o_ex_num) != true||
            Number.isInteger(gift_p_s_num) != true ||
            Number.isInteger(gift_p_m_num) != true ||
            Number.isInteger(gift_p_l_num) != true ||
            Number.isInteger(gift_p_ex_num) != true||
            Number.isInteger(cafe_touch_per_day) != true ||
            // Number.isInteger(schedule_touch_per_day) != true ||
            Number.isInteger(number_of_day) != true
        ){ return -1}
        else if (
            gift_o_s_num < this.giftNumMin ||
            gift_o_m_num < this.giftNumMin ||
            gift_o_l_num < this.giftNumMin ||
            gift_o_ex_num < this.giftNumMin||
            gift_p_s_num < this.giftNumMin ||
            gift_p_m_num < this.giftNumMin ||
            gift_p_l_num < this.giftNumMin ||
            gift_p_ex_num < this.giftNumMin||
            cafe_touch_per_day < 0 ||
            schedule_touch_per_day < 0 ||
            number_of_day < 0
        ){ return -1}
        else if (
            gift_o_s_num > this.giftNumMax ||
            gift_o_m_num > this.giftNumMax ||
            gift_o_l_num > this.giftNumMax ||
            gift_o_ex_num > this.giftNumMax||
            gift_p_s_num > this.giftNumMax ||
            gift_p_m_num > this.giftNumMax ||
            gift_p_l_num > this.giftNumMax ||
            gift_p_ex_num > this.giftNumMax
        ){ return -1}

        let ex =
                gift_o_s_num * this.giftType2exDict["gift_orange_s"] + 
                gift_o_m_num * this.giftType2exDict["gift_orange_m"] + 
                gift_o_l_num * this.giftType2exDict["gift_orange_l"] + 
                gift_o_ex_num * this.giftType2exDict["gift_orange_ex_l"] + 
                gift_p_s_num * this.giftType2exDict["gift_purple_s"] + 
                gift_p_m_num * this.giftType2exDict["gift_purple_m"] + 
                gift_p_l_num * this.giftType2exDict["gift_purple_l"] + 
                gift_p_ex_num * this.giftType2exDict["gift_purple_ex_l"] + 
                cafe_touch_per_day * this.giftType2exDict["cafe_ex"] * number_of_day +
                schedule_touch_per_day * this.giftType2exDict["schedule_ex"] * number_of_day
                

        return ex
    }

    calculateEx2Lv(ex) {
        let diff = [];
        let idx = 0;

        if (ex < 0) {
            return -1;
        }
        for (var i = 0; i < Object.keys(this.bond2exDict).length; i++) {
            diff[i] = Math.abs((this.bond2exDict[i+1][1] - ex));
            idx = (diff[idx] <= diff[i]) ? idx : i;
        }

        if (this.bond2exDict[idx+1][1] > ex) {
            return idx;
        }

        return idx+1;
    }

    getCurrentEx(current_lv) {
        if (!(current_lv in this.bond2exDict)) {
            return -1;
        }
        else {
            return this.bond2exDict[current_lv][1];
        }
    }

    calculateGiftNum(
        currentLv, 
        targetLv, 
        giftType, 
        cafe_touch_per_day, 
        schedule_touch_per_day,
        date_diff
    ) {
        if (this.checkLv(currentLv, targetLv) && this.checkGiftType(giftType) && date_diff != -1 && cafe_touch_per_day >= 0 && schedule_touch_per_day >= 0) {
            let requiredEx = this.calculateRequiredEx(currentLv, targetLv);
            requiredEx = requiredEx - (this.giftType2exDict["cafe_ex"] * cafe_touch_per_day * date_diff + this.giftType2exDict["schedule_ex"] * schedule_touch_per_day * date_diff);
            const requiredGiftNum = requiredEx / this.giftType2exDict[giftType];
            return Math.ceil(requiredGiftNum);
        } else {
            return -1;
        }
    }

    calculateTime(currentLv, targetLv, giftType, giftPerDay, cafeTouchPerDay, scheduleTouchPerDay) {
        if (this.checkLv(currentLv, targetLv) && this.checkGiftType(giftType)) {
            const requiredEx = this.calculateRequiredEx(currentLv, targetLv);
            const requiredDay = requiredEx / (
                (this.giftType2exDict[giftType] * giftPerDay) +
                (this.giftType2exDict["cafe_ex"] * cafeTouchPerDay) +
                (this.giftType2exDict["schedule_ex"] * scheduleTouchPerDay)
            );
            return Math.ceil(requiredDay);
        } else {
            return -1;
        }
    }

    calculateDiffDate(current_day, target_day) {
        var startDate = new Date(current_day);
        var endDate = new Date(target_day);
        let diff = Math.floor((endDate - startDate + 86400000)/86400000);
        if (this.checkDate(diff)) {
            return diff;
        }
        return -1;
    }
}

const calculator = new CalculateBond();
