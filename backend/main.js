console.log('Iniciando servidor');
console.log(`\nDirección IP local: ${require('ip').address()}:8888\n`);
console.log(new Date().toString());
console.log('\nPROHIBIDO MIRAR ESTA PANTALLA DURANTE UNA PARTIDA, ES TRAMPA\n');

const WebSocket = require('ws');

const parseMessage = require('./utils/parseMessage');
const game = require('./utils/game');
const msg = require('./utils/messages');

let wsClients = [];

const wss = new WebSocket.Server(
{
	port: 8888
});

wss.on('connection', function(ws)
{
	console.log('### ¡Cliente conectado! ###');

	ws.isAlive = true;
	wsClients.push(ws);
	
	ws.on('message', function(data)
	{
		if(data.toString() === 'Pong!')
		{
			ws.isAlive = true;
		}
		else parseMessage(data, ws);
	});
});

//Ping
setInterval(function()
{
	console.log('### Llegó la hora de pinguear ###');
	for(let i = 0; i < wsClients.length; i++)
	{
		console.log('### Está vivo:', wsClients[i].isAlive);

		if(!wsClients[i].isAlive)
		{
			conectionClosed(wsClients[i], i);
			continue;
		}

		wsClients[i].isAlive = false;
		wsClients[i].send('Ping!');
	}
}, 30_000);

function conectionClosed(ws, i, game)
{
	console.log('### Una conexión cerrada ###');
	if(ws.gameInfo !== undefined)
	{
		const roomID = ws.gameInfo.roomID;
		const username = ws.gameInfo.username;
		
		console.log(`### ${roomID}, ${username} ###`);

		const room = game.activeGames[roomID];
		if(room === undefined) return;

		const user = room.players[username];
		if(user === undefined) return;

		user.ws = null;

		//Si es el turno de alguien desconectado pasar su turno
		if(room.order[room.whoIsPlaying] === username)
		{
			console.log('### Pasando turno');
			game.utils.nextTurn(roomID);
			game.utils.updatePlayers(roomID, [msg.getMessage(msg.msgValues.inactive, {username})]);
		}
	}

	wsClients[i] = undefined;
	let newClientsArray = [];
	for(let i = 0; i < wsClients.length; i++)
	{
		if(wsClients[i] === undefined) continue;
		newClientsArray.push(wsClients[i]);
	}
	wsClients = newClientsArray;

	ws.terminate();
}
