let routeListData;

document.addEventListener("DOMContentLoaded", function(){
  // 최근 검색 기록 얐을 경우
  if(localStorage.getItem('searchHistory')){
    document.getElementById('blank').classList.add('hidden');
    printRouteList(localStorage.getItem('searchHistory'));
  }
});

/* 뒤로가기 버튼 */
document.getElementById('btn-back').onclick = function(){
  window.history.back();
}

/* 키워드 입력 시 실시간 버스 검색 후 출력 */
document.getElementById('routeNoInput').onkeyup = function(){
  /* 검색어 없을 때 - blank 백그라운드 노출 */
  if(this.value === ''){
    let ul = document.getElementsByTagName('ul')[0];
    if(ul){
      document.getElementById('result').removeChild(ul);
    }
  } else {
    ajaxRequest('POST', '/bus', JSON.stringify({routeNo: `${this.value}`}), printRouteList);
  }
}

let printRouteList = function(list){
  routeListData = JSON.parse(list);

  /* 이미 생성된 select 박스 있으면 제거 */
  let ul = document.getElementsByTagName('ul')[0];
  if(ul){
    document.getElementById('result').removeChild(ul);
  }

  if(routeListData.length > 0){
    let ul = document.createElement('ul');
    
    for(let i = 0; i < routeListData.length; i++){
      let route = routeListData[i];
      let item = document.createElement('li');
      item.setAttribute('data-no', i);
      item.setAttribute('data-id', route.id);
      item.setAttribute('data-name', route.name);
      item.addEventListener('click', selectRouteItem);

      let name = document.createElement('p');
      name.textContent = route.name;
      let type = document.createElement('span');
      type.setAttribute('class', 'type');
      switch (route.typeCode){
        case '11':
        case '16':
          type.textContent = '직행';
          type.classList.add('red');
          break;
        case '12':
          type.textContent = '좌석';
          type.classList.add('blue');
          break;
        case '13':
        case '15':
          type.textContent = '일반';
          break;
        case '14':
          type.textContent = '광역';
          type.classList.add('red');
          break;
        case '23':
          type.textContent = '농어촌';
          break;
      }
      name.appendChild(type);
      let info = document.createElement('span');
      info.textContent = `${route.region} | ${route.startStationName} ↔ ${route.endStationName} | ${route.upFirstTime} ~ ${route.upLastTime}`;
      
      item.appendChild(name);
      item.appendChild(info);

      ul.appendChild(item);
    }
    document.getElementById('result').appendChild(ul);
  } 
}

/* select > option 요소 클릭 시 */
function selectRouteItem(){
  // 선택한 버스 데이터 저장
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(!userData){
    userData = {};
  }
  userData.routeId = this.dataset.id;
  userData.routeName = this.dataset.name;
  console.log(this.dataset.id, userData.routeId, this.dataset.name, userData.routeName);
  localStorage.setItem('userData', JSON.stringify(userData));
  // 검색 히스토리 업뎃
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  if(!searchHistory){
    searchHistory = [];
  } else {
    if(searchHistory.filter(obj => obj.routeId === this.dataset.id)){

    } else {
      searchHistory.push(routeListData[this.dataset.no]);
    }
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  location.href = '/';
}