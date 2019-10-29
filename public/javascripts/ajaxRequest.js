function ajaxRequest(method, url, data, callback){
  let form = document.getElementById('form');
  form.action = url;
  form.method = method;
  
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === xhr.DONE){
      if(xhr.status === 200 || xhr.status === 201){
        if(callback){
          callback(xhr.responseText);
        }
      } else {
        console.error(xhr.responseText);
      }
    }
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', "application/json");
  /* 인자로 받은 data가 있을 경우 */
  data ? xhr.send(data) : xhr.send();
}