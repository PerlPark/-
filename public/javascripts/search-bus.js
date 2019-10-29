let form = document.getElementById('form');
form.onsubmit = function(){
  sendData('GET', '/search');
}


let busInput = document.getElementById('routeNoInput');

let printRouteList = function(responseText){
  let routeListData = JSON.parse(responseText);
  /* 이미 생성된 select 박스 있으면 제거 */
  let routeList = document.getElementsByTagName('select')[0];
  if(routeList){
    form.removeChild(routeList);
  }
  /* 검색어 없을 때 */
  if(busInput.value === '' || typeof routeListData[0] === 'string'){
    busInput.removeAttribute("class");
  /* 검색결과 있을 때 */
  } else if(routeListData.length > 0){
    busInput.setAttribute('class', 'boundToList');
    let routeList = document.createElement('select');
    routeList.setAttribute('multiple', '');
    if(routeListData.length <= 3){
      routeList.style.height = (routeListData.length * 46)+'px';
    }
    for(let i = 0; i < routeListData.length; i++){
      let route = routeListData[i];
      let item = document.createElement('option');
      item.textContent = `${route.name} | ${route.region} | ${route.typeName}`;
      item.setAttribute('data-id', route.id);
      item.setAttribute('data-name', route.name);
      item.addEventListener('click', selectRouteItem);
      routeList.appendChild(item);
    }
    form.insertBefore(routeList, form.lastChild);
  } 
}

/* 키워드 입력 시 실시간 버스 검색 후 출력 */
busInput.onkeyup = function(){
  sendData('POST', '/', JSON.stringify({routeNo: `${busInput.value}`}), printRouteList);
}

/* select > option 요소 클릭 시 */
function selectRouteItem(){
  /* 이미 생성된 select 박스 및 스타일 class 제거 */
  let routeIdInput = document.getElementById('routeIdInput');
  let routeNameInput = document.getElementById('routeNameInput');
  let relatedRouteList = document.getElementsByTagName('select')[0];

  routeIdInput.value = this.dataset.id;
  routeNameInput.value = this.dataset.name;
  busInput.value = this.textContent;

  busInput.removeAttribute("class");
  if(relatedRouteList){
    form.removeChild(relatedRouteList);
  }
}

/* 키워드 수정 시 */
busInput.onclick = function(){
  if((busInput.value && routeNameInput.value) && (busInput.value !== routeNameInput.value)){
    busInput.value = routeNameInput.value;
  }
}

/* 폼 제출 */
