document.addEventListener('DOMContentLoaded', function(event) {
	//CONFIG:
	//fps
	var fps = 30;
	// END OF CONFIG
	// Disable mouse interaction
	document.onmousedown = function(){ return false; };
	//general setting
	var screen = document.getElementsByTagName('body')[0];
	screen.style.backgroundImage = 'url(img/grass.png)';
	var screenx = window.innerWidth || document.documentElement.clientWidth || screen.clientWidth;
	var screeny = window.innerHeight|| document.documentElement.clientHeight || screen.clientHeight;
	screen.style.width = screenx*.96+'px';
	screen.style.height = screeny*.95+'px';

	var fpsRatio = 1000/fps;	

	
	var newSprite = function(spec){
		spec = spec || {};
		var img = spec.img || 'manu.png';
		var width = spec.width || 48;
		var height = spec.height || 48;
		var sprite = document.createElement('div');
		var position = spec.position || {x: 0, y: 0};
		
		sprite.style.position = 'fixed';
		sprite.style.width = width + 'px';
		sprite.style.height = height + 'px';
		sprite.style.backgroundImage = 'url(img/'+img+')';
		//sprite.style.border = '1px solid red';
		
		var setPosition = function(point) {
			point = point || {};
			position.x = point.x || position.x;
			position.y = point.y || position.y;
			
			sprite.style.top = (position.y - (height/2)) + 'px';
			sprite.style.left = (position.x - (width/2)) + 'px';
		};
		
		sprite.setOffset = function(point){
			point = point || {};
			point.x = point.x || 0;
			point.y = point.y || 0;
			setPosition({
				x: position.x + point.x,
				y: position.y + point.y
			});
		};
		
		sprite.move = function(point){
			point = point || {};
			point.x = point.x || position.x;
			point.y = point.y || position.y;
			if (sprite.mv) {
				clearInterval(sprite.mv);
				sprite.mv = undefined;
			}
			sprite.anime = 0;
			sprite.mv = setInterval(function(){
				sprite.setOffset({
					x: ((point.x - position.x) / 33),
					y: ((point.y - position.y) / 33)
				});
				sprite.style.backgroundPosition = sprite.anime+'px 0px';
				if(Math.floor(position.x + position.y) % 5 === 0) sprite.anime += width;
				if ((Math.abs(point.x - position.x) < 2)
					&& Math.abs(point.y - position.y) < 2) {
					setPosition({
						x: point.x,
						y: point.y
					});
					sprite.anime = 0;
					clearInterval(sprite.mv);
				}
			},fpsRatio);
		};
		
		setPosition();
		return sprite;
	};
	
	var manu = newSprite({position: {x:333, y:200}});
	screen.appendChild(manu);
	screen.onclick = function(e){		
		manu.move({
			x: e.clientX,
			y: e.clientY
		});
	};
/*
	document.body.onclick = function(e){
		console.log(e);
	};
	document.body.onkeydown = function(e){
		console.log(e);
	};
*/		
		
		
		
		
		
		
		
		

});