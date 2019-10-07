function sendData(url){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Content-type', "application/json");
}

function receiveData(data){
  console.log('데이터 전달 받음');
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function(){
    console.log(xhr.responseText);
  });
}