$(document).ready(function(){
	agregarFila();
	ingresarResultados();
});

function agregarFila(){
	$("#agregar").on('click', function(){
		$('#tblExamen1 tbody').append($('<tr>').append($('<td>').append($('<input>'))).append($('<td>').append($('<input>'))).append($('<td>').append($('<input>'))).append($('<td>').append($('<input>'))));
	});
}

function ingresarResultados(){
	$("#btnGuardarResult").on('click', function(){
		var codigo = $('#codigo').text();
		var datos = [];
		var i = 0;
		$("#tblExamen1").each( function(){
			var resultados = [];
			var nombre = $('label').text();
			var j =0;
			$(this).children('tbody').children('tr').each(function(){
				var param = $(this).children(':nth-child(1)').children("input").val();
				if(param != ''){
					var valor = $(this).children('td:nth-child(2)').children("input").val();
					var unidad = $(this).children(':nth-child(3)').children("input").val();
					var ref = $(this).children(':nth-child(4)').children("input").val();
					resultados[j] = {parametro: param, unidades: unidad, medidas: valor, referencia: ref};
				}
				j++;
			});
			datos[i] = {nombre: nombre, resultados: resultados};
			i++;
		});
		var json = JSON.stringify(datos);
		$.ajax({
			type: 'POST',
			url: '/laboratorista/muestras/resultados/nuevo',
			data: 'examenes='+ json + '&codigo=' + codigo
		});
		window.location.replace("/laboratorista/muestras/");
	});
}
		

/*function cargarTablas(){
			if(tipoMuestra == 'Orina'){
				$("#resultados").append($('<label>').text('Uroanálisis'));
				var tabla = $('<table>').addClass("table").attr('id', 'tablaOrina');
				var encabezado = $('<tr>').append($('<th>').text("Parametro")).append($('<th>').text("Resultados")).append($('<th>').text("Unidades")).append($('<th>').text("Valores de Referencia"));
				tabla.append(encabezado);
				tabla.append($('<tr>').append($('<td>').text("Aspecto")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Color")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Densidad")).append($('<td>').append($('<input>'))).append($('<td>').text("")).append($('<td>').text("1,001 - 1,0035")));
				tabla.append($('<tr>').append($('<td>').text("pH")).append($('<td>').append($('<input>'))).append($('<td>').text("")).append($('<td>').text("5,0 - 9,0")));
				tabla.append($('<tr>').append($('<td>').text("Proteínas")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/d")).append($('<td>').text("150")));
				tabla.append($('<tr>').append($('<td>').text("Glucosa")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/d")).append($('<td>').text("50 - 300")));
				tabla.append($('<tr>').append($('<td>').text("Hemoglobina")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Nitritos")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Urobilinógeno")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/dl")).append($('<td>').text("0 - 0,2")));
				$("#resultados").append(tabla);
			}else if(tipoMuestra == 'Heces'){
				$("#resultados").append($('<label>').text('Coprocultivo'));
				var tabla = $('<table>').addClass("table").attr('id', 'tablaHeces');
				var encabezado = $('<tr>').append($('<th>').text("Parametro")).append($('<th>').text("Resultados")).append($('<th>').text("Unidades")).append($('<th>').text("Valores de Referencia"));
				tabla.append(encabezado);
				tabla.append($('<tr>').append($('<td>').text("Helycobacter Pylori en Heces")).append($('<td>').append($('<input>'))).append($('<td>').text("ng/ml")).append($('<td>').text("")));
				tabla.append($('<tr>').append($('<td>').text("Color")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Consistencia")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Parásitos en Heces")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Flora Bacteriana")).append($('<td>').append($('<input>'))));
				tabla.append($('<tr>').append($('<td>').text("Residuos Alimenticios")).append($('<td>').append($('<input>'))));

				$("#resultados").append(tabla);
			}else{
				$("#resultados").append($('<label>').text('Hemograma'));
				var tabla1 = $('<table>').addClass("table").attr('id', 'tablaSangre1');
				var encabezado1 = $('<tr>').append($('<th>').text("Parametro")).append($('<th>').text("Resultados")).append($('<th>').text("Unidades")).append($('<th>').text("Valores de Referencia"));
				tabla1.append(encabezado1);
				tabla1.append($('<tr>').append($('<td>').text("Hemoglobina")).append($('<td>').append($('<input>'))).append($('<td>').text("g/dL")).append($('<td>').text("12,0 - 16,0")));
				tabla1.append($('<tr>').append($('<td>').text("Leucocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("4,50 - 10,00")));
				tabla1.append($('<tr>').append($('<td>').text("Eritrocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("0,3 - 1,0")));
				tabla1.append($('<tr>').append($('<td>').text("Reticulocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("mill./ul")).append($('<td>').text("4,5 - 5,6")));
				tabla1.append($('<tr>').append($('<td>').text("Trombocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("150 - 400")));
				tabla1.append($('<tr>').append($('<td>').text("Hematocrito")).append($('<td>').append($('<input>'))).append($('<td>').text("%")).append($('<td>').text("37 - 47")));
				$("#resultados").append(tabla1);
				$("#resultados").append($('<label>').text('Bioquímica'));
				var tabla2 = $('<table>').addClass("table").attr('id', 'tablaSangre2');;
				var encabezado2 = $('<tr>').append($('<th>').text("Parametro")).append($('<th>').text("Resultados")).append($('<th>').text("Unidades")).append($('<th>').text("Valores de Referencia"));
				tabla2.append(encabezado2);
				tabla2.append($('<tr>').append($('<td>').text("Neutrofilos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("2,20 - 4,80")));
				tabla2.append($('<tr>').append($('<td>').text("Linfocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("1,10 - 3,20")));
				tabla2.append($('<tr>').append($('<td>').text("Monocitos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("0,3 - 0,8")));
				tabla2.append($('<tr>').append($('<td>').text("Eosinófilos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("0,08 - 0,44")));
				tabla2.append($('<tr>').append($('<td>').text("Basófilos")).append($('<td>').append($('<input>'))).append($('<td>').text("K/ul")).append($('<td>').text("0,00 - 0,11")));
				tabla2.append($('<tr>').append($('<td>').text("Recuento de Glóbulos Rojos")).append($('<td>').append($('<input>'))).append($('<td>').text("M/ul")).append($('<td>').text("4,20 - 5,40")));
				$("#resultados").append(tabla2);
				$("#resultados").append($('<label>').text('Serología'));
				var tabla3 = $('<table>').addClass("table").attr('id', 'tablaSangre3');;
				var encabezado3 = $('<tr>').append($('<th>').text("Parametro")).append($('<th>').text("Resultados")).append($('<th>').text("Unidades")).append($('<th>').text("Valores de Referencia"));
				tabla3.append(encabezado3);
				tabla3.append($('<tr>').append($('<td>').text("Inmunoglobulina G")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/dL")).append($('<td>').text("680 - 1445")));
				tabla3.append($('<tr>').append($('<td>').text("Inmunoglobulina M")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/dL")).append($('<td>').text("40 - 250")));
				tabla3.append($('<tr>').append($('<td>').text("Inmunoglobulina A")).append($('<td>').append($('<input>'))).append($('<td>').text("mg/dL")).append($('<td>').text("70 - 374")));
				$("#resultados").append(tabla3);
			}
		});
	});
}*/