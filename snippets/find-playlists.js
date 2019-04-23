function findPlaylsits() {
  let channelToken = gon.channel.token;

  $.ajax({
    method: 'GET',
    url: '/cabinet/playlists/scan',
    dataType: 'json',
    contentType: 'application/json',
    data: {
      token: channelToken
    },
    success: function (data) {

    }
  });
}
