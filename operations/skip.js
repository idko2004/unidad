const game = require('../utils/game');
const cards = require('../utils/cards');
const msg = require('../utils/messages');

const colors = require('colors');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'skip',
		key,
		roomID
	}
	Enviar a todos:
	{
		operation: 'gameUpdate',
		currentCard,
		deck: [],
		yourTurn: true | false
		messages:[]
	}
	*/
	console.log('---------------\nskip\n');
	console.log(dataObject);



	//Comprobar si tenemos todos los datos
	const roomID = dataObject.roomID;
	const key = dataObject.key;
	if([roomID, key].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		console.log('errorPlaying: badRequest: no roomID or key');
		return;
	}



	// Comprobar si la sala existe
	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: la sala no existe');
		return;
	}



	// Comprobar que ya se agarró carta del mazo (Sólo si no hay cartas +)
	if(!room.cardGrabbed && room.cardsToVictim === 0)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'grabCardFirst'
		}));
		console.log('errorPlaying: grabCardFirst: no se tomó una carta del mazo');
		return;
	}



	// Obtener el nombre de usuario y comprobar si está en la sala
	const username = room.keys[key];
	if(username === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no pertenece a la sala');
		return;
	}



	/*
	// Comprobar si el usuario es parte de la sala
	if(!room.order.includes(username))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no pertenece a la sala');
		return;
	}
	*/



	// Comprobar si es su turno
	if(room.order[room.whoIsPlaying] !== username)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'notYourTurn'
		}));
		console.log('errorPlaying: notYourTurn');
		return;
	}

	let messages = [];



	//Si te están tirando cartas +
	if(room.cardsToVictim > 0)
	{
		messages.push(msg.getMessage(msg.msgValues.cardsEaten, //Mensaje de que la víctima se comió cartas
		{
			victim: username,
			cardsnumber: room.cardsToVictim
		}));

		cards.giveCardsToVictim(roomID, username);
	}
	else
	{
		// Mensajes
		messages.push(msg.getMessage(msg.msgValues.skipTurn, { username }));
	}



	// Saltar un turno
	game.utils.nextTurn(roomID);
	room.cardGrabbed = false;



	// Enviar el estado de la partida a todos los jugadores
	game.utils.updatePlayers(roomID, messages);
}