$(document).ready(initialise);

function initialise() {
  $("#gif").attr(
    "src",
    "https://drive.google.com/uc?export=view&id=1EsyQuSAeJXf5Mf52akmSIhdWwfOAyHRG"
  );
  $("#welcome").show();
  $("#forms").hide();
  $("#partone").show();
  $("#parttwo").hide();
  $("#partfour").hide();
  $("#km").mask("000.000");
  $("#startBtn").click(function () {
    $("#welcome").hide();
    $("#forms").show();
  });

  var objArray = [];
  function today(timestamp) {
    if (timestamp) {
      var td = new Date(timestamp);
    } else {
      timestamp;
      var td = new Date();
    }
    var hor = td.getHours();
    var min = td.getMinutes();
    var sec = td.getSeconds();
    var dd = td.getDate(); //yields day
    var MM = td.getMonth(); //yields month
    var yyyy = td.getFullYear(); //yields year
    var currentDate = dd + "/" + (MM + 1) + "/" + yyyy;
    var currentTime = String(hor) + ":" + String(min) + ":" + String(sec);
    var timestamp = currentDate + " " + currentTime;
    return timestamp;
  }
  google.script.run.withSuccessHandler(fillVeiculos).select("Veiculos");
  function fillVeiculos(values) {
    $("#veiculo").empty();
    for (var val of values) {
      $("#veiculo").append(
        $(document.createElement("option")).prop({
          value: val[0],
          text: val[0],
        })
      );
    }
  }

  google.script.run.withSuccessHandler(fillMotoristas).select("Motoristas");
  function fillMotoristas(values) {
    $("#motorista").empty();
    for (var val of values) {
      $("#motorista").append(
        $(document.createElement("option")).prop({
          value: val[0],
          text: val[0],
        })
      );
    }
  }

  google.script.run.withSuccessHandler(fillFinalidades).select("Finalidades");
  function fillFinalidades(values) {
    $("#finalidade").empty();
    for (var val of values) {
      $("#finalidade").append(
        $(document.createElement("option")).prop({
          value: val[0],
          text: val[0],
        })
      );
    }
  }

  google.script.run.withSuccessHandler(fillLocais).select("Locais");
  function fillLocais(values) {
    for (var val of values) {
      $("#local").append(
        $(document.createElement("option")).prop({
          value: val[0],
          text: val[0],
        })
      );
    }
  }

  $("#submit").click(function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showMap, showError);
    } else {
      alert("Este navegador não esta habilitado para geolocalização.");
    }
  });

  function showMap(position) {
    // Get location data
    lat = position.coords.latitude;
    long = position.coords.longitude;
    var latlong = new google.maps.LatLng(lat, long);
    google.script.run.withSuccessHandler(submit).geoName(lat, long);

    var myOptions = {
      center: latlong,
      zoom: 16,
      mapTypeControl: true,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL,
      },
    };
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    var marker = new google.maps.Marker({
      position: latlong,
      map: map,
      title: "Voce está aqui!",
    });
  }

  function showError(error) {
    if (error.code == 1) {
      $("#msg").append(
        "<p>Você não autorizou a leitura de sua localização. Tente novamente.</p>"
      );
    } else if (error.code == 2) {
      $("#msg").append("<p>Sem sinal de rede. novamente.</p>");
    } else if (error.code == 3) {
      $("#msg").append("<p>Sem sinal de rede. novamente.</p>");
    } else {
      $("#msg").append("<p>Sem sinal de rede. novamente.</p>");
    }
  }

  function submit(endereco) {
    var formInput = $("#myForm :input");
    var inputs = {};
    formInput.each(function () {
      inputs[this.name] = $(this).val();
    });
    inputs["endereco"] = endereco;
    inputs["timestamp"] = today();
    google.script.run
      .withSuccessHandler(onSuccess(this, inputs))
      .create(inputs);
  }

  function onSuccess(bool, inputs) {
    if (bool) {
      objArray.push(inputs);
      if (inputs.tipo == "EM PARADA") {
        $("#partone").hide();
        $("#parttwo").show();
        $("#partfour").hide();
        $("#parada").hide();
        $("#partida").show();
        $("#now").children().remove();
        $("#gif").focus();
        frontenddatas(objArray);
      } else if (inputs.tipo == "EM TRANSITO") {
        $("#gif").attr(
          "src",
          "https://drive.google.com/uc?export=view&id=1Ts4G8Vv-x0Fnd2qqmdsQ73U_cCil75Fa"
        );
        $("#partone").hide();
        $("#parttwo").show();
        $("#partfour").hide();
        $("#partida").hide();
        $("#parada").show();
        $("#now").children().remove();
        $("#gif").focus();
        frontenddatas(objArray);
      }
    } else {
    }
    $("#tipo").val("");
    $("#finalidade").val("");
    $("#endereco").val("");
    $("#buttons").show();
  }
  $("#partida").click(function () {
    $("#gif").attr(
      "src",
      "https://drive.google.com/uc?export=view&id=1Ts4G8Vv-x0Fnd2qqmdsQ73U_cCil75Fa"
    );
    $("#tipo").val("EM TRANSITO");
    $("#finalidade").val("RUMO AO DESTINO");
    $("#timestamp").val(today());
    $("#submit").click();
    $("#gif").focus();
  });
  $("#parada").click(function () {
    $("#gif").attr(
      "src",
      "https://drive.google.com/uc?export=view&id=1EsyQuSAeJXf5Mf52akmSIhdWwfOAyHRG"
    );
    $("#tipo").val("EM PARADA");
    $("#timestamp").val(today());
    $("#partone").hide();
    $("#parttwo").hide();
    $("#partfour").show();
  });
  $("#iniciar").click(function () {
    var partOneInputs = $("#partone :input").not("button");
    var count = 0;
    partOneInputs.each(function () {
      if ($(this).val() == "") {
        count++;
      }
    });
    if (count == 0) {
      var vehicle = $("#veiculo").val();
      google.script.run
        .withSuccessHandler((e) => {
          initialSubmit(e), backenddatas(e);
        })
        .searchVehicle(vehicle);
    } else {
      $("#msg").append(
        `
                  <div class="alert alert-danger text-left p-1" role="alert">
                  Preencha todos os campos solicitados ! 
                  </div>
                  `
      );
    }
  });
  function initialSubmit(stories) {
    $.each(stories, function () {
      if (stories.indexOf(this) == stories.length - 1) {
        $("#tipo").val(this.tipo);
        $("#finalidade").val("REINICIADO O APP");
        $("#km").val(this.km);
      }
    });
    $("#submit").click();
  }
  var backendLenght;
  function backenddatas(stories) {
    var count = 1;
    $.each(stories, function () {
      $("#before").prepend(
        `  
                    <div class="col-12 p-2 m-0 w-100 border-bottom  border-secondary float-left" style="font-size:12px" >  
                        <p><b class="text-primary">ORDEM : </b>` +
          count +
          `<b class="text-primary"> KM : </b>` +
          this.km +
          `<b class="text-primary"> TIPO : </b>` +
          this.tipo +
          `</p>
                        <p><b class="text-primary">DATA : </b class="text-primary">` +
          today(this.timestamp) +
          `<b class="text-primary"> MOTIVO : </b>` +
          this.finalidade +
          `</p>
                        <p><b class="text-primary">ENDEREÇO : </b>` +
          this.endereco +
          `</p>
                      </div>        
                      `
      );
      count++;
    });
    backendLenght = count;
  }
  function frontenddatas(stories) {
    var count = backendLenght;
    $.each(stories, function () {
      if (stories.indexOf(this) == stories.length - 1) {
        $("#now").prepend(
          `  
                      <div class="col-12 p-2 m-0 w-100 border-bottom  border-secondary float-left" style="font-size:12px" >  
                        <p><b class="text-primary">ORDEM : </b>` +
            count +
            `<b class="text-primary"> KM : </b>` +
            this.km +
            `<b class="text-primary"> TIPO : </b>` +
            this.tipo +
            `</p>
                        <p><b class="text-primary">DATA : </b class="text-primary">` +
            this.timestamp +
            `<b class="text-primary"> MOTIVO : </b>` +
            this.finalidade +
            `</p>
                        <p><b class="text-primary">ENDEREÇO : </b>` +
            this.endereco +
            `</p>
                      </div>                     
                      `
        );
      } else {
        $("#before").prepend(
          `  
                      <div class="col-12 p-2 m-0 w-100 border-bottom  border-secondary float-left" style="font-size:12px" >  
                        <p><b class="text-primary">ORDEM : </b>` +
            count +
            `<b class="text-primary"> KM : </b>` +
            this.km +
            `<b class="text-primary"> TIPO : </b>` +
            this.tipo +
            `</p>
                        <p><b class="text-primary">DATA : </b class="text-primary">` +
            this.timestamp +
            `<b class="text-primary"> MOTIVO : </b>` +
            this.finalidade +
            `</p>
                        <p><b class="text-primary">ENDEREÇO : </b>` +
            this.endereco +
            `</p>
                      </div>        
                      `
        );
      }
      count++;
    });
  }
  $("#morefive").click(function () {
    $("#km").val(Number($("#km").val()) + 5);
  });
  $("#moreten").click(function () {
    $("#km").val(Number($("#km").val()) + 10);
  });
  $("#lessfive").click(function () {
    $("#km").val(Number($("#km").val()) - 5);
  });
  $("#lessten").click(function () {
    $("#km").val(Number($("#km").val()) - 10);
  });
  $("#motorista, #veiculo, #local").click(function () {
    $("#msg").empty();
  });
}

var DataHora = Utilities.formatDate(
  new Date(),
  "America/Sao_Paulo",
  "dd/MM/yyyy HH:mm:ss"
);
var Spread = SpreadsheetApp.openById(process.env.SPREAD_ID);

function doGet(e) {
  var response = HtmlService.createTemplateFromFile("diario");
  return response
    .evaluate()
    .addMetaTag(
      "viewport",
      "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height,  target-densitydpi=device-dpi"
    );
}

function create(inputs) {
  var lock = LockService.getScriptLock();
  if (lock.tryLock(5000)) {
    if (!lock.hasLock()) {
      return false;
    }
    var ws = Spread.getSheetByName("Registros");
    var datas = ws.appendRow([
      ws.getLastRow() + 1,
      inputs.tipo,
      DataHora,
      inputs.motorista,
      inputs.veiculo,
      inputs.local,
      inputs.km,
      inputs.finalidade,
      inputs.endereco,
    ]);
  }
  lock.releaseLock();
  return true;
}

function change(inputs) {
  var lock = LockService.getScriptLock();
  if (lock.tryLock(10000)) {
    if (!lock.hasLock()) {
      return false;
    }
    var row = inputs.id;
    var motorista = inputs.motorista;
    var veiculo = inputs.veiculo;
    var local = inputs.local;
    var km = inputs.km;
    var finalidade = inputs.finalidade;
    var endereco = inputs.endereco;

    var sheet = Spread.getSheetByName("registros");
    sheet.getRange(row, 3).setValue(motorista);
    sheet.getRange(row, 4).setValue(veiculo);
    sheet.getRange(row, 5).setValue(local);
    sheet.getRange(row, 6).setValue(km);
    sheet.getRange(row, 7).setValue(finalidade);
    sheet.getRange(row, 8).setValue(endereco);
    lock.releaseLock();
    return true;
  }
  lock.releaseLock();
  return false;
}
