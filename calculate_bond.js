function updateResult() {
    const current_lv = document.getElementById('input1').value;
    const target_lv = document.getElementById('input2').value;
    const gift_type = document.getElementById('input3').value;
    const gift_per_month = document.getElementById('input4').value;
    const cafe_touch_per_day = document.getElementById('input5').value;
    const schedule_touch_per_day = document.getElementById('input6').value;

    let required_ex = calculator.calculateRequiredEx(
        current_lv,
        target_lv
    );
    let required_day = calculator.calculateTime(
        current_lv, 
        target_lv, 
        gift_type, 
        gift_per_month, 
        cafe_touch_per_day, 
        schedule_touch_per_day
    );
    console.log(required_day)

    let result = '';
    if (required_day >= 0) {
        result = `
            ・目標の絆ランク到達には、およそ <b>${required_day}</b> 日が必要です。 <br>
            ・目標の絆ランク到達には、およそ <b>${required_ex}</b> 経験値が必要です。 <br><br>
            1ヶ月=30日, カフェRANKは最大値, スケジュールBOUNUSはなし 想定で計算しています。<br>間違えていたらすみません。
        `;
    }
    else {
        result = `
            下記の点を確認してください。 <br>
            ・「現在の絆ランク」<=「目標の絆ランク」となっているか <br>
            ・「現在の絆ランク」と「目標の絆ランク」が1~100の値となっているか <br>
            ・「贈り物の種類」が指定の文字列となっているか <br>
        `;
    }

    document.getElementById('result-display').innerHTML = result;
}

const BOND_EX_TABLE_PATH = './../02_dataset/bond_experience_point.txt';
const GIFT_TYPE_TABLE_PATH = './../02_dataset/gift_type.txt';

class CalculateBond {
    constructor() {
        this.bondTablePath = BOND_EX_TABLE_PATH;
        this.giftTablePath = GIFT_TYPE_TABLE_PATH;
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

    checkSum(currentLv, targetLv, giftType) {
        if (!(currentLv in this.bond2exDict) || !(targetLv in this.bond2exDict)) {
            console.log('Specified bond Lv is out of range');
            return false;
        } else if (!(giftType in this.giftType2exDict)) {
            console.log('Specified gift type is out of range');
            return false;
        } else if (this.bond2exDict[targetLv][1] - this.bond2exDict[currentLv][1] < 0) {
            console.log('Make target_lv more than current_lv.');
            return false;
        } else {
            return true;
        }
    }

    calculateRequiredEx(currentLv, targetLv) {
        return this.bond2exDict[targetLv][1] - this.bond2exDict[currentLv][1];
    }

    calculateGiftNum(currentLv, targetLv, giftType) {
        if (this.checkSum(currentLv, targetLv, giftType)) {
            const requiredEx = this.calculateRequiredEx(currentLv, targetLv);
            const requiredGiftNum = requiredEx / this.giftType2exDict[giftType];
            return Math.ceil(requiredGiftNum);
        } else {
            return -1;
        }
    }

    calculateTime(currentLv, targetLv, giftType, giftPerMonth, cafeTouchPerDay, scheduleTouchPerDay) {
        if (this.checkSum(currentLv, targetLv, giftType)) {
            const requiredEx = this.calculateRequiredEx(currentLv, targetLv);
            const requiredDay = requiredEx / (
                (this.giftType2exDict[giftType] * giftPerMonth / 30) +
                (this.giftType2exDict["cafe_ex"] * cafeTouchPerDay) +
                (this.giftType2exDict["schedule_ex"] * scheduleTouchPerDay)
            );
            return Math.ceil(requiredDay);
        } else {
            return -1;
        }
    }
}

const calculator = new CalculateBond();
