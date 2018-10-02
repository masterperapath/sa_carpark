var path = null;
var statusmain = null;
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
			url : path + "em17searchvoltage",
			success : function(response) {
				var json = JSON.parse(response);
				var record = json.em17voltage;
				$("#status").prop('checked', false);
				$("#speed").val('');

				$.each(record, function(i, item) {
					$("#status").prop('checked', item.b_acc_with_voltage);
					$("#speed").val(item.i_acc_voltage);
					
					statusmain = item.b_acc_with_voltage;
				});
				if (record.length > 0) {
					if(statusmain == true){
						$("#status").prop('disabled', false);
						$("#speed").prop('disabled', false);
						$("#btEdit").prop('disabled', false);
						$("#mid").prop('disabled', true);
                    	$("#btSubmit").prop('disabled', true);
					}else{
						$("#status").prop('disabled', false);
						$("#speed").prop('disabled', true);
						$("#btEdit").prop('disabled', false);
						$("#mid").prop('disabled', true);
                    	$("#btSubmit").prop('disabled', true);
				}
					
				}else {
					$("#status").prop('disabled', true);
					$("#speed").prop('disabled', true);
					$("#btEdit").prop('disabled', true);
					$("#mid").prop('disabled', false);
                	$("#btSubmit").prop('disabled', false);
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
	$("#speed").val('');
	$("#mid").prop('disabled', false);
	$("#status").prop('disabled', true);
	$("#speed").prop('disabled', true);
	$("#btEdit").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);
}

function update() {
	var mid = $("#mid").val();
	var status = $("#status").is(':checked');
	var speed = $("#speed").val();

		if (mid == "") {
			$("#dangerModal").modal({backdrop: 'static'});
		} else {
			if ((speed != "" && speed >= 0)) {
				var params = {
					mid : mid,
					status : status,
					speed : speed
				};
				console.log(status);
				blockUIApp.showPleaseWait();
				$.ajax({
					method : 'POST',
					data : params,
					url : path + "em17updatevoltaget",
					success : function(response) {
						var json = JSON.parse(response);
						var record = json.em17voltage;
						$("#status").val('false');
						$("#speed").val('');
						$.each(record, function(i, item) {
							$("#status").prop('checked', item.b_acc_with_voltage);
							$("#speed").val(item.i_acc_voltage);
						});
						blockUIApp.hidePleaseWait();
						if (record.length > 0) {
							$("#updateSuccess").modal({backdrop: 'static'});
							$("#status").prop('disabled', true);
							$("#speed").prop('disabled', true);
							$("#mid").prop('disabled', false);
							$("#btEdit").prop('disabled', true);
		                	$("#btSubmit").prop('disabled', false);
							$("#speed").val('');
							$("#status").prop('checked', false);
						} else {
							$("#updateError").modal({backdrop: 'static'});
							$("#status").prop('disabled', true);
							$("#speed").prop('disabled', true);
							$("#mid").prop('disabled', false);
							$("#btEdit").prop('disabled', true);
		                	$("#btSubmit").prop('disabled', false);
							$("#speed").val('');
							$("#status").prop('checked', false);
						}
					},
					failure : function(response) {
						blockUIApp.hidePleaseWait();
						$("#updateError").modal({backdrop: 'static'});
						console.info(response);
					}
				});
			} else {
				$("#statSpeedModalem17").modal({backdrop: 'static'});
			}
		}
}

function keyenter(evt) { 
	if(evt.keyCode == 13 || evt.which == 13){
		  search();
	  }
};

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
function getCsrf(){
	
		if(Cookies.get(tokenCsrf) == undefined || Cookies.get(tokenCsrf) == null || Cookies.get(tokenCsrf) == '' || Cookies.get(tokenCsrf) == 'undefined'){
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'GET',
	                    url : path+"csrf",
	                    success : function(response) {
	                        var json = JSON.parse(response);
	                        
	                        $.ajaxSetup({
	                            beforeSend: function (xhr)
	                            {
	                               xhr.setRequestHeader(headerCsrf,json.token);
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
			    beforeSend: function (xhr)
			    {
			    	xhr.setRequestHeader(headerCsrf,Cookies.get(tokenCsrf));
			    }
			});
		}
};

$( document ).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
	$("#status").prop('disabled', true);
	$("#speed").prop('disabled', true);
	$("#pin").prop('disabled', true);
	$("#mid").prop('disabled', false);
	$("#btEdit").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);
	$('#status').change(function () {
	    if($("#status").is(':checked')){
	    	$("#speed").prop('disabled', false);
	    }else{
	    	$("#speed").prop('disabled', true);
	    	if($("#speed").val() == ""){
	    		$("#speed").val('0');
	    	}
	    }
	 });
});


var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
