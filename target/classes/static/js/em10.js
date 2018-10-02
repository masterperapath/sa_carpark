var path = null;
var groupIdSave = null;
function searchEm10(){
	    $("#em10CardSearch").show();
	    $("#em10CardSave").hide();
	    $('#table').empty();
	    groupname =  $("#groupname").val();
	    groupid =  $("#groupIdSearch").val();
		if(groupname == "" && groupid == ""){
			$("#groupModal").modal({backdrop: 'static'});
		}else{
		var params = {
			groupname : groupname,
			groupid : groupid
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchEm10",
                    success : function(response) {
                		var json = JSON.parse(response);
                        var record = json.searchGroup.data;
                        var table = '';
                        $.each(record, function (i, item) {
                        	var no = i+1;
                        table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.groupidlpad + '</td><td>' + item.c_group_name + '</td><td>' + item.c_comment + '</td>'
                              +  '<td><button type="submit" id="btEditEm10" class="btn btn-block btn-sm btn-warning form-control" onclick="updateEm10(\''+item.c_group_name+'\', \''+item.c_comment+'\','+ item.i_group_id +')"> <i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
                        });
                        $('#table').append(table);
                        if (table == ""){
                        	$("#dataNotFound").modal({backdrop: 'static'});
                        	clearEm10();
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

function addEm10(){
    $("#em10CardSearch").hide();
    $("#em10CardSave").show();
    $("#headerSaveFirst").show();
    $("#headerSaveSecond").hide();
    $("#headerFirst").hide();
    $("#headerSecond").show();
	$("#groupname").prop('disabled', true);
	$("#groupIdSearch").prop('disabled', true);
	clearEm10();
};

function updateEm10(groupname, comment, groupId){
    $("#em10CardSearch").hide();
    $("#em10CardSave").show();
    $("#headerSaveFirst").hide();
    $("#headerSaveSecond").show();
    $("#headerFirst").hide();
    $("#headerSecond").show();
    groupIdSave = groupId;
	$("#GroupnameUP").val(groupname);
	$("#CommentUP").val(comment);
	$("#groupname").prop('disabled', true);
	$("#groupIdSearch").prop('disabled', true);
};

function backEm10(){
    $("#em10CardSearch").show();
    $("#em10CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#groupname").prop('disabled', false);
	$("#groupIdSearch").prop('disabled', false);
};

function saveEm10(){
		var groupnameUp = $("#GroupnameUP").val();
		var commentUp = $("#CommentUP").val();
		var groupIdUp = groupIdSave;
	    if(groupnameUp == ""){
	    	$("#groupModal").modal({backdrop: 'static'});
	    }
	    else{
	    	var params = {
	    			groupnameUp : groupnameUp,
	    			commentUp   : commentUp,
	    			groupIdUp   : groupIdUp
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"updateEm10",
	                    success : function(response) {
	                    	backEm10();
	                    	clearEm10();
	                        var json = JSON.parse(response);
	                        var record = json.updateGroup.data;
	                        var table = '';
	                        $("#updateSuccess").modal({backdrop: 'static'});
	                        $.each(record, function (i, item) {
	                        	var no = i+1;
	                        table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.groupidlpad + '</td><td>' + item.c_group_name + '</td><td>' + item.c_comment + '</td>'
	                              +  '<td><button type="submit" id="btEditEm10" class="btn btn-block btn-sm btn-warning form-control" onclick="updateEm10(\''+item.c_group_name+'\', \''+item.c_comment+'\','+ item.i_group_id +')"> <i class="fa fa-wrench"></i> แก้ไข </button></td></tr>';
	                        });
							$('#table').append(table);
	                        blockUIApp.hidePleaseWait();
	                		groupIdSave = null;
	                    },
	                    failure : function(response) {
	                        console.info(response);
	                        $("#updateError").modal({backdrop: 'static'});
	                        updateEm10(groupnameUp, commentUp, groupIdUp);
	                        blockUIApp.hidePleaseWait();
	                    }
	        });
	}
};

function clearEm10(){
	$('#groupname').val('');
	$('#groupIdSearch').val('');
	$('#table').empty();
	$("#GroupnameUP").val('');
	$("#CommentUP").val('');
	groupIdSave = null;
};

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  searchEm10();
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
    $("#em10CardSearch").show();
    $("#em10CardSave").hide();
    $("#headerSecond").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
