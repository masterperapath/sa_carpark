var path = null;
var group_id = null;
var user_id = null;
var groupidUpdate = null;
var useridUpdate = null;

var checkupdateUser = null;

function search(){
	if ($('#companyid').val() == '' && $('#company').val() == '' && $('#username').val() == '' && $('#midsearch').val() == ''){
		$('#dataSearchFail').modal({backdrop: 'static'});
	} else {
		var params = {
				groupid : $('#companyid').val(),
	            company : $('#company').val(),
	            username : $('#username').val(),
	            mid : $('#midsearch').val()
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"em12SearchUser",
	                    success : function(response) {
	                    	$("#tableId").empty();
	                        var json = JSON.parse(response);
	                        var record = json.em12SelectUser;
	                        var table = '';
	                        $.each(record, function (i, item) {
	                        	var no = i+1;
	                        	    table += '<tr><td style="text-align: center">' + no + '</td><td>' + item.groupid + '</td><td>' + item.c_group_name +  '</td><td>' + item.i_subgrp_id +  '</td><td>' + item.c_username + '</td><td><button type="submit" class="btn btn-block btn-sm btn-success form-control" onclick="movebox(\''+ item.i_group_id +'\',\''+ item.i_user_id +'\')"> <i class="fa fa-share"></i> ย้าย </button></td></tr>';
	                        });
	                        $('#tableId').append(table);
	                        if(record.length == 0){
	                            $('#dataNotFound').modal({backdrop: 'static'});
	                           }
	                        blockUIApp.hidePleaseWait();
	                    },
	                    failure : function(response) {
	                        console.info(response);
	                        blockUIApp.hidePleaseWait();
	                    }
	        });
	}
}

function movebox(i_group_id, i_user_id){
	$('#company').prop('disabled', true);
	$('#companyid').prop('disabled', true);
	$('#username').prop('disabled', true);
	$('#midsearch').prop('disabled', true);
	$('#editbox').show();
	$('#bodyStatus').hide();
	$('#btSearchEm12').hide();
	$('#btClear').hide();
	groupidUpdate = i_group_id;
	useridUpdate = i_user_id;
	$('#dtinstall').prop('disabled', true);
	$('#carcode').prop('disabled', true);
	$('#platenumber').prop('disabled', true);
	$('#showpic').prop('disabled', true);
	$('#technician').prop('disabled', true);
	$('#cartype').prop('disabled', true);
	$('#carnote').prop('readonly', true);
	$('#usernamebymid').prop('disabled', true);
	$('#boxnote').prop('readonly', true);
	$('#mid').val('');
	$('#dtinstall').val('');
	$('#carcode').val('');
	$('#platenumber').val('');
	$('#showpic').val('1');
	$('#technician').val('');
	$('#cartype').val('');
	$('#carnote').val('');
	$('#usernamebymid').val('');
	$('#boxnote').val('');
	$('#btSubmitUpdate').prop('disabled', true);
	$('#btClearfield').prop('disabled', true);
	$('#mid').prop('disabled', false);
	$('#clearBtnDateIns').prop('disabled', true);
}

function em12SearchByMID(){
	if ($('#mid').val() == ''){
		$('#dangerModal').modal({backdrop: 'static'});
	} else {
		var params = {
	            mid : $('#mid').val(),
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"em12SearchByMID",
	                    success : function(response) {
	                        var json = JSON.parse(response);
	                        var record = json.em12SearchByMID;
	                        clearAll();
	                        $.each(record, function (i, item) {
	                        	$('#dtinstall').val(item.dt_install);
	                        	$('#carcode').val(item.c_car_code);
	                        	$('#platenumber').val(item.c_plate_number);
	                        	$('#showpic').val(item.i_show_pic);
	                        	$('#technician').val(item.c_technician);
	                        	$('#cartype').val(item.c_car_type);
	                        	$('#carnote').val(item.c_car_note);
	                        	$('#usernamebymid').val(item.c_username);
	                        	$('#boxnote').val(item.c_box_note);
	                        });
	                        if(record.length > 0){
	                        	$('#mid').prop('disabled', true);
	                        	$('#dtinstall').prop('disabled', false);
	                        	$('#carcode').prop('disabled', false);
	                        	$('#platenumber').prop('disabled', false);
	                        	$('#showpic').prop('disabled', false);
	                        	$('#technician').prop('disabled', false);
	                        	$('#cartype').prop('disabled', false);
	                        	$('#carnote').prop('readonly', false);
	                        	$('#boxnote').prop('readonly', false);
	                        	$('#btSubmitUpdate').prop('disabled', false);
	                        	$('#btClearfield').prop('disabled', false);
	                        	$('#clearBtnDateIns').prop('disabled', false);
	                        	blockUIApp.hidePleaseWait();
	                        }else{
	                        	$('#mid').prop('disabled', false);
	                        	$('#dtinstall').prop('disabled', true);
	                        	$('#carcode').prop('disabled', true);
	                        	$('#platenumber').prop('disabled', true);
	                        	$('#showpic').prop('disabled', true);
	                        	$('#technician').prop('disabled', true);
	                        	$('#cartype').prop('disabled', true);
	                        	$('#carnote').prop('readonly', true);
	                        	$('#boxnote').prop('readonly', true);
	                        	$('#btClearfield').prop('disabled', false);
	                        	$('#clearBtnDateIns').prop('disabled', true);
	                        	blockUIApp.hidePleaseWait();
	                        	$('#dataNotFound').modal({backdrop: 'static'});
	                        }
	                        
	                    },
	                    failure : function(response) {
	                    	clearAll();
	                        blockUIApp.hidePleaseWait();
	                    }
	        });
	}
}

function updatebox(){
	var mid = $('#mid').val();
	var dtinstall = $('#dtinstall').val();
	var carcode = $('#carcode').val();
	var platenumber = $('#platenumber').val();
	var showpic = $('#showpic').val();
	var technician = $('#technician').val();
	var cartype = $('#cartype').val();
	var carnote = $('#carnote').val();
	var boxnote = $('#boxnote').val();
	if (mid == '' || dtinstall == '' || carcode == '' || platenumber == '' || cartype == '' || showpic == '' ){
		$('#em12Modal').modal({backdrop: 'static'});		
	} else {
		var regex = /(\d+)/g;
	    var d = dtinstall.match(regex);
	    var out = d[2] + "-" + d[1] + "-" + d[0] + " " + d[3] + ":" + d[4];
		var params = {
			MID : mid,
			groupId : groupidUpdate,
			userId : useridUpdate,
			dtInstall : out,
			carCode : carcode,
			plateNumber : platenumber,
			showPic : showpic,
			technician : technician,
			carType : cartype,
			carNote : carnote,
			boxNote : boxnote
		};
		blockUIApp.showPleaseWait();
	    $.ajax({
	                method : 'POST',
	                data : params,
	                url : path+"em12UpdateUser",
	                success : function(response) {
	                	var json = JSON.parse(response);
	                    var record = json.em12UpdateUser;
                        $.each(record, function (i, item) {
                            checkupdateUser = item.checkcolumnupdate;
                        });
                        if(checkupdateUser > 0){
                            back();
                            $("#updateSuccess").modal({backdrop: 'static'});
                            blockUIApp.hidePleaseWait();
						}else{
                            blockUIApp.hidePleaseWait();
                            $("#updateError").modal({backdrop: 'static'});
						}
	                },
	                failure : function(response) {
	                	blockUIApp.hidePleaseWait();
	                	$('#updateError').modal({backdrop: 'static'});
	                    console.info(response);
	                }
	    });
	  }
};

function clearval(){
	$('#company').val('');
	$('#username').val('');
	$('#companyid').val('');
	$('#midsearch').val('');
	$('#tableId').empty();
};

function clearBtnDateIns(){
	$('#dtinstall').val('')
};

function back(){
	$('#editbox').hide();
	$('#company').prop('disabled', false);
	$('#username').prop('disabled', false);
	$('#companyid').prop('disabled', false);
	$('#midsearch').prop('disabled', false);
	$('#bodyStatus').show();
	$('#btSearchEm12').show();
	$('#btClear').show();
	clearAll();
};

function clearField(){
	$('#mid').prop('disabled', false);
	$('#mid').val('');
	$('#dtinstall').val('');
	$('#carcode').val('');
	$('#platenumber').val('');
	$('#showpic').val('1');
	$('#technician').val('');
	$('#cartype').val('');
	$('#carnote').val('');
	$('#usernamebymid').val('');
	$('#boxnote').val('');
	$('#mid').prop('disabled', false);
	$('#dtinstall').prop('disabled', true);
	$('#carcode').prop('disabled', true);
	$('#platenumber').prop('disabled', true);
	$('#showpic').prop('disabled', true);
	$('#technician').prop('disabled', true);
	$('#cartype').prop('disabled', true);
	$('#carnote').prop('readonly', true);
	$('#usernamebymid').prop('disabled', true);
	$('#boxnote').prop('readonly', true);
	usernamebymid
	$('#btSubmitUpdate').prop('disabled', true);
	$('#btClearfield').prop('disabled', true);
	$('#clearBtnDateIns').prop('disabled', true);
};

function clearAll(){
	$('#dtinstall').val('');
	$('#carcode').val('');
	$('#platenumber').val('');
	$('#showpic').val('1');
	$('#technician').val('');
	$('#cartype').val('');
	$('#carnote').val('');
	$('#usernamebymid').val('');
	$('#boxnote').val('');
};

function keyenter(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  search();
	  }
};

function keyenterByMID(evt){
	 if(evt.keyCode == 13 || evt.which == 13){
		  em12SearchByMID();
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
	$('#editbox').hide();
	$('#dtinstall').datetimepicker(
			{
				format:	'd-m-Y H:i',
				step: 1
			}
	);
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};