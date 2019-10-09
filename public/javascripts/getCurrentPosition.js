let textPlace = document.querySelector('.user-current-position');

/* geolocation API 사용자 위치 받아오기 */
/* geolocation API 사용할 수 없을 때 */
if (!navigator.geolocation) {
  error();
} else {
  /* localStorage에 저장된 사용자 정보 미리 로드 */
  if(localStorage.getItem('userData')){
    let userData = JSON.parse(localStorage.getItem('userData'));
    printCurrentPosition(userData.location.lat, userData.location.lng); //출력 함수 실행
    
  } else {
    /* 저장된 사용자 정보 없을 때 */
    textPlace.innerHTML = `<img src="/images/loading.svg"> 위치 정보를 찾는 중...`;
  }
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position){
  let lat = position.coords.latitude.toFixed(5);
  let lng = position.coords.longitude.toFixed(5);
  localStorage.setItem('userData', JSON.stringify({'location': {'lat': lat, 'lng': lng}}));
  printCurrentPosition(lat, lng);
}

function error(){
  alert('위치 정보를 사용할 수 없습니다.');
  // 위치 공유 설정방법, 위치 정보 없을 때 제공되는 버스 도착 표시에 대해 안내
}

function printCurrentPosition(lat, lng){
  textPlace.innerHTML = `<i class="material-icons md-18">location_searching</i> ${lat}, ${lng}`;
  /* main 화면, input에 접근할 수 있을 때 */
  let latInput = document.getElementById('latInput');
  let lngInput = document.getElementById('lngInput');
  if(latInput && lngInput){
    latInput.value = lat;
    lngInput.value = lng;
  }
  getKakaoAPI(lat, lng);
}

function getKakaoAPI(lat, lng){
  var geocoder = new kakao.maps.services.Geocoder();
  var coord = new kakao.maps.LatLng(lat, lng);
  var callback = function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        let address = result[0].address.address_name;
        textPlace.innerHTML = `<i class="material-icons md-18">location_searching</i> ${address}`;
    }
  };
  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}