
function onLoad(isNode){
	if (!ArcherFire){
		setTimeout(function(){
			onLoad();
		}, 1000);
		return;
	}
	new ArcherFire({isNode: isNode});
}