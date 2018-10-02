var path = null;
var checkMIDDup = null;
var boxNoteLost = null;
var boxNoteNew = null;
var phoneLost = null;
var phoneNew = null;
var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var year = d.getFullYear();
var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
var validateError = 0;
function searchEm31() {
	var mid = $('#mid').val();
	if (mid != '' && mid != null) {
		var params = {
			mid: mid
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em31SearchHistory",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31HistorySwapBox.data;
				$('#table').empty();
				var table = '';
				$.each(record, function (i, item) {
					table += '<tr><td style="text-align: center">' + item.no + '</td><td style="text-align: center">' + item.sb_mid_cuurent + '</td><td style="text-align: center">' + item.sb_imei_cuurent 
					+ '</td><td style="text-align: center">' + item.sb_mid_target + '</td><td style="text-align: center">' + item.sb_imei_target 
					+ '</td><td style="text-align: center">' + item.sb_mid_swap + '</td><td style="text-align: center">' + item.sb_imei_swap 
					+ '</td><td style="text-align: center">' + item.update_name + '</td><td style="text-align: center">' + item.update_date 
					+ '</td></tr>';
				});
				$('#table').append(table);
				if (table == "") {
					$("#dataNotFound").modal({ backdrop: 'static' });
					clearEm31();
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	} else {
		$("#dangerModal").modal({ backdrop: 'static' });
	}
};

function clearEm31() {
	$("#headerFirst").show();
	$("#headerSecond").hide();
	$("#bodyFirst").show();
	$("#bodySecond").hide();
	$("#CardSearch").show();
	$("#CardNote").hide();
	$("#mid").val('');
	$("#mid_store").val('');
	$("#mid_new").val('');
	$('#table').empty();
	boxNoteLost = null;
	boxNoteNew = null;
	phoneLost = null;
	phoneNew = null;
}

function backEm31() {
	$("#bodyFirst").show();
	$("#headerFirst").show();
	$("#headerSecond").hide();
	$("#bodySecond").hide();
	$("#CardSearch").show();
	$("#swapSecond").hide();
	$("#swapFirst").hide();
	boxNoteLost = null;
	boxNoteNew = null;
	phoneLost = null;
	phoneNew = null;
}

function newmidEm31() {
	var midLost = $('#mid_lost').val();
	var midNew = $('#mid_new').val();
	if (midNew == "") {
		$("#dangerModal").modal({ backdrop: 'static' });
	} else if (midNew == midLost) {
		$("#dangerDuplicateMID").modal({ backdrop: 'static' });
	} else {
		var params = {
			mid: midNew
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em25SearchMID",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em25SelectMID.data;
				$.each(record, function (i, item) {
					checkMIDDup = item.checkmid;
				});
				if (checkMIDDup == 1) {
					checkMIDDup = null;
					blockUIApp.hidePleaseWait();
					$("#midDupModal").modal({
						backdrop: 'static'
					});
				} else {
					$('#mid_new').prop('disabled', true)
					$("#headerFirst").hide();
					$("#headerSecond").show();
					$("#CardSearch").hide();
					$("#CardNote").show();
					$('#bodyNote').empty();
					var Note = '';
					$.each(record, function (i, item) {
						boxNoteNew = item.c_box_note;
						Note += '<div class="form-group row">'
							+ '<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midLost + ' (ข้อความเดิมใน db)</label>'
							+ '<label class="col-sm-5 col-form-label" for="input-small" style="text-align: left">' + boxNoteLost + '</label>'
							+ '</div>'
							+ '<div class="form-group row">'
							+ '<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midLost + ' (ข้อความใหม่)</label>'
							+ '<textarea class="col-sm-5 col-form-textarea" id="textLost" name="textLost" rows="9" class="form-control" placeholder="...">' + boxNoteLost + ', เปลี่ยน ' + midNew + ' แทน ' + midLost + '(_' + phoneLost + ')_' + output + '</textarea>'
							+ '</div>'
							+ '<div class="form-group row">'
							+ '</div>'
							+ '<div class="form-group row">'
							+ '<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midNew + ' (ข้อความเดิมใน db)</label>'
							+ '<label class="col-sm-5 col-form-label" for="input-small" style="text-align: left">' + boxNoteNew + '</label>'
							+ '</div>'
							+ '<div class="form-group row">'
							+ '<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midNew + ' (ข้อความใหม่)</label>'
							+ '<textarea class="col-sm-5 col-form-textarea" id="textNew" name="textNew" rows="9" class="form-control" placeholder="...">' + boxNoteNew + ', เปลี่ยน ' + midNew + ' แทน ' + midLost + '(_' + phoneLost + ')_' + output + '</textarea>'
							+ '</div>';
					});
					$('#bodyNote').append(Note);
					blockUIApp.hidePleaseWait();
				}
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function swapBox() {
	$("#bodyFirst").hide();
	$("#headerFirst").hide();
	$("#headerSecond").show();
	$("#swapSecond").show();
	$("#swapFirst").show();
	$("#CardSearch").hide();
}

function keyenter(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchEm31();
	}
};

function keyenterMID(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchMidEm31();
	}
};

function keyenterByGroup(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchMidGroup();
	}
};

function keyenterSwapFirst(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchSwapFirst();
	}
};

function keydeleteSwapFirst(evt) {
	if (evt.keyCode == 8 || evt.which == 8 || evt.keyCode == 46 || evt.which == 46) {
		clearSwapFirst();
		clearSwapSecond();
	}
}

function keyenterSwapSecond(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchSwapSecond();
	}
};

function keydeleteSwapSecond(evt) {
	if (evt.keyCode == 8 || evt.which == 8 || evt.keyCode == 46 || evt.which == 46) {
		clearSwapSecond();
	}
}

function clearSwapFirst() {
	$("#boxFirstImei").val('');
	$("#boxFirstGroupName").val('');
	$("#boxFirstCarcode").val('');
	$("#boxFirstPlat").val('');
	$("#boxFirstPlat").val('');
	$("#swapMid").val('');
	document.getElementById('boxFirstOldNote').innerHTML = '';
	$("#boxFirstNewNote").val('');
	phoneLost = '';
	boxNoteLost = '';
	$("#boxSecondMid").val('');
	$("#boxSecondMid").prop('disabled', true);
};

function clearSwapSecond() {
	$("#boxSecondImei").val('');
	$("#boxSecondGroupName").val('');
	$("#boxSecondCarcode").val('');
	$("#boxSecondPlat").val('');
	document.getElementById('boxSecondOldNote').innerHTML = '';
	$("#boxFirstNewNote").val('');
	$("#boxSecondNewNote").val('');
	$("#boxFirstNewNote").prop('disabled', true);
	$("#boxSecondNewNote").prop('disabled', true);
};

function clearEm31_2() {
	clearSwapFirst();
	clearSwapSecond();
	$("#boxFirstMid").val('');
}

function searchSwapFirst() {
	var boxFirstMid = $("#boxFirstMid").val();

	if (boxFirstMid == "") {
		$("#dangerModal").modal({ backdrop: 'static' });
	} else {
		var params = {
			boxFirstMid: boxFirstMid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em31SearchSwapFirst",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31SearchSwapFirst.data;
				if (!record[0].checkmid) {
					var item = record[0];
					$("#boxFirstImei").val(item.i_imei);
					$("#boxFirstGroupName").val(item.c_group_name);
					$("#boxFirstCarcode").val(item.c_car_code);
					$("#boxFirstPlat").val(item.c_plate_number);
					$("#boxFirstPlat").val(item.c_plate_number);
					$("#swapMid").val(item.swapmid);
					document.getElementById('boxFirstOldNote').innerHTML = item.c_box_note;
					$("#boxFirstNewNote").val('');
					phoneLost = item.c_sim_number;
					boxNoteLost = item.c_box_note;
					$("#boxSecondMid").prop('disabled', false);
				} else {
					clearSwapFirst();
					$("#midDupContactModal").modal({ backdrop: 'static' });
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function searchSwapSecond() {
	var boxSecondMid = $("#boxSecondMid").val();

	if (boxSecondMid == "") {
		$("#dangerModal").modal({ backdrop: 'static' });
	} else {
		var params = {
			boxSecondMid: boxSecondMid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em31SearchSwapSecond",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31SearchSwapSecond.data;
				if (!record[0].checkmid) {
					var item = record[0];
					$("#boxSecondImei").val(item.i_imei);
					$("#boxSecondGroupName").val(item.c_group_name);
					$("#boxSecondCarcode").val(item.c_car_code);
					$("#boxSecondPlat").val(item.c_plate_number);
					document.getElementById('boxSecondOldNote').innerHTML = item.c_box_note;
					$("#boxFirstNewNote").val(boxNoteLost + ', เปลี่ยน ' + $("#boxSecondMid").val() + ' แทน ' + $("#boxFirstMid").val() + '(_' + phoneLost + ')_' + output );
					$("#boxSecondNewNote").val(item.c_box_note + ', เปลี่ยน ' + $("#boxSecondMid").val() + ' แทน ' + $("#boxFirstMid").val() + '(_' + phoneLost + ')_' + output );
					$("#boxFirstNewNote").prop('disabled', false);
					$("#boxSecondNewNote").prop('disabled', false);
					
				} else {
					clearSwapSecond();
					$("#midDupContactModal").modal({ backdrop: 'static' });
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function saveEm31() {
	var mid_target = $('#boxFirstMid').val();
	var mid_target_reuse = $('#swapMid').val();
	var mid_swap = $('#boxSecondMid').val();
	var note_box_target = $('#boxFirstNewNote').val();
	var note_box_swap = $('#boxSecondNewNote').val();
	if (mid_target == "" || mid_target_reuse == "" || mid_swap == "" || note_box_target == "" || note_box_swap == "") {
		$("#dangerData").modal({ backdrop: 'static' });
	}
	else {
		var params = {
			mid_target: mid_target,
			mid_target_reuse: mid_target_reuse,
			mid_swap: mid_swap,
			note_box_target: note_box_target,
			note_box_swap: note_box_swap,
			username: usernameToken
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "em31SaveSwap",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31SaveSwap.data;
				if (record.length > 0) {
					blockUIApp.hidePleaseWait();
					clearEm31_2();
					$('#mid').val(record[0].i_mid_id);
					searchEm31();
					backEm31();
					$("#updateSuccess").modal({ backdrop: 'static' });
				} else {
					$("#updateError").modal({ backdrop: 'static' });
					blockUIApp.hidePleaseWait();
				}
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function searchMidEm31() {
	var boxFirstMid = $("#boxFirstMid").val();

	if (boxFirstMid == "") {
		$("#dangerModal").modal({ backdrop: 'static' });
	} else {
		var params = {
			boxFirstMid: boxFirstMid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "searchMidEm31",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31HistorySwapBox.data;
				$("#boxFirstImei").val('');
				$("#boxFirstGroupName").val('');
				$("#boxFirstCarcode").val('');
				$("#boxFirstPlat").val('');
				$("#swapMid").val('');;
				$.each(record, function (i, item) {
					$("#boxFirstImei").val(item.i_imei);
					$("#boxFirstGroupName").val(item.c_group_name);
					$("#boxFirstCarcode").val(item.c_car_code);
					$("#boxFirstPlat").val(item.c_plate_number);
					$("#swapMid").val(item.i_mid_id);
				});
				if (record.length > 0) {
					
				} else {
					$("#boxFirstImei").val('');
					$("#boxFirstGroupName").val('');
					$("#boxFirstCarcode").val('');
					$("#boxFirstPlat").val('');
					$("#swapMid").val('');
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	}
};

function searchMidGroup() {
	var boxSecondMid = $("#boxSecondMid").val();

	if (boxSecondMid == "") {
		$("#dangerModal").modal({ backdrop: 'static' });
	} else {
		var params = {
			boxSecondMid: boxSecondMid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'POST',
			data: params,
			url: path + "searchMidGroup",
			success: function (response) {
				var json = JSON.parse(response);
				var record = json.em31HistorySwapBox.data;
				// $("#boxFirstImei").val('');
				// $("#boxFirstGroupName").val('');
				// $("#boxFirstCarcode").val('');
				// $("#boxFirstPlat").val('');
				$.each(record, function (i, item) {
					// $("#boxFirstImei").val(item.i_imei);
					// $("#boxFirstGroupName").val(item.c_group_name);
					// $("#boxFirstCarcode").val(item.c_car_code);
					// $("#boxFirstPlat").val(item.c_plate_number);
				});
				if (record.length > 0) {
					
				} else {
					// $("#boxFirstImei").val('');
					// $("#boxFirstGroupName").val('');
					// $("#boxFirstCarcode").val('');
					// $("#boxFirstPlat").val('');
				}
				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
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
				console.info(response);
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
	$("#headerFirst").show();
	$("#headerSecond").hide();
	$("#bodyFirst").show();
	$("#bodySecond").hide();
	$("#swapFirst").hide();
	$("#swapSecond").hide();
	$("#CardSearch").show();
	$("#CardNote").hide();
	$("boxFirstImei").val('');
	$("boxFirstGroupName").val('');
	$("boxFirstCarcode").val('');
	$("boxFirstPlat").val('');
	$("swapMid").val('');
	$("#boxFirstImei").prop('disabled', true);
	$("#boxFirstGroupName").prop('disabled', true);
	$("#boxFirstCarcode").prop('disabled', true);
	$("#boxFirstPlat").prop('disabled', true);
	$("#swapMid").prop('disabled', true);
	$("#boxSecondImei").prop('disabled', true);
	$("#boxSecondGroupName").prop('disabled', true);
	$("#boxSecondCarcode").prop('disabled', true);
	$("#boxSecondPlat").prop('disabled', true);
	$("#boxSecondMid").prop('disabled', true);
	$("#boxFirstNewNote").prop('disabled', true);
	$("#boxSecondNewNote").prop('disabled', true);
});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};