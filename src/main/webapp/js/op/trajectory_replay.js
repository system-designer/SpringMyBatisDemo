function TrajectoryReplay($, cityId, lineNo, direction, carNo, date){
	var map;
	var g_cityId = cityId, g_lineNo = lineNo, g_direction = direction, g_carNo = carNo;
	var tra_polyline;
	//__baseUrl = 'http://op.raymond.com:7000/universe_blkhole';
	var linemapBlueIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-wine.png", new BMap.Size(30,30));
    var offset =new BMap.Size(0,-15);
    var defaultLableOffsetSize = new BMap.Size(0, 30);
    var stopLine;
    var stopMarkers = [];
    var linemaps = [];
    var carGpsData = [];
    var sMarkers = [];
    var colorRed = "red";
    var colorGreen = "green";
    var colorBlue = "blue";
    var colorYellow = "yellow";

    var gpsCircles=[];
    var activeCircles = [];
    var begin={};
    var end={};
    var jumpMark;
    var gpsline;
    var radius = 20;
    var currentGpsFrom;
    var currentGpsType;
    var gpsDataFroms = {};

    var _this = {
    		 _initHead:function(){
    			 $('#replay_start_time').val(date.date + " " + date.start);
    			 $('#replay_end_time').val(date.end);
    			 $('#replay_start_time').change();
    			 $('#replay_end_time').change();
    			 //$('#replay_cityId').val('015');
		       },   		
    		
		       _initMap:function(){
		    	   map = new BMap.Map("replay_container");
		    	   map.enableScrollWheelZoom();
		    	   map.setMaxZoom(18);
		        },
		        
		        map_playback:function(response) {
                    gpsCircles = [];
                    carGpsData = [];
                    gpsline = undefined;
		        	var list = response['data'];
		            var items = [];
                    var gps = [];
                    var points = [];
                    var linemaplist;
	                var line;
		            for(var j = 0; j < list.length; j++){
		                var item = list[j];
		                items.push(item);
		                //有soslinemaplist的状态
		                if (item['soslinemaplist']) {
		                    linemaplist = item['soslinemaplist'];
		                    line = item['sosline'];
		                }
		                items[j].linemaplist = linemaplist;
		                items[j].line = line;

                        items[j]['carIndex'] = j;
                        points.push(new BMap.Point(items[j]['gps']['jingdu'], items[j]['gps']['weidu']));
                        gps[j] = items[j];
                        carGpsData[j] = items[j];
		            }
                    _this.renderTable(items,response.gpsVersion);
                    _this.clickTable(items,response.gpsVersion);
		            _this.drawCircles(gps,response.gpsVersion);
		            if (line) {
		            	$("#info-head").html("线路编号:<span id='head_lineNo'>"+line.lineNo + "</span>线路名称:<span>"+line.lineName + "</span>线路方向:<span>"+line.direction + "</span>");
		            }
		        },
		        
		        drawCircles:function(data,flag) {
		        	if (data) {
		        		var points = [];
		        		for (var i=0; i<data.length; i++) {
		        			var status = data[i]['status'];
		        			var comeOrLeave = data[i]['comeOrLeave'];
		        			var circle = new BMap.Circle(new BMap.Point(data[i]['gps']['jingdu'], data[i]['gps']['weidu']),radius);
		        			circle.setStrokeWeight(1);
                            //判断点的status的状态
		        			if (status >= 0) {
		        				if (comeOrLeave == '0' || comeOrLeave == '1') {
		        					circle.setFillColor(colorBlue);
			        			} else {
			        				circle.setFillColor(colorGreen);
			        			}
		        			} else {
		        				circle.setFillColor(colorRed);
		        			}
                            
                            map.addOverlay(circle);
                            gpsCircles.push(circle);
                            this.circleLeftClick(circle, i);

		        			if (i < 200) {
                                points.push(new BMap.Point(data[i]['gps']['jingdu'], data[i]['gps']['weidu']));
                                circle.show();
		        			} else {
                                circle.hide();
                            }
                            begin.circle = 	carGpsData[0];
                            begin.index = 0;
                            end.circle = carGpsData[199];
                            end.index = 199;
		        		}

		        		if (points) {
			        		if (gpsline != undefined) {
			        			map.removeOverlay(gpsline);
			        		}
			        		var  traLine = new BMap.Polyline(points, {strokeColor:"red", strokeWeight:2, strokeOpacity:0}); //创建折线对象
			        		traLine.enableMassClear();
			                map.addOverlay(traLine); //添加到地图中
                            map.setViewport(points);
			                
			                //给全局脊线变量赋值
			                gpsline = traLine;
			        	}
		        	}
		        },
		        
		        circleLeftClick:function(circle, num){
		        	circle.addEventListener("click",function(e){
		        		//表格中的相应行变色
		                $("#replay_tbody").children().each(function(){
		                    var  order=$(this).children().eq(0).text().trim();
		                    if(order==num){
		                        $(this).siblings().removeClass("selected");
		                        $(this).addClass("selected");
		                    }
		                });
		                
		                var scrollHeight2 = document.getElementById("replay_tbody").scrollHeight;
		                document.getElementById("replay_list").scrollTop=scrollHeight2*(parseInt(num)/carGpsData.length);
		        	});
		        },
		        
		        
		        renderTable:function(items,flag) {
                    var tableHtml = [];
                    for (var i=0; i<items.length; i++) {
                        var carPlaybackItem = items[i];
                        var dataFrom = carPlaybackItem['gps'].dataFrom;
                        var currentTime= carPlaybackItem['gps'].currentTime;
                        currentTime=currentTime.substring(11,currentTime.length);
                        var  modifyLine="";
                        var comeorleave="";
                        //变线
                        if (flag == 0){
                        	if (carPlaybackItem.showLine == 1){
                                modifyLine="变";
                                if (carPlaybackItem['stn']) {
                                    modifyLine += carPlaybackItem['stn'].direction;
                                }
                            }
                        } else {
                        	if (carPlaybackItem.showLine==1) {
                                modifyLine = "变";
                                if (carPlaybackItem['gps']) {
                                    modifyLine += carPlaybackItem['gps'].direction;
                                }
                            }
                        }
                        
                        //状态
                        var status=carPlaybackItem.status;
                        if (status < 0) {
                            status = "异常("+carPlaybackItem['gps'].status+")";
                        } else {
                        	status = '';
                        }
                        
                        //到离站
                        if (flag == 0){
                            if(carPlaybackItem['stn']){
                                comeorleave=carPlaybackItem['stn'].comeorleave;
                                var orderNum=carPlaybackItem['stn'].orderNum;
                                if(comeorleave=="0"){
                                    if (carPlaybackItem['stn'].modifyOrder != 0) {
                                        comeorleave="到("+orderNum + "->" + carPlaybackItem['stn'].modifyOrder +")";
                                    } else {
                                        comeorleave="到("+orderNum+")";
                                    }
                                }
                                if(comeorleave=="1"){
                                    if (carPlaybackItem['stn'].modifyOrder != 0) {
                                        comeorleave="离("+orderNum + "->" + carPlaybackItem['stn'].modifyOrder+")";
                                    } else {
                                        comeorleave="离("+orderNum + ")";
                                    }
                                }
                            }
                        }else{
                            switch(carPlaybackItem.comeOrLeave){
                                case '0':
                                    comeorleave = '到' + (carPlaybackItem.orderNum?'('+carPlaybackItem.orderNum+')':'')
                                    break;
                                case '1':
                                    comeorleave = '离' + (carPlaybackItem.orderNum?'('+carPlaybackItem.orderNum+')':'')
                                    break;
                                default :
                                    comeorleave = ''
                            }
                        }
                        tableHtml.push(
                            "<tr name='map-tr'><td width='5' align='center'>"+ carPlaybackItem['carIndex'] + "</td>" +
                                "<td width='15%' align='center' style='background-color:rgba(" + gpsTypeColors[dataFrom] + ");'>"+currentTime+"</td>" +
                                "<td width='15%' align='center'>"+status+"</td>" +
                                "<td width='15%' align='center'>"+comeorleave+"</td>" +
                                "<td width='15%' align='center'>"+modifyLine+"</td>" +
                                "<td width='10%'><button type='button' name='bBtn"+ carPlaybackItem['carIndex'] + "' class='btn btn-default btn-xs'>B</button>" +
                                "<button type='button' name='eBtn"+ carPlaybackItem['carIndex'] + "' class='btn btn-default btn-xs'>E</button></td></tr>"
                        );
                    }
                    $('#tableBody').css('margin-top', $('#tableHeader').height());
                    $("#replay_tbody").html(tableHtml.join(""));
		            $("#replay_tbody").children().each(function(){
		               var modifyLine=  $(this).children().eq(3).text();
		               var comeorleave=  $(this).children().eq(2).text();
		                if(modifyLine=="变"){
		                    $(this).addClass("warning");
		                }
		                 if(comeorleave!=""){
		                     $(this).addClass("warning");
		                 }
		             });  
		        },
		        
		        clickTable:function(items,flag) {
		            $("#replay_tbody").children().on("click",function(event){
                        var name = event.target.name;
                        if (name) {
                            var index = parseInt(name.substring(4,name.length));
                            var type= name.substring(0, 4);
                            if (type == 'bBtn') {
                                begin.circle=carGpsData[index];
                                begin.index = index;
                            }
                            if (type == 'eBtn') {
                                end.circle=carGpsData[index];
                                end.index = index;
                            }
                            if (begin.index && end.index) {
                                var points = [];
                                for (var i=0; i<gpsCircles.length; i++) {
                                    if (i >= begin.index && i<=end.index) {
                                        if (!gpsCircles[i].isVisible()) {
                                            gpsCircles[i].show();
                                        }
                                        points.push(new BMap.Point(carGpsData[i]['gps']['jingdu'], carGpsData[i]['gps']['weidu']));
                                    } else {
                                        if (gpsCircles[i].isVisible) {
                                            gpsCircles[i].hide();
                                        }
                                    }
                                }
                                if (points) {
                                    if (gpsline != undefined) {
                                        map.removeOverlay(gpsline);
                                    }
                                    var  traLine = new BMap.Polyline(points, {strokeColor:"red", strokeWeight:2, strokeOpacity:0}); //创建折线对象
                                    traLine.enableMassClear();
                                    map.addOverlay(traLine); //添加到地图中

                                    //给全局脊线变量赋值
                                    gpsline = traLine;
                                }
                            }
                        } else {

                            var currentTime= $(this).children().eq(1).text();
                            var order = $(this).children().eq(0).text();
                            var carPlaybackItem = items[order];

                            var itemTime=carPlaybackItem['gps'].currentTime.substring(11,carPlaybackItem['gps'].currentTime.length);

                            if(itemTime==currentTime){
                                $(this).siblings().removeClass("selected");
                                $(this).addClass("selected");
                                
                                var lineNo="";
                                var lineName="";
                                var direction="";
                                
                                if(carPlaybackItem['line']) {
                                    lineNo=carPlaybackItem['line'].lineNo;
                                    lineName=carPlaybackItem['line'].lineName;
                                    direction=carPlaybackItem['line'].direction;
                                    var newMaker=carPlaybackItem['linemaplist'];
                                    //重新绘线
                                    var  points=[];
                                    if (stopMarkers.length > 0) {
                                        for (var i=0; i<stopMarkers.length; i++) {
                                            map.removeOverlay(stopMarkers[i]);
                                        }
                                    }
                                    stopMarkers = [];
                                    _this.markerMap(newMaker,points);
                                    if (stopLine) {
                                        map.removeOverlay(stopLine);
                                    }
                                    var curve = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建折线对象
                                    stopLine = curve;
                                }

                                var gpsCurrentTime,gpsReceiveTime,gpsStatus,gpsDataType,
                                	gpsDegree,gpsResult,gpsSpeed,gpsLineNo,gpsDirection,
                                	dis2PreStop,dis2NextStop,alghoCarNo,carNo,originTime,
                                	modifyTime,dealTime,alghoReceiveTime, totalMiles,
                                	orderNum,dataFrom, nextOrderNum,type,newHtmlNo = '';
                                //GPS信息
                                gpsCurrentTime=carPlaybackItem['gps'].currentTime;
                                gpsCurrentTime = gpsCurrentTime ? gpsCurrentTime : '';
                                gpsCurrentTime=gpsCurrentTime.replace("T"," ");
                                gpsReceiveTime=carPlaybackItem['gps'].receiveTime;
                                gpsReceiveTime = gpsReceiveTime ? gpsReceiveTime : '';
                                gpsReceiveTime=gpsReceiveTime.replace("T"," ");
                                gpsStatus=carPlaybackItem['gps'].status;
                                gpsDataType=carPlaybackItem['gps'].dataType;
                                gpsDegree = carPlaybackItem['gps'].degree;
                                gpsSpeed=carPlaybackItem['gps'].speed;
                                gpsResult=carPlaybackItem['gps'].result;
                                gpsLineNo=carPlaybackItem['gps'].lineNo;
                                gpsDirection=carPlaybackItem['gps'].direction;
                                //----------------------------------------------
                                dis2PreStop=carPlaybackItem['gps'].dis2PreStop;
                                dis2NextStop=carPlaybackItem['gps'].dis2NextStop;
                                dataFrom=carPlaybackItem['gps'].dataFrom;
                                deviceTime = carPlaybackItem['gps'].deviceTime;
                                alghoCarNo=carPlaybackItem['gps'].alghoCarNo;
                                carNo=carPlaybackItem['gps'].carNo;
                                totalMiles = carPlaybackItem['gps'].totalMiles;
                                orderNum = carPlaybackItem.orderNum;
                                comeOrLeave = carPlaybackItem.comeOrLeave;
                                nextOrderNum = carPlaybackItem['gps'].nextOrderNum;
                                dataFrom = carPlaybackItem['gps'].dataFrom;
                                dataUpdateFrom = carPlaybackItem['gps'].dataUpdateFrom;
                                originTime = carPlaybackItem['gps'].originTime;
                                modifyTime = carPlaybackItem['gps'].modifyTime;
                                dealTime = carPlaybackItem['gps'].dealTime;
                                alghoReceiveTime = carPlaybackItem['gps'].alghoReceiveTime;
                                type = carPlaybackItem['gps'].type;
                                
                                //gpsVersion为3
                                var muName = carPlaybackItem['gps'].muName;
                                var originCarNo = carPlaybackItem['gps'].originCarNo;
                                var correctionTime = carPlaybackItem['gps'].correctionTime;
                                var nextArrTime = carPlaybackItem['gps'].nextArrTime;
                                var dataSrc = carPlaybackItem['gps'].dataSrc;
                                var originReceiveTime = carPlaybackItem['gps'].originReceiveTime;
                                var deviceCorTime = carPlaybackItem['gps'].deviceCorTime;
                                var randomNum = carPlaybackItem['gps'].randomNum;
                                var muName = carPlaybackItem['gps'].muName;
                                var muType = carPlaybackItem['gps'].muType;
                                var muCarNo = carPlaybackItem['gps'].muCarNo;
                                var muLineNo = carPlaybackItem['gps'].muLineNo;
                                var muDirection = carPlaybackItem['gps'].muDirection;
                                var muTime = carPlaybackItem['gps'].muTime;
                                var muSeconds = carPlaybackItem['gps'].muSeconds;
                                var muNextStopOrder = carPlaybackItem['gps'].muNextStopOrder;
                                var muDis2LastStop = carPlaybackItem['gps'].muDis2LastStop;
                                var muDis2NextStop = carPlaybackItem['gps'].muDis2NextStop;
                                var muOrderNum = carPlaybackItem['gps'].muOrderNum;
                                var muComeOrLeave = carPlaybackItem['gps'].muComeOrLeave;
                                
                                
                                if (flag == 0) {
                                	$("#table-info-body1").html(
                                            "<tr class='textClip'><td>线路编号:</td>" + "<td>" + gpsLineNo + "</td></tr>"
                                                +"<tr><td>线路方向:</td>" + "<td>" + gpsDirection + "</td></tr>"
                                                + "<tr><td>原始时间:</td>" + "<td>" + gpsCurrentTime + "</td></tr>"
                                                +"<tr><td>接收时间:</td>" + "<td>" + gpsReceiveTime + "</td></tr>"
                                                +"<tr><td>上站距离:</td>" + "<td>" + gpsSpeed.toFixed(2) + "</td></tr>"
                                                +"<tr><td>下站距离:</td>" + "<td>" + gpsDegree.toFixed(2) + "</td></tr>"
                                                +"<tr><td>数据状态:</td>" + "<td>" + gpsStatus + "</td></tr>"
                                                +"<tr><td>数据类型:</td>" + "<td>" + gpsDataType + "</td></tr>"
                                                +"<tr><td>处理结果:</td>" + "<td>" + gpsResult + "</td></tr>"
                                    );
                                	var stnLineNo="";
                                    var stnOrderNum="";
                                    var stnStatus="";
                                    var stnModifyOrder="";
                                    var stnDirection="";
                                    var stnCurrentTime="";
                                    var stnReceiveTime="";
                                    var stnDataType="";
                                    var stnResult="";
                                	if (carPlaybackItem['stn']) {
                                		stnLineNo=carPlaybackItem['stn'].lineNo;
                                		stnDirection=carPlaybackItem['stn'].direction;
                                		stnCurrentTime=(carPlaybackItem['stn'].currentTime ? carPlaybackItem['stn'].currentTime : '').replace("T"," ");
                                		stnReceiveTime=(carPlaybackItem['stn'].receiveTime ? carPlaybackItem['stn'].receiveTime : '').replace("T"," ");
                                        stnModifyOrder=carPlaybackItem['stn'].modifyOrder;
                                        stnStatus=carPlaybackItem['stn'].comeorleave;
                                        stnOrderNum=carPlaybackItem['stn'].orderNum;
                                        stnDataType=carPlaybackItem['stn'].dataType;
                                        stnResult=carPlaybackItem['stn'].result;
                                        if(stnStatus=="0"){
                                            stnStatus="到("+stnOrderNum+")";
                                        }
                                        if(stnStatus=="1"){
                                            stnStatus="离("+stnOrderNum+ ")";
                                        }
                                	}
                                	$("#table-info-body2").html(
                                            "<tr><td>线路编号:</td>" + "<td>" + stnLineNo + "</td></tr>"
                                                +"<tr><td>线路方向:</td>" + "<td>" + stnDirection + "</td></tr>"
                                                +"<tr><td>原始时间:</td>" + "<td>" + stnCurrentTime + "</td></tr>"
                                                +"<tr><td>接收时间:</td>" + "<td>" + stnReceiveTime + "</td></tr>"
                                                +"<tr><td>站点顺序:</td>" + "<td>" + stnOrderNum + "</td></tr>"
                                                +"<tr><td>到离站:</td>" + "<td>" + (stnStatus == '1' ? '离站' : (stnStatus == '0' ? '到站' : '')) + "</td></tr>"
                                                +"<tr><td>修正值:</td>" + "<td>" + stnModifyOrder + "</td></tr>"
                                                +"<tr><td>数据类型:</td>" + "<td>" + stnDataType + "</td></tr>"
                                                +"<tr><td>处理结果:</td>" + "<td>" + stnResult + "</td></tr>"
                                    );
                                } else if (flag == 1) {
                                	$("#table-info-body1").html('');
                                	$("#table-info-body2").html('');
                                } else if (flag == 2) {
                                	$("#table-info-body1").html('');
                                	$("#table-info-body2").html('');
                                } else if (flag == 3) {
                                	$("#table-info-body1").html(
                            				"<tr class='textClip'><td>原始车辆编号:</td>" + "<td>" + (originCarNo ? originCarNo : '') + "</td></tr>"
                                        	+"<tr class='textClip'><td>线路编号:</td>" + "<td>" + gpsLineNo + "</td></tr>"
                                            +"<tr><td>线路方向:</td>" + "<td>" + gpsDirection + "</td></tr>"
                                            +"<tr><td>状态:</td>" + "<td>" + gpsStatus + "</td></tr>"
                                            +"<tr><td>原始时间:</td>" + "<td>" + gpsCurrentTime + "</td></tr>"
                                            +"<tr><td>接收时间:</td>" + "<td>" + gpsReceiveTime + "</td></tr>"
                                            +"<tr><td>原始接收时间:</td>" + "<td>" + originReceiveTime + "</td></tr>"
                                            +"<tr><td>修正时间:</td>" + "<td>" + correctionTime + "</td></tr>"
                                            +"<tr><td>时钟修正时间:</td>" + "<td>" + (deviceCorTime ? deviceCorTime : '') + "</td></tr>"
                                            +"<tr><td>补偿时间:</td>" + "<td>" + (muTime ? muTime : '') + "</td></tr>"
                                            +"<tr><td>算法总里程:</td>" + "<td>" + totalMiles.toFixed(2) + "</td></tr>"
                                            +"<tr><td>预期下站时间:</td>" + "<td>" + (nextArrTime ? '' : nextArrTime) + "</td></tr>"
                                    );
                                	$("#table-info-body2").html(
                                			"<tr class='textClip'><td>补偿车辆编号:</td>" + "<td>" + muCarNo + "</td></tr>"
                                			+"<tr class='textClip'><td>补偿线路编号:</td>" + "<td>" + muLineNo + "</td></tr>"
                                            +"<tr><td>补偿方向:</td>" + "<td>" + muDirection + "</td></tr>"
                                			+"<tr class='textClip'><td>车辆编号:</td>" + "<td>" + (carPlaybackItem['gps'].carNo?carPlaybackItem['gps'].carNo:'') + "</td></tr>"
                                			+"<tr><td>算法报站序号:</td>" + "<td>" + (orderNum === null ? '' : orderNum) + "</td></tr>"
                                			+"<tr><td>到离站:</td>" + "<td>" + (comeOrLeave === '1' ? '离站' : (comeOrLeave === '0' ? '到站' : '')) + "</td></tr>"
                                			+"<tr><td>补偿到离站:</td>" + "<td>" + (muComeOrLeave === '1' ? '离站' : (muComeOrLeave === '0' ? '到站' : '')) + "</td></tr>"
                                			+"<tr><td>补偿站序:</td>" + "<td>" + muOrderNum + "</td></tr>"
                                            +"<tr><td>补偿下站编号:</td>" + "<td>" + muNextStopOrder + "</td></tr>"
                                            +"<tr><td>上站距离:</td>" + "<td>" + dis2PreStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>下站距离:</td>" + "<td>" + dis2NextStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>距上站米数:</td>" + "<td>" + muDis2LastStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>距下站米数:</td>" + "<td>" + muDis2NextStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>补偿名称:</td>" + "<td>" + muName + "</td></tr>"
                                            +"<tr><td>补偿说明:</td>" + "<td>" + muType + "</td></tr>"
                                            +"<tr><td>秒数:</td>" + "<td>" + muSeconds + "</td></tr>"
                                            +"<tr><td>随机数:</td>" + "<td>" + randomNum + "</td></tr>"
                                            +"<tr><td>数据源:</td>" + "<td>" + dataSrc + "</td></tr>"
                                    );
                                } else if (flag == 4) {
                                	$("#table-info-body1").html(
                            				"<tr class='textClip'><td>原始车辆编号:</td>" + "<td>" + (carPlaybackItem['gps'].carNo?carPlaybackItem['gps'].carNo:'') + "</td></tr>"
                                        	+"<tr class='textClip'><td>线路编号:</td>" + "<td>" + gpsLineNo + "</td></tr>"
                                            +"<tr><td>线路方向:</td>" + "<td>" + gpsDirection + "</td></tr>"
                                            +"<tr><td>原始时间:</td>" + "<td>" + originTime + "</td></tr>"
                                            +"<tr><td>修正时间:</td>" + "<td>" + modifyTime + "</td></tr>"
                                            +"<tr><td>算法接收时间:</td>" + "<td>" + (alghoReceiveTime ? alghoReceiveTime : '') + "</td></tr>"
                                            +"<tr><td>处理时间:</td>" + "<td>" + dealTime + "</td></tr>"
                                            +"<tr><td>里程:</td>" + "<td>" + totalMiles.toFixed(2) + "</td></tr>"
                                            +"<tr><td>报站序号:</td>" + "<td>" + (orderNum === null ? '' : orderNum) + "</td></tr>"
                                    );
                                	$("#table-info-body2").html(
                                			"<tr class='textClip'><td>算法车辆编号:</td>" + "<td>" + (carPlaybackItem['gps'].alghoCarNo?carPlaybackItem['gps'].alghoCarNo:'') + "</td></tr>"
                                			+"<tr><td>到离站:</td>" + "<td>" + (comeOrLeave === null ? '' : (comeOrLeave == '1' ? '离站' : (comeOrLeave == '0' ? '到站' : ''))) + "</td></tr>"
                                            +"<tr><td>下一站序:</td>" + "<td>" + nextOrderNum + "</td></tr>"
                                            +"<tr><td>上站距离:</td>" + "<td>" + dis2PreStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>下站距离:</td>" + "<td>" + dis2NextStop.toFixed(2) + "</td></tr>"
                                            +"<tr><td>源:</td>" + "<td>" + dataFrom + "</td></tr>"
                                            +"<tr><td>更新源:</td>" + "<td>" + dataUpdateFrom + "</td></tr>"
                                            +"<tr><td>数据状态:</td>" + "<td>" + gpsStatus + "</td></tr>"
                                            +"<tr><td>数据类型:</td>" + "<td>" + ($('#gpsType').find('option[value=' + type + ']').text() || '') + "</td></tr>"
                                    );
                                }

                                if (jumpMark) {
                                    map.removeOverlay(jumpMark);
                                }
                                for (var k=0; k<gpsCircles.length; k++) {
                                    var tagName= event.target.tagName;

                                    if (k==order && tagName=='TD') {
                                        var circle = gpsCircles[k];
                                        var point = circle.getCenter();
                                        map.centerAndZoom(point, 17);
                                        var marker = new BMap.Marker(point);  // 创建标注
                                        map.addOverlay(marker);               // 将标注添加到地图中
                                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                                        jumpMark = marker;
                                    }
                                }
                            }
                        }
		            });
		        },
		        
		        markerMap:function(newMaker,points){
		            $.each(newMaker,function(index,item){
		                var rIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-item.png",new BMap.Size(30,30));
		                var offset =new BMap.Size(0,-15);
		                var point = new BMap.Point(item.jingdu,item.weidu);
		                marker = new BMap.Marker(point,{icon:rIcon,offset:offset});  // 创建标注
		                map.addOverlay(marker);
		                if (marker) {
		                	   stopMarkers.push(marker);
		                }
		                // map.centerAndZoom(point, 15);// 将标注添加到地图中
		                var infoWindow = new BMap.InfoWindow("<h3 id='leftClickStopName'>"+item.stopName+"</h3><br>"+item.lineNo+" "+ (item.direction==0?"上行":"下行")+" 第 " + item.orderNum+" 站");
		                var label = new BMap.Label(item.orderNum);
		                label.setOffset(defaultLableOffsetSize);
		                marker.setLabel(label);
		                marker.addEventListener("click", function(){
		                    this.openInfoWindow(infoWindow);
		                });
		                points.push(point);
		            });
		        },
		        
		        showTraLine: function(data) {
		        	var points = [];
		        	for (var i=0; i<data.length; i++) {
		        		var point = new BMap.Point(data[i].jingdu, data[i].weidu);
		            	points.push(point);
		        	}
		        	
		        	if (points) {
		        		if (tra_polyline != undefined) {
		        			map.removeOverlay(tra_polyline);
		        		}
		        		var  traLine = new BMap.Polyline(points, {strokeColor:"green", strokeWeight:2, strokeOpacity:1}); //创建折线对象
		        		traLine.enableMassClear();
		                map.addOverlay(traLine); //添加到地图中
		                
		                //给全局脊线变量赋值
		                tra_polyline = traLine;
		        	}
		        },
		        
		        showLinemap:function(linemapData) {
		        	if (linemaps.length > 0) {
		        		for (var i=0; i<linemaps.length; i++) {
			        		map.removeOverlay(linemaps[i]);
			        	}
		        	}
		        	//同一条线则不再显示站点
		        	if ($('#replay_lineNo').val().trim() != $('#head_lineNo').text().trim()) {
		        		var points=[];
			        	for (var i=0; i<linemapData.length; i++) {
			        		var linemap = linemapData[i];
			        		var point = new BMap.Point(linemap.jingdu,linemap.weidu);
			        		var marker = new BMap.Marker(point,{icon:linemapBlueIcon,offset:offset});  // 创建标注
			        		marker.disableDragging();
			        		map.addOverlay(marker);   // 将标注添加到地图中
			        		
			        		linemaps.push(marker);
			                if(points){
			                     points.push(point);
			                }
			                _this._leftclick(linemap,marker);
			        	}
		        	}
		        },
		        
		        _leftclick: function(itemData,marker){
		            var infoWindow = new BMap.InfoWindow("<h3 id='leftClickStopName'>"+itemData.stopName+"</h3><br>"+itemData.lineNo+" "+ (itemData.direction==0?"上行":"下行")+" 第 " + itemData.orderNum+" 站");
		            marker.addEventListener("click", function(){
		                marker.openInfoWindow(infoWindow);
		            });
		        },

                showStop:function(stoplist) {
                    for (var i=0; i<sMarkers.length; i++) {
                        map.removeOverlay(sMarkers[i]);
                    }
                    var sIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-wine.png",new BMap.Size(30,30));
                    for (var i=0; i<stoplist.length; i++) {
                        for (var j=0; j<stoplist[i].stoplist.length; j++) {
                            var point = new BMap.Point(stoplist[i].stoplist[j].jingdu,stoplist[i].stoplist[j].weidu);
                            var marker = new BMap.Marker(point,{icon:sIcon, offset:offset});  // 创建标注

                            map.addOverlay(marker);
                            sMarkers.push(marker);
                        }
                    }
                },
		        _bindEvent: function() {
		        	$('#replay_search').unbind('click');
		        	$('#replay_search').click(function() {
		        		map.clearOverlays(map.getOverlays());
                        $("#replay_tbody").html("");
                        $("#table-info-body1").html("");
                        $("#table-info-body2").html("");
		        		_this._queryAll(false);
		        	})
		        	
		        	$('#replay_line').unbind('click');
		        	$('#replay_line').click(function() {
		        		if ($('#replay_lineNo').val().trim() == "") {
		            		alert('请输入线路编号。');
		            		return;
		            	}
		        		var o = {
			        			cityId: $('#replay_cityId').val(),
			        			lineNo: $('#replay_lineNo').val(),
			        			direction: $('#replay_direction').val()
			        	}
                        $.get(__baseUrl + '/baseData/querysimpleline', o, function (result) {
			        		if (result._exception === true) {
								alert(result.message);
							} else {
								if (result.status == 'FAIL') {
									alert(result.errmsg);
								} else {
									_this.showTraLine(result.data.tralist);
									_this.showLinemap(result.data.maplist);
								}
			        		}
			        	});
		        	});
		        	
		        	//鼠标测距
		        	var	myDis=new BMapLib.DistanceTool(map);
		        	$("#mouse_distance").on({
		        		'click':function(){
			        			myDis.open();
			        			map.disableDoubleClickZoom() ;
			        			
		        		}
		        	})		        	
		        	
		        	$('#replay_stop').unbind('click');
                    $("#replay_stop").on("click",function(event){
                    	if ($('#replay_lineNo').val().trim() == "") {
		            		alert('请输入站点名称。');
		            		return;
		            	}
                    	var o = {
                    			cityId: $('#replay_cityId').val(),
                        		stopName: $('#replay_lineNo').val(),
                        		multi: false
                        };
                        $.get(__baseUrl + '/baseData/queryStop', o, function(result) {
                        	if (result._exception === true) {
            					alert(result.message);
            				} else {
            					if (result.status == 'FAIL') {
            						alert(result.errmsg);
            					} else {
            						if (result && result.data.length > 0) {
            							_this.showStop(result.data);
            						} else {
            							alert('不存在同名站点');
            						}
            					}
            				}
            			});
                    });
                    
                    $('#replay_start_time').unbind('change');
                    $('#replay_start_time').on('change', function() {
                    	_this._autoComplete();
                    });
                    $('#gpsType').on('change', function() {
                    	currentGpsType = $(this).val();
                        if (gpsDataFroms && currentGpsType!= -1) {
                            var html ='';
                            for (var i = 0; i < gpsDataFroms[currentGpsType].length; i++) {
                                var item = gpsDataFroms[currentGpsType][i];
                                html += '<option value="' + item + '">' + item + '</option>';
                            }
                        }
                        $('#gpsFrom').empty().html(html);
                    	//如果选择所有，则“源”灰化
                       	if ($('#gpsType').val() == -1) {
                       		$('#gpsFrom').prop('disabled', true);
                       		$('#gpsFrom').css('color', 'lightgrey');
                       	} else {
                       		$('#gpsFrom').prop('disabled', false);
                       		$('#gpsFrom').css('color', 'black');
                       	}

                    });
                    $('#gpsFrom').on('change', function() {
                    	currentGpsFrom = $(this).val();
                    });
		        },
            _load:function() {
            	if (g_cityId) {
            		$('#replay_cityId').val(g_cityId);
            		$('#replay_cityId').change();
            		$('#replay_lineNo').val(g_lineNo);
            		$('#replay_direction').val(g_direction);
            		$('#replay_carNo').val(g_carNo);
            		_this._queryAll(true);
            		_this._autoComplete();
            	} else {
            		var cityName = $('#replay_cityId').find("option:selected").text();
            		cityName = getSelectText(cityName);
            		map.centerAndZoom(cityName,14);
            	}
            },
            
            _queryAll: function(isFirst) {
            	if ($('#replay_carNo').val().trim() == "") {
            		alert('请输入车辆编号。');
            		return;
            	}
            	var o = {
						cityId: $('#replay_cityId').val(),
						'area.cityEn':$.codemap["cityEn"][$('#replay_cityId').val()],
						carNo: $('#replay_carNo').val(),
						beginTime: $('#replay_start_time').val(),
						endTime: $('#replay_start_time').val().split(' ')[0] + " " + $('#replay_end_time').val()
				};
            	if (!isFirst) {
            		if ($('#gpsType').val()) {
            			o.gpsDataType = $('#gpsType').val();
            		}
            		if ($('#gpsFrom').val()) {
            			o.gpsDataFrom = $('#gpsFrom').val();
            		}
            	}
            	if ($('#replay_carNo').val().trim().length > 15 && !$('#gpsType').val()) {
        			//说明是ugc车辆，且是第一次查询
        			o.gpsDataType = 3;
        		}
				$.get(__baseUrl + '/gpsData/replay', o, function(result) {
            	//$.get('http://192.168.1.155:7000/universe/gpsData/replay', o, function(result) {
                	if (result._exception === true) {
    					alert(result.message);
    				} else {
    					if (result.status == 'FAIL') {
    						alert(result.errmsg);
    					} else {
    						if (result && result.data && result.data.length > 0) {
                                if (result.gpsVersion != 0){
                                     $("#gpsbcx").text('GPS');
                                     //$("#info-table2").text('GPS');
                                } else {
                                     $("#gpsbcx").text('GPS/STN信息');
                                }
                                //只有type为4时，才会有来源和类型（且查询时为非必填项）
                                if (result.gpsVersion === 4) {
	                                $('#gpsFrom').html('').parent().css({'visibility' : 'visibility'});
	                               	$('#gpsType').html('').parent().css({'visibility' : 'visibility'});	 	                                
	                                //如果有gps，则后台默认返回的是类型1
	                                if (result.data && result.data.length > 0) {
	                                	//gps类型;
                                        gpsDataFroms = JSON.parse(result.gpsDataFroms);
                                        var myGpsType = ['<option value="-1">所有</option>','<option value="1">显示在线上的车</option>','<option value="2">原始车辆</option>','<option value="3">用户数据</option>']
	                                    var gpsTypeHtml = '';
                                        if(currentGpsType != -1){
                                            currentGpsType = result.data[0].gps.type;
                                        }
                                        console.log(currentGpsType);                                 
                                        for(var key in gpsDataFroms){
                                           /* if(key == gpsTypeSel){
                                                myGpsType[key] = myGpsType[key].substring(7,0," selected");
                                            }*/
                                            gpsTypeHtml += myGpsType[key];
                                        }
                                        gpsTypeHtml += myGpsType[0];
                                        $('#gpsType').empty().html(gpsTypeHtml);
                                        var html = '';
                                        gpsTypeColors = {};    
                                        if (gpsDataFroms) {
                                            for (var i = 0; i < gpsDataFroms[currentGpsType].length; i++) {
                                                var item = gpsDataFroms[currentGpsType][i];
                                                html += '<option value="' + item + '">' + item + '</option>';
                                                gpsTypeColors[item] = getRandomColor(i);
                                            }
                                        }
                                        $('#gpsFrom').empty().html(html);
                                        //gps来源                                                             
                                        var legend = '';
                                        for (var i in gpsTypeColors) {
                                            legend += '<span style="background-color:rgba(' + gpsTypeColors[i] + ');padding:2px 8px;border-radius:2px;margin:2px;">' + i + '</span>'
                                        }
                                        if (legend) {
                                            $('#legend').html(legend);
                                        }   
                                        if (currentGpsFrom) {
                                            $('#gpsFrom').val(currentGpsFrom).change();
                                        }
	                                    if (o.gpsDataType) {
	                                    	currentGpsType = o.gpsDataType;
	                                    }
	                                    if (currentGpsType) {
	                                    	$('#gpsType').val(currentGpsType).change();
		                                }
	                                }
                                } else {
                                	$('#gpsFrom').html('').parent().css({'visibility' : 'hidden'});
	                               	$('#gpsType').html('').parent().css({'visibility' : 'hidden'});
                                }
                                
    							_this.map_playback(result);
    						} else {
    							alert('没有查询到该车辆信息');
    						}
    					}
    				}
    			});
            },
            
            _autoComplete: function() {
        		var o = {
        				cityId: $('#replay_cityId').val(),
						'area.cityEn':$.codemap["cityEn"][$('#replay_cityId').val()],
						lineNo: $('#replay_lineNo').val(),
						date: $('#replay_start_time').val().split(' ')[0]
        		};
        		$.read(__baseUrl + '/gpsData/carlist', o, function(result) {
            		if (result._exception === true) {
    					//alert(result.message);
    				} else {
    					if (result.status == 'FAIL') {
    						//alert(result.errmsg);
    					} else {
    						$('#replay_carNo').click(function() {
    			        		if (result && result.data && result.data.length > 0) {
    								$('#replay_carNo').autocomplete({
    									source: result.data,
    									delay: 0,
    									minLength: 0
    								});
    								$('#replay_carNo').keydown();
    							} else {
    								$('#replay_carNo').autocomplete({
    									source: [],
    									delay: 0,
    									minLength: 0
    								});
    							}
    			        	});
    					}
            		}
            	});
            },
		        
	    	//页面初始化
	    	init:function(){
	    		_this._initMap();
	    		_this._initHead();
                _this._load();
                _this._bindEvent();
			}
    };
    _this.init();
}

var gpsTypeColors = {};
function getRandomColor(i) {
	var colors = ['0,191,215,1', '213,127,195,0.8', '255,173,19,0.8', '255,81,145,0.8', '79,184,13,0.8',
	              '164,196,209,1', '30,196,147,1', '255,87,34,1', '52,152,219,0.8', '113,136,201,0.8'];
	return colors[i] || '255,255,255,1';
}