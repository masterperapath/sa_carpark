var path = null;

var headermid = null;
var headeruserid = null;
var headergroupid = null;
var headerstatusMassage = null;
var headerstatus = null;
var headersuspend = null;

var detialmid = null;
var detialgroupid = null;
var detialuserid = null;
var detialcarnote = null;

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
					url : path + "searchpayment",
					success : function(response) {
						var json = JSON.parse(response);
						$("#tableId").empty();
						var record1 = json.eyeMinPayment1;
						var record2 = json.eyeMinPayment2;
						$.each(record1, function(i, item) {
							$("#statusMassage").prop('checked', item.b_show_msg2user);
							$("#status").prop('checked', item.b_overdue_fees);
							$("#suspend").prop('checked', item.enabled);
							headeruserid = item.i_user_id;
							headergroupid = item.i_group_id;
						});
						if (record1.length > 0) {
							$("#statusMassage").prop('disabled', false);
							$("#status").prop('disabled', false);
							$("#suspend").prop('disabled', false);
						}
						var table = '';
						$.each(record2, function (i, item) {
                        					var no = i+1;
                        	    			table += '<tr><td style="text-align: center">'
													+ no
													+ '</td><td>'
													+ item.i_mid_id
													+ '</td><td>'
													+ item.i_group_id
													+ '</td><td>'
													+ item.c_group_name
													+ '</td><td>'
													+ item.c_plate_number
													+ '</td><td>'
													+ item.c_car_code
													+ '</td>'
													+ '<td> <button type="submit" id="btCancalRecord" class="btn btn-sm btn-danger form-control" onclick="btCancalReccord(\''
													+ item.i_mid_id
													+ '\', \''
													+ item.i_group_id
													+ '\', \''
													+ item.i_user_id
													+ '\',\''
													+ item.c_group_name
													+ '\')" data-backdrop="static" ><i class="fa fa-trash-o"></i> ยกเลิก </button> </td>/<tr>';
										});
						table += '</tbody>'
						$('#tableId').append(table);
						if (record2.length > 0 || record1.length > 0) {
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
			statusMassageheader : headerstatusMassage,
			statusheader : headerstatus,
			suspendheader : headersuspend,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'POST',
			data : params,
			url : path + "em15updatepaymentheader",
			success : function(response) {
				var json = JSON.parse(response);
				var record = json.updateStatuspatment;
				$.each(record, function(i, item) {
					$("#statusMassage").prop('checked', item.b_show_msg2user);
					$("#status").prop('checked', item.b_overdue_fees);
					$("#suspend").prop('checked', item.enabled);
				});
				blockUIApp.hidePleaseWait();
				if (record.length > 0) {
					$("#updateSuccess").modal({backdrop: 'static'});
					// $("#mid").val('');
					$("#mid").prop('disabled', false);
					$("#statusMassage").prop('disabled', false);
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
					$("#groupidheader").prop('disabled' , true);
					$("#groupnameheader").prop('disabled', true);
					$("#statusMassage").prop('disabled', true);
					$("#statusMassage").prop('checked', false);
					$("#status").prop('disabled', true);
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

function updatedetial() {

		var params = {
			mid : detialmid,
			groupid : detialgroupid,
			userid : detialuserid,
			carnote : 'ย้ายออกจาก '+ detialcarnote + '_' + $("#startDate").val(),
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'POST',
			data : params,
			url : path + "em15updatepaymentdetail",
			success : function(response) {
				var json = JSON.parse(response);
				var record = json.eyeMinpayment;
				$("#tableId").empty();
				var table = '';
				$.each(record, function(i, item) {		
					var no = i + 1;
					table += '<tr><td>'
							+ no
							+ '</td><td>'
							+ item.i_mid_id
							+ '</td><td>'
							+ item.i_group_id
							+ '</td><td>'
							+ item.c_group_name
							+ '</td><td>'
							+ item.c_plate_number
							+ '</td><td>'
							+ item.c_car_code
							+ '</td>'
							+ '<td> <button type="submit" id="btCancalRecord"class="btn btn-sm btn-danger form-control" onclick="btCancalReccord(\''
							+ item.i_mid_id
							+ '\', \''
							+ item.i_group_id
							+ '\', \''
							+ item.i_user_id
							+ '\',\''
							+ item.c_group_name
							+ '\')"><i class="fa fa-trash-o"></i> ยกเลิก </button> </td>/<tr>';
				});
				table += '</tbody>'
					$('#tableId').append(table);
				blockUIApp.hidePleaseWait();
				if (record.length == 0) {
					$("#mid").prop('disabled', false);
					$("#btSubmit").prop('disabled', false);
					$("#groupidheader").prop('disabled' , false);
					$("#groupnameheader").prop('disabled', false);
				}
				$("#updateSuccess").modal({backdrop: 'static'});
			},
			failure : function(response) {
				blockUIApp.hidePleaseWait();
				$("#updateError").modal({backdrop: 'static'});
				console.info(response);
			}
		});
}

function btCancalReccord(mid, groupid, userid, groupname) {
	var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var now = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();
	$("#startDate").val(now);
	$("#startDate").datepicker({format: 'dd-mm-yyyy'});
	$("#dangerModalCheckedPaymentRecord").modal({backdrop: 'static'});
	detialmid = mid;
	detialgroupid = groupid;
	detialuserid = userid;
	detialcarnote = groupname;
}

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		search();
	}
};

function btNotConfirmMassage() {
	$('#statusMassage').prop('checked', !$("#statusMassage").is(':checked'));
}

function btNotConfirm() {
	$('#status').prop('checked', !$("#status").is(':checked'));
}

function btNotConfirmSuspend(){
	$('#suspend').prop('checked', !$("#suspend").is(':checked'));
}

function clearval() {
	$("#mid").val('');
	$("#mid").prop('disabled', false);
	$('#statusMassage').prop('checked', false);
	$("#statusMassage").prop('disabled', true);
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
	$("#statusMassage").prop('disabled', true);
	$("#status").prop('disabled', true);
	$("#suspend").prop('disabled', true);


	$('#statusMassage').change(function() {
		var mid = $("#mid").val();
		var statusMassage = $("#statusMassage").is(':checked');
		var status = $("#status").is(':checked');
		var suspend = $("#suspend").is(':checked');
			$('#dangerModalCheckedMassage').modal({backdrop: 'static'})
			headermid = mid;
			headerstatusMassage = statusMassage
			headerstatus = status;
			headersuspend = suspend;
			
	});
	$('#status').change(function() {
		var mid = $("#mid").val();
		var statusMassage = $("#statusMassage").is(':checked');
		var status = $("#status").is(':checked');
		var suspend = $("#suspend").is(':checked');
			$('#dangerModalCheckedPayment').modal({backdrop: 'static'})
			headermid = mid;
			headerstatusMassage = statusMassage
			headerstatus = status;
			headersuspend = suspend;
			
	});
	$('#suspend').change(function() {
		var mid = $("#mid").val();
		var statusMassage = $("#statusMassage").is(':checked');
		var status = $("#status").is(':checked');
		var suspend = $("#suspend").is(':checked');
			$('#dangerModalCheckedSuspend').modal({backdrop: 'static'})
			headermid = mid;
			headerstatusMassage = statusMassage
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