var path = null;
var outd = "";
var outp = "";
var i_update = null;
function search(){
	var mid = $('#mid').val();
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
                    url : path+"searchdlt",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.searchDltEdit;
                        clearAll();
                        $.each(record, function (i, item) {
                        	$("#carcode").val(item.c_car_code);
                        	$("#dtinstall").val(item.dt_install_for_dlt);
                        	$("#userplatenumber").val(item.c_user_plate_number);
                        	
                        	$("#province").val(item.i_province_code);

                        	$("#brand").val(item.c_car_brand);
                        	$("#uservin").val(item.c_user_vin);
                        	$("#ownername").val(item.c_owner_name);

                        	$("#registype").val(item.i_regis_type);

                        	$("#carseat").val(item.i_car_seat);
                        	$("#truckshaft").val(item.i_truck_shaft);
                        	$("#truckwheel").val(item.i_truck_wheel);
                        	$("#trucktyre").val(item.i_truck_tyre);
                        	
                        	$("#dtinstalldlt").val(item.dt_install_for_dlt);
                        	$("#dtprinted").val(item.dt_printed);
                        	$("#cardreader").prop('checked',item.b_card_reader);
                        	$("#model").val(item.c_model);
                        	i_update = item.i_updated;
                        	
                        });
                        if(parseInt($("#registype").val()) > 1999){
                        	$('#carseat').prop('disabled', true);
                        }
                        if(record.length == 0){
                            $("#dataNotFound").modal({backdrop: 'static'});
                            $('#btSubmitSave').prop('disabled', true);
                            $('#btSubmit').prop('disabled', false);
                            $('#mid').prop('disabled', false);
                           }else {
                        $('#btSubmitSave').prop('disabled', false);
                        $('#btSubmit').prop('disabled', true);
                        $('#mid').prop('disabled', true);
                        if(i_update == 1){
                        	if($("#model").val() == '0480000'){
                        		var DltRegisfn4 = '';
                            	DltRegisfn4 += '<a href="' + path + 'genreportdlt?mid='+ mid +'&&fn=4&&model='+ $("#model").val() +'" title="เอกสารรถใหม่" target="blank">'
                            				+  '<button id="btDltRegisfn4" type="button" class="btn btn-sm btn-black form-control">'
                            				+  '<i class="fa fa-automobile bigger-140"></i></button>'
                            				+  '</a>'
                            				$('#dlt_DltRegisfn4').append(DltRegisfn4);
                                var DltRegisfn5 = '';
                                DltRegisfn5 += '<a href="' + path + 'genreportdlt?mid='+ mid +'&&fn=5&&model='+ $("#model").val() +'" title="สติกเกอร์" target="blank">'
                                			+  '<button id="btDltRegisfn5" type="button" class="btn btn-sm btn-gray form-control"><i class="fa fa-sticky-note-o bigger-140"></i></button>'
                                			+  '</a>'
                                $('#dlt_DltRegisfn5').append(DltRegisfn5);
                        	}
                        	else{
                        		var DltRegisfn4 = '';
                            	DltRegisfn4 += '<a href="' + path + 'genreportdlt?mid='+ mid +'&&fn=4&&model='+ $("#model").val() +'" title="เอกสารรถใหม่" target="blank">'
                            				+  '<button id="btDltRegisfn4" type="button" class="btn btn-sm btn-success form-control">'
                            				+  '<i class="fa fa-automobile bigger-140"></i></button>'
                            				+  '</a>'
                            				$('#dlt_DltRegisfn4').append(DltRegisfn4);
                                var DltRegisfn5 = '';
                                DltRegisfn5 += '<a href="' + path + 'genreportdlt?mid='+ mid +'&&fn=5&&model='+ $("#model").val() +'" title="สติกเกอร์" target="blank">'
                                			+  '<button id="btDltRegisfn5" type="button" class="btn btn-sm btn-danger form-control"><i class="fa fa-sticky-note-o bigger-140"></i></button>'
                                			+  '</a>'
                                $('#dlt_DltRegisfn5').append(DltRegisfn5);
                        	}
                      }else{
                    	  i_update = null;
                    	  $('#dlt_DltRegisfn4').empty();
                    	  $('#dlt_DltRegisfn5').empty();
                      }
                    }
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                    	$('#btSubmitSave').prop('disabled', true);
                    	$('#mid').prop('disabled', false);
                    	$('#btSubmit').prop('disabled', false);
                        blockUIApp.hidePleaseWait();
                    }
        });
	}
};

function comboboxprovince(){
    var params = {};
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"comboprovince",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.comboProvince;
                        var option = '';
                        $.each(record, function (i, item) {
                        	option += '<option value ="' + item.i_province_code + '">' +  item.c_province_name  + '</option>';
                        });
                        $('#province').append(option);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
                    }
                    
        });
};

function comboboxtypeplate(){
    var params = {};
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"combotypeplate",
                    success : function(response) {
                        var json = JSON.parse(response);
                        var record = json.comboTypeplate;
                        var option = '';
                        $.each(record, function (i, item) {
                        	option += '<option value ="' + item.i_regis_type + '">' +  item.c_regis_type_name  + '</option>';
                        });
                        $('#registype').append(option);
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                        blockUIApp.hidePleaseWait();
                    }
        });
};

function update(){
	var mid = $('#mid').val();
	var userplatenumber = $('#userplatenumber').val();
	var province = $('#province').val();
	var brand = $('#brand').val();
	var carweight = '';
	var vin = '';
	var ownername = $('#ownername').val();
	var registype = $('#registype').val();
	var carseat = $('#carseat').val();
	var truckshaft = $('#truckshaft').val();
	var truckwheel = $('#truckwheel').val();
	var trucktyre = $('#trucktyre').val();
	var platenumber = '';
	var uservin = $('#uservin').val();
	var dtprinted = $('#dtprinted').val();
	var cardreader = $('#cardreader').prop('checked',);
	var modelCar = $('#model').val();
	var dtinstalldlt = $('#dtinstalldlt').val();
	var regex = /(\d+)/g;
	var p = dtprinted.match(regex);
	var d = dtinstalldlt.match(regex);
	if(dtinstalldlt != ""){
	    outd = d[2] + "-" + d[1] + "-" + d[0];
	}
	if(dtprinted == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(mid == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}
	else if(brand == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(uservin == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(carseat == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(truckshaft == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(truckwheel == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else if(trucktyre == ""){
		$("#dangerData").modal({backdrop: 'static'});
	}
	else{
		outp = p[2] + "-" + p[1] + "-" + p[0];
	    var params = {
	    		midUP : mid,
	    		userplatenumberUP : userplatenumber,
	    		provinceUP : province,
	    		brandUP : brand,
	    		carweightUP : carweight,
	    		vinUP : vin,
	    		ownernameUP : ownername,
	    		registypeUP : registype,
	    		carseatUP : carseat,
	    		truckshaftUP : truckshaft,
	    		truckwheelUP : truckwheel,
	    		trucktyreUP : trucktyre,
	    		dtinstalldltUP : outd,
	    		cardreaderUP : cardreader,
	    		platenumberUP: platenumber,
	    		uservinUP : uservin,
	    		dtprintedUP : outp,
	    		modelCarUP : modelCar
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"updatedlt",
	                    success : function(response) {
	                    	var json = JSON.parse(response);
	                        var record = json.updateDltEdit;
	                        clearAll();
	                        blockUIApp.hidePleaseWait();
	                        $('#btSubmitSave').prop('disabled', true);
	                        $('#mid').prop('disabled', false);
	                        $("#updateSuccess").modal({backdrop: 'static'});
	                        $('#btSubmit').prop('disabled', false);
	                    },
	                    failure : function(response) {
	                    	$('#btSubmitSave').prop('disabled', false);
	                    	$('#btSubmit').prop('disabled', true);
	                    	$('#mid').prop('disabled', true);
	                    	clearAll();
	                    	blockUIApp.hidePleaseWait();
	                    	$("#updateError").modal({backdrop: 'static'});
	                    }
	        });
	}
};

function clearBtnDateIns(){
	$("#dtinstalldlt").val('');
	outd = "";
}

function clearBtnDatePrint(){
	$("#dtprinted").val('');
	outp = "";
}

function clearAll(){
	$('#carcode').val('');
	$('#userplatenumber').val('');
	$('#carcode').val('');
	$('#province').val('1');
	$('#brand').val('');
	$('#uservin').val('');
	$('#ownername').val('');
	$('#registype').val('0');
	$('#carseat').val('');
	$('#truckshaft').val('');
	$('#truckwheel').val('');
	$('#trucktyre').val('');
	$("#dtinstall").val('');
	$("#dtinstalldlt").val('');
	$("#dtprinted").val('');
	$("#cardreader").prop('checked',false);
	$("#mid").prop('disabled', false);
	$('#model').val('0480000');
	$('#btSubmitSave').prop('disabled', true)
	$('#btSubmit').prop('disabled', false);
	$("#carseat").prop('disabled',false);
	outd = "";
	outp = "";
	i_update = null
	$('#dlt_DltRegisfn4').empty();
	$('#dlt_DltRegisfn5').empty();
}

function clearBtn(){
	$('#carcode').val('');
	$('#userplatenumber').val('');
	$('#carcode').val('');
	$('#province').val('1');
	$('#brand').val('');
	$('#uservin').val('');
	$('#ownername').val('');
	$('#registype').val('0');
	$('#carseat').val('');
	$('#truckshaft').val('');
	$('#truckwheel').val('');
	$('#trucktyre').val('');
	$("#dtinstall").val('');
	$("#dtinstalldlt").val('');
	$("#dtprinted").val('');
	$("#cardreader").prop('checked',false);
	$("#mid").prop('disabled', false);
	$("#mid").val('');
	$('#model').val('0480000');
	$('#btSubmitSave').prop('disabled', true)
	$('#btSubmit').prop('disabled', false);
	$("#carseat").prop('disabled',false);
	outd = "";
	outp = "";
	i_update = null
	$('#dlt_DltRegisfn4').empty();
	$('#dlt_DltRegisfn5').empty();
}

//function btDltRegisfn4(){
//	var mid = $('#mid').val();
//	var params = {
//    		mid : mid,
//    		fn : '4'
//        };
//	blockUIApp.showPleaseWait();
//    $.ajax({
//                method : 'POST',
//                data : params,
//                url : path+"genreportdlt",
//                success : function(response) {
//                	blockUIApp.hidePleaseWait();
//                },
//                failure : function(response) {
//                	blockUIApp.hidePleaseWait();
//                }
//    });
//};

//function btDltRegisfn5(){
//	var mid = $('#mid').val();
//	var params = {
//    		mid : mid,
//    		fn : '5'
//        };
//	blockUIApp.showPleaseWait();
//    $.ajax({
//                method : 'POST',
//                data : params,
//                url : path+"genreportdlt",
//                success : function(response) {
//                	blockUIApp.hidePleaseWait();
//                },
//                failure : function(response) {
//                	blockUIApp.hidePleaseWait();
//                }
//    });
//};

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

$('#myform :checkbox').change(function() {
    if (this.checked) {
    	$('#model').val('0480001');
    } else {
    	$('#model').val('0480000');
    }
});

$("#model").change(function () { 
	var modelval = $('#model').val();
	   if(modelval == '0480001'){
		   $('#model').val(modelval);
		   $("#cardreader").prop('checked',true);
	   }else{
		   $('#model').val(modelval);
		   $("#cardreader").prop('checked',false);
	   }
});

$("#registype").change(function () { 
	var registype = $('#registype').val();
	   if(parseInt(registype) > 1999){
		   $('#registype').val(registype);
		   $("#carseat").prop('disabled',true);
	   }else{
		   $('#registype').val(registype);
		   $("#carseat").prop('disabled',false);
	   }
});

$( document ).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
	comboboxprovince();
	comboboxtypeplate();
	$('#model').val('0480000');
	$('#dtinstall').prop('disabled', true);
	$("#carcode").prop('disabled', true);
	$('#btSubmitSave').prop('disabled', true);
	$('#btSubmit').prop('disabled', false);
	$('#dtprinted').datepicker({
        format:	'dd-mm-yyyy'
    });
	$('#dtinstalldlt').datepicker({
        format:	'dd-mm-yyyy'
    });
	
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
