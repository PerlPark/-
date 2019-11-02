document.addEventListener("DOMContentLoaded", function(){
  // 최근 검색 기록 없을 경우
  if(!searchHistory){
    document.getElementById('blank').classList.remove('hidden');
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

let printRouteList = function(responseText){
  let routeListData = JSON.parse(responseText);

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
      let region = document.createElement('span');
      region.textContent = route.region;
      
      item.appendChild(name);
      item.appendChild(region);

      ul.appendChild(item);
    }
    document.getElementById('result').appendChild(ul);
  } 
}

/* select > option 요소 클릭 시 */
function selectRouteItem(){
  console.log(this.dataset.name, this.dataset.id);
  location.href = `/?no=${this.dataset.name}&id=${this.dataset.id}`;
}