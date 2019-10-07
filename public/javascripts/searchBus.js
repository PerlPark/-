let busInput = document.querySelector('input');

busInput.onkeyup = function(){
  realTimeBusSearch(this);
};

let realTimeBusSearch = function(eventTaget){
  console.log(eventTaget.value);
}

document.querySelector('button').onclick = function(){
  sendData('/search');
}