document.addEventListener("DOMContentLoaded", function(){
  getCurrentPosition();

  // 즐겨찾기한 도착 정보 있을 경우
  if(bookmarkList){
    document.getElementById('bookmark').classList.remove('hidden');
  }

  // UserData 있을 경우
  const userData = JSON.parse(localStorage.getItem('userData'));
  if(userData){
    if(userData.routeId && userData.routeName){
      document.getElementById('routeId').value = userData.routeId;
      document.getElementById('search-bus').children[0].textContent = userData.routeName;
      document.getElementById('search-bus').classList.remove('placeholder');
    }
  }

  let form = document.getElementById('form');
});

document.getElementById('search-position').onclick = function(){
  let isAvailable = checkStatus(Object.values(status));
  if(!isAvailable){
    error(1);
  } else {
    location.href = '/position';
  }
}

document.getElementById('search-bus').onclick = function(){
  let isAvailable = checkStatus(Object.values(status));
  if(!isAvailable){
    error(1);
  } else {
    location.href = '/bus';
  }
}

let form = document.getElementById('form');
form.onsubmit = function(event){
  e.preventDefault();
  if(!form.children[0].value || !form.children[1].value){
    error(2);
  } else if(!form.children[2].value){
    error(3);
  } else {
    sendData('GET', '/search');
  }
}