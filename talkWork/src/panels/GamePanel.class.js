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
