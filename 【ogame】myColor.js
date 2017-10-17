// ==UserScript==
// @name        Ogame_MoonColor
// @namespace   http://u1.cicihappy.com/ogame*
// @include     http://u1.cicihappy.com/ogame/*
// @version     1
// @require http://code.jquery.com/jquery-1.10.2.min.js
// @grant       none
// ==/UserScript==

//ogame页游下拉菜单月球颜色
var myselect = $("select[onchange^='eval(']");
$("option",myselect).each(function(index,domEle){
  var tmpstr = $(this).text();
  var res11 = tmpstr.match(/月球/gi);
  if ( res11 !=null){
      $(this).css("color", "#00FFFF");
    } 
});

//星级财团资源转运下拉菜单月球颜色
myselect = $("select[name^='transto']");
$("option",myselect).each(function(index,domEle){
  var tmpstr = $(this).text();
  var res11 = tmpstr.match(/月球/gi);
  if ( res11 !=null){
      $(this).css("color", "#00FFFF");
    } 
});

//选中项加亮加粗
$("select[onchange^='eval('] option:selected").css({"color":"#FFFF00",
                                                    "font-weight":"bold",
                                                   });
//舰队目的地如果是月球颜色加亮
$("a[href^='javascript:setTarget']").each(function(index,domEle){
  var tmpstr = $(this).html();
  var res11 = tmpstr.match(/月球/gi);
  if ( res11 !=null){
      $(this).css("color", "#00FFFF");
    } 
});
