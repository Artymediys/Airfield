module.exports = class Vec2
{
	constructor(x, y)
	{
		this.set(x, y);
	}

	copy()
	{
		return new Vec2(this.x, this.y);
	}

	withY(val)
	{
		return new (require("./vec3")) (this.x, val, this.y);
	}

	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	_operation(binaryFunc)
	{
		return (x, y) =>
		{
			if(y !== undefined)
			{
				binaryFunc(x, y);
				return this;
			}

			if(x.x != undefined && x.y != undefined)
			{
				binaryFunc(x.x, x.y)
				return this;
			}

			binaryFunc(x, x);
			return this;
		}
	}

	set = this._operation((x, y) =>
	{
		this.x = x;
		this.y = y;
	});

	add = this._operation((x, y) =>
	{
		this.x += x;
		this.y += y;
	});

	sub = this._operation((x, y) =>
	{
		this.x -= x;
		this.y -= y;
	});

	mul = this._operation((x, y) =>
	{
		this.x *= x;
		this.y *= y;
	});

	div = this._operation((x, y) =>
	{
		this.x /= x;
		this.y /= y;
	});

	normalize()
	{
		return this.mul(1 / this.length());
	}

	dot(v)
	{
		return this.x * v.x + this.y * v.y;
	}

	// https://stackoverflow.com/questions/243945/calculating-a-2d-vectors-cross-product
	cross(v)
	{
		return this.x * v.y - v.x * this.y;
	}

	_lineOperation(unaryFunc)
	{
		return (a, b) =>
		{
			if(b !== undefined)
			{
				return unaryFunc.bind(this.copy().sub(a)) (b.copy().sub(a));
			}

			return unaryFunc(a);
		}
	}

	// https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
	// res > 0 - under
	// res = 0 - on
	// res < 0 - above
	interpos = this._lineOperation(line =>
	{
		return this.cross(line);
	});

	// https://stackoverflow.com/questions/61341712/calculate-projected-point-location-x-y-on-given-line-startx-y-endx-y
	projectClamped(a, b)
	{
		const ap = this.copy().sub(a);
		const ab = b.copy().sub(a);

		return a.copy()
			.add(ab
				.mul( Math.max(0.0, Math.min(1.0, ap.dot(ab) / ab.dot(ab)) )));
	}
}