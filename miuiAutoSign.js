// ==UserScript==
// @name        miuiAutoSign
// @namespace   ZbinScript
// @include     http://www.miui.com/index.html
// @version     1
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @grant       all
// ==/UserScript==

//miui论坛自动签到
$(function(){
  if($(".pf_signed").length == 0) {
//     //元素存在时执行的代码
    $.get("extra.php?mod=sign/index&op=sign");
    setTimeout(function(){
     location.reload();
    },5000);
  }
})
