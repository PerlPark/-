document.querySelector('input').onkeyup = function(){
  console.log('키보드 눌림');
  sendBusInputData(this);
};

let sendBusInputData = function(eventTaget){
  /* XML Request */
  let data = {'routeNo' : eventTaget.value};
  data = JSON.stringify(data);

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('Content-type', "application/json");
  xhr.send(data);
}