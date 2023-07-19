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

const remSize = parseFloat(getComputedStyle(document.body).fontSize);

