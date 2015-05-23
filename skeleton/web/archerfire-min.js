(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/administrator/git/interactionSample/sample1/src/Archerfire.js":[function(require,module,exports){
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
		var uiController = new UIController(this.game, ArcherFire.setup);
		uiController.initialize();
	}
};

},{"./UIController.class":"/home/administrator/git/interactionSample/sample1/src/UIController.class.js"}],"/home/administrator/git/interactionSample/sample1/src/MusicController.class.js":[function(require,module,exports){
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
},{}],"/home/administrator/git/interactionSample/sample1/src/SFXController.class.js":[function(require,module,exports){
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
},{}],"/home/administrator/git/interactionSample/sample1/src/UIController.class.js":[function(require,module,exports){
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

UIController.prototype = {
	initialize: function(){
		this.phaser.stage.backgroundColor = '#000000';
		this.bgLayer = this.phaser.add.group();
		this.phaser.add.sprite(0,0,'background',this.bgLayer);
		this._initGUI();
		this.titlePanel = new TitlePanel(this);
		this.titlePanel.init();
		this.sfxController.init();
		this.musicController.init();
		var thus = this;
		setTimeout(function(){
			thus.titlePanel.show();
		}, 500);
	},
	_initGUI: function(){
		
	}
};
},{"./MusicController.class":"/home/administrator/git/interactionSample/sample1/src/MusicController.class.js","./SFXController.class":"/home/administrator/git/interactionSample/sample1/src/SFXController.class.js","./panels/TitlePanel.class":"/home/administrator/git/interactionSample/sample1/src/panels/TitlePanel.class.js"}],"/home/administrator/git/interactionSample/sample1/src/panels/TitlePanel.class.js":[function(require,module,exports){
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
		this.gameController.phaser.add.text(40, 200, "Welcome to Phaser!", font, this.titleLayer);
		this._decodeSoundsProgressAuto();
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

},{}]},{},["/home/administrator/git/interactionSample/sample1/src/Archerfire.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvYWRtaW5pc3RyYXRvci9naXQvaW50ZXJhY3Rpb25TYW1wbGUvc2FtcGxlMS9zcmMvQXJjaGVyZmlyZS5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L2ludGVyYWN0aW9uU2FtcGxlL3NhbXBsZTEvc3JjL011c2ljQ29udHJvbGxlci5jbGFzcy5qcyIsIi9ob21lL2FkbWluaXN0cmF0b3IvZ2l0L2ludGVyYWN0aW9uU2FtcGxlL3NhbXBsZTEvc3JjL1NGWENvbnRyb2xsZXIuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9pbnRlcmFjdGlvblNhbXBsZS9zYW1wbGUxL3NyYy9VSUNvbnRyb2xsZXIuY2xhc3MuanMiLCIvaG9tZS9hZG1pbmlzdHJhdG9yL2dpdC9pbnRlcmFjdGlvblNhbXBsZS9zYW1wbGUxL3NyYy9wYW5lbHMvVGl0bGVQYW5lbC5jbGFzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gQXJjaGVyRmlyZShzZXR1cCl7XG5cdEFyY2hlckZpcmUuc2V0dXAgPSBzZXR1cDtcblx0aWYgKHNldHVwLmlzTm9kZSl7XG5cdFx0dmFyIG53aW4gPSBuZ3VpLldpbmRvdy5nZXQoKTtcblx0ICAgIG53aW4uc2hvdygpO1xuXHQgICAgbndpbi5tYXhpbWl6ZSgpO1xuXHR9XG5cdGlmICghc2V0dXAuaXNDb2Nvb24gJiYgd2luZG93Lm1hdGNoTWVkaWEpXG5cdFx0dGhpcy5pc01vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2MHB4KVwiKS5tYXRjaGVzO1xuXHRpZiAoc2V0dXAuaXNOb2RlKVxuXHRcdHRoaXMuaXNNb2JpbGUgPSBmYWxzZTtcblx0dmFyIHBoYXNlciA9IG51bGw7XG5cdGlmICh0aGlzLmlzTW9iaWxlKSB7XG5cdFx0c2V0dXAuaXNMYW5kc2NhcGUgPSBmYWxzZTtcblx0XHRwaGFzZXIgPSBuZXcgUGhhc2VyLkdhbWUoMzIwLCA1MTIsIFBoYXNlci5BVVRPLCAncGhhc2VyLWdhbWUnLCBudWxsLCBmYWxzZSwgZmFsc2UpO1xuXHR9IGVsc2Uge1xuXHRcdHNldHVwLmlzTGFuZHNjYXBlID0gdHJ1ZTtcblx0XHRwaGFzZXIgPSBuZXcgUGhhc2VyLkdhbWUoNjQwLCAzNjAsIFBoYXNlci5BVVRPLCAncGhhc2VyLWdhbWUnLCBudWxsLCBmYWxzZSwgZmFsc2UpO1xuXHR9XG5cdHBoYXNlci5zdGF0ZS5hZGQoJ0Jvb3QnLCBBcmNoZXJGaXJlLkJvb3QpO1xuXHRwaGFzZXIuc3RhdGUuYWRkKCdQcmVsb2FkZXInLCBBcmNoZXJGaXJlLlByZWxvYWRlcik7XG5cdHBoYXNlci5zdGF0ZS5hZGQoJ0dhbWUnLCBBcmNoZXJGaXJlLkdhbWUpO1xuXHRwaGFzZXIuc3RhdGUuc3RhcnQoJ0Jvb3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNoZXJGaXJlO1xud2luZG93LkFyY2hlckZpcmUgPSBBcmNoZXJGaXJlO1xudmFyIFVJQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vVUlDb250cm9sbGVyLmNsYXNzJyk7XG5cbkFyY2hlckZpcmUuQm9vdCA9IGZ1bmN0aW9uICgpIHt9O1xuXG5BcmNoZXJGaXJlLkJvb3QucHJvdG90eXBlID0ge1xuXHQgICAgZ2V0UmF0aW86IGZ1bmN0aW9uICh0eXBlLCB3LCBoKSB7XG5cdCAgICAgICAgdmFyIHdpZHRoID0gbmF2aWdhdG9yLmlzQ29jb29uSlMgPyB3aW5kb3cuaW5uZXJXaWR0aCA6IHcsXG5cdCAgICAgICAgICAgIGhlaWdodCA9IG5hdmlnYXRvci5pc0NvY29vbkpTID8gd2luZG93LmlubmVySGVpZ2h0IDogaDtcblx0ICAgICAgICB2YXIgZGlwcyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXHQgICAgICAgIHdpZHRoID0gd2lkdGggKiBkaXBzO1xuXHQgICAgICAgIGhlaWdodCA9IGhlaWdodCAqIGRpcHM7XG5cdCAgICAgICAgdmFyIHNjYWxlWCA9IHdpZHRoIC8gdyxcblx0ICAgICAgICAgICAgc2NhbGVZID0gaGVpZ2h0IC8gaCxcblx0ICAgICAgICAgICAgcmVzdWx0ID0ge1xuXHQgICAgICAgICAgICAgICAgeDogMSxcblx0ICAgICAgICAgICAgICAgIHk6IDFcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcblx0ICAgICAgICAgICAgY2FzZSAnYWxsJzpcblx0ICAgICAgICAgICAgICAgIHJlc3VsdC54ID0gc2NhbGVYID4gc2NhbGVZID8gc2NhbGVZIDogc2NhbGVYO1xuXHQgICAgICAgICAgICAgICAgcmVzdWx0LnkgPSBzY2FsZVggPiBzY2FsZVkgPyBzY2FsZVkgOiBzY2FsZVg7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnZml0Jzpcblx0ICAgICAgICAgICAgICAgIHJlc3VsdC54ID0gc2NhbGVYID4gc2NhbGVZID8gc2NhbGVYIDogc2NhbGVZO1xuXHQgICAgICAgICAgICAgICAgcmVzdWx0LnkgPSBzY2FsZVggPiBzY2FsZVkgPyBzY2FsZVggOiBzY2FsZVk7XG5cdCAgICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgY2FzZSAnZmlsbCc6XG5cdCAgICAgICAgICAgICAgICByZXN1bHQueCA9IHNjYWxlWDtcblx0ICAgICAgICAgICAgICAgIHJlc3VsdC55ID0gc2NhbGVZO1xuXHQgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiByZXN1bHQ7XG5cdCAgICB9LFxuXHQgICAgXG4gICAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmFja2dyb3VuZCcsICdpbWcvYmFja2dyb3VuZC5wbmcnKTtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkZXJCYXInLCAnaW1nL3ByZWxvYWRlckJhci5wbmcnKTtcbiAgICB9LFxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzID0gMTtcbiAgICAgICAgaWYgKG5hdmlnYXRvci5pc0NvY29vbkpTKSB7XG4gICAgICAgIFx0dmFyIHJhdGlvID0gdGhpcy5nZXRSYXRpbygnYWxsJywgMzIwLCA1MTIpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnNjYWxlLnggPSByYXRpby54O1xuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnNjYWxlLnkgPSByYXRpby55O1xuICAgICAgICAgICAgdGhpcy5nYW1lLndvcmxkLnVwZGF0ZVRyYW5zZm9ybSgpO1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRTY3JlZW5TaXplKHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCl7XG4gICAgICAgIFx0aWYgKCFBcmNoZXJGaXJlLnNldHVwLmRvbnRTY2FsZSlcbiAgICAgICAgXHRcdHRoaXMuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUuc2V0U2NyZWVuU2l6ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXHRpZiAoIUFyY2hlckZpcmUuc2V0dXAuZG9udFNjYWxlKSBcbiAgICAgICAgXHRcdHRoaXMuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnNldFNjcmVlblNpemUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCgnUHJlbG9hZGVyJyk7XG4gICAgfVxufTtcblxuQXJjaGVyRmlyZS5QcmVsb2FkZXIgPSBmdW5jdGlvbiAoKSB7XG5cdHRoaXMuYmFja2dyb3VuZCA9IG51bGw7XG5cdHRoaXMucHJlbG9hZEJhciA9IG51bGw7XG5cdHRoaXMucmVhZHkgPSBmYWxzZTtcbn07XG5cbkFyY2hlckZpcmUuUHJlbG9hZGVyLnByb3RvdHlwZSA9IHtcblx0cHJlbG9hZDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuYWRkLnNwcml0ZSgwLCAwLCAnYmFja2dyb3VuZCcpO1xuXHRcdHRoaXMucHJlbG9hZEJhciA9IHRoaXMuYWRkLnNwcml0ZSgoMzIwLTI2MikvMiwgODAsICdwcmVsb2FkZXJCYXInKTtcblx0XHR0aGlzLmFkZC50ZXh0KDI5LCAxNjAsICdMb2FkaW5nLi4uJywge2ZvbnQ6ICcxNnB4IFBpeGVsRm9udCcsIGZpbGw6ICcjZmZmZmZmJ30pO1xuXHRcdHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZEJhcik7XG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aXRsZScsICdpbWcvdGl0bGUucG5nJyk7XG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYy10aXRsZScsIFsnbXVzaWMvMDdfLV9UZXRyaXNfVGVuZ2VuXy1fTkVTXy1fS2F0eXVzaGEub2dnJywgJ211c2ljLzA3Xy1fVGV0cmlzX1Rlbmdlbl8tX05FU18tX0thdHl1c2hhLm1wMyddKTtcblx0fSxcblx0Y3JlYXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5wcmVsb2FkQmFyLmNyb3BFbmFibGVkID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnR2FtZScpO1xuXHR9LFxufTtcblxuQXJjaGVyRmlyZS5HYW1lID0gZnVuY3Rpb24gKCkge307XG5cbkFyY2hlckZpcmUuR2FtZS5wcm90b3R5cGUgPSB7XG5cdGNyZWF0ZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgdWlDb250cm9sbGVyID0gbmV3IFVJQ29udHJvbGxlcih0aGlzLmdhbWUsIEFyY2hlckZpcmUuc2V0dXApO1xuXHRcdHVpQ29udHJvbGxlci5pbml0aWFsaXplKCk7XG5cdH1cbn07XG4iLCJmdW5jdGlvbiBNdXNpY0NvbnRyb2xsZXIoZ2FtZUNvbnRyb2xsZXIpe1xuXHR0aGlzLmdhbWVDb250cm9sbGVyID0gZ2FtZUNvbnRyb2xsZXI7XG5cdHRoaXMubXVzaWNNYXAgPSB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNdXNpY0NvbnRyb2xsZXI7XG5cbk11c2ljQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cdHZhciBwaGFzZXIgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlcjtcblx0dGhpcy5tdXNpY01hcFsndGl0bGUnXSA9IHBoYXNlci5hZGQuYXVkaW8oJ211c2ljLXRpdGxlJywwLjcpO1xufTtcblxuTXVzaWNDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5TXVzaWMgPSBmdW5jdGlvbihrZXkpe1xuXHR2YXIgbXVzaWMgPSB0aGlzLm11c2ljTWFwW2tleV07XG5cdGlmICghbXVzaWMpe1xuXHRcdHJldHVybjtcblx0fVxuXHRpZiAodGhpcy5jdXJyZW50TXVzaWNLZXkgPT0ga2V5KVxuXHRcdHJldHVybjtcblx0aWYgKHRoaXMuY3VycmVudE11c2ljKVxuXHRcdHRoaXMuY3VycmVudE11c2ljLnN0b3AoKTtcblx0aWYgKCF0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5jYWNoZS5pc1NvdW5kRGVjb2RlZCgnbXVzaWMtJytrZXkpKXtcblx0XHRyZXR1cm47XG5cdH1cblx0dGhpcy5jdXJyZW50TXVzaWMgPSBtdXNpYztcblx0dGhpcy5jdXJyZW50TXVzaWNLZXkgPSBrZXk7XG5cdHRoaXMuY3VycmVudE11c2ljLnBsYXkoJycsIDAsIDAuMiwgdHJ1ZSk7XG59O1xuXG5NdXNpY0NvbnRyb2xsZXIucHJvdG90eXBlLnN0b3BNdXNpYyA9IGZ1bmN0aW9uKCl7XG5cdGlmICh0aGlzLmN1cnJlbnRNdXNpYylcblx0XHR0aGlzLmN1cnJlbnRNdXNpYy5zdG9wKCk7XG5cdHRoaXMuY3VycmVudE11c2ljS2V5ID0gZmFsc2U7XG59OyIsImZ1bmN0aW9uIFNGWENvbnRyb2xsZXIoZ2FtZUNvbnRyb2xsZXIpe1xuXHR0aGlzLmdhbWVDb250cm9sbGVyID0gZ2FtZUNvbnRyb2xsZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU0ZYQ29udHJvbGxlcjtcblxuU0ZYQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cdHZhciBwaGFzZXIgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlcjtcblx0dGhpcy5zZnggPSB7XG5cdFx0Ly8gc2xhc2g6IHBoYXNlci5hZGQuYXVkaW8oJ3NmeC1zbGFzaCcsIDAuNSlcblx0fTtcbn07XG5cblNGWENvbnRyb2xsZXIucHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbihrZXkpe1xuXHR0aGlzLnNmeFtrZXldLnBsYXkoJycsMCwwLjIpO1xufTsiLCJmdW5jdGlvbiBVSUNvbnRyb2xsZXIoX3BoYXNlciwgc2V0dXApe1xuXHR0aGlzLnBoYXNlciA9IF9waGFzZXI7XG5cdHRoaXMucGxheWVyID0gbnVsbDtcblx0dGhpcy5sZXZlbCA9IG51bGw7XG5cdHRoaXMuZm9udCA9ICcxNnB4IFBpeGVsRm9udCc7XG5cdHRoaXMuZm9udENvbG9yID0gJyNkZGRkZGQnO1xuXHR0aGlzLnRpdGxlQ29sb3IgPSAnI2RkZGQwMCc7XG5cdHRoaXMuZm9udFNwZWMgPSB7Zm9udDogdGhpcy5mb250LCBmaWxsOiB0aGlzLmZvbnRDb2xvcn07O1xuXHR0aGlzLmlzRGVza3RvcCA9IHNldHVwLmlzRGVza3RvcDtcblx0dGhpcy5pc0NvY29vbiA9IHNldHVwLmlzQ29jb29uO1xuXHR0aGlzLm11c2ljQ29udHJvbGxlciA9IG5ldyBNdXNpY0NvbnRyb2xsZXIodGhpcyk7XG5cdHRoaXMuc2Z4Q29udHJvbGxlciA9IG5ldyBTRlhDb250cm9sbGVyKHRoaXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVJQ29udHJvbGxlcjtcbnZhciBNdXNpY0NvbnRyb2xsZXIgPSByZXF1aXJlKCcuL011c2ljQ29udHJvbGxlci5jbGFzcycpO1xudmFyIFNGWENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL1NGWENvbnRyb2xsZXIuY2xhc3MnKTtcbnZhciBUaXRsZVBhbmVsID0gcmVxdWlyZSgnLi9wYW5lbHMvVGl0bGVQYW5lbC5jbGFzcycpO1xuXG5VSUNvbnRyb2xsZXIucHJvdG90eXBlID0ge1xuXHRpbml0aWFsaXplOiBmdW5jdGlvbigpe1xuXHRcdHRoaXMucGhhc2VyLnN0YWdlLmJhY2tncm91bmRDb2xvciA9ICcjMDAwMDAwJztcblx0XHR0aGlzLmJnTGF5ZXIgPSB0aGlzLnBoYXNlci5hZGQuZ3JvdXAoKTtcblx0XHR0aGlzLnBoYXNlci5hZGQuc3ByaXRlKDAsMCwnYmFja2dyb3VuZCcsdGhpcy5iZ0xheWVyKTtcblx0XHR0aGlzLl9pbml0R1VJKCk7XG5cdFx0dGhpcy50aXRsZVBhbmVsID0gbmV3IFRpdGxlUGFuZWwodGhpcyk7XG5cdFx0dGhpcy50aXRsZVBhbmVsLmluaXQoKTtcblx0XHR0aGlzLnNmeENvbnRyb2xsZXIuaW5pdCgpO1xuXHRcdHRoaXMubXVzaWNDb250cm9sbGVyLmluaXQoKTtcblx0XHR2YXIgdGh1cyA9IHRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dGh1cy50aXRsZVBhbmVsLnNob3coKTtcblx0XHR9LCA1MDApO1xuXHR9LFxuXHRfaW5pdEdVSTogZnVuY3Rpb24oKXtcblx0XHRcblx0fVxufTsiLCJmdW5jdGlvbiBUaXRsZVBhbmVsKGdhbWVDb250cm9sbGVyKSB7XG5cdHRoaXMuZ2FtZUNvbnRyb2xsZXIgPSBnYW1lQ29udHJvbGxlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaXRsZVBhbmVsO1xuXG5UaXRsZVBhbmVsLnByb3RvdHlwZSA9IHtcblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHR2YXIgZm9udCA9IHRoaXMuZ2FtZUNvbnRyb2xsZXIuZm9udFNwZWM7XG5cdFx0dGhpcy50aXRsZUxheWVyID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLmdyb3VwKCk7XG5cdFx0dGhpcy50aXRsZUxheWVyLnZpc2libGUgPSBmYWxzZTtcblx0XHR2YXIgYmFja2dyb3VuZEltYWdlID0gdGhpcy5nYW1lQ29udHJvbGxlci5waGFzZXIuYWRkLmltYWdlKDAsMCwndGl0bGUnLCBudWxsLCB0aGlzLnRpdGxlTGF5ZXIpO1xuXHRcdGJhY2tncm91bmRJbWFnZS5pbnB1dEVuYWJsZWQ9dHJ1ZTtcblx0XHR0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlci5hZGQudGV4dCg0MCwgMjAwLCBcIldlbGNvbWUgdG8gUGhhc2VyIVwiLCBmb250LCB0aGlzLnRpdGxlTGF5ZXIpO1xuXHRcdHRoaXMuX2RlY29kZVNvdW5kc1Byb2dyZXNzQXV0bygpO1xuXHR9LFxuXHRzaG93OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnRpdGxlTGF5ZXIudmlzaWJsZSA9IHRydWU7XG5cdFx0dGhpcy5nYW1lQ29udHJvbGxlci5tdXNpY0NvbnRyb2xsZXIucGxheU11c2ljKCd0aXRsZScpO1xuXHR9LFxuXHRoaWRlOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnRpdGxlTGF5ZXIudmlzaWJsZSA9IGZhbHNlO1xuXHR9LFxuXHRfZGVjb2RlU291bmRzUHJvZ3Jlc3NBdXRvOiBmdW5jdGlvbigpe1xuXHRcdHZhciBwaGFzZXIgPSB0aGlzLmdhbWVDb250cm9sbGVyLnBoYXNlcjtcblx0XHR2YXIgZGVjb2RpbmdQcm9ncmVzcyA9IDA7XG5cdFx0aWYgKHBoYXNlci5jYWNoZS5pc1NvdW5kRGVjb2RlZCgnbXVzaWMtdGl0bGUnKSlcblx0XHRcdGRlY29kaW5nUHJvZ3Jlc3MgKz0gMTAwO1xuXHRcdGlmIChkZWNvZGluZ1Byb2dyZXNzID49IDEwMCl7XG5cdFx0XHR0aGlzLmdhbWVDb250cm9sbGVyLm11c2ljQ29udHJvbGxlci5wbGF5TXVzaWMoJ3RpdGxlJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGF0Ll9kZWNvZGVTb3VuZHNQcm9ncmVzc0F1dG8oKTt9LCA1MDApO1xuXHRcdH1cblx0fVxufTtcbiJdfQ==
