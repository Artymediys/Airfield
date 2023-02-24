module.exports = class Plane
{
	constructor(manager, id, pos, speed)
	{
		this._manager = manager;

		this.id = id;
		this.pos = pos;
		this.speed = speed;
	}

	copy()
	{
		const planeCopy = new Plane(this._manager, this.id, this.pos.copy(), this.speed);
		
		if(this.dest)
		{
			planeCopy.dest = this.dest.copy();
		}

		return planeCopy;
	}

	async update()
	{
		return this._manager.updatePlane(this);
	}

	setDestination(pos, notify)
	{
		this.dest = pos;

		if(notify)
		{
			this._manager.setPlaneDestination(this, pos);
		}
	}

	setOperator(operatorName)
	{
		this._manager.setPlaneOperator(this, operatorName);
	}
}