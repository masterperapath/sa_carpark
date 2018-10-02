var path = null;
function searchEm18(){
	blockUIApp.showPleaseWait();
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
	    link.href = path + 'em18Search?startdate='+ outsd +'&&enddate='+ outed +'';
	    link.download = 'รายงานสรุปติดตั้งตามช่วงเวลา';
	    window.open(link, '_blank');
	}
	blockUIApp.hidePleaseWait();
};

function clearAllEm18(){
	cleardate();
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
	var d = new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var year = d.getFullYear();
	var output = (day < 10 ? '0' : '') + day + '-'
			+ (month < 10 ? '0' : '') + month + '-' + year ;
	$("#startdate").val(output);
	$("#enddate").val(output);
	$("#startdate").datepicker({
		format: 'dd-mm-yyyy'
	});
	$("#enddate").datepicker({
		format: 'dd-mm-yyyy'
	});
	$("#startdate").datepicker().on('changeDate', function(ev){
		  var start = $("#startdate").val();
		  var startArr  =  start.split("-");
		  var startFormat = startArr[2]+startArr[1]+startArr[0];
		 
		  var end = $("#enddate").val();
		  var endArr  =  end.split("-");
		  var endFormat = endArr[2]+endArr[1]+endArr[0];
		  
		  if ( endFormat < startFormat){
				$("#dateModal").modal({backdrop : 'static'});
				$("#enddate").val('');
		  } 
		  else {
					$("#enddate").val();
		  }
	});
	
	$("#enddate").datepicker().on('changeDate', function(ev){
		  var start = $("#startdate").val();
		  var startArr  =  start.split("-");
		  var startFormat = startArr[2]+startArr[1]+startArr[0];
		 
		  var end = $("#enddate").val();
		  var endArr  =  end.split("-");
		  var endFormat = endArr[2]+endArr[1]+endArr[0];
		  
		  if (startFormat > endFormat){
				$("#dateModal").modal({backdrop : 'static'});
				$("#enddate").val('');
		  } 
		  else {
					$("#enddate").val();
		  }
	});
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};
