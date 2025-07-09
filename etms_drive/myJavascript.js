function getQueryStringValue(key) {
  return unescape(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
        escape(key).replace(/[\.\+\*]/g, "\\$&") +
        "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}

function getQueryStringValue1(key) {
  return unescape(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
        escape(key).replace(/[\.\+\*]/g, "\\$&") +
        "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$2"
    )
  );
}

value = getQueryStringValue("v");
var value1 = getQueryStringValue("s");
//parses the string to get the value for route id , client id and empid
//its of the form clientid-routeid-empid
vs = value.substring(4, value.length);

// routeid = value.substring(4, value.indexOf(value.slice(value.length - 5, value.length)));
// routeid = '3553UB1000010';
clientid = parseInt(value.substring(0, 4));


// below change for 5 digit and 6 digit empId 


if(clientid == 4||clientid == 10||clientid == 13) {    
  if(value.length==22){
    empid = parseInt(value.slice(value.length - 5, value.length));  
    routeid = vs.substring(0, vs.length - 5);
  } else{
    empid = parseInt(value.slice(value.length - 6, value.length));
    routeid = vs.substring(0, vs.length - 6);
  }
} else{
empid = parseInt(value.slice(value.length - 6, value.length));
routeid = vs.substring(0, vs.length - 6);
}


//Global variables

var BASE_URL = "";
var MEDIA_URL = "";
var URL_getClientDetail = BASE_URL + "getClientDetail";
var URL_cabvalidation = null;
var mypos = "";
var myLat = "";
var myLong = "";
var distancefrom = "";
var eta = "";
///////////////////////--------------------------------------------/////////////////////////

var Points2 = [];
var device_ids = [];
var tmp = [];
var heading = [];
var flightPath2 = null;
var capture;
var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat;
var deltaLng;
var driver_contact = [];
var driver_profile = [];
var driver = [];
var tptContactNo = [];
var url = [];
var sharedStat = "";

var ic = "ic_booking_mini_map_topview.png";
var car =
  "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z"; // SVG FOR THE CAR

var car_icon = {
  path: car,
  scale: 0.7,
  strokeColor: "white",
  strokeWeight: 0.1,
  fillOpacity: 1,
  fillColor: "#404040",
  offset: "5%",
  anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
};

function CenterControl2(controlDiv2) {
  // Set CSS for the control border.

  var main = document.createElement("div");
  main.style.backgroundColor = "#fff";
  main.style.border = "4px solid #fff";

  main.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  main.style.cursor = "pointer";

  main.style.marginRight = "10px";
  main.style.marginBottom = "22px";
  main.style.marginLeft = "-18px";
  main.style.height = "125px";
  main.style.width = "305px";

  main.style.textAlign = "Left";
  controlDiv2.appendChild(main);

  var circlemain = document.createElement("div");
  var circle = document.createElement("div");

  circle.id = "circle";
  var textcontent = document.createElement("div");
  textcontent.style.width = "40%";
  textcontent.style.height = "100%";
  textcontent.style.float = "left";
  textcontent.style.marginLeft = "12px";

  var call_btn = document.createElement("div");
  var help_btn = document.createElement("div");

  ///////////////////////////-------CIRCLE------------////////////
  call_btn.id = "call_btn";
  help_btn.id = "help_btn";

  circle.style.width = "100%";
  circle.style.height = "100%";
  circle.style.borderRadius = "50%";
  circle.style.marginTop = "2px";
  circle.style.marginLeft = "5%";
  circle.style.Border = "20px solid red";
  circle.style.boxShadow = "0 4px 6px rgba(0,0,0,.6)";
  circlemain.style.width = "30%";
  circlemain.style.float = "left";
  circlemain.style.height = "78%";
  circlemain.style.marginTop = "3px";

  call_btn.style.height = "50%";
  call_btn.style.width = "15%";
  call_btn.style.float = "right";
  call_btn.style.display = "none";

  help_btn.style.height = "50%";
  help_btn.style.width = "15%";
  help_btn.style.float = "right";
  help_btn.style.display = "none";
  var x = document.createElement("TABLE");
  x.style.marginLeft = "5%";
  x.style.marginTop = "5px";
  x.style.fontFamily = "Roboto,Arial,sans-serif";
  x.style.fontSize = "12px";
  x.style.lineHeight = "20px";
  x.id = "ddetail";
  textcontent.appendChild(x);

  var dname = document.createElement("TR");
  dname.id = "dname";
  x.appendChild(dname);

  

  var dreg = document.createElement("TR");
  dreg.id = "dreg";
  x.appendChild(dreg);
  var vtype = document.createElement("TR");
  vtype.id = "vtype";
  x.appendChild(vtype);
  var boarding = document.createElement("TR");
  boarding.id = "boarding";
  x.appendChild(boarding);

var OTP= document.createElement("TR");
  dname.id = "OTP";
  x.appendChild(OTP);

  var td_dname = document.createElement("TD");
  var td_regno = document.createElement("TD");
  var td_vtype = document.createElement("TD");
  var boarding_status = document.createElement("TD");

 var Otp= document.createElement("TD");

  td_dname.id = "td_dname";
  td_regno.id = "td_regno";
  td_vtype.id = "td_vtype";
  boarding_status.id = "boarding_status";

Otp.id = "Otp";  

dname.appendChild(td_dname);
  dreg.appendChild(td_regno);
  vtype.appendChild(td_vtype);
  boarding.appendChild(boarding_status);
	
  OTP.appendChild(Otp);


  var callbutton = document.createElement("BUTTON");
  callbutton.innerHTML =
    '<img style="width:90%;height:90%" src="phone.svg"></img>';
  callbutton.style.boxShadow = "0 2px 6px rgba(0,0,0,.6)";
  call_btn.appendChild(callbutton);
  callbutton.style.height = "35px";
  callbutton.style.width = "35px";
  callbutton.style.marginTop = "6px";
  callbutton.style.border = "None";
  callbutton.id = "driver";
  var helpbutton = document.createElement("BUTTON");
  var aTag = document.createElement("a");
  aTag.innerHTML = '<img style="width:90%;height:90%" src="headset.svg"></img>';
  help_btn.appendChild(helpbutton);
  helpbutton.appendChild(aTag);
  helpbutton.style.height = "35px";
  helpbutton.style.width = "35px";
  helpbutton.style.marginTop = "6px";
  helpbutton.style.boxShadow = "0 2px 6px rgba(0,0,0,.6)";
  helpbutton.style.border = "None";
  helpbutton.id = "helpbutton";
  aTag.id = "aTag";

  main.appendChild(circlemain);
  circlemain.appendChild(circle);
  main.appendChild(call_btn);
  main.appendChild(textcontent);
  main.appendChild(help_btn);
  callbutton.addEventListener("click", function () {
    callLatch();
  });
}



function CenterControl3(controlDiv3) {
  var circle2 = document.createElement("div");
  /* circle2.style.marginBottom = "8.5vh";
  circle2.style.marginRight = "10px"; */
  circle2.style.display = "none";
  circle2.innerHTML = '<img style="width:55px;height:55px margin-bottom: 120px;" src="center1.svg"></img>';
  circle2.id = "recenter";
  controlDiv3.appendChild(circle2);

  circle2.addEventListener("click", function () {
     map.panTo(Points2[i]);
    map.setCenter(Points2[i]);
    map.setZoom(15);

    document.getElementById("recenter").style.display = "none";
  });

  map.addListener("dragstart", function () {
    //state='1';
    document.getElementById("recenter").style.display = "inherit";
  });
}
//drop recenter
function CenterControl8(controlDiv8) {
  var circle8 = document.createElement("div");
  /* circle8.style.marginBottom = "8.5vh";
  circle8.style.marginRight = "10px"; */
  circle8.style.display = "none";
  circle8.innerHTML =
    '<img style="width:55px;height:55px; margin-bottom: 120px;" src="center1.svg"></img>';
  circle8.id = "recenter1";
  controlDiv8.appendChild(circle8);

  circle8.addEventListener("click", function () {
    map.panTo(Points2[i]);
    map.setCenter(Points2[i]);
    map.setZoom(13);
    document.getElementById("recenter1").style.display = "none";
  });
  map.addListener("dragstart", function () {
    document.getElementById("recenter1").style.display = "inherit";
  });
}
/* 
function myFunction() {
  var directionsService = new google.maps.DirectionsService();
  var request = {
    origin: mypos, // a city, full address, landmark etc
    destination: Points2[i],
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      distancefrom = response.routes[0].legs[0].distance.value / 1000;
    } else {
      // oops, there's no route between these two locations
      // every time this happens, a kitten dies
      // so please, ensure your address is formatted properly
    }
  });
}
setInterval(myFunction, 10000); */

/* // DISTANCE CALCULATION
function CenterControl(controlDiv)
{


var circle = document.createElement('div');

circle.style.marginBottom = '8.5vh';
circle.style.marginRight = '17px';
circle.style.display = 'none';
circle.innerHTML = '<img style="width:35px;height:35px" src="distance.png"></img>'
circle.id='distance';
controlDiv.appendChild(circle);
circle.addEventListener('click', function(){

alert("The cab is " +distancefrom+" kilometers away" ); // the distance in km
});
map.addListener('dragstart', function() 
{
document.getElementById('distance').style.display='inherit';
});

}
*/

var myUrl = window.location.href;
//alert(myUrl);
var murl = myUrl.split("&");
var surl = murl[1];
//alert(murl.length);
//share-------------------------------------------------------------------------------------------------------
function CenterControl7(controlDiv7) {

  controlDiv7.id = "controlDiv7";
  controlDiv7.style.marginRight = "-30px";



  var sharebut = document.createElement("div");

  //sharebut.style.marginBottom = "8.5vh";

  sharebut.style.marginTop = "30%";
  sharebut.style.marginRight = "17px";
  sharebut.style.paddingTop = "40px";
  sharebut.style.width = "65px";
  sharebut.style.display = "block";
  sharebut.innerHTML = '<i id="v" class="fa fa-share-alt fa-3x"></i></img>';
  sharebut.id = "sharebut";
  controlDiv7.appendChild(sharebut);

  var sharebut1 = document.createElement("div");

  sharebut1.style.backgroundColor = "#fff";
  sharebut1.style.border = "4px solid #fff";

  sharebut1.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";


  sharebut1.style.marginRight = "10px";
  sharebut1.style.marginTop = "22px";
  sharebut1.style.marginLeft = "-18px";
  sharebut1.style.height = "140px";
  sharebut1.style.width = "65px";

  sharebut1.style.cursor = "pointer";

  //sharebut1.style.marginBottom = "8.5vh";
  sharebut1.style.marginRight = "17px";
  //sharebut1.style.paddingTop = "20px";
  sharebut1.style.display = "none";
  sharebut1.id = "sharebut1";
  //sharebut1.innerHTML = '<span id="close" style=float="right" >&times</span>';
  sharebut.appendChild(sharebut1);

  var circle7 = document.createElement("div");

  //circle7.style.marginBottom = "8.5vh";
  circle7.style.marginRight = "17px";
  circle7.style.marginTop = "10px";
  circle7.style.display = "none";
  circle7.style.width = "60px";
  circle7.innerHTML = ' <img style="width:55px;height:55px" src="whatsapp.png"></img>';
  circle7.id = "share";
  circle7.title = "whatsapp";
  sharebut1.appendChild(circle7);
  circle7.addEventListener("click", share);

  var sms = document.createElement("div");

  // sms.style.marginTop = "-57px";
  sms.style.paddingTop = "10px";
  sms.style.display = "none";
  sms.style.width = "60px";
  sms.innerHTML = ' <img style="width:55px;height:55px" src="sms.png"></img>';
  sms.id = "share1";
  sms.title = "SMS";
  sharebut1.appendChild(sms);



  sharebut.addEventListener("click", function () {
    $("#sharebut1").slideToggle(500);
    $("#share").show();
    $("#share1").show();
  });



  circle7.addEventListener("click", share);
  sms.addEventListener("click", share1);

  function share() {
    $(document).ready(function () {
      var isMobile = {
        Android: function () {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
          return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
          );
        }
      };
      //alert(isMobile)
      if (isMobile.any()) {


        var url = myUrl + "&s=s";
        var message = encodeURIComponent(url);
        //sharedStat=1;
        var whatsapp_url = "whatsapp://send?text=" + message;
        window.location.href = whatsapp_url;
      } else {
        alert("Please share this article in mobile device");

      }
    });

  }



  function share1() {
    var getOS = function () {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPod/i)
      ) {
        return "iOS";
      } else if (userAgent.match(/Android/i)) {
        return "Android";
      } else {
        return "unknown";
      }
    }

    var device = getOS();

    var url = myUrl + "&s=s";
    var message = encodeURIComponent(url);


    if (device == "iOS") {
      window.location.href = "sms: &body=" + message;
    }

    if (device == "Android") {
      window.location.href = "sms:?body=" + message;
    }
  }
  map.addListener("dragstart", function () {
    document.getElementById("share").style.display = "inherit";
    //passive:true;
  });
}
/*  
function CenterControl4(controlDiv4)
{


var soscontainer = document.createElement('div');
soscontainer.style.marginBottom = '17vh';
soscontainer.style.marginLeft = '17px';
var sosimg = document.createElement('a');
sosimg.innerHTML = '<img style="width:35px;height:35px" src="request1.png"></img>';
sosimg.id='sos';
soscontainer.style.display = 'block';
soscontainer.appendChild(sosimg);
controlDiv4.appendChild(soscontainer);
//-------------------------------------------------------------- CALL LATCH FOR SOS ?????????????????????????????????????-----------------------------------
}
*/
function CenterControl5(controlDiv5) {
  var controlmessage = document.createElement("div");
  controlmessage.style.backgroundColor = "#fff";
  controlmessage.style.border = "2px solid #fff";
  controlmessage.style.borderRadius = "3px";
  controlmessage.style.boxShadow = "11px 7px 5px rgba(0,0,0,.3)";
  controlmessage.style.cursor = "pointer";
  controlmessage.style.marginTop = "5px";
  controlmessage.style.textAlign = "center";

  controlDiv5.appendChild(controlmessage);

  // Set CSS for the control interior.
  var controlTextmessage = document.createElement("div");
  controlTextmessage.style.color = "rgb(25,25,25)";
  controlTextmessage.style.fontFamily = "Roboto,Arial,sans-serif";
  controlTextmessage.style.fontSize = "16px";
  controlTextmessage.style.lineHeight = "38px";
  controlTextmessage.style.paddingLeft = "5px";
  controlTextmessage.style.paddingRight = "5px";
  controlTextmessage.innerHTML = "This Trip Is Already Completed!";
  controlmessage.appendChild(controlTextmessage);
  controlmessage.id = "controlmessage";
}

function callLatch() {
  confirm1 = confirm("Do you really wish to call the driver?");
  if (confirm1 == true) {
    callapi();
  }
}

function callapi() {
  $("#loader").show();
  $.ajax({
    cache: false,
    type: "POST",
    url: URL_CallingAPI,
    data: "{empid: '" +
      empid +
      "',drivermobile: '" +
      driver_contact[0] +
      "',type:'sun'}",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: OnSuccess2,
    error: OnError2
  });

  function OnSuccess2(data, status) {
    $("#loader").hide();
    $("#output").empty();
    alert("Please wait while your call is being connected");
    $.each(JSON.parse(data), function (key, val) {
      //call????
    });
  }

  function OnError2(request, status, error) {
    $("#loader").hide();
    $("#output").empty();
    $("#output").html(request.statusText);
  }
}