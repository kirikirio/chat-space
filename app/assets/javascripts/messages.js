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
      last_message_id = $('.message').last().data("id");
      $.ajax({
        url: 'api/messages',
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
      var insertHTML = '';
      messages.forEach(function (message) {
      insertHTML = buildHTML(message);
      $('.messages').append(insertHTML);
      $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight});
      })
      .fail(function() {
        console.log('error');
      });
    });
  };
  setInterval(reloadMessages, 5000);
});