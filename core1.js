document.addEventListener('DOMContentLoaded', function(event) {
   
   document.onmousedown = function (){return false;}; //Desactivo las funciones interactivas del raton
   var fps = 30; 

   var pantalla = document.getElementsByTagName('body')[0]; //Capturo el body del codigo

   pantalla.style.backgroundImage = 'url(img/grass.png)' //Indicamos el fondo que tendra el juego
   var ancho = window.innerWidth || document.documentElement.clientWidth || screen.clientWidth; //Buscamos el ancho dependiendo del tamaño de la pantalla o del navegador
   var alto = window.innerHeight|| document.documentElement.clientHeight || screen.clientHeight;//Buscamos el alto dependiendo del tamaño de la pantalla o del navegador
   pantalla.style.width = ancho+'px'; //Asignamos el ancho
   pantalla.style.height = alto + 'px'; //Asignamos lo alto

   var fpsRatio = 1000/fps; //Es la relacion de desplazamiento del personaje

   var newSolid = function(spec){
   		spec = spec || {};
   		var posicion = spec.posicion || {x:0, y:0};

   };


   var newWarrior = function(spec){
   	spec = spec || {}; //La variable spec seran los parametros que le pasemos si pasa o sino estara vacia
   	var img = spec.img || 'personaje.png' //Asignamos la imagen que le pasemos o si no la predeterminada por nosotros
   	var anchoSprite = spec.width || 48; //Ancho de cada pose del sprite
   	var altoSprite = spec.height || 72; //Alto de cada pose del sprite
   	var sprite = document.createElement('div'); //Creamos el objeto div
   	var posicion = spec.posicion || {x: 0, y:0}; //Asignamos la posicion inicial en la cual aparecera nuestro personaje

   	sprite.LEFTDIR = -1; //Indicamos posicion del sprite que cogemos
   	sprite.UPDIR = 1; //
   	sprite.RIGHTDIR = 2; //
   	sprite.DOWNDIW = 0; //

   	sprite.setDirection = function(direction){ //Asignamos la direccion en la que queremos que se encuentre el sprite
   		if (direction != 0)
   			spec.direction = direction || sprite.RIGHTDIR;
   		else
   			spec.direction = 0;
   	};

   	sprite.getDirection = function(){ //Devuelve la direccion en la que se encuentra el Sprite
   		return sprite.direction;
   	};

   	sprite.setDirection(spec.direction); //Llamamos a la funcion para asignarle una direccion al sprite

   	sprite.style.position = 'fixed'; //Indicamos el posicionamiento del sprite
   	sprite.style.width = ancho + 'px'; //Indicamos el posicionamiento del sprite respecto al ancho de la pantalla
   	sprite.style.height = alto + 'px'; //Indicamos el posicionamiento del sprite respecto a lo alto de la pantalla
   	sprite.style.backgroundImage = 'url(img/'+img+')'; //Le asignamos al div la imagen de nuestro personaje

   	var setPosicion = function(punto){
   		punto = punto || {}; //Asignamos a la variable punto los valores que le pasemos o vacio
   		posicion.x = punto.x || posicion.x; //ASignamos a la posicionX el puntoX o la antigua posicion que tenia
   		posicion.y = punto.y || posicion.y; //Asignamos a la posicionY el puntoY o la antigua posicion que tenia

   		if (punto.x === 0) posicion.x--;
   		sprite.style.top = (posicion.x - (alto/2)) + 'px'; 
   		sprite.style.left = (posicion.y - (ancho/2)) + 'px';
   	};

   	sprite.getPosicion = function(){ //Devuelve la posicion 
   		return {
   			x: posicion.x,
   			y: posicion.y
   		};
   	};

   	sprite.getWidth = function(){
   		return ancho;
   	};

   	sprite.setOffset = function(punto){ //Se utiliza para llamar a la funcion setPosicion y asignarle un valor
   		punto = punto || {};
   		punto.x = punto.x || 0;
   		punto.y = punto.y || 0;
   		setPosicion({
   			x: posicion.x + punto.x,
   			y: posicion.y + punto.y
   		});
   	};

   	sprite.mover = function(punto){
   		punto = spec.punto || {};
   		punto.x = punto.x || posicion.x;
   		punto.y = punto.y || posicion.y;
   		if (sprite.mv){ //Si el sprite se encuentra en movimiento
   			clearInterval(sprite.mv); //Limpiamos el intervalo de desplazamiento
   			sprite.mv = undefined; //El desplazamiento se vuelve indefinido
   		}

   		sprite.animacion = 0;
   		sprite.mv = setInterval(function(){
   			sprite.setOffset({
   				x: ((punto.x - posicion.x) / 7),
   				y: ((punto.y - posicion.y) / 7)
   			});
   			sprite.style.backgroundImage = sprite.animacion+'px 0px';
   			if(Math.floor(posicion.x + posicion.y) % 5 === 0){ //Si la suma de la posicion X y Y dividida entre 5 es igual a 0
   				sprite.animacion += ancho //Aumentamos la animacion con el ancho
   			}
   			if((Math.abs(punto.x - posicion.x)<2) && Math.abs(punto.y - posicion.y) <2){
   				setPosicion({
   					x: punto.x,
   					y: punto.y
   				});
   				sprite.animacion = 0;
   				clearInterval(sprite.mv)
   			}
   		},fpsRatio);

   		sprite.andar = function(velocidad, remove){
   			sprite.setOffset(velocidad);
   			sprite.style.backgroundPositionX = sprite.animacion + 'px';
   			if(Math.floor(sprite.getPosicion().x + sprite.getPosicion().y) % 5 === 0)
   				sprite.animacion += sprite.getWidth()
   			if(posicion.x > screenx + 10 ||  posicion.x < - 10  || posicion.y > screeny + 10 || posicion.y < -10){
   				clearInterval(sprite.mv);
   				sprite.remove();
   			}
   		};

   	};

   	setPosicion();
   	return sprite;
   };

   var dani = newWarrior({position: {x:50, y:300}});
   pantalla.appendChild(dani);

});
