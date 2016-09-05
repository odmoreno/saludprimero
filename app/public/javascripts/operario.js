$(document).ready(function(){
	$('#tblMuestras').DataTable();
	init();
	eliminarPaciente();
	eliminarMuestra();
	editarMuestra();
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
				select.append($('<option>').text(centro.nombre));
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
				url: '/operario/pacientes/eliminar',
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
				type: 'POST',
				url: '/operario/muestras/editar_muestra',
				data: 'codigo='+ codigo
			});
			//window.location.replace("/editar_muestra");
		});
	}
}

function cargarExamenes(){
	var opcion=$("#muestras option:selected").text();
	var tabla= $("#tblExamen")
    tabla.empty();

	if(opcion =="Sangre"){
		var $row1= $("<input >");
		var $row2= $("<input >");
		var $row3= $("<input >");
		$row1.attr("type","text");
		$row1.attr("value","Hemograma");
		$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");
		$row2.attr("type","text");
		$row2.attr("value","Bioquimica");
		$row2.attr("readonly","readonly");
		$row2.attr("name","examen2");
		$row3.attr("type","text");
		$row3.attr("value","Serologia");
		$row3.attr("readonly","readonly");
		$row3.attr("name","examen3");

		tabla.append($row1);
		tabla.append($row2);
		tabla.append($row3);

	}
	else if(opcion =="Heces"){
		var $row1= $("<input >");
		$row1.attr("type","text");
		$row1.attr("value","Coprocultivo");
		$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");
		tabla.append($row1);

	}
	else if(opcion=="Orina"){
		var $row1= $("<input >");
		$row1.attr("type","text");
		$row1.attr("value","Uroanalisis");
		$row1.attr("readonly","readonly");
		$row1.attr("name","examen1");
		tabla.append($row1);
	}
}