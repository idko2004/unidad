console.log('Iniciando servidor');
console.log(`Dirección IP local: ${require('ip').address()}:8888`);
console.log(new Date().toString());

const WebSocket = require('ws');

const parseMessage = require('./utils/parseMessage');

const wss = new WebSocket.Server(
{
	port: 8888
});

wss.on('connection', async function(ws)
{
	console.log('### ¡Cliente conectado! ###');
	
	ws.on('message', function(data)
	{
		parseMessage(data, ws);
	})
});
