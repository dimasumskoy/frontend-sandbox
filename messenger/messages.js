$(function () {
  $('form#new_message').on('submit', function (e) {
    e.preventDefault();
    let form = $(this);
    let messageBody = form.serialize();
    $.post(form.attr('action'), messageBody, function (data) {
      if (data.body === '') {
        $('textarea#message_body').focus();
      } else {
        $(`div#conversation-${data.conversation_id}`).append(singleMessage(data));
        $('form#new_message textarea').val('');
        document.getElementById(`message-${data.id}`).scrollIntoView();
      }
    })
  });

  const toLastMessage = () => {
    if (window.location.pathname.includes('/me/conversations')) {
      let messages = document.getElementsByClassName('single-message');
      let lastMessage = messages[messages.length - 1];
      document.getElementById(lastMessage.id).scrollIntoView();
    }
  };

  const sendByEnter = () => {
    $('textarea#message_body').on('keypress', function (e) {
      if (e.ctrlKey) {
        $('form .btn').trigger('click');
      }
    })
  };

  function previousMessagesIteration(link, count) {
    let conversationId = link.data('conversationId');
    let range = link.data('range');
    let conversationField = $(`div#conversation-${conversationId}`);
    let previousMessagesLink = $('a.previous-messages');
    $.get({
      url: `/conversation/messages_portion?conversation_id=${conversationId}&iteration=${count}&range=${range}`,
      data: link.serialize(),
      success: function (response, status, xhr) {
        let messages = response.reverse();
        $.each(messages, function (index, message) {
          conversationField.prepend(singleMessage(message));
        });
        conversationField.prepend(previousMessagesLink);
      }
    })
  }
})