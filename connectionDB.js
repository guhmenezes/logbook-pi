function select(sheetname) { 
 
  var spread = SpreadsheetApp.openById(process.env.SPREAD_ID);
  var sheet = spread.getSheetByName(sheetname);
  var lstrow = sheet.getLastRow(); 
  var datas = sheet.getRange(2,1,lstrow,2).getValues();
  return datas;  
}   function geoName(lat,lng) {
  var response=Maps.newGeocoder().reverseGeocode(lat, lng);
  return response.results[0].formatted_address;
}