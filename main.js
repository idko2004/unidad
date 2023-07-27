const vars = require('./utils/env');

const gamePort = vars.env.GAME_PORT || 8765;

console.log('Iniciando servidor');

vars.global.gameServer = `${require('ip').address()}:${gamePort}`;
console.log(`\nServidor del juego: ${vars.global.gameServer}\n`);

console.log(new Date().toString());
console.log('\nPROHIBIDO MIRAR ESTA PANTALLA DURANTE UNA PARTIDA, ES TRAMPA\n');

const WebSocket = require('ws');

const parseMessage = require('./utils/parseMessage');
const game = require('./utils/game');
const msg = require('./utils/messages');
const clients = require('./utils/wsClients');


const wss = new WebSocket.Server(
{
	port: gamePort
});

wss.on('connection', function(ws)
{
	console.log('### ¡Cliente conectado! ###');

	ws.isAlive = true;
	ws.gameInfo = [];
	clients.wsClients.push(ws);
	
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
	for(let i = 0; i < clients.wsClients.length; i++)
	{
		console.log('### Está vivo:', clients.wsClients[i].isAlive, clients.wsClients[i].gameInfo);

		if(!clients.wsClients[i].isAlive)
		{
			conectionClosed(clients.wsClients[i], i);
			continue;
		}

		clients.wsClients[i].isAlive = false;
		clients.wsClients[i].send('Ping!');
	}

	//Rehacer la array quitando los undefineds que dejó conetionClosed
	let newClientsArray = [];
	for(let i = 0; i < clients.wsClients.length; i++)
	{
		if(clients.wsClients[i] === undefined) continue;
		newClientsArray.push(clients.wsClients[i]);
	}
	clients.wsClients = newClientsArray;
}, 30_000);

function conectionClosed(ws, i)
{
	console.log('### Una conexión cerrada ###');
	if(ws.gameInfo !== undefined)
	{
		for(let i = 0; i < ws.gameInfo.length; i++)
		{
			const roomID = ws.gameInfo[i].roomID;
			const username = ws.gameInfo[i].username;
			
			console.log(`### ${roomID}, ${username} ###`);
	
			const room = game.activeGames[roomID];
			if(room === undefined) return;
	
			game.activeGames[roomID].players[username].ws = null;
	
			//Si es el turno de alguien desconectado pasar su turno
			if(room.order[room.whoIsPlaying] === username)
			{
				console.log('### Pasando turno');
				game.utils.nextTurn(roomID);
				game.utils.updatePlayers(roomID, [msg.getMessage(msg.msgValues.inactive, {username})]);
			}
		}
	}

	clients.wsClients[i] = undefined;
	ws.terminate();
}



const httpServer = require('./http/server');

const filesServer = vars.env.FILES_SERVER || "1";

if(filesServer === "1") httpServer.startServer();