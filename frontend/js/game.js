function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	//playerDeck = response.deck;
	canPlay = response.yourTurn;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	newMessages(response.message);
	updateBackgroundColor(response.yourTurn);
}

function createCardsInDeck(deck)
{
	for(let i = 0; i < deck.length; i++)
	{
		const img = document.createElement('img');
		img.classList.add('cardInDeck');
		img.classList.add('cardHoverAnim');
		img.classList.add('card-spawn');

		img.src = `img/${deck[i]}.png`;
		img.setAttribute('card', deck[i]);

		img.addEventListener('click', function(e)
		{
			clickACardInDeck(e);
		});

		img.addEventListener('animationend', function(e)
		{
			cardAnimationEnd(e);
		});

		deckDiv.appendChild(img);
	}
	//moveAddCardToLast();
}

const logsDiv = document.getElementById('logsDiv');
let messagesPending = [];
let updateMessageJob;
let waitMessageTime = 1_200;
let lastMessageChanged;

function newMessages(messages)
{
	console.log('newMessages', messages);
	if(!Array.isArray(messages)) return;

	messagesPending = messages;

	if(updateMessageJob !== undefined)
	{
		clearInterval(updateMessageJob);
	}

	updateMessageJob = setInterval(function()
	{
		updateMessage();
	}, waitMessageTime);

	updateMessage();
}

function updateMessage()
{
	if(messagesPending.length > 0)
	{
		console.log('Changing message', messagesPending[0]);
		logsDiv.innerText = messagesPending[0];
		messagesPending.shift();
	}
	else
	{
		clearInterval(updateMessageJob);
		updateMessageJob = undefined;
	}
}

let cardClicked;
function clickACardInDeck(e)
{
	const card = e.target.attributes.card.value;
	cardClicked = e.target;
	console.log(cardClicked);

	if(!validCard(card, currentCard))
	{
		floatingWindow(
		{
			title: 'Esa carta no',
			text: 'Elige una carta que tenga el mismo color o contenido',
			button:
			{
				text: 'Aceptar',
				callback: closeWindow
			}
		});
		return;
	}

	if(canPlay) //Es tu turno
	{
		window.scroll({top: 0, behavior: 'smooth'});

		switch(card)
		{
			default:
				ws.send(JSON.stringify(
				{
					operation: 'play',
					roomID,
					username,
					play:
					{
						card
					}
				}));
				break;

			case 'COLOR':
				openColorWindow();
				break;
		}
	}
}

function errorPlaying(response)
{
	switch(response.error)
	{
		default:
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'invalidCard':
			floatingWindow(
			{
				title: 'Esa carta no',
				text: 'Elige una carta que tenga el mismo color o contenido',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;

		case 'grabCardFirst':
			floatingWindow(
			{
				title: 'Toma una carta del mazo',
				text: 'No puedes saltar tu turno si no tomas una carta del mazo antes',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			break;
	}
}

function gameUpdate(response)
{
	updateCurrentCard(response.currentCard);
	newMessages(response.messages);
	updateDeck(response.deck);
	updateBackgroundColor(response.yourTurn);
	
	canPlay = response.yourTurn;

	canSkipDirectly = response.canSkipDirectly;
	changeSkipCondition(response.canSkipDirectly || false);
	canGrabACard = !response.canSkipDirectly || true;
}

function updateDeck(deck)
{
	if(!Array.isArray(deck))
	{
		console.log(`game.updateDeck: deck is not an array: ${deck}`);
		return;
	}

	const currentDeck = getCurrentDeck();

	const newDeck = deck;

	const intersection = getArraysIntersection(currentDeck, newDeck);

	const newElements = getDifferentElements(intersection, newDeck);
	console.log('Nuevos elementos:', newElements);

	const deletedElements = getDifferentElements(intersection, currentDeck);
	console.log('Elementos eliminados:', deletedElements);

	removeCardsFromDeck(deletedElements);
	addCardsToDeck(newElements);

	function getCurrentDeck()
	{
		const elementsInDeck = document.getElementsByClassName('cardInDeck');
		const cardsNames = [];

		for(let i = 0; i < elementsInDeck.length; i++)
		{
			cardsNames.push(elementsInDeck[i].attributes.card.value);
		}
		return cardsNames;
	}

	function getArraysIntersection(arr1, arr2)
	{
		const intersec = [];
		for(let i = 0; i < arr1.length; i++)
		{
			if(arr2.includes(arr1[i])) intersec.push(arr1[i]);
		}
		return intersec;
	}

	function getDifferentElements(intersection, arr)
	{
		const elements = [];
		for(let i = 0; i < arr.length; i++)
		{
			if(!intersection.includes(arr[i]))
			{
				elements.push(arr[i]);
			}
		}
		return elements;
	}

	function addCardsToDeck(cards)
	{
		createCardsInDeck(cards);
	}

	function removeCardsFromDeck(cards)
	{
		const elementsInDeck = document.getElementsByClassName('cardInDeck');
		for(let i = 0; i < cards.length; i++)
		{
			if(cardClicked !== undefined && cardClicked.attributes.card.value === cards[i])
			{
				cardClicked.classList.add('card-delete');
				cardClicked = undefined;
			}
			else
			{
				elementsInDeck.forEach(function(e)
				{
					if(e.attributes.card.value === cards[i])
					{
						e.classList.add('card-delete');
					}
				});
			}
		}
	}
}

const deckElement = document.getElementById('deck');
const addCardElement = document.getElementById('addCard');

/*
function moveAddCardToLast()
{
	return;
	const parent = deckElement;
	const card = addCardElement;

	parent.appendChild(card);
}
*/

function changeSkipCondition(nowCanSkip)
{
	if(typeof nowCanSkip !== 'boolean') return;

	canSkip = nowCanSkip;

	if(nowCanSkip) addCardElement.src = 'img/skipturn.png';
	else addCardElement.src = 'img/add.png';
}

//La carta de pedir más cartas y saltar turno
document.getElementById('addCard').addEventListener('click', function()
{
	if(!canPlay) return;

	if(canSkip || canSkipDirectly)
	{
		changeSkipCondition(false);
		ws.send(JSON.stringify(
		{
			operation: 'skip',
			roomID,
			username
		}));
		window.scroll({top: 0, behavior: 'smooth'});
	}
	else if(canGrabACard)
	{
		ws.send(JSON.stringify(
		{
			operation: 'grabCard',
			roomID,
			username
		}));
	}
});

function grabCard(response)
{
	if(response.error !== undefined)
	{
		if(response.error === 'alredyGrabbed')
		{
			floatingWindow(
			{
				title: 'Nop',
				text: 'Ya has tomado una carta.',
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
		else
		{
			floatingWindow(
			{
				title: 'Algo salió mal',
				text: `error: ${response.error}`,
				button:
				{
					text: 'Aceptar',
					callback: closeWindow
				}
			});
			return;
		}
	}

	const card = response.card;
	createCardsInDeck([card]);
	//playerDeck.push(card);
	//console.log('deck después de agarrar una carta', playerDeck);
	changeSkipCondition(true);
	canGrabACard = false;
}

// Cards animations
function cardAnimationEnd(e)
{
	switch(e.animationName)
	{
		case 'cardSpawnAnim':
			e.target.classList.remove('card-spawn');
			break;

		case 'cardDeleteAnim':
			e.target.remove();
			break;
	}
}

// Current card animation
const currentCardImg = document.getElementById('currentCard');
const deckDiv = document.getElementById('deck');

currentCardImg.addEventListener('animationend', function(e)
{
	switch(e.animationName)
	{
		case 'cardDeleteAnim':
			currentCardImg.classList.remove('currentCard-out');
			currentCardImg.src = `img/${currentCard}.png`;
			currentCardImg.classList.add('currentCard-in');
			break;

		case 'currentCardInAnim':
			currentCardImg.classList.remove('currentCard-in');
			break;
	}
});

function updateCurrentCard(card)
{
	if(card === currentCard) return; //Si la carta es igual, no hacer animación
	if(currentCardImg.src !== '') currentCardImg.classList.add('currentCard-out'); //Si no hay carta anterior, no hacer animación
	else currentCardImg.src = `img/${card}.png`;
	currentCard = card;
}

function updateBackgroundColor(accent)
{
	if(accent)
	{
		document.body.classList.remove('body-notYourTurn');
		document.body.classList.add('body-yourTurn');
	}
	else
	{
		document.body.classList.remove('body-yourTurn');
		document.body.classList.add('body-notYourTurn');
	}
}


//ELEGIR UNA CARTA DE COLOR
document.getElementById('colorCardRed').addEventListener('click', () => {playColorCard('r')});
document.getElementById('colorCardGreen').addEventListener('click', () => {playColorCard('g')});
document.getElementById('colorCardBlue').addEventListener('click', () => {playColorCard('b')});
document.getElementById('colorCardYellow').addEventListener('click', () => {playColorCard('y')});

async function playColorCard(color)
{
	await closeColorWindow();

	if(!canPlay) return;
	
	const cardColors =
	{
		r: 'COLORr',
		g: 'COLORg',
		b: 'COLORb',
		y: 'COLORy'
	}

	const card = cardColors[color];
	if(!card)
	{
		floatingWindow(
		{
			title: 'Algo salió mal',
			text: `${color} no es una carta de color válida`,
			button:
			{
				text: 'Aceptar',
				callback: closeWindow
			}
		});
		return;
	}

	ws.send(JSON.stringify(
	{
		operation: 'play',
		roomID,
		username,
		play:
		{
			card: 'COLOR',
			color: card
		}
	}));
}

function gameEnd(response)
{
	yourTurn = false;
	updateCurrentCard(response.currentCard);
	updateDeck(response.deck);

	if(response.youWin) winAnimation();
	else loseAnimation();
}

function winAnimation()
{
	generateConfeti();
	document.getElementById('winReload').addEventListener('click', function()
	{
		location.reload();
	});
	const winScreen = document.getElementById('winScreen');
	winScreen.classList.add('openBg');
	winScreen.hidden = false;
	startConfetiLoop();
}

function loseAnimation()
{
	const loseScreen = document.getElementById('loseScreen');
	loseScreen.addEventListener('animationend', function()
	{
		loseScreen.children[0].hidden = false;
	});
	loseScreen.hidden = false;

	document.getElementById('loseReload').addEventListener('click', function()
	{
		location.reload();
	});
}
