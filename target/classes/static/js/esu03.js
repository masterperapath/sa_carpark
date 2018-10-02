var path = null;
var cUsername = null;
var username = null;
var groupname = null;
function searchEsu03(){
	if($('#groupname').val() == '' && $('#username').val() == '' && $('#groupid').val() == ''){
		$('#dataSearchFail').modal({backdrop : 'static'});
	} else {
		var params = {
				esu03groupname : $('#groupname').val(),
				esu03username : $('#username').val(),
				esu03groupid : $('#groupid').val()
			};
		blockUIApp.showPleaseWait();
		$.ajax({
            method : 'POST',
            data : params,
            url : path+"esu03Search",
            success : function(response) {
            	$("#tableId").empty();
                var json = JSON.parse(response);
                var record = json.esu03Searchtable;
                var table = '';
                $('#table').empty();
                $.each(record.data, function (i, item) {
                	var no = i+1;
                	    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.c_username + '</td><td>' + item.c_group_name + '</td><td>' + item.c_comment + '</td>' 
                	    + '<td><button type="submit" class="btn btn-block btn-sm btn-success form-control" onclick="forgot(\''+ item.c_username +'\',\''+ item.c_group_name +'\')"> <i class="fa fa-share"></i> ส่ง </button></td></tr>';
                });
                $('#table').append(table);
                if((record.data).length == 0){
                    $('#dataNotFound').modal({backdrop: 'static'});
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
 
function forgot(user_name, group_name) {
	username = $('#userName').val(user_name);
	groupname = group_name;
	$("#userName").prop('disabled', true);
	$('#forgotpassword').show();
	$('#search').hide();
};

function sendEmailEsu03() {
	var username = $('#userName').val();
	var emailuser = $('#emailUser').val();
	var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;
	var email = emailuser.indexOf("@");
	if (emailuser == '') {
		$('#emailModal').modal({backdrop : 'static'});
	} else if (email == "" || email < 0 || !emailuser.match(pattern)) {
		$("#emailTryAgain").modal({
			backdrop : 'static'
		});
		$('#emailUser').val('');
	} else {
		var params = {
			esu03username : username,
			esu03emaliuser : emailuser
		};
		blockUIApp.showPleaseWait();
	    $.ajax({
	                method : 'POST',
	                data : params,
	                url : path+"esu03ForgotPassword",
	                success : function(response) {
	                	var json = JSON.parse(response);
	                    var record = json.forgotPassword;
	                    clearEsu03();
	                    if((record.data).length > 0){
	                    	 $('#sendEmailSuccess').modal({backdrop: 'static'});
	                    } else{
	                        $('#emailErrorModal').modal({backdrop: 'static'});
	                       }
                       blockUIApp.hidePleaseWait();
	                },
	                failure : function(response) {
	                	blockUIApp.hidePleaseWait();
	                	$('#emailErrorModal').modal({backdrop: 'static'});
	                    console.info(response);
	                }
	    });

	}
};

function clearSelectEsu03(){
	$('#groupname').val('');
	$('#username').val('');
	$('#groupid').val('');
	$('#table').empty();
	clearEsu03();
};

function clearEsu03() {
	$('#emailUser').val('');
};

function backEsu03() {
	$('#forgotpassword').hide();
	$('#search').show();
};

function keyenterselect(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		searchEsu03();
	}
};

function keyentersend(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		sendEmailEsu03();
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
	$('#forgotpassword').hide();
	$('#platenumber').val('');
	$('#groupname').val('');
	$('#username').val('');
	$('#mid').val('');
});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};