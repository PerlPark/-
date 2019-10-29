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
  // sendData('POST', '/bus', JSON.stringify({routeNo: `${this.value}`}), printRouteList);
  console.log(this.value);
}

// let printRouteList = function(responseText){
//   let routeListData = JSON.parse(responseText);
//   /* 이미 생성된 select 박스 있으면 제거 */
//   let routeList = document.getElementsByTagName('select')[0];
//   if(routeList){
//     form.removeChild(routeList);
//   }
//   /* 검색어 없을 때 */
//   if(busInput.value === '' || typeof routeListData[0] === 'string'){
//     busInput.removeAttribute("class");
//   /* 검색결과 있을 때 */
//   } else if(routeListData.length > 0){
//     busInput.setAttribute('class', 'boundToList');
//     let routeList = document.createElement('select');
//     routeList.setAttribute('multiple', '');
//     if(routeListData.length <= 3){
//       routeList.style.height = (routeListData.length * 46)+'px';
//     }
//     for(let i = 0; i < routeListData.length; i++){
//       let route = routeListData[i];
//       let item = document.createElement('option');
//       item.textContent = `${route.name} | ${route.region} | ${route.typeName}`;
//       item.setAttribute('data-id', route.id);
//       item.setAttribute('data-name', route.name);
//       item.addEventListener('click', selectRouteItem);
//       routeList.appendChild(item);
//     }
//     form.insertBefore(routeList, form.lastChild);
//   } 
// }



// /* select > option 요소 클릭 시 */
// function selectRouteItem(){
//   // sendData('POST', '/', JSON.stringify({routeNo: `${this.value}`}));
// }