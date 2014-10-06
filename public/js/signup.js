"use strict";

function submitSignup() {
  var data = {
    token: document.getElementById('token').value,
    fullname: document.getElementById('fullname').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  };

  $.ajax({
    url: '/api/v1/users',
    type: "POST",
    jsonp: 'callback',
    dataType: 'jsonp',
    data: data,
    complete: function (response, textStatus) {
      if (response.status === 200) {
        return document.location = '/login';
      } else {
        document.getElementById('error').innerText = response.statusText;
        return $("#alertBox").slideDown();
      }
    }
  });
}