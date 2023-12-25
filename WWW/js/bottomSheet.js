/*
    코드 확장성을 위한 임시 변수들이 있습니다.
*/ 
const bottomSheetJS = function (
    target = '.bottomSheet-container', 
    option = false,
){
    let _this = this;
    this.window = window;
    this.target = document.querySelector(target); 
    this.els = {
        overlay : _this.target.querySelector('.overlay'),
        bottomSheet : _this.target.querySelector(".bottomSheet"),
        head : _this.target.querySelector('.bs_head'),
        handler : _this.target.querySelector(".bs_dragable"),
        scroller : _this.target.querySelector('.bs_content'),
    }
    this.option = {
        timer: 300,                 // transition timer
        touch : {
            clientRect : [],
            isTuche : false,        // touch press 
            touchMoveY : 0,         // current move Y
            touches : [],           // touch object
        },
        callback : null,            // Callback
        expand : {
            expandable : true,      // 확장 여부
            max: 1,                 // 최대크기를 제한합니다.
            min: 60,                // 최소크기를 제한합니다.
            state : 'minimize',     // 확장 상태
        } 
    };
    this.touch = this.option.touch;
    this.option.expand.max = this.option.expand.max / this.window.innerHeight;
    this.option.expand.min = 100 - (this.option.expand.max / this.window.innerHeight * 100)
    this.pointerY = false;
    this.startClientRect = [];
    this.getDirection = (e) =>  {
        if(_this.startClientRect.top >= _this.els.bottomSheet.getBoundingClientRect().top){
            return 'up';
        } else {
            return 'down';
        }
    }
    this.calcPer = (value) => {
        return value / _this.window.innerHeight * 100;
    }
    this.setPosition = (value) => {
        _this.els.bottomSheet.style.top = Math.max(_this.option.expand.max, Math.min(_this.option.expand.min, value)) + '%';
    }
    this.touchPosition = (e) => {
        return e.touches ? e.touches[0] : e;
    }
    this.touchStart = (e) =>{
        // console.log('touchStart');
        _this.startClientRect = _this.els.bottomSheet.getBoundingClientRect(); // 시작 위치 기록
        _this.touch.isTuche = true;
        _this.els.handler.style.cursor = document.body.style.cursor = "grabbing";
        _this.els.bottomSheet.classList.add("not-selectable");
        _this.pointerY = _this.touchPosition(e).pageY;
    }
    this.touchMove = (e) =>{
        // console.log('touchMove');
        if (_this.touch.isTuche === false) return

        // 터치 좌표와 실제 오브젝트 좌표의 차이를 계산 후 백분율로 치환.
        diffy = _this.calcPer(_this.pointerY - _this.touchPosition(e).pageY);

        // bottomSheet 오브젝트의 Y 위치를 백분율로 치환.
        current = _this.calcPer(_this.els.bottomSheet.getBoundingClientRect().top);

        // 현재Y - 이동Y 를 뺀 좌표로 이동합니다.   
        _this.setPosition(current - diffy);

        // 이동 위치만큼 터치 Y값을 변경합니다.
        _this.pointerY = _this.touchPosition(e).pageY;
    }
    this.touchEnd = (e) => {
        if (_this.touch.isTuche === false) {
            return;
        }

        // console.log('touchEnd');
        _this.touch.isTuche = false;
        _this.els.handler.style.cursor = document.body.style.cursor = "";
        _this.els.bottomSheet.classList.remove("not-selectable");

        // 현재 target이 handler 가 아닌 경우 bottomsheet의  시작위치를 변경합니다(touch start).
        if(e.target !== _this.els.handler) _this.startClientRect =  _this.els.bottomSheet.getBoundingClientRect();

        if(_this.startClientRect.top || _this.startClientRect.top === 0){
            direction = _this.getDirection(); // move direction = up, down

            // 확장
            if(direction === 'up' && _this.option.expand.expandable === true){
                // 이동한 Y값이 남은 Y값의  1 / 3 보다 크면 확장합니다.
                // 이동한 Y값이 남은 Y값의  1 / 3 보다 작으면 되돌립니다. 
                // 최대화 상태일태 위치 고정.
                rover = _this.startClientRect.top/3;
                moved = _this.startClientRect.top - _this.els.bottomSheet.getBoundingClientRect().top;
                _this.option.expand.state !== 'maximize' ?
                    rover > moved ? _this.minimize():_this.maximize():false;

            // 축소
            } else {
                // 현재 높이값이 뷰사이즈보다 크면 최대확장 상태,
                // 현재 높이값이 뷰사이즈보다 작으면 최소 확장상태,
                // 현재 높이값이 최소 확장상태면 바텀시트를 닫습니다.

                // 이동한 높이값이 남은높이값의  1 / 3 보다 크면 확장합니다.
                // 이동한 높이값이 남은높이값의  1 / 3 보다 작으면 되돌립니다. 
                // 전체화면 일때 - 기본크기의 좌표 y ; 
                height = _this.option.expand.state === 'maximize' ? (_this.touch.clientRect.top - _this.touch.clientRect.height):_this.startClientRect.height;
                rover = height/3;
                moved =  _this.startClientRect.height - _this.els.bottomSheet.getBoundingClientRect().height;
                _this.option.expand.state === 'maximize' ? 
                    rover > moved ? _this.maximize(e):_this.minimize(e):
                    rover > moved ? _this.minimize(e):_this.close(e);
            }
        } 
    }
    this.minimize = (e) =>{
        // console.log('최소화');
        _this.setPosition(100 - (_this.touch.clientRect.height / _this.window.innerHeight * 100));
        _this.option.expand.state = 'minimize';
    }
    this.maximize = (e) =>{
        // console.log('쵀대화');
        _this.setPosition(_this.option.expand.max);
        _this.option.expand.state = 'maximize';
    }
    this.open = (e) =>{
        document.querySelector('body').classList.add("hide");
        // console.log('열기');
        _this.target.setAttribute("aria-hidden", false);
        // _this.history('open');
    }
    this.close = (e) =>{
        document.querySelector('body').classList.remove("hide");
        // console.log('닫기');
        // 닫기전 최초 크기로 변경.
        _this.target.setAttribute("aria-hidden", true);
        _this.minimize(e);
    }
    this.callback = (e) => {
        // callback
        console.log('콜백');
    }
    // scrolling define
    this.scrolling = (e) => {
        _this.els.scroller.scrollTop > 0 ? 
            _this.els.head.classList.add('scrollDown'):
            _this.els.head.classList.remove('scrollDown');
    }
    this.history = function(log){
        // 히스토리 추가 
        if(log){
            history.pushState(log, log, document.location.href + '#'+log)
        } else {
            history.pushState(null, null, document.location.href);
        }
    }
    this.resize = (e) => {
        // console.log('resize');
        _this.window = window;
        _this.close(e);
    }
    this.ready = (e) => {
        //  초기값 저장
        _this.touch.clientRect = _this.els.bottomSheet.getBoundingClientRect();

        // touch start event
        _this.els.handler.addEventListener("touchstart", _this.touchStart);
        _this.els.handler.addEventListener("mousedown", _this.touchStart);

        // touch mover event
        _this.window.addEventListener("touchmove", _this.touchMove);
        _this.window.addEventListener("mousemove", _this.touchMove);
        _this.window.addEventListener("touchend", _this.touchEnd);
        _this.window.addEventListener("mouseup", _this.touchEnd);

        // overlay, handler click close 
        _this.els.overlay.addEventListener("click", _this.close);
        _this.els.handler.addEventListener("click", _this.close);

        // content scrolling event
        _this.els.scroller.addEventListener('scroll', _this.scrolling);

        // history 
        window.onpopstate = (e) =>{
            let state = JSON.stringify(e.state);
            if(state == 'null'){
                _this.close(e);
            }
        }
    }
    this.ready();
}

// var test = new bottomSheetJS();
