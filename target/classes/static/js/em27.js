var path = null;
function searchEm27(){
	blockUIApp.showPleaseWait();
	var mid = $('#mid').val();
	var startdate = $('#startdate').val();
	var enddate = $('#enddate').val();
	var regex = /(\d+)/g;
	var sd = startdate.match(regex);
	var ed = enddate.match(regex);
	var outsd = sd[2] + "-" + sd[1] + "-" + sd[0];
	var outed = ed[2] + "-" + ed[1] + "-" + ed[0];
	
	if(startdate == '' || enddate == ''){
		$("#dangerData").modal({backdrop: 'static'});
	}else{
    var link = document.createElement('a');
	    link.style.display = "none";
	    link.href = path + 'em27Search?mid='+mid+'&&startdate='+ outsd +'&&enddate='+ outed +'';
	    link.download = 'รายงานสรุปติดตั้งตามช่วงเวลา';
	    window.open(link, '_blank');
	}
	blockUIApp.hidePleaseWait();
};

function clearAllEm27(){
	cleardate();
};

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		search();
	}
};

function cleardate(){
	var d = new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var output = (day < 10 ? '0' : '') + day + '-'
			+ (month < 10 ? '0' : '') + month + '-' + d.getFullYear();
		$("#startdate").val(output);
		$("#enddate").val(output);
};

function checkDate() {
	var startdate = $("#startdate").val();
	var enddate = $("#enddate").val();
	
	if (Date.parse(startdate) > Date.parse(enddate)) {
		$("#dateModal").modal({
			backdrop : 'static'
		});
		$("#enddate").val('');
	}
};

function checkDate(event) {
	console.log($("#startdate").val());
	console.log($("#enddate").val());
	console.log(event)
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
	$("#status").val('');
	var d = new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var output = (day < 10 ? '0' : '') + day + '-'
			+ (month < 10 ? '0' : '') + month + '-' + d.getFullYear();
	$("#startdate").val(output + " 00:00");
	$("#enddate").val(output + " 23:59");
	$(function(){
		 $('#startdate').datetimepicker({
			 format:'d-m-Y H:i',
			 step:1,
			 onShow:function( ct ){
				 this.setOptions({
					 maxDate:$('#enddate').val()?$('#enddate').val():false
				 })
			 },
			 timepicker:true
		 });
		 $('#enddate').datetimepicker({
			 format:'d-m-Y H:i',
			 step:1,
			 onShow:function( ct ){
				 this.setOptions({
					 minDate:$('#startdate').val()?$('#startdate').val():false
				 })
			 },
			 timepicker:true
		 });
	});
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
