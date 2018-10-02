var path = null;
var collection = [];
var searcharr = null;
var groupIdSave = null;
var subgroupIdSave = null;
var usernameSave = null;
var groupnameSaveHeader = null;
var groupnameSaveDetail = null

var detialgroupid = null;
var detialsubgroupid = null;
var detialmid = null;
var detialusername = null;

var checkMidDup = null;
var index = null;

function add(){
	var em13MidSave = $("#em13MidSave").val();
	var records = {
	        'em13MidSave'   : em13MidSave ,
	        'groupIdSave'   : groupIdSave ,
	        'subgroupIdSave'   : subgroupIdSave,
	        'usernameSave' : usernameSave
	    };
	var params = {
			em13MidSave : em13MidSave
        };
	if(em13MidSave == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else{
	var arrmid = $.grep(collection, function(v) {
		return v.em13MidSave == em13MidSave;
	});
	var arrmiddtl = $.grep(searcharr, function(v) {
		return v.i_mid_id == em13MidSave;
	});
	if(arrmid.length == 0 && arrmiddtl.length == 0){
		 $.ajax({
             method : 'POST',
             data : params,
             url : path+"em13ValidateMID",
             success : function(response) {
                 var json = JSON.parse(response);
                 var record = json.em13ValidateMID;
                 $.each(record, function (i, item) {
                	 checkMidDup = item.middup
                 });
             if(checkMidDup > 0 ){
            	 collection.push(records);
            	 $("#btSaveEm13").prop('disabled', false);
            	 blockUIApp.showPleaseWait();
            	 index = collection.length-1
            	 var table= '';
            	 	 table += '<tr><td></td>'
            	 		 if(searcharr.length <= 0){
            	 	 table += '<td>' + groupnameSaveHeader + '</td>'
            	 		 }else{
            	 	 table += '<td>' + groupnameSaveDetail + '</td>'
            	 		 }
            	 	 table += '<td>' + usernameSave + '</td><td>' + em13MidSave + '</td><td></td>'
            		 	    + '<td><center><input type="button" class="btn btn-sm btn-block btn-warning" value=" ลบข้อมูลกล่อง " onClick="delCollection(\''+index+'\')"/></center></td></tr>';
            	 $('#tableNew').append(table);
            	 $("#em13MidSave").val('');
            	 blockUIApp.hidePleaseWait();
             }else{
            	 $("#midNotFound").modal({backdrop: 'static'});
            	 $("#em13MidSave").val('');
             }
            }
		});
	}else{
		$("#dangerDuplicateMID").modal({backdrop: 'static'});
		$("#em13MidSave").val('');
		}
	}
};

function delCollection(index){
	collection.splice(index, 1);
	
	 blockUIApp.showPleaseWait();
	 $('#tableNew').empty();
	 var table= '';
	 $.each(collection, function (i, item) {
	 	 table += '<tr><td></td>'
	 		if(searcharr.length <= 0){
	 	 table += '<td>' + groupnameSaveHeader + '</td>'
	 		}else{
	 	 table += '<td>' + groupnameSaveDetail + '</td>'
	 		}
	 	 table += '<td>' + item.usernameSave + '</td><td>' + item.em13MidSave + '</td><td></td>'
		 	   + '<td><center><input type="button" class="btn btn-sm btn-block btn-warning" value=" ลบข้อมูลกล่อง " onClick="delCollection(\''+ i +'\')"/></center></td></tr>';
	 });
	 $('#tableNew').append(table);
	 $("#em13MidSave").val('');
	 if(collection.length <= 0){
		 $("#btSaveEm13").prop('disabled', true);
	 }
	 blockUIApp.hidePleaseWait();
};

function searchEm13Header(){
		$("#em13CardSearch").show();
		$("#em13CardSave").hide();
		$('#table').empty();
		var em13GroupName = $("#em13GroupName").val();
		var em13Mid = $("#em13Mid").val();
		var em13Grpid = $("#em13Grpid").val();
		var em13username = $("#em13username").val();
		if(em13GroupName == "" && em13Mid == "" && em13Grpid == "" && em13username == ""){
			$("#dataSearchFail").modal({backdrop: 'static'});
		}else{
		var params = {
			em13GroupName : em13GroupName,
			em13Mid : em13Mid,
			em13Grpid : em13Grpid,
			em13username : em13username
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em13SearchSubGrpHeader",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.em13SearchSubGrpHeader;
                        var table = '';
                        $.each(record, function (i, item) {
                         groupnameSaveHeader = item.c_group_name;
                        	var no = i+1;
                        table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.groupidlpad + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td>'
                        		 + '<td><button type="submit" class="btn btn-sm btn-block btn-success form-control" onclick="addEm13(\''+item.i_subgrp_id+'\', \''+item.i_group_id+'\', \''+item.c_username+'\')"><i class="fa fa-share"></i> ดูข้อมูลกล่อง </button></td></tr>';
                        });
                        $('#table').append(table);
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

function searchEm13Detail(subgrpid,groupId,username){
	var params = {
			subgrpid : subgrpid,
			groupId : groupId,
			username : username
    };
			groupIdSave = groupId;
			subgroupIdSave = subgrpid;
			usernameSave = username;
	blockUIApp.showPleaseWait();
    $.ajax({
                method : 'POST',
                data : params,
                url : path+"em13SearchSubGrpDetail",
                success : function(response) {
                    var json = JSON.parse(response);
                    var record = json.em13SearchSubGrpDetail;
                    searcharr = record;
                    $('#tableadd').empty();
                    var table = '';
                    $.each(record, function (i, item) {
                    	groupnameSaveDetail = item.c_group_name;
                    	var no = i+1;
                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td><td>' + item.i_mid_id + '</td><td>' + item.c_plate_number + '</td>'
                    		 + '<td><center><input type="button" class="btn btn-sm btn-block btn-danger" value=" ลบข้อมูลกล่อง " onClick="btCancalReccord(\''+item.i_group_id+'\', \''+item.i_subgrp_id+'\', \''+item.i_mid_id+'\', \''+item.c_username+'\')"/></center></td></tr>';
                    });
                    $('#tableadd').append(table);
                    blockUIApp.hidePleaseWait();
                },
                failure : function(response) {
                    console.info(response);
                    blockUIApp.hidePleaseWait();
                }
          });
};

function addEm13(subgrpid,groupId,username){
	$("#em13CardSearch").hide();
	$("#em13CardSave").show();
	$("#btSaveEm13").prop('disabled', true);
	$("#headerFirst").hide();
    $("#headerSecond").show();
	groupIdSave = groupId;
	subGroupIdSave = subgrpid;
	usernameSave = username;
	$("#em13GroupName").prop('disabled', true);
	$("#em13Mid").prop('disabled', true);
	$("#em13Grpid").prop('disabled', true);
	$("#em13username").prop('disabled', true);
	$("#em13MidSave").val('');
	searchEm13Detail(subGroupIdSave, groupIdSave, usernameSave);
};

function saveEm13(){
		if(collection.length <= 0){
			$("#dangerDuplicateMID").modal({backdrop: 'static'});
		}else{
			blockUIApp.showPleaseWait();
			 $.ajax({
				 method : 'POST',
				 dataType: 'json',
				 contentType:'application/json',
				 url : path+"em13SaveSubGrp",
	             data : JSON.stringify(collection),
	             success : function(response) {
	             	 var json = JSON.parse(JSON.stringify(response));
	                 var record = json.em13SaveSubGrp;
	                 searcharr = record;
	                 $('#tableadd').empty();
	                 var table = '';
	                    $.each(record, function (i, item) {
	                    	groupIdSave = item.i_group_id;
	                    	subgroupIdSave = item.i_subgrp_id;
	                    	usernameSave = item.c_username;
	                    	var no = i+1;
	                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td><td>' + item.i_mid_id + '</td><td>' + item.c_plate_number + '</td>'
	                    		 + '<td><center><input type="button" class="btn btn-sm btn-block btn-danger" value=" ลบข้อมูลกล่อง " onClick="btCancalReccord(\''+item.i_group_id+'\', \''+item.i_subgrp_id+'\', \''+item.i_mid_id+'\', \''+item.c_username+'\')"/></center></td></tr>';
	                    });
	                    $('#tableadd').append(table);
	                    blockUIApp.hidePleaseWait();
	                    if(record.length > 0){
	        				$("#updateSuccess").modal({backdrop: 'static'});
	        				$("#btSaveEm13").prop('disabled', true);
	                    }else{
	        				$("#updateError").modal({backdrop: 'static'});
	        			}
	                    $('#tableNew').empty();
	                    collection = [];
	                },
	                failure : function(response) {
	                    console.info(response);
	                    blockUIApp.hidePleaseWait();
	                }
			 });
		}
}

function delEm13(){
	var params = {
			groupId : detialgroupid,
			subgrpid : detialsubgroupid,
			mid : detialmid,
			username : detialusername
    };
	blockUIApp.showPleaseWait();
    $.ajax({
                method : 'POST',
                data : params,
                url : path+"em13DeleteSubGrp",
                success : function(response) {
                	$('#tableadd').empty();
                    var json = JSON.parse(response);
                    var record = json.em13DeleteSubGrp;
                    searcharr = record;
                    var table = '';
                    $.each(record, function (i, item) {
                    	var no = i+1;
                    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.c_group_name + '</td><td>' + item.c_username + '</td><td>' + item.i_mid_id + '</td><td>' + item.c_plate_number + '</td>'
                    		 + '<td><center><input type="button" class="btn btn-sm btn-block btn-danger" value=" ลบข้อมูลกล่อง " onClick="btCancalReccord(\''+item.i_group_id+'\', \''+item.i_subgrp_id+'\', \''+item.i_mid_id+'\', \''+item.c_username+'\')"/></center></td></tr>';
                    });
                    $('#tableadd').append(table);
                    blockUIApp.hidePleaseWait();
                    if(record.length >= 0){
        				$("#deleteSuccess").modal({backdrop: 'static'});
        				$("#btSaveEm13").prop('disabled', true);
        			}else{
        				$("#deleteError").modal({backdrop: 'static'});
        			}
                    collection = [];
                },
                failure : function(response) {
                    console.info(response);
                    blockUIApp.hidePleaseWait();
                }
          });
};

function backEm13(){
    $("#em13CardSearch").show();
    $("#em13CardSave").hide();
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#em13GroupName").prop('disabled', false);
	$("#em13Mid").prop('disabled', false);
	$("#em13Grpid").prop('disabled', false);
	$("#em13username").prop('disabled', false);
	$('#tableNew').empty();
	collection = [];
};

function btCancalReccord(groupid, subgroupid, mid, username ){
	$("#dangerModalCheckedDelSubgroup").modal({backdrop: 'static'});
	detialgroupid = groupid;
	detialsubgroupid = subgroupid;
	detialmid = mid;
	detialusername = username;
}

function clearEm13(){
	$("#em13GroupName").val('');
	$("#em13Mid").val('');
	$("#em13Grpid").val('');
	$("#em13username").val('');
	$('#table').empty();
}

function validateDetail(evt) {
	  var theEvent = evt || window.event;
	  var key = theEvent.keyCode || theEvent.which;
	  key = String.fromCharCode( key );
	  var regex = /[0-9]/;
	  if( !regex.test(key) ) {
	    theEvent.returnValue = false;
	    if(theEvent.preventDefault) theEvent.preventDefault();
	    add();
	  }
}; 

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  searchEm13Header();
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
	$("#em13CardSearch").show();
	$("#em13CardSave").hide();
	$("#headerSecond").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};