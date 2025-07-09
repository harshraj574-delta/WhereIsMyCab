$(document).ready(function() {
	
	
	
	
    driver_profile = [];
    driver_contact = [];
    var myTrackingStatus = [];
    var trip_status = [];
    var trip_type1 = "";
    var OTP = "";
    var b2bflag = "";
    driver = [];
    tptContactNo = [];
    var lastStatus = "";
    var lastTripStatus = "";
    var curStatus = "";
    var homelatlng = "";
    var latlnghome;
    if (value || value1) {
        $.ajax({
            cache: false,
            type: "GET",
            username: "user1",
            password: "Acc@bang10",
            url: "https://www.etmsdrive.in/appControlRest/api/v1/getClientDetailById",
            data: {
                CID: clientid
            },
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccess3,
            error: OnError3
        });

        function OnSuccess3(data, status) {
            $("#loader").hide();
            $("#output").empty();
            $.each(JSON.parse(data), function(key, val) {
                url.push(val.URL);
                //BASE_URL = url[0];
                //TrackURL = val.dashboardurl; // uncommnent this one when this comes from api
                TrackURL = val.trackurl; //Changed by Anurag, On 29-11-17, to implemnet in amex
                BASE_URL = val.trackurl; //Changed by Anurag, On 29-11-17, to implemnet in amex				
                // //until then use this one below.
                //TrackURL = "https://www.etmsdrive.in/etmsDrive/api/tracking/v1/";
                MEDIA_URL = "";
                //#change
                var URL_cabvalidation = TrackURL + "MyCabValidation";
                var URL_ProfilePicture = val.photourl;
                URL_CallingAPI = TrackURL + "CallingAPI";
                URL_RouteInfo = TrackURL + "GetRouteInfoMyCab";
                URL_RouteDetail = TrackURL + "GetRouteDetail";
                URL_GetGPSLogger = TrackURL + "GetGPSLogger";
                var temp_url = TrackURL.split("/");
                MEDIA_URL = temp_url[0] + "/" + temp_url[1] + "/" + temp_url[2] + "/" + temp_url[3] + "/";
                console.log(routeid);
                $.ajax({
                    type: "POST",
                    url: URL_cabvalidation, //var	URL_cabvalidation = BASE_URL+"MyCabValidation";
                    username: "user1",
                    password: "Acc@bang10",
                    data: "{routeid:'" + routeid + "',employeeid:'" + empid + "'}",
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: OnSuccess1,
                });
                console.log(URL_cabvalidation);

                function OnSuccess1(data, status) {
                    $("#loader").hide();
                    $('#output').empty();
                    $.each(JSON.parse(data), function(key, val) {
                        if (val.res == 'success') {
                            var URL1;
                      
                            $.ajax({
                                type: "POST",
                                username: "user1",
                                password: "Acc@bang10",
                                url: URL_RouteInfo, //URL_RouteInfo = BASE_URL+"GetRouteInfoMyCab";
                                data: "{RouteID:'" + routeid + "'}",
                                crossDomain: true,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: OnSuccess2,
                                error: OnError2
                            });
                            //	console.log(URL_RouteInfo)
                            function OnSuccess2(data, status) {
                                $("#loader").hide();
                                //$('#output').empty();
                                $.each(JSON.parse(data), function(key, val) {
                                    //	console.log(JSON.stringify(data, null, 4))
                                    if (val.routeID != 'NA') {
                                        //var profileurl = MEDIA_URL + "ProfilePicture/" + val.ProfilePicture;										
                                        driver_contact.push(val.driverContact);
                                        var profileurl = URL_ProfilePicture + val.driverContact + ".jpeg";
                                        //var profileurl =URL_ProfilePicture
                                        var p = val.vehicleRegNo.toUpperCase();
                                        if (val.isb2b == "1") {
                                            b2bflag = "3";
                                        } else {
                                            b2bflag = "1";
                                        }
                                        lastStatus = myTrackingStatus;
                                        lastTripStatus = trip_status;
                                        var myinterval1 = setInterval(function() {
                                            // changed by anurag, on 4 dec 17, to make it run in amex as actVehiclestartTime is coming with vehicleStarttime.
                                            if ((!val.actVehicleEndTime) || clientid == "12" || clientid == "5" || clientid == "10" || clientid == "11") {
                                                if (value1 == 's' || myTrackingStatus == "No-Show") {
                                                    var call_btn = document.getElementById('call_btn');
                                                    call_btn.style.display = 'none';
                                                    var help_btn = document.getElementById('help_btn');
                                                    help_btn.style.display = 'inherit';
                                                } else if (myTrackingStatus == "Boarded") {
                                                    var call_btn = document.getElementById('call_btn');
                                                    call_btn.style.display = 'none';
                                                    var help_btn = document.getElementById('help_btn');
                                                    help_btn.style.display = 'inherit';
                                                } else {
                                                    var call_btn = document.getElementById('call_btn');
                                                    call_btn.style.display = 'inherit';
                                                    var help_btn = document.getElementById('help_btn');
                                                    help_btn.style.display = 'inherit';
                                                }
                                            } else {
                                                // DIALOG BOX SUGGESSTING THAT THE TRIP IS ALREADY COMPLETED
                                                var centerControlDiv5 = document.createElement('div');
                                                centerControlDiv5.id = "centerControlDiv5";
                                                var centerControl5 = new CenterControl5(centerControlDiv5);
                                                centerControlDiv5.index = 4;
                                                map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv5);
                                                window.clearInterval(myinterval1);
                                                myinterval1 = null;
                                            }
                                        }, 3000);
                                        setInterval(function() {
                                            document.getElementById('td_dname').innerHTML = "<strong>" + val.driverName.toUpperCase() + "</strong>";
                                            //changed by anurag on 09 dec , for amex vehicle number was not coming
                                            //document.getElementById('td_regno').innerHTML = p;
                                            document.getElementById('td_regno').innerHTML = val.vehicleNo.toUpperCase();
                                            document.getElementById('td_vtype').innerHTML = val.vehicleType.toUpperCase();
                                            // document.getElementById('boarding_status').innerHTML = "<strong>" + myTrackingStatus.toUpperCase() + "</strong>";
                                            if (myTrackingStatus != '----') {
                                                document.getElementById('boarding_status').innerHTML = '<strong style="background-color: #42f474;">' + myTrackingStatus.toUpperCase() + '</strong>';
                                            } else {
                                                document.getElementById('boarding_status').innerHTML = '<strong></strong>';
                                            }
                                            document.getElementById('Otp').innerHTML = '<strong>OTP:</strong>' + OTP;
                                        }, 3000);
                                        setTimeout(function() {
										//	$("#boxs").show();
                                            var img = new Image();
                                            var div = document.getElementById('circle');
                                            img.id = "driverImage";
                                            img.src = profileurl;
                                            img.style.width = '100%';
                                            img.style.height = '100%';
                                            img.style.borderRadius = '50%';
                                            img.style.Border = '20px solid red';
                                            div.appendChild(img);
                                            $("#driverImage").on("error", function() {
                                                $(this).attr('src', 'img_avatar.png');
                                            });
                                            // TRANSPORT DEPARTMENTS CONTACT NUMBER IS STORED HERE
                                            var aTag = document.getElementById('aTag');
                                            aTag.setAttribute('data-rel', 'external');
                                            aTag.setAttribute('href', 'tel:' + val.tptContactNo);
                                            //SAME (HARD-CODED)
                                            var sos = document.getElementById('sos');
                                            sos.setAttribute('data-rel', 'external');
                                            sos.setAttribute('href', 'tel:' + val.tptContactNo);
                                        }, 500);
                                    } else {
                                        $("#output").empty();
                                        $("#output").html("<b>NO DATA FOUND</b>");
                                    }
                                });
                            }

                            function OnError2(request, status, error) {
                                $("#loader").hide();
                                $("#output").empty();
                                $("#output").html("Error: Connecting to server");
                            }
                        } else {
                            $("#output").html("<b>" + val.res + "</b>");
                        }
						      callWebService2();
                    });
                }

                function callWebService2() {
                    markerArray = [];
                    Points2 = [];
                    device_ids = [];
                    tmp = [];
                    temp = [];
                    trip_type = [];
                    tracking_status = [];
                    $.ajax({
                        type: "POST",
                        username: "user1",
                        password: "Acc@bang10",
                        url: URL_GetGPSLogger, //URL_GetGPSLogger = BASE_URL+"GetGPSLogger2";
                        data: "{deviceId: '" + routeid + "',vendorid:'0'}",
                        crossDomain: true,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: OnSuccess5,
                        error: OnError5
                    });

                    function OnSuccess5(data, status) {
                        $('#output').empty();
                        $.each(JSON.parse(data), function(key, val) {
                            lat = val.lat;
                            lng = val.lng;
                            Points2.push(new google.maps.LatLng(lat, lng)); //INITIAL
                            device_ids.push(val.deviceId);
                            tmp.push(new google.maps.LatLng(lat, lng)); // TEMPORARY LAT..LONG
                            trip_status.push(val.facility);
                        });
                        setInterval(function() {
                            $.ajax({
                                type: "POST",
                                username: "user1",
                                password: "Acc@bang10",
                                url: URL_RouteDetail, //URL_RouteDetail = BASE_URL+"GetRouteDetail";
                                //data: "{RouteID: '" + routeid + "',flag:'1'}",
                                data: "{RouteID: '" + routeid + "',flag:'" + b2bflag + "'}",
                                crossDomain: true,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: sucess,
                                error: err
                            });

                            function sucess(data, status) {
                                //console.log(JSON.stringify(data))
                                //$('#output').empty();
                                $.each(JSON.parse(data), function(key, val) {
                                    tracking_status.push(val.trackingStatus);
                                    trip_type.push(val.tripType);
                                    if (val.id == empid) {
                                        myTrackingStatus = val.trackingStatus
                                        localStorage.setItem('mts', myTrackingStatus);
                                        trip_type1 = trip_type[0];
                                        OTP = val.boardingOTP;
                                        var lathome = val.lat;
                                        var lnghome = val.lng;
                                        homelatlng = {
                                            lat: lathome,
                                            lng: lnghome
                                        };
                                        console.log(homelatlng);
                                    } else {
                                        //alert(val.employeeID)
                                    }
                                });
                            }

                            function err(request, status, error) {
                                $("#output").html(request.statusText);
                            }
                        }, 3000);
                        //INITIALISES THE MAP
                        initMapPickup(); //INITIALISES THE MAP
                    }

                    function OnError5(request, status, error) {
                        $("#output").html(request.statusText);
                    }
                }

                function initMapPickup() {
                    if (Points2[0]) {
                        $("#output").empty();
                        var output;
                        myZoomLevel = 15;
                        var startLatlng = Points2[0];
                        var mapOptions2 = {
                            zoom: myZoomLevel,
                            center: startLatlng, // should be myPos ......
                            tilt: 45,
                            zoomControl: true,
                            zoomControlOptions: {
                                position: google.maps.ControlPosition.RIGHT_BOTTOM
                            },
                            panControl: true,
                            //VARIOUS GOOGLE MAP OPTIONS WHICH ARE TURNED OFF		 
                            mapTypeControl: false,
                            scaleControl: false,
                            fullscreenControl: false,
                            streetViewControl: false
                        };
                        map = new google.maps.Map(document.getElementById('map'), mapOptions2);
                        var marker = null;

                        function autoUpdate() {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                var newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                if (marker) {
                                    // Marker already created - Move it
                                    marker.setPosition(newPoint);
                                } else {
                                    // Marker does not exist - Create it
                                    marker = new google.maps.Marker({
                                        position: newPoint,
                                        icon: "https://i.stack.imgur.com/VpVF8.png",
                                        map: map
                                    });
                                }
                                if (myTrackingStatus == "Boarded") {
                                    //console.log(myTrackingStatus);
                                    marker.setMap(null);
                                }
                                // Center the map on the new position
                                // map.setCenter(newPoint);
                            });
                            // Call the autoUpdate() function every 5 seconds
                            setTimeout(autoUpdate, 5000);
                        }
                        if (clientid == '5' || clientid == '11' || clientid == '12') {
                            autoUpdate();
                        } else {}
                        /* 	var trafficLayer = new google.maps.TrafficLayer();

						trafficLayer.setMap(map);
						map.mapTypes.set('styled_map', styledMapType);
						map.setMapTypeId('styled_map');
 */
                       
                            //BOX HOLDING THE VARIOUS OPTIONS SUCH AS CALL,TRANSPORT DEPT ETC
                            var centerControlDiv2 = document.createElement('div');
                            var centerControl2 = new CenterControl2(centerControlDiv2);
                            centerControlDiv2.index = 1;
                            centerControlDiv2.id = "box";
							
                            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv2);
                            //		alert(myTrackingStatus)
                            /* 								
                            									//RECENTRE OPTION
                            									var centerControlDiv8 = document.createElement('div');
                            									var centerControl8 = new CenterControl8(centerControlDiv8);
                            									centerControlDiv8.index = 7;
                            									map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv8);
                             */
                            //RECENTRE OPTION
                            var centerControlDiv3 = document.createElement('div');
                            var centerControl3 = new CenterControl3(centerControlDiv3);
                            centerControlDiv3.index = 8;
                            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv3);
                     
                        /* setInterval(function(){
							$("boarding_status").remove();
							
							
							
							
						},4000); */
                        updatePickup();
                    } else {
                        $("#output").empty();
                        $("#output").html("<b>Cab location cannot be determined.</b>");
						
				  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){

         var lat = position.coords.latitude;
         var lng = position.coords.longitude;
        
		
                                myZoomLevel = 15;
                       // var startLatlng = Points2[0];
					   var mypoint= {
                                            lat: lat,
                                            lng: lng
                                        };
					
                        var mapOptions2 = {
                            zoom: myZoomLevel,
                            center: mypoint, // should be myPos ......
                            tilt: 45,
                            zoomControl: true,
                            zoomControlOptions: {
                                position: google.maps.ControlPosition.RIGHT_BOTTOM
                            },
                            panControl: true,
                            //VARIOUS GOOGLE MAP OPTIONS WHICH ARE TURNED OFF		 
                            mapTypeControl: false,
                            scaleControl: false,
                            fullscreenControl: false,
                            streetViewControl: false
                        };
                        map = new google.maps.Map(document.getElementById('map'), mapOptions2);
						 


						 var centerControlDiv2 = document.createElement('div');
                            var centerControl2 = new CenterControl2(centerControlDiv2);
                            centerControlDiv2.index = 1;
                            centerControlDiv2.id = "box";
							
                            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv2);
							
							
                            //		alert(myTrackingStatus)
                            /* 								
                            									//RECENTRE OPTION
                            									var centerControlDiv8 = document.createElement('div');
                            									var centerControl8 = new CenterControl8(centerControlDiv8);
                            									centerControlDiv8.index = 7;
                            									map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv8);
                             */
                            //RECENTRE OPTION
                            var centerControlDiv3 = document.createElement('div');
                            var centerControl3 = new CenterControl3(centerControlDiv3);
                            centerControlDiv3.index = 8;
                            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv3);
						$('#bottomdiv').append(box);

      });
   } 
                              
                                // Center the map on the new position
                                // map.setCenter(newPoint);
                          					


						
						
						
                    }
                    map.addListener('dragstart', function() {
                        //alert("clicked");
                    });
                }

                function updatePickup() {
                        //changes......................................................................................................................................
                        /*	if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function (position) {



							var pos = {
								lat: position.coords.latitude,
								lng: position.coords.longitude
							};
						

	mypos = pos;						
		*/
                        //   map.setCenter(pos);
                        // if (myTrackingStatus != 'Boarded' && trip_status != 'Completed') {
                        // 	var marker = new google.maps.Marker({
                        // 		position: pos,
                        // 		map: map,
                        // 		title: 'You are here!!!!',
                        // 		icon: 'marker.svg'
                        // 	});
                        // } else {
                        // 	//ddd
                        // }
                        //var image = 'https://cdn0.iconfinder.com/data/icons/my-house-1/512/015-myhouse-128.png';
                        if (clientid == '5' || clientid == '11' || clientid == '12') {
                            console.log("hi")
                            setTimeout(function() {
                                latlnghome = new google.maps.LatLng(homelatlng.lat, homelatlng.lng);
                                var marker = new google.maps.Marker({
                                    position: latlnghome,
                                    map: map,
                                    icon: 'home.png'
                                });
                            }, 6000);
                        } else {
                            console.log("hieeeee")
                        }
                        //	});
                        //}
                        $.ajax({
                            type: "POST",
                            username: "user1",
                            password: "Acc@bang10",
                            url: URL_GetGPSLogger,
                            data: "{deviceId: '" + routeid + "',vendorid:'0'}",
                            crossDomain: true,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: OnSuccess4,
                            error: OnError4
                        });

                        function OnSuccess4(data, status) {
                            $('#output').empty();
                            Points2 = [];
                            device_ids = [];
                            $.each(JSON.parse(data), function(key, val) {
                                lat = val.lat;
                                lng = val.lng;
                                Points2.push(new google.maps.LatLng(lat, lng));
                                device_ids.push(val.deviceId);
                            });
                        }

                        function OnError4(request, status, error) {
                            $("#output").html(request.statusText);
                        }
                        heading.push(google.maps.geometry.spherical.computeHeading(tmp[0], Points2[0]));
                        if (heading[0] != 0) {
                            capture = heading[0];
                            car_icon.rotation = heading[0];
                        } else {
                            car_icon.rotation = capture;
                        }
                        createMarker3();
                        tmp.push(Points2[0]);
                        tmp.shift();
                        heading.shift();
                        setTimeout(function() {
                            updatePickup();
                        }, 1000);
                    }
                    /* 
				//time calculation
				function myFunction1()
				{
				var origin =new google.maps.LatLng(13.0031,77.5643); 
				var destination = Points2[i];
				var service = new google.maps.DistanceMatrixService();var date = new Date();
				date.setDate(date.getDate() + 1);
				var DrivingOptions = {
				departureTime: date,
				trafficModel: 'pessimistic'
				};

				service.getDistanceMatrix(
				{
				origins: [origin],
				destinations: [destination],
				travelMode: 'DRIVING',
				drivingOptions : DrivingOptions,
				unitSystem: google.maps.UnitSystem.METRIC,
				durationInTraffic: true,
				avoidHighways: false,
				avoidTolls: false
				}, response_data);function response_data(responseDis, status) {
				if (status !== google.maps.DistanceMatrixStatus.OK || status != "OK"){
				console.log('Error:', status);
				// OR
				alert(status);
				}else{
				eta=responseDis.rows[0].elements[0].duration_in_traffic.text;
				}
				}
				}
				setInterval(myFunction1,4000);
				*/
                function createMarker3() {
                    for (var i = 0; i < Points2.length; i++) {
                        address = [];
                        if (markerArray[i]) {
                            var device = device_ids[i];
                            markerArray[i].setIcon(car_icon);
                            createinfowindow(markerArray[i], Points2[i], device_ids[i], heading);
                            markerArray[i].animateTo(Points2[i], {
                                easing: "linear",
                                duration: 1750,
                                complete: function() {
                                    //  alert("animation complete");
                                }
                            });
                            var recenter = $("#recenter");
                            if (recenter) {
                                if (recenter.css('display') == 'none') {
                                    map.panTo(Points2[i]);
                                }
                            } else {
                                //	console.log("recenter does not exist");
                            }
                        } else {
                            var marker3 = new google.maps.Marker({
                                position: Points2[i],
                                map: map,
                                icon: car_icon,
                                easing: "swing"
                            });
                            markerArray.push(marker3);
                            createinfowindow(marker3, Points2[i], device_ids[i], heading);
                        }
                    }
                }

                function transition(marker, temp, point) {
                    marker1 = marker;
                    i = 0;
                    deltaLat = (tmp[0].lat() - Points2[0].lat()) / numDeltas;
                    deltaLng = (tmp[0].lng() - Points2[0].lng()) / numDeltas;
                    moveMarker(marker1, deltaLat, deltaLng);
                }

                function moveMarker(marker, deltaLat, deltaLng) {
                    var pos1 = tmp[0].lat() + deltaLat;
                    var pos2 = tmp[0].lng() + deltaLng;
                    var latlng = new google.maps.LatLng(pos1, pos2);
                    markerArray[0].setPosition(latlng);
                    if (i != numDeltas) {
                        i++;
                        setTimeout(moveMarker, delay);
                    }
                }
            });
        }

        function OnError3(request, status, error) {
            $("#loader").hide();
            $("#output").empty();
            $("#output").html(request.statusText);
        }
    } else {
        $("#loader").hide();
        $("#output").empty();
        $("#output").html("Incorrect Parameters");
    }
});