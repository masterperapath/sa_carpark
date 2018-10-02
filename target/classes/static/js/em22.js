var path = null;
var collection = [];

function search() {
	var mid = $("#midSearch").val();
	$("#tableId").empty();
	if (mid == "") {
		$("#dangerModal").modal({
			backdrop : 'static'
		});
	} else {
		var params = {
			mid : mid,
		};
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'POST',
			data : params,
			url : path + "searchEM22",
			success : function(response) {
				$("#tableIdSearch").empty();
				var json = JSON.parse(response);
				var record = json.em22MonitorTech;
				var table = '';
				$.each(record.data, function(i, item) {
					var no = i + 1;
					table += '<tr><td <td style="text-align: center">' + no + '</td><td>' + item.mid + '</td>'
							+ '<td>' + item.command + '</td><td>' + item.status
							+ '</td><td>' + item.create_date + '</td></tr>';
				});
				$('#tableIdSearch').append(table);
				if ((record.data).length == 0) {
					$("#dataNotFound").modal({
						backdrop : 'static'
					});
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

function addMoveEm22() {
	$('#showSearch').hide();
	$('#showBodySearch').hide();
	$('#showTableSearch').hide();
	$('#showheaderAdd').show();
	$('#showBodyAdd').show();
	$('#showTableAdd').show();
	$('#btSaveEm22').prop('disabled', true)
};

function addEm22() {
	var mid = $("#midAdd").val();
	var command = $("#commandAdd").val();
	if (mid == "" || command == "") {
		$("#dangerData").modal({backdrop : 'static'});
	} else {
		var records = {
		        'midEm22'     : mid,
		        'commandEm22' : command
		    }
		if(mid == "" || command == ""){
			$("#dangerData").modal({backdrop: 'static'});
		}else{
		var arrmid = $.grep(collection, function(v) {
			return v.midEm22 == mid;
		});
		var arrcommand = $.grep(collection, function(v) {
			return v.commandEm22 == command;
		});
		if(arrmid.length > 0 && arrcommand.length > 0){
				$("#dangerDuplicateCommandEm22").modal({backdrop: 'static'});
		}
		else{
			collection.push(records);
			$('#btSaveEm22').prop('disabled', false)
			blockUIApp.showPleaseWait();
			$("#tableIdAdd").empty();
			var table = '';
	        $.each(collection, function (i, item) {
	        		var no = i + 1;
	        	    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.midEm22 + '</td><td>' + item.commandEm22 + '</td>'
	        	    	  + '<td><center><input type="button" class="btn btn-block btn-danger" value="ลบข้อมูล " onClick="delem22(\''+i+'\')"/></center></td></tr>';
	        });
	        $('#tableIdAdd').append(table);
	        $("#midAdd").val('');
	        $("#commandAdd").val('');
	        blockUIApp.hidePleaseWait();
		}
	  }
	}
};

function delem22(i){
	collection.splice(i, 1);
	
	blockUIApp.showPleaseWait();
	$("#tableIdAdd").empty();
	var table = '';
    $.each(collection, function (i, item) {
    		var no = i + 1;
    		table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.midEm22 + '</td><td>' + item.commandEm22 + '</td>'
	    	  + '<td><input type="button" class="btn btn-block btn-danger" value="ลบข้อมูล " onClick="delem22(\''+i+'\')"/></td></tr>';
    });
    $(table).height();
    if(table == "") {
    	$("#btSaveEm22").prop('disabled', true);
    }else{
    	$("#btSaveEm22").prop('disabled', false);
    }
    $('#tableIdAdd').append(table);
    blockUIApp.hidePleaseWait();
};

function saveEm22(){
	var checkMIDDev = null;
	if(collection.length <= 0){
		$("#dangerDuplicateCommandEm22").modal({backdrop: 'static'});
	}else{
		blockUIApp.showPleaseWait();
		 $.ajax({
			 method : 'POST',
			 dataType: 'json',
			 contentType:'application/json',
			 url : path+"saveNewBoxEm22",
             data : JSON.stringify(collection),
             success : function(response) {
             	 var json = JSON.parse(JSON.stringify(response));
                 var record = json.saveNewBoxEm22;
                 checkMIDDev = record.checkmid;
                 if(checkMIDDev == 1){
                	 checkMIDDev = null;
                	 $("#midDupModal").modal({backdrop: 'static'});
                	    $("#tableIdAdd").empty();
                	    collection = [];
                 }else{
                	 checkMIDDev = null;
                	 $("#updateSuccess").modal({backdrop: 'static'});
                	 back();
                	 clearval();
                 }
               }
		 });
		 blockUIApp.hidePleaseWait();
	}
};

function clearval(){
	$("#midSearch").val('');
	$("#tableIdSearch").empty();
	collection = [];
};

function back(){
	$('#midAdd').val('');
	$('#commandAdd').val('');
	$("#tableIdAdd").empty();
	$('#showSearch').show();
	$('#showBodySearch').show();
	$('#showTableSearch').show();
	$('#showheaderAdd').hide();
	$('#showBodyAdd').hide();
	$('#showTableAdd').hide();
	collection = [];
};

function keyenter(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		search();
	}
};

function keyenterAdd(evt) {
	if (evt.keyCode == 13 || evt.which == 13) {
		addEm22();
	}
};

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
function getCsrf() {

	if (Cookies.get(tokenCsrf) == undefined || Cookies.get(tokenCsrf) == null
			|| Cookies.get(tokenCsrf) == ''
			|| Cookies.get(tokenCsrf) == 'undefined') {
		blockUIApp.showPleaseWait();
		$.ajax({
			method : 'GET',
			url : path + "csrf",
			success : function(response) {
				var json = JSON.parse(response);

				$.ajaxSetup({
					beforeSend : function(xhr) {
						xhr.setRequestHeader(headerCsrf, json.token);
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
			beforeSend : function(xhr) {
				xhr.setRequestHeader(headerCsrf, Cookies.get(tokenCsrf));
			}
		});
	}
};

$(document).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
	$('#showheaderAdd').hide();
	$('#showBodyAdd').hide();
	$('#showTableAdd').hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};