var path = null;
var collection = [];

function add(){
	var mid = $("#mid").val();
	var model = $("#model").val();
	var imei = $("#imei").val();
	if(mid == "" || model == "" || imei == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}else{
		var records = {
		        'mid'   : mid,
		        'model' : model,
		        'imei' : imei
		    }
		if(mid == "" || imei == ""){
			$("#dangerModalBox").modal({backdrop: 'static'});
		}else{
		var arrmid = $.grep(collection, function(v) {
			return v.mid == mid;
		});
		var arrimei = $.grep(collection, function(v) {
			return v.imei == imei;
		});
		if(arrmid.length == 0 && arrimei.length == 0){
			collection.push(records);
			$("#btSubmit").prop('disabled', false);
			blockUIApp.showPleaseWait();
			$("#tableId").empty();
			var table = '';
	        $.each(collection, function (i, item) {
	        	    table += '<tr><td>' + item.mid + '</td><td>' + item.model + '</td><td>' + item.imei + '</td>'
	        	    	  + '<td><center><input type="button" class="btn btn-danger" value="ลบข้อมูล " onClick="delem09(\''+i+'\')"/></center></td></tr>';;
	        });
	        $('#tableId').append(table);
	        $("#mid").val('');
	        $("#imei").val('');
	        blockUIApp.hidePleaseWait();
		}else{
			$("#dangerDuplicateMIDEm09").modal({backdrop: 'static'});
		}
	  }
	}
}

function save(){
	var success = null;
	if(collection.length <= 0){
		$("#dangerDuplicateMIDEm09").modal({backdrop: 'static'});
	}else{
		blockUIApp.showPleaseWait();
		 $.ajax({
			 method : 'POST',
			 dataType: 'json',
			 contentType:'application/json',
			 url : path+"saveNewBox",
             data : JSON.stringify(collection),
             success : function(response) {
             	 var json = JSON.parse(JSON.stringify(response));
                 var record = json.saveNewBox;
                 if(record.success == 1){
                	 $("#updateSuccess").modal({backdrop: 'static'});
                	 clearval();
                	 $("#btSubmit").prop('disabled', true);
                 }else{
                	 $("#dangerDuplicateMIDEm09").modal({backdrop: 'static'});
                	    $("#tableId").empty();
                	    collection = [];
                		$('#model').val('T333');
                   	 $("#btSubmit").prop('disabled', true);
                 }
               }
		 });
		 blockUIApp.hidePleaseWait();
	}
}

function delem09(i){
	collection.splice(i, 1);
	
	blockUIApp.showPleaseWait();
	$("#tableId").empty();
	var table = '';
    $.each(collection, function (i, item) {
    	table += '<tr><td>' + item.mid + '</td><td>' + item.model + '</td><td>' + item.imei + '</td>'
    	    	  + '<td><center><input type="button" class="btn btn-danger" value="ลบข้อมูล " onClick="delem09(\''+i+'\')"/></center></td></tr>';;
    });
    $(table).height();
    if(table == "") {
    	$("#btSubmit").prop('disabled', true);
    }else{
    	$("#btSubmit").prop('disabled', false);
    }
    $('#tableId').append(table);
    $("#mid").val('');
    $("#imei").val('');
    blockUIApp.hidePleaseWait();
};

function clearval(){
	$("#mid").val('');
	$("#model").val('T333');
	$("#imei").val('');
	$("#tableId").empty();
	$("#btSubmit").prop('disabled', true);
	collection = [];
}

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  add();
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
	$("#btSubmit").prop('disabled', true);
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};