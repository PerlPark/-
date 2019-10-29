document.addEventListener("DOMContentLoaded", function(){
  getCurrentPosition();
  getBusList();
});

document.getElementById('search-position').onclick = function(){
  let isAvailable = checkStatus(Object.values(status));
  if(!isAvailable){
    error(1);
  } else {
    location.href('/position');
  }
}

document.getElementById('search-bus').onclick = function(){
  let isAvailable = checkStatus(Object.values(status));
  if(!isAvailable){
    error(1);
  } else {
    location.href('/bus');
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