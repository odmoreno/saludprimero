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
		"order": [[ 0, "desc" ]],
		"bSort": false

	} );
	init();
	eliminarPaciente();
	eliminarMuestra();
	editarMuestra();
	generarGrafico();
});

function init(){
	mostrarCentro();

$("#muestras").change(cargarExamenes());
}
$("#muestras").change(cargarExamenes());


function mostrarCentro(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			var json = JSON.parse(xhttp.responseText);
			var select = $("#centromed");
			json.forEach(function(centro){
				select.append($('<option>', { value: centro.nombre, text: centro.nombre}));
			});
		}
	};
	xhttp.open("GET","/operario/muestras/editar/centroslist", true);
	xhttp.send();
}

function eliminarPaciente(){
	var borrar = $(".btnEliminar");

	for(var i = 0; i<borrar.length;i++){
		$(".btnEliminar").get(i).addEventListener('click', function(){
			var cedulas = $(this).closest("tr").children(':nth-child(3)').text();
			$.ajax({
				type: 'POST',
				url: '/operario/pacientes/eliminar' ,
				data: 'cedulas='+ cedulas
			});
			window.location.replace("/operario/pacientes");
		});
	}
}

function eliminarMuestra(){
	var borrar = $(".btnEliminarMuestra");

	for(var i = 0; i<borrar.length;i++){
		$(".btnEliminarMuestra").get(i).addEventListener('click', function(){
			var codigo = $(this).closest("tr").children(':nth-child(1)').text();
			$.ajax({
				type: 'POST',
				url: '/operario/muestras/eliminar',
				data: 'codigo='+ codigo
			});
			window.location.replace("/operario/muestras");
		});
	}
}

function editarMuestra(){
	var editar = $(".btnEditar");

	for(var i = 0; i<editar.length;i++){
		$(".btnEditar").get(i).addEventListener('click', function(){
			var codigo = $(this).closest("tr").children(':nth-child(1)').text();
			$.ajax({
				type: 'GET',
				url: '/operario/muestras/editar?codigo=' + codigo,
				//data: {codigo: codigo}
			});
			window.location.replace("/operario/muestras/editar?codigo=" + codigo);
		});
	}
}

function cargarExamenes(){
	var opcion=$("#muestras option:selected").text();
	var tabla= $("#tblExamen")
    tabla.empty();

	if(opcion =="Sangre"){
		var $row1= $("<option>");
		var $row2= $("<option>");
		var $row3= $("<option>");
		//$row1.attr("type","text");
		$row1.text("Hemograma");
		$row1.attr("value","Hemograma");
		//$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");

		$row2.text("Bioquimica");
		//$row2.attr("type","text");
		$row2.attr("value","Bioquimica");
		//$row2.attr("readonly","readonly");
		$row2.attr("name","examen2");

		$row3.text("Serologia");
		//$row3.attr("type","text");
		$row3.attr("value","Serologia");
		//$row3.attr("readonly","readonly");
		$row3.attr("name","examen3");

		tabla.append($row1);
		tabla.append($row2);
		tabla.append($row3);

	}
	else if(opcion =="Heces"){
		var $row1= $("<option>");
		$row1.text("Coprocultivo");
		//$row1.attr("type","text");
		$row1.attr("value","Coprocultivo");
		//$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");
		tabla.append($row1);

	}
	else if(opcion=="Orina"){
		var $row1= $("<option>");
		$row1.text("Uroanalisis");
		//$row1.attr("type","text");
		$row1.attr("value","Uroanalisis");
		//$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");
		tabla.append($row1);
	}
}

/*function mostrarGraficosPie(){
	var selector1 = parseInt($("#cont1").text());
	var selector2 = parseInt($("#cont2").text());
	var selector3 = parseInt($("#cont3").text());
	var selector4 = parseInt($("#cont4").text());
	var data = {series: [selector1, selector2, selector3, selector4]};
	var suma = selector1+selector2+selector3+selector4;
	new Chartist.Pie('.ct-chart', data, {
	  labelInterpolationFnc: function(value) {
	    return Math.round(value / suma * 100) + '%';
	  }
	});
}*/

function generarGrafico(){
	$("#btnGenerar").on("click", function(){
		if($("#rad1").is(":checked")){
			$("#chartContainer").empty();
			mostrarGraficosPie();
		}else if($("#rad2").is(":checked")){
			$("#chartContainer").empty();
		}
	});
}

function mostrarGraficosPie(){
	var selector1 = parseInt($("#cont1").text());
	var selector2 = parseInt($("#cont2").text());
	var selector3 = parseInt($("#cont3").text());
	var selector4 = parseInt($("#cont4").text());
	var chart = new CanvasJS.Chart("chartContainer",
	{
		title:{
			text: "Muestras por Laboratorio"
		},
		legend: {
			maxWidth: 200,
			itemWidth: 100
		},
		data: [
		{
			type: "pie",
			showInLegend: true,
			legendText: "{indexLabel}",
			dataPoints: [
				{ y: selector1, indexLabel: "Laboratorio 1" },
				{ y: selector2, indexLabel: "Laboratorio 2" },
				{ y: selector3, indexLabel: "Laboratorio 3" },
				{ y: selector4, indexLabel: "Laboratorio 4"}
			]
		}
		]
	});
	chart.render();
}