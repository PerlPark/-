let busInput = document.querySelector('#routeNoInput');

busInput.onkeyup = function(){
  busSearch('POST', '/', JSON.stringify({routeNo: `${busInput.value}`}));
}

document.querySelector('button').onclick = function(){
  sendData('GET', '/search');
}


function busSearch(method, url, data){
  /* form 속성 변경 */
  let form = document.querySelector('.form');
  form.action = url;
  form.method = method;

  /* Ajax */
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === xhr.DONE){
      if(xhr.status === 200 || xhr.status === 201){
        let relatedRoute = JSON.parse(xhr.responseText);
        /* 이미 생성된 select 박스 있으면 제거 */
        let relatedRouteList = document.getElementsByTagName('select')[0];
        if(relatedRouteList){
          console.log('셀렉트 박스 이미 출력중');
          form.removeChild(relatedRouteList);
        }
        if(busInput.value === '' || typeof relatedRoute[0] === 'string'){
          /* 검색어 없음 */
          busInput.style.borderBottomLeftRadius = "5px";
          busInput.style.borderBottomRightRadius = "5px";
        } else if(relatedRoute.length > 0){
          /* 검색결과 있음 */
          let relatedRouteList = document.createElement('select');
          relatedRouteList.size = relatedRoute.length;
          busInput.style.borderBottomLeftRadius = "0px";
          busInput.style.borderBottomRightRadius = "0px";
          for(let bus of relatedRoute){
            let item = document.createElement('option');
            item.textContent = `${bus.routeName} | ${bus.region}`;
            relatedRouteList.appendChild(item);
          }
          form.insertBefore(relatedRouteList, form.children[3]);
        } 
      } else {
        console.error(xhr.responseText);
      }
    }
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', "application/json");
  if(data){
    xhr.send(data);
  }
}