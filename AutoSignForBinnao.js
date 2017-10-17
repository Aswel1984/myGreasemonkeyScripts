// ==UserScript==
// @name        缤闹签到
// @namespace   https://bbs.mumayi.com/*
// @include     http://www.binnao.com/*
// @version     1
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @grant       all
// ==/UserScript==


//缤闹每日自动签到,也可稍作修改用于木蚂蚁论坛自动签到
//1.根据服务器时间设置倒计时
//2.登陆后当天若没有签到则立即自动签到

$(function(){
//获取服务器时间
var t = new Date($.ajax({
  async: false
}).getResponseHeader('Date'));
var bombay = t.getTime(); // + 3600*8000;
var today = new Date(bombay);

formhash = $('input[name^="formhash"]').val();
nextday = new Date((today / 1000 + 86400) * 1000);
nextday0 = new Date(nextday.getFullYear(), nextday.getMonth(), nextday.getDate());
todayleft = nextday0 - today;
var count = 0;
count_Stop = 60;
timeID = 0;
var myPoem = new Array('工欲善其事，必先利其器。', 
                       '海纳百川，有容乃大；壁立千仞，无欲则刚。', 
                       '君子坦荡荡，小人长戚戚。', 
                       '老骥伏枥，志在千里。烈士暮年，壮心不已。', 
                       '路漫漫其修远今，吾将上下而求索。', 
                       '木秀于林，风必摧之。——《旧唐书》', 
                       '尺有所短，寸有所长。——《史记》', 
                       '桃李不言，下自成蹊。——《史记》', 
                       '失之东隅，收之桑榆。——《史记》', 
                       '宁为玉碎，不为瓦全。——《北齐书》', 
                       '千羊之皮，不如一狐之腋。——《史记》', 
                       '运筹帷幄之中，决胜千里之外。——《史记》', 
                       '风萧萧兮易水寒，壮士一去兮不复还。——《史记》', 
                       '不飞则已，一飞冲天；不鸣则已，一鸣惊人。——《史记》', 
                       '前车之覆，后车之鉴。——《汉书》', '失之毫厘，谬以千里。——《汉书》', 
                       '临渊羡鱼，不如退而结网。——《汉书》', 
                       '水至清则无鱼，人至察则无徒。——《汉书》', 
                       '不可同日而语。——《汉书》', 
                       '百闻不如一见。——《汉书》', 
                       '精诚所至，金石为开。——《后汉书》', 
                       '举大事者，不忌小怨。——《后汉书》', 
                       '当局者迷，旁观者清。——《旧唐书》', 
                       '树欲静而风不止，子欲养而亲不待也。——汉·韩婴', 
                       '长风破浪会有时，直挂云帆济沧海。——李白', 
                       '察己则可以知人，察今则可以知古。——《吕氏春秋》', 
                       '发奋忘食，乐以忘优，不知老之将至。——《论语》', 
                       '沉舟侧畔千帆过，病树前头万木春。——刘禹锡', 
                       '读万卷书，行万里路。——刘彝', 
                       '非学无以广才，非志无以成学。——诸葛亮', 
                       '富贵不能淫，贫贱不能移，威武不能屈。——孟子', 
                       '海内存知己，天涯若比邻。——王勃', 
                       '会当凌绝顶，一览众山小。——杜甫', 
                       '己所不欲，勿施于人。——《论语》', 
                       '金玉其外，败絮其中。——刘基', 
                       '近水楼台先得月，向阳花木易为春。——苏麟', 
                       '三军可夺帅也，匹夫不可夺志也。——论语', 
                       '穷则变，变则通。——《易经》', 
                       '不畏浮云遮望眼，自缘身在最高层。——王安石', 
                       '不登高山，不知天之高也；不临深溪，不知地之厚也。——《荀子》', 
                       '落红不是无情物，化作春泥更护花。——龚自珍', 
                       '满招损，谦受益。——《尚书》', 
                       '人固有一死，或重于泰山，或轻于鸿毛。——司马迁', 
                       '人谁无过，过而能改，善莫大焉。——《左传》', 
                       '敏而好学，不耻下问。——孔子', 
                       '清水出芙蓉，天然去雕饰。——李白', 
                       '百学须先立志。——朱熹');

var myno = Math.floor(Math.random() * myPoem.length) //today.getDate();
if(myno == myPoem.length)myno = myPoem.length - 1

function qiandao()
{
  $.ajax({
    url: 'http://www.binnao.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1&fastreply=0&formhash='+formhash+'&qdmode=1&qdxq=kx',
    type: 'POST', //GET
    async: true, //或false,是否异步
    data: {
      todaysay: myPoem[myno]//'Happy Every Day 哈哈 ！ ！'
    },
    timeout: 5000, //超时时间
    dataType: 'text', //返回的数据格式：json/xml/html/script/jsonp/text
    //     beforeSend:function(xhr){

    //     },
    success: function (data) {

      //clearInterval(timeID);
      //window.location.href=window.location.href;
      if($('img[src="source/plugin/dsu_paulsign/img/qdtb.gif"]').length > 0)
        {
          window.location.href=window.location.href;
        }
    },
    error: function (xhr, textStatus) {

    },
    complete: function () {

    }
  });
  count++;
  if (count >= count_Stop)
  {
    clearInterval(timeID);
    //window.location.href=window.location.href;
  }
} //alert(todayleft);


//todayleft=3000;


setTimeout(function () {
  timeID = setInterval(qiandao, 100);
}, todayleft -3000);

  if($('img[src="source/plugin/dsu_paulsign/img/qdtb.gif"]').length > 0)
  {
    //alert("未签到");
    qiandao();
  }
});
