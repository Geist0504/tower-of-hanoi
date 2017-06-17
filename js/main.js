const DISCWIDTH = 30;
let maxDisc = 5;
let maxDiscWidth = DISCWIDTH*maxDisc;
let towerWidth = 10;
const DISCHEIGHT = 15;
let discs =[];
let MAXSTACKHEIGHT = 0;
const ANIMATIONTIME = 1000;

function pole(height, left, stackHeight) {
    this.height = height;
    this.left = left;
    this.stackHeight = stackHeight
    this.changeLeft = function(num){
    	this.left = num;
    }
    this.addDisc = function(){
    	this.stackHeight += DISCHEIGHT;
    }
    this.removeDisc = function(){
    	this.stackHeight -= DISCHEIGHT;
    }
}

function disc(id) {
    this.id = id;
}


$(document).ready(function(){
	const poleL = new pole(0,0,0);
	const poleC = new pole(0,0,0);
	const poleR = new pole(0,0,0);

	const poles = [poleL, poleC, poleR];
	const discs = [];

	$('.dropdown-menu li > a').click(function(e){
		maxDisc = this.innerHTML;
		setPlatform(maxDisc, poles);
		setDisc(maxDisc, discs);
		console.log(MAXSTACKHEIGHT);
		console.log(poles);
	})
	
	$('.btn').click(function(){
		animateDisc(discs[0],poles[2],poles[1]);
	})

});

function setPlatform(maxDisc, poles){
	maxDiscWidth = DISCWIDTH + (maxDisc*10);
	MAXSTACKHEIGHT = DISCHEIGHT*maxDisc;
	$(".platform").css('display', 'flex');
	$('#base').css('width', maxDiscWidth*3 + 'px');
	let poleHeight = maxDisc * DISCHEIGHT + DISCHEIGHT;
	for (let i = 1; i < 4; i++){
		let offset = ((maxDiscWidth-towerWidth)/2);
		let shift = (maxDiscWidth*(i-1)) + offset;
		$('#pole'+i).css('left', (shift + 'px'));
		poles[i-1].changeLeft(shift);
		poles[i-1].height =  poleHeight;
		poles[i-1].id = i;
	}
	$('.pole').css('height', poleHeight +'px');
	$('.pole').css('top', -poleHeight +'px');
	poles[2].stackHeight = poleHeight - DISCHEIGHT;
}

function setDisc(maxDisc, discs){
	for(let i =maxDisc; i>=0; i--){
		$('.discs').prepend('<div class = "disc" id = "disc'+i+'"></div>');
		discs.unshift(new disc(i));
	}
	var i = maxDisc-1;
	let timer = setInterval(function(){
		if (i>=0) {
			maxDiscWidth = DISCWIDTH + (maxDisc*10);
			$('#disc'+i).addClass("animated fadeInDown");
			$('#disc'+i).css('display', 'flex');
			let width = DISCWIDTH+(i*10);
			$('#disc'+i).css('width', width);
			discs[i].width = width;
			$('#disc'+i).css('top', -(maxDisc*15)-20 + 'px');
			discs[i].top = -(maxDisc*15)-20;
			$('#disc'+i).css('left', maxDiscWidth + 'px');
			discs[i].left = maxDiscWidth;
			i--;
		}
		else{
			clearInterval(timer);
		}
	},500)
	discs.pop();	
}

function animateDisc(disc, currentPole, targetPole){

	//move disc up to above current pole
	let lift = disc.top - (MAXSTACKHEIGHT - currentPole.stackHeight) - (3*DISCHEIGHT);
	let id = targetPole.id;
	let descend = lift + (MAXSTACKHEIGHT - targetPole.stackHeight) + (2*DISCHEIGHT);

	$('#disc'+disc.id).animate({
		top: lift
	}, ANIMATIONTIME, function(){
		//move disc over to middle of target pole
		currentPole.removeDisc();
		let shift = maxDiscWidth*(id-2);
		console.log(shift);
		$('#disc'+disc.id).animate({
		left: shift
		}, ANIMATIONTIME, function(){
			//lower disc to top of tP stakc height
			targetPole.addDisc();
			$('#disc'+disc.id).animate({
				top: descend
			}, ANIMATIONTIME)
		})
	});
}