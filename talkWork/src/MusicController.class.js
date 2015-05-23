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