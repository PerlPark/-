let textPlace = document.querySelector('.currentLocation');

/* localStorage에 저장된 사용자 정보 있으면 로드 */
if(localStorage.getItem('userData')){
  let userData = JSON.parse(localStorage.getItem('userData'));
  
  /* 사용자 위치 출력 */
  printCurrentLocation(userData.location.lat, userData.location.lng);

} else {
  /* 저장된 사용자 정보 없을 때 */
  textPlace.innerHTML = `<img src="/images/loading.svg"> 위치 정보를 찾는 중...`;

  /* geolocation API 사용자 위치 받아오기 */
  if (!navigator.geolocation) {
    error();
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function success(position){
  let lat = position.coords.latitude.toFixed(5);
  let lng = position.coords.longitude.toFixed(5);
  localStorage.setItem('userData', JSON.stringify({'location': {'lat': lat, 'lng': lng}}));
  printCurrentLocation(lat, lng);
  getKakaoAPI(lat, lng);
}

function error(){
  alert('위치 정보를 사용할 수 없습니다.');
}

function printCurrentLocation(lat, lng){
  textPlace.innerHTML = `<i class="material-icons md-18">location_searching</i> 현재 내 위치: ${lat}, ${lng}`;
  document.querySelector('#lngInput').value = lng;
  document.querySelector('#latInput').value = lat;
}