var path = null;
function search(){

	var mid = $("#mid").val();
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
    var regex = /(\d+)/g;
    var d = startDate.match(regex);
    var p = endDate.match(regex);
    var outd = d[2] + "-" + d[1] + "-" + d[0] + " " + d[3] + ":" + d[4];
    var outp = p[2] + "-" + p[1] + "-" + p[0] + " " + p[3] + ":" + p[4];

	if(mid == "" || startDate == "" || endDate == ""){
		$("#dangerModalMID").modal({backdrop: 'static'});
	}else{
    var params = {
    		mid : mid,
    		startDate : outd,
    		endDate : outp
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchhisidcard",
                    success : function(response) {
                        var rowDel = tableId.rows.length;
                        for (var i = rowDel - 1; i > 0; i--) {
                        	tableId.deleteRow(i);
                        }
                        var json = JSON.parse(response);
                        var record = json.eyeMinHis;
                        var table = '<tbody>';
                        $.each(record, function (i, item) {
                        		var no = i+1;
                        	    table += '<tr><td>' + no + '</td><td>' + item.i_mid_id + '</td><td>' + item.c_raw + '</td><td>' + item.c_plate_number + '</td><td>' + item.ts_gpsdate + '</td></tr>';
                        }); 
                        	table += '</tbody>'
                        $('#tableId').append(table);
                        if(record.length == 0){
                            $("#dataNotFound").modal({backdrop: 'static'});
                           }	
                        blockUIApp.hidePleaseWait();
                    },
                    failure : function(response) {
                    	blockUIApp.hidePleaseWait();
                        console.info(response);
                    }
        });
	}
};

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		search();
	}
};

function clearval(){
	var date = new Date();
	var now = date.getFullYear() + '-' + ((("0" + date.getMonth()+ 1).slice(-2))) + '-' + (("0"+ date.getDate()).slice(-2)); 
	
	 $("#mid").val('');
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();

    $('#startDate').val(output + " 00:00");
    $('#endDate').val(output + " 23:59");

	
	var rowDel = tableId.rows.length;
    for (var i = rowDel - 1; i > 0; i--) {
    	tableId.deleteRow(i);
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

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};

$( document ).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();

    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = (day<10 ? '0' : '') + day + '-' + (month<10 ? '0' : '') + month + '-' + d.getFullYear();

     $('#startDate').val(output + " 00:00");
     $('#endDate').val(output + " 23:59");
     $(function(){
		 $('#startDate').datetimepicker({
			 format:'d-m-Y H:i',
			 step:1,
			 onShow:function( ct ){
				 this.setOptions({
					 maxDate:$('#endDate').val()?$('#endDate').val():false
				 })
			 },
			 timepicker:true
		 });
		 $('#endDate').datetimepicker({
			 format:'d-m-Y H:i',
			 step:1,
			 onShow:function( ct ){
				 this.setOptions({
					 minDate:$('#startDate').val()?$('#startDate').val():false
				 })
			 },
			 timepicker:true
		 });
	});
});
