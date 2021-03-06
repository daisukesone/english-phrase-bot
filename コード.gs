// Slackからメッセージ取得
function getSlackLog() {
    var requestUrl = 'https://slack.com/api/channels.history?';
    var payload = {
        // Slack Token
        'token': 'xoxp-853333860565-853324535040-894141048978-375f08fc55433835ec8e1929844b98bd',
        // Channel ID
        'channel': 'C0142BK6ESU',
        // 25時間分のメッセージ取得
        'oldest': parseInt( new Date() / 1000 ) - (60 * 60 * 25)
    }

    // パラメータの設定
    var param = [];
    for (var key in payload) {
        param.push(key + '=' + payload[key]);
    }
    requestUrl += param.join('&');
  console.log(requestUrl);



    return UrlFetchApp.fetch(requestUrl);
}

// 取得したSlackのメッセージをスプレッドシートに保存
function setSlackLog() {
    // Slackのメッセージを取得して逆順に
    var response = JSON.parse(getSlackLog());
    var messages = response.messages.reverse();

    // スプレッドシートの情報取得
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var lastrow = sheet.getLastRow();

    // メッセージをシートに書き込む
    for ( var i = 0; i < messages.length; i++ ){
        // 日付
        sheet.getRange(lastrow + i + 1, 1).setValue(convertTimestamp(messages[i].ts));
        // 内容
        sheet.getRange(lastrow + i + 1, 2).setValue(messages[i].text);
        // リンクがあればリンクURL
        if (messages[i].attachments) {
            sheet.getRange(lastrow + i + 1, 3).setValue(messages[i].attachments[0].title + String.fromCharCode(10) + messages[i].attachments[0].title_link);
        }
    }
}

// UNIXタイムスタンプを変換
function convertTimestamp(timestamp) {
    var date_format = function(num) {
        return ( num < 10 ) ? '0' + num  : num;
    };
    var d = new Date(timestamp * 1000);
    var date = d.getFullYear() + '/';
    date += date_format( d.getMonth() + 1 ) + '/';
    date += date_format( d.getDate() ) + ' ';
    date += date_format( d.getHours() ) + ':' + date_format( d.getMinutes() );

    return date;
}