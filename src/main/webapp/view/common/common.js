var lb_allMoKuais = [
    {id: '101', mc: '人员管理'},
    {id: '201', mc: '客户管理'},
    {id: '301', mc: '旅行信息'}, {id: '302', mc: '统计分析'},
    {id: '901', mc: '修改密码'}];
var lb_allA01s;
var lb_keHus;
var lb_xianLus;
var lb_diJieShes;

function getAllA01s(func) {
    hajax("/LBTravel/a01/getAllA01s.do", {}, "lb_allA01s", func);
}

function getAllKeHus(func){
    hajax("/LBTravel/keHu/getAllKeHus.do", {}, "lb_keHus", func);
}

function getAllXianLus(func){
    hajax("/LBTravel/lvXing/getAllXianLus.do", {}, "lb_xianLus", func);
}

function getAllDiJieShes(func){
    hajax("/LBTravel/lvXing/getAllDiJieShes.do", {}, "lb_diJieShes", func);
}

function findCode(list, id) {
    var e;
    for (var i = 0; i < list.length; i++) {
        e = list[i];
        if (e.id === id) {
            break;
        }
    }
    return e;
}

function hajax(url, d, result, func) {
    $.ajax({
        url: url,
        data: JSON.stringify(d),
        contentType: "application/json",
        type: "post",
        cache: false,
        error: function (msg, textStatus) {
            alert("查询数据失败");
        },
        success: function (json) {
            if (json.result === 0) {
                eval(result + " = json.sz");
                if (func) {
                    func();
                }
            }
        }
    });
}

function queryPaginator(options) {
    var tj = options.tj;
    var url = options.url;
    var func = options.func;
    var ul = options.ul;

    $.ajax({
        url: url,
        data: JSON.stringify(tj),
        contentType: "application/json",
        type: "POST",
        cache: false,
        error: function (msg, textStatus) {
        },
        success: function (json) {
            if (json !== null) {
                func(json);
                var count = json.rows;
                var pageCount = json.totalPage; //取到pageCount的值(把返回数据转成object类型)
                var currentPage = json.currentPage; //得到urrentPage
                var options = {
                    bootstrapMajorVersion: 3, //版本
                    currentPage: currentPage, //当前页数
                    totalPages: pageCount, //总页数
                    count: count,
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev5":
                                return "<<";
                            case "prev":
                                return "<";
                            case "next":
                                return ">";
                            case "next5":
                                return ">>";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    }, //点击事件，用于通过Ajax来刷新整个list列表
                    onPageClicked: function (event, originalEvent, type, page) {
                        if (page === 0) {
                            return;
                        }
                        tj.currentPage = page;
                        $.ajax({
                            url: url,
                            data: JSON.stringify(tj),
                            contentType: "application/json",
                            type: "post",
                            cache: false,
                            error: function (msg, textStatus) {
                            },
                            success: function (json1) {
                                if (json1 !== null) {
                                    func(json1);
                                }
                            }
                        });
                    }
                };
                $(ul).bootstrapPaginator(options);
            }
        }
    });
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

function dateFormat(longTypeDate) {
    var datetimeType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    datetimeType += date.getFullYear();   //年
    datetimeType += "-" + getMonth(date); //月
    datetimeType += "-" + getDay(date);   //日
    datetimeType += "&nbsp;&nbsp;" + getHours(date);   //时
    datetimeType += ":" + getMinutes(date);      //分
    datetimeType += ":" + getSeconds(date);      //分
    return datetimeType;
}

//返回 01-12 的月份值
function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
        month = "0" + month;
    }
    return month;
}
//返回01-30的日期
function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
}
//返回小时
function getHours(date) {
    var hours = "";
    hours = date.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    return hours;
}
//返回分
function getMinutes(date) {
    var minute = "";
    minute = date.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    return minute;
}
//返回秒
function getSeconds(date) {
    var second = "";
    second = date.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    return second;
}

function getKuWeiHao(mc, qsh, jsh) {
    var array = [];
    if (!qsh || "" === qsh || !jsh || "" === jsh) {
        return array;
    }
    var reg = /^[A-Za-z]+$/;
    if (!isNaN(qsh) && !isNaN(jsh)) {
        var begin = parseInt(qsh);
        var end = parseInt(jsh);
        for (var i = begin; i <= end; i++) {
            var s = mc + i;
            var o = {id:i,mc:s};
            array.push(o);
        }
    } else if (reg.test(qsh) && reg.test(jsh)) {
        var begin = qsh.charCodeAt(0);
        var end = jsh.charCodeAt(0);
        for (var i = begin; i <= end; i++) {
            var s = mc + String.fromCharCode(i);
            var o = {id:i,mc:s};
            array.push(o);
        }
    }
    return array;
}