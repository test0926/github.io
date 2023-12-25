document.addEventListener('DOMContentLoaded', () => {
	/*
		스크롤시 헤더가 숨겨지는 위치는 scroll-trigger의 getBoundingClientRect().top 과 동일합니다.
		요소높이 + 스크롤 offset 값이scroll-trigger 위치에 도달하면 hide-header 클래스가 추가됩니다.
	*/
	var scrollable = new scrollEvent('.header', {
		end : '.scroll-trigger',
	});
});
scrollEvent = function(target, option){
	var _this = this;
	this.els = {
		scrolltarget : document.querySelector(target),
		scrollEndTarget : document.querySelector(option.end),
	}
	this.position = {
		scrollTop : 0,
		scrollLeft : 0,
		scrollLast : 0,
		scrollBottom: 0,
		direction : 'down',
	}
	// scroll position  
	this.getposition = () => {
		this.position.scrollLast = this.position.scrollTop;
		this.position.scrollTop = window.scrollY;
		this.position.scrollLeft = window.scrollX;
		this.position.scrollBottom = this.position.scrollTop + window.innerHeight;
		this.position.direction = this.getDirection();
	}
	// scroll direction 
	this.getDirection = () => {
		if(this.position.scrollLast >= this.position.scrollTop){
			return 'up';
		} else {
			return 'down';
		}
	}
	// direction class
	this.directionClass = (target) => {
		if(this.position.direction === 'down'){
			target.classList.add('scrollDown');
			target.classList.remove('scrollUp');
		} else if(this.position.direction === 'up'){
			target.classList.add('scrollUp');
			target.classList.remove('scrollDown');
		}
	}
	this.scrolloffset = (target) => {
		return window.pageYOffset + target.getBoundingClientRect().top;
	}
	this.scrollDirection = (target, margin) => { 
		if(!_this.els.scrollEndTarget) {
			console.log('not find scroll-trigger element');
			return;
		}
		var offset = parseInt(_this.scrolloffset(target).toFixed(0)) + target.getBoundingClientRect().height ; 
		var hide_offset = parseInt(_this.scrolloffset(_this.els.scrollEndTarget).toFixed(0)); 

		if(offset >= hide_offset){
			target.classList.add('hide-header');
		} else {
			target.classList.remove('hide-header');
		}

		if(offset == 0){
			target.classList.remove('scrollUp', 'scrollDown');
		} else if(offset > 0){
			_this.directionClass(target);
		}
	}
	// scrolling define
	this.scrolling = (e) => {
		this.getposition();
		this.scrollDirection(this.els.scrolltarget, 0);
	}
	this.init = () => {
		this.scrolling();
	}
	this.ready = () => {
		window.addEventListener('scroll', (e) => {
			_this.scrolling();
		});
		window.addEventListener('resize', (e) => {
			_this.init();
		});
	}
	this.ready();
}