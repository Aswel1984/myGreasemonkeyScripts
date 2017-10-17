// ==UserScript==
// @name       MyAutoGalaxy
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://u11.cicihappy.com/ogame/galaxy.php?mode=*
// @match      http://u1.cicihappy.com/ogame/galaxy.php?mode=*
// @require http://code.jquery.com/jquery-1.10.2.min.js
// @copyright  2012+, You
// ==/UserScript==


//从当前银河系开始自动扫描后续所有银河系的玩家星球坐标，并保存到数据库
//数据库文件位置为C:\Users\XXXX\AppData\Local\Google\Chrome\User Data\Default\databases

//alert($("input[name='galaxy']").val());
//alert($("input[name='system']").val());

var startgalaxy=1;
var startsystem=1;
var nextgalaxy = startgalaxy;
var nextsystem = startsystem;
var table = document.createElement("div");
s = '<table width="100%" border="1" id="mytable"><tr><td>galaxy</td>'
+'<td width="23%">星球</td><td width="6%">银河系</td><td width="6%">太阳系</td>'
+'<td width="5%">位置</td><td width="10%">月球</td><td width="20%">废墟</th>'
+'<td width="15%">玩家</td><td width="15%">联盟</td><td/></tr></table>';
s+='<div id="commands" class="error"></div>'+'<pre id="output">Results will be displayed here</pre>';
table.innerHTML = s;
document.body.appendChild(table);

var db;//全局变量
//创建数据库
function createDB(){ 
    //参数：数据库名称，版本号，数据库描述，大小（单位字节），回调函数 
    db=openDatabase('MyGalaxy11','1.0','MyGalaxy11',2000*1024*1024,function(){
        $$("result").innerHTML="成功创建数据库";
        $("#commands").val("成功创建数据库");
    });
    var sql="create table if not exists galaxy"
    +"(position text unique,planet text, moon text, des_jinshu text, des_jingti text, des_zonghe text, player text, rank int, alliance text)";
    db.transaction(
        function(tx){
            //执行创建表语句
            tx.executeSql(sql);
            tx.executeSql("create table if not exists startpos(id unique Primary Key,galaxy int not null,system int not null);");
            tx.executeSql("create table if not exists player_rank(player text unique not null, rank int not null, score text);");
        });
    
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM startpos where id=1', [], function (tx, results) {
            var len = results.rows.length;
            if (len <1)
            {
                tx.executeSql("insert into startpos values(1,1,1)");
                //alert("insert");
            }
            else
            {
                startgalaxy = results.rows.item(0).galaxy;
                startsystem = results.rows.item(0).system;
                
                
                $("#output").val(sql);
                
                nextgalaxy = startgalaxy;
                nextsystem = startsystem;
                if(startsystem==499)
                {
                    nextgalaxy += 1;
                    nextsystem = 1;
                }
                else
                {
                    nextsystem += 1;
                }
                if(startgalaxy==10)return;
                else
                {
                    ggg();
                }
            }
        }, null);
    });
}
createDB();

//function gCookie(name) { var bikky = document.cookie; name += "="; var i = 0; while (i < bikky.length) { var offset = i + name.length; if (bikky.substring(i, offset) == name) { var endstr = bikky.indexOf(";", offset); if (endstr == -1) endstr = bikky.length; return unescape(bikky.substring(offset, endstr)); } i = bikky.indexOf(" ", i) + 1; if (i == 0) break; } return null; }

function ggg()
{
    db.transaction(function (tx) {
        sql = 'update startpos set galaxy="'+ nextgalaxy + '", system="' + nextsystem +'" where id=1';
        tx.executeSql(sql, [], null, null); 
    });
    r = document.body.innerHTML;
    var p = document.createElement("p");
    var p1 = document.createElement("p");
    p.innerHTML = r;
    var t= p.getElementsByTagName("table")[1];
    var t1;
    var str;
    shtml ="";
    linestr = "";
    longsql="";
    position="";
    var sqlarray = new Array();
    var ranksqlarray = new Array();
    var count=0,countrank=0;
    for(k=2;k<17;k++)
    {
        s = t.rows[k].cells[5].innerHTML;
        sqlstr='insert into galaxy values("';
        ranksql='insert into player_rank  values("';
        linestr = "";
        j = $("input[name='galaxy']").val();
        i = $("input[name='system']").val();
        if( s != "&nbsp;" )
        {
            flag=1;
            
            tmps = '[' + j + ':' + i + ':' + (k-1) + ']';//坐标[x:y:z]
            shtml += "<tr><td class=c>" + tmps + '</td>';
            position = tmps;
            sqlstr += tmps + '", "';
            
            tmps = t.rows[k].cells[2].innerHTML;
            tmps = tmps.replace(/<(?:.|\s)*?>/g, "");//星球名
            shtml += "<td class=c>" + tmps + '</td>';
            sqlstr += tmps + '", "';
            
            shtml += "<td class=c>" + j + "</td><td class=c>" + 
                i +"</td><td class=c>"+ (k-1) +"</td>";
            
            //sqlstr += $("input[name='galaxy']").val() + '", "';
            //sqlstr += $("input[name='system']").val() + '", "';
            //sqlstr += (k-1) + '", "';
            
            tmps = t.rows[k].cells[3].innerHTML;
            if(tmps != "&nbsp;")
            {
                str = tmps.match(/<table>([\w\W])*<\/table>/gi);
                p1.innerHTML = str;
                t1 = p1.getElementsByTagName("table")[0];
                shtml += '<td>size:' + t1.rows[1].cells[1].innerHTML + '</td>';
                linestr = 'size:' + t1.rows[1].cells[1].innerHTML ;
            }
            else 
            {
                shtml += '<td>&nbsp;</td>';
                linestr = '';
            }
            sqlstr += linestr + '", "';/////////////月球
            
            tmps = t.rows[k].cells[4].innerHTML;
            if(tmps != "&nbsp;")
            {
                str = tmps.match(/<table>([\w\W])*<\/table>/gi);
                p1.innerHTML = str;
                t1 = p1.getElementsByTagName("table")[0];
                shtml += "<td>金属:" + t1.rows[1].cells[1].innerHTML + "晶体:" + t1.rows[2].cells[1].innerHTML + '</td>';
                linestr =  "金属" + t1.rows[1].cells[1].innerHTML + "晶体" + t1.rows[2].cells[1].innerHTML;
                jinshujingti=linestr.match(/([0-9.]+)/gi, linestr);
                des_jinshu=jinshujingti[0].replace(/\./gi,"");
                des_jingti=jinshujingti[1].replace(/\./gi,"");
                des_zonghe=parseInt(des_jinshu)+parseInt(des_jingti);
                linestr=des_jinshu+'", "'+des_jingti+'", "'+des_zonghe;
            }
            else
            {
                shtml += '<td>&nbsp;</td>';
                linestr='", "", "';
            }
            sqlstr += linestr + '", "';/////////////废墟
            
            p1.innerHTML = t.rows[k].cells[5].innerHTML;
            //tmps = p1.getElementsByTagName("a")[0].firstChild.Text;
            tmps = p1.getElementsByTagName("a")[0].firstChild.data;
            //alert(p1.getElementsByTagName("a")[0].innerHTML);
            if(tmps === undefined)
            {//海盗
                shtml += '<td>海盗</td><td>海盗</td>';
                sqlstr += '海盗",, "海盗" );';
            }
            else
            {
                shtml += "<td>" + tmps + "</td>";
                tmps = p1.getElementsByTagName("a")[0].innerHTML;
                isoffline = tmps.match(/&nbsp;.*$/g);
                //sqlstr += tmps + '", "';/////////////玩家
                
                //玩家排名信息
                tmps = p1.getElementsByTagName("a")[0].getAttribute("onmouseover");
                tmps=tmps.match(/玩家 (.)*排名 (\d)+/gi);
                rank=tmps[0].match(/排名 (\d)+/gi);
                rank=rank[0].replace(/排名 /gi,"");
                tmps=tmps[0].replace(/排名 (\d)+/gi,"");
                tmps=tmps.replace(/玩家 /gi,"");
                tmps=tmps.replace(/ /gi,"");
                ranksql += tmps + '", ' + rank + ', "");';
                if(isoffline!=null)tmps+="(u)";
                //alert(isoffline);
                sqlstr += tmps + '", ' + rank + ', "';/////////////玩家
                
                tmps = t.rows[k].cells[6].innerHTML;
                if(tmps != "&nbsp;")
                {
                    p1.innerHTML = tmps;
                    tmps = p1.getElementsByTagName("a")[0].firstChild.data;
                    shtml += "<td>" + tmps + "</td>";
                    sqlstr += tmps + '");';/////////////联盟
                }
                else
                {
                    shtml += "<td>&nbsp;</td>";
                    sqlstr += "" + '");';/////////////联盟
                }
            }
            shtml += "</tr>";
            longsql += sqlstr;
            //alert(sqlstr);
            ranksqlarray[countrank++] = ranksql;
            sqlarray[count++] = sqlstr;
        }
    }
    
    
    
    db.transaction(function (tx) {
        sql = 'delete from galaxy where galaxy="'+ j + '" and system="' + i +'"';
        tx.executeSql(sql, [], null, null); 
    });
    
    db.transaction(function (tx) {
        for(k in sqlarray)
        {
            tx.executeSql(sqlarray[k],null,
                          function (tx, result) {/* alert(result.message);*/},
                          function (tx, error) { /* alert(error.message);*/});
        }        
    });    
    db.transaction(function (tx) {
        for(k in ranksqlarray)
        {
            tx.executeSql(ranksqlarray[k],null,
                          function (tx, result) {/* alert(result.message);*/},
                          function (tx, error) { /* alert(error.message);*/});
        }        
    });
    $("#commands").val(longsql);
    document.getElementById("mytable").innerHTML += shtml;
    
    //alert(startgalaxy+"");
    //if(false)
    if(startgalaxy < 10)
    {
        setTimeout(function(){
            $("input[name='galaxy']").val(startgalaxy);
            $("input[name='system']").val(startsystem);
            $("#galaxy_form").submit();
            
        },
                   Math.floor(Math.random() * ( 3000 + 1))+500
                  );
    }
}
