const DISCWIDTH = 30;
let maxDisc = 5;
let maxDiscWidth = DISCWIDTH*maxDisc;
let towerWidth = 10;
let DISCHEIGHT = 15;

$(document).ready(function(){
	console.log("working");

	$('.dropdown-menu li > a').click(function(e){
		maxDisc = this.innerHTML;
		setPlatform(maxDisc);
		console.log('maxDisc = ' + maxDiscWidth)
		setDisc(maxDisc);
	})
});

function setPlatform(maxDisc){
	maxDiscWidth = DISCWIDTH + (maxDisc*10);
	$(".platform").css('display', 'flex');
	$('#base').css('width', maxDiscWidth*3 + 'px');
	for (let i = 1; i < 4; i++){
		let offset = ((maxDiscWidth-towerWidth)/2);
		let shift = (maxDiscWidth*(i-1)) + offset;
		$('#pole'+i).css('left', (shift + 'px'));
		console.log(shift + 'px;');
	}
	let poleHeight = maxDisc * DISCHEIGHT + DISCHEIGHT;
	$('.pole').css('height', poleHeight +'px');
	$('.pole').css('top', -poleHeight +'px');
}

function setDisc(maxDisc){
	for(let i = 0; i<maxDisc; i++){
		maxDiscWidth = DISCWIDTH + (maxDisc*10);
		$('.discs').append('<div class = "disc" id = "disc'+i+'"></div>');
		let width = DISCWIDTH+(i*10);
		$('#disc'+i).css('width', width);
		$('#disc'+i).css('top', -(maxDisc*15)-20 + 'px');
		$('#disc'+i).css('left', maxDiscWidth + 'px');
	}
}