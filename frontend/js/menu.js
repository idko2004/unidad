function changeMenus(menu)
{
	document.getElementById('findGameMenu').hidden = true;
	document.getElementById('waitForPlayersMenu').hidden = true;

	switch(menu)
	{
		case 'findGame':
			document.getElementById('findGameMenu').hidden = false;
			break;

		case 'waitPlayers':
			document.getElementById('waitForPlayersMenu').hidden = false;
			break;
	}
}

document.getElementById('createGameButton').addEventListener('click', function()
{
	if(!connected) return;

	let username = document.getElementById('createGameUsername').value;
	if(username === undefined) return;
	
	username = username.trim();
	if(username === '') return;


	let numberOfPlayers = parseInt(document.getElementById('createGamePlayers').value);
	if(isNaN(numberOfPlayers)
	|| numberOfPlayers < 1
	|| numberOfPlayers > 10)
	{
		return;
	}

	let obj =
	{
		operation: 'createGame',
		username,
		maxPlayers: numberOfPlayers
	};

	ws.send(JSON.stringify(obj));

	gameMaster = true;
	changeMenus('waitPlayers');
});

//
//  WAIT FOR PLAYERS MENU
//

function obtainedRoomID(response)
{
	document.getElementById('waitRoomID').innerText = response.roomID;

	if(!gameMaster)
	{
		document.getElementById('waitStartButton').hidden = true;
	}

	for(let i = 0; i < response.players.length; i++)
	{
		addPlayerToWaitingList(response.players[i]);
	}
}

function addPlayerToWaitingList(playerName)
{
	const playersList = document.getElementById('playersList');

	const playerInTheList = document.createElement('div');
	playerInTheList.classList.add('playerInTheList');

	const span = document.createElement('span');
	span.innerText = playerName;
	playerInTheList.appendChild(span);

	if(gameMaster)
	{
		const btnFloatRight = document.createElement('button');
		btnFloatRight.classList.add('btnFloatRight');
		btnFloatRight.innerText = '(X)';
		playerInTheList.appendChild(btnFloatRight);	
	}

	playersList.appendChild(playerInTheList);
}