var path = null;
function search(){
	var mid = $("#mid").val();
	if(mid == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else{
    var params = {
    		mid : mid,
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchEm16",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.searchShipment;
                        $("#statusdlt").prop('checked',false);
                        $.each(record, function (i, item) {
                        $("#statusdlt").prop('checked',!item.b_hide_from_dlt);
                        });
                        if(record.length > 0){
                        	$("#statusdlt").prop('disabled', false);
                        	$("#btEdit").prop('disabled', false);
                        	$("#mid").prop('disabled', true);
                        	$("#btSubmit").prop('disabled', true);
                        }else{
                        	$("#statusdlt").prop('disabled', true);
                        	$("#btEdit").prop('disabled', true);
                        	$("#mid").prop('disabled', false);
                        	$("#btSubmit").prop('disabled', false);
                        	$("#dataNotFound").modal({backdrop: 'static'});                      	
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

function clearVal(){
	$("#mid").val('');
	$("#statusdlt").prop('checked', false);
	$("#mid").prop('disabled', false);
	$("#statusdlt").prop('disabled', true);
	$("#btEdit").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);
}

function update(){
	var mid = $("#mid").val();
	var statusdlt = $("#statusdlt").is(':checked');
	if(mid == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else{
	    var params = {
	    		mid : mid,
	    		statusdlt : !statusdlt
	        };
	    console.log(status);
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"updateEm16",
	                    success : function(response) {
	                    	var json = JSON.parse(response);
	                        var record = json.updateShipment;
	                    	$("#statusdlt").val('false');
	                        $.each(record, function (i, item) {
	                            $( "#statusdlt").prop('checked', item.b_hide_from_dlt);
	                            });
	                        blockUIApp.hidePleaseWait();
	                        if(record.length > 0){
	                        	$("#updateSuccess").modal({backdrop: 'static'});
	                        	$('#mid').val();
	                        	$("#statusdlt").prop('disabled', true);
	                        	$("#btEdit").prop('disabled', true);
	                        	$("#btSubmit").prop('disabled', false);
	                        	$("#mid").prop('disabled', false);          	
	                        	$("#statusdlt").prop('checked',false);
	                        }else{
	                        	$("#updateError").modal({backdrop: 'static'});
	                        	$("#statusdlt").prop('disabled', true);
	                        	$("#btEdit").prop('disabled', true);
	                        	$("#btSubmit").prop('disabled', false);
	                        	$("#mid").prop('disabled', false);                       	
	                        	$("#statusdlt").prop('checked',false);
	                        }
	                    },
	                    failure : function(response) {
	                    	blockUIApp.hidePleaseWait();
	                    	$("#updateError").modal({backdrop: 'static'});
	                        console.info(response);
	                    }
	        });
	}
}

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		search();
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
	$("#statusdlt").prop('disabled', true);
	$("#btEdit").prop('disabled', true);
	$("#btSubmit").prop('disabled', false);
	$("#mid").prop('disabled', false);
});


var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
