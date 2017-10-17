// ==UserScript==
// @name        youku_时间颜色
// @namespace   ZbinScript
// @include     http://*.youku.com*
// =====@resource       jQueryUICSS          https://raw.githubusercontent.com/Aswel1984/youku/master/myyouky.css
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @grant             GM_addStyle
// @grant       all
// @version     1
// ==/UserScript==

// 优酷视频根据不同时长显示不同颜色
// 解决 GM_addStyle 的一些兼容问题
if (!function testAddStyle() {
  try {
    var style = GM_addStyle(':root{}');
    if (!style) return false;
    if (style.parentNode) style.parentNode.removeChild(style);
    return true;
  } catch (e) {
    return false;
  }
}()) GM_addStyle = (function () {
  var addStyleQueue = [];
  (function addStyles() {
    if (!document.head) return setTimeout(addStyles, 16);
    addStyleQueue.splice(0).forEach(function (style) {
      document.head.appendChild(style);
    });
    addStyleQueue = null;
  }());
  return function (str) {
    var style = document.createElement('style');
    style.textContent = str;
    if (addStyleQueue) addStyleQueue.push(style);
    else document.head.appendChild(style);
    return style;
  };
}());

$(function() {
	GM_addStyle('.less5minutes{background-color:green;color:white;}');
	GM_addStyle('.less10minutes{background-color:red;color:white;}');
	GM_addStyle('.less30minutes{background-color:orange;color:white;}');
	GM_addStyle('.greater30minutes{background-color:magenta;color:white;}');
	function mysetcolor()
	{
		$(".subscribe-square-pc__content--wrap").find('.subscribe-square-pc__card__cover-tag--duration:not(.less5minutes):not(.less10minutes):not(.less30minutes):not(.greater30minutes)').each(function() {
			var reg=/^((\d+):(\d+):(\d+))|((\d+):(\d+))$/gi;
			var t = $(this).html();
			
			var result = reg.exec(t);
			var hh=0, mm=0,ss=0;
			$.each(result, function(k,v){
				if(t[k] != "undefined")
					{
						if(k == 2)hh = parseInt(v);
						if(k == 3)mm = parseInt(v);
						if(k == 4)ss = parseInt(v);
						if(k == 6)mm = parseInt(v);
						if(k == 7)ss = parseInt(v);
					}
			});
			
			var totalsecond = mm*60 + ss;
			if(totalsecond < 5*60)
				{
					//$(this).css('background-color','green');
					//$(this).css("color", "white");
					//alert("less5minutes");
					$(this).toggleClass("less5minutes");
				}
			else if(totalsecond < 10 * 60)
				{
					//$(this).css('background-color','red');
					//$(this).css("color", "white");
					$(this).toggleClass("less10minutes");
				}
			else if(totalsecond < 30 * 60)
				{
					//$(this).css('background-color','orange');
					//$(this).css("color", "white");
					$(this).toggleClass("less30minutes");
				}
			else
				{
					//$(this).css('background-color','magenta');
					//$(this).css("color", "white");
					$(this).toggleClass("greater30minutes");
				}

		});
	}
	
	$(window).on("load", function(){
		mysetcolor();
  });

	$(window).on("scroll", function(){
		mysetcolor();
  });

});
