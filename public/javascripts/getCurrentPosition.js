/*
geolocation api 사용 가능할 때

*/

/*
2. geolocation api 사용 불가할 때
- 실시간 위치를 사용할 수 없음
- 현재위치 기능 사용할 수 없음 -> 지정 위치로 변경
*/


if (!navigator.geolocation) {
  geo_error();
} else {
  let options = {
    enableHighAccuracy: true, 
    maximumAge        : 30000, 
    timeout           : 27000
  };
  // let loadingModal = new modal('위치 정보를 찾는 중 입니다... 잠시만 기다려 주세요...', 'loadingModal');
  // loadingModal.append();
  navigator.geolocation.getCurrentPosition(geo_success, geo_error, options);
}

function geo_success(position){
  let lat = position.coords.latitude.toFixed(5);
  let lng = position.coords.longitude.toFixed(5);
  printCurrentPosition(lat, lng);
  status.currentPosition = true;
}

function geo_error(){
  alert('위치 정보를 사용할 수 없습니다. 앱 이용이 원할하지 않을 수 있습니다.');
  status.currentPosition = false;
}

function printCurrentPosition(lat, lng){
  /* main 화면, input에 접근할 수 있을 때 */
  let latInput = document.getElementById('latInput');
  let lngInput = document.getElementById('lngInput');
  if(latInput && lngInput){
    latInput.value = lat;
    lngInput.value = lng;
  }
  let textfield = document.getElementById('position-textfield');
  textfield.textContent = `${lat}, ${lng}`;
  textfield.classList.remove('loading');
  textfield.classList.add('gps-on');
  // loadingModal.remove();
  getKakaoAPI(lat, lng);
}

function getKakaoAPI(lat, lng){
  var geocoder = new kakao.maps.services.Geocoder();
  var coord = new kakao.maps.LatLng(lat, lng);
  var callback = function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      let address = result[0].address.address_name;
      if(result[0].road_address){
        result[0].road_address.building_name ? (
          address = result[0].road_address.building_name
        ) : (
          address = result[0].road_address.address_name
        );
      }
      document.getElementById('position-textfield').textContent = address;
    }
  };
  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}