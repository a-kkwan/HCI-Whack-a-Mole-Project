function getRandomClr() {
	var clr = '#';
	var set = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
	for(var i = 0; i < 6; i++) {
		clr += set[Math.floor(Math.random()*16)];
	} 
	return clr;
}

function changeBgColor() {
	document.getElementById("box").style.backgroundColor = getRandomClr();
}

setInterval(changeBgColor,1000);
