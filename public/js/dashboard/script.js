const URLD = "http://localhost/cita/";
var ID;

this.calender();


$('.clockpicker').clockpicker();

function calender(){
   $('#CalendarioWeb').fullCalendar({
      header: {
         left: 'prev,next today',
         center: 'title',
         right: 'month,agendaWeek,agendaDay,listWeek'
      },
      events:URLD + "adminControl/getCita/",
      eventClick:function(calEvent,jsEvent,view){
         ID = calEvent.id;
         $("#tituloEvento").html(calEvent.title);
         //inputs
         $("#titulo").val(calEvent.title);
         FechaHora = calEvent.start._i.split(" ");
         $("#fecha").val(FechaHora[0]);
         $("#hora").val(FechaHora[1]);
         $("#descripcion").val(calEvent.descripcion);
         $("#color").val(calEvent.color);
         $("#agregar").css("display", "none");
         $("#editar").css("display", "block");
         $("#eliminar").css("display", "block");
         $("#modalEventos").modal();

      },
      dayClick:function (date,jsEvent,view){
         $("#tituloEvento").html("Agregar nuevo evento");
         $("#titulo").val("");
         $("#hora").val("");
         $("#descripcion").val("");
         $("#color").val("#8080ff");
         $("#fecha").val(date.format());
         $("#modalEventos").modal();
         $("#agregar").css("display", "block");
         $("#editar").css("display", "none");
         $("#eliminar").css("display", "none");

      },
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      eventDrop:function (calEvent){
         ID = calEvent.id;
         FechaHora = calEvent.start.format().split("T");
         var servicio = $("#exampleFormControlSelect1").val();
         var inicio = FechaHora[0] + " " +  FechaHora[1];
         httpRequest(URLD + "adminControl/editCita/" + ID +"/" + calEvent.title + "/" + inicio + "/" + calEvent.descripcion + "/" + calEvent.color.slice(1) + "/" + calEvent.textColor.slice(1) + "/" +servicio, function () {
            Swal.fire({
               position: 'top-end',
               title: 'Exito!',
               text: 'Cita reprogramada',
               icon: 'success',
               showConfirmButton: false,
               timer: 900
            })
            location.reload();
         });
      }
   });
}

function guardarCita(){

   var titulo = $("#titulo").val();
   var fechaInicio = $("#fecha").val();
   var hora = $("#hora").val() + ":00";
   var descripcion = $("#descripcion").val();
   var color = "#8080ff";
   var textColor = "#FFFFFF";
   var servicio = $("#exampleFormControlSelect1").val();


   if(titulo=="" || fechaInicio=="" || hora=="" || descripcion==""){
      $('#contError').text("Por favor, Introduce todos los valores");
      $('.alert').show();
      return;
   }
   $('#alert').hide();

   //concatenar inicio de cita
   var inicio = fechaInicio + " " +  hora;

   var nuevaCita = {
      title:titulo,
      start:inicio,
      descripcion:descripcion,
      color:color,
      textColor:textColor
   }

   $('#CalendarioWeb').fullCalendar('renderEvent', nuevaCita );
   $("#modalEventos").modal('toggle');

   httpRequest(URLD + "adminControl/addCita/" + titulo + "/" + inicio + "/" + descripcion + "/" + color.slice(1) + "/" + textColor.slice(1) + "/" + servicio, function () {
      var resp = this.responseText;
      Swal.fire({
         title: 'Exito!',
         text: 'Cita agendada',
         icon: 'success',
         confirmButtonText: 'OK'
      })


   });
}

function editarCita(){
   var titulo = $("#titulo").val();
   var fechaInicio = $("#fecha").val();
   var hora = $("#hora").val() + ":00";
   var descripcion = $("#descripcion").val();
   var color = $("#color").val();
   var textColor = "#FFFFFF";
   var servicio = $("#exampleFormControlSelect1").val();

   if(titulo=="" || fechaInicio=="" || hora=="" || descripcion==""){
      $('#contError').text("Por favor, Introduce todos los valores");
      $('.alert').show();
      return;
   }
   $('#alert').hide();


   //concatenar inicio de cita
   var inicio = fechaInicio + " " +  hora;

   httpRequest(URLD + "adminControl/editCita/" + ID +"/" + titulo + "/" + inicio + "/" + descripcion + "/" + color.slice(1) + "/" + textColor.slice(1) +"/" +servicio, function () {
      $('#CalendarioWeb').fullCalendar('refetchEvents');
      $("#modalEventos").modal('toggle');
      var resp = this.responseText;
      Swal.fire({
         title: 'Exito!',
         text: 'Cita reprogramada',
         icon: 'success',
         confirmButtonText: 'OK'
      })
      location.reload();


   });
}

function deleteCita(){
   httpRequest(URLD + "adminControl/deleteCita/" + ID , function () {
      $('#CalendarioWeb').fullCalendar('refetchEvents');
      $("#modalEventos").modal('toggle');
      Swal.fire({
         title: 'Exito!',
         text: 'Cita Eliminada',
         icon: 'warning',
         confirmButtonText: 'OK'
      })


   });
}

function httpRequest(url, callback){
   const http = new XMLHttpRequest();
   http.open("GET", url);
   http.send();
   http.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
         callback.apply(http);
      }
   }
}




