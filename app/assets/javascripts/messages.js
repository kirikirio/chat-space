$(function(){
  function buildHTML(message){
    var img = message.image ? `<img src= ${ message.image }>` : "";
    var html =  `<div class="message" data-id="${message.id}" >
                  <div class="message__upper-info">
                    <p class="message__upper-info__talker">
                      ${message.user_name}
                    </p>
                    <p class="message__upper-info__date">
                      ${message.created_at}
                    </p>
                  </div>
                  <p class="message__text">
                    <div>
                      ${message.content}
                    </div>
                      ${img}
                  </p>
                </div>`
        return html ;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    $('#ajax').removeAttr('data-disable-with');
    var url = $(this).attr('action')
    $('#new_message')[0].reset();
    
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight});
    })
    .fail(function(){
      alert('エラーが発生しています');
    })
  });
    var reloadMessages = function() {
      //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
      last_message_id = $('.message').last().data("id");
      console.log(last_message_id);
      $.ajax({
        //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
        url: 'api/messages',
        //ルーティングで設定した通りhttpメソッドをgetに指定
        type: 'get',
        dataType: 'json',
        //dataオプションでリクエストに値を含める
        data: {id: last_message_id}
      })
      .done(function(messages) {
        console.log(messages);
      //追加するHTMLの入れ物を作る
      var insertHTML = '';
      messages.forEach(function (message) {
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      insertHTML = buildHTML(message);
      //メッセージが入ったHTMLを取得
      $('.messages').append(insertHTML);
      $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight});
      //メッセージを追加
      })
      .fail(function() {
        console.log('error');
      });
    });
  };
  setInterval(reloadMessages, 5000);
});