var path = null;
function search(){
	var company = $("#company").val();
	var carcode = $("#carcode").val();
	var carname = $("#carname").val();
	var type = $("#type").val();
	var mid = $("#mid").val();
	var uservin = $("#uservin").val();

    var params = {
            company : company,
            carcode : carcode,
            carname : carname,
            type : type,
            mid : mid,
            uservin : uservin
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchEyeminStatus",
                    success : function(response) {
                    	$("#tableId").empty();
                        var json = JSON.parse(response);
                        var record = json.eyeMinStatus;
                        var table = '';
                        $.each(record, function (i, item) {
                        	var no = i+1;
                        	    table += '<tr><td>' + no + '</td><td>' + item.i_mid_id + '</td><td>' + item.c_plate_number + '</td><td>' + item.c_car_code + '</td><td>' + item.ts_acc_on + '</td><td>' + item.ts_acc_off + '</td><td>' + item.ts_power_cut + '</td><td>' + item.ts_no_satellite + '</td></tr>';
                        });
                        $('#tableId').append(table);
                        if(record.length == 0){
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

function clearval(){
	$("#company").val('');
	$("#carcode").val('');
	$("#carname").val('');
	$("#type").val('');
	$("#mid").val('');
	$("#uservin").val('');
	$("#tableId").empty();
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
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};