document.addEventListener('DOMContentLoaded', function(event) {
	
	var characters = [
		{
			img: 'farmerHorse',
			width: 107,
			height: 96
		},
		{
			img: 'dog',
			width: 40,
			height: 40
		}
	];
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

	var newSolid = function(spec){
		/*
			OPTIONS:
				position: grid positioning
				orientation: horitzotal - vertical - corner
				color: brown - white
		*/
		
		spec = spec || {};
		var position = spec.position || {x: 0, y: 0};
		var orientation = spec.orientation || 'horitzotal';
		var color = spec.color || 'brown';
		
		var img = spec.img || 'fence';
		var solid = document.createElement('div');
		var width = spec.width || 42;
		var height = spec.height || 28;
		
		solid.className = 'solid';
		solid.style.position = 'fixed';
		
		solid.style.width = width+'px';
		solid.style.height = height+'px';
		
		solid.getPos = function(){
			return {
				x: (width * (parseInt(position.x) + 1)),
				y: (height * (parseInt(position.y) + 1))
			};
		};
		solid.style.zIndex = (solid.getPos().y / 28) * 100;

		solid.style.left = solid.getPos().x + 'px';
		solid.style.top = solid.getPos().y + 'px';
		
		//console.log('('+width+' * ('+parseInt(position.x)+' + 1)) = '+(width * (parseInt((position.x)) + 1)));
		//console.log('('+height+' * ('+parseInt(position.y)+' + 1)) = '+(height * (parseInt(position.y) + 1)));
		
		solid.style.backgroundImage = 'url(img/'+img+'.png)';
		//solid.style.border = '1px solid pink';
		
		switch (orientation) {
			case 'corner':
				solid.style.backgroundPositionX = '-10px';
				if (color === 'white') solid.style.backgroundPositionY = '-98px';
				else solid.style.backgroundPositionY = '-2px';				
				break;
			case 'verticalL':
				solid.style.backgroundPositionX = '-9px';
				solid.style.width= (width/2)+'px';
				if (color === 'white') solid.style.backgroundPositionY = '-130px';
				else solid.style.backgroundPositionY = '-34px';
				break;
			case 'verticalR':
				solid.style.backgroundPositionX = '7px';
				//solid.style.width= (width/2)+'px';
				if (color === 'white') solid.style.backgroundPositionY = '-130px';
				else solid.style.backgroundPositionY = '-34px';
				break;
			case 'horitzontal':
			default:
				solid.style.backgroundPositionX = '-42px';
				if (color === 'white') solid.style.backgroundPositionY = '-130px';
				else solid.style.backgroundPositionY = '-34px';				
		}
		
		// HitTest /////////////////////
		solid.hitTest = function(point, radius) {
			point = point || {x: 0, y: 0};
			radius = radius || 20;
			var xDist = Math.abs(this.getPos().x - point.x + width/2);
			var yDist = Math.abs(this.getPos().y - point.y + height/2);
			if (xDist < radius && yDist < radius*.72)
				return true;
			return false;
		};
		solid.hitTestX = function(point, radius){
			radius = radius || 30;
			var xDist = Math.abs(this.getPos().x - point.x);
			if (xDist < radius)
				return this.getPos().x - point.x;
			return false;
		};
		solid.hitTestY = function(point, radius){
			radius = radius || 30;
			var yDist = Math.abs(this.getPos().y - point.y);
			if (yDist < radius)
				return this.getPos().y - point.y;
			return false;
		};
		
		return solid;
	};
	
	var loadMap = function(map, color){
		var fence, type, orientation;
		map = map || [];
		color = color || 'brown';
		for (row in map) {
			for(cel in map[row]){
				type = map[row][cel];
				//console.log('['+row+','+cel+']='+type);
				if (type) {
					switch (type) {
						case 3:
							orientation = 'verticalL';
							break;
						case 4:
							orientation = 'verticalR';
							break;
						case 5:
							orientation = 'corner';
							break;
						case 1:
						default:
							orientation = 'horitzontal';
					}
					fence = newSolid({
						position: {
							x: cel,
							y: row
						},
						orientation: orientation,
						color: color
					});
					screen.appendChild(fence);
					//console.log(fence);
				}
			};
		}
		return map;
	}
	
	var newSprite = function(spec){
		spec = spec || {};
		var img = spec.img || 'personaje';
		var width = spec.width || 48;
		var height = spec.height || 72;
		var sprite = document.createElement('div');
		var position = spec.position || {x: 0, y: 0};
		if (spec.direction != 0)
			spec.direction = spec.direction || sprite.RIGHTDIR;
		
		sprite.LEFTDIR = -1;
		sprite.UPDIR = 1;
		sprite.RIGHTDIR = 2;
		sprite.DOWNDIR = 0;
		sprite.z = 50;
		
		sprite.setDirection = function(direction){
			if (direction != 0)
				spec.direction = direction || sprite.RIGHTDIR;
			else spec.direction = 0;
			sprite.style.backgroundPositionY = (height * spec.direction)+'px';
		};
		sprite.getDirection = function(){
			return spec.direction;
		};
		sprite.setDirection(spec.direction);
				
		sprite.style.position = 'fixed';
		sprite.style.width = width + 'px';
		sprite.style.height = height + 'px';
		sprite.style.backgroundImage = 'url(img/'+img+'.png)';
		//sprite.style.border = '1px solid red';
		
		var setPosition = function(point) {
			point = point || {};
			position.x = point.x || position.x;
			position.y = point.y || position.y;
			
			//if ((position.x - (width/2)) === 0)
			if (point.x === 0) position.x--;
			sprite.style.top = (position.y - (height/2)) + 'px';
			sprite.style.left = (position.x - (width/2)) + 'px';
		};
		sprite.getPosition = function(){
			return {
				x: position.x,
				y: position.y
			};
		};
		
		sprite.getWidth = function(){
			return width;
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
					x: ((point.x - position.x) / 7),
					y: ((point.y - position.y) / 7)
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

		sprite.walk = function(speed, remove){
			speed = speed || {};
			speed.x = speed.x || 0;
			speed.y = speed.y || 0;
			for (solid in solids) {
				if (typeof solids[solid].hitTest == 'function') {
					if (solids[solid].hitTest({
						x: position.x + speed.x,
						y: position.y + speed.y
					})){
						if (remove) {
							//sprite.remove();
							speed = {
								x: speed.x/3,
								y: speed.y/3
							};
						} else {
							speed = {x: 0, y:0};
							return;
						}
					}
				}
			}
			sprite.setOffset(speed);
			sprite.style.backgroundPositionX = sprite.anime+'px';
			if(Math.floor(sprite.getPosition().x + sprite.getPosition().y) % 5 === 0){
				sprite.anime += sprite.getWidth();
			}
			if (position.x > screenx + 10 || position.x < -10 ||
				position.y > screeny + 10 || position.y < -10){
				if (remove) {
					clearInterval(sprite.mv);
					//sprite.parentNode.removeChild(sprite);
					sprite.remove();
				} else {
					clearInterval(sprite.mv);
				}
			}
			sprite.style.zIndex = ((position.y / 28) * 100 ) + sprite.z;
			//console.log((sprite.getPosition().x + sprite.getPosition().y) + ' % 5 = ' + (Math.floor(sprite.getPosition().x + sprite.getPosition().y) % 5) + ' :: ' + Math.floor(speed*0.7));
		};		
		
		setPosition();
		return sprite;
	};
	
	var newShit = function(spec){
		var shit = newSprite(spec);
		shit.z = 40;
		shit.speed = 9;
		shit.anime = 0;
		shit.style.zIndex = spec.zIndex || -10;
		switch (spec.direction) {
			case shit.RIGHTDIR:
				shit.setDirection(shit.RIGHTDIR);
				shit.mv = setInterval(function(){
					shit.walk({x: +shit.speed}, true);
				}, fpsRatio);
				break;
			case shit.DOWNDIR:
				shit.setDirection(shit.DOWNDIR);
				shit.mv = setInterval(function(){
					shit.walk({y: +shit.speed}, true);
				}, fpsRatio);
				break;
			case shit.LEFTDIR:
				shit.setDirection(shit.LEFTDIR);
				shit.mv = setInterval(function(){
					shit.walk({x: -shit.speed}, true);
				}, fpsRatio);
				break;
			case shit.UPDIR:
				shit.setDirection(shit.UPDIR);
				shit.mv = setInterval(function(){
					shit.walk({y: -shit.speed}, true);
				}, fpsRatio);
				break;
			default:
				shit.setDirection(shit.RIGHTDIR);
		}
		return shit;
	};
	
	var newPlayer = function(spec){
		var player = newSprite(spec);
		player.className = 'player';
		speed = spec.speed || 3;
		// Key Definition:
		player.LEFT = 37;
		player.UP = 38;
		player.RIGHT = 39;
		player.DOWN = 40;
		player.FIRE = 32;
		player.BOMB = 38;//9;
				
		player.shitIt = function(){
			var shit = newShit({
				img: 'rasen',
				width: 52,
				height: 50,
				position: player.getPosition(),
				direction: player.getDirection(),
				zIndex: player.zIndex
			});
			screen.appendChild(shit);
		};
		// movement tokens
		player.anime = 0;		
		var mvleft, mvup, mvright, mvdown, mvfire, mvanime;
		var shooterSpeed = 333;
		document.onkeydown = function (e) {
			// console.log(e);
			switch(e.keyCode) {
				case player.LEFT:
					if (mvleft) break;
					player.setDirection(player.LEFTDIR); // Bacground Position to the left
					player.style.backgroundPositionX = player.getWidth() + 'px';
					mvleft = setInterval(function(){
						player.walk({x: -speed});
					}, fpsRatio);
					break;
				case player.UP:
					if (mvup) break;
					player.setDirection(player.UPDIR); // Bacground Position to the left
					player.style.backgroundPositionX = player.getWidth() + 'px';
					mvup = setInterval(function(){
						player.walk({y: -speed});
					}, fpsRatio);
					break;
				case player.RIGHT:
					if (mvright) break;
					player.setDirection(player.RIGHTDIR); // Bacground Position to the right
					player.style.backgroundPositionX = player.getWidth() + 'px';
					mvright = setInterval(function(){
						player.walk({x: +speed});
					}, fpsRatio);
					break;
				case player.DOWN:
					if (mvdown) break;
					player.setDirection(player.DOWNDIR); // Bacground Position to the left
					player.style.backgroundPositionX = player.getWidth() + 'px';
					mvdown = setInterval(function(){
						player.walk({y: +speed});
					}, fpsRatio);
					break;
				case player.FIRE:
					if (mvfire) break;
					player.shitIt();
					mvfire = setInterval(function(){
						player.shitIt();
					}, shooterSpeed);
					break;
				case player.BOMB:
					break;
				default:
			}
		};
		document.onkeyup = function (e) {
			switch(e.keyCode) {
				case player.LEFT:
					clearInterval(mvleft);
					mvleft = undefined;
					player.style.backgroundPositionX = '0px';
					break;
				case player.UP:
					clearInterval(mvup);
					mvup = undefined;
					player.style.backgroundPositionX = '0px';
					break;
				case player.RIGHT:
					clearInterval(mvright);
					mvright = undefined;
					player.style.backgroundPositionX = '0px';
					break;
				case player.DOWN:
					clearInterval(mvdown);
					mvdown = undefined;
					player.style.backgroundPositionX = '0px';
					break;
				case player.FIRE:
					clearInterval(mvfire);
					mvfire = undefined;
					break;
				case player.BOMB:
					break;
				default:
			}
		};
		return player;
	};
	
	
	var solids = document.getElementsByClassName('solid');
	var dani = newPlayer({position: {x:50, y:300}, speed: 6});
	screen.appendChild(dani);
	/*var dog = newSprite({
		img: characters[1].img,
		width: characters[1].width,
		height: characters[1].height,
		position: {
			x:333,
			y:200
		},
		speed: 9
	})
	screen.appendChild(dog);
	setInterval(function(){
		dog.walk({x: dog.speed});
	}, fpsRatio)
	*/

	loadMap([
		[1,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5],
		[0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,3,0,0,5,1,1,1,1,3,0,0,0,3,0,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,3,0,0,0,0,0,0,0,5,1,5,0,5,5,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,1,1,1,1,1,5,0,0,3,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,3,0,0,0,0,4,1,1,1,0,0,0,0,5,1,1,1,1,1,1,1,1,5,0,0,4],
		[0,0,0,0,1,1,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,3,0,0,4,1,1,1,1,5,0,0,0,0,5,1,1,1,1,1,1,1,1,5,0,0,4],
		[0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,3,0,0,0,0,0,0,0,6,1,5,0,5,6,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,1,1,1,1,1,1,5,0,0,0,4,0,3,0,0,0,0,0,0,0,0,0,4,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,4,1,1,1,5,0,5,1,1,1,1,1,1,1,1,1,5,0,0,4],
		[0,0,0,0,5,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,3,0,5,1,5,0,5,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,4],
		[0,0,0,0,3,0,0,0,4,0,4,0,0,4,0,0,3,0,0,0,0,0,4,0,0,0,0,0,0,4],
		[0,0,0,0,3,0,0,0,4,0,4,0,0,4,0,0,3,0,0,0,0,0,4,0,0,0,0,0,0,4],
		[0,0,0,0,1,1,1,1,5,0,4,0,0,4,0,0,3,0,0,0,0,0,4,0,0,0,0,0,0,4],
		[0,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,4],
		[0,0,0,0,5,1,1,1,1,1,5,0,0,4,0,0,3,0,0,0,0,0,4,0,0,0,0,0,0,4],
		[0,0,0,0,3,0,0,0,0,0,0,0,0,4,0,0,3,0,0,0,0,0,4,0,0,0,0,0,0,4],
		[0,0,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5],
	], 'brown');
});