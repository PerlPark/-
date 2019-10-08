function sendData(method, url, data){
  /* form 속성 변경 */
  let form = document.querySelector('.form');
  form.action = url;
  form.method = method;

  /* Ajax */
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === xhr.DONE){
      if(xhr.status === 200 || xhr.status === 201){
        console.log(xhr.responseText);
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