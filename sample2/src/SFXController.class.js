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