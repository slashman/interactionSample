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