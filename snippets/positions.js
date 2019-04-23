$(function () {
  // change item position by dragging
  const fixHelperModified = function(e, tr) {
    let originals = tr.children();
    let helper    = tr.clone();

    helper.children().each(function(index) {
      $(this).width(originals.eq(index).width())
    });

    return helper;
  };

  $('.commercials-in-group tbody').sortable({
    helper: fixHelperModified,
    stop: function(event, ui) {
      let tableId = $(this).parent().attr('id');
      renumber_table(`#${tableId}`);
    }
  });
});

function renumber_table(tableID) {
  $(tableID + " tr.commercial").each(function() {
    let commercialId = $(this).data('commercialId');
    let count        = $(this).parent().children().index($(this)) + 1;

    $(this).find('.priority').html(count);
    console.log(count);
    updateCommercialPosition(count, commercialId);
  });
}

function updateCommercialPosition(position, commercialId) {
  $.ajax({
    method: 'PATCH',
    url: `/cabinet/commercials/${commercialId}`,
    data: {
      commercial: {
        position: position
      }
    }
  });
}
