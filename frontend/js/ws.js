let ws;

autoconnect();

function autoconnect()
{
	const gameserver = document.body.getAttribute('gameserver');
	if(gameserver === null) changeMenus('server');
	else
	{
		url = `ws://${gameserver}`;
		connectToServer();
		updateServerLabel(gameserver);
	}
}


function connectToServer()
{
	try
	{
		ws = new WebSocket(url);
	}
	catch(err)
	{
		console.log(err);
		floatingWindow(
		{
			title: 'No se pudo conectar',
			text: 'Asegurate de escribir bien la dirección ip y el puerto.',
			button:
			{
				text: 'Aceptar',
				callback: function()
				{
					closeWindow();
					changeMenus('localServer');
				}
			}
		});
		return;
	}

	ws.addEventListener('open', function()
	{
		console.log('¡Conectado al servidor!');
		connected = true;
		changeMenus('main');
	});

	ws.addEventListener('error', function(e)
	{
		console.log('Error conectando al servidor', e);
		connected = false;
		floatingWindow(
		{
			title: 'Algo salió mal',
			text: 'No se pudo conectar al servidor',
			button:
			{
				text: ':(',
				callback: async function()
				{
					await closeWindow();
					changeMenus('server');
				}
			}
		});
	});

	ws.addEventListener('close', function(e)
	{
		console.log('El servidor se ha desconectado', e);
		connected = false;
		floatingWindow(
		{
			title: 'Servidor desconectado',
			text: 'La conexión con el servidor se ha cerrado.',
			button:
			{
				text: ':(',
				callback: async function()
				{
					await closeWindow();
					location.reload();
				}
			}
		});
	});

	ws.addEventListener('message', function(e)
	{
		console.log(e);
		if(e.data === 'Ping!')
		{
			ws.send('Pong!');
			return;
		}

		try
		{
			const response = JSON.parse(e.data);
			console.log(response);

			parseOperations(response);
		}
		catch(err)
		{
			console.log(err);
		}
	});
}


function parseOperations(response)
{
	switch(response.operation)
	{
		case 'obtainRoomID':
			joinedToGame(response);
			break;

		case 'joinedToGame':
			joinedToGame(response);
			break;

		case 'getCardProperties':
			receiveCardProperties(response);
			break;

		case 'playerJoined':
			playerJoined(response);
			break;

		case 'startGame':
			startGame(response);
			break;

		case 'errorPlaying':
			errorPlaying(response);
			break;

		case 'gameUpdate':
			gameUpdate(response);
			break;

		case 'blowResponse':
			blowResponse(response);
			break;

		case 'grabCard':
			grabCard(response);
			break;

		case 'gameEnd':
			gameEnd(response);
			break;

		case 'rejoined':
			rejoined(response);
			break;

		case 'playerKicked':
			playerKicked(response);
			break;
	}
}

function debug(type, extra)
{
	let debugObj =
	{
		operation: 'debug',
		debug: type
	}

	switch(type)
	{
		default:
			if(extra !== undefined) debugObj.data = extra;
			break;

		case 'player':
			if(Array.isArray(extra)) debugObj.data = extra;
			else if(typeof extra === 'string') debugObj.data = [roomID, extra];
			else debugObj.data = [roomID, username];
			break;

		case 'room':
			if(typeof extra === 'string') debugObj.data = extra;
			else debugObj.data = roomID;
			break;
	}

	ws.send(JSON.stringify(debugObj));
}
