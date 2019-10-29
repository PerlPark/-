/* Status */
let status = {
 currentPosition: false,
 busList: true
};

/* 앱 이용 가능 상태 판별 */
let checkStatus = function(...args){
  console.dir(status);
  return args.every(value => value);
}

/* 모달 생성 객체 */
let modal = function(message, id){
  let box = document.createElement('div');
  box.textContent = message;
  box.setAttribute('id', id);
  box.setAttribute('class', 'modal');

  modal.prototype.append = function(){
    document.body.appendChild(box);
  }
  modal.prototype.remove = function(){
    document.body.removeChild(document.getElementById(id));
  }
};

/* 버스 노선 목록 */
let busList = [];

/* 앱 이용 불가 얼럿 출력 */
let error = function(code){
  // CODE
  // 1 앱 이용 불가
  let message = '예기치 않은 오류가 발생하였습니다. 앱을 이용할 수 없습니다. 다음에 다시 시도해주시기 바랍니다.';
  switch (code) {
    // 2 기준 위치 없음
    case 2:
      message = '기준 위치를 찾을 수 없습니다. 현재 위치를 찾는 동안 기다리시거나, 위치를 지정해주세요.';
      break;
    // 3 버스 번호 입력되지 않음
    case 3:
      message = '찾을 버스를 선택해 주세요.';
      break;
  }
  alert(message);
}

/* 뒤로가기 버튼 */
if(document.getElementById('#arrow-back')){
  document.getElementById('#arrow-back').onclick = function(){
    window.history.back();
  }
}