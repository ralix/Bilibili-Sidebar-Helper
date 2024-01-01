// ==UserScript==
// @name         Bilibili Sidebar Helper
// @namespace    https://github.com/ralix/Bilibili-Sidebar-Helper/
// @version      1.0
// @description  B站侧边栏加强（显示推荐视频的发布时间等）
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==


//v1.1.0
//默认开启日期显示
//点击展开按钮同样可执行更新
//只显示日期，去掉了具体时分
//添加date和rank按钮固定在右侧
//date按钮显示日期，rank按钮更新排序
//1.0.0
//侧边栏显示date功能完成

(function() {
  'use strict';


let info = document.querySelectorAll('.info')

showDateBtn()
showRankBtn()
//showOrderBtn()

//展开按钮
let expandBtn = document.querySelector('.rec-footer')
expandBtn.addEventListener("click", function(){
  setTimeout(
    dateUpdate,
    500
  )
});

//hover


window.onload=function(){
     setTimeout(dateUpdate,3000)
}

function showDateBtn(){
  let dateBtn = document.createElement("button");
  dateBtn.innerText="Date";
  dateBtn.style.width='32px';
  dateBtn.style.position='fixed';
  dateBtn.style.top='350px';
  dateBtn.style.right='0px';
  dateBtn.style.zIndex='9999';
  document.body.appendChild(dateBtn);
  dateBtn.addEventListener("click", dateUpdate);
  
}

function showRankBtn(){
  let rankBtn = document.createElement("button");
  rankBtn.innerText="Rank";
  rankBtn.style.width='32px';
  rankBtn.style.position='fixed';
  rankBtn.style.top='370px';
  rankBtn.style.right='0px';
  rankBtn.style.zIndex='9999';
  document.body.appendChild(rankBtn);
  rankBtn.addEventListener("click", rankUpdate);
  
}

// function showOrderBtn(){

//   let orderBtn = document.createElement("select");
//   orderBtn.id="orderBtn";
  
//   const option1 = document.createElement("option");
//   option1.value = "default";
//   option1.text = "默认";
//   orderBtn.appendChild(option1);
  
//   const option2 = document.createElement("option");
//   option2.value = "playnum";
//   option2.text = "播放量";
//   orderBtn.appendChild(option2);
  
//   const option3 = document.createElement("option");
//   option3.value = "comment";
//   option3.text = "评论数";
//   orderBtn.appendChild(option3);
  
//   const option4 = document.createElement("option");
//   option4.value = "date";
//   option4.text = "日期";
//   orderBtn.appendChild(option4);
  
//   orderBtn.style.position='fixed';
//   orderBtn.style.top='40%';
//   orderBtn.style.right='5px';
//   orderBtn.style.zIndex='9999';
//   document.body.appendChild(orderBtn);
//   orderBtn.addEventListener("change", orderUpdate);
// }

// function orderUpdate(){
//   const selectedValue = this.value;
//     // 根据选择的值执行不同的操作
//     if (selectedValue === "playnum") {
//       orderByPlaynum();
//       console.log("playnum")

//     } else if (selectedValue === "comment") {

//     } else if (selectedValue === "date") {

//     } else {
    
//     }
// }

// function orderByPlaynum(){
//   const elements = document.querySelectorAll(".video-page-card-small");
//   const elementsArray = Array.from(elements);
//   elementsArray.sort((a, b) => {
//     // 自定义排序逻辑，例如根据元素的某个属性进行排序
//     // 返回负值表示 a 应该在 b 之前，返回正值表示 a 应该在 b 之后，返回 0 表示顺序相同
//     // 这里可以根据你的具体需求来编写排序逻辑
//     let atext = a.querySelector('.playinfo').textContent;
//     let btext = b.querySelector('.playinfo').textContent;

//     atext = atext.split('\n')[1]
//     let anum = 0
//     if (atext.includes('万')){
//       atext = atext.replace('万','')
//       anum = +atext * 10000
//     }
//     else{
//       anum = +atext
      
//     }

//     btext = btext.split('\n')[1]
//     let bnum = 0
//     if (btext.includes('万')){
//       btext = btext.replace('万','')
//       bnum = +btext * 10000
//     }
//     else{
//       bnum = +btext
      
//     }
//     console.log(anum)
//     console.log(bnum)
//     return bnum-anum
//   });
//   const container = document.querySelector(".rec-list");
//   container.innerHTML = "";
//   elementsArray.forEach((element) => {
//     container.appendChild(element);
//   });
// }

function rankUpdate(){

  const elements = document.querySelectorAll(".video-page-card-small");
  const elementsArray = Array.from(elements);
  elementsArray.sort((a, b) => {
    // 自定义排序逻辑，例如根据元素的某个属性进行排序
    // 返回负值表示 a 应该在 b 之前，返回正值表示 a 应该在 b 之后，返回 0 表示顺序相同
    // 这里可以根据你的具体需求来编写排序逻辑
    let atext='',btext='';

    try{
      atext = a.querySelector('.sideItemDate').textContent;
      btext = b.querySelector('.sideItemDate').textContent;
    }
    catch{
      atext = '1970-01-01'
      btext = '1970-01-01'
    }
    atext = +atext.replaceAll('-','')
    btext = +btext.replaceAll('-','')

    // console.log(atext)
    // console.log(btext)
    return btext-atext
  });
  const container = document.querySelector(".rec-list");
  container.innerHTML = "";
  elementsArray.forEach((element) => {
    container.appendChild(element);
  });

}

function dateUpdate(){

  info = document.querySelectorAll('.info')

  //如果之前有，先去掉。
  const elements = document.querySelectorAll(".sideItemDate");
  if (elements.length>0){
    elements.forEach(element => element.remove());
  }

  for (let i = 0; i < info.length; i++) {

    if (info[i].firstChild.nodeName !== 'A'){
        continue;
    }

    let url = info[i].firstChild.href

    if (!url.includes('bilibili.com/video')){
      continue;
    }
    else{
      getDate(url)
      .then(dateStr =>{
        createDom(dateStr,i)
      })
      .catch(error => {
        console.log('处理错误:', error);
      });
    }
  }

}

function createDom(dateStr,i){
  

  let div=document.createElement("div");
  div.className='sideItemDate';
  //div.style.backgroundColor='beige';
  div.style.backgroundImage='linear-gradient(to right, #fff, beige)';
  div.style.textAlign='center';
  div.style.fontSize='13px';
  div.style.color='grey';

  div.innerText=dateStr;
  info[i].appendChild(div);
}

function getDate(url){

  let dateStr='';

  return fetch(url)
  .then(response => {
    return response.text();
  })
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    // 现在你可以通过 doc 操作 DOM 树了
    dateStr = doc.querySelector('.pubdate-text').textContent;
    dateStr = dateStr.trim().split(' ')[0]
    return dateStr;
  })
  .catch(error => {
    console.log('发生错误:', error);
    throw error; // 抛出错误
  });

}

})();
