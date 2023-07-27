const colors = require('colors');

function range(min, max)
{
	if(max === undefined)
	{
		console.log(colors.red('random.range: no se ha especificado el valor máximo'));
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
		console.log(colors.yellow('colors.range: resultado es < min'));
		r = max - 1;
	}

	if(r > max)
	{
		console.log(colors.yellow('colors.range: el resultado es > max'));
		r = min;
	}

	return r;
}

module.exports =
{
	range
}