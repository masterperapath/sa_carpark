var path = null;
function search(){
    	var params = {
    		groupId : $("#groupname").val()
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em20Search",
                    success : function(response) {
                    	$("#tableId").empty();
                        var json = JSON.parse(response);
                        var record = json.search.data.listFile;
                        var arrayRecord = record.split(",");
                        var table = '';
                        $.each(arrayRecord, function (i, item) {
                        		var no = i+1;
                        	    	  if(item == ""){
                        	    		  
                        	    	  }else{
                        	    		  table += '<tr><td>' + no + '</td>'
                                  	       		+ '<td>' + item + '</td>'
                                  	      		+ '<td><a href="' + path + 'em20Download?fileName='+ item +'" target="_blank">'
                                  	      		+ '<button type="button" id="btDownLoad"class="btn btn-block btn-sm btn-success form-control">'
                                  	      		+ '<i class="fa fa-download"></i> ดาวน์โหลดรายงาน </button></a></td>'
                                  	      		+ '</tr>';
                        	    	  }

                        });
                        $('#tableId').append(table);
                        if (record.length == 0) {
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

function comboboxgroup(){
    var params = {};
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em20ComboboxGroup",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.combobox.data;
                        var option = '';
                        $.each(record, function (i, item) {
                        	option += '<option value ="' + item.i_group_id + '">' +  item.c_group_name  + '</option>';
                        });
                        $('#groupname').append(option);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
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
	comboboxgroup();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};