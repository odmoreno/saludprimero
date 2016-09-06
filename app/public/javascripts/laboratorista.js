$(document).ready(function(){
	$('#tblMuestras').DataTable({
		language: {
			processing:     "Procesando...",
			search:         "Buscar en la Tabla: ",
			lengthMenu:    "Mostrar _MENU_ Elementos",
			info:           "Mostrando desde registro  _START_ Hasta registro _END_ De _TOTAL_ ",
			infoEmpty:      "",
			infoFiltered:   "(filtrada)",
			infoPostFix:    "",
			loadingRecords: "Cargando Registros...",
			zeroRecords:    "No hay registros",
			emptyTable:     "No hay registros disponible",
			paginate: {
				first:      "	Primero	 ",
				previous:   "	Anterior	",
				next:       "	Siguiente	",
				last:       "	Ultimo	"
			},
			aria: {
				sortAscending:  ": Activar para ordenar de manera ascendente",
				sortDescending: ": Activar para ordenar de manera descendente"
			}
		},
		"order": [[ 0, "desc" ]]

	});
	notificar();
	recibir();
});

function notificar(){
	var notificaciones = $(".btnNotificar");

	for(var i = 0; i<notificaciones.length;i++){
		$(".btnNotificar").get(i).addEventListener('click', function(){
			var codigo = $(this).closest("tr").children(':nth-child(1)').text();
			$.ajax({
				type: 'POST',
				url: '/laboratorista/recepcion-muestras/notificar',
				data: 'codigo='+ codigo
			});
			window.location.replace("/laboratorista/recepcion-muestras/");
		});
	}
}

function recibir(){
	var recibidos = $(".btnRecibido");

	for(var i = 0; i<recibidos.length;i++){
		$(".btnRecibido").get(i).addEventListener('click', function(){
			var codigo = $(this).closest("tr").children(':nth-child(1)').text();
			$.ajax({
				type: 'POST',
				url: '/laboratorista/recepcion-muestras/recibir',
				data: 'codigo='+ codigo
			});
			window.location.replace("/laboratorista/recepcion-muestras/");
		});
	}
}
