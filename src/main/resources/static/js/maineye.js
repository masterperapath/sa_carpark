var path = null;
var usernameToken = null;

function showInnerDrop(id) {
	$(id).innerHTML = usernameToken;
};
function showToggle(id) {
	$(id).toggleClass("show");
	var ut = usernameToken
	$(id).innerHTML = ut;
};

function sidebarToggle(id) {
	$(id).toggleClass("sidebar-minimized brand-minimized");
};

function sidebarToggleHidden(id) {
	$(id).toggleClass("sidebar-hidden");
};

function sidebarToggleMobile(id) {
	$(id).toggleClass("sidebar-mobile-show");
};

function addClassOpen(id) {
	$(id).toggleClass("open");
};

function eyeminmonitor() {
	{
		$('#maineye').load("eyeminmonitor.html #eyeminmonitor", function () {
			$.getScript("./js/eyeminmonitor.js");
		});
	}
};

function eyeminmonitorhis() {
	$('#maineye').load("eyeminmonitorhis.html #eyeminmonitorhis", function () {
		$.getScript("./js/eyeminmonitorhis.js");
	});
};

function historyidcard() {
	$('#maineye').load("historyidcard.html #historyidcard", function () {
		$.getScript("./js/historyidcard.js");
	});
};

function eyeminstatus() {
	$('#maineye').load("eyeminstatus.html #eyeminstatus", function () {
		$.getScript("./js/eyeminStatus.js");
	});
};

function buzzer() {
	$('#maineye').load("buzzer.html #buzzer", function () {
		$.getScript("./js/buzzer.js");
	});
};

function em08() {
	$('#maineye').load("em08.html #em08", function () {
		$.getScript("./js/em08.js");
	});
};

function em17() {
	$('#maineye').load("em17.html #em17", function () {
		$.getScript("./js/em17.js");
	});
};

function em09() {
	$('#maineye').load("em09.html #em09", function () {
		$.getScript("./js/em09.js");
	});
};

function em15() {
	$('#maineye').load("em15.html #em15", function () {
		$.getScript("./js/em15.js");
	});
};

function em16() {
	$('#maineye').load("em16.html #em16", function () {
		$.getScript("./js/em16.js");
	});
};

function em06() {
	$('#maineye').load("em06.html #em06", function () {
		$.getScript("./js/em06.js");
	});
};

function em14() {
	$('#maineye').load("em14.html #em14", function () {
		$.getScript("./js/em14.js");
	});
};

function em10() {
	$('#maineye').load("em10.html #em10", function () {
		$.getScript("./js/em10.js");
	});
};

function em11() {
	$('#maineye').load("em11.html #em11", function () {
		$.getScript("./js/em11.js");
	});

};

function em12() {
	$('#maineye').load("em12.html #em12", function () {
		$.getScript("./js/em12.js");
	});
};

function em13() {
	$('#maineye').load("em13.html #em13", function () {
		$.getScript("./js/em13.js");
	});
};

function em07() {
	$('#maineye').load("em07.html #em07", function () {
		$.getScript("./js/em07.js");
	});
};

function esu03() {
	$('#maineye').load("esu03.html #esu03", function () {
		$.getScript("./js/esu03.js");
	});
};

function em19() {
	$('#maineye').load("em19.html #em19", function () {
		$.getScript("./js/em19.js");
	});
};

function em20() {
	$('#maineye').load("em20.html #em20", function () {
		$.getScript("./js/em20.js");
	});
};

function em18() {
	$('#maineye').load("em18.html #em18", function () {
		$.getScript("./js/em18.js");
	});
};

function em21() {
	$('#maineye').load("em21.html #em21", function () {
		$.getScript("./js/em21.js");
	});
};

function em23() {
	$('#maineye').load("em23.html #em23", function () {
		$.getScript("./js/em23.js");
	});
};

function em24() {
	$('#maineye').load("em24.html #em24", function () {
		$.getScript("./js/em24.js");
	});
};

function em25() {
	$('#maineye').load("em25.html #em25", function () {
		$.getScript("./js/em25.js");
	});
};

function em28() {
	$('#maineye').load("em28.html #em28", function () {
		$.getScript("./js/em28.js");
	});
};

function em29() {
	$('#maineye').load("em29.html #em29", function () {
		$.getScript("./js/em29.js");
	});
};

function em30() {
	$('#maineye').load("em30.html #em30", function () {
		$.getScript("./js/em30.js");
	});
};

function em31() {
	$('#maineye').load("em31.html #em31", function () {
		$.getScript("./js/em31.js");
	});
};

function searchToken() {
	var params = {
		userName: usernameToken
	};
	blockUIApp.showPleaseWait();
	$.ajax({
		method: 'POST',
		data: params,
		url: path + "mainEyeSearchUser",
		success: function (response) {
			var userNamelabel = "";
			var headerNamelabel = "";
			var json = JSON.parse(response);
			var record = json.mainEyeSelectUser.data;
			$('#userName').text("Username: " + usernameToken);
			userNamelabel += '<label class="fa fa-user-circle-o"> บัญชีผู้ใช้: ' + usernameToken + '</label>'
			$('#labelUsername').append(userNamelabel);
			$.each(record, function (i, item) {
				$('#headername').text(" ชื่อผู้ใช้: " + item.realname);
			});
			blockUIApp.hidePleaseWait();
		},
		failure: function (response) {
			console.info(response);
			blockUIApp.hidePleaseWait();
		}
	});
};

function searchMenu(role){
	menuleft = '';
	var params = {
		roleId : role
    };
	blockUIApp.showPleaseWait();
    $.ajax({
                method : 'POST',
                data : params,
                url : path+"mainEyeSearchMenu",
                success : function(response) {
                	 var json = JSON.parse(response);
                     var records = json.searchMainEyeMenu.data;
                     var grouped = _.groupBy(records, function(record) {
                       return record.header_menu_id;
                     });
                     $.each(grouped, function (i, items) {
                    	 menuleft += '<li class="nav-item nav-dropdown" id="navbarid'+items[0].header_menu_id+'">'
                    	 		  +  '<a class="nav-link nav-dropdown-toggle" href="#" style="background-color: #33444c">'
                    	 		  +  '<i class="'+items[0].header_menu_icon+'"></i>'+items[0].header_menu_desc+'</a>'
                    	 		  +  '<ul class="nav-dropdown-items">'
                    	  $.each(items, function (i, item) {
                    		  var pageCode = item.page_code.replace('.html', '');
                    		  menuleft += '<li class="nav-item" id="'+pageCode.replace('/', '')+'NavDetail">'
                    			       +  '<a class="nav-link" onclick="'+pageCode.replace('/', '')+'()" style="cursor:pointer;">'+item.page_dese+'</a>'
                    			       +  '</li>'
                    	  });
                    	 menuleft += '</ul>'
                    		      +  '</li>'
                     });
                     $('#menuleft').append(menuleft);
                    blockUIApp.hidePleaseWait();
                },
                failure : function(response) {
                    console.info(response);
                    blockUIApp.hidePleaseWait();
                }
          });
};

var tokenCsrf = 'XSRF-TOKEN';
var headerCsrf = 'X-XSRF-TOKEN';
function getCsrf() {

	if (Cookies.get(tokenCsrf) == undefined || Cookies.get(tokenCsrf) == null || Cookies.get(tokenCsrf) == '' || Cookies.get(tokenCsrf) == 'undefined') {
		blockUIApp.showPleaseWait();
		$.ajax({
			method: 'GET',
			url: path + "csrf",
			success: function (response) {
				var json = JSON.parse(response);

				$.ajaxSetup({
					beforeSend: function (xhr) {
						xhr.setRequestHeader(headerCsrf, json.token);
					}
				});

				blockUIApp.hidePleaseWait();
			},
			failure: function (response) {
				console.info(response);
				blockUIApp.hidePleaseWait();
			}
		});
	} else {
		$.ajaxSetup({
			beforeSend: function (xhr) {
				xhr.setRequestHeader(headerCsrf, Cookies.get(tokenCsrf));
			}
		});
	}
};

$(document).ready(function (patheyemin) {
	path = contextRoot;
	getCsrf();
	var token = Cookies.get(tokenJWT);
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	var JSONObject = JSON.parse(window.atob(base64));
	var jsonarray = JSONObject["authorities"];
	usernameToken = JSONObject["user_name"];
	var role = parseInt(jsonarray[0]);
	searchMenu(role);
	searchToken();
	$('#maineye').load('eyeminmonitor.html');
});


var tokenJWT = 'X-JWT-TOKEN';
function logout() {
	if (Cookies.get(tokenJWT)) {
		Cookies.remove(tokenJWT)
	}
	window.location.href = path + "login.html";
};