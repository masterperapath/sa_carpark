var path = null;
var midh = null;
var usernameh = null;
var groupnameh = null;
var useridh = null;

function searchEm28() {
	var mid = $('#mid').val();
	var username = $('#username').val();
	var groupname = $('#groupname').val();
	
	if(mid == ''  && username == '' && groupname == ''){
		$("#dataSearchFail").modal({backdrop: 'static'});
	}else{
    var params = {
    		em28mid : mid,
    		username : username,
    		groupname : groupname,
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchEm28",
                    success : function(response) {
                        var json = JSON.parse(response);
						var record = json.em28responseSearch.data;
						$('#tableId').empty();
                        var table = '';
						$.each(record, function(i, item) {	
											var no = i + 1;
											table += '<tr><td align="center">'
													+ no
													+ '</td><td align="center">'
													+ item.i_mid_id
													+ '</td><td align="center">'
													+ item.c_username
													+ '</td><td align="center">'
													+ item.c_group_name
													+ '</td>'
													+ '<td> <button type="submit" id="login" class="btn btn-sm btn-success form-control"  onclick="ChangeRecord(\'' + item.i_mid_id + '\', \'' + item.c_username + '\', \'' + item.c_group_name + '\',\'' + item.i_user_id + '\')" > <i class="fa fa-cog"></i> Change Password </button> </td>/<tr>';
										});
						$('#tableId').append(table);
                        if(record.length == 0){
                            $("#dataNotFound").modal({backdrop: 'static'});
						} else{
							$("#mid").prop('disabled', true);
							$("#username").prop('disabled', true);
							$("#groupname").prop('disabled', true);
							$("#btSearchEm28").prop('disabled', true);
							
						}

                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
                    }
		});
	}
};

function saveEm28() {
	var mid = $('#mid').val();
	var username = usernameh
	var password = $('#pass').val();
	var confrimpassword = $('#confrimpass').val();
	var groupname = $('#groupname').val();
	
	
	if(username == "" || password == "" || confrimpassword == ""){
    	$("#dangerData").modal({backdrop: 'static'});
    }
	else if (!username.match(/^([a-z0-9\_])+$/i)){
		$("#matchTryAgain").modal({backdrop: 'static'});
	}
	else if(password != confrimpassword){
		$("#passwordFailModal").modal({backdrop: 'static'});
	}
	else if(password.length < 6){
		$("#passwordLength").modal({backdrop: 'static'});
	}
    else{
    	var params = {
    			em28mid      : midh, 
    			username    : username, 
    			password    : password, 
    			groupname : groupnameh,
    			userid : useridh,
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"updateEm28",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.em28responseUpdate;
                        $.each(record, function (i, item) {
                        	checkUserDup = item.checkuser;
                        });
                        if(checkUserDup == 1){
                            $("#updatePasswordFail").modal({backdrop: 'static'});
                        	$("#selectColumn").hide();
                        	$("#forgotpassword").show();
                        }
                        else{
                        	$("#updatePasswordSuccess").modal({backdrop: 'static'});
                        	$("#selectColumn").show();
                        	$("#forgotpassword").hide();
                        }
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        console.info(response);
                        $("#updatePasswordFail").modal({backdrop: 'static'});
                        blockUIApp.hidePleaseWait();
                    }
        });
}
}

function ChangeRecord(mid, username, groupname, userid) {
	$("#selectColumn").hide();
	$("#userName").val('');
	$("#forgotpassword").show();
	$("#userName").val(username);
	 midh = mid;
	 usernameh = username;
	 groupnameh = groupname;
	 useridh = userid;
}

function clearEm28(){
	$('#mid').val('');
	$('#username').val('');
	$('#groupname').val('');
	$("#tableId").empty();

	$("#mid").prop('disabled', false);
	$("#username").prop('disabled', false);
	$("#groupname").prop('disabled', false);
	$("#btSearchEm28").prop('disabled', false);

	$("#selectColumn").show();
	$("#forgotpassword").hide();
}

function back(){
	$("#selectColumn").show();
	$("#forgotpassword").hide();
}

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		searchEm28();
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
	$("#forgotpassword").hide();
	$("#userName").prop('disabled', true);
});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};



