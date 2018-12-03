var io = io(), users = 0;

$.ajax({
  method: 'GET',
  url: '/login',
  dataType: 'JSON'
}).done(function(res){
  users = res.users.length;
  $('#users-online-count').text(--users+' Online');
  $('#msg-form').submit(function(event) {
    event.preventDefault();
    var text = $('#msg-text');
    io.emit('messages', {
      id: res.self.id,
      name: res.self.name,
      ava: res.self.ava,
      bubble: res.self.bubble,
      msg: text.val()
    });
    text.val('');
    console.log('msg sended');
    return false;
  });

  res.users.forEach(function(item, index){
    var name = res.users[index].name;
    if (res.users[index].id !== res.self.id) {
      $('#users-online').append(`
        <li id="${name}">
          <div class="d-flex bd-highlight">
            <div class="img_cont">
              <img class="rounded-circle user_img" src="${res.users[index].ava}">
              <span class="online_icon"></span>
            </div>
            <div class="user_info">
              <span>${name}</span>
              <p>${name} sedang online</p>
            </div>
          </div>
        </li>
      `);
    }else {
      $('#users-online').append(`
        <li id="${name}">
          <div class="d-flex bd-highlight">
            <div class="img_cont">
              <img class="rounded-circle user_img" src="${res.users[index].ava}">
              <span class="online_icon"></span>
            </div>
            <div class="user_info">
              <span>${name} (Anda)</span>
            </div>
          </div>
        </li>
      `);
    }
  })

  io.on('messages', function(data){
    if (data.id !== res.self.id) {
      $('#chat-room').append(`
        <div class="d-flex mb-4 justify-content-start">
          <div class="img_cont_msg">
            <img class="rounded-circle user_img_msg" src="${data.ava}">
          </div>
          <div class="msg_cotainer" style="background-color: ${data.bubble}">
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
          </div>
          <div class="img_cont_msg">
            <img class="rounded-circle user_img_msg" src="${data.ava}">
          </div>
        </div>
      `);
    }
  });

  io.on('login', function(data){
    $('#users-online-count').text((++users)+' Online');
    $('#users-online').append(`
      <li id="${data.id}">
        <div class="d-flex bd-highlight">
          <div class="img_cont">
            <img class="rounded-circle user_img" src="${data.ava}">
            <span class="online_icon"></span>
          </div>
          <div class="user_info">
            <span>${data.name}</span>
            <p>${data.name} is online</p>
          </div>
        </div>
      </li>
    `);
    $('#chat-room').append(`
      <p style="font-size: 8pt; text-align: center; color: #FFF">${data.name} telah Login</p>
    `);
  });

  io.on('logout', function(data){
    $('#users-online-count').text((--users)+' Online');
    $('#'+data.id).remove();
    $('#chat-room').append(`
      <p style="font-size: 8pt; text-align: center; color: #FFF">${data.name} telah Logout</p>
    `);
  });

  $('#clear-chat').on('click', function(){
    $('#chat-room').empty();
    $('.action_menu').hide();
  });
});

$('#logout').on('click', function(){
  $('.action_menu').toggle();
  swal({
    title: "Anda yakin ingin logout ?",
    text: "Anda akan meninggalkan room chat ini.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willLogout) => {
    if (willLogout) {
      swal("Terima kasih sudah mencoba aplikasi simple ini, jika menemukan kesalahan/bug mohon hubungi pengembang :)").then(() => {
        window.location.href = '/logout'
      });
    }
  });
});

$(document).ready(function() {
  $('#action_menu_btn').click(function() {
    $('.action_menu').toggle();
  });
});
