
//CARTAS DE COLORES
document.getElementById('colorCardRed').addEventListener('click', () => {playColorCard('r')});
document.getElementById('colorCardGreen').addEventListener('click', () => {playColorCard('g')});
document.getElementById('colorCardBlue').addEventListener('click', () => {playColorCard('b')});
document.getElementById('colorCardYellow').addEventListener('click', () => {playColorCard('y')});

const colorWindowBg = document.getElementById('colorWindowBg');
const colorWindow = document.getElementById('colorWindow');

function openColorWindow()
{
	colorWindowBg.hidden = false;
	colorWindow.classList.remove('closeWin');
	colorWindow.classList.add('openWin');

	colorWindowBg.classList.remove('closeBg');
	colorWindowBg.classList.add('openBg');

	thereIsAWindows = true;
}

let colorAnimationCallback;
async function closeColorWindow()
{
	return new Promise(function(resolve, reject)
	{
		colorWindow.classList.remove('openWin');
		colorWindow.classList.add('closeWin');

		colorWindowBg.classList.remove('openBg');
		colorWindowBg.classList.add('closeBg');

		colorAnimationCallback = function(e)
		{
			if(e.animationName !== 'closeWindow') return;
			colorWindowBg.hidden = true;
			colorWindow.removeEventListener('animationend', colorAnimationCallback);
			thereIsAWindows = false;
			resolve();
		}

		colorWindow.addEventListener('animationend', colorAnimationCallback);
	});
}

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



//Cartas 0, de cambiar mazos con otros jugadores
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