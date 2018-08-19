/**
 * -兼容 IE 浏览器
 * -无第三方依赖, 统一前端时间显示
 */

var timeFormat = function(ts, format = "YYYY-MM-DD HH:mm") {
    // equal: moment(ts * 1000).format('YYYY-MM-DD HH:mm')
    var td = new Date(ts * 1000);
    var YYYY = td.getFullYear();
    var M = td.getMonth() + 1;
    var D = td.getDate();
    var H = td.getHours();
    var m = td.getMinutes();
    var s = td.getSeconds();
    var MM = String(M).padStart(2, 0);
    var DD = String(D).padStart(2, 0);
    var HH = String(H).padStart(2, 0);
    var mm = String(m).padStart(2, 0);
    var ss = String(s).padStart(2, 0);
    var YY = String(YYYY).substr(2);

    var res = format.replace("YYYY", YYYY).replace("YY", YY);
    res = res.replace("MM", MM).replace("M", M);
    res = res.replace("DD", DD).replace("D", D);
    return res.replace("HH", HH).replace("mm", mm).replace("ss", ss);
};

var timeToNowZh = function(selector = ".time", getTsFunc) {
    // 默认获取时间戳(单位:秒S)的方法  
    getTsFunc = getTsFunc || function(e) {
        return parseInt(e.dataset.time);
    };
    var timeAgo = function(time, ago) {
        return Math.round(time) + ago;
    };
    $(selector).each(function(i, e) {
        var ts = getTsFunc(e);
        var now = Math.round(new Date().getTime() / 1000);
        var seconds = now - ts;
        var ago = seconds / 60;
        var oneHour = 60;
        var oneDay = oneHour * 24;
        // var oneWeek = oneDay * 7;
        var oneMonth = oneDay * 30;
        var oneYear = oneMonth * 12;
        var s = "";
        if (seconds < 60) {
            s = timeAgo(seconds, " 秒前");
        } else if (ago < oneHour) {
            s = timeAgo(ago, " 分钟前");
        } else if (ago < oneDay) {
            s = timeAgo(ago / oneHour, " 小时前");
        } else if (ago < oneMonth) {
            s = timeAgo(ago / oneDay, " 天前");
        } else if (ago < oneYear) {
            s = timeAgo(ago / oneMonth, " 月前");
        }
        $(e).text(s);
    });
};
