/*
	Importado de notas y modificado un poquito
*/

const floatWindow = document.getElementById('floatWindow');
const theWindow = document.getElementById('window');
const windowTitle = document.getElementById('windowTitle');
const windowText = document.getElementById('windowText');
const windowInput = document.getElementById('windowInput');
const windowButtons = document.getElementById('windowButtons');
const menuButtons = document.getElementById('menuButtons');

const windowExample = 
{
	title: 'title',
	text: 'some text',
	input: true,
	//si solo va a tener un botón
	button:
	{
		text: 'some text in the button',
		callback: function(){}
	},
	//si va a tener varios botones
	buttons: 
	[
		{
			text: 'Ok',
			primary: true,
			callback: function(){}
		},
		{
			text: 'Cancel',
			primary: false,
			callback: function(){closeWindow()}
		}
	],
	//Si va a tener una lista como en el menú de notas
	list:
	[
		{
			text: 'Enemy lasagna Robust below wax',
			callback: function(){}
		},
		{
			text: 'Semiautomatic aqua',
			callback: function(){}
		}
	]
}

let thereIsAWindows = false; //También sé que está mal escrito

//Lo definimos aquí para poder borrarlo luego.
let textInputCallback;

function floatingWindow(elements)
{
	if(thereIsAWindows)
	{
		console.error('Ya hay una ventana abierta y se intenta abrir otra.', elements);
		alert(getText('errorAlert'));
		return;
	}

	thereIsAWindows = true;

	title();
	text();
	input();
	buttons();
	list();

	canInteract = false;
	floatWindow.hidden = false;

	theWindow.classList.remove('closeWin');
	theWindow.classList.add('openWin');

	floatWindow.classList.remove('closeBg');
	floatWindow.classList.add('openBg');

	function title()
	{
		windowTitle.hidden = false;

		if(elements.title !== undefined) windowTitle.innerText = elements.title;
		else windowTitle.hidden = true;
	}

	function text()
	{
		windowText.hidden = false;

		if(elements.text !== undefined) windowText.innerText = elements.text;
		else windowText.hidden = true;
	}

	function input()
	{
		if(elements.input === true)
		{
			windowInput.hidden = false;
			setTimeout(function(){windowInput.children[0].focus()},10);

			//Añadir el callback del botón principal al input para que, al presionar enter, realice la misma acción.
			if(elements.button !== undefined)
			{
				mainCallback(elements.button.callback);
			}
			else
			{
				for(let i = 0; i < elements.buttons.length; i++)
				{
					if(elements.buttons[i].primary)
					{
						mainCallback(elements.buttons[i].callback);
						break;
					}
				}
			}

			function mainCallback(callback)
			{
				textInputCallback = function(e)
				{
					if(e.key === 'Enter') callback();
				}
				windowInput.children[0].addEventListener('keypress', textInputCallback);
			}
		}
		else windowInput.hidden = true;
	}

	function buttons()
	{
		windowButtons.innerHTML = '';

		if(elements.buttons !== undefined)
		{
			for(btn of elements.buttons) createButton(btn);
		}
		else if(elements.button !== undefined)
		{
			const a = 
			{
				text: elements.button.text,
				callback: elements.button.callback,
				primary: true
			}
			createButton(a);
		}

		function createButton(a)
		{
			let button = document.createElement('button');

			if(a.primary) button.className = 'windowButtonPrincipal';
			else button.className = 'windowButtonSecondary';

			button.innerText = a.text;

			button.addEventListener('click', a.callback);

			windowButtons.appendChild(button);
		}
	}

	function list()
	{
		if(elements.list !== undefined)
		{
			menuButtons.hidden = false;

			for(let i = 0; i < elements.list.length; i++)
			{
				const article = document.createElement('article');
				const button = document.createElement('button');

				article.appendChild(button);

				button.innerText = elements.list[i].text;
				button.addEventListener('click', elements.list[i].callback);

				menuButtons.appendChild(article);
			}
		}
		else menuButtons.hidden = true;
	}
}

async function closeWindow(callback)
{
	return new Promise(function(resolve, reject)
	{
		try
		{
			theWindow.classList.remove('openWin');
			theWindow.classList.add('closeWin');
	
			floatWindow.classList.remove('openBg');
			floatWindow.classList.add('closeBg');
	
			const animationEndEvent = function(e)
			{
				try
				{
					if(e.animationName !== 'closeWindow') return;
					canInteract = true;
					thereIsAWindows = false;
			
					floatWindow.hidden = true;
					windowTitle.innerText = '';
					windowText.innerText = '';
					windowInput.hidden = true;
					windowButtons.innerHTML = '';
					windowInput.children[0].value = '';
					menuButtons.innerHTML = '';
					menuButtons.hidden = true;
					if(textInputCallback !== null) windowInput.children[0].removeEventListener('keypress', textInputCallback);
					textInputCallback = null;
		
					if(animationEndEvent !== undefined) theWindow.removeEventListener('animationend', animationEndEvent);
			
					setTimeout(function()
					{
						if(callback !== undefined && typeof callback === 'function') callback();
						resolve();
					}, 10);    
				}
				catch
				{
					reject();
				}
			}
	
			theWindow.addEventListener('animationend', animationEndEvent);    
		}
		catch
		{
			reject();
		}
	});
};

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
