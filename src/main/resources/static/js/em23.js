var path = null;

function reloadEm23(){

	blockUIApp.showPleaseWait();
    	$.ajax({
	    	method : 'POST',
	        url : path+"em23ReloadConfig",
	        success : function(response) {
	        	var json = JSON.parse(response);
	        	if(json.response == 200){
	        		$("#reloadSuccessEm23").modal({backdrop: 'static'});
	        	}else{
	        		$("#reloadErrorEm23").modal({backdrop: 'static'});
	        	}
	       blockUIApp.hidePleaseWait();
        },
        	failure : function(response) {
		        console.info(response);
		        blockUIApp.hidePleaseWait();
		        $("#reloadErrorEm23").modal({backdrop: 'static'});
        }
    });
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
