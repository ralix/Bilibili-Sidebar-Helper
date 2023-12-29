// ==UserScript==
// @name         Bilibili Sidebar Helper
// @namespace    https://github.com/ralix/Bilibili-Sidebar-Helper/
// @version      1.0
// @description  B站侧边栏加强（显示推荐视频的发布时间等）
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';


let playinfo = document.querySelector('.rec-title')
let info = document.querySelectorAll('.info')

playinfo.addEventListener("click", function(){



for (let i = 0; i < info.length; i++) {

  let url = info[i].children[0].href

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
console.log("clicked")

});



function createDom(dateStr,i){
let div=document.createElement("div");
div.style.backgroundColor='beige';
div.style.textAlign='right';
div.style.fontSize='14px';

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
    return dateStr;
  })
  .catch(error => {
    console.log('发生错误:', error);
    throw error; // 抛出错误
  });

}

})();
