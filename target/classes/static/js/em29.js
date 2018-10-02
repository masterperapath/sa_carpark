var path = null;
var usernameToken = null;
var recodeObj = [{}];
var recodeObjSave = [{}];
var checkMIDDup = null;
var regular = null;
var prmhNo = null;
var param2 = '';
var param4 = '';
function searchEm29() {
	$('#table').empty();
	var mid = $("#midSearch").val();
	var entryCode = $("#entryCodeSearch").val();
	if (mid == "") {
		$("#setUpBoxModal").modal({ backdrop: 'static' });
	} else {
		var params = {
			mid: mid,
			entryCode: entryCode
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "searchEm29",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.Em29SearchBox.data;
				var table = '';
				$.each(record, function (i, item) {
					var no = i + 1;
					table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.f_mid + '</td><td>' + item.f_plate_no + '</td>'
						  + '<td>' + item.f_cmd + '</td><td>' + item.f_cmd_desc + '</td><td>' + item.f_cmd_value + '</td>'
						  + '<td>' + item.f_cmd_value_desc + '</td><td>' + item.f_cmd_status + '</td>'
						  + '<td><button type="submit" id="btEditEm29" class="btn btn-block btn-sm btn-warning form-control"' 
						  + 'onclick="updateEm29(' + item.s_mid + ',\'' + item.s_entry_cd + '\',\'' + item.s_cmd_desc + '\',\'' + item.s_cmd_value + '\',\'' + item.param4 + '\',\'' + item.param2 + '\',\'' + item.param5 + '\',\'' + item.param1 + '\',\'' + item.param3 + '\',\'' + item.f_cmd + '\')">'
						  + '<i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
				});
				$('#table').append(table);
				if (table == "") {
					$("#dataNotFound").modal({ backdrop: 'static' });
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function comboBoxEm29(mid) {
	var params = {
		mid: mid
	};
	blockUIApp.showPleaseWait();
	$.ajax({
		method: 'POST',
		data: params,
		url: path + "em29ComboboxSetup",
		success: function (response) {
			$('#entryCodeSearch').empty();
			var json = JSON.parse(response);
			var record = json.comboboxEm29.data;
			recodeObj = record
			var option = '<option value ="">เลือกคำสั่ง</option>';
			$.each(record, function (i, item) {
				option += '<option value ="' + item.entry_cd + '">' + item.entry_name + '</option>';
			});
			$('#entryCodeSearch').append(option);
			blockUIApp.hidePleaseWait();
		},
		failure: function (response) {
			blockUIApp.hidePleaseWait();
		}
	});
};

function comboBoxEmSave29(mid) {
	var params = {
		mid: mid
	};
	blockUIApp.showPleaseWait();
	$.ajax({
		method: 'POST',
		data: params,
		url: path + "em29ComboboxSetupSave",
		success: function (response) {
			$('#entryCodeUp').empty();
			var json = JSON.parse(response);
			var record = json.comboboxSaveEm29.data;
			recodeObjSave = record
			var option = '<option value ="0">เลือกคำสั่ง</option>';
			$.each(record, function (i, item) {
				option += '<option value ="' + item.entry_cd + '">' + item.entry_name + '</option>';
			});
			$('#entryCodeUp').append(option);
			
			blockUIApp.hidePleaseWait();
		},
		failure: function (response) {
			blockUIApp.hidePleaseWait();
		}
	});
};

$("#entryCodeUp").change(function () {
	$("#cmdValue").removeClass('is-valid');
	$("#cmdValue").removeClass('is-invalid');
	$("#btSaveEm29").prop('disabled', true);
	$('#validateText').empty();
	$("#cmdValue").val('');
	var entryCode = $("#entryCodeUp").val();
	var mid = $("#midUp").val();
	var objCode = recodeObjSave.filter(recodeObjSave => recodeObjSave.entry_cd == entryCode);
	var cmd_desc = objCode.map(objCode => objCode.cmd_desc);
	var cmd_example = objCode.map(objCode => objCode.cmd_example);
	param2 = objCode.map(objCode => objCode.cmd_value);
	var param5 = objCode.map(objCode => objCode.param5);
	param4 = objCode.map(objCode => objCode.param4);
	regular = objCode.map(objCode => objCode.param3);
	prmhNo = objCode.map(objCode => objCode.prmh_no);
	$("#comment").text(cmd_desc);
	if(param4 == '1'){
		$("#cmdValue").prop('disabled', true);
		$("#btSaveEm29").prop('disabled', false);
	}else if(entryCode == '0'){
		$("#cmdValue").prop('disabled', true);
	}else{
		$("#cmdValue").prop('disabled', false);
	}
	$("#exCmdValue").text(cmd_example);
	$("#noteCmdValue").text(param5);
	if(entryCode == 'B99'){
		var params = {
				mid: mid
			};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em29CheckB99",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.Em29CheckB99.data;
				$.each(record, function (i, item) {
					checkB99 = item.count;
				});
				if(checkB99 == 0){
					$("#entryCodeUp").val("A71").change();
					$("#btSaveEm29").prop('disabled', true);
					blockUIApp.hidePleaseWait();
				}else{
					$("#btSaveEm29").prop('disabled', false);
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				blockUIApp.hidePleaseWait();
			}
		});
	}
});

function addEm29() {
	$("#cardSearchEm29").hide();
	$("#cardSaveEm29").show();
	$("#headerSaveFirst").show();
	$("#headerSaveSecond").hide();
	$("#headerFirst").hide();
	$("#headerSecond").show();
	$("#midSearch").prop('disabled', true);
	$("#entryCodeSearch").prop('disabled', true);
	$("#btClearSaveEm29Add").prop('disabled', false);
	$("#cmdValue").prop('disabled', true);
	clearSaveEm29();
};

function updateEm29(mid, entry_cd, cmd_desc, cmd_value, param4Up, param2Up, param5, param1, param3, entry_name) {
	param2 = param2Up;
	param4 = param4Up;
	var option = '<option value ="' + entry_cd + '">' + entry_name + '</option>';
	$('#entryCodeUp').append(option);
	$("#cardSearchEm29").hide();
	$("#cardSaveEm29").show();
	$("#headerSaveFirst").hide();
	$("#headerSaveSecond").show();
	$("#headerFirst").hide();
	$("#headerSecond").show();
	$("#midUp").val(mid);
	$("#entryCodeUp").val(entry_cd);
	$("#cmdValue").val(cmd_value);
	$("#midSearch").prop('disabled', true);
	$("#entryCodeSearch").prop('disabled', true);
	$("#midUp").prop('disabled', true);
	$("#entryCodeUp").prop('disabled', true);
	$("#cmdValue").prop('disabled', false);
	$("#btSaveEm29").prop('disabled', true);
	$("#btClearSaveEm29Edit").prop('disabled', true);
	if(param4 == '1'){
		$("#cmdValue").prop('disabled', true);
		$("#btSaveEm29").prop('disabled', false);
	}else{
		$("#cmdValue").prop('disabled', false);
		$("#btSaveEm29").prop('disabled', true);
	}
	$("#exCmdValue").text(param1);
	$("#noteCmdValue").text(param5);
	$("#comment").text(cmd_desc);
	regular = param3;
};

function backEm29() {
	$("#cmdValue").removeClass('is-valid');
	$("#cmdValue").removeClass('is-invalid');
	$("#cardSearchEm29").show();
	$("#cardSaveEm29").hide();
	$("#headerFirst").show();
	$("#headerSecond").hide();
	$("#midSearch").prop('disabled', false);
	$("#entryCodeSearch").prop('disabled', false);
};

function clearEm29() {
	$("#cmdValue").removeClass('is-valid');
	$("#cmdValue").removeClass('is-invalid');
	$("#midSearch").val('');
	$("#entryCodeSearch").val('0');
	$('#table').empty();
};

function clearSaveEm29() {
	$("#cmdValue").removeClass('is-valid');
	$("#cmdValue").removeClass('is-invalid');
	$("#midUp").prop('disabled', false);
	$("#entryCodeUp").prop('disabled', true);
	$("#cmdValue").prop('disabled', true);
	$("#btSaveEm29").prop('disabled', true);
	$("#midUp").val('');
	$("#entryCodeUp").val('0');
	$("#comment").text('รายละเอียดคำสั่ง');
	$("#cmdValue").val('');
	$("#exCmdValue").text('');
	$("#noteCmdValue").text('');
	$('#validateText').empty();
};

function saveEm29() {
	var mid = $("#midUp").val();
	var entryCode = $("#entryCodeUp").val();
	var cmdValue = $("#cmdValue").val();
	if(param4 == 1){
		if(param2 != ''){
			var entryCodeComplate =  $("#entryCodeUp").val()+','+param2;
		}else{
			var entryCodeComplate =  $("#entryCodeUp").val();
		}
	}else{
		var entryCodeComplate =  $("#entryCodeUp").val()+','+$("#cmdValue").val();
	}
	if(prmhNo != null && prmhNo!= ''){
		var prmhno = prmhNo[0];
	}else{
		var prmhno = 0;
	}
	var params = {
		mid: mid,
		entryCode: entryCode,
		cmdValue: cmdValue,
		usernameSave: usernameToken,
		entryCodeComplate: entryCodeComplate,
		prmhNo: prmhno
	};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "updateEm29",
			success: function (response) {
				backEm29();
				$('#table').empty();
				$("#midSearch").val(mid);
				$("#entryCodeSearch").val(entryCode);
				var json = JSON.parse(response);
				var record = json.Em29UpdateBox.data;
				var table = '';
				$.each(record, function (i, item) {
					var no = i + 1;
					table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.f_mid + '</td><td>' + item.f_plate_no + '</td>'
					  + '<td>' + item.f_cmd + '</td><td>' + item.f_cmd_desc + '</td><td>' + item.f_cmd_value + '</td>'
					  + '<td>' + item.f_cmd_value_desc + '</td><td>' + item.f_cmd_status + '</td>'
					  + '<td><button type="submit" id="btEditEm29" class="btn btn-block btn-sm btn-warning form-control"' 
					  + 'onclick="updateEm29(' + item.s_mid + ',\'' + item.s_entry_cd + '\',\'' + item.s_cmd_desc + '\',\'' + item.s_cmd_value + '\',\'' + item.param4 + '\',\'' + item.param2 + '\',\'' + item.param5 + '\',\'' + item.param1 + '\',\'' + item.param3 + '\',\'' + item.f_cmd + '\')">'
					  + '<i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
			});
				$('#table').append(table);
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				$("#updateError").modal({ backdrop: 'static' });
				blockUIApp.hidePleaseWait();
			}
		});
};

function keyenter(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchEm29();
	}
};

function blurBoxMID() {
	var mid = $("#midUp").val();
	var params = {
		mid: mid
	};
	blockUIApp.showPleaseWait();
	$.ajax({
		method: 'POST',
		data: params,
		url: path + "em29CheckBox",
		success: function (response) {
			var json = JSON.parse(response);
			var record = json.Em29CheckBox.data;
			$.each(record, function (i, item) {
				checkMID = item.count;
			});
			if (checkMID == 1) {
				$("#entryCodeUp").prop('disabled', false);
				$("#cmdValue").prop('disabled', true);
				comboBoxEmSave29(mid);
				$("#entryCodeUp").val(0);
				$("#cmdValue").val('');
				$("#exCmdValue").text('');
				$("#noteCmdValue").text('');
				$('#validateText').empty();
				$("#comment").text('รายละเอียดคำสั่ง');
				blockUIApp.hidePleaseWait();
			} else {
				$("#entryCodeUp").prop('disabled', true);
				$("#cmdValue").prop('disabled', true);
				$("#entryCodeUp").val(0);
				$("#cmdValue").val('');
				$("#exCmdValue").text('');
				$("#noteCmdValue").text('');
				$('#validateText').empty();
				blockUIApp.hidePleaseWait();
				$("#comment").text('รายละเอียดคำสั่ง');
				$("#midNotFound").modal({ backdrop: 'static' });
			}
		},
		failure: function (response) {
			blockUIApp.hidePleaseWait();
		}
	});
};

function blurBoxEditMID() {
	var mid = $("#midUp").val();
	var cmdValue = $("#cmdValue").val();
	var entryCode = $("#entryCodeUp").val();
	if(mid != null && mid != '' && cmdValue != null && cmdValue != '' && entryCode != null && entryCode != ''){
		if(cmdValue.match(regular)){
			$("#btSaveEm29").prop('disabled', false);
			$("#cmdValue").removeClass('is-invalid');
			$("#cmdValue").addClass('is-valid');
			$('#validateText').empty();
			$('#validateText').append('<label class="col-form-label" for="input-small" style="color: green; font-weight:bold"><i class="fa fa-check"></i>ถูกต้อง</label>');
		}else{
			$("#btSaveEm29").prop('disabled', true);
			$("#cmdValue").removeClass('is-valid');
			$("#cmdValue").addClass('is-invalid');
			$('#validateText').empty();
			$('#validateText').append('<label class="col-form-label" for="input-small" style="color: red; font-weight:bold"><i class="fa fa-times"></i>ผิด</label>');
		}
	}else{
		$("#btSaveEm29").prop('disabled', true);
	}
};

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
function getCsrf() {

	if (Cookies.get(tokenCsrf) == undefined || Cookies.get(tokenCsrf) == null || Cookies.get(tokenCsrf) == '' || Cookies.get(tokenCsrf) == 'undefined') {
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'GET',
			url: path + "csrf",
			success: function (response) {
				var json = JSON.parse(response);

				$.ajaxSetup({
					beforeSend: function (xhr) {
						xhr.setRequestHeader(headerCsrf, json.token);
					}
				});

				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				blockUIApp.hidePleaseWait();
			}
		});
	} else {
		$.ajaxSetup({
			beforeSend: function (xhr) {
				xhr.setRequestHeader(headerCsrf, Cookies.get(tokenCsrf));
			}
		});
	}
};

$(document).ready(function (patheyemin) {
	path = contextRoot;
	getCsrf();
	var token = Cookies.get(tokenJWT);
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	var JSONObject = JSON.parse(window.atob(base64));
	usernameToken = JSONObject["user_name"];
	comboBoxEm29(1);
	$("#cardSaveEm29").hide();
	$("#headerSecond").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};
