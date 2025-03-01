var menuChangeFlag = false;
var selectedTab = "tab1";
var giftCompatibilityList = [];
var giftImgPathList = []

function openTab(evt, tabName) {
    selectedTab = tabName
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
    
    const detail_change_btn = document.getElementById("detail_change_btn");
    const label = document.getElementById("label-detail_change_btn");
    if (tabName == 'tab1') {
        detail_change_btn.style.display = 'block';
        label.style.display = 'block';
    }

    // 日付の取得
    var today = new Date();
    today.setDate(today.getDate());
    var yyyy = today.getFullYear();
    var mm = ("0"+(today.getMonth()+1)).slice(-2);
    var dd = ("0"+today.getDate()).slice(-2);
    document.getElementById("input1-tab2").value=yyyy+'-'+mm+'-'+dd;
    if (mm > "08") {
        yyyy = yyyy + 1;
        document.getElementById("input2-tab2").value=yyyy+'-'+"08"+'-'+"05";
    }
    else if (mm == "08" && dd > "05") {
        yyyy = yyyy + 1;
        document.getElementById("input2-tab2").value=yyyy+'-'+"08"+'-'+"05";
    }
    document.getElementById("input2-tab2").value=yyyy+'-'+"08"+'-'+"05";
}

function changeStudentsList(listNum) {
    const studentNum = document.getElementById("select-student-name" + String(listNum)).value;

    // 現存するテーブルの削除
    var student = "student" + String(listNum);
    var form = document.getElementById(student);
    form.innerHTML = '';

    var result = document.getElementById("available-gift");
    result.innerHTML = '';

    // 新規テーブルの作成
    if (studentNum != "default") {
        const giftCompatibility = giftCompatibilityList[Number(studentNum)].split('\r')[0];
        addGiftImgTable(listNum, giftCompatibility, student)
    }

    // 現存するすべてのテーブルから製造に使ってよい贈り物を算出
    setAvailableGifts()
}

function updateLayout() {
    const width = window.innerWidth; // 現在の画面幅を取得
    const tab = document.querySelector(".tabs");
    const hamburger = document.querySelector("#hamburger-menu");

    if (width <= 768) {
        // tab.display = "none"; // 小さい画面ではメニューを隠す
        // hamburger.display = "block"; // ハンバーガーを表示
        // CSS で対応
    } else {
        tab.display = "flex"; // 大きい画面ではメニューを表示
        hamburger.display = "none"; // ハンバーガーを非表示
        var temp = ".tab[data-tab='" + selectedTab + "']";
        document.querySelector(temp).classList.add("active");
        // var tabcontent = document.getElementsByClassName("tab-content");
        // var temp = tabcontent.namedItem(selectedTab)
    }
}
updateLayout();

function parseGiftCSV(data) {
    giftCompatibilityList = data.split('\n');
    addStudentsList();
}

function parseGiftImgPathCSV(data) {
    var giftPathPairList = data.split('\n');
    for (let i=0; i<giftPathPairList.length; i++) {
        var path = giftPathPairList[i].split(',')[1].split('\r')[0]
        giftImgPathList[i] = path
    }

}

function addStudentsList() {
    const list1 = document.getElementById("select-student-name1");
    const list2 = document.getElementById("select-student-name2");
    const list3 = document.getElementById("select-student-name3");
    const list4 = document.getElementById("select-student-name4");
    const list5 = document.getElementById("select-student-name5");
    const list_tab1 = document.getElementById("select-student-name-tab1");
    
    if (giftCompatibilityList.length > 0) {
        for (let i = 1; i < giftCompatibilityList.length; i++) {
            // 下記の newOptionX を1つにまとめると、最後に add したものだけ有効になる
            const newOption1 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption1.value = String(i);
            newOption1.text = studentName;
            list1.add(newOption1);
            const newOption2 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption2.value = String(i);
            newOption2.text = studentName;
            list2.add(newOption2);
            const newOption3 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption3.value = String(i);
            newOption3.text = studentName;
            list3.add(newOption3);
            const newOption4 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption4.value = String(i);
            newOption4.text = studentName;
            list4.add(newOption4);
            const newOption5 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption5.value = String(i);
            newOption5.text = studentName;
            list5.add(newOption5);
            const newOption_tab1 = document.createElement("option");
            studentName = giftCompatibilityList[i].split(',')[0]
            newOption_tab1.value = String(i);
            newOption_tab1.text = studentName;
            list_tab1.add(newOption_tab1);
        }
    }
}

function addGiftImgTable(listNum, giftCompatibility, student) {

    const tableArea = document.getElementById(student);
    const tableNum = tableArea.querySelectorAll("table").length;

    // ボタンでリストを増やす際の処理
    // if (tableNum < 1) {
    //     var form = document.getElementById(student);
    //     form.innerHTML = '';
    //     form.appendChild(createStudentGiftTable(giftCompatibility));
    // }
    
    // HTML に直で table の記載場所を配置している際の処理
    var form = document.getElementById(student);
    form.appendChild(createStudentGiftTable(giftCompatibility));

}

function createStudentGiftTable(giftCompatibility) {
    var table = document.createElement("table");
    var tr1 = document.createElement("tr");
    var tr2 = document.createElement("tr");
    var tr3 = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    var giftImgLL = document.createElement("img");
    var giftImgL = document.createElement("img");
    var giftImgM = document.createElement("img");
    var giftImgS1 = document.createElement("img");
    var giftImgS2 = document.createElement("img");
    var llGiftList = [];
    var lGiftList = [];
    var mGiftList = [];

    table.setAttribute("class", "student-gift-type-table");
    td1.setAttribute("class", "td_gift_type_img");
    td3.setAttribute("class", "td_gift_type_img");
    td5.setAttribute("class", "td_gift_type_img");
    td2.setAttribute("class", "td_gift_type");
    td4.setAttribute("class", "td_gift_type");
    td6.setAttribute("class", "td_gift_type");

    giftImgLL.setAttribute("src", "./img/gift_type/gift_ll.png");
    giftImgLL.setAttribute("class", "img_gift_type");
    giftImgL.setAttribute("src", "./img/gift_type/gift_l.png");
    giftImgL.setAttribute("class", "img_gift_type");
    giftImgM.setAttribute("src", "./img/gift_type/gift_m.png");
    giftImgM.setAttribute("class", "img_gift_type");

    giftImgS1.setAttribute("src", "./img/gift_type/gift_s.png");
    giftImgS2.setAttribute("src", "./img/gift/wave_cat.png");

    var giftCompatibilityList = giftCompatibility.split(',');
    if (giftCompatibilityList.length != giftImgPathList.length) {
        return table;
    }

    for (let i = 1; i < giftCompatibilityList.length; i++) {
        var giftType = giftCompatibilityList[i];
        var giftPath = giftImgPathList[i];

        var giftImg = document.createElement("img");
        giftImg.setAttribute("src", giftPath);
        giftImg.setAttribute("class", "img_gift");

        if (giftType == 1 || giftType == 5 || giftType == 6) {
            // 贈り物小
        }
        else if (giftType == 2) {
            // 贈り物中　紫贈り物は除く
            mGiftList.push(giftImg);
        }
        else if (giftType == 3 || giftType == 7) {
            // 贈り物大
            lGiftList.push(giftImg);
            
        }
        else if (giftType == 4 || giftType == 8) {
            // 贈り物特大
            llGiftList.push(giftImg);

        }
    }

    // appendChild() で同じオブジェクトを追加すると最後の追加分だけ有効になる
    td1.appendChild(giftImgLL);
    for (let i=0; i<llGiftList.length; i++) {
        td2.appendChild(llGiftList[i]);
    }
    td3.appendChild(giftImgL);
    for (let i=0; i<lGiftList.length; i++) {
        td4.appendChild(lGiftList[i]);
    }
    td5.appendChild(giftImgM);
    for (let i=0; i<mGiftList.length; i++) {
        td6.appendChild(mGiftList[i]);
    }

    tr1.appendChild(td1);
    tr1.appendChild(td2);
    tr2.appendChild(td3);
    tr2.appendChild(td4);
    tr3.appendChild(td5);
    tr3.appendChild(td6);

    table.appendChild(tr1);
    table.appendChild(tr2);
    table.appendChild(tr3);

    return table;
}

function setAvailableGifts() {
    const select1 = document.getElementById("select-student-name1")
    const select2 = document.getElementById("select-student-name2")
    const select3 = document.getElementById("select-student-name3")
    const select4 = document.getElementById("select-student-name4")
    const select5 = document.getElementById("select-student-name5")

    // 選択した要素のテキストを取得する処理
    const select1Num = select1.selectedIndex;
    const student1Name = select1.options[select1Num].innerText;
    const select2Num = select2.selectedIndex;
    const student2Name = select2.options[select2Num].innerText;
    const select3Num = select3.selectedIndex;
    const student3Name = select3.options[select3Num].innerText;
    const select4Num = select4.selectedIndex;
    const student4Name = select4.options[select4Num].innerText;
    const select5Num = select5.selectedIndex;
    const student5Name = select5.options[select5Num].innerText;

    var selecttedStudentGiftList = []
    for (let i=1; i<giftCompatibilityList.length; i++) {
        var tempStudentName = giftCompatibilityList[i].split(',')[0]
        if (tempStudentName == student1Name ||
            tempStudentName == student2Name ||
            tempStudentName == student3Name ||
            tempStudentName == student4Name ||
            tempStudentName == student5Name
        ) {
            selecttedStudentGiftList.push(giftCompatibilityList[i].split('\r')[0].split(','));
        }
    }

    var selecttedStudentNum = selecttedStudentGiftList.length;
    var availableGiftsIdxList = [];
    if (selecttedStudentNum <= 0) {
        return;
    }
    else if (selecttedStudentNum == 1) {
        for (let idx=0; idx<selecttedStudentGiftList[0].length; idx++) {
            if (selecttedStudentGiftList[0][idx] == "1")
                availableGiftsIdxList.push(idx)
        }
    }
    else {
        for (let i=0; i<selecttedStudentGiftList[0].length; i++) {
            const allEqual = selecttedStudentGiftList.every(row => row[i] === "1"); // すべての配列で贈り物小かどうか確認

            if (allEqual) {
                availableGiftsIdxList.push(i);
            }
        }
    }
    setAvailableGiftsImg(availableGiftsIdxList);
}

function setAvailableGiftsImg(availableGiftsIdxList) {
    var form = document.getElementById("available-gift");
    for (let i=0; i<availableGiftsIdxList.length; i++) {
        var giftPath = giftImgPathList[availableGiftsIdxList[i]];

        var giftImg = document.createElement("img");
        giftImg.setAttribute("src", giftPath);
        giftImg.setAttribute("class", "img_gift");

        form.appendChild(giftImg)
    }
}

function changeDetail() {
    var detail_change_btn_condition = document.getElementById('checkbox_detail_change_btn').checked;
    console.log(detail_change_btn_condition);  // checked=true=normal
    var detail_form = document.getElementsByClassName("grid-gift_detail");
    var normal_from = document.getElementsByClassName("grid-gift_normal");
    var normal_detail_from = document.getElementsByClassName("grid-form3");
    var grid_gift_normal_detail_label = document.getElementsByClassName("grid-gift_normal-detail_label");
    var result_button_tab1 = document.getElementsByClassName("result-button-tab1");
    const label_student_name_tab1 = document.getElementById("label-student-name-tab1");
    const selelct_student_name_tab1 = document.getElementById("select-student-name-tab1");
    const input_reset_button = document.getElementById("input_reset-button");
    const resultDisplay = document.getElementById(`result-display-tab1`);

    if (detail_change_btn_condition == true) {
        result_button_tab1[0].style.gridTemplateColumns = "repeat(1, 1fr)";
        label_student_name_tab1.style.display = 'none'
        selelct_student_name_tab1.style.display = 'none'
        input_reset_button.style.display = 'none'
        detail_form[0].style.display = "none";
        grid_gift_normal_detail_label[0].style.display = "grid";
        normal_from[0].style.display = "grid";
        normal_detail_from[0].style.display = "grid";
    }
    else {
        result_button_tab1[0].style.gridTemplateColumns = "repeat(2, 1fr)";
        label_student_name_tab1.style.display = 'block'
        selelct_student_name_tab1.style.display = 'block'
        input_reset_button.style.display = 'block'
        normal_from[0].style.display = "none";
        grid_gift_normal_detail_label[0].style.display = "none";
        detail_form[0].style.display = "grid";
        normal_detail_from[0].style.display = "grid";
        
    }
    resultDisplay.innerHTML = `ここに結果が表示されます。`;
}

function resetGiftNum() {
    for (let i=1; i<giftImgPathList.length; i++) {
        let gift_name = giftImgPathList[i].split('/')[3].split('.')[0];
        document.getElementById('input-detail-' + gift_name).value = 0;
    }
    document.getElementById('input-detail_gift_box').value = 0;
}


// 初期状態で最初のタブを開く
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab").click();
    fetch('blue_archive_gift.csv').then(response => response.text()).then(data => parseGiftCSV(data));
    fetch('blue_archive_gift_img_path.csv').then(response => response.text()).then(data => parseGiftImgPathCSV(data));

    const menuCheckbox = document.getElementById("menu-btn");
    const menu = document.querySelector(".menu");

    document.addEventListener("click", function (event) {
        // CSS でハンバーガーメニューのアニメーションをしている関係で、メニューボタンクリック時に
        // 「メニューボタンクリック」と「メニューボタンとメニューの中身以外のクリック」２種が発生してしまう。
        // menuChangeFlag を利用して、専用の処理をしている

        const checked = menuCheckbox.checked
        const detail_change_btn = document.getElementById("detail_change_btn");
        const label = document.getElementById("label-detail_change_btn");
        if (!menu.contains(event.target) && !menuCheckbox.contains(event.target)) {
            if (checked == true) {
                detail_change_btn.style.display = 'block';
                label.style.display = 'block';
                menuChangeFlag = true
            }
            else {
                menuChangeFlag = false
            }
            menuCheckbox.checked = false;
        }
        else if(!menu.contains(event.target) && menuCheckbox.contains(event.target)) {
            if (menuChangeFlag == true) {
                menuCheckbox.checked = false;
                detail_change_btn.style.display = 'block';
                label.style.display = 'block';
            }
            else {
                detail_change_btn.style.display = 'none';
                label.style.display = 'none';
            }
        }
    });

    menu.querySelectorAll("li").forEach(link => {
        link.addEventListener("click", function () {
            menuCheckbox.checked = false;
        });
    });
});

// 画面サイズが変更されたときに処理を実行
window.addEventListener("resize", updateLayout);


function updateResult(tabId) {

    const resultDisplay = document.getElementById(`result-display-${tabId}`);
    let result = 'init';
    let current_lv = 0;
    let gift_o_s_num = 0;
    let gift_o_m_num = 0;
    let gift_o_l_num = 0;
    let gift_o_ex_num = 0;
    let gift_p_s_num = 0;
    let gift_p_m_num = 0;
    let gift_p_l_num = 0;
    let gift_p_ex_num = 0;
    let cafe_touch_per_day = 0;
    let schedule_touch_per_day = 0;
    let number_of_day = 0;

    if (tabId === 'tab1') {
        var detail_change_btn_condition = document.getElementById('checkbox_detail_change_btn').checked;
        if (detail_change_btn_condition == true) {
            // 通常モード
            current_lv = Number(document.getElementById('input1-tab1').value);
            gift_o_s_num = Number(document.getElementById('input3-tab1').value);
            gift_o_m_num = Number(document.getElementById('input4-tab1').value);
            gift_o_l_num = Number(document.getElementById('input5-tab1').value);
            gift_o_ex_num = Number(document.getElementById('input6-tab1').value);
            gift_p_s_num = Number(document.getElementById('input7-tab1').value);
            gift_p_m_num = Number(document.getElementById('input8-tab1').value);
            gift_p_l_num = Number(document.getElementById('input9-tab1').value);
            gift_p_ex_num = Number(document.getElementById('input10-tab1').value);
            cafe_touch_per_day = Number(document.getElementById('input11-tab1').value);
            schedule_touch_per_day = Number(document.getElementById('input12-tab1').value);
            number_of_day = Number(document.getElementById('input13-tab1').value);
        }
        else {
            // 詳細モード
            current_lv = Number(document.getElementById('input1-tab1').value);
            gift_o_s_num = 0
            gift_o_m_num = 0
            gift_o_l_num = 0
            gift_o_ex_num = 0
            gift_p_s_num = 0
            gift_p_m_num = 0
            gift_p_l_num = 0
            gift_p_ex_num = 0
            cafe_touch_per_day = Number(document.getElementById('input11-tab1').value);
            schedule_touch_per_day = Number(document.getElementById('input12-tab1').value);
            number_of_day = Number(document.getElementById('input13-tab1').value);

            // 選択した生徒ごとの贈り物数を合算する
            const student_num = document.getElementById("select-student-name-tab1").value;
            if (student_num != "default") {
                const personalGiftCompatibility = giftCompatibilityList[Number(student_num)].split('\r')[0].split(',');
                
                for (let i=1; i<giftImgPathList.length; i++) {
                    let gift_name = giftImgPathList[i].split('/')[3].split('.')[0];
                    let gift_input_num = Number(document.getElementById('input-detail-' + gift_name).value);
                    let gift_type_num = Number(personalGiftCompatibility[i]);

                    if (gift_type_num == 1) {
                        gift_o_s_num += gift_input_num;
                    }
                    else if(gift_type_num == 2) {
                        gift_o_m_num += gift_input_num;
                    }
                    else if(gift_type_num == 3) {
                        gift_o_l_num += gift_input_num;
                    }
                    else if(gift_type_num == 4) {
                        gift_o_ex_num += gift_input_num;
                    }
                    else if(gift_type_num == 5) {
                        gift_p_s_num += gift_input_num;
                    }
                    else if(gift_type_num == 6) {
                        gift_p_m_num += gift_input_num;
                    }
                    else if(gift_type_num == 7) {
                        gift_p_l_num += gift_input_num;
                    }
                    else if(gift_type_num == 8) {
                        gift_p_ex_num += gift_input_num;
                    }

                }
                const gift_box_num = Number(document.getElementById('input-detail_gift_box').value);
                gift_o_l_num += gift_box_num;

            }
            else {
                result = `
                    下記の点を確認してください。 <br>
                    ・生徒を選択してください
                `;
                resultDisplay.innerHTML = result;
                return;
            }
        }
        
        // 経験値の計算
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
            &emsp;&emsp;橙小の場合：<b>${Math.ceil(required_o_s_num/diff)}</b>個/日、合計<b>${required_o_s_num}</b>個、
             紫小の場合：<b>${Math.ceil(required_p_s_num/diff)}</b>個/日、合計<b>${required_p_s_num}</b>個<br>
            &emsp;&emsp;橙中の場合：<b>${Math.ceil(required_o_m_num/diff)}</b>個/日、合計<b>${required_o_m_num}</b>個、
             紫中の場合：<b>${Math.ceil(required_p_m_num/diff)}</b>個/日、合計<b>${required_p_m_num}</b>個<br>
            &emsp;&emsp;橙大の場合：<b>${Math.ceil(required_o_l_num/diff)}</b>個/日、合計<b>${required_o_l_num}</b>個、
             紫大の場合：<b>${Math.ceil(required_p_l_num/diff)}</b>個/日、合計<b>${required_p_l_num}</b>個<br>
            &emsp;&emsp;橙特大の場合：<b>${Math.ceil(required_o_ex_num/diff)}</b>個/日、合計<b>${required_o_ex_num}</b>個、
             紫特大の場合：<b>${Math.ceil(required_p_ex_num/diff)}</b>個/日、合計<b>${required_p_ex_num}</b>個<br><br>
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
        let checkValue = document.getElementById('select-gift-type').value;
        
        if (checkValue == 'gift_o_s'){
            gift_type = 'gift_orange_s';
        }
        else if (checkValue == 'gift_o_m'){
            gift_type = 'gift_orange_m';
        }
        else if (checkValue == 'gift_o_l'){
            gift_type = 'gift_orange_l';
        }
        else if (checkValue == 'gift_o_ex'){
            gift_type = 'gift_orange_ex_l';
        }
        else if (checkValue == 'gift_p_s'){
            gift_type = 'gift_purple_s';
        }
        else if (checkValue == 'gift_p_m'){
            gift_type = 'gift_purple_m';
        }
        else if (checkValue == 'gift_p_l'){
            gift_type = 'gift_purple_l';
        }
        else if(checkValue == 'gift_p_ex'){
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
