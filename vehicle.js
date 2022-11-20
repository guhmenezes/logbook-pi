function searchVehicle(vehicle) {
  
  var arrayObject =new Array()  
  var today = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yy");
 
  var spread = SpreadsheetApp.openById(process.env.SPREAD_ID);
  var sheet = spread.getSheetByName('Registros');
  var header = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  var datas = sheet.getRange(2,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
  
  datas.forEach(
    function(rowData){
      var object=new Object()
      if(rowData[4]==vehicle && Utilities.formatDate(new Date(rowData[2]), "America/Sao_Paulo", "dd/MM/yy")==today){
        for(var i=0;i<header.length;i++){
          object[header[i]]=rowData[i].toString()
        }
        arrayObject.push(object)
      }
    }
  )
  return arrayObject;  
}   