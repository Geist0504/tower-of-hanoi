const DISCWIDTH = 30;
let maxDisc = 5;
let maxDiscWidth = DISCWIDTH*maxDisc;
let towerWidth = 10;
const DISCHEIGHT = 15;
let discs =[];
let MAXSTACKHEIGHT = 0;
let ANIMATIONTIME = 500;

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
	})
	
	$('.solve').click(function(){
		var gen = tower(maxDisc-1,poles[2],poles[1], poles[0], discs);
		iterate(gen, interval);
		var interval = setInterval(function(){
			iterate(gen, interval)}, ANIMATIONTIME*3.2);
		$('.speed').click(function(interval){
			clearInterval(interval);
			ANIMATIONTIME = 50;
			interval = setInterval(function(){
			iterate(gen, interval)}, ANIMATIONTIME*3.5);

		})
	})
	$('.reset').click(function(){
		reset();
	})
});

function iterate(gen, interval) {
	if(gen.next().done === true){
		clearInterval(interval);
	}
}

function *tower(discNum, source, destination, spare, discs){
	let discObj = discs[discNum];
	//console.log('Disc: '+ discNum, 'Source: ' + source.id, 'destination: ' + destination.id, 'spare: '+ spare.id);
	if(discObj.id === 0){
		animateDisc(discs[discObj.id], source, destination);
		yield;
	}
	else{
		yield *tower(discNum-1, source, spare, destination, discs);
		animateDisc(discs[discObj.id], source, destination);
		yield;
		yield *tower(discNum-1, spare, destination, source, discs);
	}
}

/*function tower(discNum, source, destination, spare, discs){
	let discObj = discs[discNum];
	console.log('Disc: '+ discNum, 'Source: ' + source.id, 'destination: ' + destination.id, 'spare: '+ spare.id);
	if(discObj.id === 0){
		animateDisc(discs[discObj.id], source, destination);
	}
	else{
		tower(discNum-1, source, spare, destination, discs);
		setTimeout(function(){
		animateDisc(discs[discObj.id], source, destination).done(function(){
			tower(discNum-1, spare, destination, source, discs);
		});
	}, ANIMATIONTIME*3);
	}
}
*/
function setPlatform(maxDisc, poles){
	maxDiscWidth = DISCWIDTH + (maxDisc*10);
	MAXSTACKHEIGHT = DISCHEIGHT*maxDisc;
	$('.dropdown').css('display', 'none');
	$('.after').addClass('btn');
	$('.after').css('display', 'flex')
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
	poles[0].stackHeight = 0;
	poles[1].stackHeight = 0;
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
	let discID = disc.id;
	let maxDisc = MAXSTACKHEIGHT/15;
	let lift = disc.top - (MAXSTACKHEIGHT) - (3*DISCHEIGHT);
	let id = targetPole.id;
	let descend = lift + MAXSTACKHEIGHT+ (3*DISCHEIGHT) + ((maxDisc-discID-1)*DISCHEIGHT) - targetPole.stackHeight;
	let shift = maxDiscWidth*(id-2);
	//console.log('Disc: '+ disc.id, 'Target: ' + id, 'Lift: ' + lift, 'shift: '+ shift, 'desc: '+ descend, 'current height: '+ currentPole.stackHeight, 'target height: '+ targetPole.stackHeight);

	return $('#disc'+disc.id).animate({
		top: lift
	}, ANIMATIONTIME, function(){
		//move disc over to middle of target pole
		currentPole.removeDisc();
		$('#disc'+disc.id).animate({
		left: shift
		}, ANIMATIONTIME, function(){
			//lower disc to top of tP stakc height
			targetPole.addDisc();
			$('#disc'+disc.id).animate({
				top: descend
			}, ANIMATIONTIME)
		})
	}).promise();

}

function reset(){
	$('.disc').remove();
	$('.after').removeClass('btn');
	$('.after').css('display', 'none')
	$(".platform").css('display', 'none');
	$('.dropdown').css('display', 'flex');
	ANIMATIONTIME = 500;
}