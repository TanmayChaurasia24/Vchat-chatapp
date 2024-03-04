    // this is client side logic for socket.io
    const socket = io('http://localhost:8000');

    const form = document.getElementById('send-container');
    const messageInput = document.getElementById( 'messageInp' );
    const messagecontainer = document.querySelector(".container");


    const append = (message,position)=>{
        const messageelement = document.createElement('div');
        messageelement.innerText = message;
        messageelement.classList.add('message');
        messageelement.classList.add(position);
        messagecontainer.append(messageelement);

    }

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`,'right');
        socket.emit('send',message);
        messageInput.value='';
    });

    const name = prompt("please enter your name to join");
    socket.emit('new-user-add',name);


    socket.on('user-joined',name => {
        append(`${name} joined the chat `,'left');
    })

    socket.on('receive',data=>{
        append(`${data.name}: ${data.message}`,'left');
    })
    socket.on('left',name=>{
        append(`${name} left the chat `,'left');
    })
