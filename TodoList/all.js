const cardList = document.querySelector(".card_list");
const txt = document.querySelector(".txt");
const add = document.querySelector(".add");
const cardFooter = document.querySelector(".card_footer")
const cardUndone = document.querySelector(".card_undone");
const deleteAll = document.querySelector(".deleteAll");
const cardTab = document.querySelector(".card_tab");
const cardTabLi = document.querySelectorAll(".card_tab li");

//初始化
let data = [];
function renderData(){
  let str = "";
  //計算待完成項目
  let num = 0;
  data.forEach(function(item,index){
    if(data[index].check){
      str += `<li><label class="checkbox" for=""><input type="checkbox" data-num="${index}" checked="checked"><span>${item.content}</span></label><a href="#" class="delete"></a></li>`;
    }else{
      str += `<li><label class="checkbox" for=""><input type="checkbox" data-num="${index}"><span>${item.content}</span></label><a href="#" class="delete"></a></li>`;
      num ++;
    }
  });
  cardList.innerHTML = str;
  cardUndone.textContent = `${num} 個待完成項目`;
}
renderData()

//新增代辦事項
add.addEventListener("click",function(){
  let obj = {};
  obj.content = txt.value;
  data.push(obj);
  renderData();
  txt.value = "";
  tabsDone();
})

//tabs在已完成時將新增的值隱藏
function tabsDone(){
  data.forEach(function(item,index){
    if(!data[index].check && cardTabLi[2].getAttribute("class","active")){
      document.querySelectorAll(".card_list li")[index].classList.add("hide");
    };
  });
}

//點擊input+刪除代辦事項
cardList.addEventListener("click",function(e){
  let num = e.target.getAttribute("data-num");
  
  if(e.target.getAttribute("type") == ("checkbox") && !e.target.getAttribute("checked")){//點擊 input 新增物件 check
    data[num].check = true;
    renderData();
  }
  if(e.target.getAttribute("checked")){//點擊 input 刪除物件 check
    delete data[num].check;
    renderData();
  }
  if(e.target.getAttribute("class") == ("delete")){//點擊刪除按鈕
    data.splice(num,1);
    renderData();
  }
})

//刪除已完成項目
deleteAll.addEventListener("click",function(){
  data.forEach(function(item,index){
    if (data[index].check) {
      delete data[index];
    }
    renderData();
  });
});

//篩選器
cardTab.addEventListener("click",function(e){
  cardTabLi.forEach(function(item,index){//刪除active
    cardTabLi[index].removeAttribute("class");
  })
  e.target.setAttribute("class","active");//新增active

  let str = "";
  data.forEach(function(item,index){
    if(e.target.getAttribute("data-num") == ("1")){//點擊待完成
      if(!data[index].check){
        str += `<li><label class="checkbox" for=""><input type="checkbox" data-num="${index}"><span>${item.content}</span></label><a href="#" class="delete"></a></li>`;
      };
    };
    if(e.target.getAttribute("data-num") == ("2")){//點擊已完成
      if(data[index].check){
        str += `<li><label class="checkbox" for=""><input type="checkbox" data-num="${index}" checked="checked"><span>${item.content}</span></label><a href="#" class="delete"></a></li>`;
      };
    };
  });
  cardList.innerHTML  = str;

  data.forEach(function(item,index){//點擊全部
    if(e.target.getAttribute("data-num") == ("0")){
      renderData();    
    };
  });
});