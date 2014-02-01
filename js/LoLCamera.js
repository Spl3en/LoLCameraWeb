$(window).load(function ()
{
	function Champion (x, y) {
		this.v = new Vector2D(x, y, 1.0);
		this.$ = $("#champion");
		
		this.setPos = function (x, y) {
			if (LoLCamera.map.inBound(x, y))
			{
				this.v.setPos(x, y);
				this.$.css({
					left : (x - this.$.width()/2), 
					top  : (y - this.$.height()), 
					position : 'relative'
				});
			}
		};
		
		this.draw = function () {
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
		this.mouse = new Vector2D(this.champ.v.x, this.champ.v.y, 1.0);

		this.camera = new function () 
		{
			this.$ = $('#screen');
			this.vec2D = new Vector2D (
				// Focused on champion by default
				LoLCamera.champ.v.x, LoLCamera.champ.v.y, 1.0
			);
			
			this.setScrollPos = function (x, y) {
				this.vec2D.x = x;
				this.vec2D.y = y;
				this.$.scrollLeft(x - ($(window).width() / 2));
				this.$.scrollTop (y - ($(window).height() / 2));
			};
			
			this.setPos = function (x, y) {
				if (x > 0 && y > 0) {
					var dx = x - this.vec2D.x;
					var dy = y - this.vec2D.y;
					this.setScrollPos(x, y);
					LoLCamera.mouse.add(dx, dy);
				}
			};
			
			this.setPosSmooth = function (x, y) {
				var speed = 0.03;
				var threshold = 100.0;
				var dx = x - this.vec2D.x;
				var dy = y - this.vec2D.y;
				
				// Scroll speed
				var dist_target_cam = new Vector2D(x, y).distance(this.vec2D);
				if (dist_target_cam > threshold)
					speed *= ((dist_target_cam - threshold) * 0.03);

				// Smoothing
				x = this.vec2D.x;
				y = this.vec2D.y;
				if (Math.abs(dx) > threshold)
					x += (dx) * speed;
				if (Math.abs(dy) > threshold)
					y += (dy) * speed;
				
				this.setPos(x, y);
			};
		};
		
		this.setWorldPos = function (entity, x, y) {
			entity.setPos(
				this.camera.vec2D.x - ($(window).width()  / 2) + x, 
				this.camera.vec2D.y - ($(window).height() / 2) + y
			);
		}
	};
	
	// DRAW
	function main ()
	{
		var mouse = LoLCamera.mouse;
		var champ = LoLCamera.champ.v;
		var weight_sum = mouse.weight + champ.weight;
		
		LoLCamera.camera.setPosSmooth (
			(   ((mouse.x) * mouse.weight)
			  +	((champ.x) * champ.weight)
			) / weight_sum,
			
			(   ((mouse.y) * mouse.weight)
			  +	((champ.y) * champ.weight)
			) / weight_sum
		);
	}
	setInterval(main, 1000.0 / 60.0);
	
	$(document).mousemove(function(event) {
		LoLCamera.setWorldPos(LoLCamera.mouse, event.pageX, event.pageY);
	});
	
	$(document).click(function(event) {
		LoLCamera.setWorldPos(LoLCamera.champ, event.pageX, event.pageY);
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