
const logsDiv = document.getElementById('logsDiv');
let messageLog = [];
let messagesPending = [];
let updateMessageJob;
let waitMessageTime = 1_200;
let lastMessageChanged;

function newMessages(messages)
{
	console.log('newMessages', messages);
	if(!Array.isArray(messages)) return;

	messagesPending = messages;
	messageLog.push(...messages);

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



logsDiv.addEventListener('click', function()
{
	if(thereIsAWindows) return;

	let text = '';
	if(messageLog.length === 0)
	{
		text = 'El registro está vacío';
	}
	else for(let i = messageLog.length - 1; i >= 0; i--)
	{
		console.log('messageLog', i);
		text += `${i+1}: ${messageLog[i]}\n\n`;
	}

	floatingWindow(
	{
		title: 'Registro',
		text,
		button:
		{
			text: 'Cerrar',
			callback: closeWindow
		}
	});
});
