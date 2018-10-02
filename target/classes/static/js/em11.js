var path = null;
var groupIdSave = null;
var usernameUpdate = null;
var userIdUpdate = null;
var groupIdUpdate = null;
var authorityUpdate = null;
var functionUpdate = null;
function searchEm11() {
	$("#em11CardSearch").show();
	$("#em11CardSave").hide();
	$("#btBackEm11").hide();
	$('#table').empty();
	$("#btSaveEm11").prop('disabled', true);
	$("#em11GroupName").prop('disabled', false);
	$("#em11UserSearch").prop('disabled', false);
	$("#btSearchEm11").prop('disabled', false);
	var em11GroupName = $("#em11GroupName").val();
	var em11UserSearch = $("#em11UserSearch").val();
	if (em11GroupName == "" && em11UserSearch == "") {
		$("#groupUserModal").modal({
			backdrop : 'static'
		});
	} else {
		var params = {
			em11GroupName : em11GroupName,
			em11UserSearch : em11UserSearch
		};
		blockUIApp.showPleaseWait();
		$
				.ajax({
					method : 'POST',
					data : params,
					url : path + "em11SearchUser",
					success : function(response) {
						var json = JSON.parse(response);
						var record = json.em11SelectUser;
						var table = '';
						$
								.each(
										record,
										function(i, item) {
											var no = i + 1;
											table += '<tr><td style="text-align: center">'
													+ no
													+ '</td><td>'
													+ item.groupidlpad
													+ '</td><td>'
													+ item.c_group_name
													+ '</td><td>'
													+ item.c_username
													+ '</td><td>'
													+ item.authority
													+ '</td>'
													if(item.c_username == '-'){
											table +=  '<td><button type="submit" disabled id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
													+ item.c_username
													+ '\', \''
													+ item.i_user_id
													+ '\', \''
													+ item.i_group_id
													+ '\', \''
													+ item.authority
													+ '\', \''
													+ item.subgroup
													+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'
								                    }else{
								            table +=  '<td><button type="submit" id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
													+ item.c_username
													+ '\', \''
													+ item.i_user_id
													+ '\', \''
													+ item.i_group_id
													+ '\', \''
													+ item.authority
													+ '\', \''
													+ item.subgroup
													+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'  
								                      }
											table +=  '<td><button type="submit" class="btn btn-block btn-sm btn-success form-control" onClick="addEm11(\''
													+ item.i_group_id
													+ '\',\''
													+ item.subgroup
													+ '\')">เพิ่มผู้ใช้</button></td>'
													+ '</tr>';
										});
						$('#table').append(table);
						if (record.length == 0) {
							$("#dataNotFound").modal({
								backdrop : 'static'
							});
						} else {
							$("#btSaveEm11").prop('disabled', true);
						}
						blockUIApp.hidePleaseWait();
					},
					failure : function(response) {
						console.info(response);
						$("#btSaveEm11").prop('disabled', true);
						blockUIApp.hidePleaseWait();
					}
				});
	}
};

function addEm11(groupId, subgroup) {
	$("#em11CardSearch").hide();
	$("#em11CardSave").show();
	$("#em11CardSaveHeadA").show();
	$("#em11CardSaveHeadB").hide();
	$("#btBackEm11").show();
	$("#headerFirst").hide();
	$("#headerSecond").show();
	$("#statusSubGroupSave").hide();
	groupIdSave = groupId;
	$("#em11UserSave").val('');
	$("#em11RoleSave").val('ROLE_ADMIN');
	$("#em11UserSearch").prop('disabled', true);
	$("#em11UserSave").prop('disabled', true);
	$("#em11GroupName").prop('disabled', true);
	$("#btSaveEm11").prop('disabled', false);
	$("#em11UserSave").prop('disabled', false);
	$("#statusSubGroupSave").prop('checked', false);
};

function editEm11(username, userid, groupId, authority, subgroup) {
	$("#em11CardSearch").hide();
	$("#em11CardSave").show();
	$("#em11CardSaveHeadA").hide();
	$("#em11CardSaveHeadB").show();
	$("#btBackEm11").show();
	$("#headerFirst").hide();
	$("#headerSecond").show();
	var subgroupBL = (subgroup === "true");
	$("#statusSubGroupSave").prop('checked', subgroupBL);
	usernameUpdate = username;
	userIdUpdate = userid;
	groupIdUpdate = groupId;
	authorityUpdate = authority;
	functionUpdate = 1;
	$("#em11UserSave").val(usernameUpdate);
	$("#em11RoleSave").val(authorityUpdate);
	$("#statusSubGroupSave").prop('disabled', false);
	$("#btSaveEm11").prop('disabled', false);
	$("#em11UserSave").prop('disabled', true);
	$("#em11GroupName").prop('disabled', true);
	$("#em11UserSearch").prop('disabled', true);
	$("#btSearchEm11").prop('disabled', true);
};

function saveEm11() {

	var usernameSave = $("#em11UserSave").val();

	if (userIdUpdate != "" && userIdUpdate != null && userIdUpdate != undefined
			&& functionUpdate == 1) {
		var params = {
			userId : userIdUpdate,
			userName : usernameUpdate,
			groupId : groupIdUpdate,
			role : $("#em11RoleSave").val(),
			subGroup : $("#statusSubGroupSave").is(':checked')
		};
		blockUIApp.showPleaseWait();
		$
				.ajax({
					method : 'POST',
					data : params,
					url : path + "em11UpdateUser",
					success : function(response) {
						$("#em11CardSearch").show();
						$("#em11CardSave").hide();
						$("#headerSecond").hide();
						$("#headerFirst").show();
						$('#table').empty();
						$("#em11GroupName").prop('disabled', false);
						$("#em11UserSearch").prop('disabled', false);
						$("#btSearchEm11").prop('disabled', false);
						var json = JSON.parse(response);
						var record = json.em11UpdateUser;
						var table = '';
						$
						.each(
								record,
								function(i, item) {
									var no = i + 1;
									table += '<tr><td style="text-align: center">'
											+ no
											+ '</td><td>'
											+ item.groupidlpad
											+ '</td><td>'
											+ item.c_group_name
											+ '</td><td>'
											+ item.c_username
											+ '</td><td>'
											+ item.authority
											+ '</td>'
											if(item.c_username == '-'){
									table +=  '<td><button type="submit" disabled id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
											+ item.c_username
											+ '\', \''
											+ item.i_user_id
											+ '\', \''
											+ item.i_group_id
											+ '\', \''
											+ item.authority
											+ '\', \''
											+ item.subgroup
											+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'
						                    }else{
						            table +=  '<td><button type="submit" id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
											+ item.c_username
											+ '\', \''
											+ item.i_user_id
											+ '\', \''
											+ item.i_group_id
											+ '\', \''
											+ item.authority
											+ '\', \''
											+ item.subgroup
											+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'  
						                      }
									table +=  '<td><button type="submit" class="btn btn-block btn-sm btn-success form-control" onClick="addEm11(\''
											+ item.i_group_id
											+ '\',\''
											+ item.subgroup
											+ '\')">เพิ่มผู้ใช้</button></td>'
											+ '</tr>';
								});
						$('#table').append(table);
						usernameUpdate = null;
						userIdUpdate = null;
						groupIdUpdate = null;
						authorityUpdate = null;
						functionUpdate = null;
						$("#btSaveEm11").prop('disabled', true);
						$("#btBackEm11").hide();
						blockUIApp.hidePleaseWait();
						if (record.length > 0) {
							$("#updateSuccess").modal({
								backdrop : 'static'
							});
						} else {
							$("#updateError").modal({
								backdrop : 'static'
							});
						}
					},
					failure : function(response) {
						console.info(response);
						usernameUpdate = null;
						userIdUpdate = null;
						groupIdUpdate = null;
						authorityUpdate = null;
						functionUpdate = null;
						$("#btSaveEm11").prop('disabled', true);
						$("#headerSecond").hide();
						$("#headerFirst").show();
						blockUIApp.hidePleaseWait();
						$("#updateError").modal({backdrop : 'static'});
					}
				});
	} else {
		if (usernameSave == "" || groupIdSave == "" || em11RoleSave == "") {
			$("#dangerData").modal({
				backdrop : 'static'
			});
		} else if (usernameSave.length < 4) {
			$("#dangerData").modal({backdrop : 'static'});
		} else {
			var params = {
				username : usernameSave,
				groupId : groupIdSave,
				role : $("#em11RoleSave").val(),
				subGroup : $("#statusSubGroupSave").is(':checked')
			};
			blockUIApp.showPleaseWait();
			$
					.ajax({
						method : 'POST',
						data : params,
						url : path + "em11SaveUser",
						success : function(response) {
							$("#em11CardSearch").show();
							$("#em11CardSave").hide();
							$('#table').empty();
							var json = JSON.parse(response);
							var record = json.em11SaveUser;
							$.each(record, function(i, item) {
								checkUserDup = item.checkuser;
							});
							if (checkUserDup == 1) {
								checkUserDup = null;
								blockUIApp.hidePleaseWait();
								$("#userDup").modal({
									backdrop : 'static'
								});	
								$("#em11CardSearch").hide();
								$("#em11CardSave").show();
								$("#em11CardSaveHeadA").show();
								$("#em11CardSaveHeadB").hide();
								
								$("#em11UserSave").val('');
							} else {
								var table = '';
								$
								.each(
										record,
										function(i, item) {
											var no = i + 1;
											table += '<tr><td style="text-align: center">'
													+ no
													+ '</td><td>'
													+ item.groupidlpad
													+ '</td><td>'
													+ item.c_group_name
													+ '</td><td>'
													+ item.c_username
													+ '</td><td>'
													+ item.authority
													+ '</td>'
													if(item.c_username == '-'){
											table +=  '<td><button type="submit" disabled id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
													+ item.c_username
													+ '\', \''
													+ item.i_user_id
													+ '\', \''
													+ item.i_group_id
													+ '\', \''
													+ item.authority
													+ '\', \''
													+ item.subgroup
													+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'
								                    }else{
								            table +=  '<td><button type="submit" id="btSubmit"class="btn btn-block btn-sm btn-warning form-control" onclick="editEm11(\''
													+ item.c_username
													+ '\', \''
													+ item.i_user_id
													+ '\', \''
													+ item.i_group_id
													+ '\', \''
													+ item.authority
													+ '\', \''
													+ item.subgroup
													+ '\')"><i class="fa fa-wrench"></i> แก้ไขผู้ใช้ </button></td>'  
								                      }
											table +=  '<td><button type="submit" class="btn btn-block btn-sm btn-success form-control" onClick="addEm11(\''
													+ item.i_group_id
													+ '\',\''
													+ item.subgroup
													+ '\')">เพิ่มผู้ใช้</button></td>'
													+ '</tr>';
										});
								$('#table').append(table);
								groupIdSave = null;
								$("#btSaveEm11").prop('disabled', true);
								blockUIApp.hidePleaseWait();
								if (record.length > 0) {
									$("#updateSuccess").modal({backdrop : 'static'});
								} else {
									$("#updateError").modal({backdrop : 'static'});
								}
								$("#headerSecond").hide();
								$("#headerFirst").show();
							}
						},
						failure : function(response) {
							console.info(response);
							$("#headerSecond").hide();
							$("#headerFirst").show();
							groupIdSave = null;
							$("#btSaveEm11").prop('disabled', true);
							blockUIApp.hidePleaseWait();
						}
					});
		}
	}
};

function keyenter(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchEm11();
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
	$("#btSaveEm11").prop('disabled', true);
	$("#em11CardSearch").show();
	$("#em11CardSave").hide();
	$("#btBackEm11").hide();
	$("#headerSecond").hide();
});

function backEm11() {
	$("#em11CardSearch").show();
	$("#em11CardSave").hide();
	$("#btBackEm11").hide();
	$("#headerSecond").hide();
	$("#headerFirst").show();
	$("#btSaveEm11").prop('disabled', true);
	$("#em11GroupName").prop('disabled', false);
	$("#em11UserSearch").prop('disabled', false);
	$("#btSearchEm11").prop('disabled', false);
};

function clearEm11() {
	$("#em11GroupName").val('');
	$("#em11UserSearch").val('');
	$("#table").empty();

}

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};
