//https://developer.mozilla.org/ko/docs/WebAPI/Using_geolocation
if (!navigator.geolocation) {
  error();
} else {
  document.write('위치 정보를 불러오는 중...');
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position){
  document.write("내 위치: " + position.coords.latitude + " / " + position.coords.longitude);
}

function error(){
  document.write('위치 정보를 사용할 수 없습니다.');
}