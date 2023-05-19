function startGame(response)
{
	document.getElementById('navUsername').innerText = username;
	document.getElementById('navRoomID').innerText = roomID;

	changeMenus('game');

	playerDeck = response.deck;
	currentCard = response.currentCard;
	canPlay = response.yourTurn;

	updateCurrentCard(response.currentCard);
	createCardsInDeck(response.deck);
	newMessages(response.message);
}

const currentCardImg = document.getElementById('currentCard');
const deckDiv = document.getElementById('deck');

function updateCurrentCard(card)
{
	currentCardImg.src = `img/${card}.png`;
	currentCard = card;
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
	moveAddCardToLast();
}

const logsDiv = document.getElementById('logsDiv');
let messagesPending = [];
let updateMessageJob;
let waitMessageTime = 1_400;
let lastMessageChanged;

function newMessages(messages)
{
	console.log('newMessages', messages);
	if(!Array.isArray(messages)) return;

	messagesPending.push(...messages);

	updateMessage();
}

function updateMessage()
{
	if(messagesPending.length > 0)
	{
		let now = new Date().getTime();

		//Solo cambiar el mensaje si ha pasado suficiente tiempo desde que se cambió el mensaje anterior, o no se cambió el mensaje aún, esto es para evitar cambiar el mensaje cuando el servidor envia mensajes nuevos y el mensaje anterior no ha pasado suficiente tiempo en pantalla
		if(lastMessageChanged === undefined
		|| (now - lastMessageChanged) > waitMessageTime - 100/*margen*/)
		{
			console.log('Changing message', messagesPending[0]);
			logsDiv.innerText = messagesPending[0];
			messagesPending.shift();

			lastMessageChanged = now;
		}

		if(updateMessageJob === undefined)
		{
			updateMessageJob = setInterval(function()
			{
				updateMessage();
			}, waitMessageTime);
		}
	}
	else
	{
		clearInterval(updateMessageJob);
		updateMessageJob = undefined;
	}
}

function clickACardInDeck(e)
{
	const card = e.target.attributes.card.value;

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
	
	canPlay = response.yourTurn;

	canSkipDirectly = response.canSkipDirectly;
	changeSkipCondition(response.canSkipDirectly || false);
	canGrabACard = !response.canSkipDirectly || true;
}

function updateDeck(deck)
{
	console.log('old deck', JSON.stringify(playerDeck));
	console.log('how new is supposed to be', JSON.stringify(deck));
	playerDeck = JSON.parse(JSON.stringify(deck));

	const elementsInDeck = document.getElementsByClassName('cardInDeck');

	const pairedCards = [];

	for(let i = 0; i < deck.length; i++)
	{
		// Por cada elemento de la array del deck, buscar una carta en el html que se corresponda
		const deckElement = findCard(deck[i]);
		if(deckElement !== undefined)
		{
			pairedCards.push(deckElement);
			deck[i] = null;
		}

		// Todos los elementos de deck que no sean null son cartas nuevas
		// Todas las cartas html que no están paireadas deben ser eliminadas
	}

	console.log(pairedCards);
	console.log(deck);

	removeCards();
	addCards();
	moveAddCardToLast();

	function findCard(card)
	{
		for(let j = 0; j < elementsInDeck.length; j++)
		{
			if(card === elementsInDeck[j].attributes.card.value
			&& !pairedCards.includes(elementsInDeck[j]))
			{
				return elementsInDeck[j];
			}
		}
		console.log('updateDeck.findCard: no se pudo encontrar la carta');
		return undefined;
	}

	function removeCards()
	{
		let toRemove = [];
		for(let j = 0; j < elementsInDeck.length; j++)
		{
			if(!pairedCards.includes(elementsInDeck[j]))
			{
				toRemove.push(elementsInDeck[j]);
			}
		}

		toRemove.forEach(function(e)
		{
			e.classList.add('card-delete');
		});
	}

	function addCards()
	{
		let toAdd = [];
		for(let j = 0; j < deck.length; j++)
		{
			if(deck[j] !== null) toAdd.push(deck[j]);
		}

		createCardsInDeck(toAdd);
	}
}

function moveAddCardToLast()
{
	const parent = document.getElementById('deck');
	const card = document.getElementById('addCard');

	parent.appendChild(card);
}

const skipButton = document.getElementById('skipButton');
function changeSkipCondition(nowCanSkip)
{
	if(typeof nowCanSkip !== 'boolean') return;

	canSkip = nowCanSkip;

	skipButton.disabled = !nowCanSkip;
}

//La carta de pedir más cartas
document.getElementById('addCard').addEventListener('click', function()
{
	if(!canPlay) return;
	if(canSkipDirectly)
	{
		floatingWindow(
		{
			title: 'Ahora no',
			text: 'No puedes tomar cartas del mazo si te están bombardeando con +4s.',
			button:
			{
				text: 'Aceptar',
				button: closeWindow
			}
		});
		return;
	}
	if(!canGrabACard)
	{
		floatingWindow(
		{
			title: 'Ya tomaste una',
			text: 'Solo puedes tomar una carta por turno, si no tienes ninguna carta jugable, debes saltar tu turno',
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
		operation: 'grabCard',
		roomID,
		username
	}));
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
	playerDeck.push(card);
	console.log('deck después de agarrar una carta', playerDeck);
	changeSkipCondition(true);
	canGrabACard = false;
}

//Saltar turno
document.getElementById('skipButton').addEventListener('click', function()
{
	if(!canSkip) return;

	changeSkipCondition(false);
	ws.send(JSON.stringify(
	{
		operation: 'skip',
		roomID,
		username
	}));
});

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