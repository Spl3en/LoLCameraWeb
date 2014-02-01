function Vector2D (x, y, weight)
{
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.weight = weight || 1.0;
	
	this.setPos = function (x, y) {
		this.x = x;
		this.y = y;
	};
	
	this.setPosSmooth = function (x, y, speed, threshold) {
		var dx = x - this.x;
		var dy = y - this.y;
		
		// Smoothing
		if (Math.abs(dx) > threshold)
			this.x += (dx) * speed;
		if (Math.abs(dy) > threshold)
			this.y += (dy) * speed;
	};
	
	this.setPosSmoothSpeed = function (x, y, speed, speedBoost, threshold) {
		var dx = x - this.x;
		var dy = y - this.y;
		
		// Scroll speed
		var between = this.distance(new Vector2D(x, y));
		if (between > threshold)
			speed *= ((between - threshold) * speedBoost);

		// Smoothing
		if (Math.abs(dx) > threshold)
			this.x += (dx) * speed;
		if (Math.abs(dy) > threshold)
			this.y += (dy) * speed;
	};
			
	
	this.add = function (targetX, targetY) {
		this.x += targetX;
		this.y += targetY;
	};
	
	this.distance = function (v2) {
		return (
			Math.sqrt(
				 Math.pow(this.x - v2.x, 2) +
				 Math.pow(this.y - v2.y, 2)
			)
		);
	};
	
	this.debug = function (object) {
		console.log((object || "null") + " : {" + this.x + ", " + this.y + "}");
	};
}