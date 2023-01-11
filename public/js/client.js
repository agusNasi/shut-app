//Start utility functions

const getHtml = (template) => template.join("\n");

const renderMeMessages = (message) => {
    const html = getHtml([
        '<div class="app-chat__messages-me">',
            '<div class="app-chat__messages-me-box">',
                '<span class="app-chat__messages-me-box--name">Yo</span>',
                `<span class="app-chat__messages-me-box--text">${message}</span>`,
            '</div>',
        '</div>'

    ]);
    return html;
}

const renderUserMessages = (username, message) => {
    const html = getHtml([
        '<div class="app-chat__messages-user">',
            '<div class="app-chat__messages-user-box">',
                `<span class="app-chat__messages-user-box--name">${username}</span>`,
                `<span class="app-chat__messages-user-box--text">${message}</span>`,
          '</div>',
        '</div>'

    ]);
    return html;
}

const socket = io(); // Connecting to Backend socket server
let user;

//DOM elements
const chatBox = document.getElementById('chat-box');
const messagesBox = document.getElementById('messages-box');

//Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })


//Authentication
Swal.fire({
    title: 'Resgistrate y unete al chat!',
    input: 'text',
    text: 'Escriba su nombre de usuario',
    inputValidator: (value) => {
        return !value && 'Ingrese su nombre de usuario para iniciar...'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    padding: '16px'
}).then((result) => {
    user = result.value;
    
    socket.emit('login', user);
})

//Socket logic

//Socket Emitters
chatBox?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (chatBox.value.trim().length) {
            socket.emit('messages', { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
})

//Socket Listeners
socket.on('welcome', (user) => {
    Toast.fire({
        icon: 'success',
        title: `Bienvenido ${user}`
      });
})


socket.on('new-user', (user) => {
    Toast.fire({
        icon: 'info',
        title: `${user} esta en linea`
      })
});


socket.on('messages-logs', (data) => {
    const html = getHtml(data.map(item => {
        if (item.user === user) {
            return renderMeMessages(item.message);
        } else {
            return renderUserMessages(item.user, item.message);
        }
    }));
    messagesBox.innerHTML = html;
});