const socket = io('https://chat-app-backend-sooty.vercel.app', {transports:["websocket"]});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const nameContainer = document.querySelector('.name-container');
const nameInput = document.getElementById('nameInp');
const nameSubmit = document.getElementById('btn-name');
const mainContainer = document.querySelector('.main-container');
const chatContainer = document.getElementById('chat-container')
var audio = new Audio('tune.mp3');


function scrollToBottom () {
    chatContainer.scrollTop = chatContainer.scrollHeight
}

const append = (message, position) => {
const messageElement = document.createElement('div');
messageElement.innerText = message;
messageElement.classList.add('message')
messageElement.classList.add(position);
const time = new Date();
const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

if (position === 'left') {
    // Wrap the sender name in <b> tags to make it bold
    if(message.includes(':')){
        const senderName = message.split(': ')[0];
        const messageText = message.split(': ')[1];
        messageElement.innerHTML = `<b>${senderName}:</b> ${messageText} <span class="time">${timeString}</span>`;
    }else{
        messageElement.innerHTML = `<b>${message}</b> <span class="time">${timeString}</span>`;
    }
   
} else {
    // Wrap 'You' in <b> tags and split the message
    const youPart = message.split(': ')[0];
    const messageText = message.split(': ')[1];
    messageElement.innerHTML = `<b>${youPart}:</b> ${messageText} <span class="time">${timeString}</span>`;
}
messageContainer.append(messageElement);
if(position ==='left'){
    audio.play();
}

}

form.addEventListener('submit', (e) => {
e.preventDefault();
const message = messageInput.value;
append(`You: ${message}`, 'right');
socket.emit('send', message)
messageInput.value= '';
scrollToBottom();
})

nameSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const userName = nameInput.value;

    if (userName.trim() !== '') { // Check if the username is not empty.
        nameInput.value = userName;
        nameContainer.classList.add('hidden');  // Use '=' for assignment, not '==='.
        mainContainer.style.display = 'block'; // Use '=' for assignment, not '==='.
        nameInput.value = '';
        socket.emit('new-user-joined', userName);
       
    }

})




socket.on('user-joined', (userName) => {
append(`${userName} Joined the chat !`, 'left')
scrollToBottom();
});

socket.on('receive', (data) => {
append(`${data.userName}: ${data.message}`, 'left')
scrollToBottom();
});

socket.on('left', (name) => {
append(`${name} left the chat !`, 'left')
scrollToBottom();
})




