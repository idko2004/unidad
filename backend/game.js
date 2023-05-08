const activeGames = {};

const allCards =
[
	'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0r',
	'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '0g',
	'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0b',
	'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0y',
	'+2r', '+2g', '+2b', '+2y',
	'SKIPr', 'SKIPg', 'SKIPb', 'SKIPy',
	'REVERSEr', 'REVERSEg', 'REVERSEb', 'REVERSEy',
	'+4', 'COLOR'
];

const normalCards =
[
	'1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0r',
	'1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', '0g',
	'1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0b',
	'1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0y'
];

const specialCards =
[
	'+2r', '+2g', '+2b', '+2y',
	'SKIPr', 'SKIPg', 'SKIPb', 'SKIPy',
	'REVERSEr', 'REVERSEg', 'REVERSEb', 'REVERSEy',
	'+4', 'COLOR'
]

module.exports =
{
	activeGames,
	cards:
	{
		allCards,
		normalCards,
		specialCards
	}
};

const gamesExample =
{
	'a1b2c3': //roomID
	{
		master: 'alguien', //Persona que creó la sala y controla el juego
		maxPlayers: 4, //Cantidad de jugadores necesarios para iniciar una partida,
		currentCard: '6b',
		letMorePlayersIn: false,
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