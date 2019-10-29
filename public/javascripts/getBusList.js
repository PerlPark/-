let getBusList = function(){
  ajaxRequest('POST', '/', null, function(responseText){
    busList = JSON.parse(responseText);
    if(busList.length <= 0){
      error(1);
    } else {
      status.busList = true;
    }
  });
};