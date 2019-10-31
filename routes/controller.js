let busList = require('../config/buslist.json');

let searchBusResult = function(req, res) {
  res.send(getfilteredBusList(req.body.routeNo));
}

/* 버스 노선 실시간 검색 */
function getfilteredBusList(routeNo) {
  return busList.filter(bus => bus.name.length - 1 <= routeNo.length && bus.name.slice(0,routeNo.length) === routeNo);
}

module.exports = {
  searchBusResult: searchBusResult
};