$(function () {
  const playerControls = new Plyr('#player', { controls });
  window.player = playerControls;
  player = document.getElementById('player');

  setPlaylistSong();

  $(document).on('click', '.song-player .fa-play', function () {
    let songItem         = $(this).parent()[0];
    let audioTrackArtist = songItem.dataset['artist'];
    let audioTrackTitle  = songItem.dataset['title'];
    let audioTrackCover  = songItem.dataset['cover'];
    let songId           = songItem.dataset['songId'];
    let rowSongId        = $(`tr#song-${songId}`).attr('id');

    getSongUrl(songId).then(function (response) {
      let songUrl = response['path'];
      setPlayerInfo(audioTrackTitle, audioTrackArtist, audioTrackCover);

      if (!player.src.includes(songUrl)) {
        player.src = songUrl;
        player.dataset['songId'] = rowSongId;
        player.play();
      } else {
        player.play();
      }
    });

    resetPlayIcons();
    $(this).hide();
    $(this).siblings('.fa-pause').show();

    $('#play_song').attr('id', 'pause_song');
  });

  $(document).on('click', '.song-player .fa-pause', function () {
    player.pause();
    resetPlayIcons();
    $('#pause_song').attr('id', 'play_song');
  });

  $(document).on('click', '#pause_song', function () {
    $(this).attr('id', 'play_song');
    togglePlayIcons('.fa-pause', '.fa-play');
  });

  $(document).on('click', '#play_song', function () {
    $(this).attr('id', 'pause_song');
    togglePlayIcons('.fa-play', '.fa-pause');
  });

  $(document).on('click', '#next_song', function () {
    toggleSong('next');
  });

  $(document).on('click', '#prev_song', function () {
    toggleSong('prev')
  });

  $(document).on('click', '.play-song-preview', function() {
    $('.pause-song-preview').not($(this).siblings('.pause-song-preview')).hide();
    $('.play-song-preview').not($(this)).hide();
  });

  $(document).on('click', '.pause-song-preview', function() {
    $(this).hide();
    $(this).siblings('.play-song-preview').show();
  });

  $('.similar-item ').mouseenter(function () {
    $(this).find('.play-song-preview').show();
  }).mouseleave(function () {
    $(this).find('.play-song-preview').hide();
  });
});

function resetPlayIcons() {
  $('.fa-play').not('.play-song-preview').show();
  $('.fa-pause').not('.pause-song-preview').hide();
}

function togglePlayIcons(current, next) {
  let currentSong = document.getElementById(player.dataset['songId']);
  $(currentSong).find('.song-player').find(current).hide();
  $(currentSong).find('.song-player').find(next).show();
}

function getSongUrl(songId) {
  return $.ajax({
    method: 'GET',
    url: getSongSourcePath(songId),
    success: function (data) {
      return data;
    }
  });
}

function getSongSourcePath(songId) {
  if (window.location.href.includes('admin')) {
    return `/admin/songs/${songId}/get_url`;
  } else {
    return `/cabinet/playlists/${gon.playlist.id}/songs/${songId}/get_url`;
  }
}

function setPlaylistSong() {
  let firstSong  = $('.song-player').first()[0];

  if (firstSong !== undefined) {
    let songId     = firstSong.dataset['songId'];
    let rowSongId  = $(`tr#song-${songId}`).attr('id');

    getSongUrl(songId).then(function (response) {
      player.src               = response['path'];
      player.dataset['songId'] = rowSongId;

      setPlayerInfo(
        firstSong.dataset['title'],
        firstSong.dataset['artist'],
        firstSong.dataset['cover']
      );
    });
  }
}

function toggleSong(direction) {
  let currentSongId    = player.dataset['songId'];
  let currentSongRowId = $(`tr#${currentSongId}`);
  let songToPlayId = direction === 'next' ? currentSongRowId.next('tr') : currentSongRowId.prev('tr');
  let songPlayer   = songToPlayId.find('.song-player')[0];
  let songId       = songPlayer.dataset['songId'];

  getSongUrl(songId).then(function (response) {
    player.src = response['path'];
    player.dataset['songId'] = songToPlayId.attr('id');

    setPlayerInfo(
      songPlayer.dataset['title'],
      songPlayer.dataset['artist'],
      songPlayer.dataset['cover']
    );

    player.play();
    resetPlayIcons();
    togglePlayIcons('.fa-play', '.fa-pause');
  });
}

function setPlayerInfo(title, artist, cover) {
  $('.player-song-info .player-title').html(title);
  $('.player-song-info .player-artist').html(artist);
  $('.player-cover').find('img').attr('src', cover);
}