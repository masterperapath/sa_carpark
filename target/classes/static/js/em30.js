var path = null;
var ps = null;

function searchEm30(){
	$("#em30CardSearch").show();
	$("#em30CardSave").hide();
	$('#table').empty();
	username =  $("#username").val();
	groupname =  $("#groupname").val();
	if(username == "" && groupname == ""){
		$("#groupUserModal").modal({backdrop: 'static'});
	}
	else{
	var params = {
			username : username,
			groupname : groupname};
	blockUIApp.showPleaseWait();
    $.ajax({
                method : 'POST',
                data : params,
                url : path+"searchEm30",
                success : function(response) {
                	var json = JSON.parse(response);
            		console.info(json)
                    var record = json.searchUser.data;
                    console.info(record)
                    var table = '';
                    $.each(record, function (i, item) {
                    	console.info(i);
                    	console.info(item);
                    	var no = i+1;
                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.i_group_id + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td>'
                          +  '<td><button type="submit" id="btEditEm30" class="btn btn-block btn-sm btn-warning form-control" onclick="updateEm30(\''+item.c_username+'\', \''+item.c_password+'\','+ item.i_group_id +')"> <i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
                    });
                    $('#table').append(table);
                    if (table == ""){
                    	$("#dataNotFound").modal({backdrop: 'static'});
                    	clearEm30();
                    }
            	    blockUIApp.hidePleaseWait();
                },
                failure : function(response) {
                    console.info(response); 
                    blockUIApp.hidePleaseWait();  
                }
          });
	}
}

function updateEm30(username, password, groupId){
    $("#em30CardSearch").hide();
    $("#em30CardSave").show();
    $("#headerSaveFirst").hide();
    $("#headerSaveSecond").show();
    $("#headerFirst").hide();
    $("#headerSecond").show();
    ps = password;
	$("#usernameUP").val(username).prop('disabled', true);
	$("#passwordOld").val(password).prop('disabled', true);
	$("#groupname").prop('disabled', true);
	$("#username").prop('disabled', true);
	$("#btSearchSecEm30").prop('disabled', true);
};

function backEm30(){
    $("#em30CardSearch").show();
    $("#em30CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#groupname").prop('disabled', false);
	$("#username").prop('disabled', false);
	$("#btSearchSecEm30").prop('disabled', false);
	$("#passwordNew").val('');
	$("#confirmpass").val('');
	
};

function saveEm30(){
	var usernameUP = $("#usernameUP").val();
	var passwordOld = $("#passwordOld").val();
	var passwordNew = $("#passwordNew").val();
	var confirmpass = $("#confirmpass").val();
	var passwordBD = ps; 
	if(confirmpass == "" || passwordNew == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else {
		if(passwordNew.length < 4){
			$("#checkLength").modal({backdrop: 'static'});
		}else{
	if(passwordNew != confirmpass ){
			$("#passwordFailModal").modal({backdrop: 'static'});
		}else{
		var params = {
				usernameUP : usernameUP,
				passwordNew : passwordNew,
				};
		blockUIApp.showPleaseWait();
	    $.ajax({
	                method : 'POST',
	                data : params,
	                url : path+"updateEm30",
	                success : function(response) {
	                	backEm30();
                    	clearEm30();
	                	var json = JSON.parse(response);
	                    var record = json.Em30UpdateBox.data;
	                    var table = '';
	                    $("#updatePasswordSuccess").modal({backdrop: 'static'});
	                    $.each(record, function (i, item) {
	                    	var no = i+1;
	                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.i_group_id + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td>'
	                          +  '<td><button type="submit" id="btEditEm30" class="btn btn-block btn-sm btn-warning form-control" onclick="updateEm30(\''+item.c_username+'\', \''+item.c_password+'\','+ item.i_group_id +')"> <i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
	                    });
	                    $('#table').append(table);
	                    blockUIApp.hidePleaseWait();
	                    ps = null;
	            	    blockUIApp.hidePleaseWait();
	                },
	                failure : function(response) {
	                    console.info(response);
	                    $("#updateError").modal({backdrop: 'static'});
	                    updateEm30(username, password, groupId)
	                    blockUIApp.hidePleaseWait();
	                }
	          });
		}
	}
	}
}

function clearEm30(){
	$('#groupname').val('');
	$('#username').val('');
	$('#table').empty();
	$("#usernameUP").val('');
	$("#passwordOld").val('');
	$("#passwordNew").val('');
	$("#confirmpass").val('');
	ps = null;
};

function clearSecEm30(){
	backEm30()
	$('#groupname').val('');
	$('#username').val('');
	$("#passwordNew").val('');
	$("#confirmpass").val('');
	$('#table').empty();
	ps = null;
};

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  searchEm30();
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
    $("#em30CardSearch").show();
    $("#em30CardSave").hide();
    $("#headerSecond").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
