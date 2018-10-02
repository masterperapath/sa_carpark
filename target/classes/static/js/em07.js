var path = null;
var userIdSave = null;
var searcharr = null;
collection = [];
function searchEm07(){
	    $("#em07CardSearch").show();
	    $("#em07CardSave").hide();
	    $("#headerFirst").show();
	    $("#headerSecond").hide();
		$("#usernameSearch").prop('disabled', false);
		$("#userroleSearch").prop('disabled', false);
		var username =  $('#usernameSearch').val();
	    var userrole = $('#userroleSearch').val();
		if(username == "" && userrole == "0"){
			$("#userroleModal").modal({backdrop: 'static'});
		}else{
		var params = {
			em07UserName : username,
			em07UserRole  : userrole
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em07SearchUser",
                    success : function(response) {
                		var json = JSON.parse(response);
                        var record = json.em07SelectUser;
                        $('#table').empty();
                        var table = '';
                        $.each(record, function (i, item) {
                        	var no = i+1;
                        table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.username + '</td><td>' + item.realname + '</td><td>' + item.role_name + '</td>'
                              +  '<td><button type="submit" id="btEditEm10" class="btn btn-block btn-sm btn-warning form-control" '
                              +  'onclick="updateEm07('+item.id+',\''+item.username+'\', \''+item.password+'\',\''+ item.realname +'\',\''+item.displayname+'\', \''+item.email+'\','+ item.send_sumary_mail +','+item.user_role+')">'
                              +  '<i class="fa fa-wrench"></i> แก้ไข </button></td><td><button type="submit" id="dtDeleteEm07" class="btn btn-block btn-sm btn-danger form-control"'
                              +  'onclick="deleteEm07(\''+item.id+'\')">ลบบัญชีผู้ใช้</button></td></tr>';
                        });
                        $('#table').append(table);
                        $(table).height();
                        if (table == ""){
                        	$("#dataNotFound").modal({backdrop: 'static'});
                        	clearEm07();
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

function clearEm07(){
	$("#em07CardSearch").show();
    $("#em07CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#usernameSearch").prop('disabled', false);
	$("#userroleSearch").prop('disabled', false);
	$('#table').empty();
	userIdSave = null;
	$("#usernameSearch").val('');
	$("#userroleSearch").val(0);
	$("#realname").val('');
    $("#displayname").val('');
	$("#username").val('');
    $("#password").val('');
	$("#confirmpassword").val('');
    $("#userrole").val(0);
	$("#email").val('');
    $("#sendemail").prop('checked',false);
}

function backEm07(){
	$("#em07CardSearch").show();
    $("#em07CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#usernameSearch").prop('disabled', false);
	$("#userroleSearch").prop('disabled', false);
	$("#usernameSearch").val();
	$("#userroleSearch").val();
}

function comboBoxRoleSearch(){
    var params = {};
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em07comboboxroleSearch",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.em07ComboBoxRoleSearch;
                        var option = '';
                        option = '<option value ="0">เลือกแผนก</option>';
                        $.each(record, function (i, item) {
                        	option += '<option value ="' + item.role_code + '">' +  item.role_name  + '</option>';
                        });
                        $('#userroleSearch').append(option);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
                    }
        });
};

function comboBoxRole(){
    var params = {};
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em07comboboxrole",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.em07ComboBoxRole;
                        var option = '';
                        option = '<option value ="0">เลือกแผนก</option>';
                        $.each(record, function (i, item) {
                        	option += '<option value ="' + item.role_code + '">' +  item.role_name  + '</option>';
                        });
                        $('#userrole').append(option);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
                    }
        });
};

function addEm07(){
	$("#em07CardSearch").hide();
    $("#em07CardSave").show();
    $("#em07CardSaveA").hide();
    $("#em07CardSaveB").show();
    $("#headerFirst").hide();
    $("#headerSecond").show();
	$("#usernameSearch").prop('disabled', true);
	$("#userroleSearch").prop('disabled', true);
	userIdSave = null;
	$("#usernameSearch").val('');
	$("#userroleSearch").val("0");
	$("#realname").val('');
    $("#displayname").val('');
	$("#username").val('');
	$("#username").prop('disabled', false);
    $("#password").val('');
	$("#confirmpassword").val('');
    $("#userrole").val("0");
	$("#email").val('');
    $("#sendemail").prop('checked', false);
};

function updateEm07(userId, username, password, realname, displayname, email, sendmail, userrole){
	$("#em07CardSearch").hide();
    $("#em07CardSave").show();
    $("#em07CardSaveA").show();
    $("#em07CardSaveB").hide();
    $("#headerFirst").hide();
    $("#headerSecond").show();
	$("#usernameSearch").prop('disabled', true);
	$("#userroleSearch").prop('disabled', true);
	userIdSave = userId;
	$("#realname").val(realname);
    $("#displayname").val(displayname);
	$("#username").val(username);
	$("#username").prop('disabled', true);
    $("#password").val(password);
	$("#confirmpassword").val(password);
    $("#userrole").val(userrole);
	$("#email").val(email);
    $("#sendemail").prop('checked',sendmail);
};


function saveEm07(){
	    var userAdmin = usernameToken;
		var userID = userIdSave;
		var userName =  $("#username").val();
		var password =  $("#password").val();
		var sumpassword = $("#confirmpassword").val();
		var realName =  $("#realname").val();
		var displayName =  $("#displayname").val();
		var email =  $("#email").val();
		var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i;
		var sendMail =  $("#sendemail").prop('checked',);
		var userRole =  $("#userrole").val();
		var pin = email.indexOf("@");
		if(userName == "" || password == "" || sumpassword == "" || realName == "" || displayName == "" || email == "" || userRole == "0"){
	    	$("#dangerData").modal({backdrop: 'static'});
	    }
		else if (!userName.match(/^([a-z0-9\_])+$/i)){
			$("#matchTryAgain").modal({backdrop: 'static'});
		}
		else if (userName.length < 6){
			$("#userNameLength").modal({backdrop: 'static'});
		}
		else if(password.length < 6){
			$("#passwordLength").modal({backdrop: 'static'});
		}
		else if(password != sumpassword){
			$("#passwordFailModal").modal({backdrop: 'static'});
		}
		else if(pin == "" || pin < 0 || !email.match(pattern)){
			$("#emailTryAgain").modal({backdrop: 'static'});
			var email =  $("#email").val('');
		}
	    else{
	    	var params = {
	    			em07UserID      : userID, 
	    			em07UserName    : userName, 
	    			em07Password    : password, 
	    			em07RealName    : realName, 
	    			em07DisplayName : displayName,
	    			em07Email       : email, 
	    			em07SendMail    : sendMail,
	    			em07UserRole    : userRole,
	    			em07UserAdmin   : userAdmin
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"em07updateuser",
	                    success : function(response) {
	                        var json = JSON.parse(response);
	                        var record = json.em07UpdateUser;
	                        $.each(record, function (i, item) {
	                        	checkUserDup = item.checkuser;
	                        });
	                        if(checkUserDup == 1){
	                        	checkUserDup = null;
	                        	blockUIApp.hidePleaseWait();
	                        	$("#usernameDup").modal({backdrop: 'static'});
	                        	$("#em07CardSearch").hide();
	                            $("#headerFirst").hide();
	                            $("#headerSecond").show();
	                        	$("#usernameSearch").prop('disabled', true);
	                        	$("#userroleSearch").prop('disabled', true);
		                        userIdSave = null;
	                        	var userName =  $("#username").val('');
	                    		var password =  $("#password").val('');
	                    		var sumpassword = $("#confirmpassword").val('');
	                    		var realName =  $("#realname").val();
	                    		var displayName =  $("#displayname").val();
	                    		var email =  $("#email").val();
	                    		var sendMail =  $("#sendemail").prop('checked',);
	                    		var userRole =  $("#userrole").val();
	                        }
	                        else{
	                        $("#updateSuccess").modal({backdrop: 'static'});
	                        userIdSave = null;
	                        $('#table').empty();
	                        var table = '';
	                        $.each(record, function (i, item) {
	                        	var no = i+1;
	                        table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.username + '</td><td>' + item.realname + '</td><td>' + item.role_name + '</td>'
	                              +  '<td><button type="submit" id="btEditEm10" class="btn btn-block btn-sm btn-warning form-control" '
	                              +  'onclick="updateEm07('+item.id+',\''+item.username+'\', \''+item.password+'\',\''+ item.realname +'\',\''+item.displayname+'\', \''+item.email+'\','+ item.send_sumary_mail +','+item.user_role+')">'
	                              +  '<i class="fa fa-wrench"></i> แก้ไข </button></td><td><button type="submit" id="dtDeleteEm07" class="btn btn-block btn-sm btn-danger form-control"'
	                              +  'onclick="deleteEm07(\''+item.id+'\')">ลบบัญชีผู้ใช้</button></td></tr>';
	                        });
	                        $('#table').append(table);
	                        blockUIApp.hidePleaseWait();
	                        $("#em07CardSearch").show();
	                        $("#em07CardSave").hide();
	                        $("#headerFirst").show();
	                        $("#headerSecond").hide();
	                    	$("#usernameSearch").prop('disabled', false);
	                    	$("#userroleSearch").prop('disabled', false);
	                        }
	                    },
	                    failure : function(response) {
	                        console.info(response);
	                        $("#updateError").modal({backdrop: 'static'});
	                    	$("#em07CardSearch").hide();
	                        $("#headerFirst").hide();
	                        $("#headerSecond").show();
	                    	$("#usernameSearch").prop('disabled', true);
	                    	$("#userroleSearch").prop('disabled', true);
	                        blockUIApp.hidePleaseWait();
	                    }
	        });
	}
};

function deleteEm07(userId){
	userIdSave = userId;
	$("#dangerModalCheckedDelUserAdmin").modal({backdrop: 'static'});
};

function deleteUserEm07(){
		var params = {
				em07UserID : userIdSave
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			 method : 'POST',
			 data : params,
			 url : path+"em07deleteAdminUser",
             success : function(response) {
            	$('#table').empty();
            	var json = JSON.parse(response);
                var record = json.deleteAdminUser;
                searcharr = record;
                var table = '';
                $.each(record, function (i, item) {
                	var no = i+1;
                table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.username + '</td><td>' + item.realname + '</td><td>' + item.role_name + '</td>'
                      +  '<td><button type="submit" id="btEditEm10" class="btn btn-block btn-sm btn-warning form-control" '
                      +  'onclick="updateEm07('+item.id+'\',\''+item.username+'\', \''+item.password+'\',\''+ item.realname +'\',\''+item.displayname+'\', \''+item.email+'\','+ item.send_sumary_mail +','+item.user_role+')">'
                      +  '<i class="fa fa-wrench"></i> แก้ไข </button></td><td><button type="submit" id="dtDeleteEm07" class="btn btn-block btn-sm btn-danger form-control"'
                      +  'onclick="deleteEm07(\''+item.id+'\')">ลบบัญชีผู้ใช้</button></td></tr>';
                });
                $('#table').append(table);
                blockUIApp.hidePleaseWait();
                if(record.length >= 0){
    				$("#deleteSuccessEm07").modal({backdrop: 'static'});
    				$("#em07CardSearch").show();
	        	    $("#em07CardSave").hide();
	        	    $("#headerFirst").show();
	        	    $("#headerSecond").hide();
	        		$("#usernameSearch").prop('disabled', false);
	        		$("#userroleSearch").prop('disabled', false);
	        		userIdSave = null;
	        		$("#usernameSearch").val('');
	        		$("#userroleSearch").val("0");
    			}else{
    				$("#deleteErrorEm07").modal({backdrop: 'static'});
    			}
                collection = [];
                }
		 });
		 blockUIApp.hidePleaseWait();
		
};

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  searchEm07();
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
	comboBoxRoleSearch();
	comboBoxRole();
	$("#em07CardSearch").show();
    $("#em07CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};