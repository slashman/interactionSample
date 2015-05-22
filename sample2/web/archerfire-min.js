(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/administrator/git/interactionSample/sample2/src/Archerfire.js":[function(require,module,exports){
function ArcherFire(setup){
	ArcherFire.setup = setup;
	if (setup.isNode){
		var nwin = ngui.Window.get();
	    nwin.show();
	    nwin.maximize();
	}
	if (!setup.isCocoon && window.matchMedia)
		this.isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
	if (setup.isNode)
		this.isMobile = false;
	var phaser = null;
	if (this.isMobile) {
		setup.isLandscape = false;
		phaser = new Phaser.Game(320, 512, Phaser.AUTO, 'phaser-game', null, false, false);
	} else {
		setup.isLandscape = true;
		phaser = new Phaser.Game(640, 360, Phaser.AUTO, 'phaser-game', null, false, false);
	}
	phaser.state.add('Boot', ArcherFire.Boot);
	phaser.state.add('Preloader', ArcherFire.Preloader);
	phaser.state.add('Game', ArcherFire.Game);
	phaser.state.start('Boot');
}

module.exports = ArcherFire;
window.ArcherFire = ArcherFire;
var UIController = require('./UIController.class');

ArcherFire.Boot = function () {};

ArcherFire.Boot.prototype = {
	    getRatio: function (type, w, h) {
	        var width = navigator.isCocoonJS ? window.innerWidth : w,
	            height = navigator.isCocoonJS ? window.innerHeight : h;
	        var dips = window.devicePixelRatio;
	        width = width * dips;
	        height = height * dips;
	        var scaleX = width / w,
	            scaleY = height / h,
	            result = {
	                x: 1,
	                y: 1
	            };
	        switch (type) {
	            case 'all':
	                result.x = scaleX > scaleY ? scaleY : scaleX;
	                result.y = scaleX > scaleY ? scaleY : scaleX;
	                break;
	            case 'fit':
	                result.x = scaleX > scaleY ? scaleX : scaleY;
	                result.y = scaleX > scaleY ? scaleX : scaleY;
	                break;
	            case 'fill':
	                result.x = scaleX;
	                result.y = scaleY;
	                break;
	        }
	        return result;
	    },
	    
    preload: function () {
		this.load.image('background', 'img/background.png');
        this.load.image('preloaderBar', 'img/preloaderBar.png');
    },
    create: function () {
        this.input.maxPointers = 1;
        if (navigator.isCocoonJS) {
        	var ratio = this.getRatio('all', 320, 512);
            this.game.world.scale.x = ratio.x;
            this.game.world.scale.y = ratio.y;
            this.game.world.updateTransform();
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        } else if (this.game.device.desktop){
        	if (!ArcherFire.setup.dontScale)
        		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        } else {
        	if (!ArcherFire.setup.dontScale) 
        		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.setScreenSize(true);
        }
        this.state.start('Preloader');
    }
};

ArcherFire.Preloader = function () {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

ArcherFire.Preloader.prototype = {
	preload: function () {
		this.background = this.add.sprite(0, 0, 'background');
		this.preloadBar = this.add.sprite((320-262)/2, 80, 'preloaderBar');
		this.add.text(29, 160, 'Loading...', {font: '16px PixelFont', fill: '#ffffff'});
		this.load.setPreloadSprite(this.preloadBar); 
		this.load.image('title', 'img/title.png');
		this.load.spritesheet('tileset32', 'img/tileset32.png', 32, 32);
		this.load.spritesheet('tileset64', 'img/tileset64.png', 64, 64);
		this.load.spritesheet('tileset16', 'img/tileset16.png', 16, 16);
		this.load.spritesheet('tileset48-32', 'img/tileset48-32.png', 48, 32);
		this.load.audio('music-title', ['music/menu.mp3']);
		this.load.audio('music-game', ['music/game.mp3']);
		this.load.audio('sfx-shoot', 'sfx/missile.wav');
		this.load.audio('sfx-explosion', 'sfx/explosion.wav');
	},
	create: function () {
		this.preloadBar.cropEnabled = false;
		this.state.start('Game');
	},
};

ArcherFire.Game = function () {};

ArcherFire.Game.prototype = {
	create: function(){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.uiController = new UIController(this.game, ArcherFire.setup);
		this.uiController.initialize();
	},
	update: function(){
		this.uiController.update();
	}
};

},{"./UIController.class":"/home/administrator/git/interactionSample/sample2/src/UIController.class.js"}],"/home/administrator/git/interactionSample/sample2/src/MusicController.class.js":[function(require,module,exports){
function MusicController(gameController){
	this.gameController = gameController;
	this.musicMap = {};
}

module.exports = MusicController;

MusicController.prototype.init = function(){
	var phaser = this.gameController.phaser;
	this.musicMap['title'] = phaser.add.audio('music-title',0.7);
	this.musicMap['game'] = phaser.add.audio('music-game',0.7);
};

MusicController.prototype.playMusic = function(key){
	var music = this.musicMap[key];
	if (!music){
		return;
	}
	if (this.currentMusicKey == key)
		return;
	if (this.currentMusic)
		this.currentMusic.stop();
	if (!this.gameController.phaser.cache.isSoundDecoded('music-'+key)){
		return;
	}
	this.currentMusic = music;
	this.currentMusicKey = key;
	this.currentMusic.play('', 0, 0.2, true);
};

MusicController.prototype.stopMusic = function(){
	if (this.currentMusic)
		this.currentMusic.stop();
	this.currentMusicKey = false;
};
},{}],"/home/administrator/git/interactionSample/sample2/src/SFXController.class.js":[function(require,module,exports){
function SFXController(gameController){
	this.gameController = gameController;
}

module.exports = SFXController;

SFXController.prototype.init = function(){
	var phaser = this.gameController.phaser;
	this.sfx = {
		shoot: phaser.add.audio('sfx-shoot', 0.5),
		explosion: phaser.add.audio('sfx-explosion', 1)
	};
};

SFXController.prototype.play = function(key){
	this.sfx[key].play('',0,0.2);
};
},{}],"/home/administrator/git/interactionSample/sample2/src/UIController.class.js":[function(require,module,exports){
function UIController(_phaser, setup){
	this.phaser = _phaser;
	this.player = null;
	this.level = null;
	this.font = '16px PixelFont';
	this.fontColor = '#dddddd';
	this.titleColor = '#dddd00';
	this.fontSpec = {font: this.font, fill: this.fontColor};;
	this.isDesktop = setup.isDesktop;
	this.isCocoon = setup.isCocoon;
	this.musicController = new MusicController(this);
	this.sfxController = new SFXController(this);
}

module.exports = UIController;
var MusicController = require('./MusicController.class');
var SFXController = require('./SFXController.class');
var TitlePanel = require('./panels/TitlePanel.class');
var MainPanel = require('./panels/MainPanel.class');

UIController.prototype = {
	initialize: function(){
		this.phaser.stage.backgroundColor = '#000000';
		this.bgLayer = this.phaser.add.group();
		this.phaser.add.sprite(0,0,'background',this.bgLayer);
		this._initGUI();
		this.titlePanel = new TitlePanel(this);
		this.titlePanel.init();
		this.mainPanel = new MainPanel(this);
		this.mainPanel.init();
		this.sfxController.init();
		this.musicController.init();
		var thus = this;
		setTimeout(function(){
			thus.titlePanel.show();
		}, 500);
		this.currentPanel = this.titlePanel;
	},
	startGame: function(){
		this.mainPanel.show();
		this.currentPanel = this.mainPanel;
	},
	restartGame: function(){
		this.currentPanel = this.titlePanel;
		this.mainPanel.hide();
		this.titlePanel.show();
	},
	update: function(){
		if (this.currentPanel && this.currentPanel.update)
			this.currentPanel.update();
	},
	_initGUI: function(){
		
	}
};
},{"./MusicController.class":"/home/administrator/git/interactionSample/sample2/src/MusicController.class.js","./SFXController.class":"/home/administrator/git/interactionSample/sample2/src/SFXController.class.js","./panels/MainPanel.class":"/home/administrator/git/interactionSample/sample2/src/panels/MainPanel.class.js","./panels/TitlePanel.class":"/home/administrator/git/interactionSample/sample2/src/panels/TitlePanel.class.js"}],"/home/administrator/git/interactionSample/sample2/src/panels/MainPanel.class.js":[function(require,module,exports){
function MainPanel(gameController) {
	this.gameController = gameController;
}

module.exports = MainPanel;

MainPanel.prototype = {
	init: function(){
		var phaser = this.gameController.phaser;
		var font = this.gameController.fontSpec;
		this.mainLayer = phaser.add.group();
		this.mainLayer.visible = false;
		var backgroundImage = phaser.add.image(0,0,'background', null, this.mainLayer);
		backgroundImage.inputEnabled=true;
		this.missilesGroup = phaser.add.group(this.mainLayer);
		this.enemiesGroup = phaser.add.group(this.mainLayer);
		this.scoreTxt = this.gameController.phaser.add.text(400, 20, "Score:", this.gameController.fontSpec, this.mainLayer);
		var button1 = phaser.add.image(0,300,'tileset64', 8, this.mainLayer);
		button1.inputEnabled=true;
		button1.events.onInputDown.add(this._jump, this);
		var button2 = phaser.add.image(500,300,'tileset64', 9, this.mainLayer);
		button2.inputEnabled=true;
		button2.events.onInputDown.add(this._fire, this);
		this.shipSprite = phaser.add.sprite(60, 50, 'tileset32', 0, this.mainLayer);
		phaser.physics.enable([this.shipSprite], Phaser.Physics.ARCADE);
		this.shipSprite.anchor.setTo(0.4, 0.5);
		this._initStarField();
		this.nextJumpTime = 0;
		this.nextFireTime = 0;
		this.score = 0;
	},
	show: function() {
		console.log('show');
		this.score = 0;
		this.scoreTxt.text = "Score: 0";
		this.mainLayer.visible = true;
		this.enemiesGroup.visible = true;
		this.gameController.phaser.physics.arcade.gravity.y = 200;
		this.shipSprite.x = 60;
		this.shipSprite.y = 50;
		this.shipSprite.reset(60,50);
		this.shipSprite.body.velocity.y = 0;
		this.shipSprite.body.acceleration.y = 0;
		this.gameController.musicController.playMusic('game');
		this.missileSprites = [];
		this.spawnFreq = 3000;
		var panel = this;
		setTimeout(function(){
			panel._spawnEnemy();
		}, this.spawnFreq);
	},
	hide: function() {
		for (var i = 0; i < this.missileSprites.length; i++){
			this.missileSprites[i].destroy();
		}
		this.gameController.phaser.physics.arcade.gravity.y = 0;
		this.mainLayer.visible = false;
	},
	update: function(){
		if (this.gameController.phaser.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
	        this._jump();
	    } else if (this.gameController.phaser.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	    	this._fire();
	    }
		 if (this.shipSprite.angle < 20)  
	            this.shipSprite.angle += 1;
		 if (this.shipSprite.y > 500)
	            this.gameController.restartGame();
		 try {
			 this.gameController.phaser.physics.arcade.overlap(this.enemiesGroup, this.missilesGroup, this._enemyCollision, null, this);
			 this.gameController.phaser.physics.arcade.overlap(this.enemiesGroup, this.shipSprite, this._enemyCrash, null, this);
		 } catch (e){
			 console.log(e);
		 }
	},
	_fire: function(){
		var currentTime = this.gameController.phaser.time.time;
		if (currentTime < this.nextFireTime)
			return;
		console.log('Fire')
		this.gameController.sfxController.play('shoot');
		this.nextFireTime = currentTime + 500;
		this._spawnMissile(this.shipSprite.x, this.shipSprite.y);
	},
	_jump: function(){
		var currentTime = this.gameController.phaser.time.time;
		if (currentTime < this.nextJumpTime)
			return;
		console.log('Jump')
		this.nextJumpTime = currentTime + 200; 
		this.shipSprite.body.velocity.y = -100;
		this.shipSprite.body.acceleration.y = -100;
        this.gameController.phaser.add.tween(this.shipSprite).to({angle: -20}, 500).start();
	},
	_spawnMissile: function(x,y){
		var missileSprite = this.gameController.phaser.add.sprite(x, y, 'tileset16', 32);
		this.gameController.phaser.physics.enable(missileSprite, Phaser.Physics.ARCADE);
		missileSprite.body.velocity.x = 100;
		missileSprite.body.acceleration.x = 200;
		missileSprite.body.allowGravity = false;
		missileSprite.mobType = 'missile';
		missileSprite.checkWorldBounds = true;
		missileSprite.outOfBoundsKill = true;
		var aMissilesGroup = this.missilesGroup;
		missileSprite.events.onKilled.add(function(a){
			aMissilesGroup.remove(a, true);
		}, this);
		this.missilesGroup.add(missileSprite);
		this.missileSprites.push(missileSprite);
	},
	_spawnEnemy: function(){
		var y = Math.floor(Math.random()*200)+10;
		var spd = Math.floor(Math.random()*50)+10;
		var acc = Math.floor(Math.random()*50)+10;
		var shipSprite = this.gameController.phaser.add.sprite(660, y, 'tileset32', 1);
		this.gameController.phaser.physics.enable(shipSprite, Phaser.Physics.ARCADE);
		shipSprite.body.velocity.x = -spd;
		shipSprite.body.acceleration.x = -acc;
		shipSprite.body.allowGravity = false;
		shipSprite.mobType = 'enemy';
		this.enemiesGroup.add(shipSprite);
		this.missileSprites.push(shipSprite);
		if (this.spawnFreq > 200)
			this.spawnFreq -= 100;
		if (this.mainLayer.visible){
			var panel = this;
			setTimeout(function(){
				panel._spawnEnemy();
			}, this.spawnFreq);
		}
	},
	_enemyCollision: function(a, b){
		this._addExplosion(b.x, b.y);
		this.enemiesGroup.remove(a, true);
		this.missilesGroup.remove(b, true);
		this.score += 100;
		this.scoreTxt.text = "Score: "+this.score;
	},
	_enemyCrash: function(a, b){
		this._addExplosion(b.x, b.y);
		this.enemiesGroup.remove(a, true);
		this.shipSprite.kill();
		var panel = this;
		setTimeout(function(){
			panel.gameController.restartGame();
		}, 3000);
	},
	_addExplosion: function(x, y){
		var explosion = this.gameController.phaser.add.sprite(x, y, 'tileset64', 0, this.mainLayer);
		explosion.animations.add('explode', [0,1,2,3,4,5,6,7]);
        explosion.play('explode', 15, false, true);
        this.gameController.sfxController.play('explosion');
	},
	_initStarField: function(){
        this.starField = this.gameController.phaser.add.group(this.mainLayer);
    	for (var i = 0; i < 50; i++){
    		var starType = Math.random() > 0.5 ? 0 : 1;
    		var starSprite = this.starField.create(rand(0,638), rand(5,360), 'tileset16', 48 + starType);
    		this.gameController.phaser.physics.enable(starSprite, Phaser.Physics.ARCADE);
    		starSprite.body.allowGravity = false;
    		starSprite.body.velocity.x = rand(50,100)*-1;
    		starSprite.checkWorldBounds = true;
    		starSprite.outOfBoundsKill = true;
    		starSprite.events.onKilled.add(function(a){
    			a.reset(638, rand(5,360));
    			a.body.velocity.x = rand(50,100)*-1;
    		});
    	}
    }
	
};

function rand(a, b){
	return a + Math.floor(Math.random()*(b-a));
}

},{}],"/home/administrator/git/interactionSample/sample2/src/panels/TitlePanel.class.js":[function(require,module,exports){
function TitlePanel(gameController) {
	this.gameController = gameController;
}

module.exports = TitlePanel;

TitlePanel.prototype = {
	init: function(){
		var font = this.gameController.fontSpec;
		this.titleLayer = this.gameController.phaser.add.group();
		this.titleLayer.visible = false;
		var backgroundImage = this.gameController.phaser.add.image(0,0,'title', null, this.titleLayer);
		backgroundImage.inputEnabled=true;
		this.gameController.phaser.add.text(60, 200, "Tap to Start Game", font, this.titleLayer);
		backgroundImage.events.onInputDown.add(this._newGame, this);
		this._decodeSoundsProgressAuto();
		this.upKey = this.gameController.phaser.input.keyboard.addKey(Phaser.Keyboard.UP);
	},
	show: function() {
		this.titleLayer.visible = true;
		this.gameController.musicController.playMusic('title');
	},
	hide: function() {
		this.titleLayer.visible = false;
	},
	update: function(){
		if (this.upKey.isDown){
			this._newGame();
		}
	},
	_decodeSoundsProgressAuto: function(){
		var phaser = this.gameController.phaser;
		var decodingProgress = 0;
		if (phaser.cache.isSoundDecoded('music-title'))
			decodingProgress += 50;
		if (phaser.cache.isSoundDecoded('music-game'))
			decodingProgress += 50;
		if (decodingProgress >= 100){
			this.gameController.musicController.playMusic('title');
		} else {
			var that = this;
			setTimeout(function(){that._decodeSoundsProgressAuto();}, 500);
		}
	},
	_newGame: function(){
		this.hide();
		this.gameController.startGame();
	}
};

},{}]},{},["/home/administrator/git/interactionSample/sample2/src/Archerfire.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvaW50ZXJhY3Rpb25TYW1wbGUvc2FtcGxlMi9zcmMvQXJjaGVyZmlyZS5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L2ludGVyYWN0aW9uU2FtcGxlL3NhbXBsZTIvc3JjL011c2ljQ29udHJvbGxlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L2ludGVyYWN0aW9uU2FtcGxlL3NhbXBsZTIvc3JjL1NGWENvbnRyb2xsZXIuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9pbnRlcmFjdGlvblNhbXBsZS9zYW1wbGUyL3NyYy9VSUNvbnRyb2xsZXIuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9pbnRlcmFjdGlvblNhbXBsZS9zYW1wbGUyL3NyYy9wYW5lbHMvTWFpblBhbmVsLmNsYXNzLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvaW50ZXJhY3Rpb25TYW1wbGUvc2FtcGxlMi9zcmMvcGFuZWxzL1RpdGxlUGFuZWwuY2xhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIEFyY2hlckZpcmUoc2V0dXApe1xuXHRBcmNoZXJGaXJlLnNldHVwID0gc2V0dXA7XG5cdGlmIChzZXR1cC5pc05vZGUpe1xuXHRcdHZhciBud2luID0gbmd1aS5XaW5kb3cuZ2V0KCk7XG5cdCAgICBud2luLnNob3coKTtcblx0ICAgIG53aW4ubWF4aW1pemUoKTtcblx0fVxuXHRpZiAoIXNldHVwLmlzQ29jb29uICYmIHdpbmRvdy5tYXRjaE1lZGlhKVxuXHRcdHRoaXMuaXNNb2JpbGUgPSB3aW5kb3cubWF0Y2hNZWRpYShcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3NjBweClcIikubWF0Y2hlcztcblx0aWYgKHNldHVwLmlzTm9kZSlcblx0XHR0aGlzLmlzTW9iaWxlID0gZmFsc2U7XG5cdHZhciBwaGFzZXIgPSBudWxsO1xuXHRpZiAodGhpcy5pc01vYmlsZSkge1xuXHRcdHNldHVwLmlzTGFuZHNjYXBlID0gZmFsc2U7XG5cdFx0cGhhc2VyID0gbmV3IFBoYXNlci5HYW1lKDMyMCwgNTEyLCBQaGFzZXIuQVVUTywgJ3BoYXNlci1nYW1lJywgbnVsbCwgZmFsc2UsIGZhbHNlKTtcblx0fSBlbHNlIHtcblx0XHRzZXR1cC5pc0xhbmRzY2FwZSA9IHRydWU7XG5cdFx0cGhhc2VyID0gbmV3IFBoYXNlci5HYW1lKDY0MCwgMzYwLCBQaGFzZXIuQVVUTywgJ3BoYXNlci1nYW1lJywgbnVsbCwgZmFsc2UsIGZhbHNlKTtcblx0fVxuXHRwaGFzZXIuc3RhdGUuYWRkKCdCb290JywgQXJjaGVyRmlyZS5Cb290KTtcblx0cGhhc2VyLnN0YXRlLmFkZCgnUHJlbG9hZGVyJywgQXJjaGVyRmlyZS5QcmVsb2FkZXIpO1xuXHRwaGFzZXIuc3RhdGUuYWRkKCdHYW1lJywgQXJjaGVyRmlyZS5HYW1lKTtcblx0cGhhc2VyLnN0YXRlLnN0YXJ0KCdCb290Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXJjaGVyRmlyZTtcbndpbmRvdy5BcmNoZXJGaXJlID0gQXJjaGVyRmlyZTtcbnZhciBVSUNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL1VJQ29udHJvbGxlci5jbGFzcycpO1xuXG5BcmNoZXJGaXJlLkJvb3QgPSBmdW5jdGlvbiAoKSB7fTtcblxuQXJjaGVyRmlyZS5Cb290LnByb3RvdHlwZSA9IHtcblx0ICAgIGdldFJhdGlvOiBmdW5jdGlvbiAodHlwZSwgdywgaCkge1xuXHQgICAgICAgIHZhciB3aWR0aCA9IG5hdmlnYXRvci5pc0NvY29vbkpTID8gd2luZG93LmlubmVyV2lkdGggOiB3LFxuXHQgICAgICAgICAgICBoZWlnaHQgPSBuYXZpZ2F0b3IuaXNDb2Nvb25KUyA/IHdpbmRvdy5pbm5lckhlaWdodCA6IGg7XG5cdCAgICAgICAgdmFyIGRpcHMgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcblx0ICAgICAgICB3aWR0aCA9IHdpZHRoICogZGlwcztcblx0ICAgICAgICBoZWlnaHQgPSBoZWlnaHQgKiBkaXBzO1xuXHQgICAgICAgIHZhciBzY2FsZVggPSB3aWR0aCAvIHcsXG5cdCAgICAgICAgICAgIHNjYWxlWSA9IGhlaWdodCAvIGgsXG5cdCAgICAgICAgICAgIHJlc3VsdCA9IHtcblx0ICAgICAgICAgICAgICAgIHg6IDEsXG5cdCAgICAgICAgICAgICAgICB5OiAxXG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICAgICAgICAgIGNhc2UgJ2FsbCc6XG5cdCAgICAgICAgICAgICAgICByZXN1bHQueCA9IHNjYWxlWCA+IHNjYWxlWSA/IHNjYWxlWSA6IHNjYWxlWDtcblx0ICAgICAgICAgICAgICAgIHJlc3VsdC55ID0gc2NhbGVYID4gc2NhbGVZID8gc2NhbGVZIDogc2NhbGVYO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ2ZpdCc6XG5cdCAgICAgICAgICAgICAgICByZXN1bHQueCA9IHNjYWxlWCA+IHNjYWxlWSA/IHNjYWxlWCA6IHNjYWxlWTtcblx0ICAgICAgICAgICAgICAgIHJlc3VsdC55ID0gc2NhbGVYID4gc2NhbGVZID8gc2NhbGVYIDogc2NhbGVZO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICAgIGNhc2UgJ2ZpbGwnOlxuXHQgICAgICAgICAgICAgICAgcmVzdWx0LnggPSBzY2FsZVg7XG5cdCAgICAgICAgICAgICAgICByZXN1bHQueSA9IHNjYWxlWTtcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgfSxcblx0ICAgIFxuICAgIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2JhY2tncm91bmQnLCAnaW1nL2JhY2tncm91bmQucG5nJyk7XG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZGVyQmFyJywgJ2ltZy9wcmVsb2FkZXJCYXIucG5nJyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDE7XG4gICAgICAgIGlmIChuYXZpZ2F0b3IuaXNDb2Nvb25KUykge1xuICAgICAgICBcdHZhciByYXRpbyA9IHRoaXMuZ2V0UmF0aW8oJ2FsbCcsIDMyMCwgNTEyKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5zY2FsZS54ID0gcmF0aW8ueDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC5zY2FsZS55ID0gcmF0aW8ueTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53b3JsZC51cGRhdGVUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUuc2V0U2NyZWVuU2l6ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWUuZGV2aWNlLmRlc2t0b3Ape1xuICAgICAgICBcdGlmICghQXJjaGVyRmlyZS5zZXR1cC5kb250U2NhbGUpXG4gICAgICAgIFx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnNldFNjcmVlblNpemUodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIFx0aWYgKCFBcmNoZXJGaXJlLnNldHVwLmRvbnRTY2FsZSkgXG4gICAgICAgIFx0XHR0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRTY3JlZW5TaXplKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWRlcicpO1xuICAgIH1cbn07XG5cbkFyY2hlckZpcmUuUHJlbG9hZGVyID0gZnVuY3Rpb24gKCkge1xuXHR0aGlzLmJhY2tncm91bmQgPSBudWxsO1xuXHR0aGlzLnByZWxvYWRCYXIgPSBudWxsO1xuXHR0aGlzLnJlYWR5ID0gZmFsc2U7XG59O1xuXG5BcmNoZXJGaXJlLlByZWxvYWRlci5wcm90b3R5cGUgPSB7XG5cdHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLmJhY2tncm91bmQgPSB0aGlzLmFkZC5zcHJpdGUoMCwgMCwgJ2JhY2tncm91bmQnKTtcblx0XHR0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmFkZC5zcHJpdGUoKDMyMC0yNjIpLzIsIDgwLCAncHJlbG9hZGVyQmFyJyk7XG5cdFx0dGhpcy5hZGQudGV4dCgyOSwgMTYwLCAnTG9hZGluZy4uLicsIHtmb250OiAnMTZweCBQaXhlbEZvbnQnLCBmaWxsOiAnI2ZmZmZmZid9KTtcblx0XHR0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLnByZWxvYWRCYXIpOyBcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3RpdGxlJywgJ2ltZy90aXRsZS5wbmcnKTtcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3RpbGVzZXQzMicsICdpbWcvdGlsZXNldDMyLnBuZycsIDMyLCAzMik7XG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCd0aWxlc2V0NjQnLCAnaW1nL3RpbGVzZXQ2NC5wbmcnLCA2NCwgNjQpO1xuXHRcdHRoaXMubG9hZC5zcHJpdGVzaGVldCgndGlsZXNldDE2JywgJ2ltZy90aWxlc2V0MTYucG5nJywgMTYsIDE2KTtcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3RpbGVzZXQ0OC0zMicsICdpbWcvdGlsZXNldDQ4LTMyLnBuZycsIDQ4LCAzMik7XG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYy10aXRsZScsIFsnbXVzaWMvbWVudS5tcDMnXSk7XG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYy1nYW1lJywgWydtdXNpYy9nYW1lLm1wMyddKTtcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ3NmeC1zaG9vdCcsICdzZngvbWlzc2lsZS53YXYnKTtcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ3NmeC1leHBsb3Npb24nLCAnc2Z4L2V4cGxvc2lvbi53YXYnKTtcblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5wcmVsb2FkQmFyLmNyb3BFbmFibGVkID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnR2FtZScpO1xuXHR9LFxufTtcblxuQXJjaGVyRmlyZS5HYW1lID0gZnVuY3Rpb24gKCkge307XG5cbkFyY2hlckZpcmUuR2FtZS5wcm90b3R5cGUgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKXtcblx0XHR0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXHRcdHRoaXMudWlDb250cm9sbGVyID0gbmV3IFVJQ29udHJvbGxlcih0aGlzLmdhbWUsIEFyY2hlckZpcmUuc2V0dXApO1xuXHRcdHRoaXMudWlDb250cm9sbGVyLmluaXRpYWxpemUoKTtcblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMudWlDb250cm9sbGVyLnVwZGF0ZSgpO1xuXHR9XG59O1xuIiwiZnVuY3Rpb24gTXVzaWNDb250cm9sbGVyKGdhbWVDb250cm9sbGVyKXtcblx0dGhpcy5nYW1lQ29udHJvbGxlciA9IGdhbWVDb250cm9sbGVyO1xuXHR0aGlzLm11c2ljTWFwID0ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTXVzaWNDb250cm9sbGVyO1xuXG5NdXNpY0NvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXHR2YXIgcGhhc2VyID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXI7XG5cdHRoaXMubXVzaWNNYXBbJ3RpdGxlJ10gPSBwaGFzZXIuYWRkLmF1ZGlvKCdtdXNpYy10aXRsZScsMC43KTtcblx0dGhpcy5tdXNpY01hcFsnZ2FtZSddID0gcGhhc2VyLmFkZC5hdWRpbygnbXVzaWMtZ2FtZScsMC43KTtcbn07XG5cbk11c2ljQ29udHJvbGxlci5wcm90b3R5cGUucGxheU11c2ljID0gZnVuY3Rpb24oa2V5KXtcblx0dmFyIG11c2ljID0gdGhpcy5tdXNpY01hcFtrZXldO1xuXHRpZiAoIW11c2ljKXtcblx0XHRyZXR1cm47XG5cdH1cblx0aWYgKHRoaXMuY3VycmVudE11c2ljS2V5ID09IGtleSlcblx0XHRyZXR1cm47XG5cdGlmICh0aGlzLmN1cnJlbnRNdXNpYylcblx0XHR0aGlzLmN1cnJlbnRNdXNpYy5zdG9wKCk7XG5cdGlmICghdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuY2FjaGUuaXNTb3VuZERlY29kZWQoJ211c2ljLScra2V5KSl7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHRoaXMuY3VycmVudE11c2ljID0gbXVzaWM7XG5cdHRoaXMuY3VycmVudE11c2ljS2V5ID0ga2V5O1xuXHR0aGlzLmN1cnJlbnRNdXNpYy5wbGF5KCcnLCAwLCAwLjIsIHRydWUpO1xufTtcblxuTXVzaWNDb250cm9sbGVyLnByb3RvdHlwZS5zdG9wTXVzaWMgPSBmdW5jdGlvbigpe1xuXHRpZiAodGhpcy5jdXJyZW50TXVzaWMpXG5cdFx0dGhpcy5jdXJyZW50TXVzaWMuc3RvcCgpO1xuXHR0aGlzLmN1cnJlbnRNdXNpY0tleSA9IGZhbHNlO1xufTsiLCJmdW5jdGlvbiBTRlhDb250cm9sbGVyKGdhbWVDb250cm9sbGVyKXtcblx0dGhpcy5nYW1lQ29udHJvbGxlciA9IGdhbWVDb250cm9sbGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNGWENvbnRyb2xsZXI7XG5cblNGWENvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXHR2YXIgcGhhc2VyID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXI7XG5cdHRoaXMuc2Z4ID0ge1xuXHRcdHNob290OiBwaGFzZXIuYWRkLmF1ZGlvKCdzZngtc2hvb3QnLCAwLjUpLFxuXHRcdGV4cGxvc2lvbjogcGhhc2VyLmFkZC5hdWRpbygnc2Z4LWV4cGxvc2lvbicsIDEpXG5cdH07XG59O1xuXG5TRlhDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5ID0gZnVuY3Rpb24oa2V5KXtcblx0dGhpcy5zZnhba2V5XS5wbGF5KCcnLDAsMC4yKTtcbn07IiwiZnVuY3Rpb24gVUlDb250cm9sbGVyKF9waGFzZXIsIHNldHVwKXtcblx0dGhpcy5waGFzZXIgPSBfcGhhc2VyO1xuXHR0aGlzLnBsYXllciA9IG51bGw7XG5cdHRoaXMubGV2ZWwgPSBudWxsO1xuXHR0aGlzLmZvbnQgPSAnMTZweCBQaXhlbEZvbnQnO1xuXHR0aGlzLmZvbnRDb2xvciA9ICcjZGRkZGRkJztcblx0dGhpcy50aXRsZUNvbG9yID0gJyNkZGRkMDAnO1xuXHR0aGlzLmZvbnRTcGVjID0ge2ZvbnQ6IHRoaXMuZm9udCwgZmlsbDogdGhpcy5mb250Q29sb3J9Oztcblx0dGhpcy5pc0Rlc2t0b3AgPSBzZXR1cC5pc0Rlc2t0b3A7XG5cdHRoaXMuaXNDb2Nvb24gPSBzZXR1cC5pc0NvY29vbjtcblx0dGhpcy5tdXNpY0NvbnRyb2xsZXIgPSBuZXcgTXVzaWNDb250cm9sbGVyKHRoaXMpO1xuXHR0aGlzLnNmeENvbnRyb2xsZXIgPSBuZXcgU0ZYQ29udHJvbGxlcih0aGlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSUNvbnRyb2xsZXI7XG52YXIgTXVzaWNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9NdXNpY0NvbnRyb2xsZXIuY2xhc3MnKTtcbnZhciBTRlhDb250cm9sbGVyID0gcmVxdWlyZSgnLi9TRlhDb250cm9sbGVyLmNsYXNzJyk7XG52YXIgVGl0bGVQYW5lbCA9IHJlcXVpcmUoJy4vcGFuZWxzL1RpdGxlUGFuZWwuY2xhc3MnKTtcbnZhciBNYWluUGFuZWwgPSByZXF1aXJlKCcuL3BhbmVscy9NYWluUGFuZWwuY2xhc3MnKTtcblxuVUlDb250cm9sbGVyLnByb3RvdHlwZSA9IHtcblx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKXtcblx0XHR0aGlzLnBoYXNlci5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMDAwMCc7XG5cdFx0dGhpcy5iZ0xheWVyID0gdGhpcy5waGFzZXIuYWRkLmdyb3VwKCk7XG5cdFx0dGhpcy5waGFzZXIuYWRkLnNwcml0ZSgwLDAsJ2JhY2tncm91bmQnLHRoaXMuYmdMYXllcik7XG5cdFx0dGhpcy5faW5pdEdVSSgpO1xuXHRcdHRoaXMudGl0bGVQYW5lbCA9IG5ldyBUaXRsZVBhbmVsKHRoaXMpO1xuXHRcdHRoaXMudGl0bGVQYW5lbC5pbml0KCk7XG5cdFx0dGhpcy5tYWluUGFuZWwgPSBuZXcgTWFpblBhbmVsKHRoaXMpO1xuXHRcdHRoaXMubWFpblBhbmVsLmluaXQoKTtcblx0XHR0aGlzLnNmeENvbnRyb2xsZXIuaW5pdCgpO1xuXHRcdHRoaXMubXVzaWNDb250cm9sbGVyLmluaXQoKTtcblx0XHR2YXIgdGh1cyA9IHRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dGh1cy50aXRsZVBhbmVsLnNob3coKTtcblx0XHR9LCA1MDApO1xuXHRcdHRoaXMuY3VycmVudFBhbmVsID0gdGhpcy50aXRsZVBhbmVsO1xuXHR9LFxuXHRzdGFydEdhbWU6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy5tYWluUGFuZWwuc2hvdygpO1xuXHRcdHRoaXMuY3VycmVudFBhbmVsID0gdGhpcy5tYWluUGFuZWw7XG5cdH0sXG5cdHJlc3RhcnRHYW1lOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuY3VycmVudFBhbmVsID0gdGhpcy50aXRsZVBhbmVsO1xuXHRcdHRoaXMubWFpblBhbmVsLmhpZGUoKTtcblx0XHR0aGlzLnRpdGxlUGFuZWwuc2hvdygpO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuY3VycmVudFBhbmVsICYmIHRoaXMuY3VycmVudFBhbmVsLnVwZGF0ZSlcblx0XHRcdHRoaXMuY3VycmVudFBhbmVsLnVwZGF0ZSgpO1xuXHR9LFxuXHRfaW5pdEdVSTogZnVuY3Rpb24oKXtcblx0XHRcblx0fVxufTsiLCJmdW5jdGlvbiBNYWluUGFuZWwoZ2FtZUNvbnRyb2xsZXIpIHtcblx0dGhpcy5nYW1lQ29udHJvbGxlciA9IGdhbWVDb250cm9sbGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5QYW5lbDtcblxuTWFpblBhbmVsLnByb3RvdHlwZSA9IHtcblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHR2YXIgcGhhc2VyID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXI7XG5cdFx0dmFyIGZvbnQgPSB0aGlzLmdhbWVDb250cm9sbGVyLmZvbnRTcGVjO1xuXHRcdHRoaXMubWFpbkxheWVyID0gcGhhc2VyLmFkZC5ncm91cCgpO1xuXHRcdHRoaXMubWFpbkxheWVyLnZpc2libGUgPSBmYWxzZTtcblx0XHR2YXIgYmFja2dyb3VuZEltYWdlID0gcGhhc2VyLmFkZC5pbWFnZSgwLDAsJ2JhY2tncm91bmQnLCBudWxsLCB0aGlzLm1haW5MYXllcik7XG5cdFx0YmFja2dyb3VuZEltYWdlLmlucHV0RW5hYmxlZD10cnVlO1xuXHRcdHRoaXMubWlzc2lsZXNHcm91cCA9IHBoYXNlci5hZGQuZ3JvdXAodGhpcy5tYWluTGF5ZXIpO1xuXHRcdHRoaXMuZW5lbWllc0dyb3VwID0gcGhhc2VyLmFkZC5ncm91cCh0aGlzLm1haW5MYXllcik7XG5cdFx0dGhpcy5zY29yZVR4dCA9IHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLmFkZC50ZXh0KDQwMCwgMjAsIFwiU2NvcmU6XCIsIHRoaXMuZ2FtZUNvbnRyb2xsZXIuZm9udFNwZWMsIHRoaXMubWFpbkxheWVyKTtcblx0XHR2YXIgYnV0dG9uMSA9IHBoYXNlci5hZGQuaW1hZ2UoMCwzMDAsJ3RpbGVzZXQ2NCcsIDgsIHRoaXMubWFpbkxheWVyKTtcblx0XHRidXR0b24xLmlucHV0RW5hYmxlZD10cnVlO1xuXHRcdGJ1dHRvbjEuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLl9qdW1wLCB0aGlzKTtcblx0XHR2YXIgYnV0dG9uMiA9IHBoYXNlci5hZGQuaW1hZ2UoNTAwLDMwMCwndGlsZXNldDY0JywgOSwgdGhpcy5tYWluTGF5ZXIpO1xuXHRcdGJ1dHRvbjIuaW5wdXRFbmFibGVkPXRydWU7XG5cdFx0YnV0dG9uMi5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuX2ZpcmUsIHRoaXMpO1xuXHRcdHRoaXMuc2hpcFNwcml0ZSA9IHBoYXNlci5hZGQuc3ByaXRlKDYwLCA1MCwgJ3RpbGVzZXQzMicsIDAsIHRoaXMubWFpbkxheWVyKTtcblx0XHRwaGFzZXIucGh5c2ljcy5lbmFibGUoW3RoaXMuc2hpcFNwcml0ZV0sIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cdFx0dGhpcy5zaGlwU3ByaXRlLmFuY2hvci5zZXRUbygwLjQsIDAuNSk7XG5cdFx0dGhpcy5faW5pdFN0YXJGaWVsZCgpO1xuXHRcdHRoaXMubmV4dEp1bXBUaW1lID0gMDtcblx0XHR0aGlzLm5leHRGaXJlVGltZSA9IDA7XG5cdFx0dGhpcy5zY29yZSA9IDA7XG5cdH0sXG5cdHNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnNvbGUubG9nKCdzaG93Jyk7XG5cdFx0dGhpcy5zY29yZSA9IDA7XG5cdFx0dGhpcy5zY29yZVR4dC50ZXh0ID0gXCJTY29yZTogMFwiO1xuXHRcdHRoaXMubWFpbkxheWVyLnZpc2libGUgPSB0cnVlO1xuXHRcdHRoaXMuZW5lbWllc0dyb3VwLnZpc2libGUgPSB0cnVlO1xuXHRcdHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IDIwMDtcblx0XHR0aGlzLnNoaXBTcHJpdGUueCA9IDYwO1xuXHRcdHRoaXMuc2hpcFNwcml0ZS55ID0gNTA7XG5cdFx0dGhpcy5zaGlwU3ByaXRlLnJlc2V0KDYwLDUwKTtcblx0XHR0aGlzLnNoaXBTcHJpdGUuYm9keS52ZWxvY2l0eS55ID0gMDtcblx0XHR0aGlzLnNoaXBTcHJpdGUuYm9keS5hY2NlbGVyYXRpb24ueSA9IDA7XG5cdFx0dGhpcy5nYW1lQ29udHJvbGxlci5tdXNpY0NvbnRyb2xsZXIucGxheU11c2ljKCdnYW1lJyk7XG5cdFx0dGhpcy5taXNzaWxlU3ByaXRlcyA9IFtdO1xuXHRcdHRoaXMuc3Bhd25GcmVxID0gMzAwMDtcblx0XHR2YXIgcGFuZWwgPSB0aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdHBhbmVsLl9zcGF3bkVuZW15KCk7XG5cdFx0fSwgdGhpcy5zcGF3bkZyZXEpO1xuXHR9LFxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWlzc2lsZVNwcml0ZXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5taXNzaWxlU3ByaXRlc1tpXS5kZXN0cm95KCk7XG5cdFx0fVxuXHRcdHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IDA7XG5cdFx0dGhpcy5tYWluTGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLmlucHV0LmtleWJvYXJkLmlzRG93bihQaGFzZXIuS2V5Ym9hcmQuTEVGVCkpe1xuXHQgICAgICAgIHRoaXMuX2p1bXAoKTtcblx0ICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5SSUdIVCkpe1xuXHQgICAgXHR0aGlzLl9maXJlKCk7XG5cdCAgICB9XG5cdFx0IGlmICh0aGlzLnNoaXBTcHJpdGUuYW5nbGUgPCAyMCkgIFxuXHQgICAgICAgICAgICB0aGlzLnNoaXBTcHJpdGUuYW5nbGUgKz0gMTtcblx0XHQgaWYgKHRoaXMuc2hpcFNwcml0ZS55ID4gNTAwKVxuXHQgICAgICAgICAgICB0aGlzLmdhbWVDb250cm9sbGVyLnJlc3RhcnRHYW1lKCk7XG5cdFx0IHRyeSB7XG5cdFx0XHQgdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLmVuZW1pZXNHcm91cCwgdGhpcy5taXNzaWxlc0dyb3VwLCB0aGlzLl9lbmVteUNvbGxpc2lvbiwgbnVsbCwgdGhpcyk7XG5cdFx0XHQgdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLmVuZW1pZXNHcm91cCwgdGhpcy5zaGlwU3ByaXRlLCB0aGlzLl9lbmVteUNyYXNoLCBudWxsLCB0aGlzKTtcblx0XHQgfSBjYXRjaCAoZSl7XG5cdFx0XHQgY29uc29sZS5sb2coZSk7XG5cdFx0IH1cblx0fSxcblx0X2ZpcmU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGN1cnJlbnRUaW1lID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIudGltZS50aW1lO1xuXHRcdGlmIChjdXJyZW50VGltZSA8IHRoaXMubmV4dEZpcmVUaW1lKVxuXHRcdFx0cmV0dXJuO1xuXHRcdGNvbnNvbGUubG9nKCdGaXJlJylcblx0XHR0aGlzLmdhbWVDb250cm9sbGVyLnNmeENvbnRyb2xsZXIucGxheSgnc2hvb3QnKTtcblx0XHR0aGlzLm5leHRGaXJlVGltZSA9IGN1cnJlbnRUaW1lICsgNTAwO1xuXHRcdHRoaXMuX3NwYXduTWlzc2lsZSh0aGlzLnNoaXBTcHJpdGUueCwgdGhpcy5zaGlwU3ByaXRlLnkpO1xuXHR9LFxuXHRfanVtcDogZnVuY3Rpb24oKXtcblx0XHR2YXIgY3VycmVudFRpbWUgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci50aW1lLnRpbWU7XG5cdFx0aWYgKGN1cnJlbnRUaW1lIDwgdGhpcy5uZXh0SnVtcFRpbWUpXG5cdFx0XHRyZXR1cm47XG5cdFx0Y29uc29sZS5sb2coJ0p1bXAnKVxuXHRcdHRoaXMubmV4dEp1bXBUaW1lID0gY3VycmVudFRpbWUgKyAyMDA7IFxuXHRcdHRoaXMuc2hpcFNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAtMTAwO1xuXHRcdHRoaXMuc2hpcFNwcml0ZS5ib2R5LmFjY2VsZXJhdGlvbi55ID0gLTEwMDtcbiAgICAgICAgdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLnR3ZWVuKHRoaXMuc2hpcFNwcml0ZSkudG8oe2FuZ2xlOiAtMjB9LCA1MDApLnN0YXJ0KCk7XG5cdH0sXG5cdF9zcGF3bk1pc3NpbGU6IGZ1bmN0aW9uKHgseSl7XG5cdFx0dmFyIG1pc3NpbGVTcHJpdGUgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5hZGQuc3ByaXRlKHgsIHksICd0aWxlc2V0MTYnLCAzMik7XG5cdFx0dGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIucGh5c2ljcy5lbmFibGUobWlzc2lsZVNwcml0ZSwgUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcblx0XHRtaXNzaWxlU3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDEwMDtcblx0XHRtaXNzaWxlU3ByaXRlLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAyMDA7XG5cdFx0bWlzc2lsZVNwcml0ZS5ib2R5LmFsbG93R3Jhdml0eSA9IGZhbHNlO1xuXHRcdG1pc3NpbGVTcHJpdGUubW9iVHlwZSA9ICdtaXNzaWxlJztcblx0XHRtaXNzaWxlU3ByaXRlLmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlO1xuXHRcdG1pc3NpbGVTcHJpdGUub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcblx0XHR2YXIgYU1pc3NpbGVzR3JvdXAgPSB0aGlzLm1pc3NpbGVzR3JvdXA7XG5cdFx0bWlzc2lsZVNwcml0ZS5ldmVudHMub25LaWxsZWQuYWRkKGZ1bmN0aW9uKGEpe1xuXHRcdFx0YU1pc3NpbGVzR3JvdXAucmVtb3ZlKGEsIHRydWUpO1xuXHRcdH0sIHRoaXMpO1xuXHRcdHRoaXMubWlzc2lsZXNHcm91cC5hZGQobWlzc2lsZVNwcml0ZSk7XG5cdFx0dGhpcy5taXNzaWxlU3ByaXRlcy5wdXNoKG1pc3NpbGVTcHJpdGUpO1xuXHR9LFxuXHRfc3Bhd25FbmVteTogZnVuY3Rpb24oKXtcblx0XHR2YXIgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyMDApKzEwO1xuXHRcdHZhciBzcGQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNTApKzEwO1xuXHRcdHZhciBhY2MgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNTApKzEwO1xuXHRcdHZhciBzaGlwU3ByaXRlID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLnNwcml0ZSg2NjAsIHksICd0aWxlc2V0MzInLCAxKTtcblx0XHR0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5waHlzaWNzLmVuYWJsZShzaGlwU3ByaXRlLCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXHRcdHNoaXBTcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gLXNwZDtcblx0XHRzaGlwU3ByaXRlLmJvZHkuYWNjZWxlcmF0aW9uLnggPSAtYWNjO1xuXHRcdHNoaXBTcHJpdGUuYm9keS5hbGxvd0dyYXZpdHkgPSBmYWxzZTtcblx0XHRzaGlwU3ByaXRlLm1vYlR5cGUgPSAnZW5lbXknO1xuXHRcdHRoaXMuZW5lbWllc0dyb3VwLmFkZChzaGlwU3ByaXRlKTtcblx0XHR0aGlzLm1pc3NpbGVTcHJpdGVzLnB1c2goc2hpcFNwcml0ZSk7XG5cdFx0aWYgKHRoaXMuc3Bhd25GcmVxID4gMjAwKVxuXHRcdFx0dGhpcy5zcGF3bkZyZXEgLT0gMTAwO1xuXHRcdGlmICh0aGlzLm1haW5MYXllci52aXNpYmxlKXtcblx0XHRcdHZhciBwYW5lbCA9IHRoaXM7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHBhbmVsLl9zcGF3bkVuZW15KCk7XG5cdFx0XHR9LCB0aGlzLnNwYXduRnJlcSk7XG5cdFx0fVxuXHR9LFxuXHRfZW5lbXlDb2xsaXNpb246IGZ1bmN0aW9uKGEsIGIpe1xuXHRcdHRoaXMuX2FkZEV4cGxvc2lvbihiLngsIGIueSk7XG5cdFx0dGhpcy5lbmVtaWVzR3JvdXAucmVtb3ZlKGEsIHRydWUpO1xuXHRcdHRoaXMubWlzc2lsZXNHcm91cC5yZW1vdmUoYiwgdHJ1ZSk7XG5cdFx0dGhpcy5zY29yZSArPSAxMDA7XG5cdFx0dGhpcy5zY29yZVR4dC50ZXh0ID0gXCJTY29yZTogXCIrdGhpcy5zY29yZTtcblx0fSxcblx0X2VuZW15Q3Jhc2g6IGZ1bmN0aW9uKGEsIGIpe1xuXHRcdHRoaXMuX2FkZEV4cGxvc2lvbihiLngsIGIueSk7XG5cdFx0dGhpcy5lbmVtaWVzR3JvdXAucmVtb3ZlKGEsIHRydWUpO1xuXHRcdHRoaXMuc2hpcFNwcml0ZS5raWxsKCk7XG5cdFx0dmFyIHBhbmVsID0gdGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRwYW5lbC5nYW1lQ29udHJvbGxlci5yZXN0YXJ0R2FtZSgpO1xuXHRcdH0sIDMwMDApO1xuXHR9LFxuXHRfYWRkRXhwbG9zaW9uOiBmdW5jdGlvbih4LCB5KXtcblx0XHR2YXIgZXhwbG9zaW9uID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLnNwcml0ZSh4LCB5LCAndGlsZXNldDY0JywgMCwgdGhpcy5tYWluTGF5ZXIpO1xuXHRcdGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsIFswLDEsMiwzLDQsNSw2LDddKTtcbiAgICAgICAgZXhwbG9zaW9uLnBsYXkoJ2V4cGxvZGUnLCAxNSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB0aGlzLmdhbWVDb250cm9sbGVyLnNmeENvbnRyb2xsZXIucGxheSgnZXhwbG9zaW9uJyk7XG5cdH0sXG5cdF9pbml0U3RhckZpZWxkOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnN0YXJGaWVsZCA9IHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLmFkZC5ncm91cCh0aGlzLm1haW5MYXllcik7XG4gICAgXHRmb3IgKHZhciBpID0gMDsgaSA8IDUwOyBpKyspe1xuICAgIFx0XHR2YXIgc3RhclR5cGUgPSBNYXRoLnJhbmRvbSgpID4gMC41ID8gMCA6IDE7XG4gICAgXHRcdHZhciBzdGFyU3ByaXRlID0gdGhpcy5zdGFyRmllbGQuY3JlYXRlKHJhbmQoMCw2MzgpLCByYW5kKDUsMzYwKSwgJ3RpbGVzZXQxNicsIDQ4ICsgc3RhclR5cGUpO1xuICAgIFx0XHR0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5waHlzaWNzLmVuYWJsZShzdGFyU3ByaXRlLCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuICAgIFx0XHRzdGFyU3ByaXRlLmJvZHkuYWxsb3dHcmF2aXR5ID0gZmFsc2U7XG4gICAgXHRcdHN0YXJTcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gcmFuZCg1MCwxMDApKi0xO1xuICAgIFx0XHRzdGFyU3ByaXRlLmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlO1xuICAgIFx0XHRzdGFyU3ByaXRlLm91dE9mQm91bmRzS2lsbCA9IHRydWU7XG4gICAgXHRcdHN0YXJTcHJpdGUuZXZlbnRzLm9uS2lsbGVkLmFkZChmdW5jdGlvbihhKXtcbiAgICBcdFx0XHRhLnJlc2V0KDYzOCwgcmFuZCg1LDM2MCkpO1xuICAgIFx0XHRcdGEuYm9keS52ZWxvY2l0eS54ID0gcmFuZCg1MCwxMDApKi0xO1xuICAgIFx0XHR9KTtcbiAgICBcdH1cbiAgICB9XG5cdFxufTtcblxuZnVuY3Rpb24gcmFuZChhLCBiKXtcblx0cmV0dXJuIGEgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKGItYSkpO1xufVxuIiwiZnVuY3Rpb24gVGl0bGVQYW5lbChnYW1lQ29udHJvbGxlcikge1xuXHR0aGlzLmdhbWVDb250cm9sbGVyID0gZ2FtZUNvbnRyb2xsZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGl0bGVQYW5lbDtcblxuVGl0bGVQYW5lbC5wcm90b3R5cGUgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGZvbnQgPSB0aGlzLmdhbWVDb250cm9sbGVyLmZvbnRTcGVjO1xuXHRcdHRoaXMudGl0bGVMYXllciA9IHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLmFkZC5ncm91cCgpO1xuXHRcdHRoaXMudGl0bGVMYXllci52aXNpYmxlID0gZmFsc2U7XG5cdFx0dmFyIGJhY2tncm91bmRJbWFnZSA9IHRoaXMuZ2FtZUNvbnRyb2xsZXIucGhhc2VyLmFkZC5pbWFnZSgwLDAsJ3RpdGxlJywgbnVsbCwgdGhpcy50aXRsZUxheWVyKTtcblx0XHRiYWNrZ3JvdW5kSW1hZ2UuaW5wdXRFbmFibGVkPXRydWU7XG5cdFx0dGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLnRleHQoNjAsIDIwMCwgXCJUYXAgdG8gU3RhcnQgR2FtZVwiLCBmb250LCB0aGlzLnRpdGxlTGF5ZXIpO1xuXHRcdGJhY2tncm91bmRJbWFnZS5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuX25ld0dhbWUsIHRoaXMpO1xuXHRcdHRoaXMuX2RlY29kZVNvdW5kc1Byb2dyZXNzQXV0bygpO1xuXHRcdHRoaXMudXBLZXkgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlVQKTtcblx0fSxcblx0c2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50aXRsZUxheWVyLnZpc2libGUgPSB0cnVlO1xuXHRcdHRoaXMuZ2FtZUNvbnRyb2xsZXIubXVzaWNDb250cm9sbGVyLnBsYXlNdXNpYygndGl0bGUnKTtcblx0fSxcblx0aGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50aXRsZUxheWVyLnZpc2libGUgPSBmYWxzZTtcblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpe1xuXHRcdGlmICh0aGlzLnVwS2V5LmlzRG93bil7XG5cdFx0XHR0aGlzLl9uZXdHYW1lKCk7XG5cdFx0fVxuXHR9LFxuXHRfZGVjb2RlU291bmRzUHJvZ3Jlc3NBdXRvOiBmdW5jdGlvbigpe1xuXHRcdHZhciBwaGFzZXIgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlcjtcblx0XHR2YXIgZGVjb2RpbmdQcm9ncmVzcyA9IDA7XG5cdFx0aWYgKHBoYXNlci5jYWNoZS5pc1NvdW5kRGVjb2RlZCgnbXVzaWMtdGl0bGUnKSlcblx0XHRcdGRlY29kaW5nUHJvZ3Jlc3MgKz0gNTA7XG5cdFx0aWYgKHBoYXNlci5jYWNoZS5pc1NvdW5kRGVjb2RlZCgnbXVzaWMtZ2FtZScpKVxuXHRcdFx0ZGVjb2RpbmdQcm9ncmVzcyArPSA1MDtcblx0XHRpZiAoZGVjb2RpbmdQcm9ncmVzcyA+PSAxMDApe1xuXHRcdFx0dGhpcy5nYW1lQ29udHJvbGxlci5tdXNpY0NvbnRyb2xsZXIucGxheU11c2ljKCd0aXRsZScpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhhdC5fZGVjb2RlU291bmRzUHJvZ3Jlc3NBdXRvKCk7fSwgNTAwKTtcblx0XHR9XG5cdH0sXG5cdF9uZXdHYW1lOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMuaGlkZSgpO1xuXHRcdHRoaXMuZ2FtZUNvbnRyb2xsZXIuc3RhcnRHYW1lKCk7XG5cdH1cbn07XG4iXX0=
