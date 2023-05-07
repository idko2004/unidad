const url = 'ws://localhost:8888';

let connected = false;

const ws = new WebSocket(url);

ws.addEventListener('open', function(e)
{
    console.log('¡Conectado al servidor!');
    connected = true;
});

document.getElementById('sendMessage').addEventListener('click', function()
{
    if(!connected) return;

    ws.send('hola');
});