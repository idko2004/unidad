const ws = new WebSocket(url);

ws.addEventListener('open', function(e)
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
				location.reload();
			}
		}
	})
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

		case 'grabCard':
			grabCard(response);
			break;
	}
}
