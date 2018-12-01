var io = io(), users = 0;

$.ajax({
  method: 'GET',
  url: '/login',
  dataType: 'JSON'
}).done(function(res){
  users = res.users.length;
  $('#users-online-count').text(users+' Online');
  $('#msg-form').submit(function() {
    event.preventDefault();
    var text = $('#msg-text');
    io.emit('messages', {
      name: res.self.name,
      msg: text.val()
    });
    text.val('');
    console.log('msg sended');
    return false;
  });

  res.users.forEach(function(item, index){
    var name = res.users[index].name;
    if (name !== res.self.name) {
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
    }
  })

  io.on('messages', function(data){
    if (data.name !== res.self.name) {
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
    $('#users-online-count').text((++users)+' Online');
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
    $('#chat-room').append(`
      <p style="font-size: 8pt; text-align: center; color: #FFF">${name} telah Login</p>
    `);
  });

  io.on('logout', function(name){
    $('#users-online-count').text((--users)+' Online');
    $('#'+name).remove();
    $('#chat-room').append(`
      <p style="font-size: 8pt; text-align: center; color: #FFF">${name} telah Logout</p>
    `);
  });
});
