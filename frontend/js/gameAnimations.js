
// Animación de las cartas en el mazo
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
const currentCardSprite = document.getElementById('currentCardSprite');
const currentCardDiv = document.getElementById('currentCardDiv');
const deckDiv = document.getElementById('deck');

currentCardDiv.addEventListener('animationend', function(e)
{
	switch(e.animationName)
	{
		case 'currentCardOutAnim':
			currentCardDiv.classList.remove('currentCard-out');
			currentCardSprite.className = `cardsprite ${spriteClass[currentCard]}`;
			currentCardDiv.classList.add('currentCard-in');
			break;

		case 'currentCardInAnim':
			currentCardDiv.classList.remove('currentCard-in');
			break;
	}
});

function updateCurrentCard(card)
{
	if(card === currentCard) return; //Si la carta es igual, no hacer animación
	if(!currentCardSprite.classList.contains('card-SKIP')) currentCardDiv.classList.add('currentCard-out'); //Si no hay carta anterior, no hacer animación
	else
	{
		currentCardSprite.classList.remove('card-SKIP');
		currentCardSprite.classList.add(spriteClass[card]);
	}
	currentCard = card;
}



//Animación de cambiar el color del fondo cuando es tu turno
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



//Animación de perder o ganar
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

function loseAnimation(winner)
{
	const loseScreen = document.getElementById('loseScreen');
	loseScreen.addEventListener('animationend', function()
	{
		loseScreen.children[0].hidden = false;
	});

	document.getElementById('loseWinnerName').innerText = winner;

	loseScreen.hidden = false;

	document.getElementById('loseReload').addEventListener('click', function()
	{
		location.reload();
	});
}



//Animación del texto ¡Defiéndete! cuando te atacan con cartas
const defendContainer = document.getElementById('defendContainer');

function changeDefendTextState(show)
{
	if(show === defendTextActive) return;
	defendTextActive = show;

	if(show)
	{
		defendContainer.classList.remove('defendOff');
		defendContainer.classList.add('defendOn');
		defendContainer.hidden = false;
	}
	else
	{
		defendContainer.classList.remove('defendOn');
		defendContainer.classList.add('defendOff');
	}
}

defendContainer.addEventListener('animationend', function(e)
{
	if(e.animationName === 'defendAnimExit') defendContainer.hidden = true;
});


