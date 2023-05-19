const activeGames = {}; //Donde se guardan todas las partidas

const gamesExample =
{
	'a1b2c3': //roomID
	{
		master: 'alguien', //Persona que creó la sala y controla el juego
		maxPlayers: 4, //Cantidad de jugadores necesarios para iniciar una partida,
		currentCard: '6b',
		letMorePlayersIn: false,
		whoIsPlaying: 0, //A quien le toca,
		direction: -1, //Determina en que dirección va el orden de juego, debe ser 1 o -1, este número se suma a whoIsPlaying al final de cada turno.
		cardGrabbed: true, //Determina si el jugador ya ha "tomado una carta del mazo", si es verdadero, ya no debería ser capaz de tomar más cartas, debido a que ya tomó una, debe restablecerse a falso cada que termine el turno de un jugador,
		cardsToVictim: 0, //Número de cartas que un jugador recibirá cuando no pueda defenderse de un +2 o +4
		order: [ 'alguien', 'fulanito' ], //El orden en el que van a ir los turnos
		players:
		{
			'alguien': //Nombre del jugador
			{
				deck: //Cartas del jugador
				[
					'1r', //Uno rojo
					'2g', //Dos verde
					'3b', //Tres azul
					'4y', //Cuatro amarillo
					'+2r', //+2 rojo
					'+4', //+4
					'SKIPr', //La carta que salta un turno roja
					'REVERSEg', //La carta de reversa verde
					'COLOR', //Cambiacolor
				],
				won: false, //Índica si el jugador ya ganó,
				ws: null //Aquí debería de ir el WebSocket de este usuario para poder enviarle información luego
			},
			'fulanito':
			{
				deck: ['7g'],
				won: false,
				ws: null
			}
		}
	}
}



const colors = require('colors');

const msg = require('./messages');

function nextTurn(roomID)
{
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.nextTurn: ${roomID} is not a valid room`));
		return;
	}
	if(![-1, 1].includes(room.direction))
	{
		console.log(colors.red(`game.utils.nextTurn: ${room.direction} is not a valid direction`));
		return;
	}

	room.whoIsPlaying += room.direction;

	if(room.whoIsPlaying > room.order.length - 1) room.whoIsPlaying = 0;
	else if(room.whoIsPlaying < 0) room.whoIsPlaying = room.order.length - 1;

	return room.whoIsPlaying;
}


function whosNext(roomID)
{
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.nextTurn: ${roomID} is not a valid room`));
		return;
	}
	if(![-1, 1].includes(room.direction))
	{
		console.log(colors.red(`game.utils.nextTurn: ${room.direction} is not a valid direction`));
		return;
	}

	const player = room.whoIsPlaying;
	const direction = room.direction;

	let who = player + direction;

	if(who > room.order.length - 1) who = 0;
	else if(who < 0) who = room.order.length - 1;

	return who;
}



function updatePlayers(roomID, messages) //Para enviar el estado de la partida a todos los jugadores
{
	if(roomID === undefined)
	{
		console.log(colors.red(`game.utils.updatePlayers: roomID es undefined`));
		return;
	}

	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.updatePlayers: ${roomID} no es una sala válida`));
		return;
	}

	if(messages === undefined || !Array.isArray(messages)) messages = [];

	let turnMessageIndex = messages.length;

	for(let i = 0; i < room.order.length; i++)
	{
		const player = room.players[room.order[i]];
		if(player === undefined)
		{
			console.log(colors.red(`game.utils.updatePlayers: ${room.order[i]} no es un jugador de la partida`));
			continue;
		}

		if(player.ws === undefined)
		{
			console.log(colors.red(`game.utils.updatePlayers: ${room.order[i]} no tiene un websocket asignado`));
			continue;
		}

		const yourTurn = room.order[room.whoIsPlaying] === room.order[i];

		// Cambiar el mensaje del turno de quién es
		if(yourTurn) messages[turnMessageIndex] = msg.getMessage(msg.msgValues.yourTurn);
		else messages[turnMessageIndex] = msg.getMessage(msg.msgValues.turn,
		{
			username: room.order[room.whoIsPlaying]
		});

		console.log('Mensajes:', messages);

		player.ws.send(JSON.stringify(
		{
			operation: 'gameUpdate',
			currentCard: room.currentCard,
			deck: player.deck,
			yourTurn,
			messages
		}));
	}
}



module.exports =
{
	activeGames,
	utils:
	{
		updatePlayers,
		nextTurn,
		whosNext
	}
};
