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
													+ '<td> <button type="submit" id="login" class="btn btn-sm btn-success form-control" <i class="fa fa-sign-in">  </i> <a href="'+ path +'eastlink.html?username='+ item.c_username +'" target="_blank" style="color:white"><b>Login</b></a> </button> </td>/<tr>';
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
