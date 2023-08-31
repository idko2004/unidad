const onlineUrl = 'ws://localhost:8765';
let url;

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

const roomRules = //Esto solo se usa al momento de crear partida
{
	modifyRules: false,
	cardsAtStart: 7,
	verySpecialCards: true,
	defendGimmick: true,
	zeroInterchange: true
}

const remSize = parseFloat(getComputedStyle(document.body).fontSize);
const vhSize = innerHeight / 100;

