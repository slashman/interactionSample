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