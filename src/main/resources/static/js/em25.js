var path = null;
var checkMIDDup = null;
var boxNoteLost = null;
var boxNoteNew = null;
var phoneLost = null;
var phoneNew = null;
var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var year = d.getFullYear();
var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year ;
var validateError = 0;
function searchEm25(){
		var mid =  $('#mid').val();
    	$('#mid_lost').val(mid);
		if(mid == ""){
			$("#dangerModal").modal({backdrop: 'static'});
		}else{
		var params = {
				mid : mid
        };
    	blockUIApp.showPleaseWait();
        $.ajax({
                    method : 'POST',
                    data : params,
                    url : path+"em25SearchMID",
                    success : function(response) {
                		var json = JSON.parse(response);
                        var record = json.em25SelectMID.data;
                        $.each(record, function(i, item) {
                        	checkMIDDup = item.checkmid;
						});
						if (checkMIDDup == 1) {
							checkMIDDup = null;
							blockUIApp.hidePleaseWait();
							$("#midDupModal").modal({
								backdrop : 'static'
							});
						} else {
							$('#mid_new').prop('disabled', false)
	                	    $("#bodyFirst").hide();
	                        $("#bodySecond").show();
	                        $('#table').empty();
							var table = '';
                        $.each(record, function (i, item) {
                        	$('#mid_store').val(item.mid_store);
                        	boxNoteLost = item.c_box_note;
                        	phoneLost = item.c_sim_number;
                        table += '<tr><td style="text-align: center">' + item.i_mid_id + '</td><td style="text-align: center">' + item.i_imei + '</td></tr>';
                        });
                        $('#table').append(table);
                        $(table).height();
                        if (table == ""){
                        	$("#dataNotFound").modal({backdrop: 'static'});
                        	clearEm25();
                        }
                        blockUIApp.hidePleaseWait();
						}
                    },
                    failure : function(response) {
                        console.info(response);
                        blockUIApp.hidePleaseWait();
                    }
              });
		}
};

function clearEm25(){
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#bodyFirst").show();
    $("#bodySecond").hide();
    $("#CardSearch").show();
    $("#CardNote").hide();
    $("#mid").val('');
    $("#mid_store").val('');
    $("#mid_new").val('');
	$('#table').empty();
	boxNoteLost = null;
	boxNoteNew = null;
	phoneLost = null;
	phoneNew = null;
}

function backEm25(){
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#bodyFirst").hide();
    $("#bodySecond").show();
    $("#CardSearch").show();
    $("#CardNote").hide();
    $('#mid_new').prop('disabled', false)
    $("#mid_new").val('');
	boxNoteLost = null;
	boxNoteNew = null;
	phoneLost = null;
	phoneNew = null;
}

function newmidEm25(){
	var midLost = $('#mid_lost').val();
	var midNew =  $('#mid_new').val();
	if(midNew == ""){
		$("#dangerModal").modal({backdrop: 'static'});
	}else if(midNew == midLost){
		$("#dangerDuplicateMID").modal({backdrop: 'static'});
	}else{
	var params = {
			mid : midNew
    };
	blockUIApp.showPleaseWait();
    $.ajax({
                method : 'POST',
                data : params,
                url : path+"em25SearchMID",
                success : function(response) {
            		var json = JSON.parse(response);
                    var record = json.em25SelectMID.data;
                    $.each(record, function(i, item) {
                    	checkMIDDup = item.checkmid;
					});
					if (checkMIDDup == 1) {
						checkMIDDup = null;
						blockUIApp.hidePleaseWait();
						$("#midDupModal").modal({
							backdrop : 'static'
						});
					} else {
						$('#mid_new').prop('disabled', true)
					    $("#headerFirst").hide();
					    $("#headerSecond").show();
					    $("#CardSearch").hide();
	                    $("#CardNote").show();
						$('#bodyNote').empty();
	                    var Note = '';
	                    $.each(record, function (i, item) {
	                    	boxNoteNew = item.c_box_note;
	                    	Note += '<div class="form-group row">'
	                    		 +'<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midLost + ' (ข้อความเดิมใน db)</label>'
	                    	     +'<label class="col-sm-5 col-form-label" for="input-small" style="text-align: left">' + boxNoteLost +'</label>'
	                    	     +'</div>'
	                    	     +'<div class="form-group row">'
	                    	     +'<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midLost + ' (ข้อความใหม่)</label>'
	                    	     +'<textarea class="col-sm-5 col-form-textarea" id="textLost" name="textLost" rows="9" class="form-control" placeholder="...">' + boxNoteLost + ', เปลี่ยน '+ midNew +' แทน '+ midLost +'(_'+ phoneLost +')_'+ output +'</textarea>'
	                    	     +'</div>'
	                    	     +'<div class="form-group row">'
	                    	     +'</div>'
	                    	     +'<div class="form-group row">'
	                    	     +'<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midNew + ' (ข้อความเดิมใน db)</label>'
	                    	     +'<label class="col-sm-5 col-form-label" for="input-small" style="text-align: left">' + boxNoteNew +'</label>'
	                    	     +'</div>'
	                    	     +'<div class="form-group row">'
	                    	     +'<label class="col-sm-4 col-form-label" for="input-small" style="text-align: right">' + midNew + ' (ข้อความใหม่)</label>'
	                    	     +'<textarea class="col-sm-5 col-form-textarea" id="textNew" name="textNew" rows="9" class="form-control" placeholder="...">' + boxNoteNew + ', เปลี่ยน '+ midNew +' แทน '+ midLost +'(_'+ phoneLost +')_'+ output +'</textarea>'
	                    	     +'</div>';
	                    });
                    $('#bodyNote').append(Note);
                    blockUIApp.hidePleaseWait();
					}
                },
                failure : function(response) {
                    console.info(response);
                    blockUIApp.hidePleaseWait();
                }
          });
	}
};

function saveEm25(){
	var textLost = $('#textLost').val();
	var textNew = $('#textNew').val();
		if(textLost == "" || textNew == ""){
	    	$("#dangerData").modal({backdrop: 'static'});
	    }
	    else{
	    	var params = {
	    			midLost   : $('#mid_lost').val(), 
	    			midStore  : $('#mid_store').val(), 
	    			midNew    : $('#mid_new').val(),
	    			textNew   : textNew,
	    			textLost  : textLost
	        };
	    	blockUIApp.showPleaseWait();
	        $.ajax({
	                    method : 'POST',
	                    data : params,
	                    url : path+"em25updateMID",
	                    success : function(response) {
	                        var json = JSON.parse(response);
	                        var record = json.em25UpdateMID.data;
	                        $.each(record, function (i, item) {
	                        	validateError = item.v_validate;
	                        });
	                     if(validateError > 0 ){
	                    	 $("#updateError").modal({backdrop: 'static'});
	                    	 $("#CardSearch").show();
	                         $("#CardNote").hide();
	                         $("#mid_store").val('');
	                         $("#mid_new").val('');
	                         backEm25();
	                         searchEm25();
	                         blockUIApp.hidePleaseWait();
	                     }else{
	                        $("#updateSuccess").modal({backdrop: 'static'});
	                        $("#CardSearch").show();
	                        $("#CardNote").hide();
	                        $("#mid_store").val('');
	                        $("#mid_new").val('');
	                        backEm25();
	                        searchEm25();
	                        blockUIApp.hidePleaseWait();
	                     	}
	                    },
	                    failure : function(response) {
	                        console.info(response);
	                        blockUIApp.hidePleaseWait();
	                    }
	        });
	}
};

function keyenter(evt){
	if(evt.keyCode == 13 || evt.which == 13){
		searchEm25();
	}
};

function keyenterMID(evt){
	  if(evt.keyCode == 13 || evt.which == 13){
		  newmidEm25();
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
    $("#headerFirst").show();
    $("#headerSecond").hide();
	$("#bodyFirst").show();
    $("#bodySecond").hide();
    $("#CardSearch").show();
    $("#CardNote").hide();
});

var tokenJWT = 'X-JWT-TOKEN';
function logout(){
	if(Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path+"login.html";
};