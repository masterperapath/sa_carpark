var path = null;
function search(){
	var mid = $("#mid").val();
    var imei = $("#imei").val();
	if(mid == ''  && imei == ''){
		$("#dataSearchFail").modal({backdrop: 'static'});
	}else{
    var params = {
            mid : mid,
            imei : imei
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"searchEM21",
                    success : function(response) {
                    	$("#tableId").empty();
                        var json = JSON.parse(response);
                        var record = json.em21MonitorTech.data;
                        var table = '';
                        $.each(record, function (i, item) {
                        	
                        	    table += '<tr><td>' + item.no + '</td><td>' + item.i_mid_id + '</td>'
                        			if(item.status1 == 1){
                        		table += '<td style="text-align: left; background-color: #ffff33">เบา</td>'
                        		     }
                        			if(item.status1 == 2){
                        		table += '<td style="text-align: left; background-color: #33ff33">วิ่ง</td>'
		                      		     }
                        			if(item.status1 == 3){
                        		table += '<td style="text-align: left; background-color: #ff66ff">เร็ว</td>'
		                      		     }
                        			if(item.status1 == 4){
                        		table += '<td style="text-align: left; background-color: #ff3333">ดับ</td>'
		                      		     }
                        			if(item.status1 == 6){
                        		table += '<td style="text-align: left; background-color: #999999">หาย</td>'
		                      		     }
                        			if(item.status1 == 7){
                        		table += '<td style="text-align: left; background-color: #3333ff">เสา</td>'
		                      		     }
                        			if(item.status1 != 1&&item.status1 != 2&&item.status1 != 3&&item.status1 != 4&&item.status1 != 6&&item.status1 != 7){
                        		table += '<td style="text-align: left; background-color: gray">-</td>'
		                      		     }
                        	    	if(item.status2 == 'ไฟ'){
                        	    table += '<td style="text-align: left; background-color: #ffff33">' + item.status2 + '</td>'
                        				}	
                        	    	if(item.status2 == 'ว่าง'){
                        	    table += '<td style="text-align: left; background-color: gray">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'มีคน'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'เปิด'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'เสีย'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'พัก'){
                        	    table += '<td style="text-align: left; background-color: #33ff33">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'รอ'){
                        	    table += '<td style="text-align: left; background-color: #ffff33">' + item.status2 + '</td>'
                          				}
                        	    	if(item.status2 == 'กุญแจ'){
                                table += '<td style="text-align: left; background-color: #ff9800">' + item.status2 + '</td>'
                                  				}
                        	    	if(item.status2 == '-'){
                        	    table += '<td style="text-align: left; background-color: gray">' + item.status2 + '</td>'
                            				}
                        	    	if(item.status2 == ''){
                                table += '<td style="text-align: left; background-color: gray">' + item.status2 + '</td>'
                                    		}
                        	    	if(item.status3 == 'ไฟ'){
                        	    table += '<td style="text-align: left; background-color: #ffff33">' + item.status3 + '</td>'
                        				}	
                        	    	if(item.status3 == 'ว่าง'){
                        	    table += '<td style="text-align: left; background-color: gray">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == 'มีคน'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == 'เปิด'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == 'เสีย'){
                        	    table += '<td style="text-align: left; background-color: #ff3333">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == 'พัก'){
                        	    table += '<td style="text-align: left; background-color: #33ff33">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == 'รอ'){
                        	    table += '<td style="text-align: left; background-color: #ffff33">' + item.status3 + '</td>'
                          				}
                        	    	if(item.status3 == '-'){
                        	    table += '<td style="text-align: left; background-color: gray">' + item.status3 + '</td>'
                            				}
                        	    	if(item.status3 == ''){
                                table += '<td style="text-align: left; background-color: gray">' + item.status3 + '</td>'
                                    		}
                        	    table += '<td>' + item.ts_gprsdate + '</td><td>' + item.ts_keepalive + '</td><td>' + item.i_ext_power_voltage + 'V' + '</td>'
                        	     	  + '<td>' + item.position + '</td><td>' + item.i_card + '</td></tr>';
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
}

function clearval(){
	 $("#mid").val('');
	 $("#imei").val('');
	 $("#tableId").empty();
}

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

$( document ).ready(function(patheyemin) {
	path = contextRoot;
	getCsrf();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};