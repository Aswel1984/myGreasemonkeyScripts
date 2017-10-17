// ==UserScript==
// @name        计算舰队返回时间
// @namespace   ZbinScript
// @include     http://u*.cicihappy.com/ogame/floten1.php
// @version     1
// @require   https://code.jquery.com/jquery-3.1.1.min.js
// @grant       all
// ==/UserScript==

//去掉html标签
function removeHtmlTab(tab) {
  return tab.replace(/<[^<>]+?>/g, ''); //删除所有HTML标签
}

//普通字符转换成转意符
function html2Escape(sHtml) {
  return sHtml.replace(/[<>&"]/g, function (c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    }
    [
      c
    ];
  });
}

//转意符换成普通字符
function escape2Html(str) {
  var arrEntities = {
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'amp': '&',
    'quot': '"'
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}

// &nbsp;转成空格
function nbsp2Space(str) {
  var arrEntities = {
    'nbsp': ' '
  };
  return str.replace(/&(nbsp);/gi, function (all, t) {
    return arrEntities[t]
  })
}

//回车转为br标签
function return2Br(str) {
  return str.replace(/\r?\n/g, '<br />');
}

//去除开头结尾换行,并将连续3次以上换行转换成2次换行
function trimBr(str) {
  str = str.replace(/((\s|&nbsp;)*\r?\n){3,}/g, '\r\n\r\n'); //限制最多2次换行
  str = str.replace(/^((\s|&nbsp;)*\r?\n)+/g, ''); //清除开头换行
  str = str.replace(/((\s|&nbsp;)*\r?\n)+$/g, ''); //清除结尾换行
  return str;
}

// 将多个连续空格合并成一个空格
function mergeSpace(str) {
  str = str.replace(/(\s|&nbsp;)+/g, ' ');
  return str;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    'M+': this.getMonth() + 1, //月份 
    'd+': this.getDate(), //日 
    'h+': this.getHours(), //小时 
    'm+': this.getMinutes(), //分 
    's+': this.getSeconds(), //秒 
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度 
    'S': this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])  : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
$(function () {
  function getDatereturn()
  {
    var reg = /^((\d+)天)?((\d+)小时)?((\d+)分)?((\d+)秒)?$/gi;
    var result = reg.exec($('#duration').html());
    var dd = 0,
    hh = 0,
    mm = 0,
    ss = 0;
    $.each(result, function (k, v) {
      if (typeof (v) != 'undefined')
      {
        if (k == 2) dd = parseInt(v);
        if (k == 4) hh = parseInt(v);
        if (k == 6) mm = parseInt(v);
        if (k == 8) ss = parseInt(v);
      }
    });
    var dateheure = new Date(nbsp2Space($('#dateheure').html()));
    var dateReturn = new Date((dateheure / 1000 + 86400 * dd + 3600 * hh + 60 * mm + ss) * 1000);
    return dateReturn.Format('yyyy-MM-dd hh:mm:ss');
  }
  
  var str = '<tr height="20"><th>返回时间(探险不含停留时间)</th><th><div><font style="color: lime;" id="dateReturn"></font></div></th></tr>';
  
  $('#dateheure').closest("tr").after(str);
  setInterval(function(){
    $("#dateReturn").html(getDatereturn());
  },1000);
});
