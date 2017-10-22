// ==UserScript==
// @name       【ogame】MySearch
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://u1.cicihappy.com/ogame/search.php*
// @require http://code.jquery.com/jquery-1.10.2.min.js
// @copyright  2012+, You
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

//从星图数据库中按排名搜索玩家名，然后在本搜索页面自动输入玩家名进行搜索，将搜索结果存入积分数据库
//对积分数据库进行处理，对玩家ID进行分组按最新排名进行排序，为了方便比较，同一玩家即使排名不同也一起出现
var index = 0;
myarray=new Array();
var db;//全局变量
var db1;//全局变量
var myscore="";
var myplayer="";
var nextmyplayer="";
var sql="";
var scoretable="scores";
var myplanetlist="";
var ranksqlarray = new Array();
var count=0;
var v_StartSearchPos;

//alert($("input[name='searchtext']").val());

// 创建数据库
function createDB(){
    // 参数：数据库名称，版本号，数据库描述，大小（单位字节），回调函数
    db=openDatabase('MyGalaxy11Score','1.0','MyGalaxy11Score',2000*1024*1024,function(){
        console.log("成功创建/打开数据库MyGalaxy11Score");
    });
    if (!db) {
        alert("MyGalaxy11Score数据库创建/打开失败！");
        return;
    }
    createTable();

    db1=openDatabase('MyGalaxy11','1.0','MyGalaxy11',2000*1024*1024,function(){
        console.log("成功创建/打开数据库MyGalaxy11");
    });
    if (!db1) {
        alert("MyGalaxy11数据库创建/打开失败！");
        return;
    }
    db1.transaction(
        function(tx){
            // 检查scoretable表是否存在字段player_id,若不存在则添加player_id和homeplanet字段
            tx.executeSql("alter table galaxy add column player_id text;");
        });
}

function createTable(){
    db.transaction(function (tx){
        // 执行创建表语句
        tx.executeSql("create table if not exists "+scoretable+"(mytime DateTime, player text, allice text, totalrnk int, totalscr text, "
                      +"fleetrnk int, fleetscr text, buildrnk int,buildsrc text, researchrnk int, researchsrc text, defensernk int, defensesrc text,planetlist text, player_id text, homeplanet text);");
        tx.executeSql("create table if not exists scores_processed(mytime DateTime, player text, allice text, totalrnk int, totalscr text, "
                      +"fleetrnk int, fleetscr text, buildrnk int,buildsrc text, researchrnk int, researchsrc text, defensernk int, defensesrc text,planetlist text, player_id text, homeplanet text, totalscr_delta text);");
        tx.executeSql("create table if not exists table_rank(rank int unique not null, id int not null, name text,mytime DateTime);");
        // 检查scoretable表是否存在字段player_id,若不存在则添加player_id和homeplanet字段
        tx.executeSql("alter table "+scoretable+" add column player_id text;");
        tx.executeSql("alter table "+scoretable+" add column homeplanet text;");
    });
}

function myExecuteSql(sqlstr){
    db.transaction(function (tx) {
        tx.executeSql(sqlstr, [], null, null);  
    });
}

function searchplanets(player_id, homeplanet){
    db1.transaction(function (tx) {
        tx.executeSql('SELECT position FROM galaxy where player_id = "'+player_id+'";', [], function (tx, results) {
            var len = results.rows.length;
            var i=0;
            var tmpstr="";
            var rnk="",scr="";
            // alert("planet:" + myplayer);
            var list="";
            for(i=0;i<len;i++){
                // myplanetlist+=results.rows.item(i).position;
                list+=results.rows.item(i).position;
            }

            sql+='", "'+list + '","'+player_id+'","['+homeplanet+']");';
            // alert(sql);
            myExecuteSql(sql);
            GM_setValue("StartSearchPos", v_StartSearchPos);
        }, null);
    });
}


function search(){
    v_StartSearchPos = GM_getValue("StartSearchPos", 0);
    v_StartSearchPos++;
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM table_rank order by rank', [], function (tx, results) {
            var len = results.rows.length;
            var i=0;
            var tmpstr="";
            var rnk="",scr="";
            var homeplanet="";
            var player_id="";
            var player_name="";
            // alert("db1 "+myarray[0]);

            if(v_StartSearchPos-1>=0)myplayer = results.rows.item(v_StartSearchPos-1).name;
            if(v_StartSearchPos<len)
            {
                nextmyplayer = results.rows.item(v_StartSearchPos).name;
            }

            if($("input[name='searchtext']").val() === "")
            {
                $("input[name='searchtext']").val(myplayer);
                //alert("根据排名依次搜索用户即将开始！");
                $("input[value='搜索']").click();
                return;
            }

            $res=$('form[action="search.php"] ~ table > tbody > tr');
            // alert("search:" + $res.eq(1).contents());
            if($res.length>0){
                $pos = $("th",$res.eq(1));
                player_name = $pos.eq(0).text();
                // 日期时间， 玩家名称， 联盟名称
                sql = 'insert into '+scoretable+' values('+ '(select datetime("now","+8 hour"))'+',"' + player_name + '","' + $pos.eq(2).text() + '",';

                tmpstr = $pos.eq(3).text();// 总分及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(4).text();// 舰队及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(5).text();// 建筑及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(6).text();// 研究及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr + '",';
                tmpstr = $pos.eq(7).text();// 防御及排名
                scr = tmpstr.match(/[0-9,]+\//gi);
                scr = scr[0].replace(/\//gi,"");
                rnk = tmpstr.match(/\/[0-9,]+/gi);
                rnk = rnk[0].replace(/\//gi,"");
                sql += rnk + ',"' + scr ;

                // alert("search:"+myplayer);
                tmpstr = $res.eq(1).html();
                homeplanet = tmpstr.match(/>\d+:\d+:\d+</gi);
                homeplanet = homeplanet[0].replace(/<|>/gi,"");

                tmpstr = $("a",$pos.eq(1)).eq(0).attr("href");
                player_id = tmpstr.match(/id=\d+/gi);
                player_id = player_id[0].replace(/id=/gi,"");

                // 更新星图中的player_id，新版扫描可删除
                var updateGalaxySql;
                updateGalaxySql = 'update galaxy set player_id='+ player_id +' where player like "'+player_name+'" or player like "'+player_name+'(u)" ';
                updateGalaxy(updateGalaxySql);

                // 更新历史记录中的player_id和homeplanet,全部更新后可注释掉
                myExecuteSql('update scores set player_id='+ player_id +',homeplanet="['+homeplanet+']" where player like "'+player_name+'" or player like "'+player_name+'(u)" ');

                searchplanets(player_id, homeplanet);
            }
            if(v_StartSearchPos>=len)
            {
                alert("已按数据库中排名搜索完毕！");
                return;
            }

            setTimeout(function(){
                $("input[name='searchtext']").val(nextmyplayer);
                $("input[value='搜索']").click();
            },
                       Math.floor(Math.random() * ( 5000 + 1))+4000);
        }, null);
    });
}

function updateGalaxy(updateGalaxySql){
    db1.transaction(function (tx) {
        tx.executeSql(updateGalaxySql, [], null, null);
    });
}

function processScoreTable()
{
    db.transaction(function (tx) {
        tx.executeSql("delete from scores_processed where 1=1");
        tx.executeSql('SELECT player_id FROM scores GROUP BY player_id order by totalrnk, mytime desc;', [], function (tx, results) {
            var len = results.rows.length;
            for(var i=0;i<len;i++){
                queryScoresById(results.rows.item(i).player_id);
            }
            alert("处理完毕！");
        }, null);
    });
}

function queryScoresById(player_id){
    db.transaction(function (tx) {
        tx.executeSql('SELECT * from scores where player_id='+player_id+' order by mytime desc;', [], function (tx, results) {
            var len = results.rows.length;
            var i=0;
            var tmpstr="",sql="";
            var crow,nextrow;
            var deltascr="----";
            var cscr,nextscr;
            for(i=0;i<len;i++){
                crow = results.rows.item(i);
                deltascr="----";
                if(i < len - 1)
                {
                    nextrow = results.rows.item(i+1);
                    if( i==0)
                    {
                        cscr = parseInt(crow.totalscr.replace(/,/gi,""));
                    }
                    nextscr = parseInt(nextrow.totalscr.replace(/,/gi,""));
                    deltascr = cscr - nextscr;
                    cscr = nextscr;
                }
                sql = 'insert into scores_processed values("' + crow.mytime +'","'+crow.player+'","'+crow.allice+'","'+crow.totalrnk+'","'+crow.totalscr+
                    '","'+crow.fleetrnk+'","'+crow.fleetscr+'","'+crow.buildrnk+'","'+crow.buildsrc+'","'+crow.researchrnk+'","'+crow.researchsrc+'","'+crow.defensernk+'","'+crow.defensesrc+
                    '","'+crow.planetlist+'","'+crow.player_id+'","'+crow.homeplanet+'","'+deltascr+'");';
                //alert(sql);
                myExecuteSql(sql);
            }
        }, null);
    });
}

$(function(){
    $("body").append('<div style="color:lime;position:fixed;top:0;left:10">'+
                     '第二步：起始位置≈排名(不含)：<input type="text" id="text_startpos" value="0" style="color:lime;width:50px;" >'+
                     '<input type="button" id="btn_startSearch" value="开始搜索" style="color:lime;" /><br>'+
                     '第一步：前<input type="text" id="text_endrankpos" value="500" style="color:lime;width:50px;">名&nbsp;&nbsp;'+
                     '<input type="button" id="btn_getStat" value="排名更新到数据库" style="color:lime;" /><br>'+
                     '第三步：<input type="button" id="btn_process" value="扫描完成后做排序、计算等处理" style="color:lime;" />'+
                     '</div>');
    $("#text_startpos").val(GM_getValue("StartSearchPos", 0));
    // 点击开始搜索按钮
    $("#btn_startSearch").on('click', function(){
        GM_setValue("StartSearchPos", $("#text_startpos").val());
        createDB();
        if(!(db && db1))return;
        search();

    });

    $("#btn_process").on('click', function(){
        createDB();
        if(!(db && db1))return;
        processScoreTable();
    });

    // 点击排名更新按钮
    var startRange = 1;
    $("#btn_getStat").on('click', function(){
        createDB();
        if(!(db && db1))return;
        var id_setInterval = setInterval(function(){
            $.ajax({
                type: "POST",
                url: "http://u1.cicihappy.com/ogame/stat.php?range=61",
                async:false,
                data: {whochange:0,
                       typechange:0,
                       rangechange:1,
                       who:1,
                       type:1,
                       range:startRange
                      },
                success: function(data){
                    $('table[width="519"] > tbody > tr[id]',data).each(function(index){
                        var row = $(this).children("th");
                        var rank = startRange + index;
                        var player_id = $('a',row.eq(3)).attr("href").replace(/messages.php\?mode=write&id=/gi,"");
                        var player_name = row.eq(2).html().replace(/<[^>]*>/gi,"");
                        ranksqlarray[count++] = 'delete from table_rank where rank=' + rank + ';';
                        ranksqlarray[count++] = 'insert into table_rank values('+rank+',"'+player_id+'","'+player_name+'",(select datetime("now","+8 hour")));';
                        console.log(""+ rank + " id:"+ player_id +": name:"+ player_name);

                        // 更新星图中的player_id，新版扫描可删除
                        var updateGalaxySql;
                        updateGalaxySql = 'update galaxy set player_id='+ player_id +' where player like "'+player_name+'" or player like "'+player_name+'(u)" ';
                        updateGalaxy(updateGalaxySql);

                        // 更新历史记录中的player_id,全部更新后可注释掉
                        myExecuteSql('update scores set player_id='+ player_id +' where player like "'+player_name+'" or player like "'+player_name+'(u)" ');

                    });
                }
            });
            startRange += 30;
            var endPos = parseInt($('#text_endrankpos').val());
            if(startRange > endPos)
            {
                clearInterval(id_setInterval);
                db.transaction(function (tx) {
                    for(k in ranksqlarray)
                    {
                        tx.executeSql(ranksqlarray[k],null,
                                      function (tx, result) {/* alert(result.message);*/},
                                      function (tx, error) { /* alert(error.message);*/});
                    }
                    alert("排名更新完毕");
                });
            }
        }, Math.floor(Math.random() * ( 5000 + 1))+3000);
    });

    if($("input[name='searchtext']").val() != "")
    {
        $("#btn_startSearch").css("color","gray");
        $("#btn_startSearch").attr("disabled","disabled");
        $("#btn_getStat").css("color","gray");
        $("#btn_getStat").attr("disabled","disabled");
        $("#btn_process").css("color","gray");
        $("#btn_process").attr("disabled","disabled");
        createDB();
        if(!(db && db1))return;
        search();
    }
    else
    {
        alert("请设置好起始位置后点击开始搜索,如需更新排名请!");
    }
});
