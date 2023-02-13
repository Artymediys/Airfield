const Vec2 = require("./vec2");

module.exports = class Vec3
{
	constructor(x, y, z)
	{
		this.set(x, y, z);
	}

	fuzzyEquals(v, epsilon)
	{
		return this.x < v.x + epsilon && this.x > v.x - epsilon &&
			this.y < v.y + epsilon && this.y > v.y - epsilon &&
			this.z < v.z + epsilon && this.z > v.z - epsilon;
	}

	copy()
	{
		return new Vec3(this.x, this.y, this.z);
	}

	horizontal()
	{
		return new Vec2(this.x, this.z);
	}

	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	_operation(trinaryFunc)
	{
		return (x, y, z) =>
		{
			if(y !== undefined && z !== undefined)
			{
				trinaryFunc(x, y, z);
				return this;
			}

			if(x instanceof Vec3) // TODO: any object with xyz
			{
				trinaryFunc(x.x, x.y, x.z)
				return this;
			}

			trinaryFunc(x, x, x);
			return this;
		}
	}

	set = this._operation((x, y, z) =>
	{
		this.x = x;
		this.y = y;
		this.z = z;
	});

	add = this._operation((x, y, z) =>
	{
		this.x += x;
		this.y += y;
		this.z += z;
	});

	sub = this._operation((x, y, z) =>
	{
		this.x -= x;
		this.y -= y;
		this.z -= z;
	});

	mul = this._operation((x, y, z) =>
	{
		this.x *= x;
		this.y *= y;
		this.z *= z;
	});

	div = this._operation((x, y, z) =>
	{
		this.x /= x;
		this.y /= y;
		this.z /= z;
	});

	normalize()
	{
		return this.div(this.length());
	}
}