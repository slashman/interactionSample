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
