let busInput = document.querySelector('input');

busInput.onkeyup = function(){
  realTimeBusSearch(this);
};
let realTimeBusSearch = function(eventTaget){
  console.log(eventTaget.value);
}

document.querySelector('button').onclick = searchBus;
let searchBus = function(){
  /* XML Request */
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/search');
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send();
}