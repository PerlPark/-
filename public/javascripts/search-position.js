document.addEventListener("DOMContentLoaded", function(){
  
});

/* 뒤로가기 버튼 */
document.getElementById('btn-back').onclick = function(){
  window.history.back();
}

/* 카카오 지도 API */
// ==> 주소 및 버튼 출력됨, 초기 위치는 경기도청

let locPosition = new kakao.maps.LatLng(37.275051, 127.0094448); // 초기 좌표 값

// 좌표 -> 지도 변환
let geocoder = new kakao.maps.services.Geocoder(); 
let printAddress = function(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    let address = result[0].address.address_name;
    if(result[0].road_address){
      result[0].road_address.building_name ? (
        address = result[0].road_address.building_name
      ) : (
        address = result[0].road_address.address_name
      );
    }
    document.getElementById('info').textContent = address;
  }
};
geocoder.coord2Address(locPosition.getLng(), locPosition.getLat(), printAddress);


// 카카오 지도 출력
let mapContainer = document.getElementById('map'),
    mapOption = { 
        center: locPosition, // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨 
    };
let map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
// 줌 컨트롤 추가
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);


// 초기 좌표 값 마커 생성
let marker = new kakao.maps.Marker({ position: map.getCenter() });
marker.setMap(map);


// GeoLocation API 실행
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude, // 위도
        lng = position.coords.longitude; // 경도
    locPosition = new kakao.maps.LatLng(lat, lng);
    geocoder.coord2Address(locPosition.getLng(), locPosition.getLat(), printAddress); // 주소 재 출력

    map.setCenter(locPosition); // 지도 이동
    displayMarker(locPosition); // 마커 재 배치
  });
}


// 지도 이동 시 좌표 변경
kakao.maps.event.addListener(map, 'center_changed', function() {
  let centerPosition = map.getCenter();
  geocoder.coord2Address(centerPosition.getLng(), centerPosition.getLat(), printAddress); // 주소 재 출력
  displayMarker(centerPosition) // 마커 이동
});


// 지도에 마커 표시
function displayMarker(position) {
  marker.setPosition(position);
}