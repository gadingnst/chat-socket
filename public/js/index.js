'use strict';

var io = io(),
    users = 0;

$.ajax({
  method: 'GET',
  url: '/login',
  dataType: 'JSON'
}).done(function (res) {
  users = res.users.length;
  $('#users-online-count').text(--users + ' Online');
  $('#msg-form').submit(function (event) {
    event.preventDefault();
    var text = $('#msg-text');
    io.emit('messages', {
      name: res.self.name,
      ava: res.self.ava,
      msg: text.val()
    });
    text.val('');
    console.log('msg sended');
    return false;
  });

  res.users.forEach(function (item, index) {
    var name = res.users[index].name;
    if (name !== res.self.name) {
      $('#users-online').append('\n        <li id="' + name + '">\n          <div class="d-flex bd-highlight">\n            <div class="img_cont">\n              <img class="rounded-circle user_img" src="' + res.users[index].ava + '">\n              <span class="online_icon"></span>\n            </div>\n            <div class="user_info">\n              <span>' + name + '</span>\n              <p>' + name + ' is online</p>\n            </div>\n          </div>\n        </li>\n      ');
    }
  });

  io.on('messages', function (data) {
    if (data.name !== res.self.name) {
      $('#chat-room').append('\n        <div class="d-flex mb-4 justify-content-start">\n          <div class="img_cont_msg">\n            <img class="rounded-circle user_img_msg" src="' + data.ava + '">\n          </div>\n          <div class="msg_cotainer">\n            ' + data.msg + '\n            <span class="msg_name">' + data.name + '</span>\n          </div>\n        </div>\n      ');
    } else {
      $('#chat-room').append('\n        <div class="d-flex mb-4 justify-content-end">\n          <div class="msg_cotainer_send my-msg">\n            ' + data.msg + '\n            <span class="msg_name_send">' + data.name + '</span>\n          </div>\n          <div class="img_cont_msg">\n            <img class="rounded-circle user_img_msg" src="' + data.ava + '">\n          </div>\n        </div>\n      ');
    }
  });

  io.on('login', function (data) {
    $('#users-online-count').text(++users + ' Online');
    $('#users-online').append('\n      <li id="' + data.name + '">\n        <div class="d-flex bd-highlight">\n          <div class="img_cont">\n            <img class="rounded-circle user_img" src="' + data.ava + '">\n            <span class="online_icon"></span>\n          </div>\n          <div class="user_info">\n            <span>' + data.name + '</span>\n            <p>' + data.name + ' is online</p>\n          </div>\n        </div>\n      </li>\n    ');
    $('#chat-room').append('\n      <p style="font-size: 8pt; text-align: center; color: #FFF">' + data.name + ' telah Login</p>\n    ');
  });

  io.on('logout', function (name) {
    $('#users-online-count').text(--users + ' Online');
    $('#' + name).remove();
    $('#chat-room').append('\n      <p style="font-size: 8pt; text-align: center; color: #FFF">' + name + ' telah Logout</p>\n    ');
  });

  $('#clear-chat').on('click', function (e) {
    $('#chat-room').empty();
    $('.action_menu').hide();
  });
});

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});