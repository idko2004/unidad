let url;
let gameserver;

let connected = false;

let gameMaster = false;
let players = [];

let username;
let roomID;
let key;
let currentCard;
let playerDeck = [];
let canPlay = false;
let canSkip = false;
let canSkipDirectly = false;
let canGrabACard = true;
let defendTextActive = false;


//Esto se usa al momento de crear partida para saber que reglas enviar al servidor para crear la sala
//También se usa para guardar las reglas que el servidor envía al ya crear la sala o al unirse a una sala.
let roomRules =
{
	modifyRules: false,
	cardsAtStart: 7,
	verySpecialCards: true,
	defendGimmick: true,
	zeroInterchange: true,
	blow: true
}

const remSize = parseFloat(getComputedStyle(document.body).fontSize);
const vhSize = innerHeight / 100;

