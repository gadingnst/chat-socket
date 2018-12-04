'use strict';

var io = io(),
    users = 0;

$.ajax({
  method: 'GET',
  url: '/login',
  dataType: 'JSON'
}).done(function (res) {
  users = res.users.length;
  $('#users-online-count').text(users == 0 ? 'Belum ada user lain yang online' : --users + ' Online');
  $('#msg-form').submit(function (event) {
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

  res.users.forEach(function (item, index) {
    var name = res.users[index].name;
    if (res.users[index].id !== res.self.id) {
      $('#users-online').append('\n        <li id="' + name + '">\n          <div class="d-flex bd-highlight">\n            <div class="img_cont">\n              <img class="rounded-circle user_img" src="' + res.users[index].ava + '">\n              <span class="online_icon"></span>\n            </div>\n            <div class="user_info">\n              <span>' + name + '</span>\n              <p>' + name + ' sedang online</p>\n            </div>\n          </div>\n        </li>\n      ');
    } else {
      $('#users-online').append('\n        <li id="' + name + '">\n          <div class="d-flex bd-highlight">\n            <div class="img_cont">\n              <img class="rounded-circle user_img" src="' + res.users[index].ava + '">\n              <span class="online_icon"></span>\n            </div>\n            <div class="user_info">\n              <span>' + name + ' (Anda)</span>\n            </div>\n          </div>\n        </li>\n      ');
    }
  });

  io.on('messages', function (data) {
    if (data.id !== res.self.id) {
      $('#chat-room').append('\n        <div class="d-flex mb-4 justify-content-start">\n          <div class="img_cont_msg">\n            <img class="rounded-circle user_img_msg" src="' + data.ava + '">\n          </div>\n          <div class="msg_cotainer" style="background-color: ' + data.bubble + '">\n            ' + data.msg + '\n            <span class="msg_name">' + data.name + '</span>\n          </div>\n        </div>\n      ');
    } else {
      $('#chat-room').append('\n        <div class="d-flex mb-4 justify-content-end">\n          <div class="msg_cotainer_send my-msg">\n            ' + data.msg + '\n          </div>\n          <div class="img_cont_msg">\n            <img class="rounded-circle user_img_msg" src="' + data.ava + '">\n          </div>\n        </div>\n      ');
    }
  });

  io.on('login', function (data) {
    $('#users-online-count').text(++users + ' Online');
    $('#users-online').append('\n      <li id="' + data.id + '">\n        <div class="d-flex bd-highlight">\n          <div class="img_cont">\n            <img class="rounded-circle user_img" src="' + data.ava + '">\n            <span class="online_icon"></span>\n          </div>\n          <div class="user_info">\n            <span>' + data.name + '</span>\n            <p>' + data.name + ' sedang online</p>\n          </div>\n        </div>\n      </li>\n    ');
    $('#chat-room').append('\n      <p style="font-size: 8pt; text-align: center; color: #FFF">' + data.name + ' telah Login</p>\n    ');
  });

  io.on('logout', function (data) {
    $('#users-online-count').text(users == 0 ? 'Belum ada user lain yang online' : --users + ' Online');
    $('#' + data.id).remove();
    $('#chat-room').append('\n      <p style="font-size: 8pt; text-align: center; color: #FFF">' + data.name + ' telah Logout</p>\n    ');
  });

  $('#clear-chat').on('click', function () {
    $('#chat-room').empty();
    $('.action_menu').hide();
  });
});

$('#logout').on('click', function () {
  $('.action_menu').toggle();
  swal({
    title: "Anda yakin ingin logout ?",
    text: "Anda akan meninggalkan room chat ini.",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(function (willLogout) {
    if (willLogout) {
      swal("Terima kasih sudah mencoba aplikasi simple ini, jika menemukan kesalahan/bug mohon hubungi pengembang :)").then(function () {
        window.location.href = '/logout';
      });
    }
  });
});

$("#msg-text").keypress(function (key) {
  if (key.which == 13) {
    $('#msg-send').click();
    $(this).val('');
    key.preventDefault();
  }
});

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});