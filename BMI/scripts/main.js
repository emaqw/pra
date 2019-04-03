//指定dom
var btn = document.querySelector('.result-btn');
var content = document.querySelector('.content');
var data = JSON.parse(localStorage.getItem('listData')) || [];

btn.addEventListener('click', addData);
updateList(data);

//加入列表，並同步更新網頁與localStorage
function addData(e) {
    //把預設的動作取消
    e.preventDefault();

    //計算BMI
    var cm = document.querySelector('.input-box_one input').value;
    var kg = document.querySelector('.input-box_two input').value;
    var cmMath = cm / 100;
    var bmi = (kg / (cmMath * cmMath)).toFixed(2);

    //判斷BMI數值後顯示目前狀態
    if (bmi < 18.5) {
        bar = 'cal-one';
        status = '過輕';
        circle = 'color-one_bor';
        text = 'color-one';
        btnImg = 'color-one_bg';
    } else if (18.5 <= bmi && bmi < 24) {
        bar = 'cal-two';
        status = '正常';
        circle = 'color-two_bor';
        text = 'color-two';
        btnImg = 'color-two_bg';
    } else if (24 <= bmi && bmi < 27) {
        bar = 'cal-three';
        status = '過重';
        circle = 'color-three_bor';
        text = 'color-three';
        btnImg = 'color-three_bg';
    } else if (27 <= bmi && bmi < 30) {
        bar = 'cal-four';
        status = '輕度肥胖';
        circle = 'color-four_bor';
        text = 'color-four';
        btnImg = 'color-four_bg';
    } else if (30 <= bmi && bmi < 35) {
        bar = 'cal-four';
        status = '中度肥胖';
        circle = 'color-five_bor';
        text = 'color-five';
        btnImg = 'color-five_bg';
    } else if (bmi >= 35) {
        bar = 'cal-five';
        status = '重度肥胖';
        circle = 'color-five_bor';
        text = 'color-five';
        btnImg = 'color-five_bg';
    }

    //更新按鈕外觀
    btn.remove();
    var str = '<div class="result-show d-flex flex-column justify-content-center ' + circle + '"><span class="level-value ' + text + '">' + bmi + '</span><span class="level-content ' + text + '">BMI</span><span class="level-btn ' + btnImg + ' ' + text + '"><img src="images/icons_loop.png"></img></span></div><div class="level-title ' + text + '">' + status + '</div>';
    document.querySelector('.result').innerHTML = str;

    //組合時間
    var date = new Date();
    var MM = date.getMonth() + 1;
    var DD = date.getDate();
    var YY = date.getFullYear();
    var today = MM + '-' + DD + '-' + YY;

    //組成物件 - 需存進 localStorage 的資料
    var resultList = {
        bar: bar,
        status: status,
        bmi: bmi,
        weight: kg,
        height: cm,
        today: today
    };

    //放進data的[]
    data.push(resultList);
    //更新網頁內容
    updateList(data);
    //存進localStorage並轉型
    localStorage.setItem('listData', JSON.stringify(data));
    //更新按鈕
    document.querySelector('.result-show').addEventListener('click', addData);
}

//更新網頁內容
function updateList(items) {
    var str = '';
    var len = items.length;
    for (var i = len - 1; i >= 0; i--) {
        str += '<div class="d-flex justify-content-center mb-3"><div class="cal-board d-flex justify-content-between"><div class="icon-cross" data-index=' + i + '></div><div class ="' + items[i].bar + '"></div><div class="w-20 pl-4"><span class="cal-bmi_set">' + items[i].status + '</span></div><div class="w-20"><span class="cal-bmi pr-2">BMI</span><span class="cal-bmi_set">' + items[i].bmi + '</span></div><div class="w-20"><span class="cal-bmi pr-2">weight</span><span class="cal-bmi_set">' + items[i].weight + '</span></div><div class="w-20"><span class="cal-bmi pr-2">height</span><span class="cal-bmi_set">' + items[i].height + '</span></div><div class="w-20 text-right pr-4"><span class="cal-bmi_date">' + items[i].today + '</span></div></div></div>';
    }
    content.innerHTML = str;
}

//刪除紀錄
function deleteList(e) {
    e.preventDefault();
    if (e.target.className !== 'icon-cross') {
        return;
    };
    var index = e.target.dataset.index;
    data.splice(index, 1);
    updateList(data);
    localStorage.setItem('listData', JSON.stringify(data));
}
content.addEventListener('click', deleteList);
//# sourceMappingURL=main.js.map
