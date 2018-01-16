var formatDatetime = function(ts, format = 'YYYY-MM-DD HH:mm') {
    // require moment
    // var t = moment(ts * 1000).format('YYYY-MM-DD HH:mm')
    var td = new Date(ts * 1000)
    var year = td.getYear()
    var fyear = td.getFullYear()
    var month = td.getMonth() + 1
    var date = td.getDate()
    var hour = td.getHours()
    var mins = td.getMinutes()
    var secs = td.getSeconds()
    month = String(month).padStart(2, 0)
    data = String(date).padStart(2, 0)
    hour = String(hour).padStart(2, 0)
    mins = String(mins).padStart(2, 0)
    secs = String(secs).padStart(2, 0)
    var dt = format.replace('YYYY', fyear).replace('YY', year).replace('MM', month).replace('DD', date)
    var dd = dt.replace('HH', hour).replace('mm', mins).replace('ss', secs)
    return dd
}


var longTimeAgo = function(query = '.time') {
    var timeAgo = function(time, ago) {
        return Math.round(time) + ago;
    };

    $(query).each(function(i, e) {
        var past = parseInt(e.dataset.time);
        var now = Math.round(new Date().getTime() / 1000);
        var seconds = now - past;
        var ago = seconds / 60;
        var oneHour = 60;
        var oneDay = oneHour * 24;
        // var oneWeek = oneDay * 7;
        var oneMonth = oneDay * 30;
        var oneYear = oneMonth * 12;
        var s = '';
        if (seconds < 60) {
            s = timeAgo(seconds, ' 秒前')
        } else if (ago < oneHour) {
            s = timeAgo(ago, ' 分钟前');
        } else if (ago < oneDay) {
            s = timeAgo(ago / oneHour, ' 小时前');
        } else if (ago < oneMonth) {
            s = timeAgo(ago / oneDay, ' 天前');
        } else if (ago < oneYear) {
            s = timeAgo(ago / oneMonth, ' 月前');
        }
        $(e).text(s);
    });
}