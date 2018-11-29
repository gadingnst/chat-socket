var io = io();

$.ajax({
  method: 'GET',
  url: '/login',
  dataType: 'JSON'
}).done(function(res){
  $('#msg-form').submit(function() {
    event.preventDefault();
    var text = $('#msg-text');
    io.emit('messages', {
      name: res.name,
      msg: text.val()
    });
    text.val('');
    console.log('msg sended');
    return false;
  });

  io.on('messages', function(data){
    if (data.name !== res.name) {
      $('#chat-room').append(`
        <div class="d-flex mb-4 justify-content-start">
          <div class="img_cont_msg">
            <img class="rounded-circle user_img_msg">
          </div>
          <div class="msg_cotainer">
            ${data.msg}
            <span class="msg_name">${data.name}</span>
          </div>
        </div>
      `);
    }else{
      $('#chat-room').append(`
        <div class="d-flex mb-4 justify-content-end">
          <div class="msg_cotainer_send my-msg">
            ${data.msg}
            <span class="msg_name_send">${data.name}</span>
          </div>
          <div class="img_cont_msg">
            <img class="rounded-circle user_img_msg">
          </div>
        </div>
      `);
    }
  });

  io.on('login', function(name){
    $('#users-online').append(`
      <li id="${name}">
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img class="rounded-circle user_img">
            <span class="online_icon"></span>
          </div>
          <div class="user_info">
            <span>${name}</span>
            <p>${name} is online</p>
          </div>
        </div>
      </li>
    `);
  });
});
