$(window).load(function ()
{
	/* Champion Class */
	function Champion (x, y) {
		this.speed = 0.01;
		this.vec2D = new Vector2D(x, y, 1.0);
		this.dest = new Vector2D(this.vec2D.x, this.vec2D.y, 1.0);
		this.$ = $("#champion");
		
		this.setPos = function (x, y) {
			this.$.css({
				left : (x - this.$.width()/2), 
				top  : (y - this.$.height()), 
				position : 'relative'
			});
		};
		
		/**
		 *	Set position champion with a smooth factor
		 */
		this.setPosSmooth = function (x, y) {
			this.vec2D.setPosSmooth(x, y, this.speed, 10.0);
			this.setPos(this.vec2D.x, this.vec2D.y);
		};
		
		/**
		 *	Order to the entity to move to move to a certain point
		 */
		this.go = function (x, y) {
			if (LoLCamera.map.inBound(x, y)) {
				this.dest.setPos(x, y);
			}
		};
		
		this.update = function () {
			this.setPosSmooth(this.dest.x, this.dest.y);
		};
	}
	
	function Mouse (x, y)  {
		this.vec2D = new Vector2D(x, y, 1.0);
		this.$ = $("#mouse");
		
		this.update = function () {
			var lastDistance = LoLCamera.camera.lastDistance;
			
			if (lastDistance.x <= 1000.0 && lastDistance.y <= 1000.0)
			{
				this.vec2D.add(lastDistance.x, lastDistance.y);
				this.setPos(this.vec2D.x, this.vec2D.y);
			}
		};
		
		this.setPos = function (x, y) {
			this.vec2D.setPos(x, y);
			this.$.css({
				left : (x), 
				top  : (y), 
				position : 'relative'
			});
		};
		
		this.onMove = function (x, y) {
			var pos = LoLCamera.getWorldPos(x, y);
			this.setPos(pos.x, pos.y);
		};
	}
	
	var LoLCamera = new function ()
	{
		var LoLCamera = this;
		
		this.map = new function () {
			this.w = $("#map").width();
			this.h = $("#map").height();
			
			this.inBound = function (x, y) {
				return (
					(x >= 0 && x <= LoLCamera.map.w)
				&&	(y >= 0 && y <= LoLCamera.map.h)
				);
			};
		};
		
		this.champ = new Champion(this.map.w / 2, this.map.h / 2);
		this.mouse = new Mouse(this.champ.vec2D.x, this.champ.vec2D.y);

		this.camera = new function () 
		{
			this.speed = 0.01;
			this.threshold = 50.0;
			this.smoothSpeed = 0.03;
			
			this.$ = $('#screen');
			this.vec2D = new Vector2D (
				// Focused on champion by default
				LoLCamera.champ.vec2D.x, LoLCamera.champ.vec2D.y, 1.0
			);
			this.last = new Vector2D(this.$.scrollLeft(), this.$.scrollTop());
			this.lastDistance = new Vector2D();
			
			this.setScrollPos = function (x, y) {
				this.vec2D.x = x;
				this.vec2D.y = y;
				this.$.scrollLeft(x - ($(window).width() / 2));
				this.$.scrollTop (y - ($(window).height() / 2));
			};
			
			this.setPos = function (x, y) {
				this.setScrollPos(x, y);
			};
			
			this.setPosSmoothSpeed = function (x, y) {
				this.vec2D.setPosSmoothSpeed(x, y, this.smoothSpeed, this.speed, this.threshold);
				this.setPos(this.vec2D.x, this.vec2D.y);
			};
			
			this.update = function () {
				var mouse = LoLCamera.mouse.vec2D;
				var champ = LoLCamera.champ.vec2D;
				var dest  = LoLCamera.champ.dest;
				var weight_sum = mouse.weight + champ.weight + dest.weight;
				
				var cur = {
					x : this.$.scrollLeft(),
					y : this.$.scrollTop()
				};
				
				this.lastDistance.setPos(cur.x - this.last.x, cur.y - this.last.y);
				this.last.copy(cur);
				
				this.setPosSmoothSpeed (
					(   ((mouse.x) * mouse.weight)
					  +	((champ.x) * champ.weight)
					  +	((dest.x)  * dest.weight)
					) / weight_sum,
					
					(   ((mouse.y) * mouse.weight)
					  +	((champ.y) * champ.weight)
					  +	((dest.y)  * dest.weight)
					) / weight_sum
				);
			}
		};
		
		this.getWorldPos = function (x, y) {
			return {
				x : this.camera.vec2D.x - ($(window).width()  / 2) + x,
				y : this.camera.vec2D.y - ($(window).height() / 2) + y
			};
		}
	};
	
	// DRAW
	function update () {
		LoLCamera.camera.update();
		LoLCamera.champ.update();
		LoLCamera.mouse.update();
	}
	setInterval(update, 1000.0 / 60.0);
	
	$(document).mousemove(function(event) {
		LoLCamera.mouse.onMove(event.pageX, event.pageY);
	});
	
	$(document).hover(function(event) {
		LoLCamera.mouse.onMove(event.pageX, event.pageY);
	});
	
	$(document).click(function(event) {
		var pos = LoLCamera.getWorldPos(event.pageX, event.pageY);
		LoLCamera.champ.go(pos.x, pos.y);
	});
	
	$(document).scroll(function(event) {
		// Do nothing
		event.stopPropagation();
	});
	$(document).scroll(function(event) {
		// Do nothing
		event.stopPropagation();
	});
});