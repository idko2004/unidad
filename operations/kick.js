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
	let playersList = Object.keys(room.players);
	if(!playersList.includes(whoToKick))
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



	//Rearmar la lista de jugadores que quedan
	let remainingPlayers = [];
	for(let i = 0; i < playersList.length; i++)
	{
		if(playersList[i] !== whoToKick) remainingPlayers.push(playersList[i]);
	}



	//Si no queda nadie en la sala simplemente borrarla
	if(remainingPlayers.length === 0)
	{
		ws.send(JSON.stringify(
		{
			operation: 'playerKicked',
			remainingPlayers: [],
			nowYoureMaster: false
		}));
		delete game.activeGames[roomID];
		console.log('Sala borrada porque todos fueron expulsados');
		return;
	}



	//Si quien ha sido expulsado es gameMaster, asignar otro
	if(whoToKick === room.master) room.master = remainingPlayers[0];



	//Responder a todos
	for(let i = 0; i < playersList.length; i++)
	{
		room.players[playersList[i]].ws.send(JSON.stringify(
		{
			operation: 'playerKicked',
			remainingPlayers,
			nowYoureMaster: playersList[i] === room.master
		}));
	}



	//Eliminar el perfil del jugador
	delete game.activeGames[roomID].players[whoToKick];



	console.log('Player kicked');
}