let getCurrentPosition = function(){
  if (!navigator.geolocation) {
    error();
  } else {
    let options = {
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 27000
    };
    // let loadingModal = new modal('위치 정보를 찾는 중 입니다... 잠시만 기다려 주세요...', 'loadingModal');
    // loadingModal.append();
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, options);

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
          let textfield = document.getElementById('position-textfield');
          textfield.textContent = address;
        }
      };
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }
  }
};