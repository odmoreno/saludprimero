$(document).ready(function(){
	init();
});

function init(){
	$("#info-med").hide();
	$(".dropdown-menu li a").each(function(){
		$( this ).click(function(){
			$(".dropdown-menu li a[class='active']").removeClass("active");
			$(this).addClass("active");
			mostrarCentro();
			$("#dropdownCentros").text($(this).text());
		});
	});
}

function mostrarCentro(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			var json = JSON.parse(xhttp.responseText);
			json.forEach(function(centro){
				if(centro.nombre == $(".dropdown-menu li a[class='active']").text()){
					$("#nomCentro").text(centro.nombre);
					$("#horarioCentro").text(centro.horarios);
					$("#dirCentro").text(centro.direccion);
					$("#descripCentro").text(centro.descripcion);
					$("#img1").attr('src', centro.imagenesURL[0]);
					$("#img2").attr('src', centro.imagenesURL[1]);
				}
			});
		}
	};
	xhttp.open("GET","/usuario/centros-medicos/list", true);
	xhttp.send();
	$("#info-med").show();
}
