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

			case '0r':
			case '0g':
			case '0b':
			case '0y':
				openZeroCardMenu(card);
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
	console.log('current deck:', currentDeck);
	console.log('new deck:', newDeck);

	const intersection = getArraysIntersection(currentDeck, newDeck);

	const newElements = getDifferentElements(intersection, newDeck);
	console.log('Nuevos elementos:', newElements);

	const deletedElements = getDifferentElements(intersection, currentDeck);
	console.log('Elementos eliminados:', deletedElements);

	removeCardsFromDeck(deletedElements);
	addCardsToDeck(newElements);

	//Comprobar si no hay cartas duplicadas que están saltando el radar
	if(newDeck.length !== currentDeck.length
	&& newElements.length === 0
	&& deletedElements.length === 0)
	{
		console.log('Algo sospechoso ocurre (podría hasta decirse que es sus). Activando el protocolo de emergencia.');
		findDuplicateCards(currentDeck, newDeck);
	}



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
		arr1 = JSON.parse(JSON.stringify(arr1));
		arr2 = JSON.parse(JSON.stringify(arr2));

		for(let i = 0; i < arr1.length; i++)
		{
			//if(arr2.includes(arr1[i])) intersec.push
			for(let j = 0; j < arr2.length; j++)
			{
				if(arr1[i] === arr2[j])
				{
					intersec.push(arr1[i]);
					arr2[j] = undefined;
				}
			}
		}
		console.log('intersección:', intersec);
		return intersec;
		//return arr1.filter(x => arr2.includes(x));
		//Sacado de https://stackoverflow.com/a/33034768
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

	function findDuplicateCards(arr1, arr2)
	{
		//Contar todas las cartas en arr1
		const cardsCountedArr1 = {};
		for(let i = 0; i < arr1.length; i++)
		{
			if(cardsCountedArr1[arr1[i]] === undefined)
			{
				cardsCountedArr1[arr1[i]] = 1;
			}
			else cardsCountedArr1[arr1[i]]++;
		}
		console.log('Cartas contadas en arr1:', cardsCountedArr1);

		//Contar todas las cartas en arr2
		const cardsCountedArr2 = {};
		for(let i = 0; i < arr2.length; i++)
		{
			if(cardsCountedArr2[arr2[i]] === undefined)
			{
				cardsCountedArr2[arr2[i]] = 1;
			}
			else cardsCountedArr2[arr2[i]]++;
		}
		console.log('Cartas contadas en arr2:', cardsCountedArr2);

		//Comprobar si uno tiene más cartas distintas que el otro
		const keysArr1 = Object.keys(cardsCountedArr1).sort();
		const keysArr2 = Object.keys(cardsCountedArr2).sort();
		console.log('Claves de cardsCountedArr1', keysArr1);
		console.log('Claves de cardsCountedArr2', keysArr2);

		if(keysArr1.length !== keysArr2.length) //contienen distitnos tipos de cartas
		{
			console.log('Contienen distintos tipos de cartas');
			const arrIntersection = getArraysIntersection(keysArr1, keysArr2);
			const differenceArr1 = getDifferentElements(arrIntersection, arr1);
			const differenceArr2 = getDifferentElements(arrIntersection, arr2);

			console.log('Tipos de cartas que comparten:', arrIntersection);
			console.log('Tipos de carta solo en arr1:', differenceArr1);
			console.log('Tipos de carta solo en arr2:', differenceArr2);

			//Eliminar cartas que solo estén en arr1
			removeCardsFromDeck(differenceArr1);

			//Crear cartas que solo estén en arr2
			addCardsToDeck(differenceArr2);
		}

		if(JSON.stringify(keysArr1) === JSON.stringify(keysArr2)) //Contienen los mismos tipos de cartas
		{
			console.log('Las claves son idénticas');

			const cardsToDelete = [];
			const cardsToCreate = [];
			for(let i = 0; i < keysArr1.length; i++)
			{
				let cardsArr1 = cardsCountedArr1[keysArr1[i]];
				let cardsArr2 = cardsCountedArr2[keysArr1[i]];
				console.log('Cantidad de cartas', keysArr1[i], cardsArr1, cardsArr2);

				if(cardsArr1 !== cardsArr2)
				{
					console.log('Distinta cantidad de cartas', keysArr1[i], cardsArr1, cardsArr2);

					if(cardsArr1 > cardsArr2)
					{
						//Añadir la diferencia de cartas al array cardsToDelete
						console.log('Cartas que deberían de borrarse', cardsArr1 - cardsArr2);
						for(let j = 0; j < cardsArr1 - cardsArr2; j++)
						{
							console.log('Añadiendo a cardsToDelete', keysArr1[i]);
							cardsToDelete.push(keysArr1[i]);
						}
					}
					else if(cardsArr1 < cardsArr2)
					{
						//Añadir la diferencia de cartas a cardsToCreate
						console.log('Cartas que deberían de crearse', cardsArr2 - cardsArr1);
						for(let j = 0; j < cardsArr2 - cardsArr1; j++)
						{
							console.log('Añadiendo a cardsToCreate', keysArr1[i]);
							cardsToCreate.push(keysArr1[i]);
						}
					}
				}
			}
			console.log('Cartas a crear', cardsToCreate);
			console.log('Cartas a borrar', cardsToDelete);

			if(cardsToDelete.length > 0) removeCardsFromDeck(cardsToDelete);
			if(cardsToCreate.length > 0) addCardsToDeck(cardsToCreate);
		}

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
				for(let j = 0; j < elementsInDeck.length; j++)
				{
					if(elementsInDeck[j].attributes.card.value === cards[i])
					{
						elementsInDeck[j].classList.add('card-delete');
					}
				}
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

function openZeroCardMenu(card)
{
	if(!canPlay) return;

	const list = [];
	for(let i = 0; i < players.length; i++)
	{
		if(players[i] === username) continue;

		list.push(
		{
			text: players[i],
			callback: async function()
			{
				await closeWindow();
				playZeroCard(players[i], card);
			}
		});
	}

	floatingWindow(
	{
		title: 'Cambia tus cartas con alguien',
		list,
		button:
		{
			text: 'No cambiar',
			callback: async function()
			{
				await closeWindow();
				playZeroCard(null, card);
			}
		}
	});
}

function playZeroCard(change, card)
{
	ws.send(JSON.stringify(
	{
		operation: 'play',
		roomID,
		username,
		play:
		{
			card,
			change
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
