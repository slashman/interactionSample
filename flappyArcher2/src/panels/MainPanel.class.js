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
