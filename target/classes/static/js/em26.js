var path = null;

var headermid = null;
var headeruserid = null;
var headergroupid = null;
var headerstatus = null;
var headersuspend = null;

function search() {
	var groupid = $("#groupidheader").val();
	var groupname = $("#groupnameheader").val();
	var mid = $("#mid").val();

	if (mid == "" && groupname == "" && groupid == "") {
		$("#dataSearchFail").modal({backdrop: 'static'});
	} else {
		var params = {
			groupid : groupid,
			groupname : groupname,
			mid : mid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
					method : 'POST',
					data : params,
					url : path + "selectPaymentSubGroup",
					success : function(response) {
						var json = JSON.parse(response);
						$("#tableId").empty();
						var record = json.selectPaymentSubGroup;
						$.each(record, function(i, item) {
							$("#status").prop('checked', item.b_overdue_fees);
							$("#suspend").prop('checked', item.enabled);
							headeruserid = item.i_user_id;
							headergroupid = item.i_group_id;
						});
						if (record.length > 0) {
							$("#status").prop('disabled', false);
							$("#suspend").prop('disabled', false);
							$("#mid").prop('disabled', true);
							$("#btSubmit").prop('disabled', true);
							$("#groupidheader").prop('disabled' , true);
						    $("#groupnameheader").prop('disabled', true);
						} else {
							$("#mid").prop('disabled', false);
							$("#groupidheader").prop('disabled' , false);
						    $("#groupnameheader").prop('disavled', false);
							$("#btSubmit").prop('disabled', false);
							$("#tableId").empty();
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

function updateStatus() {
		var params = {
			mid : headermid,
			userid : headeruserid,
			groupid : headergroupid,
			statusheader : headerstatus,
			suspendheader : headersuspend,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'POST',
			data : params,
			url : path + "updatepaymentSubGroup",
			success : function(response) {
				var json = JSON.parse(response);
				var record = json.updatepaymentSubGroup;
				$.each(record, function(i, item) {
					$("#status").prop('checked', item.b_overdue_fees);
					$("#suspend").prop('checked', item.enabled);
				});
				blockUIApp.hidePleaseWait();
				if (record.length > 0) {
					$("#updateSuccess").modal({backdrop: 'static'});
					// $("#mid").val('');
					$("#mid").prop('disabled', false);
					$("#status").prop('disabled', false);
					// $("#status").prop('checked', false);
					$("#suspend").prop('disabled', false);
					// $("#suspend").prop('checked', false);
					$("#btSubmit").prop('disabled', false);
					$("#groupidheader").prop('disabled' , false);
					$("#groupnameheader").prop('disabled', false);
					// $("#tableId").empty();
				} else {
					$("#updateError").modal({backdrop: 'static'});
					$("#status").prop('disabled', true);
					$("#groupidheader").prop('disabled' , true);
					$("#groupnameheader").prop('disabled', true);
					$("#status").prop('checked', false);
					$("#suspend").prop('disabled', true);
					$("#suspend").prop('checked', false);
				}
			},
			failure : function(response) {
				blockUIApp.hidePleaseWait();
				$("#updateError").modal({backdrop: 'static'});
				console.info(response);
			}
		});
}

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		search();
	}
};

function btNotConfirm() {
	$('#status').prop('checked', !$("#status").is(':checked'));
}

function btNotConfirmSuspend(){
	$('#suspend').prop('checked', !$("#suspend").is(':checked'));
}

function clearval() {
	$("#mid").val('');
	$("#mid").prop('disabled', false);
	$('#status').prop('checked', false);
	$("#status").prop('disabled', true);
	$("#suspend").prop('checked', false);
	$("#suspend").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);
	$("#groupidheader").prop('disabled' , false);
	$("#groupidheader").val('');
	$("#groupnameheader").prop('disabled', false);
	$("#groupnameheader").val('');
	$("#tableId").empty();
};

$(document).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
	$("#status").prop('disabled', true);
	$("#suspend").prop('disabled', true);
	$('#status').change(function() {
		var mid = $("#mid").val();
		var status = $("#status").is(':checked');
		var suspend = $("#suspend").is(':checked');
			$('#dangerModalCheckedPayment').modal({backdrop: 'static'})
			headermid = mid;
			headerstatus = status;
			headersuspend = suspend;
			
	});
	$('#suspend').change(function() {
		var mid = $("#mid").val();
		var status = $("#status").is(':checked');
		var suspend = $("#suspend").is(':checked');
			$('#dangerModalCheckedSuspend').modal({backdrop: 'static'})
			headermid = mid;
			headerstatus = status;
			headersuspend = suspend;		
	});
});

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

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};