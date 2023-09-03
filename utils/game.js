const activeGames = {}; //Donde se guardan todas las partidas

const gamesExample =
{
	'a1b2c3': //roomID
	{
		master: 'alguien', //Persona que creó la sala y controla el juego,
		currentCard: '6b',
		letMorePlayersIn: false,
		whoIsPlaying: 0, //A quien le toca,
		direction: -1, //Determina en que dirección va el orden de juego, debe ser 1 o -1, este número se suma a whoIsPlaying al final de cada turno.
		cardGrabbed: true, //Determina si el jugador ya ha "tomado una carta del mazo", si es verdadero, ya no debería ser capaz de tomar más cartas, debido a que ya tomó una, debe restablecerse a falso cada que termine el turno de un jugador,
		cardsToVictim: 0, //Número de cartas que un jugador recibirá cuando no pueda defenderse de un +2 o +4,
		rules: //Reglas que se aplican a esta sala, para poder personalizar el juego
		{
			cardsAtStart: 7, //La cantidad de cartas con las que empieza el juego
			moreSpecialCards: true, //Decide si habrán cartas muy especiales en la mesa
			defendGimmick: true, //Decide si un jugador puede defenderse utilizando una carta reversa o bloqueo.
			zeroInterchange: true, //Decide si se pueden intercambiar mazos con una carta 0.,
			blow: true //Decide si se puede soplar
		},
		order: [ 'alguien', 'fulanito' ], //El orden en el que van a ir los turnos,
		table: [ '7y' ], //Todas las cartas que hay en la mesa
		keys: //Claves que los usuarios utilizan para autenticarse, se entrega una clave a cada uno al unirse a una partida o crear una
		{
			'VLV0CG8': 'alguien',
			'yA3AiMd': 'fulanito'
		},
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
				ws: null, //Aquí debería de ir el WebSocket de este usuario para poder enviarle información luego
				inactive: 0 //Indica cuantos turnos ha pasado por inactividad
			},
			'fulanito':
			{
				deck: ['7g'],
				ws: null,
				inactive: 0
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

	do
	{
		room.whoIsPlaying += room.direction;

		if(room.whoIsPlaying > room.order.length - 1) room.whoIsPlaying = 0;
		else if(room.whoIsPlaying < 0) room.whoIsPlaying = room.order.length - 1;
	}
	while(room.players[room.order[room.whoIsPlaying]].ws === null)

	return room.whoIsPlaying;
}


function whosNext(roomID)
{
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.whosNext: ${roomID} is not a valid room`));
		return;
	}
	if(![-1, 1].includes(room.direction))
	{
		console.log(colors.red(`game.utils.whosNext: ${room.direction} is not a valid direction`));
		return;
	}

	const player = room.whoIsPlaying;
	const direction = room.direction;

	let who = player + direction;

	if(who > room.order.length - 1) who = 0;
	else if(who < 0) who = room.order.length - 1;

	return who;
}



function whoWasBefore(roomID)
{
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.whoWasBefore: ${roomID} is not a valid room`));
		return;
	}
	if(![-1, 1].includes(room.direction))
	{
		console.log(colors.red(`game.utils.whoWasBefore: ${room.direction} is not a valid direction`));
		return;
	}

	const player = room.whoIsPlaying;
	const direction = room.direction;

	let who = player - direction;

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

	//Comprobar si alguien ya ganó
	let winner;
	for(let i = 0; i < room.order.length; i++)
	{
		const numberOfCards = room.players[room.order[i]].deck.length;
		console.log(`${room.order[i]} tiene ${numberOfCards} cartas`);
		if(numberOfCards === 0) winner = room.order[i];
		if(numberOfCards === 1) messages.push(msg.getMessage(msg.msgValues.oneCard, {username: room.order[i]})); //Avisarle a todos que a esta persona solo le queda una carta
	}

	let turnMessageIndex = messages.length;

	if(winner === undefined) //Si aún nadie gana
	{
		for(let i = 0; i < room.order.length; i++)
		{
			const player = room.players[room.order[i]];
			if(player === undefined)
			{
				console.log(colors.red(`game.utils.updatePlayers: ${room.order[i]} no es un jugador de la partida`));
				continue;
			}
	
			if([null, undefined].includes(player.ws))
			{
				console.log(`game.utils.updatePlayers: ${room.order[i]} está desconectado`);
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
	
	
			//Dejarte saltar un turno si te están tirando una carta +
			let defend = room.cardsToVictim > 0 && yourTurn;
	
			player.ws.send(JSON.stringify(
			{
				operation: 'gameUpdate',
				currentCard: room.currentCard,
				deck: player.deck,
				yourTurn,
				defend,
				messages
			}));

			updateTimeout(roomID);
		}
	}
	else //Si alguien ya ganó
	{
		for(let i = 0; i < room.order.length; i++)
		{
			const player = room.players[room.order[i]];
			if(player === undefined)
			{
				console.log(colors.red(`game.utils.updatePlayers: ${room.order[i]} no es un jugador de la partida`));
				continue;
			}
	
			if([null, undefined].includes(player.ws))
			{
				console.log(`game.utils.updatePlayers: ${room.order[i]} está desconectado`);
				continue;
			}

			const youWin = room.order[i] === winner;

			player.ws.send(JSON.stringify(
			{
				operation: 'gameEnd',
				youWin,
				winner,
				currentCard: room.currentCard,
				deck: player.deck
			}));

			//Borrar esta sala de su ws
			let newGameInfo = [];
			for(let j = 0; j < player.ws.gameInfo.length; j++)
			{
				if(player.ws.gameInfo[j].roomID !== roomID)
				{
					newGameInfo.push(player.ws.gameInfo[j]);
				}
			}
			player.ws.gameInfo = newGameInfo;
		}
		clearTimeout(room.timeout);
		delete activeGames[roomID];
		console.log('Sala borrada', Object.keys(activeGames));
	}
}



function changeDirection(roomID)
{
	if(roomID === undefined)
	{
		console.log(colors.red(`game.utils.changeDirection: roomID es undefined`));
		return;
	}

	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.utils.changeDirection: ${roomID} no es una sala válida`));
		return;
	}

	if(room.direction === 1) room.direction = -1;
	else room.direction = 1;

	return room.direction;
}



let targetTimeoutTime = 60000;
function updateTimeout(roomID)
{
	if(roomID === undefined)
	{
		console.log(`game.updateTimeout: roomID es undefined`);
		return;
	}
	
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(`game.updateTimeout: la sala no es válida`);
		return;
	}

	if(room.timeout !== undefined) clearTimeout(room.timeout);

	room.timeout = setTimeout(async function()
	{
		if(activeGames[roomID] === undefined)
		{
			console.log('La sala del timeout ya no existe', roomID);
			return;
		}

		const username = room.order[room.whoIsPlaying];
		console.log(`### Timeout para ${username} en ${roomID}`);
		nextTurn(roomID);
		updatePlayers(roomID, [msg.getMessage(msg.msgValues.inactive, {username})]);

		room.players[username].inactive++;
		console.log(`Veces que ${username} estuvo inactivo: ${room.players[username].inactive}`);

		if(room.players[username].inactive >= 3)
		{
			console.log(`### Jugador ${username} eliminado de la sala ${roomID}`);

			//Avisar al jugador que le expulsaron
			await room.players[username].ws.send(JSON.stringify(
			{
				operation: 'errorPlaying',
				error: 'kickedForInactivity'
			}));

			//Eliminar el jugador del orden de turnos
			let newOrder = [];
			for(let i = 0; i < room.order.length; i++)
			{
				if(room.order[i] !== username) newOrder.push(room.order[i]);
			}
			room.order = newOrder;

			//Poner sus cartas en la mesa
			room.table.push(...room.players[username].deck);

			//Eliminar el perfil del jugador de esta sala
			delete room.players[username];
		}

		if(room.order.length <= 1)
		{
			for(let i = 0; i < room.order.length; i++)
			{
				await room.players[room.order[i]].ws.send(JSON.stringify(
				{
					operation: 'errorPlaying',
					error: 'roomDeleted'
				}));
			}

			delete activeGames[roomID];
			console.log('### Sala borrada por inactividad', Object.keys(activeGames));
		}
	}, targetTimeoutTime);
}



module.exports =
{
	activeGames,
	utils:
	{
		updatePlayers,
		nextTurn,
		whosNext,
		whoWasBefore,
		changeDirection
	}
};
