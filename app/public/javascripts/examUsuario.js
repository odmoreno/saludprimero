$(document).ready(function(){
	$('#tblExamen').DataTable({
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
	crearPDF();
});

function crearPDF(){
	var adjuntos = $(".btnPDF");

	for(var i = 0; i<adjuntos.length;i++){
		console.log("entra");
		$(".btnPDF").get(i).addEventListener('click', function(){
			var codigo = $(this).closest("tr").children(':nth-child(1)').text();
			console.log(codigo);
			$.ajax({
				type: 'POST',
				url: '/usuario/examenes/pdf' ,
				data: 'codigo='+ codigo
			});
			window.location.replace("/usuario/examenes");
		});
	}
}