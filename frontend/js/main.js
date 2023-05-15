const url = 'ws://localhost:8888';

let connected = false;

let gameMaster = false;
let players = [];
let maxPlayers;

let username;
let roomID;
let currentCard;
let playerDeck = [];
let canPlay = false;

/*floatingWindow(
{
	title: 'ola',
	text: 'patata',
	buttons:
	[
		{
			text: 'Cancelar',
			primary: false,
			callback: closeWindow
		},
		{
			text: 'Aceptar',
			primary: true,
			callback: closeWindow
		}
	]
});*/
