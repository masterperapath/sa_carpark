var path = null;
function search() {
	var mid = $("#mid").val();

	if (mid == "") {
		$("#dangerModal").modal({backdrop: 'static'});
	} else {
		var params = {
			mid : mid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'POST',
			data : params,
			url : path + "searchBuzzer",
			success : function(response) {
				var json = JSON.parse(response);
				var record = json.eyeMinBazzer;
				$("#status").prop('checked', false);
				$("#speed").val('');
				$("#statusInput2").prop('checked', false);
				$("#speedInput2").val('');
				$("pin").val('');

				$.each(record, function(i, item) {
					$("#status").prop('checked', item.b_spd_op1_on);
					$("#speed").val(item.i_spd_alert_1);
					$("#statusInput2").prop('checked', item.b_spd_op2_on);
					$("#speedInput2").val(item.i_spd_alert_2);
					$("#pin").val(item.i_pin_code);
					
				});
				if (record.length > 0) {

					if ($("#status").is(':checked') == false) {
						$("#status").prop('disabled', false);
						$("#speed").prop('disabled', true);
					} else {
						$("#status").prop('disabled', false);
						$("#speed").prop('disabled', false);
					}
					if ($("#statusInput2").is(':checked') == false) {
						$("#statusInput2").prop('disabled', false);
						$("#speedInput2").prop('disabled', true);
					} else {
						$("#statusInput2").prop('disabled', false);
						$("#speedInput2").prop('disabled', false);
					}
					$("#pin").prop('disabled', false);
					$("#mid").prop('disabled', true);
					$("#btSubmit").prop('disabled', true);
					$("#btEdit").prop('disabled', false);
					
				} else {
					$("#status").prop('disabled', true);
					$("#speed").prop('disabled', true);
					$("#statusInput2").prop('disabled', true);
					$("#speedInput2").prop('disabled', true);
					$("#pin").prop('disabled', true);
					$("#mid").prop('disabled', false);
					$("#btSubmit").prop('disabled', false);
					$("#btEdit").prop('disabled', true);
					$("#dataNotFound").modal({backdrop: 'static'});
				}
				blockUIApp.hidePleaseWait();
			},
			failure : function(response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function clearVal(){
	$("#mid").val('');
	$("#status").prop('checked', false);
	$("#statusInput2").prop('checked', false);
	$("#speed").val('');
	$("#speedInput2").val('');
	$("#pin").val('');
	$("#mid").prop('disabled', false);
	$("#status").prop('disabled', true);
	$("#speed").prop('disabled', true);
	$("#speedInput2").prop('disabled', true);
	$("#pin").prop('disabled', true);
	$("#btEdit").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);

}

function update() {
	var mid = $("#mid").val();
	var status = $("#status").is(':checked');
	var speed = $("#speed").val();
	var statusInput2 = $("#statusInput2").is(':checked');
	var speedInput2 = $("#speedInput2").val();
	var pin = $("#pin").val();

	var st ="";
	var p = 1;
	if(pin != ""){
		p = parseInt(pin);
		st = "" + p ;
	}
	if (st != "" && st != "-1" && st.length < 4 || st.length > 4 || p == 0 || p < -1) {
		$("#statSpeedModal").modal({backdrop: 'static'});
	} else if (mid == "") {
			$("#dangerModal").modal({backdrop: 'static'});
		} else {
			if (speed != "" && speed > 0) {
				var params = {
					mid : mid,
					status : status,
					speed : speed,
					statusInput2 : statusInput2,
					speedInput2 : speedInput2,
					pin : st
				};
				console.log(status);
				blockUIApp.showPleaseWait();
				$.ajax({
					method : 'POST',
					data : params,
					url : path + "updateBuzzer",
					success : function(response) {
						var json = JSON.parse(response);
						var record = json.eyeMinBazzer;
						$("#status").val('false');
						$("#pin").val('');
						$("#speed").val('');
						$("#statusInput2").val('false');
						$("#speedInput2").val('');
						$.each(record, function(i, item) {
							$("#status").prop('checked', item.b_spd_op1_on);
							$("#speed").val(item.i_spd_alert_1);
							$("#statusInput2").prop('checked', item.b_spd_op2_on);
							$("#speedInput2").val(item.i_spd_alert_2);
							$("#pin").val(item.i_pin_code);
						});
						blockUIApp.hidePleaseWait();
						if (record.length > 0) {
							$("#mid").prop('disabled', false);
							$("#status").prop('checked', false);
							$("#status").prop('disabled', true);
							$("#speed").val('');
							$("#speed").prop('disabled', true);

							$("#statusInput2").prop('checked', false);
							$("#statusInput2").prop('disabled', true);
							$("#speedInput2").val('');
							$("#speedInput2").prop('disabled', true);
							
							$("#pin").val('');
							$("#pin").prop('disabled', true);
							$("#btEdit").prop('disabled', true);
							$("#btSubmit").prop('disabled', false);
							$("#updateSuccess").modal({backdrop: 'static'});
						} else {
							$("#mid").prop('disabled', false);
							$("#pin").val('');
							$("#pin").prop('disabled', true);
							$("#status").prop('checked', false);
							$("#status").prop('disabled', true);
							$("#speed").val('');
							$("#speed").prop('disabled', true);
							
							$("#statusInput2").prop('checked', false);
							$("#statusInput2").prop('disabled', true);
							$("#speedInput2").val('');
							$("#speedInput2").prop('disabled', true);
							
							$("#btEdit").prop('disabled', true);
							$("#btSubmit").prop('disabled', false);
							$("#updateError").modal({backdrop: 'static'});
						}
					},
					failure : function(response) {
						blockUIApp.hidePleaseWait();
						$("#updateError").modal({backdrop: 'static'});
						console.info(response);
					}
				});
			} else {
				$("#statSpeedModal").modal({backdrop: 'static'});
			}
		}
}

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		  search();
	}	
};

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
function getCsrf() {

	if (Cookies.get(tokenCsrf) == undefined || Cookies.get(tokenCsrf) == null
			|| Cookies.get(tokenCsrf) == ''
			|| Cookies.get(tokenCsrf) == 'undefined') {
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'GET',
			url : path + "csrf",
			success : function(response) {
				var json = JSON.parse(response);

				$.ajaxSetup({
					beforeSend : function(xhr) {
						xhr.setRequestHeader(headerCsrf, json.token);
					}
				});

				blockUIApp.hidePleaseWait();
			},
			failure : function(response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	} else {
		$.ajaxSetup({
			beforeSend : function(xhr) {
				xhr.setRequestHeader(headerCsrf, Cookies.get(tokenCsrf));
			}
		});
	}
};

$(document).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
	$("#status").prop('disabled', true);
	$("#speed").prop('disabled', true);
	$("#statusInput2").prop('disabled', true);
	$("#speedInput2").prop('disabled', true);
	$("#pin").prop('disabled', true);
	$("#mid").prop('disabled', false);
	$("#btSubmit").prop('disabled', false);
	$("#btEdit").prop('disabled', true);
	$('#status').change(function() {
		if ($("#status").is(':checked')) {
			$("#speed").prop('disabled', false);
		} else {
			$("#speed").prop('disabled', true);
			
		}
	});
	$('#statusInput2').change(function() {
		if ($("#statusInput2").is(':checked')) {
			$("#speedInput2").prop('disabled', false);
		} else {
			$("#speedInput2").prop('disabled', true);
			
		}
	});

});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};
