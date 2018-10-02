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
                    url : path+"searchStatus",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.statusUser;
                        $('#statususer').prop('checked',false);
                        $('#statusdlt').prop('checked',false);
                        
                        $.each(record, function (i, item) {
                        $('#statususer').prop('checked',item.b_overdue_fees);
                        $('#statusdlt').prop('checked',item.b_hide_from_dlt);
                        });
                        if(record.length > 0){
                        	$("#statususer").prop('disabled', false);
                        	$("#statusdlt").prop('disabled', false);	
                        }else{
                        	$("#statususer").prop('disabled', true);
                        	$("#statusdlt").prop('disabled', true);		
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

function update(){
	var mid = $("#mid").val();
	var statususer = $("#statususer").is(':checked');
	var statusdlt = $("#statusdlt").is(':checked');
	if(mid == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else{
//		if(speed != "" && speed > 0){
	    var params = {
	    		mid : mid,
	    		statususer : statususer,
	    		statusdlt : statusdlt
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"updateStatus",
	                    success : function(response) {
	                    	var json = JSON.parse(response);
	                        var record = json.updateStatus;
	                        $('#statususer').prop('checked',false);
	                        $('#statusdlt').prop('checked',false);
	                        $.each(record, function (i, item) {

	                            $('#statususer').prop('checked',item.b_overdue_fees);
	                            $('#statusdlt').prop('checked',item.b_hide_from_dlt);
	                            });
	                        blockUIApp.hidePleaseWait();
	                        if(record.length > 0){
	                        	$("#updateSuccess").modal({backdrop: 'static'});
	                        	$("#statususer").prop('disabled', true);
	                        	$("#statusdlt").prop('disabled', true);
	                        	
	                        	$('#statususer').prop('checked',false);
	                        	$('#statusdlt').prop('checked',false);
	                        	$('#mid').val('');
	                        }else{
	                        	$("#updateError").modal({backdrop: 'static'});
	                        	$("#statususer").prop('disabled', true);
	                        	$("#statusdlt").prop('disabled', true);
	                        	
	                        	$('#statususer').prop('checked',false);
	                        	$('#statusdlt').prop('checked',false);
	                        	$('#mid').val('');
	                        }
	                    },
	                    failure : function(response) {
	                    	blockUIApp.hidePleaseWait();
	                    	$("#updateError").modal({backdrop: 'static'});
	                        console.info(response);
	                    }
	        });
//		}else{
//			$("#statSpeedModal").modal({backdrop: 'static'});
//		}
	}
}

function clearAll(){
	var mid = $("#mid").val('');
	var statususer = $("#statususer").prop('checked',false);
	var statusdlt = $("#statusdlt").prop('checked',false);
}

function keyenter(evt) {
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
	$("#status").prop('disabled', true);
	$("#speed").prop('disabled', true);
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
