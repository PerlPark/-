let routeListData;
/* ------------------------------------------------------------- */
/* 초기화 함수                                                      */
/* ------------------------------------------------------------- */
function init(){
  // ul 생성된 것 있으면 삭제
  let ul = document.getElementsByTagName('ul')[0];
  if(ul){
    document.getElementById('result').removeChild(ul);
  }

  // 최근 검색 기록 얐을 경우 출력, 없으면 최근 검색 기록 없음 이미지 노출
  if(localStorage.getItem('searchHistory')){
    document.getElementById('blank').classList.add('hidden');
    printRouteList(localStorage.getItem('searchHistory'));
  } else {
    document.getElementById('blank').classList.remove('hidden');
  }
}
document.addEventListener("DOMContentLoaded", init);

/* 뒤로가기 버튼 */
document.getElementById('btn-back').onclick = function(){
  window.history.back();
}

/* 키워드 입력 시 실시간 버스 검색 후 출력 */
document.getElementById('routeNoInput').onkeyup = function(){
  /* 검색어 없을 때 - blank 백그라운드 노출 */
  if(this.value === ''){
    init();
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
      item.setAttribute('data-typecode', route.typeCode);
      item.setAttribute('data-region', route.region);
      item.setAttribute('data-startstationname', route.startStationName);
      item.setAttribute('data-endstationname', route.endStationName);
      item.setAttribute('data-upfirsttime', route.upFirstTime);
      item.setAttribute('data-uplasttime', route.upLastTime);
      
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
  console.log(this.dataset);
  // 선택한 버스 데이터 저장
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(!userData){
    userData = {};
  }
  userData.routeId = this.dataset.id;
  userData.routeName = this.dataset.name;
  localStorage.setItem('userData', JSON.stringify(userData));

  // 검색 히스토리 업뎃
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  let dataObj = {
    "id": this.dataset.id,
    "name": this.dataset.name,
    "typeCode": this.dataset.typecode,
    "region": this.dataset.region,
    "startStationName": this.dataset.startstationname,
    "endStationName": this.dataset.endstationname,
    "upFirstTime": this.dataset.upfirsttime,
    "upLastTime": this.dataset.uplasttime
  };
  if(!searchHistory){
    searchHistory = [dataObj];
  } else {
    if(searchHistory.filter(value => value.routeId === dataObj.routeId).length === 0){
      searchHistory.push(dataObj);
    }
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  location.href = '/';
}