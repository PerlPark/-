let form = document.getElementById('form');
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
    let routeList = document.createElement('select');
    routeList.size = routeListData.length;
    busInput.setAttribute('class', 'boundToList');
    for(let i = 0; i < routeList.size; i++){
      let route = routeListData[i];
      let item = document.createElement('option');
      item.textContent = `${route.name} | ${route.region} | ${route.typeName}`;
      item.setAttribute('value', route.id);
      item.addEventListener('click', selectRouteItem);
      routeList.appendChild(item);
    }
    form.insertBefore(routeList, form.children[3]);
  } 
}

/* 키워드 입력 시 실시간 버스 검색 후 출력 */
busInput.onkeyup = function(){
  sendData('POST', '/', JSON.stringify({routeNo: `${busInput.value}`}), printRouteList);
}

/* select > option 요소 클릭 시 */
function selectRouteItem(){
  let routeIdInput = document.getElementById('routeIdInput');
  routeIdInput.value = this.value;
  busInput.value = this.textContent;
  busInput.removeAttribute("class");

  /* 이미 생성된 select 박스 제거 */
  let relatedRouteList = document.getElementsByTagName('select')[0];
  if(relatedRouteList){
    form.removeChild(relatedRouteList);
  }
}

/* 폼 제출 */
form.onsubmit = function(){
  sendData('GET', '/search');
}