var path = null;

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
var tokenJWT = 'X-JWT-TOKEN';

function add(){
	var vid = 48;
	var params = {
		vid : vid
	};
	blockUIApp.showPleaseWait();
	  $.ajax({
	        method : 'POST',
	        data : params,
	        url : path+"postgpsdatatodlt",
	        success : function(response) {
	            var json = JSON.parse(response);
	            	if(json.response == null){
	            		$("#dataFailEm14").modal({backdrop: 'static'});
	            	}else if(json.response.code == 1){
	            		 
	            		$('#tableData').empty();
	                     var table = '';
	                     $.each(json.postGpsDataToDlt.data, function (i, item) {
                         table += '<tr><td>' + item.mid + '</td><td>' + item.unit_id + '</td><td>' + item.vehicle_id + '</td><td>'
                         + item.vehicle_type + '</td><td>' + item.vehicle_chassis_no + '</td><td>' + item.card_reader + '</td><td>'
                         + item.province_code + '</td><td>' + item.vehicle_register_type + '</td>/<tr>';
	                     });
	                     
                         table += '</tbody>'
	                     $('#tableData').append(table);
	            		
	            		$("#dataSuccessEm14").modal({backdrop: 'static'});
	            	}else{
	            		$("#failEm14").modal({backdrop: 'static'});
	            	}
	            blockUIApp.hidePleaseWait();
	        },
	        failure : function(response) {
	            console.info(response);
	            blockUIApp.hidePleaseWait();
	            $("#dataFailEm14").modal({backdrop: 'static'});
	        }
	  });
};

function deletedata(){
	var vid = 48;
	var unitid = $("#unitid").val();
	if(unitid == ""){
		$("#dangerRequireUnitId").modal({backdrop: 'static'});
	}else{
		var params = {
				vid : vid,
	    		unitid : unitid
	        }
		blockUIApp.showPleaseWait();
		 $.ajax({
			 method : 'POST',
             data : params,
             url : path+"deletegpsdatadlt",
             success : function(response) {
 	            var json = JSON.parse(response);
		 	        if(json.response.code == 1){
		           		$("#deleteSuccessEm14").modal({backdrop: 'static'});
		           	}else if (json.response.code == 0 && json.response.message == 'Delete no data'){
		           		$("#deleteFailEm14").modal({backdrop: 'static'});
		           	}else{
		           		$("#failEm14").modal({backdrop: 'static'});
		           	}
 	            blockUIApp.hidePleaseWait();
 	        },
 	        failure : function(response) {
 	        	$("#deleteFailEm14").modal({backdrop: 'static'});
 	            blockUIApp.hidePleaseWait();
 	        }
		 });
		blockUIApp.hidePleaseWait();
	}
};

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

function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};