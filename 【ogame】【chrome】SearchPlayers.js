// ==UserScript==
// @name       MySearch
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://u1.cicihappy.com/ogame/search.php*
// @require http://code.jquery.com/jquery-1.10.2.min.js
// @copyright  2012+, You
// ==/UserScript==

//从星图数据库中按排名搜索玩家名，然后在本搜索页面自动输入玩家名进行搜索，将搜索结果存入积分数据库
var global = (function() { return this || (1,eval)('(this)'); }());
global.index = 0;
myarray=new Array();
//var db;//全局变量
//var db1;//全局变量
//index=0;
var myscore="";
var myplayer="";
var nextmyplayer="";
var sql="";
var scoretable="scores";
var myplanetlist="";
mydate = new Date();
mytime=mydate.getFullYear()+"-"+(mydate.getMonth()+1)+"-"+mydate.getDate()+" "+mydate.getHours()+":"+mydate.getMinutes()+":"+mydate.getSeconds()+"."+mydate.getMilliseconds();
//创建数据库
function createDB(){ 
    //参数：数据库名称，版本号，数据库描述，大小（单位字节），回调函数 
    global.db=openDatabase('MyGalaxy11Score','1.0','MyGalaxy11Score',2000*1024*1024,function(){
        $$("result").innerHTML="成功创建数据库";
        $("#commands").val("成功创建数据库");
    });
    db.transaction(
        function(tx){
            //执行创建表语句
            tx.executeSql("create table if not exists startsearch(id int unique not null, iii int not null);");
            tx.executeSql("create table if not exists "+scoretable+"(mytime DateTime, player text, allice text, totalrnk int, totalscr text, "
                          +"fleetrnk int, fleetscr text, buildrnk int,buildsrc text, researchrnk int, researchsrc text, defensernk int, defensesrc text,planetlist text);");
        });
    hhh();
    global.db1=openDatabase('MyGalaxy11','1.0','MyGalaxy11',2000*1024*1024,function(){
        $$("result").innerHTML="成功创建数据库";
        $("#commands").val("成功创建数据库");
    });
    //search();
    setTimeout(search, 500);

}

setTimeout(createDB, 1000);
//createDB();
function ggg(){
    db.transaction(function (tx) {
        tmpstr = 'update startsearch set iii='+ (global.index+1) +' where id=1';
        tx.executeSql(tmpstr, [], null, null);
        //alert("ggg "+(index+1));
    });
}
function fff(){
    db.transaction(function (tx) {
        //tx.executeSql('delete from '+scoretable+' where player="' + myplayer + '";', [], null, null); 
        tx.executeSql(sql, [], null, null);  
    });
}
function searchplanets(){
    db1.transaction(function (tx) {
        tx.executeSql('SELECT position FROM galaxy where player like "'+myplayer+'" or player like "'+myplayer+'(u)" ', [], function (tx, results) {
            var len = results.rows.length;
            var i=0;
            var tmpstr="";
            var rnk="",scr="";
            //alert("planet:" + myplayer);
            var list="";
            for(i=0;i<len;i++){
                //myplanetlist+=results.rows.item(i).position;
                list+=results.rows.item(i).position;
            }
            //alert(list);
            sql+='", "'+list + '");';
            //alert(sql);
            fff();
            //myplayer = results.rows.item(global.index).player;

            
        }, null);
        
        //tx.executeSql('delete from '+scoretable+' where player="' + myplayer + '";', [], null, null); 
        //tx.executeSql(sql, [], null, null);  
    });
}
function hhh(){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM startsearch where id=1', [], function (tx, results) {
            var len = results.rows.length;
            if (len <1)
            {
                tx.executeSql("insert into startsearch values(1,0)");
                //alert("if"+index);
            }
            else
            {
                global.index = results.rows.item(0).iii;
                //index++;
                //alert("else"+index);
                //if(index > 1000)return;
            }
            //myarray[0]=index;
            ggg();
        }, null);
    });
}

function search(){

        global.db1.transaction(function (tx) {
                
        tx.executeSql('SELECT * FROM player_rank order by rank', [], function (tx, results) {
            
            var len = results.rows.length;
            var i=0;
            var tmpstr="";
            var rnk="",scr="";
            //alert("db1   "+myarray[0]);
            if(global.index>0)myplayer = results.rows.item(global.index-1).player;
            nextmyplayer = results.rows.item(global.index).player;

            $res=$('form[action="search.php"] ~ table > tbody > tr');
            //alert("search:" + $res.html());
            if($res.length>0){
                $pos = $("th",$res.eq(1));
                sql = 'insert into '+scoretable+' values('+ '(select datetime("now","+8 hour"))'+',"' + $pos.eq(0).text() + '","' + $pos.eq(2).text() + '",';
                tmpstr = $pos.eq(3).text();//总分及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(4).text();//舰队及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(5).text();//建筑及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(6).text();//研究及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(7).text();//防御及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr ;
                
                //alert("search:"+myplayer);
                setTimeout(searchplanets,1000);
                
                //alert(sql);
                //fff();
            }
            $("input[name='searchtext']").val(nextmyplayer);
            setTimeout(function(){
                $("input[value='搜索']").click();
            }, 1000);
        }, null);
    });
}
$pos=$("body");
$elem=$('<input type="button" id="btn_spy" value="重置起始位置" style="color:#00ff00;" />');
//输入坐标直接探测
$elem.bind('click', function(){
    db.transaction(function (tx) {
        tx.executeSql('update startsearch set iii=0 where id=1', [], null, null); 
    });
});
$pos.append($elem);
