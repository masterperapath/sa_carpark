var path = null;


var tokenJWT = 'X-JWT-TOKEN';
function login(){
	var username = $('#username').val();
	var password = $('#password').val();
	if(username == "" || password == ""){
		$("#dangerModallogin").modal({backdrop: 'static'});
	}else{
    var params = {
    		username : username,
    		password : password
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"login",
                    success : function(response) {
                        var json = JSON.parse(response);
                        
                        if (json.error){
                        	$("#loginFailModal").modal({backdrop: 'static'});
                        } else {
                        	Cookies.set(tokenJWT, json.access_token);
                        	window.location.href = path+"maineye.html";
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

function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
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

window.onload = function() {
	path = contextRoot;
	getCsrf();
}

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  login();
	  }
};

