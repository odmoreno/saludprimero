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
});