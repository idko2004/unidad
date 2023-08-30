
//Crea cartas en el deck en base a una array, se ejecuta cuando inicia el juego y si hay cartas nuevas en updateDeck
function createCardsInDeck(deck)
{
	for(let i = 0; i < deck.length; i++)
	{
		const sprite = document.createElement('div');
		sprite.classList.add('cardsprite');
		sprite.classList.add(spriteClass[deck[i]]);

		const div = document.createElement('div');
		div.appendChild(sprite);
		div.classList.add('cardsize-small');
		div.classList.add('cardInDeck');
		div.classList.add('cardHoverAnim');
		div.classList.add('card-spawn');

		div.setAttribute('card', deck[i]);
		div.setAttribute('title', "Click derecho para ver información sobre la carta");

		div.addEventListener('click', function(e)
		{
			clickACardInDeck(e);
		});

		div.addEventListener('animationend', function(e)
		{
			cardAnimationEnd(e);
		});

		div.addEventListener('contextmenu', function(e)
		{
			e.preventDefault();
			showCardDexInfo(e.target);
		})

		deckDiv.appendChild(div);
	}
}



//Callback que se ejecuta cuando se hace click en una carta.
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
					key,
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
	else
	{
		ws.send(JSON.stringify(
		{
			operation: 'blow',
			roomID,
			key,
			card
		}));
	}
}



//Cuando el servidor envía una operación gameUpdate, se revisan (o intentan revisar) los cambios en el deck para actualizar las cartas.
function updateDeck(deck)
{
	if(!Array.isArray(deck))
	{
		console.log(`game.updateDeck: deck is not an array: ${deck}`);
		return;
	}

	playerDeck = deck;

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
			if(elementsInDeck[i].classList.contains('card-delete')) continue;
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

