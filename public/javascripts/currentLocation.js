//https://developer.mozilla.org/ko/docs/WebAPI/Using_geolocation
if (!navigator.geolocation) {
  error();
} else {
  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position){
  let lat = position.coords.latitude.toFixed(5);
  let lng = position.coords.longitude.toFixed(5);
  printLocation(lat, lng);
}

function error(){
  alert('위치 정보를 사용할 수 없습니다.');
}

function printLocation(lat, lng){
  let textPlace = document.querySelector('.currentLocation');
  textPlace.innerHTML = `<i class="material-icons md-18">location_searching</i> 현재 내 위치: ${lat}, ${lng}`;
}