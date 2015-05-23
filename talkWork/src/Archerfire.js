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
