var socket = io();

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); 

      if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
      }
}



socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err){
    if(err){
      alert(err);
        window.location.href="/";
    }else{
      console.log("no error")
    }
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
  var ol =jQuery('<ol></ol>');


  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));   
  });

  jQuery('#users').html(ol);
})





socket.on('newMessage', function (message) {
  var template =jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from
  });

  jQuery('#messages').append(html);
  scrollToBottom();

 /*  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  
  jQuery('#messages').append(li); */
});
 
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        text:jQuery('[name=message]').val()
    },function(){
      text:jQuery('[name=message]').val('')

    })
})