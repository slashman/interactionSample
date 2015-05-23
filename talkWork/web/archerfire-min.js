(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/slash/git/interactionSample/sample1/src/Archerfire.js":[function(require,module,exports){
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
		this.load.spritesheet('tileset16', 'img/tileset16.png', 16, 16);
		this.load.audio('music-title', ['music/07_-_Tetris_Tengen_-_NES_-_Katyusha.ogg', 'music/07_-_Tetris_Tengen_-_NES_-_Katyusha.mp3']);
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
		var uiController = new UIController(this.game, ArcherFire.setup);
		uiController.initialize();
		this.uiController = uiController;
	},
	update: function(){
		this.uiController.update();
	}
};

},{"./UIController.class":"/Users/slash/git/interactionSample/sample1/src/UIController.class.js"}],"/Users/slash/git/interactionSample/sample1/src/MusicController.class.js":[function(require,module,exports){
function MusicController(gameController){
	this.gameController = gameController;
	this.musicMap = {};
}

module.exports = MusicController;

MusicController.prototype.init = function(){
	var phaser = this.gameController.phaser;
	this.musicMap['title'] = phaser.add.audio('music-title',0.7);
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
},{}],"/Users/slash/git/interactionSample/sample1/src/SFXController.class.js":[function(require,module,exports){
function SFXController(gameController){
	this.gameController = gameController;
}

module.exports = SFXController;

SFXController.prototype.init = function(){
	var phaser = this.gameController.phaser;
	this.sfx = {
		// slash: phaser.add.audio('sfx-slash', 0.5)
	};
};

SFXController.prototype.play = function(key){
	this.sfx[key].play('',0,0.2);
};
},{}],"/Users/slash/git/interactionSample/sample1/src/UIController.class.js":[function(require,module,exports){
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
var GamePanel = require('./panels/GamePanel.class');

UIController.prototype = {
	initialize: function(){
		this.phaser.stage.backgroundColor = '#000000';
		this.bgLayer = this.phaser.add.group();
		this.phaser.add.sprite(0,0,'background',this.bgLayer);
		this._initGUI();
		this.titlePanel = new TitlePanel(this);
		this.titlePanel.init();
		this.gamePanel = new GamePanel(this);
		this.gamePanel.init();
		this.sfxController.init();
		this.musicController.init();
		var thus = this;
		setTimeout(function(){
			thus.titlePanel.show();
		}, 500);
	},
	_initGUI: function(){
		
	},
	update: function(){
		if (this.gamePanel.gameLayer.visible){
			this.gamePanel.update();
		}
	}
};
},{"./MusicController.class":"/Users/slash/git/interactionSample/sample1/src/MusicController.class.js","./SFXController.class":"/Users/slash/git/interactionSample/sample1/src/SFXController.class.js","./panels/GamePanel.class":"/Users/slash/git/interactionSample/sample1/src/panels/GamePanel.class.js","./panels/TitlePanel.class":"/Users/slash/git/interactionSample/sample1/src/panels/TitlePanel.class.js"}],"/Users/slash/git/interactionSample/sample1/src/panels/GamePanel.class.js":[function(require,module,exports){
function GamePanel(gameController) {
	this.gameController = gameController;
}

module.exports = GamePanel;

GamePanel.prototype = {
	init: function() {   
		this.gameLayer = this.gameController.phaser.add.group();
		this.gameLayer.visible = false;
		var backgroundImage = this.gameController.phaser.add.image(0,0,'background', null, this.gameLayer);
		backgroundImage.inputEnabled=true;
		var shipSprite = this.gameController.phaser.add.sprite(40,40,'tileset32', 0, this.gameLayer);
		this.gameController.phaser.physics.enable(shipSprite, Phaser.Physics.ARCADE);
		this.shipSprite = shipSprite;
		this.nextFireTime = 0;
	},
	show: function() {
		this.gameLayer.visible = true;
		this.gameController.phaser.physics.arcade.gravity.y = 200;
		//this.gameController.musicController.playMusic('title');
	},
	hide: function() {
		this.gameLayer.visible = false;
	},
	update: function(){
		if (this.gameController.phaser.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			this.shipSprite.body.velocity.y = -100;
			this.shipSprite.body.acceleration.y = -100;
		}
		if (this.gameController.phaser.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			var currentTime = this.gameController.phaser.time.time;
			if (currentTime < this.nextFireTime)
				return;
			this.nextFireTime = currentTime + 500;
			
			var missileSprite = this.gameController.phaser.add.sprite(this.shipSprite.x,this.shipSprite.y,'tileset16', 32, this.gameLayer);
			this.gameController.phaser.physics.enable(missileSprite, Phaser.Physics.ARCADE);
			missileSprite.body.velocity.x = 50;
			missileSprite.body.acceleration.x = 50;
			missileSprite.body.allowGravity = false;

		}

	}
};

},{}],"/Users/slash/git/interactionSample/sample1/src/panels/TitlePanel.class.js":[function(require,module,exports){
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
		backgroundImage.events.onInputDown.add(this._newGame, this);
		this.gameController.phaser.add.text(40, 200, "Bienvenido a Parce Quest", font, this.titleLayer);
		this._decodeSoundsProgressAuto();
	},
	_newGame: function(){
		this.gameController.gamePanel.show();
	},
	show: function() {
		this.titleLayer.visible = true;
		this.gameController.musicController.playMusic('title');
	},
	hide: function() {
		this.titleLayer.visible = false;
	},
	_decodeSoundsProgressAuto: function(){
		var phaser = this.gameController.phaser;
		var decodingProgress = 0;
		if (phaser.cache.isSoundDecoded('music-title'))
			decodingProgress += 100;
		if (decodingProgress >= 100){
			this.gameController.musicController.playMusic('title');
		} else {
			var that = this;
			setTimeout(function(){that._decodeSoundsProgressAuto();}, 500);
		}
	}
};

},{}]},{},["/Users/slash/git/interactionSample/sample1/src/Archerfire.js"]);
