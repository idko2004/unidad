const onlineUrl = 'ws://localhost:8888';
let url;

let connected = false;

let gameMaster = false;
let players = [];
let maxPlayers;

let username;
let roomID;
let currentCard;
//let playerDeck = [];
let canPlay = false;
let canSkip = false;
let canSkipDirectly = false;
let canGrabACard = true;
let defendTextActive = false;

let messageLog = [];

const remSize = parseFloat(getComputedStyle(document.body).fontSize);

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
