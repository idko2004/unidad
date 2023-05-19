
const game = require('../utils/game');
const cards = require('../utils/cards');

const rand = require('generate-key');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'createGame',
		username: nombre del usuario master,
		maxPlayers: número de jugadores necesarios
	}

	Respuesta:
	{
		operation: 'obtainRoomID'
		roomID,
		players:
		[
			array con todos los jugadores esperando, debería de estar solo el nombre del jugador master al momento de enviar esto
		]
	}
	*/

	console.log('---------------\ncreateGame\n');

	let username = dataObject.username;
	let maxPlayers = dataObject.maxPlayers;

	if(username === undefined
	|| maxPlayers === undefined
	|| typeof username !== 'string'
	|| typeof maxPlayers !== 'number'
	|| isNaN(maxPlayers)
	|| username.trim() === ''
	|| username.length > 20
	|| maxPlayers < 2
	|| maxPlayers > 20)
	{
		console.log('Los requisitos no se cumplen');
		ws.send(JSON.stringify(
		{
			error: 'badRequest',
			operation: 'obtainRoomID'
		}));
		return;
	}



	//Generar una roomID única
	let roomID = rand.generateKey(4).toLowerCase();
	while(game.activeGames[roomID] !== undefined)
	{
		roomID = rand.generateKey(4).toLowerCase();
	}



	// Crear una partida
	game.activeGames[roomID] =
	{
		master: username,
		maxPlayers,
		currentCard: cards.getCard('normal'),
		letMorePlayersIn: true,
		whoIsPlaying: 0,
		direction: 1,
		cardGrabbed: false,
		cardsToVictim: 0,
		order: [],
		players:
		{
			[username]:
			{
				deck: cards.generateDeck(),
				won: false,
				ws
			}
		}
	}
	console.log('Estado de los juegos', game.activeGames);
	//console.log('Estado del usuario', game.activeGames[roomID].players[username]);



	ws.send(JSON.stringify(
	{
		operation: 'obtainRoomID',
		roomID,
		players:
		[
			username
		]
	}));
}