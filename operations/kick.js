const game = require('../utils/game');

module.exports = function(dataObject, ws)
{
	/*
	Requisitos:
	{
		operation: 'kickPlayer',
		roomID,
		key,
		kick: //Nombre de la persona a la que expulsar
	}
	Respuesta a todos:
	{
		operation: 'playerKicked',
		remainingPlayers: [],
		nowYoureMaster: false
	}
	*/
	
	const roomID = dataObject.roomID;
	const key = dataObject.key;
	const whoToKick = dataObject.kick;
	if([roomID, key, whoToKick].includes(undefined))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'badRequest'
		}));
		console.log('errorPlaying: badRequest: roomID, key o kick es undefined');
		return;
	}



	//Obtener la sala
	const room = game.activeGames[roomID];
	if(room === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom');
		return;
	}



	//Obtener el nombre de quién realiza la solicitud
	const username = room.keys[key];
	if(username === undefined)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: el usuario no forma parte e la sala');
		return;
	}



	//Esta variable determinará si se puede expulsar al jugador
	let canBeKicked = false;

	//Si el usuario es gameMaster, puede expulsar a cualquiera
	if(room.master === username) canBeKicked = true;

	//Si el usuario quiere expulsarse a sí mismo, también puede
	if(username === whoToKick) canBeKicked = true;

	if(!canBeKicked)
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: En realidad, no se tiene la autoridad necesaria para expulsar a alguien');
		return;
	}



	//Comprobar si a quién se quiere eliminar está en la sala
	if(!room.order.includes(whoToKick))
	{
		ws.send(JSON.stringify(
		{
			operation: 'errorPlaying',
			error: 'invalidRoom'
		}));
		console.log('errorPlaying: invalidRoom: No se puede expulsar a alguien que no existe');
		return;
	}



	//Devolver sus cartas a la mesa
	room.table.push(...room.players[whoToKick].deck);



	//Eliminar el perfil del jugador
	delete game.activeGames[roomID].players[whoToKick];



	//Eliminar el jugador de room.order
	let newOrder = [];
	for(let i = 0; i < room.order.length; i++)
	{
		if(room.order[i] !== whoToKick) newOrder.push(room.order[i]);
	}
	room.order = newOrder;



	//Si quien ha sido expulsado es gameMaster, asignar otro
	if(whoToKick === room.master) room.master = room.order[0];



	//Responder a todos
	for(let i = 0; i < room.order.length; i++)
	{
		room.players[room.order[i]].ws.send(JSON.stringify(
		{
			operation: 'playerKicked',
			remainingPlayers: room.order,
			nowYoureMaster: room.order[i] === master
		}));
	}

	console.log('Player kicked');
}