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
