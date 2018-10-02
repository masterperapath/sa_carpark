var path = null;
var username = null;

var usernameLogin = null;
var passwordLogin = null;

function searchEm19(){
	var groupidsh = $('#groupid').val();
	var groupnamesh = $('#groupname').val();
	var usernamesh = $('#username').val();
	var midsh = $('#mid').val();
	
	if(groupidsh == ''  && groupnamesh == '' && usernamesh == '' && midsh == ''){
		$("#dataSearchFail").modal({backdrop: 'static'});
	}else{
    var params = {
    		groupid : groupidsh,
    		groupname : groupnamesh,
    		username : usernamesh,
    		mid : midsh,
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em19Search",
                    success : function(response) {
                        var json = JSON.parse(response);
						var record = json.em19responseSearch.data;
						$('#tableId').empty();
                        var table = '';
						$.each(record, function(i, item) {	
											var no = i + 1;
											table += '<tr><td>'
													+ no
													+ '</td><td>'
													+ item.i_group_id
													+ '</td><td>'
													+ item.c_group_name
													+ '</td><td>'
													+ item.c_username
													+ '</td>'
													+ '<td> <button type="submit" id="login" class="btn btn-sm btn-success form-control" <i class="fa fa-sign-in"></i> <a href="'+ path +'eastlink.html?username='+ item.c_username +'" target="_blank" style="color:white"><b>Login</b></a>Login</button> </td>/<tr>';
										});
						table += '</tbody>'
						$('#tableId').append(table);
                        if(record.length == 0){
                            $("#dataNotFound").modal({backdrop: 'static'});
						} 
						$('#btSearchEm19').prop('disabled', false);
						 $('#groupid').prop('disabled', false);
						$('#groupname').prop('disabled', false);
						$('#username').prop('disabled', false);
						$('#mid').prop('disabled', false);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                    	$('#btSearchEm19').prop('disabled', false);
                        blockUIApp.hidePleaseWait();
                    }
        });
	}
};

function login() {
		blockUIApp.showPleaseWait();
		$.ajax({
			type : 'POST',
			host  : 'http://www.eye-fleet.com/east/formadminlogin.htm',
			data: $("#processlogin1").serialize(),
			dataType: 'json',
			success:  function (response) {
				var json = JSON.parse(response);
				var resp = json.em24response;
				var xhttp1 = new XMLHttpRequest();
				     xhttp1.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				    	console.log("------------ response ------------- "+response)
				    	$.ajax({
							type : 'POST',
							host  : 'http://www.eye-fleet.com/east/nimda.htm?act=flush_userprofile',
							data: $("#processlogin1").serialize(),
							dataType: 'json',
							cache: false,
							success:  function (response) {
								 var xhttp2 = new XMLHttpRequest();
								xhttp2.onreadystatechange = function() {
								    if(this.readyState == 4 && this.status == 200) {
								    	 xhttp2.open("GET", "/eyemin/em24.html", true);
								    	 xhttp2.send();
								    }
								  };
							},
							failure :  function (response) {
								alert("Error2");
								blockUIApp.hidePleaseWait();
							 }
						});
				    }
				  };
				  xhttp1.open("GET", "/em24.html", true);
				  xhttp1.send();
				alert(response);
				blockUIApp.hidePleaseWait();
			},
			failure :  function (response) {
				alert("Error1");
				blockUIApp.hidePleaseWait();
			 }
		});
};

function AjaxSucceeded(response) {
	alert("Success");
	blockUIApp.hidePleaseWait();
};

function AjaxFailed(response) {
    alert("Error");
	blockUIApp.hidePleaseWait();
};

function clearAllEm19(){
	var groupidsh = $('#groupid').val('');
	var groupnamesh = $('#groupname').val('');
	var usernamesh = $('#username').val('');
	var midsh = $('#mid').val('');
	$('#tableId').empty();
};

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		searchEm19()
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
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
