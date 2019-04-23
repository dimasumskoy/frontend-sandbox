$(function () {
  // multiple items select
  
  $(document).on('change', 'input.i-checks', function() {
    let btnDeleteSongs = $('.delete-selected-songs');

    if (!btnDeleteSongs.is(":visible")) {
      btnDeleteSongs.show();
    }

    if ($('input.i-checks:checked').length === 0) {
      btnDeleteSongs.hide();
    }
  });

  $(document).on('click', '.delete-selected-songs', function () {
    if (confirm('Удалить выбранные песни?')) {
      let selectedSongs = $('input.i-checks:checked');
      let songIds = [];

      $.each(selectedSongs, function (_index, song) {
        songIds.push(song.dataset['songId']);
      });

      $.ajax({
        method: 'DELETE',
        url: `/admin/songs/batch_destroy`,
        data: {
          song_ids: songIds
        },
        success: function () {
          location.reload();
        }
      });
    }
  });

  const fixHelperModified = function(e, tr) {
    let originals = tr.children();
    let helper    = tr.clone();

    helper.children().each(function(index) {
      $(this).width(originals.eq(index).width())
    });

    return helper;
  };

  $("#categories_playlists tbody").sortable({
    helper: fixHelperModified,
    stop: function(event, ui) {
      renumber_table('#categories_playlists')
    }
  });
});

function renumber_table(tableID) {
  $(tableID + " tr.category").each(function() {
    let categoryId = $(this).data('categoryId');
    let count      = $(this).parent().children().index($(this)) + 1;

    $(this).find('.priority').html(count);
    updateCategoryPosition(count, categoryId);
  });
}

function updateCategoryPosition(position, categoryId) {
  $.ajax({
    method: 'PATCH',
    url: `/admin/categories/${categoryId}`,
    data: {
      category: {
        position: position
      }
    }
  });
}
