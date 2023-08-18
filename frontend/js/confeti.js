let confeti = [];

let numberOfConfeti = (innerWidth * 2) / remSize;

let confetiDeltaTime = 1000/30;
let v = 0;

const confetiContainer = document.getElementById('confetiContainer');

function generateConfeti()
{
	for(let i = 0; i < numberOfConfeti; i++)
	{
		const div = document.createElement('div');
		div.classList.add('confeti');
		confetiContainer.appendChild(div);

		confeti.push(
		{
			element: div,
			x: 0,
			y: 0,
			rx: 0,
			ry: 0,
			rz: 0,
			e: 0
		});
	}
	randomizeConfeti();
}

function randomizeConfeti()
{
	const colors = ['#1c71d8', '#2ec27e', '#f5c211', '#c01c28', '#c01c28', '#f5c211', '#2ec27e', '#1c71d8'];
	for(let i = 0; i < confeti.length; i++)
	{
		confeti[i].x = randomRange(0, innerWidth);
		confeti[i].y = -50;
		confeti[i].e = Math.random();
		if(confeti[i].e < 0.1) confeti[i].e += 1 * Math.random();
		confeti[i].rx = randomRange(0, 360);
		confeti[i].ry = randomRange(0, 360);
		confeti[i].rz = randomRange(0, 360);
		confeti[i].element.style.backgroundColor = colors[randomRange(0, colors.length - 1)];
	}
}

function moveConfeti()
{
	let currentX = 0;
	let currentY = 0;
	let currentRx = 0;
	let currentRy = 0;
	let currentRz = 0;
	let positiveX = 0;
	let negativeX = 0;
	let newX = 0;
	let newY = 0;
	let newRx = 0;
	let newRy = 0;
	let newRz = 0;
	let e = 0;

	for(let i = 0; i < confeti.length; i++)
	{
		currentX = confeti[i].x;
		currentY = confeti[i].y;
		currentRx = confeti[i].rx;
		currentRy = confeti[i].ry;
		currentRz = confeti[i].rz;
		e = confeti[i].e;

		negativeX = randomRange(0, 10);
		positiveX = randomRange(0, 10);
		newX = currentX + (positiveX - negativeX) * e * v;
		newY = currentY + (remSize * 1.5) * e * v;
		newRx = Math.round(currentRx + randomRange(0, 30) * e * v);
		newRy = Math.round(currentRy + randomRange(0, 30) * e * v);
		newRz = Math.round(currentRz + randomRange(0, 30) * e * v);

		if(newY > innerHeight + 10)
		{
			newY = -10 - randomRange(0, 20);
			newX = randomRange(0, innerWidth);
		}
		if(newX > innerWidth + 10) newX -= innerWidth - 10;
		if(newRx > 360) newRx -= 360;
		if(newRy > 360) newRy -= 360;
		if(newRz > 360) newRz -= 360;
		
		confeti[i].x = newX;
		confeti[i].y = newY;
		confeti[i].rx = newRx;
		confeti[i].ry = newRy;
		confeti[i].rz = newRz;
	}

	v += confetiDeltaTime / 1000;
	if(v > 1) v = 1;
}

function updateConfeti()
{
	let x = 0;
	let y = 0;
	let rx = 0;
	let ry = 0;
	let rz = 0;
	for(let i = 0; i < confeti.length; i++)
	{
		x = confeti[i].x;
		y = confeti[i].y;
		rx = confeti[i].rx;
		ry = confeti[i].ry;
		rz = confeti[i].rz;
		confeti[i].element.style.transform = `translate(${x}px,${y}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
	}
}

function startConfetiLoop()
{
	setInterval(function()
	{
		updateConfeti();
		moveConfeti();
	}, confetiDeltaTime);
}

function randomRange(min, max)
{
	if(max === undefined)
	{
		console.log('random.range: no se ha especificado el valor máximo');
		return null;
	}
	if(min === undefined) min = 0;

	let n = max ** 2;

	let r = Math.floor(Math.random() * (n - min) + min);

	while(r > max)
	{
		r -= max;
	}

	if(r < min)
	{
		console.log('colors.range: resultado es < min');
		r = max - 1;
	}

	if(r > max)
	{
		console.log('colors.range: el resultado es > max');
		r = min;
	}

	return r;
}