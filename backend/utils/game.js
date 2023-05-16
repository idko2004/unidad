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

function nextTurn(roomID)
{
	const room = activeGames[roomID];
	if(room === undefined)
	{
		console.log(colors.red(`game.nextTurn: ${roomID} is not a valid room`));
		return;
	}
	if(![-1, 1].includes(room.direction))
	{
		console.log(colors.red(`game.nextTurn: ${room.direction} is not a valid direction`));
		return;
	}

	room.whoIsPlaying += room.direction;

	if(room.whoIsPlaying > room.order.length - 1) room.whoIsPlaying = 0;
	else if(room.whoIsPlaying < 0) room.whoIsPlaying = room.order.length - 1;

	return room.whoIsPlaying;
}

module.exports =
{
	activeGames,
	utils:
	{
		nextTurn
	}
};
