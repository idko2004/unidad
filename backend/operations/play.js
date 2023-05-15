const game = require('../utils/game');
const cards = require('../utils/cards');

const colors = require('colors');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'play',
		username,
		roomID,
		play:
		{
			card
		}
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



	//Comprobar si tenemos todos los datos
	const roomID = dataObject.roomID;
	const username = dataObject.username;
	const play = dataObject.play;
	if([roomID, username, play].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
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
		return;
	}



	// Comprobar si el usuario es parte de la sala
	if(room.order.includes(username))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		return;
	}



	// Comprobar si es su turno
	if(room.order[room.whoIsPlaying] === username)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'notYourTurn'
		}));
		return;
	}



	// Obtener las propiedades de la carta
	const cardProperties = cards.properties[play.card];
	if(cardProperties === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		return;
	}



	// Comprobar si la carta está en el deck del jugador
	if(!room.players[username].deck.includes(play.card))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidCard'
		}));
		return;
	}


	// Si la carta jugada es especial, hacer la cosa
	if(cardProperties.special)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'not implemented yet'
		}));
		return;
	}



	// Si la carta no es especial pero hace algo, hacer la cosa
	else if(cardProperties.doesSomething)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'not implemented yet'
		}));
		return;
	}



	// Si la carta jugada no es especial, hacer la cosa
	else
	{
		const currentCardProperties = cards.properties[room.currentCard];

		const sameColor = currentCardProperties.color === cardProperties.color;
		const sameValue = currentCardProperties.value === cardProperties.value;

		let validPlay = false;
		if(sameColor) validPlay = true;
		else if(sameValue) validPlay = true;

		if(!validPlay)
		{
			ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'invalidCard'
			}));
			return;
		}

		room.currentCard = play.card;
		room.players[username].deck = cards.deleteFromDeck(play.card, room.players[username].deck);
		room.whoIsPlaying++;
	}



	// Enviar el estado de la partida a todos los jugadores
	for(let i = 0; i < room.order; i++)
	{
		const player = room.players[room.order[i]];
		if(player === undefined)
		{
			console.log(colors.red(`operation play: ${room.order[i]} no es un jugador de la partida`));
			continue;
		}

		if(player.ws === undefined)
		{
			console.log(colors.red(`operation play: ${room.order[i]} no tiene un websocket asignado`));
			continue;
		}

		player.ws.send(JSON.stringify(
		{
			operation: 'gameUpdate',
			currentCard: room.currentCard,
			deck: player.deck,
			yourTurn: room.order[room.whoIsPlaying] === room.order[i],
			messages: [ 'alguien hizo algo' ]
		}));
	}
}
