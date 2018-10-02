var path = null;
var checkMIDDup = null;
function search(){
	var mid = $("#mid").val();
	$("#tableId").empty();
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
                    url : path+"searchcommand",
                    success : function(response) {
                    	$("#tableId").empty();
                        var json = JSON.parse(response);
                        var record = json.searchCommandLive;
                        var table = '';
                        $.each(record, function (i, item) {
                        	var no = i+1;
                        	    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.mid + '</td>'
                        			  + '<td>' + item.command + '</td><td>' + item.status + '</td><td>' + item.create_date + '</td></tr>';
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
};

function save(){
	var mid = $("#mid").val();
	var command = $("#command").val();
	if(mid == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else{
		var params = {
            mid : mid,
            command : command
        };
		blockUIApp.showPleaseWait();
	$.ajax({
        method : 'POST',
        data : params,
        url : path+"savecommand",
        success : function(response) {
        	$("#tableId").empty();
            var json = JSON.parse(response);
            var record = json.saveCommandLive;
            $.each(record, function (i, item) {
            	checkMIDDup = item.checkmid;
            });
            if(checkMIDDup == 1){
            	checkMIDDup = null;
            	blockUIApp.hidePleaseWait();
				$("#midDupModal").modal({backdrop : 'static'});	
            	
            }else{
            	var table = '';
                $("#updateSuccess").modal({backdrop: 'static'});
                $.each(record, function (i, item) {
                    var no = i+1;
                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.mid + '</td>'
      			          + '<td>' + item.command + '</td><td>' + item.status + '</td><td>' + item.create_date + '</td></tr>';
                });
                $('#tableId').append(table);
                $("#command").val('0')
                blockUIApp.hidePleaseWait();
            }
        },
        failure : function(response) {
            console.info(response);
            $("#updateError").modal({backdrop: 'static'});
            blockUIApp.hidePleaseWait();
        }
	  });
	}
};

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