var isBind = false;

/**
 * 视图切换
 * 逻辑站点+真实物理站 默认 true
 * 虚拟物理站+真实物理站 false
 */
changeView=true;

//地铁站信息
var subwaysDataArray = [];

//地图对象
var map;

//页面初始后台返回的所有数据
var result_bak;

//页面处理过后,形成的每个站点数据的原始备份
var updateData_back=null;

//最新的物理站信息
var updateStationList=null;

var g_cityId;
var g_lineId;
//所有的最新数据(不包括删除的)
var updateData=[]; // status：0为点击状态  4为原状   1为增加 2为修改 ； markerIconColor=0;  //标注图标的颜色0：紫色 ，1为蓝色
//所有要被删除的数据
var deleteData=[];

//当前展示的线路，只有[0]元素
var lineDatas=[];
//所有站点的Marker集合(最新)
var markers=[];
//查询出的同名站点Marker集合(新增或修改站点时使用)
var sMarkers=[];
//高德站点的Marker集合
var gMarkers=[];
//查询出附近站点Marker集合(新增或修改站点时使用)
var sDisMarkers=[];

//脊线动态数据
var jxData= new Array();

//蓝线站点线的Polyline
var stopCurve;
//红色脊线的Polyline
var tra_polyline;

//脊线的Marker集合
var traMarkers= [];
//脊线的Point集合
var traPoints= new Array();//脊线点集合
//当前高亮的脊线点的order
var currentPoint;//当前高亮点

//最后一次点击点的类型，0-stop, 1-trajectory(增加脊线圈或站点时使用)
var currentPointType;

//查询到的车辆GPS数据
var initGps;

//车辆号与PointCollection的映射map
var pc = {};
//查询到车辆GPS的PointCollection集合
var pointCollections = [];
//查出车辆时用,分隔，以便在换一批时再转给后台查下一批的数据
var cars = [];

//热力图
var ps=[];
//热力图的HeatmapOverlay
var heatOverlay = {};
var recSelectOverlay;
var recHeatOverlay;
//查询到用户GPS的PointCollection
var gpcol;
//查询路测GPS的PointCollection
var appGps;
//车辆速度查询
var speedPolys = [];
var speedData;
//热力图平均点数
var avg_point = 1;
var avg_point_select = 1;
//第三方查询
var local;
//坐标查询
var coords;
//拾取坐标点的Marker
var pickMarkers = [];
//当前是否为反向生成线路
var isReverse = false;

//top2的lable
var labelOneArray=[],labelTwoArray=[],labelBtuOne,labelBtuTwo;

var pointsObject={
        nowTwoPoints:[],//两个点  三个点
        allPointsMarker:[],//两个marker  三个marker
        allPointsPolyline:[],//一条线 两条线
        labelBegin:new BMap.Label("开始",{offset:new BMap.Size(20,-10)}),
        //labelDistance:null
        labelDistance:[]
        }

var my_distance_flag=false;

//周围物理站点marker
var rangemarkers=[];

//周围物理站点marker的圈圈
var rangCircle=null;

//列表中的物理站点查看
var showMarker=null;

var stMarker = null;
var thirdMarker = null;

//高德所有站点
var gaodeAllStopMarkers = [];


function Maintenance($, cityId, lineId, lineName, direction) {
    g_cityId = cityId, g_lineId = lineId;
    //站点Marker的offset
    var offset =new BMap.Size(0,-15);
    //站点序号Label的Marker
    var defaultLableOffsetSize = new BMap.Size(0, 30);
    //脊线圈Marker的offset
    var tra_offset = new BMap.Size(0,0);
    //站点默认图标(紫)
    var rIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-item.png",new BMap.Size(30,30));
    //站点选中图标(蓝)
    var rIcon_two = new BMap.Icon(__baseUrl + "/images/cll-linemap-item_1.png",new BMap.Size(30,30));
    var rIcon_two_six = new BMap.Icon(__baseUrl + "/images/phy_six.png",new BMap.Size(30,30));
    
    //脊线圈默认图标(蓝)
    var jxBlueIcon = new BMap.Icon(__baseUrl + "/images/circle_blue.png", new BMap.Size(16, 16));
    //脊线圈选中图标(绿)
    var jxGreenIcon = new BMap.Icon(__baseUrl + "/images/circle_green.png", new BMap.Size(16, 16));
    //是否重置地图视野
    var resetView = true;

    var phy_shi = new BMap.Icon(__baseUrl + "/images/phy_shi.png",new BMap.Size(30,30));//真实物理

    var phy_xu = new BMap.Icon(__baseUrl + "/images/phy_xu.png",new BMap.Size(30,30));//虚拟物理
    
    var shadowIcon = new BMap.Icon(__baseUrl + "/images/shadow.png",new BMap.Size(30,30));

    var nearbyRelIcon = new BMap.Icon(__baseUrl + "/images/nearbyRelIcon.png",new BMap.Size(30,30));

    var nearbyFalIcon = new BMap.Icon(__baseUrl + "/images/nearbyFalIcon.png",new BMap.Size(30,30));

    var samenamelgo = new BMap.Icon(__baseUrl + "/images/cll-linemap-light-green.png",new BMap.Size(30,30));

    var virOnlyOne = new BMap.Icon(__baseUrl + "/images/virOnlyOne.png",new BMap.Size(30,30));
    _this={
        _resetGlobal: function() {
            map = null;
            result_bak = null;
            //所有的最新数据(不包括删除的)
            updateData=[]; // status：0为点击状态  4为原状   1为增加 2为修改 ； markerIconColor=0;  //标注图标的颜色0：紫色 ，1为蓝色
            //所有要被删除的数据
            deleteData=[];
            //当前展示的线路，只有[0]元素
            lineDatas=[];
            //所有站点的Marker集合(最新)
            markers=[]; 
            //查询出的同名站点Marker集合(新增或修改站点时使用)
            sMarkers=[];
            //高德站点的Marker集合
            gMarkers=[];
            //查询出附近站点Marker集合(新增或修改站点时使用)
            sDisMarkers=[];
            //脊线动态数据
            jxData= new Array();
            //蓝线站点线的Polyline
            stopCurve = null;
            //红色脊线的Polyline
            tra_polyline = null;
            //脊线的Marker集合
            traMarkers= [];
            //脊线的Point集合
            traPoints= new Array();//脊线点集合
            //当前高亮的脊线点的order
            currentPoint = null;//当前高亮点
            //最后一次点击点的类型，0-stop, 1-trajectory(增加脊线圈或站点时使用)
            currentPointType = null;
            //查询到的车辆GPS数据
            initGps = null;
            //车辆号与PointCollection的映射map
            pc = {};
            //查询到车辆GPS的PointCollection集合
            pointCollections = [];
            //查出车辆时用,分隔，以便在换一批时再转给后台查下一批的数据
            cars = [];
            //热力图
            ps=[];
            //热力图的HeatmapOverlay
            heatOverlay = {};
            //查询到用户GPS的PointCollection
            gpcol = null;
            //查询路测GPS的PointCollection
            appGps = null;
            //车辆速度查询
            speedPolys = [];

            speedData = null;

            _this.reset();

            _this.init();

            window.history.replaceState(null, '', 'maintenance?cityId=' + _this._getCity().cityId + '&lineId=' + g_lineId);
            $(".gaode_Num").text("(0)");
        },

        _resetLine: function() {
            resetView = false;
            //清除站点
            for (var i=0; i < markers.length; i++) {
                map.removeOverlay(markers[i]);
            }
            //清除蓝线
            map.removeOverlay(stopCurve);
            //清除红线
            map.removeOverlay(tra_polyline);
            //清除脊线圈
            for (var i=0; i < traMarkers.length; i++) {
                map.removeOverlay(traMarkers[i]);
            }
            result_bak = null;
            //所有的最新数据(不包括删除的)
            updateData=[]; // status：0为点击状态  4为原状   1为增加 2为修改 ； markerIconColor=0;  //标注图标的颜色0：紫色 ，1为蓝色
            //所有要被删除的数据
            deleteData=[];
            //当前展示的线路，只有[0]元素
            lineDatas=[];
            //所有站点的Marker集合(最新)
            markers=[];
            //查询出的同名站点Marker集合(新增或修改站点时使用)
            sMarkers=[];
            //高德站点的Marker集合
            gMarkers=[];
            //查询出附近站点Marker集合(新增或修改站点时使用)
            sDisMarkers=[];
            //脊线动态数据
            jxData= new Array();
            //蓝线站点线的Polyline
            stopCurve = null;
            //红色脊线的Polyline
            tra_polyline = null;
            //脊线的Marker集合
            traMarkers= [];
            //脊线的Point集合
            traPoints= new Array();//脊线点集合
            //当前高亮的脊线点的order
            currentPoint = null;//当前高亮点
            //最后一次点击点的类型，0-stop, 1-trajectory(增加脊线圈或站点时使用)
            currentPointType = null;
            _this._queryAll();
        },

        //查询脊线数据
        _trajectory_query:function(tralist){
            //装载脊线数据到全局数组
            for (var j=0; j<tralist.length; j++) {
                var tableItem = {};
                tableItem.traId = tralist[j].traId;
                tableItem.order = tralist[j].orderNum;
                tableItem.lineNo = tralist[j].lineNo;
                tableItem.direction = tralist[j].direction;
                tableItem.sjingdu = tralist[j].sjingdu;
                tableItem.sweidu = tralist[j].sweidu;
                tableItem.jingdu = tralist[j].jingdu;
                tableItem.weidu = tralist[j].weidu;
                tableItem.markerIconColor = 1;
                jxData.push(tableItem);
            }

            _this._drawTraMarker(jxData);
            _this._drawTraLine(traPoints);
            _this._appendTable(jxData);
        },


        //绘制脊线标注
        _drawTraMarker:function(data){
            if(data){
                for (var i=0; i<data.length; i++) {
                    var point = new BMap.Point(data[i].jingdu, data[i].weidu);
                    var marker = new BMap.Marker(point,{icon:jxBlueIcon,offset:tra_offset});
                    if (data[i].markerIconColor == 1) {
                        marker.setIcon(jxBlueIcon);
                    }
                    if (data[i].markerIconColor == 2) {
                        marker.setIcon(jxGreenIcon);
                    }
                    marker.enableDragging();
                    //map.addOverlay(marker);
                    traMarkers.push(marker);
                    traPoints.push(point);
                }
            }else{
                alert("尚无脊线！");
            }
        },

        //绘制脊线
        _drawTraLine:function(points) {
            if (points) {
                if (tra_polyline != undefined) {
                    map.removeOverlay(tra_polyline);
                }
                var  traLine = new BMap.Polyline(points, {strokeColor:"red", strokeWeight:2, strokeOpacity:0}); //创建折线对象
                traLine.enableMassClear();
                map.addOverlay(traLine); //添加到地图中

                //给全局脊线变量赋值
                tra_polyline = traLine;
            }
        },

        //表格填充数据
        _appendTable:function(data) {    
            _this._fillTraTable(data);
            _this._bindMarkerEvent();
        },


        //对脊线的marker绑定事件
        _bindMarkerEvent:function() {
            for (var i=0; i<traMarkers.length; i++) {
                _this._leftclick_jx(jxData[i],traMarkers[i]);
                _this._clickJxTable(jxData[i],traMarkers[i]);
                _this._dragjxMaker(jxData[i],traMarkers[i]);

            }
        },

        //点击脊线表格中的行
        _clickJxTable:function(itemData,marker){
            $("#jx-tbody").children().bind("dblclick",function(){
                currentPointType = 1;
                var record = $(this).closest('tr').data('record');
                var order = record.order;
                if(order==itemData.order){
                    //地图上marker改变
                    if (currentPoint != undefined) {
                        traMarkers[currentPoint-1].setIcon(jxBlueIcon);
                    }
                    marker.setIcon(jxGreenIcon);
                    //设置中心焦点
                    map.setCenter(traPoints[order-1]);
                    var dialogHtml="<label>序&nbsp&nbsp号：</label><label id='mapOrder'>"+itemData.order+"</label><br>" +
                    "<label>线路号：</label><label id='lineNo'>"+itemData.lineNo+"</label><br>"+
                        "<label>经&nbsp&nbsp度：</label><label>" + itemData.jingdu + "</label><br>"+
                        "<label>维&nbsp&nbsp度：</label><label>" + itemData.weidu + " </label><br>" +
                        "<button id='btn_remove4' class='btn btn-primary btn-xs'>删除</button>";

                    var clickDialog= new BMap.InfoWindow(dialogHtml);
                    marker.openInfoWindow(clickDialog);
                    if (currentPoint != undefined) {
                        jxData[currentPoint-1].markerIconColor = 1;
                    }
                    jxData[order-1].markerIconColor = 2;
                    currentPoint = parseInt(order,10);
                    _this._remove_tra_btn(itemData, marker);
                }
            });
            $("#jx-tbody").children().bind("click",function(){
                currentPointType = 1;
                var record = $(this).closest('tr').data('record');
                var order = record.order;
                if(order==itemData.order){
                    //地图上marker改变
                    if (currentPoint != undefined) {
                        traMarkers[currentPoint-1].setIcon(jxBlueIcon);
                    }
                    marker.setIcon(jxGreenIcon);
                    //设置中心焦点
                    map.setCenter(traPoints[order-1]);

                    if (currentPoint != undefined) {
                        jxData[currentPoint-1].markerIconColor = 1;
                    }
                    jxData[order-1].markerIconColor = 2;
                    currentPoint = parseInt(order,10);
                    _this._remove_tra_btn(itemData, marker);
                }
            });
        },

        //左击marker
        _leftclick_jx: function(itemData,marker){
            marker.addEventListener("click", function(){
                currentPointType = 1;
                var infoWindow = new BMap.InfoWindow("<label>序&nbsp&nbsp号：</label><label id='mapOrder'>"+itemData.order+"</label><br>" +
                    "<label>线路号：</label><label id='lineNo'>"+itemData.lineNo+"</label><br>"+
                    "<label>经&nbsp&nbsp度：</label><label>" + itemData.jingdu + "</label><br>"+
                    "<label>维&nbsp&nbsp度：</label><label>" + itemData.weidu + " </label><br>" +
                    "<button id='btn_remove4'  class='btn btn-primary btn-xs'>删除</button>");
                marker.openInfoWindow(infoWindow);
                var leftClickOrderNum=$("#mapOrder").text();
                leftClickOrderNum=parseInt(leftClickOrderNum);
                //表格中的相应行变色
                $("#jx-tbody").children().each(function(){
                    var  order=$(this).children().eq(0).text().trim();
                    if(order==leftClickOrderNum){
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected");
                    }
                });
                //地图上marker变色
                if (currentPoint != undefined) {
                    traMarkers[currentPoint-1].setIcon(jxBlueIcon);
                }
                marker.setIcon(jxGreenIcon);
                //updateData数组相应数据更改
                if (currentPoint != undefined) {
                    jxData[currentPoint-1].markerIconColor = 1;
                }
                jxData[leftClickOrderNum-1].markerIconColor = 2;
                currentPoint = parseInt(leftClickOrderNum,10);
                _this._remove_tra_btn(itemData, marker);
            });
        },

        _remove_tra_btn: function(itemData, marker) {
            //删除按钮操作
            $("#btn_remove4").bind("click",function(){
                map.removeOverlay(marker);

                //重新绘线
                traPoints.splice(itemData.order-1,1);
                _this._drawTraLine(traPoints);

                jxData.splice(itemData.order-1,1);
                for (var j=itemData.order-1; j<jxData.length; j++) {
                    jxData[j].order = parseInt(jxData[j].order,10)-1;
                }

                if (currentPoint == itemData.order) {
                    currentPoint = undefined;
                }

                traMarkers.splice(itemData.order-1,1);
                _this._appendTable(jxData);
            });
        },

        //脊线拖动事件
        _dragjxMaker:function(itemData,marker){
            marker.addEventListener("dragend",function(e){
                currentPointType = 1;
                traPoints[parseInt(itemData.order,10)-1] = e.point;
                _this._drawTraLine(traPoints);

                if (currentPoint != undefined) {
                    traMarkers[currentPoint-1].setIcon(jxBlueIcon);
                    traMarkers[currentPoint-1].closeInfoWindow();
                    jxData[currentPoint-1].markerIconColor = 1;
                }

                marker.setPosition(e.point);
                marker.setIcon(jxGreenIcon);

                //表格中的相应行变色
                $("#jx-tbody").children().each(function(){
                    var order=$(this).children().eq(0).text().trim();
                    if(order == itemData.order){
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected");
                    }
                });

                jxData[itemData.order-1].jingdu = e.point.lng;
                jxData[itemData.order-1].weidu = e.point.lat;
                jxData[itemData.order-1].sjingdu = 0;
                jxData[itemData.order-1].sweidu = 0;
                jxData[itemData.order-1].markerIconColor = 2;

                currentPoint = parseInt(itemData.order,10);
                //change the button color
                //$("#jx-save").removeClass("btn-primary").addClass("btn-danger");
            });
        },

        _jxReset:function() {
            $("#jx-reset").on("click",function(){
                for (var i=0; i<traMarkers.length; i++) {
                    map.removeOverlay(traMarkers[i]);
                }
                _this._queryTra();
            });
        },

        _jxReverse:function() {
            $("#jx-reverse").on("click",function(){
                confirm("确定将当前脊线反序吗？？？？？？？", function() {
                    my_distance_flag=false;
                    _this._removePointsObjectLay();
                    _this._paramInit();
                    var o = {
                            cityId: _this._getCity().cityId,
                            lineNo: lineDatas[0].lineNo,
                            direction: lineDatas[0].direction
                    }
                    $.get(__baseUrl + '/baseData/reTraOrder', o, function(result) {
                        if (result._exception === true) {
                            alert(result.message, "fail");

                        } else {
                            if (result.status == 'FAIL') {
                                alert(result.errmsg, "fail");

                            } else {
                                alert('脊线反序成功！', "success");
                                _this._queryTra(result.data);

                            }
                        }
                    });
                });
            });
        },

        _jxExchange:function() {
            $("#jx-exchange").on("click",function(){
                confirm("确定将当前脊线换向吗？？？？？？？", function() {
                    my_distance_flag=false;
                    _this._removePointsObjectLay();
                    _this._paramInit();
                    //$(".gaode_Num").text('(0)');$(".luceGps_Num").text('(0)');

                    var o = {
                            cityId: _this._getCity().cityId,
                            lineNo: lineDatas[0].lineNo,
                            direction: lineDatas[0].direction
                    }
                    $.get(__baseUrl + '/baseData/reTraDir', o, function(result) {
                        if (result._exception === true) {
                            alert(result.message, "fail");

                        } else {
                            if (result.status == 'FAIL') {
                                alert(result.errmsg, "fail");

                            } else {
                                alert('脊线换向成功！', "success");
                                _this._queryTra(result.data);

                            }
                        }
                    });
                });
            });
        },

        _jxCompress:function() {
            $('#jx-compress').on('click',function(){
                confirm("确定将当前脊线压缩吗？？？？？？？", function() {
                    my_distance_flag=false;
                    _this._removePointsObjectLay();
                    _this._paramInit();
                    //$(".gaode_Num").text('(0)');$(".luceGps_Num").text('(0)');

                    var o = {
                            cityId: _this._getCity().cityId,
                            lineNo: lineDatas[0].lineNo,
                            direction: lineDatas[0].direction
                    }
                    $.get(__baseUrl + '/baseData/compressTra', o, function(result) {
                        if (result._exception === true) {
                            alert(result.message, "fail");
                        } else {
                            if (result.status == 'FAIL') {
                                salert(result.errmsg, "fail");
                            } else {
                                alert('脊线压缩成功！', "success");
                                _this._queryTra(result.data);
                            }
                        }
                    });
                });
            });
        },

        _stopBatchDel: function() {
            $("#batch-del-stop-btn").on('click',function(event){
                var start = $('#del-stop-start').val();
                var end = $('#del-stop-end').val();
                if (parseInt(start) > parseInt(end)) {
                    alert('起始序号不能大于终止序号.');
                    return;
                }
                if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                    alert('请填数字.');
                    return;
                }
                //更新updateData站点数据
                var records = [];
                var stop_table = $('#table-map-body tr');
                for (var i = start - 1; i < end && i < stop_table.length; i++) {
                    var record = $(stop_table[i]).data('record');
                    if (record) {
                        records.push($(stop_table[i]).data('record'));
                    }
                }
                _this._removeOrderNumResort(records);
                //change the button color
                //$("#jx-save").removeClass("btn-primary").addClass("btn-danger");
            });
        },

        _jxBatchDel:function() {
            $("#jx-batch-del").on('click',function(event){
                var start = $('#delStart').val();
                var end = $('#delEnd').val();
                if (parseInt(start) > parseInt(end)) {
                    alert('起始序号不能大于终止序号.');
                    return;
                }
                if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
                    alert('请填数字.');
                    return;
                }
                var delt = parseInt(end) - parseInt(start) + 1;
                for (var i=(parseInt(start)-1); i<parseInt(end); i++) {
                    map.removeOverlay(traMarkers[i]);
                }
                traPoints.splice((parseInt(start)-1),delt);
                _this._drawTraLine(traPoints);

                currentPoint = undefined;

                jxData.splice((parseInt(start)-1),delt);
                for (var j=(parseInt(start)-1); j<jxData.length; j++) {
                    jxData[j].order = j+1;
                }
                traMarkers.splice((parseInt(start)-1),delt);
                _this._appendTable(jxData);
                //change the button color
                $("#jx-save").removeClass("btn-primary").addClass("btn-danger");
            });
        },

        _addFirstTra:function() {
            $("#jx-add").on('click',function(){
                currentPointType == 1;
            });
        },


        //新增排序
        _insertOrderNumResort:function(data,inde){
            var o;
            var index;
            if(updateData.length>0){
                for(var i=0;i<updateData.length;i++){
                    if(updateData[i].orderNum==inde){
                        index=i;
                        o=parseInt(updateData[i].orderNum);
                    }
                }
                updateData.splice(o,0,data);
                for(var k=0;k<updateData.length;k++){
                    updateData[k].orderNum=k+1;
                    if(k>index+1){
                        updateData[k].status=2;
                    }
                }
                //右边table排序
                _this._re();
                //左边排序
                for (var i=0; i<markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }
                markers = [];
                var pointsA=[];
                for(var j=0;j<updateData.length;j++){
                    _this._markerMap(updateData[j],pointsA);
                }
                _this._drawLine(pointsA);
                _this._bindStopMarkerEvent();
            }else{
               /* var itemData={
                    "orderNum":data.orderNum,
                    "lineNo":data.lineNo,
                    "stopName":data.stopName,
                    "jingdu":data.jingdu,
                    "weidu":data.weidu,
                    "sjingdu":data.sjingdu,
                    "sweidu":data.sweidu,
                    "direction":data.direction,
                    "status":data.status,
                    "id":data.id
                };*/
                updateData.push(data);
                //左边排序
                //右边table排序
                _this._re();
                //重新会点
                _this._readerMaker();
            }
        },
        //删除排序
        _removeOrderNumResort:function(itemData){
            if (itemData instanceof Array === false) {
                itemData = [itemData];
            }
            for (var j = 0; j < itemData.length; j++) {
                //updatedata排序
                for(var i=0;i<updateData.length;i++){
                    var o=parseInt(updateData[i].orderNum)-1;
                    var index;
                    if(updateData[i].orderNum==itemData[j].orderNum ){
                        index=i;
                        //如果是删除已有的站点，则要记录到deleteData中；如果删除的是新增站点，则直接删除即可
                        if(updateData[i].linemapId){
                            var linemapid=updateData[i].linemapId;
                            deleteData.push(linemapid);
                        }
                        updateData.splice(o,1);
                    }
                    //删除的不是最后一行，则要重新排序；如果是最后一行，则不需要排序
                    if(index!=updateData.length){
                        updateData[i].orderNum=i+1;
                        if(updateData[i].orderNum>index){
                            updateData[i].status="修改";
                        }
                    }
                }
            }

            //右边table排序
            _this._re();
            //重新会点
            _this._readerMaker();
        },
        _readerMaker:function(){
            //重新会点
            for(var i=0; i<markers.length; i++) {
                map.removeOverlay(markers[i]);
            }
            markers = [];
            var points=[];
            for(var j=0;j<updateData.length;j++){
                _this._markerMap(updateData[j],points);
            }
            _this._drawLine(points);
            _this._bindStopMarkerEvent();

        },
        _re:function(){
            //根据最新数据重新显示列表
            _this._fillStopTable(updateData);
        },
        _renderTable:function(){
            $("#table-map-body").children().each(function(index){
                if(updateData[index].status==2){
                    updateData[index].status="修改";
                }
                if(updateData[index].status==1){
                    updateData[index].status="新增";
                }
                _this._re();
            });
        },
        _insertWindow:function(rightclickDialog_1,insertMarker,item){
            $("#btn_insert").on("click",function(){
                if($("#detailDialog #stopName").val().trim()==""){
                    alert("站点名不能为空！");
                    return;
                }
                map.closeInfoWindow(rightclickDialog_1);
                var data={};
                data.orderNum=$("#detailDialog #orderNum").val();
                data.lineNo=$("#detailDialog #lineNo").val();
                data.stopName=_replaceBrackets($("#detailDialog #stopName").val().trim());
                data.jingdu=$("#detailDialog #jingdu").val().trim();
                data.weidu=$("#detailDialog #weidu").val().trim();
                data.direction=lineDatas[0].direction;
                data.sjingdu=0;
                data.sweidu=0;
                data.status=2;
                data.markerIconColor = 1;
                data.id=generateUUID();
                data.stationProp=1;
                
                if(data.orderNum==1){
                    _this._insertOrderNumResort(data,item.orderNum);
                }else{
                    $("#table-map-body").children().each(function(){
                        var  orderNum=$(this).children().eq(0).text().trim();
                        if(item.orderNum){
                            if(orderNum==item.orderNum){
                                _this._insertOrderNumResort(data,item.orderNum);
                            }
                        }
                    });
                }
                
                
                /**
                 * 新增站点的时候，如果周围没有物理站，那他就转化为一个虚拟物理站，现在stationId=0,不用设为null
                 */
                data.stationId=0,
                data.lineName=lineDatas[0].lineName;
                data.lineNo=lineDatas[0].lineNo;
                data.linemapId=null;
                data.stationInfo={
                        cityId: _this._getCity().cityId,
                        isVirtual:0,
                        lng:data.jingdu,
                        lat:data.weidu,
                        slat:data.weidu,
                        slng:data.jingdu,
                        stationName:data.stopName,
                        stationId:0,
                        stopList:[]
                }
                
                var newData={
                        direction:data.direction,
                        jingdu:data.jingdu,
                        weidu:data.weidu,
                        sjingdu:data.sjingdu,
                        sweidu:data.sweidu,
                        lineName:lineDatas[0].lineName,
                        lineNo:lineDatas[0].lineNo,
                        linemapId:null,
                        nextStopName:updateData[data.orderNum]==undefined?"":updateData[data.orderNum].stopName,
                        stopName:data.stopName,
                        orderNum:data.orderNum,
                        stationId:0
                }   
                var itemData=_this._dataFromFunc(data,newData);
                
                //修改updateData
                updateData[itemData.orderNum-1].stationId=0;
                updateData[itemData.orderNum-1].stationInfo=itemData.stationInfo;

                //再查寻周围物理站
                if(result_bak.stationList){
                    _this._queryNearyStation(itemData.jingdu,itemData.weidu,itemData);
                }
                
            });

            $("#btn_remove_1").on("click",function(){
                map.removeOverlay(insertMarker);
            });
        },

        _updateOrderNumResort:function(points){
            //数组按序号排序
            updateData.sort(arraySort("orderNum"));
            //右边table重新渲染
            _this._renderTable();
            markers=[];
            for(var i=0;i<updateData.length;i++){
                _this._markerMap(updateData[i],points);
            }
            _this._bindStopMarkerEvent();
            _this._drawLine(points);
        },
        _rightclick:function(itemData,marker){
            var dialogHtml=null;
            var sublines=null;
            if(itemData.stationProp==0){
                dialogHtml = _this._relPhyStionRight(itemData);
            }else{
                if(changeView){
                    dialogHtml=_this._lgoStionRight(itemData);
                }else{
                    dialogHtml=_this._vriPhyStionRight(itemData);
                }
            }
            
            marker.addEventListener("rightclick",function(){
                _this._removeCirleRangeMarker();
                var newlyDialogHtml =null;
                var rightclickDialog = null;
                //包含的地铁线路
                if((itemData.stationProp==0 || changeView == false) && itemData.stationId != 0 && itemData.stationId != 1){
                    if(itemData.stopExtend != null){
                        sublines = itemData.stopExtend.eInfo;
                    }
                    var content="";
                    var flagYu=null;
                    if(itemData.stationId != 0 && itemData.stationId != 1){
                        for(a in $.codemap.subways){
                            if(sublines != null){
                                flagYu=sublines.indexOf($.codemap.subways[a])>-1?'checked':'';
                            }
                            content += "<div class='checkbox'><label><input type='checkbox' name='subways' value='"+$.codemap.subways[a]+"' "+flagYu+">"+$.codemap.subways[a]+"</label></div>";
                        }
                    }
                    newlyDialogHtml = dialogHtml + "";
                    rightclickDialog = new BMap.InfoWindow(newlyDialogHtml);
                }else{
                    rightclickDialog = new BMap.InfoWindow(dialogHtml);
                }
                currentPointType = 0;
                rightclickDialog.redraw();

                this.openInfoWindow(rightclickDialog);
                
                setTimeout(function(){
                     _this._save_remove_btn(itemData, marker, rightclickDialog);
                },100);
               
            });
            
            
        
        },

        _drawLine:function(points){
            map.removeOverlay(stopCurve);
            var curve = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); 
            map.addOverlay(curve); 
            stopCurve = curve;
        },

        _leftclick: function(itemData,marker){
            marker.addEventListener("click", function(){
                _this._removeCirleRangeMarker();
                var infoContent=null,
                    content=null;

                if(itemData.stationProp==0){
                    infoContent= "<span>"+itemData.stationInfo.stationName+"</span>&nbsp;"
                        + "<input  type='hidden' id='stop_status' value="+itemData.status+">"
                        + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                        + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>"; 
                        content=_this._rel_phyStionTip(itemData,marker);
                        $('#vriTableRight').css('display','none');
                        
                }else{
                    if(changeView){
                        infoContent= "<span>"+itemData.stopName+"</span>"
                        + "<input  type='hidden' id='stop_status' value="+itemData.status+">&nbsp;"
                        + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                        + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>" 
                        + itemData.lineNo+" "+ (itemData.direction==0?"上行":"下行")+" 第 " + itemData.orderNum+" 站";
                        content=_this._lgoStationTip(itemData,marker);
                        $('#vriTableRight').css('display','none');
                        
                    }else{
                        
                        infoContent= "<span>"+itemData.stationInfo.stationName+"</span>"
                        + "<input  type='hidden' id='stop_status' value="+itemData.status+">&nbsp;"
                        + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                        + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>" ;
                        content = "<a class='btn btn-primary' id='vri_changeto_rel'>转真实物理站</a>";
                        //content=_this._vri_phyStionTip(itemData,marker);
                        //content = "<a class='btn btn-primary' id='vri_changeto_rel'>转真实物理站</a>&nbsp;";
                        //右侧表格显示
                        $('#rangMarkerRight').css('display','none');
                        $('#vriTableRight').html(_this._vri_phyStionTip(itemData,marker))
                                           .css('display','block');
                    }
                }
                var  opts = {
                          width : 270,     
                          height: 0,     
                          title : infoContent
                     };
                
                var infoWindow = new BMap.InfoWindow(content,opts);

                if(itemData.stationProp !==0 && !changeView){
                    infoWindow.setWidth(220);
                }

                setTimeout(function () {
                    $('#pickup-point').val(itemData.jingdu + "," + itemData.weidu);
                }, 100);

                currentPointType = 0;
                marker.openInfoWindow(infoWindow);

               setTimeout(function () {
                    _this._staiontipEvents(itemData,marker,infoWindow);//给tip框 加事件
                    if(itemData.stationProp==0 || itemData.stationProp==1){
                        for(var y=0;y<itemData.stationInfo.stopList.length;y++){
                            _this._trRangMarker_lgo($("#relstoplist tr"),itemData.stationInfo.stopList[y],y);
                        }
                    }

                }, 100);

                var leftClickOrderNum=$("#orderNum").val();
                var leftlineId=$("#leftlineId").val();
                var status=$("#stop_status").val();
                $("#table-map-body").children().each(function(){
                    var  orderNum=$(this).children().eq(0).text().trim();
                    if(orderNum==leftClickOrderNum){
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected");
                    }
                });
                // map.clearOverlays(map.getOverlays());
                //修改updateData 图标的状态
                for(var i=0; i<markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }
                markers=[];

                
                var points=[];
                for(var i=0;i<updateData.length;i++){
                    if(updateData[i].orderNum==leftClickOrderNum){
                        updateData[i].markerIconColor=1;
                    }else{
                        updateData[i].markerIconColor=0;
                    }
                    _this._markerMap(updateData[i],points);
                    _this._drawLine(points);//使用marker的point
                    if (updateData[i].markerIconColor==1) {
                        markers[i].openInfoWindow(infoWindow);

                        if(updateData[i].stationProp==0){
                           markers[i].setIcon(rIcon_two_six);
                        }else{
                            if(changeView){
                                markers[i].setIcon(rIcon_two);
                            }else{
                                markers[i].setIcon(rIcon_two_six);
                            }
                        }
                    }
                }

                _this._bindStopMarkerEvent();
            });
        },
        _relPhyStionRight:function(itemData){
            var dialogHtml = "<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stationInfo.stationName+"><br>"
                           + "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' value="+itemData.stationInfo.lng+"><br>"
                           + "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' value="+itemData.stationInfo.lat+"><br>"
                           + "<input type='hidden' id='orderNum'   value="+itemData.orderNum+">"
                            //"<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"
                            //"<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                           + "<button id='btn_save3'  class='btn btn-primary'>修改</button>&nbsp&nbsp"
                           + "<button id='btn_remove3'  class='btn btn-primary'>删除</button>"
                           + "<div id='subwaysInfo'  style='background-color: #F5F5F5;margin-top: 5px;'>地铁站信息"
                           + "<div style='max-height:100px;overflow:auto;'>"
                           + "<select multiple='multiple' id='subwaySelect' style='width:260px;'></select>"
                           + "</div></div>"
                return dialogHtml;
        },
        _lgoStionRight:function(itemData){
            var dialogHtml="<label>序&nbsp&nbsp号：</label><input type='text' id='orderNum'   value="+itemData.orderNum+"><br>"+"<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stopName+"><br>"+"<input type='hidden' id='direction' value="+itemData.direction+" />" +
                    "<label>线路号：</label><input type='text' id='lineNo' readonly=readonly value='"+itemData.lineNo+"'><br>"+
                    "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' value="+itemData.jingdu+"><br>"+
                    "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' value="+itemData.weidu+"><br>"+
                    "<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"+
                    "<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                    "<button id='btn_save1'  class='btn btn-primary'>修改</button>&nbsp&nbsp"+
                    "<button id='btn_remove1'  class='btn btn-primary'>删除</button>";
            return dialogHtml;
        },
        _vriPhyStionRight:function(itemData){
            var dialogHtml = "<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stationInfo.stationName+"><br>";
                dialogHtml += "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' readonly='readonly' value="+itemData.stationInfo.lng+"><br>";
                dialogHtml += "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' readonly='readonly' value="+itemData.stationInfo.lat+"><br>";
                dialogHtml += "<input type='hidden' id='orderNum'   value="+itemData.orderNum+">";
                 //"<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"+
                 //"<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                dialogHtml += "<button id='btn_save2'  class='btn btn-primary'>修改</button>&nbsp&nbsp";
                dialogHtml += "<button id='btn_remove2'  class='btn btn-primary'>删除</button>";
                dialogHtml += "<div id='subwaysInfo'  style='background-color: #F5F5F5;margin-top: 5px;'>地铁站信息";
                dialogHtml += "<div style='max-height:100px;overflow:auto;'>";
                dialogHtml += "<select multiple='multiple' id='subwaySelect' style='width:260px;'></select>";
                dialogHtml += "</div></div>";
                
            return dialogHtml;
        },
        _rel_phyStionTip:function(itemData,marker){
            var content="<div style='max-height:200px;overflow:auto;text-align: left'>";
            content += "<table  class='table table-hover'>";
            content += "<thead>";
            content += "<tr><th>线名</th><th>站名</th><th>下一站</th><th>方向</th></tr>";
            content += "</thead>";
            content += "<tbody id='relstoplist'>";
            for(var i=0;i<itemData.stationInfo.stopList.length;i++){
                content += "<tr><td>"+(itemData.stationInfo.stopList[i].lineName == undefined?lineDatas[0].lineName:itemData.stationInfo.stopList[i].lineName)+"</td>"
                        +  "<td>"+itemData.stationInfo.stopList[i].stopName+"</td>"
                        +  "<td>"+(itemData.stationInfo.stopList[i].nextStopName==null?"":itemData.stationInfo.stopList[i].nextStopName)+"</td>"
                        +  "<td>"+itemData.stationInfo.stopList[i].direction+"</td></tr>";
            }
            content += "</tbody>";
            content += "</table>";
            content += "</div>";
            content += "<a class='btn btn-primary' id='rel_phystation_split'>拆分</a>&nbsp;";
            content += "<a class='btn btn-primary' id='showrangestation'>显示附近物理站</a>&nbsp;";
            content += "<a class='btn btn-primary' id='lgorang_station_hidden2'>隐藏物理站</a>";
            return content;
        },
        _vri_phyStionTip:function(itemData,marker){
            var content="<div style='max-height:200px;overflow:auto;text-align: left'>";
            content += "<table  class='table table-hover'>";
            content += "<thead>";
            content += "<tr><th></th><th>线名</th><th>站名</th><th>下一站</th><th>方向</th></tr>";
            content += "</thead>";
            content += "<tbody id='relstoplist' style='background-color:white'>";
            for(var i=0;i<itemData.stationInfo.stopList.length;i++){
                content += "<tr><td><input type='checkbox' value='"+ i +"' class='vri_tip_ident'></td><td class='tip_table_w'>"+ (itemData.stationInfo.stopList[i].lineName == undefined?lineDatas[0].lineName:itemData.stationInfo.stopList[i].lineName)+"</td><td class='tip_table_w'>"+itemData.stationInfo.stopList[i].stopName+"</td><td>"+(itemData.stationInfo.stopList[i].nextStopName==null?"":itemData.stationInfo.stopList[i].nextStopName)+"</td><td>"+itemData.stationInfo.stopList[i].direction+"</td></tr>";
            }
            content += "</tbody>";
            content += "</table>";
            content += "</div>";
            content += "<a class='btn btn-primary' id='vri_phystation_split' style='margin-left:10%'>拆分</a>&nbsp;";
            //content += "<a class='btn btn-primary' id='vri_changeto_rel'>转真实物理站</a>&nbsp;"
            content += "<a class='btn btn-primary' id='vri_hide_station'>隐藏逻辑站</a>&nbsp;";
            content += "<a class='btn btn-primary' id='vri_table_close'>关闭</a>";
            return content;
        },
        _lgoStationTip:function(itemData,marker){
            var content="<div style='max-height:200px;overflow:auto;text-align: left'>";
            content += "<a class='btn btn-primary' id='lgorang_station'>显示附近物理站</a>&nbsp;";
            content += "<a class='btn btn-primary' id='lgorang_station_hidden3'>隐藏附近物理站</a>&nbsp;";
            return content;
        },

        /**
         * 所有infowindow中的按钮操作
         * @param itemData 该站点数据（包括物理站信息）
         * @param marker 该站点marker对象
         * @param infoWindow 该站点infowindow对象
         */
        _staiontipEvents:function(itemData,marker){

            _this._removeCirleRangeMarker();

            //真实物理站拆分
            $("#rel_phystation_split").on('click',function(){
                _this._removeCirleRangeMarker();

                //怪异行为的去除 stopList中多出stationInfo
                itemData=_this._clearItemDateStationInfo(itemData);
                
                var splitStop=null;//拆分出的数据
                var csstopList=itemData.stationInfo.stopList;
                
                //修改itemData
                for(var i=0;i<csstopList.length;i++){
                    if(csstopList[i].lineNo==lineDatas[0].lineNo &&  csstopList[i].direction==lineDatas[0].direction){
                        splitStop=csstopList[i];
                        csstopList.splice(i,1);
                    }
                }

                _this._opsaveRel(itemData,marker,splitStop);
                _this._fillStopTable(updateData);

            });

            //虚拟物理站转真实物理
            $("#vri_changeto_rel").on('click',function(){
               
                $("#vri_changeto_rel").css("visibility","hidden");
                markers[itemData.orderNum-1].setIcon(phy_shi);
                //去除怪异的行为 stoplist中包含stationinfo
                itemData=_this._clearItemDateStationInfo(itemData);

                _this._removeCirleRangeMarker();

                //转真实物理站的话，与该物理站相关的逻辑站的站点名称，经纬度都需要更改为该物理站的
                //这种情况是：拆分后的转成虚拟物理站，没有stationId
                if(itemData.stationId==0){
                    itemData.stationId=1;
                }

                //转真实的是本线路
                //if(isOrNotInclude){
                itemData.stationProp=0;
                itemData.stationInfo.isVirtual=1;
                itemData.stopName=itemData.stationInfo.stationName;
                itemData.jingdu=itemData.stationInfo.lng;
                itemData.weidu=itemData.stationInfo.lat;
                if(itemData.stationInfo){
                    for(var i=0;i<itemData.stationInfo.stopList.length;i++){
                        itemData.stationInfo.stopList[i].stopName=itemData.stationInfo.stationName;
                        itemData.stationInfo.stopList[i].jingdu=itemData.stationInfo.lng;
                        itemData.stationInfo.stopList[i].weidu=itemData.stationInfo.lat;
                    }
                }
              
                //map.closeInfoWindow();

                updateData[itemData.orderNum-1].jingdu=itemData.stationInfo.lng;
                updateData[itemData.orderNum-1].weidu=itemData.stationInfo.lat;
                updateData[itemData.orderNum-1].stopName=itemData.stationInfo.stationName;
                updateData[itemData.orderNum-1].stationProp=0;
                updateData[itemData.orderNum-1].stationInfo=itemData.stationInfo;
                if(updateData[itemData.orderNum-1].stationId==0){
                   updateData[itemData.orderNum-1].stationId=1;
                   updateData[itemData.orderNum-1].stationInfo.stationId=1;
                   updateData[itemData.orderNum-1].stationInfo.stopList[0].stationId=1;
                }

                for(var i=0;i<updateStationList.length;i++){
                    if(itemData && (itemData.stationId == updateStationList[i].stationId)){
                        updateStationList[i].isVirtual = 1;
                        updateStationList[i].stopList = itemData.stationInfo.stopList;
                    }
                }

                map.closeInfoWindow();

                //站点右击
                _this._rightclick(itemData,markers[itemData.orderNum-1]);
                 
            });

            //虚拟物理站拆分，现在可以拆其他线路的
            $("#vri_phystation_split").on('click',function(){

                if(!$('.vri_tip_ident:checked').length){
                    alert('请先勾选!');
                    return;
                }

                _this._removeCirleRangeMarker();
                
                //var splitStop=null;
                var splitStop = [];

                //去除嵌套对象的怪异现象
                itemData=_this._clearItemDateStationInfo(itemData);
                
                var isstopList=itemData.stationInfo.stopList;
                if(isstopList.length>0){
                    var checkSel = $('.vri_tip_ident:checked');
                    for(var i=0;i<checkSel.length;i++){
                        var indexStop = checkSel.eq(i).val();
                        if(i == 0){
                            splitStop.push(isstopList[indexStop]);
                            isstopList.splice(indexStop,1);
                        }else{
                            splitStop.push(isstopList[indexStop-i]);
                            isstopList.splice(indexStop-i,1);
                        }
                    }
                    
                    _this._opsave(itemData,marker,splitStop);
                }
            });

            //逻辑站隐藏周围物理站
            $("#lgorang_station_hidden1, #lgorang_station_hidden2, #lgorang_station_hidden3").on('click',function(){
                _this._removeCirleRangeMarker();
            });

            //查看周围物理站
            $("#lgorang_station").on('click',function(){
                
                _this._removeCirleRangeMarker();

                $.get(__baseUrl + '/baseData/nearbyStops?cityId='+_this._getCity().cityId+'&lng='+itemData.jingdu+"&lat="+itemData.weidu+'&radius=300',function(result){
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        }else{
                            if(result.data.stationList.length>0){
                                var res=result.data.stationList;
                                var operaHtml="";
                                var newres=[];

                                res = _this._physicListSort(res,itemData.stopName); 
                                //这里要去除自己本身的物理站点
                                for(var i=0;i<res.length;i++){
                                    if(res[i].stationId!=itemData.stationId && (res[i].stationName).indexOf(itemData.stopName)>-1){
                                         operaHtml += "<tr><td><input type='checkbox' data-stationid='"+ res[i].stationId +"'></td><td>"+res[i].stationName+"</td><td>"+(res[i].isVirtual==0?'虚拟':'真实')+"</td>/tr>";
                                         newres.push(res[i]);
                                    }
                                }
                                
                                if(newres.length==0){
                                    alert("周围无物理站点!");
                                    return;
                                }
                                $("#vriTableRight").css("display","none");
                                $("#rangMarkerRight").css("display","block");
                                $("#rangMarkerRight table tbody").html(operaHtml);

                                //给每行添加点击，并且marker
                                for(var y=0;y<res.length;y++){
                                    _this._trRangMarker($("#rangMarkerRight table tbody tr"),res[y],y);
                                }

                                _this._drawRangPhyMarker(itemData,newres,marker);
                            }else{
                                alert("周围无物理站点!");
                            }

                        }
                    }
                })

            });
            
            $("#showrangestation").click(function(){
                _this._removeCirleRangeMarker();
                
                $.get(__baseUrl + '/baseData/nearbyStops?cityId='+_this._getCity().cityId+'&lng='+itemData.jingdu+"&lat="+itemData.weidu+'&radius=300',function(result){
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        }else{
                            if(result.data.stationList.length>0){
                                var res=result.data.stationList;
                                var operaHtml="";
                                var newres=[];
                                //这里要去除自己本身的物理站点
                                for(var i=0;i<res.length;i++){
                                    if(res[i].stationId!=itemData.stationId ){
                                         operaHtml += "<tr><td><input type='checkbox' data-stationid='"+ res[i].stationId +"'></td><td>"+res[i].stationName+"</td><td>"+(res[i].isVirtual==0?'虚拟':'真实')+"</td>/tr>";
                                         newres.push(res[i]);
                                    }
                                }
                                
                                if(newres.length==0){
                                    alert("周围无物理站点!");
                                    return;
                                }
                                $("#vriTableRight").css("display","none");
                                $("#rangMarkerRight").css("display","block");
                                $("#rangMarkerRight table tbody").html(operaHtml);

                                //给每行添加点击，并且marker
                                for(var y=0;y<res.length;y++){
                                    _this._trRangMarker($("#rangMarkerRight table tbody tr"),res[y],y);
                                }
                                
                                _this._seerangemarker(itemData,newres,marker);
                                //_this._drawRangPhyMarker(itemData,newres,marker);
                            }else{
                                alert("周围无物理站点!");
                            }

                        }
                    }
                })
            })

            $('#vri_hide_station').on('click',function(){
                if(showMarker){
                    map.removeOverlay(showMarker);
                    showMarker=null;
                }
            })

            $('#vri_table_close').on('click',function(){
                map.closeInfoWindow();
                if(showMarker){
                    map.removeOverlay(showMarker);
                    showMarker=null;
                }
                $("#vriTableRight").css('display','none')
                                   .html('');
            })
            
           
        },
        
        _seerangemarker:function(itemData,resData,originmarker){
             rangemarkers=[];
             rangCircle = new BMap.Circle(new BMap.Point(itemData.jingdu,itemData.weidu),300,{fillColor:""});  // 创建标注
             map.addOverlay(rangCircle);

             //给每个周围的物理站添加事件
             for(var i=0;i<resData.length;i++){
                 var point = new BMap.Point(resData[i].lng,resData[i].lat);
                 var marker = new BMap.Marker(point);

                 map.addOverlay(marker);              
                 rangemarkers.push(marker);

                 _this._seemarker(resData[i],marker);
             }
        },
        
        _seemarker:function(data,marker){
            marker.addEventListener("click", function(){ 
             
                var opts = {
                          width : 200,     
                          height: 0
                        }
                
                var content="站名:"+data.stationName+"<br>"
                            +"经度:"+data.lng+"<br>"
                            +"纬度:"+data.lat+"<br>";
                var infoWindow = new BMap.InfoWindow(content, opts);  
                marker.openInfoWindow(infoWindow);
            })
        },
        /**
         * 数据格式的构造
         */
        _dataFromFunc:function(itemData,splitStop){
            var newa={
                    direction:itemData.direction,
                    jingdu:itemData.jingdu,
                    lineName:itemData.lineName,
                    lineNo:itemData.lineNo,
                    linemapId:itemData.linemapId,
                    //nextStopName:itemData.nextStopName,
                    orderNum:itemData.orderNum,
                    sjingdu:(itemData.sjingdu?itemData.sjingdu:0),
                    stationId:0,
                    stationInfo:{
                        cityId:itemData.stationInfo.cityId,
                        isVirtual:itemData.stationInfo.isVirtual,
                        lat:itemData.stationInfo.lat,
                        lng:itemData.stationInfo.lng,
                        slat:itemData.stationInfo.slat,
                        slng:itemData.stationInfo.slng,
                        stationId:0,
                        stationName:itemData.stationInfo.stationName,
                        stopList:[splitStop]
                    },
                    stationProp:itemData.stationProp,
                    stopName:itemData.stopName,
                    sweidu:(itemData.sweidu?itemData.sweidu:0),
                    weidu:itemData.weidu,
            };
            
            return newa;
        },
        
        _clearItemDateStationInfo:function(itemData){
            var newa={
                    direction:itemData.direction,
                    jingdu:itemData.jingdu,
                    //lineName:itemData.lineName,
                    lineNo:itemData.lineNo,
                    linemapId:itemData.linemapId,
                    nextStopName:itemData.nextStopName,
                    orderNum:itemData.orderNum,
                    sjingdu:(itemData.sjingdu?itemData.sjingdu:0),
                    stationId:itemData.stationId,
                    stationInfo:{
                        cityId:itemData.stationInfo.cityId,
                        isVirtual:itemData.stationInfo.isVirtual,
                        lat:itemData.stationInfo.lat,
                        lng:itemData.stationInfo.lng,
                        slat:itemData.stationInfo.slat,
                        slng:itemData.stationInfo.slng,
                        stationId:itemData.stationInfo.stationId,
                        stationName:itemData.stationInfo.stationName,
                        stopList:[]
                    },
                    stationProp:itemData.stationProp,
                    stopName:itemData.stopName,
                    sweidu:(itemData.sweidu?itemData.sweidu:0),
                    weidu:itemData.weidu,
            };
            for(var y=0;y<itemData.stationInfo.stopList.length;y++){
                newa.stationInfo.stopList.push({
                    direction:itemData.stationInfo.stopList[y].direction,
                    jingdu:itemData.stationInfo.stopList[y].jingdu,
                    lineName:itemData.stationInfo.stopList[y].lineName,
                    lineNo:itemData.stationInfo.stopList[y].lineNo,
                    linemapId:itemData.stationInfo.stopList[y].linemapId,
                    nextStopName:itemData.stationInfo.stopList[y].nextStopName,
                    orderNum:itemData.stationInfo.stopList[y].orderNum,
                    sjingdu:itemData.stationInfo.stopList[y].sjingdu,
                    stationId:itemData.stationInfo.stopList[y].stationId,
                    stopName:itemData.stationInfo.stopList[y].stopName,
                    sweidu:itemData.stationInfo.stopList[y].sweidu,
                    weidu:itemData.stationInfo.stopList[y].weidu
                })
            }

            return newa;
        },

        _trRangMarker:function(selector,data,count){
            $(selector).eq(count).on('click',function(){
                $(this).addClass("trselected")
                       .siblings().removeClass("trselected");
                $(rangemarkers[count].K).click();
            })
        },
        _trRangMarker_lgo:function(selector,data,count){
            $(selector).eq(count).on('click',function(){
                $(this).addClass("trselected")
                       .siblings().removeClass("trselected");

                _this._removeCirleRangeMarker();

                showMarker = new BMap.Marker(new BMap.Point(data.jingdu,data.weidu),{icon:new BMap.Icon(__baseUrl + "/images/phy_station.png",new BMap.Size(30,30)),offset:offset});
                map.addOverlay(showMarker);

                showMarker.addEventListener("click",function(){
                    var content="<span>站名:"+data.stopName+"</span><br/>"
                                   +"<span>经度:"+data.jingdu+"</span><br/>"
                                   +"<span>纬度:"+data.weidu+"</span>";

                    var infoWindow = new BMap.InfoWindow(content,{width:200,height: 0});
                    showMarker.openInfoWindow(infoWindow);
                })

            })
        },

        /**
         * 逻辑站->查看周围物理站->画周围物理站
         */
        _drawRangPhyMarker:function(itemData,resData,originmarker){
            rangemarkers=[];
            rangCircle = new BMap.Circle(new BMap.Point(itemData.jingdu,itemData.weidu),300,{fillColor:""});  // 创建标注
            map.addOverlay(rangCircle);

            //给每个周围的物理站添加事件
            for(var i=0;i<resData.length;i++){
                var point = new BMap.Point(resData[i].lng,resData[i].lat);
                var marker = null;
                if(resData[i].isVirtual == 1){
                   marker  = new BMap.Marker(point,{icon:nearbyRelIcon,offset:offset});
                }else{
                   marker  = new BMap.Marker(point,{icon:nearbyFalIcon,offset:offset});
                }
                map.addOverlay(marker);              
                rangemarkers.push(marker);

                _this._rangMarkerTBindTip(itemData,marker,resData[i],originmarker);
            }

        },

        /**
         * resData 周围某一个物理站数据
         */
        _rangMarkerTBindTip:function(itemData,marker,resData,originmarker){
            marker.addEventListener("click", function(){ 
                var opts = {
                          width : 200,     
                          height: 0
                        }
                
                var content = "<div style='max-height:200px;overflow:auto'>";
                    content += "<table class='table'>";
                    content += "<thead><tr><td>线名</td><td>站名</td><td>下一站</td><td>方向</td></tr></thead>";
                    content += "<tbody>";
                    for(var i=0;i<resData.stopList.length;i++){
                        content+="<tr><td class='tip_table_w'>"+(resData.stopList[i].lineName==null?"":resData.stopList[i].lineName)+"</td><td>"+(resData.stopList[i].stopName==null?"":resData.stopList[i].stopName)+"</td><td>"+(resData.stopList[i].nextStopName==null?"":resData.stopList[i].nextStopName)+"</td><td>"+(resData.stopList[i].direction==null?"":resData.stopList[i].direction)+"</td></tr>";
                    }   
                    content += "<table>";
                    content += "<div>";
                    
                var infoWindow = new BMap.InfoWindow(content+"<a class='btn btn-primary' id='lgostation_merge'>合并</a>", opts);  
                marker.openInfoWindow(infoWindow);

                $("#lgostation_merge").on('click',function(){//合并
                    
                    //先从本站点的stationInfo中将本站从该站归属的物理站信息中拆分出来
                    var splitStop=null;
                    var isstopList = itemData.stationInfo.stopList;
                    for(var i=0;i<isstopList.length;i++){
                        if(isstopList[i].lineNo==lineDatas[0].lineNo && isstopList[i].direction==lineDatas[0].direction){
                            splitStop = isstopList[i];
                            isstopList.splice(i,1);
                        }
                    }

                    //先从本身归属的物理站拆分
                    for(var i=0;i<updateStationList.length;i++){
                        if(updateStationList[i].stationId==itemData.stationId){
                            var udst=updateStationList[i];
                            for(var y=0;y<udst.stopList.length;y++){
                                if(udst.stopList[y].direction==lineDatas[0].direction && udst.stopList[y].lineNo==lineDatas[0].lineNo){
                                    udst.stopList.splice(y,1);
                                }
                            }   
                        }
                    }

                    _this._oplgosave(itemData,resData,marker,splitStop);
                })
            });
            
            marker.addEventListener("rightclick", function(){

               var content = "<div id='rangeSubwaysInfo'  style='background-color: #F5F5F5;margin-top: 5px;'>地铁站信息"
                           + "<div style='max-height:100px;overflow:auto;'>"
                           + "<select multiple='multiple' id='rang_subwaySelect' style='width:200px;'></select>"
                           + "</div>";
               var infoWindow = new BMap.InfoWindow(content+"<a class='btn btn-primary' id='rangMarker_save'>保存</a>", {
                   width : 200,     
                   height: 0
               });  
               marker.openInfoWindow(infoWindow);
               setTimeout(function(){
                   $("#rang_subwaySelect").select2({
                       data:subwaysDataArray
                   }); 
                   
                   if(resData.stopExtend && resData.stopExtend.eInfo){
                       var sublines = JSON.parse(resData.stopExtend.eInfo);
                       $("#rang_subwaySelect").select2("val",sublines.subway.split(','));
                   }
                   
                   $("#rangMarker_save").on('click',function(){
                       var selVal = $("#rang_subwaySelect").select2("val");
                       //提交至后台
                       //"{"simplePrice":"1号线,2号线"}"
                       var ops;
                       if(resData.stopExtend){
                           ops ={
                                eId:resData.stopExtend.eId?resData.stopExtend.eId:null,
                                cityId:resData.stopExtend.cityId?resData.stopExtend.cityId:_this._getCity().cityId,
                                relationId:resData.stopExtend.relationId?resData.stopExtend.relationId:resData.stationId,
                                type:resData.stopExtend.type?resData.stopExtend.type:1,
                                eInfo:"{\"subway\":\""+ (selVal?selVal.join(','):'') +"\"}"
                           }
                       }else{
                           ops ={
                                eId:null,
                                cityId:_this._getCity().cityId,
                                relationId:resData.stationId?resData.stationId:'',
                                type:1,
                                eInfo:"{\"subway\":\""+ (selVal?selVal.join(','):'') +"\"}"
                           }
                       }
                       $.postLock(__baseUrl + '/baseData/modifyExdInfo',ops,function(result){
                           if(result.status === 'OK'){
                               resData.stopExtend = result.data[0];
                               alert('保存成功!')
                               //应该合并的时候改物理站应该就包括了地铁站
                               
                           }else{
                               alert('保存失败!');
                           }
                       })
                       
                   })
                   
               },100)
            })
            
        },

        /**
         * "逻辑站"合并操作
         * 先从本站点的stationInfo中将本站从该站归属的物理站信息中拆分出来
         */
        _oplgosave:function(itemData,resData,marker,splitStop){
            
             //成功后进行赋值
            var _markerIconColor=itemData.markerIconColor;
            var _id=itemData.id;
            var _status=itemData.status;
                    
            //再进行合并,判断是否为真实物理站,真实物理站需要修改站名，经纬度,需要修改站点位置
            if(resData.isVirtual==1){
                
                //更新itemData
                itemData.jingdu=resData.lng;
                itemData.weidu=resData.lat;
                itemData.stopName=resData.stationName;
                
                map.removeOverlay(marker);
                            
                //移除原逻辑站点,并清空周围物理站点
                map.closeInfoWindow();
         
                //隐藏周围站点table
                $("#rangMarkerRight").css("display","none");
                         
                //并确定该站点属性 新建marker
                itemData.stationProp=0;
                newmarker=new BMap.Marker(new BMap.Point(resData.lng,resData.lat),{icon:phy_shi,offset:offset}); 
                         
                //更新markers
                map.removeOverlay(markers[itemData.orderNum-1]);
                markers[itemData.orderNum-1]=newmarker;
                         
                itemData.lineName=lineDatas[0].lineName;
                map.addOverlay(newmarker);
                var label = new BMap.Label(itemData.orderNum);
                label.setOffset(defaultLableOffsetSize);
                newmarker.setLabel(label);
                newmarker.setOffset(offset);
                         
                _this._lgo_stopchange(itemData,newmarker);
            }
            var stopExtend = itemData.stopExtend;      
            //可能要循环
            delete itemData.stopExtend;
            delete itemData.stationProp;
            delete itemData.markerIconColor;
            delete itemData.status;
            delete itemData.id;
            delete itemData.stationInfo;
                    
            //itemData少了一个nextStopName 与  lineName 该站点合并到一个物理站中resData：一个物理站信息
            itemData.stationId=resData.stationId;
            
                    
            var constrItemData = $.extend(true,{},itemData);
            if(updateData[itemData.orderNum]){
                constrItemData.nextStopName = updateData[itemData.orderNum].stopName;
            }else{
                constrItemData.nextStopName = '';
            }
            
            delete constrItemData.stationInfo;
                    
            resData.stopList.push(constrItemData);
                    
            //如果查看的周围物理站你在返回的stationList中的话，就要更新updatesStationList
            for(var i=0;i<updateStationList.length;i++){
                  if(resData.stationId==updateStationList[i].stationId){
                     updateStationList[i].stopList.push(itemData);
                     break;
                  }else{
                     //说明该物理站不在updateStationList中
                     updateStationList.push(resData);
                      break;
                  }
            }
    
            //新的itemData
            itemData.stationInfo=resData;
            itemData.stationId = resData.stationId;
            itemData.id=_id;
            itemData.markerIconColor=_markerIconColor;
            itemData.status=_status;
            itemData.stopExtend = (resData.stopExtend?resData.stopExtend:null);
            if(resData.isVirtual==1){
                itemData.stationProp=0;
            }else{
                itemData.stationProp=1;
            }
            _this._removeCirleRangeMarker();
        },

        /**
         * itemData是新的站点信息，包括新合并的物理站信息
         * 站点合并操作后对newmarker绑定事件
         */
        _lgo_stopchange:function(itemData,marker){
            var content=null;

            marker.addEventListener("click", function(){ 
                
                _this._removeCirleRangeMarker();
                
                 var infoContent_one= "<span>"+itemData.stopName+"</span>&nbsp;"
                 + "<input  type='hidden' id='stop_status' value="+itemData.status+">"
                 + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                 + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>" 
                 + lineDatas[0].lineNo+" "+ (lineDatas[0].direction==0?"上行":"下行")+" 第 " + itemData.orderNum+" 站";
                 
                 var infoContent_two= "<span>"+itemData.stationInfo.stationName+"</span>&nbsp;"
                 + "<input  type='hidden' id='stop_status' value="+itemData.status+">"
                 + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                 + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>"; 
                 
                if(itemData.stationInfo.isVirtual==1){
                    content=_this._rel_phyStionTip(itemData,marker);
                }else{
                    content=_this._lgoStationTip(itemData,marker);
                } 

                 var opts = {
                         width : 270,     
                         height: 0,     
                         title : itemData.stationInfo.isVirtual==1?infoContent_two:infoContent_one
                       }

                 var infoWindow = new BMap.InfoWindow(content,opts);
                 marker.openInfoWindow(infoWindow);

                 _this._staiontipEvents(itemData,marker);//给tip框 加事件

            })

            _this._rightclick(itemData,marker);//站点右击

            //右边表格点击的点发生变化，updateData发生变化
            var points=[],point=null;
            
            //更新updateData
            var orderNum_index=itemData.orderNum-1;
            
            updateData[orderNum_index]=itemData;
            if(itemData.stationInfo.isVirtual==0){
                updateData[orderNum_index].stationProp=1;
                updateData[orderNum_index].stationInfo=itemData.stationInfo;//->
                updateData[orderNum_index].stationId=itemData.stationInfo.stationId;
                point = new BMap.Point(itemData.jingdu,itemData.weidu);
                
            }else if(itemData.stationInfo.isVirtual==1){
                updateData[orderNum_index].jingdu=itemData.stationInfo.lng;
                updateData[orderNum_index].weidu=itemData.stationInfo.lat;
                updateData[orderNum_index].stopName=itemData.stationInfo.stationName;
                updateData[orderNum_index].stationProp=0;
                updateData[orderNum_index].stationInfo=itemData.stationInfo;
                updateData[orderNum_index].stationId=itemData.stationInfo.stationId;
                point = new BMap.Point(itemData.stationInfo.lng,itemData.stationInfo.lat);
            }
            
            //点推入points
            for(var i=0;i<updateData.length;i++){
                
                //根据点属性不同 添加不同的图标
                if(updateData[i].orderNum == itemData.orderNum){
                    if(itemData.stationInfo.isVirtual==0){
                        point = new BMap.Point(itemData.jingdu,itemData.weidu);
                    }else if(itemData.stationInfo.isVirtual==1){
                        point = new BMap.Point(itemData.stationInfo.lng,itemData.stationInfo.lat);
                    }
                }else{
                    point = new BMap.Point(updateData[i].jingdu,updateData[i].weidu);
                }
                
                points.push(point);
            }
            
            //重新画蓝线与表格点击事件
            _this._tableChaifenPhy(itemData);
            _this._loopTableClick();
            
            //重画蓝线
            _this._drawLine(points);
            
        },
        
        /**
         * 物理站拆分操作
         * splitStopArray是数组
         */
        _opsave:function(itemData,marker,splitStopArray){
            //1.将自身在原来的基础上拆分出来。
            //2.将自身保存为一个单独的物理站 
            //物理站拆分不应该将updateData中的该线路物理站删除
            
            //操作的站点原来的属性，导致拆分的不同
            var isOrNotInclude = false;
                //本线路站点信息
                splitStop = null;

            for(var i = 0; i < splitStopArray.length; i++){
                if(splitStopArray[i].lineNo == lineDatas[0].lineNo &&  splitStopArray[i].direction == lineDatas[0].direction){
                    isOrNotInclude = true;
                    splitStop = splitStopArray[i];
                    splitStopArray.splice(i,1);
                }
            }

            //本线路站点
            if(isOrNotInclude){
                var flag=itemData.stationProp;
                var stationId=splitStop.stationId;
                itemData.stationInfo.isVirtual=0;
                splitStop.stationId=0;
                
                if(itemData.stationProp != null && itemData.stationProp != undefined){
                     //修改updateData 自身形成一个物理站 linemapId=null stationId=0
                    itemData=_this._dataFromFunc(itemData,splitStop);
                }
                
                if(changeView){
                    markers[itemData.orderNum-1].setIcon(rIcon);
                }else{
                    markers[itemData.orderNum-1].setIcon(virOnlyOne);
                }
                        
                _this._stopchange(itemData,marker,flag,stationId);

            }

            //只拆其他的线路
            if(splitStopArray.length && !isOrNotInclude){

                if(itemData.stationInfo && itemData.stationInfo.stopList && itemData.stationInfo.stopList.length){
                    //修改itemData
                    for(var i = 0;i < splitStopArray.length;i++){
                        for(var y = 0;y < itemData.stationInfo.stopList.length;y++){
                            var ssL = splitStopArray[i];
                            var iiL = itemData.stationInfo.stopList[y];
                            if(ssL.lineNo == iiL.lineNo && ssL.direction == iiL.direction){
                                itemData.stationInfo.stopList.splice(y,1);
                            }
                        }
                    }

                    //修改updateData
                    updateData[itemData.orderNum-1].stationInfo.stopList = itemData.stationInfo.stopList;

                    //修改updateStationList
                    for(var i = 0; i<updateStationList.length;i++){
                        if(updateStationList[i].stationId == itemData.stationId){
                            updateStationList[i].stopList = itemData.stationInfo.stopList;
                        }
                    }
                }

                //发送到后台
                _this._splitStationReq(splitStopArray,itemData);
            }

            //拆分的有其他线路 也有 本线路站点
            if(splitStopArray.length && isOrNotInclude){

                //修改updateStationList
                for(var i = 0; i<updateStationList.length;i++){
                    var selUpdaSta = updateStationList[i];
                    if(selUpdaSta.stationId == itemData.stationId){
                        for(var k = 0;k < splitStopArray.length;k++){
                            for(var y = 0;y < selUpdaSta.stopList.length;y++){
                                if(splitStopArray[k].lineNo == selUpdaSta.stopList[y].lineNo && splitStopArray[k].direction == selUpdaSta.stopList[y].direction){
                                    updateStationList[i].stopList.splice(y,1);
                                }
                            }
                        }
                    }
                }


                //发送到后台
                _this._splitStationReq(splitStopArray,itemData);

            }

            //map.closeInfoWindow();

            _this._removeCirleRangeMarker(); 

            //_this._rightclick(itemData,markers[itemData.orderNum-1]);
              
            
                       
        },
        _opsaveRel:function(itemData,marker,splitStop){
            var flag=itemData.stationProp;
            var stationId=splitStop.stationId;
            itemData.stationInfo.isVirtual=0;
            splitStop.stationId=0;
            
            if(itemData.stationProp != null && itemData.stationProp != undefined){
                 //修改updateData 自身形成一个物理站 linemapId=null stationId=0
                itemData=_this._dataFromFunc(itemData,splitStop);
            }
            
            if(changeView){
                markers[itemData.orderNum-1].setIcon(rIcon);
            }else{
                markers[itemData.orderNum-1].setIcon(virOnlyOne);
            }

            map.closeInfoWindow();
                    
            _this._stopchange(itemData,marker,flag,stationId);
        },
        _splitStationReq:function(splitStopArray,itemData){
            var linemapIds = [],
                resbakStation = null;
                for(var i=0;i<splitStopArray.length;i++){
                    linemapIds.push(splitStopArray[i].linemapId);
            }
            $.post(__baseUrl + '/baseData/splitStation',{
                stationId:splitStopArray[0].stationId,
                linemapIds:linemapIds.join(),
                cityId: _this._getCity().cityId
            },function(result){
                if(result.status === 'OK'){
                    //alert('拆分成功!');
                    $('#rangMarkerRight').css('display','none');
                    var shtml = '';
                    for(var i=0;i<itemData.stationInfo.stopList.length;i++){
                        shtml += "<tr><td><input type='checkbox' value='"+ i +"' class='vri_tip_ident'></td><td class='tip_table_w'>"+ (itemData.stationInfo.stopList[i].lineName == undefined?lineDatas[0].lineName:itemData.stationInfo.stopList[i].lineName)+"</td><td class='tip_table_w'>"+itemData.stationInfo.stopList[i].stopName+"</td><td>"+(itemData.stationInfo.stopList[i].nextStopName==null?"":itemData.stationInfo.stopList[i].nextStopName)+"</td><td>"+itemData.stationInfo.stopList[i].direction+"</td></tr>";
                        
                    }
                    $('#vriTableRight table tbody').html(shtml);
                    for(var i=0;i<itemData.stationInfo.stopList.length;i++){
                        _this._trRangMarker_lgo($("#vriTableRight table tbody tr"),itemData.stationInfo.stopList[i],i);
                    }
                }else{
                    alert('拆分失败!');
                    return;
                }
                
            })
        },

        /**
         * 物理站拆分，虚拟物理站拆分 对站点影响
         */
        _stopchange:function(itemData,marker,flag,stationId){
            map.closeInfoWindow();
            //delete itemData.stationInfo;
            //flag==0是物理站拆分
            //flag==1是逻辑站拆分
            if(flag==0){
                itemData.stationProp=1;
                var marker=markers[itemData.orderNum-1];
                
                //设置可拖拽
                marker.enableDragging();
                _this._dragMaker(itemData,marker);
                
                var infoContent= "<span>"+itemData.stopName+"</span>"
                 + "<input  type='hidden' id='stop_status' value="+itemData.status+">"
                 + "<input type='hidden'  id='orderNum' value='"+itemData.orderNum+"'/>" 
                 + "<input type='hidden'  id='leftlineId' value='"+itemData.linemapId+"'/>";

               var opts = {
                       width : 250,     
                       height: 0,     
                       title : infoContent
                     }
               var content=_this._lgoStationTip(itemData,marker);
               var infoWindow = new BMap.InfoWindow(content,opts);
               marker.openInfoWindow(infoWindow);
               
               //给infowindow添加左击事件
               setTimeout(function(){
                   _this._staiontipEvents(itemData,marker);
                   $("#lgorang_station").click();
               },100);
              
               //更新updateData,蓝线不需要变化
               //拆分出的站点自己是一个stationId=0的包括自身的站点
               itemData.id=updateData[itemData.orderNum-1].id;//添加一个id
               updateData[itemData.orderNum-1]=itemData;

               //更新updateStationList
               for(var i=0;i<updateStationList.length;i++){
                 if(updateStationList[i].stationId==stationId){
                    var udst=updateStationList[i];
                    for(var y=0;y<udst.stopList.length;y++){
                        if(udst.stopList[y].direction==lineDatas[0].direction && udst.stopList[y].lineNo==lineDatas[0].lineNo){
                            udst.stopList.splice(y,1);
                        }
                    }
                   }
               }

               //将新增的自身物理站，添加入updateStationList，不需要，因为后台会判断maplist中stationId为0或1的站点，并设为物理站。
               
               _this._loopTableClick();
               
               //拆分成功后，主动显示周围物理站，推荐进行归并
               
            }else{
                //虚拟物理站拆分
                if(changeView==false){
                    
                    //更新updateData,蓝线不需要变化
                    markers[itemData.orderNum-1].setIcon(phy_xu);
                    updateData[itemData.orderNum-1]=itemData;

                    //更新updateStationList
                    for(var i=0;i<updateStationList.length;i++){
                        if(updateStationList[i].stationId==stationId){
                            var udst=updateStationList[i];
                            for(var y=0;y<udst.stopList.length;y++){
                                if(udst.stopList[y].direction==lineDatas[0].direction && udst.stopList[y].lineNo==lineDatas[0].lineNo){
                                    udst.stopList.splice(y,1);
                                }
                            }
                        }
                    }

                    $('#vriTableRight').css('display','none')
                                       .html('');
                    map.closeInfoWindow();
                    _this._leftclick(itemData,markers[itemData.orderNum-1]);
                }
            }
            
            //站点右击
            _this._rightclick(itemData,markers[itemData.orderNum-1]);
            

        },
        _dragMaker:function(itemData,marker){
            //主要是更新infowindow、右边列表和record的经纬度，并标识右边列表中哪些为修改项，重绘蓝线
            marker.addEventListener("dragend",function(e){
                _this._removeCirleRangeMarker();

                currentPointType = 0;
                var newItemData={};
                newItemData.orderNum=itemData.orderNum;
                newItemData.lineNo=itemData.lineNo;
                newItemData.stopName=itemData.stopName;
                //释放拖动时Marker所在的经纬度 
                newItemData.jingdu=e.point.lng;
                newItemData.weidu=e.point.lat;
                newItemData.direction=itemData.direction;
                //currentPoint = parseInt(itemData.order,10);

                for (var i=0; i<markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }

                //表格中的相应行变色
                $("#table-map-body").children().each(function(){
                    var order=$(this).children().eq(0).text().trim();
                    if(order == itemData.orderNum){
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected");
                        var record = $(this).data('record');
                        record.jingdu = newItemData.jingdu;
                        record.weidu = newItemData.weidu;
                        record.sjingdu = newItemData.sjingdu;
                        record.sweidu  = newItemData.sweidu;
                    }
                });

                var i = newItemData.orderNum - 1;
                updateData[i].jingdu=newItemData.jingdu;
                updateData[i].weidu=newItemData.weidu;
                updateData[i].orderNum=newItemData.orderNum;
                updateData[i].stopName=newItemData.stopName;
                updateData[i].sjingdu=0;
                updateData[i].sweidu=0;
                updateData[i].status=2;

                //重新画站点marker和蓝线
                markers=[];
                var points = [];
                for(var i=0;i<updateData.length;i++){
                    _this._markerMap(updateData[i],points);
                }
                _this._bindStopMarkerEvent();
                _this._drawLine(points);
                //$("#map-save").removeClass("btn-primary").addClass("btn-danger");
            });
        },
        /**
         * 拆分后改变table的点击坐标
         */
        _tableChaifenLgo:function(itemData){
            $("#table-map-body").children().each(function(){
                var order=$(this).children().eq(0).text().trim();
                if(order == itemData.orderNum){
                    $(this).siblings().removeClass("selected");
                    $(this).addClass("selected");
                    var record = $(this).data('record');
                    record.jingdu = itemData.jingdu;
                    record.weidu = itemData.weidu;
                    record.stationProp=2;
                    record.stationId=null;
                    record.sjingdu = itemData.sjingdu;
                    record.sweidu  = itemData.sweidu;
                }
            });
        },
        /**
         * 合并成真实物理/虚拟物理 tbale中变化
         */
        _tableChaifenPhy:function(itemData){
            $("#table-map-body").children().each(function(){
                var order=$(this).children().eq(0).text().trim();
                if(order == itemData.orderNum){
                    $(this).siblings().removeClass("selected");
                    $(this).addClass("selected");
                    var record = $(this).data('record');
                    if(itemData.stationInfo.isVirtual==0){
                         record.stationProp=1;
                         record.stationId=itemData.stationInfo.stationId;
                         record.stationInfo=itemData.stationInfo;
                    }else if(itemData.stationInfo.isVirtual==1){
                         record.jingdu = itemData.stationInfo.lng;
                         record.weidu = itemData.stationInfo.lat;
                         record.stationProp=0;
                         record.stationId=itemData.stationInfo.stationId;
                         record.sjingdu = itemData.stationInfo.lng;
                         record.sweidu  = itemData.stationInfo.lat;
                         record.stationInfo=itemData.stationInfo;
                    }
                   
                }
            });
        },
        /**
         * updateData修改后 同步修改站点信息的点击
         */
        _loopTableClick:function(){
            if (markers.length == updateData.length) {
                for (var i=0; i<markers.length; i++) {
                    _this._clickTable(updateData[i],markers[i]);//点击table
                }
            }
            //_this._fillStopTable(updateData);
        },

        //对站点进行标注
        _markerMap:function(itemData,points){
            var rIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-item.png",new BMap.Size(30,30));//逻辑
            var point,marker;
            if(itemData.stationProp==0){
                point = new BMap.Point(itemData.jingdu,itemData.weidu);
                marker = new BMap.Marker(point,{icon:phy_shi,offset:offset});  
            }else{
                if(changeView){
                    point = new BMap.Point(itemData.jingdu,itemData.weidu);
                    marker = new BMap.Marker(point,{icon:rIcon,offset:offset});  
                }else{
                    point = new BMap.Point(itemData.stationInfo.lng,itemData.stationInfo.lat);
                    marker = new BMap.Marker(point,{icon:phy_xu,offset:offset});  
                }
            }
            
            if(itemData.markerIconColor==0){
                if(changeView){
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        marker.setIcon(rIcon);
                        marker.enableDragging();
                    }
                }else{
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        marker.setIcon(phy_xu);
                    }
                }
            }
            if(itemData.markerIconColor==1){
                if(changeView){
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        marker.setIcon(rIcon);
                        marker.enableDragging();
                    }
                }else{
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        marker.setIcon(phy_xu);
                    }
                }
               
            }

            if(!changeView && itemData.stationInfo && itemData.stationProp != 0 && itemData.stationInfo.stopList.length == 1 ){
                marker = new BMap.Marker(point,{icon:virOnlyOne,offset:offset}); 
            }

            var label = new BMap.Label(itemData.orderNum);
            label.setOffset(defaultLableOffsetSize);
            marker.setLabel(label);
            map.addOverlay(marker);    // 将标注添加到地图中
            markers.push(marker);
            if (points){
                points.push(point);
            }
        },

        //查询线路图信息同时在地图上标注
        _clickTable:function(itemData,marker){
        	$('#table-map-body').on('dblclick', 'tr', function() {
        		
                _this._removeCirleRangeMarker();
                
                currentPointType = 0;
                var record = $(this).closest('tr').data('record');
                var orderNum = record.orderNum;
                if(orderNum==itemData.orderNum){

                    var point=null;
                    if(itemData.stationProp == 0){
                        point = new BMap.Point(itemData.jingdu,itemData.weidu);
                         marker.setIcon(rIcon_two_six);
                    }else{
                        if(changeView){
                             point = new BMap.Point(itemData.jingdu,itemData.weidu);
                             marker.setIcon(rIcon_two);
                        }else{
                            point = new BMap.Point(itemData.stationInfo.lng,itemData.stationInfo.lat);
                            marker.setIcon(rIcon_two_six);
                        }
                        
                    }
                   
                    map.setCenter(point);
                    var dialogHtml=null;
                    if(itemData.stationProp==0){
                         dialogHtml="<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stationInfo.stationName+"><br>"+
                         "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' value="+itemData.stationInfo.lng+"><br>"+
                         "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' value="+itemData.stationInfo.lat+"><br>"+
                         "<input type='hidden' id='orderNum'   value="+itemData.orderNum+">"+
                         //"<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"+
                         //"<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                         "<button id='btn_save3'  class='btn btn-primary'>修改</button>&nbsp&nbsp"+
                         "<button id='btn_remove3'  class='btn btn-primary'>删除</button>";
                    }else{
                        if(changeView){
                            dialogHtml="<label>序&nbsp&nbsp号：</label><input type='text' id='orderNum'   value="+itemData.orderNum+"><br>"+"<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stopName+"><br>"+"<input type='hidden' id='direction' value="+itemData.direction+" />" +
                            "<label>线路号：</label><input type='text' id='lineNo' readonly=readonly value='"+itemData.lineNo+"'><br>"+
                            "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' value="+itemData.jingdu+"><br>"+
                            "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' value="+itemData.weidu+"><br>"+
                            "<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"+
                            "<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                            "<button id='btn_save1'  class='btn btn-primary'>修改</button>&nbsp&nbsp"+
                            "<button id='btn_remove1'  class='btn btn-primary'>删除</button>";
                        }else{
                            dialogHtml="<label>站点名：</label><input type='text' id='stopName'   value="+itemData.stationInfo.stationName+"><br>"+
                            "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' readonly='readonly' value="+itemData.stationInfo.lng+"><br>"+
                            "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' readonly='readonly' value="+itemData.stationInfo.lat+"><br>"+
                            "<input type='hidden' id='orderNum'   value="+itemData.orderNum+">"+
                            //"<input type='hidden'   id='linemapId'   value='"+itemData.linemapId+"'/>"+
                            //"<input type='hidden'   id='itemId'   value='"+itemData.id+"'/>"+
                            "<button id='btn_save2'  class='btn btn-primary'>修改</button>&nbsp&nbsp"+
                            "<button id='btn_remove2'  class='btn btn-primary'>删除</button>";
                        }
                    }
                    
                    var rightclickDialog= new BMap.InfoWindow(dialogHtml);
                  
                    rightclickDialog.redraw();
                    marker.openInfoWindow(rightclickDialog);
                    var currentOrderNum=orderNum;

                    //点击右边table修改markerIconColor
                    for(var i=0;i<updateData.length;i++){
                        if(updateData[i].orderNum==currentOrderNum){
                            updateData[i].markerIconColor=1;
                        }else{
                            updateData[i].markerIconColor=0;
                        }
                    }
                    _this._save_remove_btn(itemData, marker, rightclickDialog);
                }else{
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        if(changeView){
                            marker.setIcon(rIcon);
                        }else{
                            if(itemData.stationInfo && itemData.stationInfo.stopList && itemData.stationInfo.stopList.length>1){
                                marker.setIcon(phy_xu);
                            }else{
                                marker.setIcon(virOnlyOne);
                            }
                        }
                        
                    }
                }

                return false;
            });

           $("#table-map-body").children().on("click",function(){
               _this._removeCirleRangeMarker();
                currentPointType = 0;
                var record = $(this).closest('tr').data('record');
                var orderNum = record.orderNum;
                if(orderNum==itemData.orderNum){
                    
                    if(itemData.stationProp==0 || (itemData.stationProp==1 && !changeView)){
                        marker.setIcon(rIcon_two_six);
                    }else{
                        marker.setIcon(rIcon_two);
                    }
                    
                    var point=null;
                    if(changeView){
                        point = new BMap.Point(itemData.jingdu,itemData.weidu);
                    }else{
                        point = new BMap.Point(itemData.stationInfo.lng,itemData.stationInfo.lat);
                    }

                    map.setCenter(point);

                    var currentOrderNum=orderNum;
                    //点击右边table修改markerIconColor
                    for(var i=0;i<updateData.length;i++){
                        if(updateData[i].orderNum==currentOrderNum){
                            updateData[i].markerIconColor=1;
                        }else{
                            updateData[i].markerIconColor=0;
                        }
                    }
                    //_this._save_remove_btn(itemData, marker);
                }else{
                    if(itemData.stationProp==0){
                        marker.setIcon(phy_shi);
                    }else{
                        if(changeView){
                            marker.setIcon(rIcon);
                        }else{
                            if(itemData.stationInfo && itemData.stationInfo.stopList && itemData.stationInfo.stopList.length>1){
                                marker.setIcon(phy_xu);
                            }else{
                                marker.setIcon(virOnlyOne);
                            }
                            
                        }
                        
                    }
                }

            });
        },
        /**
         * 物理站相关的清除点
         */
        _removeCirleRangeMarker:function(){
            if(rangemarkers.length>0){
                for(var i=0;i<rangemarkers.length;i++){
                    map.removeOverlay(rangemarkers[i]);
                }
                rangemarkers=[];
            }
            if(rangCircle){
                map.removeOverlay(rangCircle);
                rangCircle=null;
            }
            if(showMarker){
                map.removeOverlay(showMarker);
                showMarker=null;
            }

            $("#rangMarkerRight").css("display","none");
        },

        _save_remove_btn: function(itemData, marker, rightclickDialog) {

            //右键-修改
            $("#btn_save1, #btn_save2, #btn_save3").unbind("click");
            $("#btn_save1, #btn_save2, #btn_save3").on("click",function(){
               _this._removeCirleRangeMarker();

                var stopName = $('#detailDialog #stopName').val().trim();
                var jingdu=$("#detailDialog #jingdu").val().trim();
                var weidu=$("#detailDialog #weidu").val().trim();
                var reg = /[,，。]/;
                if (reg.test(stopName)) {
                    alert("站点名称不能包含特殊字符.");
                    return;
                }
                if(jingdu>=-180.000000 && jingdu<=180.000000){
                }else{
                    alert("经纬度有误！");
                    return;
                }
                if(weidu>= -90.000000 && weidu<=90.000000){
                }else{
                    alert("经纬度有误！");
                    return;
                }

                var newItemData={};
                var re = /^[1-9]+[0-9]*]*$/;
                if($("#detailDialog #orderNum").length>1){
                    newItemData.orderNum=$("#detailDialog #orderNum").eq(1).val();
                    if (!re.test(newItemData.orderNum)) {
                		alert("序号只能是整数"); 
                        return; 
                	}
                }else if($("#detailDialog #orderNum").length===1){
                    newItemData.orderNum=$("#detailDialog #orderNum").val();
                    if (!re.test(newItemData.orderNum)) {
                		alert("序号只能是整数"); 
                        return; 
                	}
                }
                newItemData.lineNo=$("#detailDialog #lineNo").val();
                newItemData.stopName=_replaceBrackets($("#detailDialog #stopName").val().trim());
                newItemData.jingdu=jingdu;
                newItemData.weidu=weidu;
                newItemData.direction=lineDatas[0].direction;
                map.closeInfoWindow(rightclickDialog);
                map.removeOverlay(marker);
                
                for (var i=0; i<markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }
                markers=[];
                var points=[];
                for(var k=0;k<updateData.length;k++){
                    //判断orderNum是否改变，如果改变，就把数据的原始经纬度改为0，状态改为2
                    if( itemData.orderNum!=newItemData.orderNum && newItemData.orderNum==updateData[k].orderNum ){
                        updateData[k].orderNum=itemData.orderNum;
                        updateData[k].sjingdu=0;
                        updateData[k].sweidu=0;
                        updateData[k].status=2;
                    }
                }
                
                for(var i=0;i<updateData.length;i++){
                    if(itemData.linemapId && itemData.linemapId!="undefined"){
                        if(itemData.linemapId==updateData[i].linemapId){//这里的itemData的liemapId问题
                            if(updateData[i].stationProp==0){

                                //var cloneItemData=_this._phyChangeStation(updateData[i],newItemData,itemData,true);
                                //itemData=cloneItemData;
                                //updateData[i]=cloneItemData;
                                //修改itemData 修改itemData的物理站信息  以及物理站中的stopList
                                itemData.jingdu=newItemData.jingdu;
                                itemData.weidu=newItemData.weidu;
                                itemData.stopName=newItemData.stopName;
                                itemData.stationInfo.lng=newItemData.jingdu;
                                itemData.stationInfo.lat=newItemData.weidu;
                                itemData.stationInfo.stationName=newItemData.stopName;

                                var isstopList=itemData.stationInfo.stopList;
                                for(var q=0;q<isstopList.length;q++){
                                    isstopList[q].stopName=newItemData.stopName;
                                    isstopList[q].jingdu=newItemData.jingdu;
                                    isstopList[q].weidu=newItemData.weidu;
                                }
                                itemData=_this._clearItemDateStationInfo(itemData);
                                
                                updateData[i]=itemData;

                                //物理站信息的修改与物理站中stopList的修改
                                for(var k=0;k<updateStationList.length;k++){
                                    if(itemData.stationId==updateStationList[k].stationId){
                                        updateStationList[k].stationName=newItemData.stopName;
                                        updateStationList[k].lng=newItemData.jingdu;
                                        updateStationList[k].lat=newItemData.weidu;
                                        var upk=updateStationList[k];
                                        for(var u=0;u<upk.stopList.length;u++){
                                            upk.stopList[u].stopName=newItemData.stopName;
                                            upk.stopList[u].weidu=newItemData.weidu;
                                            upk.stopList[u].jingdu=newItemData.jingdu;
                                        }
                                    }
                                }
                            }else{

                                if(changeView){
                                    //更新updateData
                                    updateData[i].jingdu=newItemData.jingdu;
                                    updateData[i].weidu=newItemData.weidu;
                                    updateData[i].stopName=newItemData.stopName;

                                    //找到对应的物理站里面的stopList里的逻辑站信息
                                    for(var y=0;y<updateData[i].stationInfo.stopList.length;y++){
                                        if(updateData[i].stationInfo.stopList[y].lineNo==lineDatas[0].lineNo && updateData[i].stationInfo.stopList[y].direction==lineDatas[0].direction){
                                            updateData[i].stationInfo.stopList[y].stopName=newItemData.stopName;
                                            updateData[i].stationInfo.stopList[y].jingdu=newItemData.jingdu;
                                            updateData[i].stationInfo.stopList[y].weidu=newItemData.weidu;
                                        }
                                    }
                                    itemData = updateData[i];

                                    //修改updateStationList
                                    for(var p=0;p<updateStationList.length;p++){
                                        if(itemData.stationId==updateStationList[p].stationId){
                                            updateStationList[p].stopList=itemData.stationInfo.stopList;
                                        }
                                    }
                                }else{
                                    //更新updateData中虚拟物理站信息,虚拟物理站只能更改站名
                                    updateData[i].stationInfo.stationName=newItemData.stopName;

                                    itemData.stationInfo.stationName=newItemData.stopName;

                                    //修改updateStationList
                                    for(var k=0;k<updateStationList.length;k++){
                                        if(itemData.stationId==updateStationList[k].stationId){
                                            updateStationList[k].stationName=newItemData.stopName;
                                        }
                                    }

                                }

                            }

                            //通用属性的增加
                            updateData[i].orderNum=newItemData.orderNum;
                            updateData[i].sjingdu=0;
                            updateData[i].sweidu=0;
                            updateData[i].status=2;
                            updateData[i].markerIconColor=1;
                            map.setCenter(new BMap.Point(newItemData.jingdu,newItemData.weidu));
                            var updateInfoWindow = new BMap.InfoWindow("<h3>"+newItemData.stopName+"&nbsp&nbsp&nbsp&nbsp第"+newItemData.orderNum+"站</h3><br>");
                            map.openInfoWindow(updateInfoWindow);
                        }else{
                            updateData[i].markerIconColor=0;
                        }
                    }else{
                        if(itemData.id==updateData[i].id){
                            updateData[i].jingdu=newItemData.jingdu;
                            updateData[i].weidu=newItemData.weidu;
                            updateData[i].orderNum=newItemData.orderNum;
                            updateData[i].stopName=newItemData.stopName;
                            updateData[i].sjingdu=0;
                            updateData[i].sweidu=0;
                            updateData[i].status=2;
                            updateData[i].markerIconColor=1;
                            map.setCenter(new BMap.Point(newItemData.jingdu,newItemData.weidu));
                            var insertInfoWindow = new BMap.InfoWindow("<h3>"+newItemData.stopName+"&nbsp&nbsp&nbsp&nbsp第"+newItemData.orderNum+"站</h3><br>");
                            map.openInfoWindow(insertInfoWindow);
                        }else{
                            updateData[i].markerIconColor=0;
                        }
                    }
                }
                
                //重新排序绘线
                 _this._updateOrderNumResort(points);
            });
            
            function rightClickDelete(){
                this.item = itemData;
                this.setVal = setVal;
                this.removeMarkers = removeMarkers;
                this.changeUi = changeUi;
                this.updateItem = updateItem;
                this.removePhysic = removePhysic;
                this.doStandDele = doStandDele;
            }

            function setVal(){
                this.item.linemapId=$("#detailDialog #linemapId").val();
                if($("#detailDialog #orderNum").length>1){
                    this.item.orderNum=$("#detailDialog #orderNum").eq(1).val();
                }else{
                    this.item.orderNum=$("#detailDialog #orderNum").val();
                }

                this.item.lineNo=$("#detailDialog #lineNo").val();
                this.item.stopName=$("#detailDialog #stopName").val();
            }

            function removeMarkers(){
                if(rangemarkers.length){
                    for(var i=0;i<rangemarkers.length;i++){
                        map.removeOverlay(rangemarkers[i]);
                    }
                    rangemarkers=[];
                }
                if(rangCircle){
                    map.removeOverlay(rangCircle);
                    rangCircle=null;
                }
            }

            function changeUi(){
                $("#rangMarkerRight").css("display","none");
            }

            function updateItem(){
                var isstopList=this.item.stationInfo.stopList;
                for(var i=0;i<isstopList.length;i++){
                    if(isstopList[i].lineNo==lineDatas[0].lineNo && isstopList[i].direction==lineDatas[0].direction){
                        isstopList.splice(i,1);
                    }
                }
            }

            //移除物理站中的stopList中对应的逻辑站
            function removePhysic(){
                if(this.item.stationId && this.item.stationId != 0 && this.item.stationId != 1){
                    for(var i=0;i<updateStationList.length;i++){
                        if(updateStationList[i].stationId == this.item.stationId){
                            var uds=updateStationList[i]
                            for (var y = 0; y < uds.stopList.length; y++) {
                                if(uds.stopList[y].lineNo == lineDatas[0].lineNo && uds.stopList[y].direction == lineDatas[0].direction){
                                    uds.stopList.splice(y,1);
                                }
                            }
                        }
                    }
                }
            }

            //移除物理站
            function removeUpdateStation(){
                for(var i=0;i<updateStationList.length;i++){
                        if(updateStationList[i].stationId == itemData.stationId){
                        	updateStationList[i].stopList = [];
                        }
                    }
            }

            function doStandDele(){
                _this._removeOrderNumResort(this.item);
            }

            var rcd = new rightClickDelete();

            //右键->删除
            $("#btn_remove1, #btn_remove2, #btn_remove3").unbind("click");
            $("#btn_remove1, #btn_remove2, #btn_remove3").on("click",function(){
                rcd.removeMarkers();
                rcd.changeUi();
                
                if(itemData.stationProp==0 ){
                     map.closeInfoWindow();
                    if(itemData.stationInfo && itemData.stationInfo.stopList.length > 0){
                        alert("不允许删除真实物理站，请先拆分!");
                        return;
                    }else{
                    	//似乎不会走到这里
                        rcd.setVal();
                        rcd.doStandDele();
                        rcd.updateItem();
                        rcd.removePhysic();
                        removeUpdateStation();
                    }
                }else{
                    if(!changeView){
                        if(itemData.stationInfo && itemData.stationInfo.stopList.length > 1){
                            alert("请先拆分!");
                            return;
                        }else{
                            rcd.setVal();
                            rcd.doStandDele();
                            rcd.updateItem();
                            rcd.removePhysic();
                            removeUpdateStation();
                            return;
                        }
                        
                    }
                    rcd.setVal();

                    //标准删除排序 updateData修改
                    rcd.doStandDele();

                    //修改itemData
                    rcd.updateItem();

                    //修改updateStationList
                    rcd.removePhysic();
                }
            });
            
            if(itemData.stationId != 0 && itemData.stationId != 1){
                $("#subwaysInfo").css("display","block");
            }else{
                $("#subwaysInfo").css("display","none");
            }
            
            setTimeout(function(){
                $("#subwaySelect").select2({
                    data:subwaysDataArray
                });
                
                //设置初始值
                if(itemData.stopExtend != null){
                    var sublines = JSON.parse(itemData.stopExtend.eInfo);
                    $("#subwaySelect").select2("val",sublines.subway.split(','));
                }
                
                $("#subwaySelect").on('change',function(){
                    var selVal = $("#subwaySelect").select2("val");
                    var formatLineName = "";
                    var middleVal = [];
                    if(selVal){
                        selVal = selVal;
                    }else{
                        selVal = [];
                    }
                    for(var i=0;i<selVal.length;i++){
                        middleVal.push(selVal[i].slice(0,selVal[i].indexOf('线')+1));
                    }
                    formatLineName = middleVal.join(',');
                    if(itemData.stationId != 0 && itemData.stationId != 1){
                        for(var i=0;i<updateStationList.length;i++){
                            if(itemData.stationId == updateStationList[i].stationId){
                                if(updateStationList[i].stopExtend != null){
                                    var info=JSON.parse(updateStationList[i].stopExtend.eInfo);
                                    info.subway = formatLineName;
                                    updateStationList[i].stopExtend.eInfo = JSON.stringify(info);
                                    
                                    //塞入itemData.stopExtend
                                    //if(itemData.stopExtend != undefined){
                                    itemData.stopExtend = updateStationList[i].stopExtend;
                                    //}
                                }else{
                                    var stopExtend={
                                            cityId: _this._getCity().cityId,
                                            eId:null,
                                            eInfo:"{\"subway\":\""+formatLineName+"\"}",
                                            relationId:updateStationList[i].stationId,
                                            type:1
                                    }
                                    updateStationList[i].stopExtend = stopExtend;
                                    
                                    //塞入itemData.stopExtend
                                    //if(itemData.stopExtend != undefined){
                                    itemData.stopExtend = stopExtend;
                                    //}
                                }
                            }
                        }
                    }
                })
                
            },100);
         
        },

        _drager:function(){
            tableStatus=0;  //状态为0未拖动 状态1为拖动了
            var dragManager = {
                clientY:0,
                draging:function(e){//mousemove时拖动行
                    var dragObj = dragManager.dragObj;
                    if(dragObj){
                        e = e || event;
                        if(window.getSelection){//w3c
                            window.getSelection().removeAllRanges();
                        }else  if(document.selection){
                            document.selection.empty();//IE
                        }
                        var y = e.clientY;
                        var down = y > dragManager.clientY;//是否向下移动
                        var tr = document.elementFromPoint(e.clientX,e.clientY);
                        if(tr && tr.nodeName == "TD"){
                            tr = tr.parentNode;
                            dragManager.clientY = y;
                            if( dragObj !== tr){
                                tr.parentNode.insertBefore(dragObj, (down ? tr.nextSibling : tr));
                                tableStatus=1;
                            }
                        };
                    }
                },
                dragStart:function(e){
                    e = e || event;
                    var target = e.target || e.srcElement;
                    if(target.nodeName === "TD"){
                        target = target.parentNode;
                        dragManager.dragObj = target;
                        if(!target.getAttribute("data-background")){
                            var background = getStyle(target,"background-color");
                            target.setAttribute("data-background",background)
                        }
                        //显示为可移动的状态
                        target.style.backgroundColor = "#ccc";
                        target.style.cursor = "move";
                        dragManager.clientY = e.clientY;
                        addEvent(document,"mousemove",dragManager.draging);
                        addEvent(document,"mouseup",dragManager.dragEnd);
                    }
                },
                dragEnd:function(e){
                    var dragObj = dragManager.dragObj;
                    if (dragObj) {
                        e = e || event;
                        var target = e.target || e.srcElement;
                        if(target.nodeName === "TD"){
                            target = target.parentNode;
                            dragObj.style.backgroundColor = dragObj.getAttribute("data-background");
                            dragObj.style.cursor = "default";
                            dragManager.dragObj = null;
                            removeEvent(document,"mousemove",dragManager.draging);
                            removeEvent(document,"mouseup",dragManager.dragEnd);
                            if(tableStatus==1){
                                //change the button color
                                var currentOrderNum=$(dragObj).data('record').orderNum;
                                //保存所有移动后的站点数据，序号还没变
                                var p = [] ;
                                $(dragObj).parent().children().each(function(){
                                    var record = $(this).data('record');
                                    var data={};
                                    data.linemapId = record.linemapId;
                                    data.jingdu = record.jingdu;
                                    data.weidu = record.weidu;
                                    data.sjingdu = record.sjingdu;
                                    data.sweidu = record.sweidu;
                                    data.orderNum = record.orderNum;
                                    data.stopName = record.stopName;
                                    data.lineNo = record.lineNo;
                                    data.stationId = record.stationId;
                                    data.stationProp = record.stationProp;
                                    if(record.stationProp!=undefined){
                                        data.stationInfo = record.stationInfo;
                                    }
                                    p.push(data);
                                });

                                //更新updateData里对应站点的状态和序号 可以确定哪个发生了变化
                                for(var k=0;k<updateData.length;k++){
                                    if(p[k].orderNum!=updateData[k].orderNum){
                                        updateData[k]=p[k];
                                        updateData[k].status=2;
                                        updateData[k].sjingdu=0;
                                        updateData[k].sweidu=0
                                    }
                                }

                                $("#table-map-body").children().each(function(index){
                                    var record = $(this).data('record');
                                    record.orderNum = index+1;
                                    $(this).children().eq(0).text(record.orderNum);
                                    updateData[index].orderNum = record.orderNum;
                                    updateData[index].linemapId = record.linemapId;
                                    updateData[index].jingdu = record.jingdu;
                                    updateData[index].weidu = record.weidu;
                                    updateData[index].sjingdu = record.sjingdu;
                                    updateData[index].sweidu = record.sweidu;
                                    updateData[index].id = record.id;
                                    updateData[index].stopName = record.stopName;
                                    updateData[index].lineNo = record.lineNo;
                                });

                              

                                //左边排序
                                _this._readerMaker();
                                //数组按序号排序
                                $("#table-map-body").children().each(function(index){
                                    if(updateData[index].status == 2){
                                        updateData[index].status="修改";
                                        updateData[index].sjingdu=0;
                                        updateData[index].sweidu=0;
                                    }
                                    if(updateData[index].status==1){
                                        updateData[index].status="新增";
                                    }
                                    //$(this).find("td:eq(2)").text(updateData[index].status);
                                });
                            }
                        }
                    }
                },
                main:function(el){
                    addEvent(el,"mousedown",dragManager.dragStart);
                }
            };
            var el = document.getElementById("stopTable");
            dragManager.main(el);
        },

        //只有进入页面时调用一次
        _queryAll:function(){
            var o, url;
            if (g_lineId) {
                o = {
                        cityId : _this._getCity().cityId,
                        lineId : g_lineId
                }
                url = __baseUrl + '/baseData/detail';
            } else if (lineName) {
                o = {
                        cityId: _this._getCity().cityId,
                        lineName: lineName,
                        direction: direction
                };
                url = __baseUrl + '/baseData/querylineByName';
            } else {
                alert('无法获取线路.');
                return;
            }

            $.get(url, o, function(result) {
                if (result._exception === true) {
                    alert(result.message);
                } else {
                    if (result.status == 'FAIL') {
                        alert(result.errmsg);
                    } else {

                        _this._save_enabled();

                        //保存所有原始数据
                        result_bak = $.extend(true, {}, result.data);

                        var line_info = result.data.line;
                        var map_list = result.data.maplist;
                        var station_list = result.data.stationList;
                        var tra_list = result.data.tralist;
                        var line_ext = result.data.lineExtend;
                        //线路扩展
                        if (line_ext && line_ext.eInfo) {
                            line_ext.eInfo = JSON.parse(line_ext.eInfo);
                            for (var key in line_ext.eInfo) {
                                //保证不能和线路的字段重复，否则可能导致bug
                                line_info[key] = line_ext.eInfo[key];
                            }
                        }

                        $('#select2-lineSelector-container').attr('title', line_info.lineName);
                        $('#select2-lineSelector-container').text(line_info.lineName);

                        _this._fillLineTable(line_info);

                        lineDatas = [line_info];
                        g_lineId = line_info.lineId;

                        //操作数据
                        updateData = map_list.slice(0);

                        //判断真实物理(包含逻辑站)，虚拟物理(包含逻辑站)
                        if(result.data.stationList!=null){
                            if(result.data.stationList.length>0){
                                for(var i=0;i<updateData.length;i++){
                                    if(updateData[i].stationId && updateData[i].stationId!=" " && updateData[i].stationId!="null" && updateData[i].stationId!="Null"){
                                        for(var y=0;y<result.data.stationList.length;y++){
                                            if(updateData[i].stationId===result.data.stationList[y].stationId){
                                                if(result.data.stationList[y].isVirtual==1){
                                                    updateData[i].stationProp=0;         //真实物理站点为0,虚拟物理为1
                                                    updateData[i].stationInfo=result.data.stationList[y];
                                                    updateData[i].jingdu=result.data.stationList[y].lng;
                                                    updateData[i].weidu=result.data.stationList[y].lat;
                                                    updateData[i].stopExtend=result.data.stationList[y].stopExtend;
                                                }else if(result.data.stationList[y].isVirtual==0){
                                                    updateData[i].stationProp=1;          //真实物理站点为0,虚拟物理为1
                                                    updateData[i].stationInfo=result.data.stationList[y];
                                                    updateData[i].stopExtend=result.data.stationList[y].stopExtend;
                                                }
                                            }
                                        }
                                    }else{
                                        //处理站点本身没有stationId
                                        //alert("数据异常!<br><h6>(提示：站点无物理站)</h6>")
                                        //return;
                                        updateData[i].stationInfo = undefined;
                                    }
                                }
                            }
                        }
                        
                        var niu=[];
                        //给updateData添加额外属性  并 检查是否包含stationInfo
                        for(var i=0;i<updateData.length;i++){
                            if(typeof(updateData[i].stationInfo) == "undefined"){
                                //alert("数据异常!<br><h6>(提示：缺少对应物理站)</h6>");
                                //return;
                                //处理个别站点有stationId 但是没有对应的物理站
                                var svStopList = updateData[i];
                                updateData[i].stationId = 0;
                                updateData[i].stationInfo = {
                                        cityId:_this._getCity().cityId,
                                        isVirtual:0,
                                        lat:svStopList.weidu,
                                        lng:svStopList.jingdu,
                                        slat:svStopList.weidu,
                                        slng:svStopList.jingdu,
                                        stationId:0,
                                        stationName: svStopList.stopName,
                                        stopExtend:null,
                                        stopList:[{
                                            direction: svStopList.direction,
                                            jingdu: svStopList.jingdu,
                                            lineNo: svStopList.lineNo,
                                            lineName : lineDatas[0].lineName,
                                            linemapId: svStopList.linemapId,
                                            nextStopName: null,
                                            orderNum: svStopList.orderNum,
                                            sjingdu: svStopList.jingdu,
                                            stationId: 0,
                                            stopName: svStopList.stopName,
                                            sweidu: svStopList.weidu,
                                            weidu: svStopList.weidu
                                        }]
                                };
                                updateData[i].stopExtend = null;
                                updateData[i].stationProp = 1;
                            }

                            //默认状态为0;
                            updateData[i].markerIconColor=0;
                            updateData[i].status="";
                            updateData[i].id=i;
                            //var upd=updateData[i].slice(0);
                            niu.push($.extend(true,{},updateData[i]));
                        }

                        _this._fillStopTable(updateData);
                        
                        //备份updateDta
                        updateData_back=niu.slice(0);

                        //需要修改的物理站信息
                        if(station_list){
                            updateStationList=station_list.slice(0);
                        }
                        
                        //站点和蓝线
                        var points=[];
                        for(var j=0;j<updateData.length;j++){
                            _this._markerMap(updateData[j],points);
                        }
                        if (points.length > 0) {
                            if (resetView) {
                                map.setViewport(points);
                            } else {
                                resetView = true;
                            }
                            _this._bindStopMarkerEvent();
                            _this._drawLine(points);
                        } else {
                            //没有站点则默认显示当前城市
                            var cityText = $('#detailDialog #cityId').find("option:selected").text();
                            cityText = getSelectText(cityText);
                            map.centerAndZoom(cityText.replace('test', ''),14);
                        }

                        //脊线和脊线圈
                        _this._trajectory_query(tra_list);
                        
                        _this._subwaysLines();
                    }
                }
            });
        },
        _subwaysLines:function(){
            function SubWays(data){
                this.dataSource = data;
                this.fillterLines = fillterLines;
                this.pushLines = pushLines; 
                this.filterSubways = filterSubways;
            }
            
            function fillterLines(data){
                var line = null;
                if(data.indexOf('线')>0){
                    line = data.slice(0,data.indexOf('线')+1);
                }else{
                    line = data;
                }
                return line;
            }
            
            function pushLines(){
                for(var key in this.dataSource){
                    var formatLien = this.fillterLines(this.dataSource[key]);
                    subwaysDataArray.push({
                        id:""+ formatLien +"",
                        text:""+ formatLien +""
                    });
                }
                
                return this.filterSubways(subwaysDataArray);
            }
            
            function filterSubways(data){
                for(var i=0;i<data.length;i++){
                    for(var y=i+1;y<data.length;y++){
                        if(data[i].id == data[y].id){
                            data.splice(y,1);
                        }
                    }
                }
                return data;
            }
            
            var subway = new SubWays($.codemap.subways);
            subway.pushLines();
            //console.log(subwaysDataArray.length);
        },

        _fillLineTable: function (data) {
            if (data.lineName.indexOf('(已停运)') >= 0) {
                data.lineName = data.lineName.replace('(已停运)', '');
            } else if (data.lineName.indexOf('(已下线)') >=0) {
                data.lineName = data.lineName.replace('(已下线)', '');
            }
//            data.crossCity = "027,000";
//            data.oneBus = 'M201212';
            var cityId = _this._getCity().cityId;
            if (data.crossCity) {
            	data.crossCity = data.crossCity.replace(cityId, '').replace(',', '');
            }
            $('#lineInfo').webform().webform('fill', data);
            //删除当前城市
            $('#crossCity').find('option[value="' + cityId + '"]').remove();
        },

        _fillStopTable: function(data) {
            $('#stopTable').dataTable("reloadCustom", {content: data});
        },

        _fillTraTable: function(data) {
            $('#traTable').dataTable("reloadCustom", {content: data});
        },

        _bindDataTableClick: function() {
            $('#stopTable').on('click', '.add', function() {
                var record = $(this).closest('tr').data('record');
                $('#recommand_stopname').val('');
                _this._set_tab_view('tabs', 2);
            }).on('click', '.modify', function() {
                var record = $(this).closest('tr').data('record');
                $('#recommand_stopname').val(record.stopName);
                _this._set_tab_view('tabs', 2);
            }).on('click', '.delete', function() {
                var record = $(this).closest('tr').data('record');
                //标准删除排序
                
                if(record.stationProp==0){
                	//真实物理站
                    alert("请先拆分!");
                }else{
                    if(changeView){
                    	//逻辑站视图
                       _this._removeOrderNumResort(record);
                    }else{
                    	//虚拟物理站视图
                    	if (record.stationInfo && record.stationInfo.stopList.length > 1){
                    		alert("请先拆分!");
                        } else {
                        	_this._removeOrderNumResort(record);
                        }
                        
                    }
                }
                
            }).on('click', '.history', function() {
                var record = $(this).closest('tr').data('record');
                $('#recommand_stopname').val(record.stopName);
                _this._set_tab_view('tabs', 2);
            });
            ;
            $(document).on('click', '#jx-tbody .delete', function() {
                var record = $(this).closest('tr').data('record');
                map.removeOverlay(traMarkers[record.order - 1]);
                //重新绘线
                traPoints.splice(record.order-1,1);
                _this._drawTraLine(traPoints);
                jxData.splice(record.order-1,1);
                for (var j=record.order-1; j<jxData.length; j++) {
                    jxData[j].order = parseInt(jxData[j].order,10)-1;
                }
                if (currentPoint == record.order) {
                    currentPoint = undefined;
                }
                traMarkers.splice(record.order-1,1);
                _this._appendTable(jxData);
            });
        },

        //三个还原绑定事件
        _bind_reset: function() {
            $('#line_reset_btn').on('click', function(event) {
                var bakdata = $.extend(true, {}, result_bak);
                var line_ext = bakdata.lineExtend;
                //线路扩展
                if (line_ext && line_ext.eInfo) {
                    line_ext.eInfo = JSON.parse(line_ext.eInfo);
                    for (var key in line_ext.eInfo) {
                        bakdata.line[key] = line_ext.eInfo[key];
                    }
                }
                _this._fillLineTable(bakdata.line);
                return false;
            });

            //还原
            $('#stop_reset_btn').on('click', function(event) {
                map.removeOverlay(rangCircle);
                rangCircle=null;
                var bakdata = $.extend(true, {}, result_bak);
                _this._queryStop(bakdata.maplist,bakdata.stationList);
                return false;
            });
            $('#tra_reset_btn').on('click', function(event) {
                var bakdata = $.extend(true, {}, result_bak);
                _this._queryTra(bakdata.tralist);
                return false;
            });
        },

        _lineReverse:function(){
            confirm("确定查看反向线路吗？？？？？？？", function() {
                my_distance_flag=false;
                _this._removePointsObjectLay();
                _this._paramInit();
                $(".gaode_Num").text('(0)');$(".luceGps_Num").text('(0)');

                var o = {
                        cityId: _this._getCity().cityId,
                        lineNo: lineDatas[0].lineNo,
                        direction: lineDatas[0].direction == "0" ? "1" : "0"
                }
                $.get(__baseUrl + '/baseData/queryline', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message, "fail");
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg, "fail");
                        } else {
                        	if (result.data && result.data.line && result.data.line.lineId) {
                        		g_lineId = result.data.line.lineId;
                                _this._resetGlobal();
                        	} else {
                        		alert('不存在反向线路');
                        	}
                        }
                    }
                });
            });
        },

        _lineReverseGen:function() {
            $("#line-reverse-gen").on('click',function(){
                confirm("确定生成反向线路吗？？？？？？？", function() {
                    my_distance_flag=false;
                    _this._removePointsObjectLay();
                    _this._paramInit();
                    $(".gaode_Num").text('(0)');$(".luceGps_Num").text('(0)');

                    var o = {
                            cityId: _this._getCity().cityId,
                            areaCode: $.codemap['areaCode'][_this._getCity().cityId],
                            lineId: g_lineId
                    }
                    $.postLock(__baseUrl + '/baseData/reGenLine', o, function(result) {
                        if (result._exception === true) {
                            alert(result.message, "fail");
                        } else {
                            if (result.status == 'FAIL') {
                                alert(result.errmsg, "fail");
                            } else {
                                alert('反向生成成功！请维护线路和站点，并在保存后维护映射关系！', "success");
                                g_lineId = result.data.line.lineId;
                                isReverse = true;
                                _this._resetGlobal();
                            }
                        }
                    });
                });
            });
        },

        _queryTra:function(tralist){
            for (var i=0; i<traMarkers.length; i++) {
                map.removeOverlay(traMarkers[i]);
            }
            map.removeOverlay(tra_polyline);
            $("#jx-tbody").html("");//将table置空
            traPoints = [];
            traMarkers = [];
            jxData = [];

            _this._trajectory_query(tralist);
        },

        _queryStop:function(maplist,station){
            for (var i=0; i<markers.length; i++) {
                map.removeOverlay(markers[i]);
            }
            markers = [];
            //操作数据
            updateData = maplist.slice(0);
            _this._updataAddStationProp(station);
            for(var i=0;i<updateData.length;i++){
                //默认状态为0;
                updateData[i].markerIconColor=0;
                updateData[i].status="";
                updateData[i].id=i;
            }
            
            _this._fillStopTable(updateData);
            //站点和蓝线
            var points=[];
            for(var j=0;j<updateData.length;j++){
                _this._markerMap(updateData[j],points);
            }
            map.setViewport(points);
            _this._bindStopMarkerEvent();
            _this._drawLine(points);
            
        },

        _updataAddStationProp:function(result){
            //判断真实物理，虚拟物理，逻辑站result result.data.stationList
            if(result!=null){
                if(result.length>0){
                    for(var i=0;i<updateData.length;i++){
                        if(updateData[i].stationId!=null && updateData[i].stationId!=undefined && updateData[i].stationId!=" " && updateData[i].stationId!="" && updateData[i].stationId!="null" && updateData[i].stationId!="Null"){
                            for(var y=0;y<result.length;y++){
                                if(updateData[i].stationId===result[y].stationId){
                                    if(result[y].isVirtual==1){
                                         updateData[i].stationProp=0;         //真实物理站点为0,虚拟物理为1
                                         updateData[i].stationInfo=result[y];
                                         updateData[i].jingdu=result[y].lng;
                                         updateData[i].weidu=result[y].lat;
                                         updateData[i].stopExtend=result[y].stopExtend;
                                    }else if(result[y].isVirtual==0){
                                         updateData[i].stationProp=1;          //真实物理站点为0,虚拟物理为1
                                         updateData[i].stationInfo=result[y];
                                         updateData[i].stopExtend=result[y].stopExtend;
                                    }

                                }
                            }
                        }else{
                            alert("数据异常!")
                            return;
                        }
                    }
                }else{
                    alert("数据异常!");
                    return;
                }
            }
          
        },
        _mapBack:function(){
            $("#map-back").on("click",function(){

                _this._queryStop();
                //change the button color

                alert("还原成功！");

            });
        },
        _validateOrderNum:function(){
            var arrTable=[];
            var arrUpadate=[];
            var result=0;
            $("#table-map-body").children().each(function(index){
                var orderNumR= $(this).children().eq(0).text();
                if(orderNumR){
                    arrTable.push(orderNumR);
                }
            });
            var nary=arrTable.sort();
            //判断是否有重复序号
            for(var i=0;i<arrTable.length;i++){
                if (nary[i]==nary[i+1]){
                    result=1;
                }
            }
            //验证update
            if(result==0){
                for(var k=0;k<updateData.length;k++){
                    arrUpadate.push(updateData[k].orderNum);
                }
                var naryUpdate=arrUpadate.sort();
                for(var j=0;j<arrUpadate.length;j++){
                    if (naryUpdate[j]==naryUpdate[j+1]){
                        result=1;
                    }
                }
            }
            return result;
        },

        _tradbclick:function(e){
            var flag = false;//是否新增点标志
            var marker = new BMap.Marker(e.point,{icon:jxGreenIcon,offset:tra_offset});
            marker.enableDragging();

            if (currentPoint != undefined && jxData.length >0) {
                flag = true;
                //不是第一个脊线点，并且选中了前一个点
                map.addOverlay(marker);
                traMarkers[currentPoint-1].setIcon(jxBlueIcon);
                traPoints.splice(currentPoint,0,e.point);
            } else if((currentPoint == undefined) && (jxData.length == 0)) {
                flag = true;
                //第一个脊线点
                map.addOverlay(marker);
                traPoints.push(e.point);
            } else if((currentPoint == undefined) && (jxData.length > 0)) {
                //不是第一个点，没有选中前一个点
                alert("请选择上一个脊线点!");
                currentPointType = -1;
                setTimeout(function() {
                    map.enableDoubleClickZoom();
                }, 2000);
            }
            if (flag) {
                _this._drawTraLine(traPoints);
                //表格中的相应行变色
                $("#jx-tbody").children().each(function(){
                    var order=$(this).children().eq(0).text().trim();
                    if(order==currentPoint){
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected");
                    }
                });

                traMarkers.splice(currentPoint,0,marker);

                var item = {};
                if (jxData && jxData.length == 0) {
                    //新增第一个点
//                    item.id = 0;
                    item.order = 1;
                    item.cityId = _this._getCity().cityId;
                    item.lineId = lineDatas[0].lineId;
                    item.lineNo = lineDatas[0].lineNo;
                    item.direction = lineDatas[0].direction;
                    item.sjingdu = 0;
                    item.sweidu = 0;
                    item.jingdu = e.point.lng;
                    item.weidu = e.point.lat;
                    item.markerIconColor = 2;
                } else if (jxData && jxData.length>0 && currentPoint != undefined) {
                    //新增某个点
//                    item.id = currentPoint + 1;
                    item.order = currentPoint + 1;
                    item.cityId = _this._getCity().cityId;
                    item.lineId = lineDatas[0].lineId;
                    item.lineNo = lineDatas[0].lineNo;
                    item.direction = lineDatas[0].direction;
                    item.sjingdu = 0;
                    item.sweidu = 0;
                    item.jingdu = e.point.lng;
                    item.weidu = e.point.lat;
                    item.markerIconColor = 2;

                    jxData[currentPoint-1].markerIconColor = 1;
                } else {
                    alert("Internal error!");
                }
                jxData.splice(item.order-1,0,item);
                currentPoint = parseInt(item.order,10);
                for (var i=item.order; i<jxData.length; i++) {
                    jxData[i].order = parseInt(jxData[i].order,10)+1;
                }

                //change the button color
                $("#jx-save").removeClass("btn-primary").addClass("btn-danger");

                _this._appendTable(jxData);
            }
        },

        _stopdbclick:function(e){
            _this._set_tab_view('tabs', 2);
            var newOrderNum, prevStopname="";
            var item={};
            if(updateData && updateData.length>0){
                for(var i=0;i<updateData.length;i++){
                    if(updateData[i].markerIconColor==1){
                        newOrderNum= parseInt(updateData[i].orderNum,10)+1;
                        prevStopname = updateData[i].stopName;
                        item.cityId = _this._getCity().cityId;
                        item.lineId = lineDatas[0].lineId;
                        item.lineNo=updateData[i].lineNo;
                        item.direction=updateData[i].direction;
                        item.orderNum=updateData[i].orderNum;
                        item.linemapId=updateData[i].linemapId;
                        updateData[i].markerIconColor = 0;
                    }
                }
            }else{//一个站点都没有时，新增站点
                newOrderNum=1;
                item.cityId = _this._getCity().cityId;
                item.lineId = lineDatas[0].lineId;
                item.lineNo=lineDatas[0].lineNo;
                item.direction=lineDatas[0].direction;
                prevStopname = "无";
                
            }
            
            if(newOrderNum){
                currentPointType = 0;
                var pointThree = new BMap.Point(e.point.lng,e.point.lat);
                var offset =new BMap.Size(0,-15);
                //重新会点
                var  insertMarker= new BMap.Marker(pointThree,{icon:rIcon,offset:offset});  // 创建标注
                map.addOverlay(insertMarker);              // 将标注添加到地图中
                markers.push(insertMarker);
                item.jingdu=e.point.lng;
                item.weidu= e.point.lat;
                item.sjingdu=0;
                item.sweidu=0;
                var dialogHtml_1="<label>序&nbsp&nbsp号：</label><input type='text' id='orderNum' readonly=readonly value="+newOrderNum+"><br>"+"<label>站点名：</label><input type='text' id='stopName' value='" + $('#recommand_stopname').val().trim() + "'><br><input type='hidden' id='direction' value="+item.direction+" />" +
                    "<label>线路号：</label><input type='text' id='lineNo' readonly=readonly value='"+item.lineNo+"'><br>"+
                    "<label>经&nbsp&nbsp度：</label><input type='text' id='jingdu' value="+e.point.lng+"><br>"+
                    "<label>维&nbsp&nbsp度：</label><input type='text' id='weidu' value="+e.point.lat+"><br>"+
                    "<button id='btn_insert'  class='btn btn-primary'>新增</button>&nbsp"+
                    "<button id='btn_remove_1'  class='btn btn-primary'>删除</button>&nbsp"+
                    "<button id='lgorang_station_hidden1'  class='btn btn-primary'>隐藏周围物理站</button>";
                var rightclickDialog_1= new BMap.InfoWindow(dialogHtml_1);
                if(newOrderNum!=1){
                    rightclickDialog_1.setHeight(200);
                    rightclickDialog_1.setWidth(270);
                    insertMarker.openInfoWindow(rightclickDialog_1);
                    _this._insertWindow(rightclickDialog_1,insertMarker,item);
                }
                insertMarker.addEventListener("rightclick", function(){
                    rightclickDialog_1.setHeight(200);
                    rightclickDialog_1.setWidth(270);
                    insertMarker.openInfoWindow(rightclickDialog_1);
                    _this._insertWindow(rightclickDialog_1,insertMarker,item);
                });
                
            }else{
                alert("请选择上一个站点！");
                currentPointType = -1;
                setTimeout(function() {
                    map.enableDoubleClickZoom();
                }, 2000);
            }

        },
        _queryNearyStation:function(jingdu,weidu,itemData){
             $.get(__baseUrl + '/baseData/nearbyStops?cityId='+_this._getCity().cityId+'&lng='+jingdu+"&lat="+weidu+'&radius=300',function(result){
                 if (result._exception === true) {
                     alert(result.message);
                 } else {
                     if (result.status == 'FAIL') {
                         alert(result.errmsg);
                     }else{
                         if(result.data.stationList.length>0){
                             var res=result.data.stationList;
                             var operaHtml="";
                             var newres=[];
                             
                             //需要对res按要求进行排序
                             res = _this._physicListSort(res,itemData.stopName); 
                                 
                             for(var i=0;i<res.length;i++){
                                 if(res[i].stationId!=itemData.stationId && (res[i].stationName).indexOf(itemData.stopName)>-1){
                                     operaHtml += "<tr><td><input type='checkbox' data-stationid='"+ res[i].stationId +"'></td><td>"+res[i].stationName+"</td><td>"+(res[i].isVirtual==0?'虚拟':'真实')+"</td>/tr>";
                                     newres.push(res[i]);
                                }
                             }
                             if(newres.length==0){
                                 alert("周围无物理站点!");
                                 return;
                             }
                             $("#vriTableRight").css("display","none");
                             $("#rangMarkerRight").css("display","block");
                             $("#rangMarkerRight table tbody").html(operaHtml);

                             //给每行添加点击，并且marker
                             for(var y=0;y<res.length;y++){
                                 _this._trRangMarker($("#rangMarkerRight table tbody tr"),res[y],y);
                             }

                             _this._drawRangPhyMarker(itemData,newres);
                         }else{
                             alert("周围无物理站点!");
                         }

                     }
                 }
             })
        },
        _physicListSort:function(data,name){

            //先按站名相同排序,再按真实与虚拟排序
            function PhySort(){
                this.name = name;
                this.dataSource = data;
                this.sameNameList = [];
                this.diffNameList = [];
                this.rightSortSameNameList = [];
                this.filterName = filterName;
                this.filterTrueFalse = filterTrueFalse;
                this.performOperations = performOperations;
            }

            function filterName(){
                for(var i=0;i<this.dataSource.length;i++){
                    if(this.dataSource[i].stationName == this.name){
                        this.sameNameList.push(this.dataSource[i]);
                    }else{
                        this.diffNameList.push(this.dataSource[i]);
                    }
                }
            }

            function filterTrueFalse(){
                var trueNameList = [];
                var falseNameList = [];
                for(var i=0;i<this.sameNameList.length;i++){
                    if(this.sameNameList[i].isVirtual === 1){
                        trueNameList.push(this.sameNameList[i]);
                    }else{
                        falseNameList.push(this.sameNameList[i]);
                    }
                }
                this.rightSortSameNameList = trueNameList.concat(falseNameList);
                data= this.rightSortSameNameList.concat(this.diffNameList);
            }

            function performOperations(){
                this.filterName();
                this.filterTrueFalse();
            }
 
            var phySort = new PhySort();
            phySort.performOperations();

            return data;
            
        },
        _dbclick:function(){
            var isdb;
            map.addEventListener("dblclick", function(e){
                isdb = true;
                if (map.getZoom() != 18) {
                    map.disableDoubleClickZoom();
                } else {
                    map.enableDoubleClickZoom();
                }
                if (markers.length == 0 && traMarkers.length == 0) {
                    _this._stopdbclick(e);
                    _this._tradbclick(e);
                } else if (markers.length > 0 && traMarkers.length == 0) {
                    _this._tradbclick(e);
                } else if (markers.length == 0 && traMarkers.length > 0) {
                    _this._stopdbclick(e);
                } else if (currentPointType == 0) {
                    _this._stopdbclick(e);
                } else if (currentPointType == 1) {
                    _this._tradbclick(e);
                } else {
                    map.enableDoubleClickZoom();
                }
            });
            map.addEventListener("click", function(e){
                isdb = false;
                setTimeout(clk, 500);
                function clk(){
                    if (isdb != false) return;
                    if (!e.overlay) {
                        currentPointType = -1;
                        map.enableDoubleClickZoom();
                    }
                }
            });
        },
        doDistance:function(e){
            var pointLng=e.point.lng,
                pointLat=e.point.lat;
            var point = new BMap.Point(pointLng,pointLat);
            pointsObject.nowTwoPoints.push(point);

            //创建标注
            var myIcon = new BMap.Icon(__baseUrl + "/images/circle_red.png",new BMap.Size(10,10));
            var marker = new BMap.Marker(point,{icon:myIcon});// 创建标注
            map.addOverlay(marker);
            marker.enableDragging();
            pointsObject.allPointsMarker.push(marker);

            if(pointsObject.nowTwoPoints.length>3){
                pointsObject.nowTwoPoints.shift();
            }

            //移除上一个marker 与  polyline
            if(pointsObject.allPointsMarker.length==4){
                map.removeOverlay(pointsObject.allPointsMarker[0]);
                pointsObject.allPointsMarker.shift();
                map.removeOverlay(pointsObject.allPointsPolyline[0]);
                pointsObject.allPointsPolyline.shift();
            }

            //连线
            if(pointsObject.nowTwoPoints.length>1){
                var polyline = new BMap.Polyline([pointsObject.nowTwoPoints[pointsObject.nowTwoPoints.length-2],pointsObject.nowTwoPoints[pointsObject.nowTwoPoints.length-1]], {strokeColor:"red", strokeWeight:1, strokeOpacity:1});  //定义折线
                map.addOverlay(polyline);
                pointsObject.allPointsPolyline.push(polyline);
            }


            //添加标注并计算距离
            if(pointsObject.allPointsMarker.length==1){
                pointsObject.allPointsMarker[0].setLabel(pointsObject.labelBegin);

            }else{
                if(pointsObject.labelDistance.length==2){
                    map.removeOverlay(pointsObject.labelDistance[0]);
                    pointsObject.labelDistance.shift();
                    pointsObject.allPointsMarker[0].setLabel(pointsObject.labelBegin);
                }
                var disc=new BMap.Label('距离:'+(map.getDistance(pointsObject.nowTwoPoints[pointsObject.nowTwoPoints.length-2],pointsObject.nowTwoPoints[pointsObject.nowTwoPoints.length-1])).toFixed(2)+'米',{offset:new BMap.Size(20,-10)});
                pointsObject.labelDistance.push(disc);
                pointsObject.allPointsMarker[pointsObject.allPointsMarker.length-1].setLabel(disc);
            }

            //确定的拖拽的哪个点
            var index=null;
            marker.addEventListener('mousedown',function(type){
                var p = marker.getPosition(); 
                var H=new BMap.Point(p.lng,p.lat);
                for(var i=0;i<pointsObject.nowTwoPoints.length;i++){
                    if(H.equals(pointsObject.nowTwoPoints[i])){
                        index=i;
                    }
                }

            })
            marker.addEventListener('dragend',function(type){
                pointsObject.nowTwoPoints[index]=new BMap.Point(type.point.lng,type.point.lat);
                //移除线与重新计算距离
                if(index==0){
                    map.removeOverlay(pointsObject.allPointsPolyline[0]);
                    pointsObject.allPointsPolyline.splice(0,1);

                    var polyline = new BMap.Polyline([pointsObject.nowTwoPoints[0],pointsObject.nowTwoPoints[1]], {strokeColor:"red", strokeWeight:1, strokeOpacity:1});  //定义折线
                    map.addOverlay(polyline);
                    pointsObject.allPointsPolyline.splice(0,0,polyline);
                    map.removeOverlay(pointsObject.labelDistance[0]);//要移除文字
                    pointsObject.labelDistance.splice(0,1);
                    var disc= new BMap.Label('距离:'+map.getDistance(pointsObject.nowTwoPoints[index],pointsObject.nowTwoPoints[index+1]).toFixed(2)+'米',{offset:new BMap.Size(20,-10)});
                    pointsObject.labelDistance.splice(0,0,disc);
                    pointsObject.allPointsMarker[1].setLabel(disc);
                }
                if(index==1){
                    map.removeOverlay(pointsObject.allPointsPolyline[0]);
                    map.removeOverlay(pointsObject.allPointsPolyline[1]);
                    pointsObject.allPointsPolyline.length=0;
                    map.removeOverlay(pointsObject.labelDistance[0]);//要移除文字
                    map.removeOverlay(pointsObject.labelDistance[1]);//要移除文字
                    pointsObject.labelDistance.length=0;

                    var polyline = new BMap.Polyline([pointsObject.nowTwoPoints[0],pointsObject.nowTwoPoints[1]], {strokeColor:"red", strokeWeight:1, strokeOpacity:1});  //定义折线
                    map.addOverlay(polyline);
                    pointsObject.allPointsPolyline.push(polyline);
                    polyline = new BMap.Polyline([pointsObject.nowTwoPoints[1],pointsObject.nowTwoPoints[2]], {strokeColor:"red", strokeWeight:1, strokeOpacity:1});  //定义折线
                    map.addOverlay(polyline);
                    pointsObject.allPointsPolyline.push(polyline);

                    var disc= new BMap.Label('距离:'+map.getDistance(pointsObject.nowTwoPoints[index-1],pointsObject.nowTwoPoints[index]).toFixed(2)+'米',{offset:new BMap.Size(20,-10)});
                    pointsObject.labelDistance.push(disc);
                    pointsObject.allPointsMarker[1].setLabel(disc);

                    disc= new BMap.Label('距离:'+map.getDistance(pointsObject.nowTwoPoints[index],pointsObject.nowTwoPoints[index+1]).toFixed(2)+'米',{offset:new BMap.Size(20,-10)});
                    pointsObject.labelDistance.push(disc);
                    pointsObject.allPointsMarker[2].setLabel(disc);
                }
                if(index==2){
                    map.removeOverlay(pointsObject.allPointsPolyline[1]);
                    pointsObject.allPointsPolyline.splice(1,1);

                    var polyline = new BMap.Polyline([pointsObject.nowTwoPoints[1],pointsObject.nowTwoPoints[2]], {strokeColor:"red", strokeWeight:1, strokeOpacity:1});  //定义折线
                    map.addOverlay(polyline);
                    pointsObject.allPointsPolyline.splice(1,0,polyline);
                    map.removeOverlay(pointsObject.labelDistance[1]);//要移除文字
                    pointsObject.labelDistance.splice(1,1);//要移除文字
                    var disc= new BMap.Label('距离:'+map.getDistance(pointsObject.nowTwoPoints[index-1],pointsObject.nowTwoPoints[index]).toFixed(2)+'米',{offset:new BMap.Size(20,-10)});
                    pointsObject.labelDistance.splice(1,0,disc);
                    pointsObject.allPointsMarker[2].setLabel(disc);
                }
            })
        },
        _paramInit:function(){
            pointsObject={
                    nowTwoPoints:[],//两个点
                    allPointsMarker:[],//两个marker
                    allPointsPolyline:[],//一条线
                    labelBegin:new BMap.Label("开始",{offset:new BMap.Size(20,-10)}),
                    labelDistance:[]
                    }
        },

        _bindStopMarkerEvent:function() {
            if (markers.length == updateData.length) {
                for (var i=0; i<markers.length; i++) {
                    _this._clickTable(updateData[i],markers[i]);//点击table
                    _this._leftclick(updateData[i],markers[i]);//站点左击
                    _this._rightclick(updateData[i],markers[i]);//逻辑站点右击
                    _this._dragMaker(updateData[i],markers[i]);//站点拖动
                }
            }
        },
       
        _queryCar:function(){
            $(".cll-btn-query").on("click",function(event){
                //清除红色脊线
                if (tra_polyline != undefined) {
                    map.removeOverlay(tra_polyline);
                }
                   tra_polyline = null;
                //清理页面gps点
                if (initGps) {
                    for (var i=0; i<initGps.length; i++) {
                        var carNo = initGps[i].carNo;
                        _this._clearCollection(pc[carNo]);
                    }
                }
                cars=[];
                var selector =  '#' + $('#tabs .tab-pane.active').attr('id');
                var o = {
                        cityId: _this._getCity().cityId,
                        'area.cityEn': _this._getCity().cityEn,
                        lineNo: lineDatas[0].lineNo,
                        date: $(selector + ' .gpsdate .datepicker').val(),
                        str: '',
                        direction: $('#nodirection').prop('checked') ? '-1' : lineDatas[0].direction
                };

                $.get(__baseUrl + '/gpsData/simplecargps', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.length > 0) {
                                var response = {};
                                response.data = {};
                                response.data.replaylist = result.data;

                                _this._car_display(response);
                            } else {
                                alert('没有更多车辆')
                            }
                        }
                    }
                });
                setTimeout(function(){
                    _this._drawTraLine(traPoints);
                }, 2000);
            });

            $(".change-cars").on("click", function () {
                for (var i = 0; i < pointCollections.length; i++) {
                    _this._clearCollection(pointCollections[i]);
                }
                var selector =  '#' + $('#tabs .tab-pane.active').attr('id');
                var content = "";
                if (cars && cars.length > 0) {
                    content = cars.join(",");
                }

                var o = {
                        cityId: _this._getCity().cityId,
                        'area.cityEn': _this._getCity().cityEn,
                        lineNo: lineDatas[0].lineNo,
                        date: $(selector + ' .gpsdate .datepicker').val(),
                        str: content,
                        direction: lineDatas[0].direction
                };

                $.get(__baseUrl + '/gpsData/simplecargps', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.length > 0) {
                                var response = {};
                                response.data = {};
                                response.data.replaylist = result.data;

                                _this._car_display(response);
                            } else {
                                alert('没有更多车辆')
                            }
                        }
                    }
                });
            });

            $(".uncheck-cars").on("click", function () {
                var selector =  '#' + $('#tabs .tab-pane.active').attr('id');
                $(selector + ' .cars input:checkbox').each(function () {
                    if ($(this).attr('checked') == 'checked') {
                        $(this).attr('checked', false);
                    }
                });
                for (var i = 0; i < pointCollections.length; i++) {
                    _this._clearCollection(pointCollections[i]);
                }
            });
        },

        _clear_heatmap:function() {
            $("#clear_heatmap_btn").on("click", function (event) {
                for (var i in heatOverlay) {
                    heatOverlay[i].hide();
                }
                _this._laquCricleClear();
                $('.BMapLib_Drawing').hide();
                _this._clearDrawManager();
                $('#detailDialog #collapse5').removeClass('in');
                $('#detailDialog #collapse5').css({"height" : "0px"});
                $("#detailDialog #lines_heatmap").prop('checked', false);
                return false;
            });
        },

        _heatmap:function() {
            $("#heatmap_btn").on("click", function (event) {
                $('#detailDialog #collapse5').addClass('in');
                $('#detailDialog #collapse5').css({"height" : "auto"});
                $("#detailDialog #lines_heatmap").prop('checked', false);
                //如果已经查询过，则直接显示，不再查询
                var isShown = false;
                for (var i in heatOverlay) {
                    if (i == $('#heatmap_date').val().trim()) {
                        heatOverlay[i].show();
                        isShown = true;
                    } else {
                        heatOverlay[i].hide();
                    }
                }
                if (isShown) {
                    _this._drawManager();
                    return false;
                }
                //map.removeOverlay(heatOverlay);
                var o = {
                        cityId: _this._getCity().cityId,
                        'area.cityEn': _this._getCity().cityEn,
                        lineNo: lineDatas[0].lineNo,
                        direction: lineDatas[0].direction,
                        date: $('#heatmap_date').val().trim()
                };

                $.get(__baseUrl + '/gpsData/linegps', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.length > 0) {
                                _this._drawHeatmap(result.data);
                                _this._drawManager();
                            } else {
                                alert('没有更多车辆')
                            }
                        }
                    }
                });
                return false;
            });
        },

        _drawHeatmap:function(points, rec) {
            if (points) {
                var pointlist = [], vpoints;
                for (var i = 0; i < points.length; i++) {
                    if(points[i] && points[i].points) {
                        vpoints = points[i].points;
                        for (var j = 0; j < vpoints.length; j++) {
                            pointlist.push({lon: vpoints[j].jingdu, lat: vpoints[j].weidu});
                        }
                    }
                }
                ps = [];
                for (var i=0; i<pointlist.length; i++) {
                    var item = [];
                    item.lng = Math.round(pointlist[i].lon * 10000)/10000;
                    item.lat = Math.round(pointlist[i].lat * 10000)/10000;

                    if (ps.length > 0) {
                        var flag = false;
                        for (var j=0; j<ps.length; j++) {
                            if (ps[j].lng == item.lng && ps[j].lat == item.lat) {
                                flag = true;
                                ps[j].count = ps[j].count + 1;
                                break;
                            }
                        }
                        if (!flag) {
                            item.count = 1;
                            ps.push(item);
                        }
                    } else {
                        item.count = 1;
                        ps.push(item);
                    }

                }
                if (document.createElement('canvas').getContext) {
                    var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":15});
                    map.addOverlay(heatmapOverlay);
                    heatmapOverlay.setDataSet({data:ps,max:(avg_point = pointlist.length/ps.length)*5});
                    heatmapOverlay.show();
                    $( "#maxSlider" ).slider( "option", "value", 5 );
                    var gradient = {
                        '0':'rgb(0, 0, 255)',
                        '.2':'rgb(0, 0, 200)',
                        '.5':'rgb(0, 255, 0)',
                        '.7':'rgb(0, 200, 0)',
                        '1':'rgb(255, 0, 0)'
                    };
                    heatmapOverlay.setOptions({"gradient":gradient});
                    if (rec) {
                        recHeatOverlay = heatmapOverlay;
                    } else {
                        heatOverlay[$('#heatmap_date').val().trim()] = heatmapOverlay;
                    }
                } else {
                    alert("请在chrome、safari、IE8+以上浏览器查看");
                }
            }
        },

        _drawManager: function () {

            _this._clearDrawManager();
            var overlaycomplete = function(e){
                for (var i in heatOverlay) {
                    heatOverlay[i].hide();
                }
                _this._clearDrawManager();
                drawingManager.close();
                recSelectOverlay = e.overlay;
                if ($("#detailDialog #lines_heatmap").prop('checked')) {
                    _this._lines_heatmap();
                } else {
                    _this._rec_heatmap();
                }
            };
            var styleOptions = {
                    strokeColor:"red",    //边线颜色。
                    fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 2,       //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8,       //边线透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            //实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5)
                },
                rectangleOptions: styleOptions //矩形的样式
            });
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
        },

        _clearDrawManager: function() {
            map.removeOverlay(recSelectOverlay);
            map.removeOverlay(recHeatOverlay);
            recSelectOverlay = null;
            recHeatOverlay = null;
        },

        _lines_heatmap_check: function() {
            $("#detailDialog #lines_heatmap").bind("change", function(){
                if (this.checked) {
                    _this._lines_heatmap();
                } else {
                    _this._rec_heatmap();
                }
            });
        },
        _laquCricleClear:function(){
            for(var int=0;int<labelOneArray.length;int++){
                map.removeOverlay(labelOneArray[int]);
            }
            for(var int=0;int<labelTwoArray.length;int++){
                map.removeOverlay(labelTwoArray[int]);
            }
            labelOneArray=[],labelTwoArray=[];
            map.removeOverlay(labelBtuOne);
            map.removeOverlay(labelBtuTwo);
        },

        _rec_heatmap: function() {
            _this._laquCricleClear();

            map.removeOverlay(recHeatOverlay);
            recHeatOverlay = null;
            var northEast = recSelectOverlay.getBounds().getNorthEast();
            var southWest = recSelectOverlay.getBounds().getSouthWest();
            //显示当前选中区域的热力图
            if (northEast.lat != southWest.lat && northEast.lng != southWest.lnt) {
                //console.log(northEast.lat)
                var pointCount = 0, ps = [];
                var points = heatOverlay[$('#heatmap_date').val().trim()].data.data;
                for (var i = 0; i < points.length; i++) {
                    if (points[i].lng > southWest.lng && points[i].lng < northEast.lng
                            && points[i].lat > southWest.lat && points[i].lat < northEast.lat) {
                        ps.push(points[i]);
                        pointCount += points[i].count;
                    }
                }
               if (pointCount > 0) {
                    var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":15});
                    map.addOverlay(heatmapOverlay);
                    heatmapOverlay.setDataSet({data:ps,max:(avg_point_select = pointCount/ps.length)*3});
                    heatmapOverlay.show();

                    //处理Top2
                    var lowerRightPoints=new  BMap.Point(northEast.lng,southWest.lat);//矩形右下角

                    var shaixuanArray=[];
                    for(var c=0;c<ps.length;c++){
                        shaixuanArray.push({
                            index:c,
                            count:ps[c].count
                        })
                    }

                    var vb=[];
                    for(var d=0;d<shaixuanArray.length;d++){
                        vb.push(shaixuanArray[d].count);
                    }
                    var cgh=$.unique(vb);
                    cgh=$.unique(cgh);

                    var ani=cgh.sort(_this._sortNumber);

                    if(ani.length==1){
                        var topone=ani.slice(-1);//ps中的所有点都要打label
                    }

                    if(ani.length>=2){
                        var topone=ani.slice(-1);
                        var toptwo=ani[ani.length-2];
                        //从shaixuanArray中找到count为topone和toptwo的点
                        var indexArrayOne=[],indexArrayTwo=[];
                        for(var jj=0;jj<shaixuanArray.length;jj++){
                            if(shaixuanArray[jj].count==topone){
                                indexArrayOne.push(shaixuanArray[jj].index);
                            }
                        }
                        for(var kk=0;kk<shaixuanArray.length;kk++){
                            if(shaixuanArray[kk].count==toptwo){
                                indexArrayTwo.push(shaixuanArray[kk].index);
                            }
                        }

                        var optiStyle={
                              color : "black",
                                fontSize : "12px",
                                height : "16px",
                                width : "16px",
                                textAlign:"center",
                                border:'1px solid black',
                                lineHeight : "15px",
                                fontFamily:"微软雅黑",
                                backgroundColor:'',
                                borderRadius:'50%'    
                        }
                        var optiButStyle={
                                color : "white",
                                  fontSize : "12px",
                                  height : "16px",
                                  width : "16px",
                                  textAlign:"center",
                                  lineHeight : "16px",
                                  backgroundColor:'black'    
                        }

                        //找到数组中的点打上label
                        for(var uu=0;uu<indexArrayOne.length;uu++){
                            var opts = {
                                position : new BMap.Point(ps[indexArrayOne[uu]].lng, ps[indexArrayOne[uu]].lat),    // 指定文本标注所在的地理位置
                                offset   : new BMap.Size(-8,-8)    //设置文本偏移量
                            }
                            var labelOne = new BMap.Label("1", opts);  // 创建文本标注对象
                            labelOne.setStyle(optiStyle);
                            map.addOverlay(labelOne);
                            labelOneArray.push(labelOne);
                        }
                        for(var yy=0;yy<indexArrayTwo.length;yy++){
                            var opts = {
                                position : new BMap.Point(ps[indexArrayTwo[yy]].lng, ps[indexArrayTwo[yy]].lat),    // 指定文本标注所在的地理位置
                                offset   : new BMap.Size(-8,-8)    //设置文本偏移量
                            }
                            var labelTwo = new BMap.Label("2", opts);  // 创建文本标注对象
                            labelTwo.setStyle(optiStyle);
                            map.addOverlay(labelTwo);
                            labelTwoArray.push(labelTwo);
                        }
                   }

                  //给右下角加上button
                  var labelOne_flag=true;//1的flag
                  labelBtuOne = new BMap.Label("1", {position:lowerRightPoints,offset:new BMap.Size(0,0)});  
                  labelBtuOne.setStyle(optiButStyle);
                  labelBtuOne.addEventListener("click",function(){
                      if(labelOne_flag){
                          for(var int=0;int<labelOneArray.length;int++){
                              map.removeOverlay(labelOneArray[int]);
                          }
                          labelOne_flag=false;
                      }else{
                          for(var int=0;int<labelOneArray.length;int++){
                              map.addOverlay(labelOneArray[int]);
                          }
                          labelOne_flag=true;
                      }

                  });
                  map.addOverlay(labelBtuOne);

                  var labelTwo_flag=true;//2的flag
                  labelBtuTwo = new BMap.Label("2", {position:lowerRightPoints,offset:new BMap.Size(16,0)});  
                  labelBtuTwo.setStyle(optiButStyle);
                  labelBtuTwo.addEventListener("click",function(){
                      if(labelTwo_flag){
                          for(var int=0;int<labelTwoArray.length;int++){
                              map.removeOverlay(labelTwoArray[int]);
                          }
                          labelTwo_flag=false;
                      }else{
                          for(var int=0;int<labelTwoArray.length;int++){
                              map.addOverlay(labelTwoArray[int]);
                          }
                          labelTwo_flag=true;
                      }
                  });
                  map.addOverlay(labelBtuTwo);

                  //处理Top结束

                    $( "#maxSlider" ).slider( "option", "value", 3 );
                    var gradient = {
                        '0':'rgb(0, 0, 255)',
                        '.2':'rgb(0, 0, 200)',
                        '.5':'rgb(0, 255, 0)',
                        '.7':'rgb(0, 200, 0)',
                        '1':'rgb(255, 0, 0)'
                    };
                    heatmapOverlay.setOptions({"gradient":gradient});
                    recHeatOverlay = heatmapOverlay;
                }
            }
        },
        _sortNumber:function (a,b){
            return a - b
        },
        _lines_heatmap: function() {
            if ($('#recommand_stopname').val().trim() == "") {
                $("#detailDialog #lines_heatmap").prop('checked', false);
                alert("请输入站点名称。");
                return false;
            }
            if (!recSelectOverlay) {
                $("#detailDialog #lines_heatmap").prop('checked', false);
                alert("请选择热力图区域。");
                return false;
            }
            map.removeOverlay(recHeatOverlay);
            recHeatOverlay = null;
            var northEast = recSelectOverlay.getBounds().getNorthEast();
            var southWest = recSelectOverlay.getBounds().getSouthWest();
            var o = {
                    cityId: _this._getCity().cityId,
                    'area.cityEn': _this._getCity().cityEn,
                    lineNo: lineDatas[0].lineNo,
                    direction: lineDatas[0].direction,
                    date: $('#heatmap_date').val().trim(),
                    jd1: northEast.lng,
                    wd1: northEast.lat,
                    jd2: southWest.lng,
                    wd2: southWest.lat,
                    stopName: $('#recommand_stopname').val().trim()
            };

            $.get(__baseUrl + '/gpsData/playSect', o, function(result) {
                if (result._exception === true) {
                    alert(result.message);
                } else {
                    if (result.status == 'FAIL') {
                        alert(result.errmsg);
                    } else {
                        if (result && result.data && result.data.length > 0) {
                            _this._drawHeatmap(result.data, true);
//                            _this._drawManager();
                        } else {
                            alert('不存在其它的线路。')
                        }
                    }
                }
            });
        },

        _printGps:function(points) {
            var colpoints = [];
            for (var i=0; i<points.length; i++) {
                colpoints.push(new BMap.Point(points[i].lng, points[i].lat));
            }

            if (document.createElement('canvas').getContext) {
                var options = {
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_STAR,
                    color: '#FF1493'
                };
                var pcol = new BMap.PointCollection(colpoints, options);
                map.addOverlay(pcol);  // 添加Overlay

                gpcol = pcol;
            } else {
                alert("浏览器不支持");
            }

        },

        _user_query:function() {
            $("#user-query").on("click", function (event) {
                var callback = function(response){
                    if (response['errCode']) {
                        alert('查询失败！'+response['errCode']);
                        return;
                    }
                    if(response.data){
                        var gp = [];
                        var data=response.data;
                        for (var i=0; i<data.length; i++) {
                            var gpslist = data[i].gps;
                            for (var j=0; j<gpslist.length; j++) {
                                if (gpslist[j]) {
                                    for (var s=0; s<gpslist[j].length; s++) {
                                        if (gpslist[j][s]) {
                                            gp.push(gpslist[j][s]);
                                        }
                                    }
                                }
                            }
                        }
                        _this._printGps(gp);
                    }
                };
                if (gpcol) {
                    _this._clearCollection(gpcol);
                }
                var stopName = $('#recommand_stopname').val().trim();
                //对于新增站点，它没有站序，则调用老接口
                var orderNum = -1;
                var maplist = result_bak.maplist;
                for (var i = 0; i < maplist.length; i++) {
                    if (maplist[i].stopName == stopName) {
                        orderNum = maplist[i].orderNum;
                    }
                }
                if (orderNum === -1) {
                    //新增站点
                    $.get("http://op.raymond.com:7000/api/get_gps",
                            "stopName="+encodeURIComponent(stopName)+"&cityId="+_this._getCity().cityId
                            +"&magic=zhangxu0328&filter_interval_min=60&filter_offset_m=50&filter_stop_offset_m=1000",
                            callback);
                } else {
                    //已有站点
                    $.get("http://op.raymond.com:7000/api/get_gps2",
                            "stopName="+encodeURIComponent(stopName)+"&cityId="+_this._getCity().cityId
                            +"&magic=zhangxu0328&filter_interval_min=60&filter_offset_m=50&filter_stop_offset_m=1000"
                            +"&lineNo=" + lineDatas[0].lineNo + "&direction=" + lineDatas[0].direction + "&stopOrder=" + orderNum,
                            callback);
                }
            });
        },

        _clear_uq:function() {
            $("#clear-uq").on("click", function () {
                if (gpcol) {
                    _this._clearCollection(gpcol);
                }
            });
        },

        _app_query: function() {
            $("#app-stop-query").on("click", function (event) {
                $("#luce-body").html('');
                if ($('#recommand_stopname').val().trim() == "") {
                    alert("请输入站点名称。");
                    return false;
                }
                
                if(stMarker){
                     map.removeOverlay(stMarker);
                }
                if(thirdMarker){
                    map.removeOverlay(thirdMarker);
                }
                stMarker = null;
                thirdMarker = null;
                map.closeInfoWindow();
                
                if (appGps) {
                    _this._clearCollection(appGps);
                }
               
                $.get(__baseUrl  + '/baseData/getRtStopLocations?cityId='+ _this._getCity().cityId +'&lineId='+ lineDatas[0].lineId +'&stopName='+ $("#recommand_stopname").val().trim(), function(result) {
                    if (result.length > 0) {
                        _this._printAppGps(result);
                    } else {
                       alert("无数据!");
                    }
                });
            });
        },

        _app_clear: function() {
            $("#app-stop-clear").on("click", function () {
                if(stMarker != null){
                    map.removeOverlay(stMarker);
                }
                if(thirdMarker != null){
                    map.removeOverlay(thirdMarker);
                }
                stMarker = null;
                thirdMarker = null;
                
                $('#detailDialog #luce').removeClass('in');
                $('#detailDialog #luce').css({"height" : "0px"});
                
                return false;
            });
        },

        _printAppGps:function(result) {
            $('#detailDialog #luce').addClass('in');
            $('#detailDialog #luce').css({"height" : "auto"});

            var shtml = "";
            for (var i = 0; i < result.length; i++) {
                shtml += "<tr data-cll='"+ result[i].orderNum +"' data-j='"+ result[i].lng +"' data-w='"+ result[i].lat +"'>"
                      +  "<td class='hide'>"+ result[i].stopName +"</td>"
                      +  "<td>"+ result[i].orderNum +"</td>"
                      +  "<td>"+ (result[i].dis2Stop).toFixed(2) +"</td>"
                      +  "<td>"+ (result[i].sWeight).toFixed(2) +"</td>"
                      +  "<td>"+ $.codemap.rt_source_type[result[i].sourceType] +"</td>"
                      +  "<td><a class='btn btn-primary shadowLuce hide' data-plng='"+ result[i].pLng +"' data-plat='"+ result[i].pLat +"'>投影</a></td>"
                      +  "<td><a class='btn btn-primary' id='appupdstop' data-plng='"+ result[i].pLng +"' data-plat='"+ result[i].pLat +"'>更新</a></td></tr>"
            }         

            $("#luce-body").html(shtml);

            $("#luce-body").on('click','.shadowLuce',function(){
                shadow($(this));
                return false;
            })
            
            $("#luce-body").on("click", 'tr', function(event){
                removeTwoMarker();
                trTipUpdate($(this));
                $(this).find('.shadowLuce').click();
            });
            
            $("#luce-body").on("click", '#appupdstop', function(event){
                removeTwoMarker();
                var cll = $(this).closest('tr').data('cll');
                var jdu = $(this).data('plng');
                var wdu = $(this).data('plat');
                var name = $(this).parent().parent().children().eq(0).text();
                var op = {
                    name:name,
                    jingdu: jdu,
                    weidu:wdu,
                    order:cll
                }

                //修改站点
                _this._reviseStopData(op);
                map.closeInfoWindow();
            })

            function shadow(self){
                //removeTwoMarker();

                var cll = self.closest('tr').data('cll');
                var jdu = self.data('plng');
                var wdu = self.data('plat');
                var name = self.parent().parent().children().eq(0).text();
                var point = new BMap.Point(self.data('plng'), self.data('plat'));
                stMarker = new BMap.Marker(point,{icon:shadowIcon,offset:offset})
                map.addOverlay(stMarker);
                map.setCenter(point);
                
                //设置提示框
                var content = "<p>站名:"+ name +"</p>"
                            + "<p>经度:"+ self.data('plng') +"</p>"
                            + "<p>纬度:"+ self.data('plat') +"</p>"
                            //+ "<a class='btn btn-primary' id='appupdstop'>替换</a>"
                var infoWindow = new BMap.InfoWindow(content);
                stMarker.addEventListener('click',function(){
                    stMarker.openInfoWindow(infoWindow); 
                })

                infoWindow.addEventListener('close',function(){
                    removeTwoMarker();
                })
                stMarker.openInfoWindow(infoWindow);

                return false;
            }

            function trTipUpdate(self){
                //removeTwoMarker();
                
                var cll = self.data('cll');
                var name = self.children().eq(0).text();
                var jdu = self.data('j');
                var wdu = self.data('w');
                var point = new BMap.Point(jdu, wdu);
                thirdMarker = new BMap.Marker(point)
                map.addOverlay(thirdMarker);
                map.setCenter(point);
                
               //设置提示框
                var content = "<p>站名:"+ name +"</p>"
                            + "<p>经度:"+ jdu +"</p>"
                            + "<p>纬度:"+ wdu +"</p>";
                            //+ "<a class='btn btn-primary' id='appupdstop'>替换</a>"
                var infoWindow = new BMap.InfoWindow(content);
                thirdMarker.addEventListener('click',function(){
                    thirdMarker.openInfoWindow(infoWindow); 
                })
                
                thirdMarker.openInfoWindow(infoWindow);
                
            }
            
            function removeTwoMarker(){
                map.removeOverlay(stMarker);
                map.removeOverlay(thirdMarker);
                stMarker = null;
                thirdMarker = null;
            }
        },

        _draw_speed:function(data, max) {
            speedPolys = [];
            for (var i=0; i<data.length; i++) {
                var label = data[i].label;
                var polys = data[i].polyline;
                var color;
                //为0不使用
                //if (label == 0) color = '#C0FF3E';
                if (label > 0) {
                    if (label <= max) {
                        color = '#8B0000';
                    } else {
                        color = '#9ACD32';
                    }
                } else {
                    continue;
                }

                var pps = [];
                if (polys) {
                    for (var j=0; j<polys.length; j++) {
                        pps.push(new BMap.Point(polys[j].bd_lng, polys[j].bd_lat));
                    }
                    var speedline = new BMap.Polyline(pps, {strokeColor:color, strokeWeight:10, strokeOpacity:0}); //创建折线对象
                    speedline.enableMassClear();
                    map.addOverlay(speedline); //添加到地图中

                    speedPolys.push(speedline);
                }
            }

        },

        _avg_speed:function() {
            $("#avg-speed").on("click", function (event) {
                $('#detailDialog #avgspeed').addClass('in');
                $('#detailDialog #avgspeed').css({"height" : "auto"});
                if (speedPolys.length > 0) {
                    for (var i=0; i<speedPolys.length; i++) {
                        map.removeOverlay(speedPolys[i]);
                    }
                }
                var cityId = _this._getCity().cityId;
                var lineNo = lineDatas[0].lineNo;
                var direction = lineDatas[0].direction;
                _this._blockUI();
                _this._query_speed(cityId, lineNo, direction, 0);
                return false;
            });
        },

        //查询前三天最近一天的低速区数据
        _query_speed: function(cityId, lineNo, direction, i) {
            var days = day3.split(",");
            var sectionSplits = "3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10.0,10.5,11.0,11.5,12.0,12.5,13.0,13.5,14.0,14.5,15.0,15.5,16.0,16.5,17.0";
            $.read("http://op.raymond.com:7000/api/speed_map",
                    "sectionSplits=" + sectionSplits + "&lineNo="+lineNo+"&cityId="+cityId+"&direction="+direction+"&date="+days[i],
                    function(response){
                        if (response['err_code'] || !response.values || response.values.length == 0) {
                            if (i >= 2) {
                                _this._unblockUI();
                                alert('查询失败！'+response['err_msg']);
                                return;
                            }
                            _this._query_speed(cityId, lineNo, direction, ++i);
                        } else {
                            speedData = response.values;
                            _this._draw_speed(response.values, 5);
                            $( "#speed_maxSlider" ).slider( "option", "value", 5 );
                            _this._unblockUI();
                        }
            }, 'json');
        },

        _clear_speed:function() {
            $("#clear-speed").on("click", function (event) {
                $('#detailDialog #avgspeed').removeClass('in');
                $('#detailDialog #avgspeed').css({"height" : "0px"});
                if (speedPolys.length > 0) {
                    for (var i=0; i<speedPolys.length; i++) {
                        map.removeOverlay(speedPolys[i]);
                    }
                }
                return false;
            });
        },

        //display the 10 car
        _car_display:function(response) {
            initGps= response.data.replaylist;
            var replaylist = response.data.replaylist;
            var carhtml=[];
            for (var i=0; i<replaylist.length; i++) {
                var cargps = replaylist[i];
                carhtml.push("<label style='width:25%;'>" +
                "<input type='checkbox' checked value='" + cargps.carNo
                    + "'/>" + cargps.carNo + "</label>");
                _this._drawCollection(initGps[i].points, cargps.carNo);
                cars.push(cargps.carNo);

            }
            var selector =  '#' + $('#tabs .tab-pane.active').attr('id');
            $(selector + " .cars").html(carhtml.join(""));
            $(selector + " .cars input:checkbox").bind("click", function(){
                var value=this.value;
                var points;
                for (var i=0; i<initGps.length; i++) {
                    if (initGps[i].carNo == value) {
                        points = initGps[i].points;
                    }
                }
                if (this.checked) {
                    _this._drawCollection(points, value);
                }
                if (!this.checked) {
                    _this._clearCollection(pc[value]);
                }
            });
        },

        _drawCollection:function(points, carNo) {
            if (points) {
                var ps = [];
                for (var i=0; i<points.length; i++) {
                    ps.push(new BMap.Point(points[i].jingdu, points[i].weidu));
                }

                if (document.createElement('canvas').getContext) {
                    var options = {
                        size: BMAP_POINT_SIZE_SMALLER,
                        shape: BMAP_POINT_SHAPE_STAR,
                        color: 'green'
                    }
                    var pointCollection = new BMap.PointCollection(ps, options);

                    map.addOverlay(pointCollection);  // 添加Overlay
                    pc[carNo] = pointCollection;
                    pointCollections.push(pointCollection);
                } else {
                    alert("浏览器不支持");
                }
            }
        },

        _clearCollection:function(pointCollection) {
            if (pointCollection) {
                map.removeOverlay(pointCollection);
            }
        },

        _stopQury:function() {
            $("#stop-query").on("click",function(event){
                if ($('#recommand_stopname').val().trim() == "") {
                    alert("请输入站点名称。");
                    return false;
                }
                
                var stopName=$('#recommand_stopname').val().trim();
               
                //多了这两次请求
                var cityText = $('#detailDialog #cityId').find("option:selected").text();
                cityText = getSelectText(cityText);
                var station = new AMap.StationSearch({
                    pageIndex: 1,
                    pageSize: 100,
                    city: cityText.replace('test', '')
                });
            
                $('#detailDialog #stops-query').addClass('in');
                $('#detailDialog #stops-query').css({"height" : "auto"});
                for (var i = 0; i < sMarkers.length; i++) {
                    map.removeOverlay(sMarkers[i]);
                }
                sMarkers = [];

                var o = {
                        cityId: _this._getCity().cityId,
                        stopName: $('#recommand_stopname').val().trim(),
                        multi: false
                };
                $.get(__baseUrl + '/baseData/queryStation', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.stationList.length > 0) {
                                _this.showStop(result.data.stationList);
                            } else {
                                alert('不存在同名站点');
                            }
                        }
                    }
                });
                return false;
            });
            
            $("#merge_samestop").on('click',function(){
                var heih = $('#stops-query-result');
                var heihCheck = heih.find('[type=checkbox]:checked');
                if(heih.css('height') !== '0px' && heihCheck.length > 1){
                    if(heihCheck.length){
                        var stationIdArray = heihCheck.map(function(){
                            return  $(this).data('stationid');
                        });
                        var joinStationId = _this._mergerStations(stationIdArray);
                        
                        $.postLock(__baseUrl + '/baseData/mergeStations',{
                            stationIds:joinStationId.join(),
                            cityId:_this._getCity().cityId
                        },function(result){
                            if(result.status === 'OK'){
                                $("#stop-query").click();
                                alert('合并成功!');
                            }else{
                                alert('合并失败!');
                            }
                        })
                    }
                }
            })
        },
        _mergerStations:function(stationIdArray){
            var sIdSame = [];
            for(var i=0;i<stationIdArray.length;i++){
                for(var y=1;y<stationIdArray.length;y++){
                    if(stationIdArray[i] === stationIdArray[y+i]){
                        sIdSame.push(y+i);
                    }
                }
                for(var q=0;q<sIdSame.length;q++){
                    if(q==0){
                        stationIdArray.splice(sIdSame[0],1);
                    }else{
                        stationIdArray.splice(sIdSame[q]-q,1);
                    }
                }
                sIdSame = [];
            }
            
            var joinStationId = [];
            $.each(stationIdArray,function(index,ele){
                joinStationId.push(ele);
            })
            return joinStationId;
        },

        // 2016-3-15日新增历史查询任务,可以查询当前站点相关的历史任务记录
        _hisQuery:function() {
            $("#his-query").on("click",function(event){
                if ($('#recommand_stopname').val().trim() == "") {
                    alert("请输入站点名称。");
                    return false;
                }
                $('#detailDialog #history-query').addClass('in');
                $('#detailDialog #history-query').css({"height" : "auto"});
                for (var i = 0; i < sMarkers.length; i++) {
                    map.removeOverlay(sMarkers[i]);
                }
                sMarkers = [];

                var o = {
                        cityId: _this._getCity().cityId,
                        lineName: lineDatas[0].lineNo,
                        stopName: $('#recommand_stopname').val().trim(),
                        multi: false
                };
                $.get(__baseUrl + '/baseData/queryStopHis', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.length > 0) {
                                _this.showHis(result.data);
                            } else {
                                alert('暂时没有该站点的历史任务');
                            }
                        }
                    }
                });
                return false;
            });
        },

        _stopDisQuery:function() {
            $("#show-pickup-point").on("click",function(event){
                if ($('#pickup-point').val().replace(/,/g,'').trim() == "") {
                    alert("请先拾取坐标。");
                    return false;
                }

                for (var i = 0; i < pickMarkers.length; i++) {
                    map.removeOverlay(pickMarkers[i]);
                }
                pickMarkers = [];
                $('#detailDialog #stops-query-kilometres-result').addClass('in');
                $('#detailDialog #stops-query-kilometres-result').css({"height" : "auto"});
                for (var i = 0; i < sDisMarkers.length; i++) {
                    map.removeOverlay(sDisMarkers[i]);
                }
                sDisMarkers = [];

                var o = {
                        cityId: _this._getCity().cityId,
                        lng: $('#pickup-point').val().split(',')[0],
                        lat: $('#pickup-point').val().split(',')[1],
                        radius: 300
                };
                $.get(__baseUrl + '/baseData/allDisStops', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                    } else {
                        if (result.status == 'FAIL') {
                            alert(result.errmsg);
                        } else {
                            if (result && result.data && result.data.length > 0) {
                                _this.showDisStop(result.data);
                            } else {
                                alert('当前范围不存在站点');
                            }
                        }
                    }
                });
                return false;
            });
        },

        stopClear:function() {
            $("#clear_samestop").on('click',function(){
                $('#detailDialog #stops-query').removeClass('in');
                $('#detailDialog #stops-query').css({"height" : "0px"});
                for (var i = 0; i < sMarkers.length; i++) {
                    map.removeOverlay(sMarkers[i]);
                }
                sMarkers = [];
                $('#stops-query-result').html('');
                return false;
            });
        },

        stopDisClear:function() {
            $("#clear-pickup-point").on('click',function(){
                for (var i = 0; i < pickMarkers.length; i++) {
                     map.removeOverlay(pickMarkers[i]);
                 }
                 pickMarkers = [];
                map.removeEventListener("click", _this._showInfo); 
                $("#pickup").attr("disabled", false); 
                $('#detailDialog #stops-query-kilometres-result').removeClass('in');
                $('#detailDialog #stops-query-kilometres-result').css({"height" : "0px"});
                for (var i = 0; i < sDisMarkers.length; i++) {
                    map.removeOverlay(sDisMarkers[i]);
                }
                sDisMarkers = [];
                $('#stops-query-kilometres-results').html('');
                return false;
            });
        },

        stopDisSH:function() {
           $('#stops-query-lnglat').click(function(){
               if ($('#stops-query-kilometres').hasClass('in')) {
                   $('#detailDialog #stops-query-kilometres-result').removeClass('in');
                      $('#detailDialog #stops-query-kilometres-result').css({"height" : "0px"});
             };
           });
        },

        showStop:function(stoplist) {
            var sIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-wine.png", new BMap.Size(30,30));
            if (stoplist.length == 0) {
                alert("未查询到站点！");
                return;
            }
            var html = [];
            for(var i=0;i<stoplist.length;i++){
                //虚拟的显示逻辑站
                var pointDiff = null;
                var marker = null;
                if(stoplist[i].isVirtual === 0 && stoplist[i].stopList){
                    for(var k=0;k<stoplist[i].stopList.length;k++){
                        var direction;
                        if(stoplist[i].stopList[k].direction != null && stoplist[i].stopList[k].direction != undefined){
                            direction = stoplist[i].stopList[k].direction;
                        }else{
                            direction = '';
                        }
                        html.push("<tr>"
                                + "<td><input style='cursor:pointer;' type='checkbox' checked value='1' data-stationId='"+ stoplist[i].stopList[k].stationId +"'>&nbsp&nbsp<label style='cursor:pointer;'>"+ (stoplist[i].stopList[k].lineName?stoplist[i].stopList[k].lineName:"") +"</td>"
                                + "<td>"+ direction +"</td>"
                                + "<td>"+ (stoplist[i].stopList[k].stopName?stoplist[i].stopList[k].stopName:"") +"</td>"
                                + "<td>逻辑</td>"
                                + "</tr>");
                        pointDiff = new BMap.Point(stoplist[i].stopList[k].jingdu,stoplist[i].stopList[k].weidu);
                        marker = new BMap.Marker(pointDiff,{icon:samenamelgo, offset:offset});
                        _this._leftclick_stop(marker, stoplist[i].stopList[k],stoplist[i]);
                        map.addOverlay(marker);
                        sMarkers.push(marker);
                    }
                }else{
                //真实的就显示物理站
                    html.push("<tr>"
                                + "<td><input style='cursor:pointer;' type='checkbox' checked value='1' data-stationId='"+ stoplist[i].stationId +"'>&nbsp&nbsp<label style='cursor:pointer;'>"+ (stoplist[i].lineName?stoplist[i].lineName:"") +"</td>"
                                + "<td></td>"
                                + "<td>"+ (stoplist[i].stationName?stoplist[i].stationName:'') +"</td>"
                                + "<td>真实</td>"
                                + "</tr>");
                    pointDiff = new BMap.Point(stoplist[i].lng,stoplist[i].lat);
                    marker = new BMap.Marker(pointDiff,{icon:sIcon, offset:offset}); 
                    _this._leftclick_stop(marker, stoplist[i]);
                    map.addOverlay(marker);
                    sMarkers.push(marker);
                }
                
            }
            $('#stops-query-result').html(html.join(''));
            $("#stops-query-result input:checkbox").bind("click", function(e){
                if (this.checked) {
                    sMarkers[$(this).closest("tr").index()].show();
                    $(sMarkers[$(this).closest("tr").index()].K).click();
                } else {
                    sMarkers[$(this).closest("tr").index()].hide();
                }
                e.stopPropagation();
            });
            $("#stops-query-result tr").bind("click", function(e) {
                $(this).find("input:checkbox").click();
                e.stopPropagation();
            });
        },

        showHis:function(hislist) {
            if (hislist.length == 0){
                alert("未查询到站点！");
            }
            var html = "";

            for (var i=0; i<hislist.length; i++) {
                    var his = hislist[i];
                    var id = 'querystop';
                    html += "<tr>" +
                                "<td><a onclick=opentaskDetail('"+his.taskid+"') href='javascript:execFun(this);void(0);'>" + his.dealerid + "</a></td>" +
                                "<td>" + (his.finishtime).substr(0,19) + "</td>" +
                            "</tr>";

            }
            $('#his-query-result').html(html);
            $("#his-query-result tr").bind("click", function(e) {
                e.stopPropagation();
            });
            //$("#taskDetail").modal('show');
        },

        showDisStop:function(stoplist) {
            var sIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-wine.png", new BMap.Size(30,30));
            if (stoplist.length == 0) alert("未查询到站点！");
            var html = "";
            for (var i=0; i<stoplist.length; i++) {
                    var stop = stoplist[i];
                    html += "<tr>" +
                            "    <td><input style='cursor:pointer;' type='checkbox' checked value='1'>&nbsp&nbsp<label style='cursor:pointer;'>" + stop.lineNo + "</label></td>" +
                            "    <td>" + stop.direction + "</td>" +
                            "</tr>";
                    var point = new BMap.Point(stop.jingdu,stop.weidu);
                    var marker = new BMap.Marker(point,{icon:sIcon, offset:offset});  // 创建标注
                    _this._leftclick_dis_stop(marker, stop);
                    map.addOverlay(marker);
                    sDisMarkers.push(marker);
            }
            $('#stops-query-kilometres-results').html(html);
            $("#stops-query-kilometres-results input:checkbox").bind("click", function(e){
                if (this.checked) {
                    sDisMarkers[$(this).closest("tr").index()].show();
                } else {
                    sDisMarkers[$(this).closest("tr").index()].hide();
                }
                e.stopPropagation();
            });
            $("#stops-query-kilometres-results tr").bind("click", function(e) {
                $(this).find("input:checkbox").click();
                e.stopPropagation();
            });
        },

        _checkAllStop: function() {
            $('#checkAllStop').click(function() {
                var isChecked = $(this).prop('checked');
                $('#stops-query-result').children().each(function(i, element){
                    var checkbox = $(element).find('input[type=checkbox]');
                    $(checkbox).prop('checked', isChecked);
                    isChecked ? sMarkers[$(element).index()].show() : sMarkers[$(element).index()].hide();
                });
            });
        },

        _checkDisAllStop: function() {
            $('#checkAllkilometresStop').click(function() {
                var isChecked = $(this).prop('checked');
                $('#stops-query-kilometres-results').children().each(function(i, element){
                    var checkbox = $(element).find('input[type=checkbox]');
                    $(checkbox).prop('checked', isChecked);
                    isChecked ? sDisMarkers[$(element).index()].show() : sDisMarkers[$(element).index()].hide();
                });
            });
        },

        _leftclick_stop:function(marker, data, phyStationInfo) {
            marker.addEventListener("click", function(){
                var dialog ="";
                if(data.isVirtual != null && data.isVirtual != undefined && data.isVirtual == 1){
                    dialog = "站点名称："+(data.stationName?data.stationName:'')+"<br>"
                           + "站点属性：真实<br>";
                }else{
                    dialog = "线路名："+(data.lineName?data.lineName:'')+"<br>"
                           + "线路编号："+(data.lineNo?data.lineNo:'')+"<br>"
                           + "站点名称："+(data.stopName?data.stopName:'')+"<br>"
                           + "经度："+(data.jingdu?data.jingdu:'')+"<br>"
                           + "纬度："+(data.weidu?data.weidu:'')+"<br>"
                           + "站点属性：逻辑<br>"
                           + "方向："+ data.direction +"<br>"
                           + "下一站："+ (data.nextStopName?data.nextStopName:'')
                    
                }
                
                var content = "<div style='max-height:200px;overflow:auto;text-align: left'>";
                    if(data.isVirtual == 1){
                        content += "<table  class='table table-hover'>";
                        content += "<thead>";
                        content += "<tr><th>线名</th><th>站名</th><th>下一站</th><th>方向</th></tr>";
                        content += "</thead>";
                        content += "<tbody id='relstoplist'>";
                        
                           for(var i=0;i<data.stopList.length;i++){
                            content += "<tr><td>"+data.stopList[i].lineName+"</td><td>"+data.stopList[i].stopName+"</td><td>"+(data.stopList[i].nextStopName==null?"":data.stopList[i].nextStopName)+"</td><td>"+data.stopList[i].direction+"</td></tr>";
                            } 
                        
                        content += "</tbody>";
                        content += "</table>";
                    }
                    content += "</div>";
                    content += "<a class='btn btn-primary' id='btn-choose1'>选择</a>";        
                
                var infoWindow = new BMap.InfoWindow(content,{
                    width : 270,     
                    height: 0,     
                    title : dialog
                });
                marker.openInfoWindow(infoWindow);

                setTimeout(function(){
                    $("#btn-choose1").on("click",function(){
                        //_this._sameNameAddStop(data,infoWindow);
                        //存在本线路相同的物理站点
                        if(updateStationList && updateStationList.length){
                            for(var i=0;i<updateStationList.length;i++){
                                if(updateStationList[i].stationId == data.stationId){
                                    alert("该站已存在于该线路,请重新选择!");
                                    return;
                                }
                            }

                        }
                        
                        var newOrderNum;
                        var item={};

                        if(updateData && updateData.length>0){
                            for(var i=0;i<updateData.length;i++){
                                if(updateData[i].markerIconColor==1){
                                    newOrderNum= parseInt(updateData[i].orderNum,10)+1;
                                    item.lineNo = updateData[i].lineNo;
                                    item.direction = updateData[i].direction;
                                    item.cityId = _this._getCity().cityId;
                                    item.lineId = lineDatas[0].lineId;
                                    updateData[i].markerIconColor = 0;
                                }
                            }
                        }else{
                            newOrderNum=1;
                            item.lineNo=lineDatas[0].lineNo;
                            item.direction=lineDatas[0].direction;
                            item.cityId = _this._getCity().cityId;
                            item.lineId = lineDatas[0].lineId;
                        }

                        if(newOrderNum){
                            currentPointType = 0;
                            var pointThree =null;
                            if(phyStationInfo){
                               pointThree = new BMap.Point(data.jingdu,data.weidu);
                               item.jingdu = data.jingdu;
                               item.weidu = data.weidu;
                               item.stopName = data.stopName;
                            }else{
                               pointThree = new BMap.Point(data.lng,data.lat); 
                               item.jingdu = data.lng;
                               item.weidu = data.lat;
                               item.stopName = data.stationName;
                            }
                            var  insertMarker = null;
                            if(data.isVirtual == 1){
                                insertMarker = new BMap.Marker(pointThree,{icon:phy_shi,offset:offset});  
                            }else{
                                if(changeView){
                                    insertMarker = new BMap.Marker(pointThree,{icon:rIcon,offset:offset}); 
                                }else{
                                    insertMarker = new BMap.Marker(pointThree,{icon:phy_xu,offset:offset});  
                                }
                            }
                            
                            map.addOverlay(insertMarker);
                            markers.push(insertMarker);

                            //虚拟物理站中逻辑站
                            if(phyStationInfo){
                               item.stationProp = 1;
                               item.stationId = phyStationInfo.stationId; 
                               item.stationInfo = phyStationInfo;
                               item.stopExtend = phyStationInfo.stopExtend;

                            }else{
                                //物理站
                               item.stationProp = 0;
                               item.stationId = data.stationId; 
                               item.stopExtend = data.stopExtend;
                               item.stationInfo = data;
                            }

                            item.orderNum = newOrderNum;
                            item.sjingdu = 0;
                            item.sweidu = 0;
                            item.status = 2;
                            item.markerIconColor = 1;
                            item.id = generateUUID();

                            if(item.orderNum==1){
                                _this._insertOrderNumResort(item,newOrderNum-1);
                            }else{
                                $("#table-map-body").children().each(function(){
                                    var  orderNum=$(this).children().eq(0).text().trim();
                                    if(newOrderNum-1){
                                        if(orderNum==newOrderNum-1){
                                            _this._insertOrderNumResort(item,newOrderNum-1);
                                        }
                                    }
                                });
                            }
                            map.closeInfoWindow(infoWindow);

                            for (var m=0; m<sMarkers.length; m++) {
                                map.removeOverlay(sMarkers[m]);
                            }
                            sMarkers = [];

                            $('#detailDialog #stops-query').removeClass('in');
                            $('#detailDialog #stops-query').css({"height" : "0px"});
                            $('#stops-query-result').html('');

                            //修改updateStationList
                            if(updateStationList && updateStationList.length){
                                updateStationList.push(item.stationInfo);
                            }
                            
                       
                        }else{
                            alert("请选择上一个站点！");
                            currentPointType = -1;
                            setTimeout(function() {
                                map.enableDoubleClickZoom();
                            }, 2000);
                        }
                    });

                },100);

            });
        },

        //同名站点新增物理站
        _sameNameAddStop:function(data,infoWindow){
            function addStop(){
                this.dataSource = data;
                this.infoWindow = infoWindow;
                this.newOrderNum = null;
                this.item = {};
                this.itemProp = itemProp;
                this.icon = icon;
                this.closeWindow = closeWindow;
                this.removeMarkers = removeMarkers;
                this.judgeOrder = judgeOrder;
                this.drawMarker = drawMarker;
                this.sureBaseData = sureBaseData;
                this.sureOtherData = sureOtherData;
                this.changeTable = changeTable;
                this.changeUpdateData = changeUpdateData;
                this.changeUpdateStationList = changeUpdateStationList;
            }

            function itemProp(){
                if(this.dataSource.isVirtual == 1){
                    this.item.stationProp = 0;
                }else{
                    this.item.stationProp = 1;
                }
            }

            function sureBaseData(){
                if(updateData && updateData.length){
                    for(var i=0;i<updateData.length;i++){
                        if(updateData[i].markerIconColor==1){
                            this.newOrderNum = parseInt(updateData[i].orderNum,10)+1;
                            this.item.lineNo = updateData[i].lineNo;
                            this.item.direction = updateData[i].direction;
                            this.item.cityId = _this._getCity().cityId;
                            this.item.lineId = lineDatas[0].lineId;
                            updateData[i].markerIconColor = 0;
                        }
                    }
                }else{
                    this.newOrderNum=1;
                    this.item.lineNo=lineDatas[0].lineNo;
                    this.item.direction=lineDatas[0].direction;
                    this.item.cityId = _this._getCity().cityId;
                    this.item.lineId = lineDatas[0].lineId;
                }
            }

            function closeWindow(){
                map.closeInfoWindow(this.infoWindow);
            }

            function removeMarkers(){
                for (var i=0; i<sMarkers.length; i++) {
                    map.removeOverlay(sMarkers[i]);
                }
                sMarkers = [];
            }

            function judgeOrder(){
                 if(this.newOrderNum){
                    currentPointType = 0;
                    var pointThree = new BMap.Point(this.dataSource.jingdu,this.dataSource.weidu);
                    var insertMarker = null;

                    var add_stop = new addStop();
                    insertMarker = add_stop.icon(pointThree,insertMarker);
                    add_stop.drawMarker(insertMarker);
                    add_stop.sureOtherData();

                    if(this.item.orderNum==1){
                        _this._insertOrderNumResort(this.item,this.newOrderNum-1);
                    }else{
                        add_stop.changeTable();
                    }
                    
                    add_stop.closeWindow();
                    add_stop.removeMarkers();
                    //修改updateStationList



                    }else{
                        alert("请选择上一个站点！");
                        currentPointType = -1;
                        setTimeout(function() {
                            map.enableDoubleClickZoom();
                        }, 2000);
                    }
            }

            function icon(pointThree,insertMarker){
                if(this.dataSource.isVirtual == 1){
                    insertMarker = new BMap.Marker(pointThree,{icon:phy_shi,offset:offset});  
                }else{
                    if(changeView){
                        insertMarker = new BMap.Marker(pointThree,{icon:rIcon,offset:offset}); 
                    }else{
                        insertMarker = new BMap.Marker(pointThree,{icon:phy_xu,offset:offset});  
                    }
                }
                return insertMarker;
            }

            function drawMarker(insertMarker){
                map.addOverlay(insertMarker);
                markers.push(insertMarker);
            }

            function sureOtherData(){
                this.item.orderNum = this.newOrderNum;
                this.item.stopName = this.dataSource.stationName;
                this.item.jingdu = this.dataSource.lng;
                this.item.weidu = this.dataSource.lat;
                this.item.sjingdu = 0;
                this.item.sweidu = 0;
                this.item.status = 2;
                this.item.markerIconColor = 1;
                this.item.id = generateUUID();
                this.item.stationInfo = this.dataSource;
                this.item.cityId = _this._getCity().cityId;
                this.item.lineId = lineDatas[0].lineId;
                this.item.lineNo = lineDatas[0].lineNo;
            }

            function changeTable(){
                $("#table-map-body").children().each(function(){
                    var  orderNum=$(this).children().eq(0).text().trim();
                    if(this.newOrderNum-1){
                        if(this.orderNum == (this.newOrderNum-1)){
                            _this._insertOrderNumResort(this.item,this.newOrderNum-1);
                        }
                    }
                });
            }

            function changeUpdateStationList(){
                for(var i=0;i<updateStationList.length;i++){
                        if(updateStationList[i].stationId != this.dataSource.stationId){
                            updateStationList.push(this.dataSource);
                        }/*else{
                            var udst=updateStationList[i];
                            for(var y=0;y<udst.stopList.length;y++){
                                if(udst.stopList[y].direction==lineDatas[0].direction && udst.stopList[y].lineNo==lineDatas[0].lineNo){
                                    udst.stopList.splice(y,1);
                                }
                            }   
                        }*/
                    }
            }


        },

        _leftclick_dis_stop:function(marker, data) {
            marker.addEventListener("click", function(){
                var dialog =  "站点名称："+ data.stopName +"<br>"
                    + "下&nbsp;一&nbsp;&nbsp;站："+ data.nextStopName +"<br>"
                    + "线路名称："+ data.lineName +"<br>"
                    + "线路编号："+ data.lineNo +"<br>"
                    + "线路方向："+ data.direction +"<br>"
                    + "站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序："+ data.orderNum +"<br>"
                    + "经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度："+ data.jingdu +"<br>"
                    + "纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度："+ data.weidu +"<br>"
                    + "<input type='hidden' id='linemapId' value='" + data.linemapId + "' />"
                    + "<input type='hidden' id='sjingdu' value='" + data.sjingdu + "' />"
                    + "<input type='hidden' id='sweidu' value='" + data.sweidu + "' />"
                    +"<button class='btn btn-primary' id='btn-choose2' type='button'>选择</button>";
                var infoWindow = new BMap.InfoWindow(dialog);
                marker.openInfoWindow(infoWindow);
                $("#btn-choose2").on("click",function(){
                    var newOrderNum;
                    var item={};
                    item.stationProp=2;
                    if(updateData && updateData.length>0){
                        for(var i=0;i<updateData.length;i++){
                            if(updateData[i].markerIconColor==1){
                                newOrderNum= parseInt(updateData[i].orderNum,10)+1;
                                item.lineNo = updateData[i].lineNo;
                                item.direction = updateData[i].direction;
                                item.cityId = _this._getCity().cityId;
                                item.lineId = lineDatas[0].lineId;
                                updateData[i].markerIconColor = 0;
                            }
                        }
                    }else{
                        newOrderNum=1;
                        item.lineNo=lineDatas[0].lineNo;
                        item.direction=lineDatas[0].direction;
                        item.cityId = _this._getCity().cityId;
                        item.lineId = lineDatas[0].lineId;
                    }
                    if(newOrderNum){
                        currentPointType = 0;
                        var pointThree = new BMap.Point(data.jingdu,data.weidu);
                        var  insertMarker= new BMap.Marker(pointThree,{icon:rIcon,offset:offset});  // 创建标注
                        map.addOverlay(insertMarker);
                        markers.push(insertMarker);
                        item.orderNum = newOrderNum;
                        item.stopName = data.stopName;
                        item.jingdu=data.jingdu;
                        item.weidu= data.weidu;
                        item.sjingdu=0;
                        item.sweidu=0;
                        item.status=2;
                        item.markerIconColor = 1;
                        item.id = generateUUID();
                        item.cityId = _this._getCity().cityId;
                        item.lineId = lineDatas[0].lineId;
                        item.lineNo = lineDatas[0].lineNo;

                        if(item.orderNum==1){
                            _this._insertOrderNumResort(item,newOrderNum-1);
                        }else{
                            $("#table-map-body").children().each(function(){
                                var  orderNum=$(this).children().eq(0).text().trim();
                                if(newOrderNum-1){
                                    if(orderNum==newOrderNum-1){
                                        _this._insertOrderNumResort(item,newOrderNum-1);
                                    }
                                }
                            });
                        }
                        map.closeInfoWindow(infoWindow);

                        for (var m=0; m<sDisMarkers.length; m++) {
                            map.removeOverlay(sDisMarkers[m]);
                        }
                        sDisMarkers = [];

                    }else{
                        alert("请选择上一个站点！");
                        currentPointType = -1;
                        setTimeout(function() {
                            map.enableDoubleClickZoom();
                        }, 2000);
                    }
                });

            });
        },

        _recommand_stop_btn: function() {
            
            function GenerTable(){
                this.dataSource = [];
                this.shtml = "";
                this.connect = connect;
                this.buildtable = buildtable;
                this.bindEvent = bindEvent;
                this.stuff = stuff;
                //this.shadow = shadow;
                //this.trTipUpdate = trTipUpdate;
            }

            function connect(cityId,third,lineId){
                _this._blockUI();
                $.get(__baseUrl + '/baseData/getMappedThirdStops?cityId='+cityId+'&appName='+ third +'&lineId='+lineId,function(result){
                    _this._unblockUI();
                    var resLen = result.length;
                    if(resLen != 0){
                         _this._gaoDeStopAll(result);
                        var gby = new GenerTable();
                        gby.buildtable(resLen,result,third);
                    }else{
                        alert("无站点!");
                    }
                })
            }

            function buildtable(resLen,result,third){
                $('#a-result').html('');
                    this.shtml = "";
                    for(var i=0;i<resLen;i++){
                        var col = null;
                        var dis = null;
                        //判断是否映射上
                        if(!result[i].cllStopOrder){
                            col = 'red';
                            dis = 'none';
                        }
                        this.shtml += "<tr data-cll='"+ result[i].cllStopOrder +"' data-j='"+ result[i].jingdu +"' data-w='"+ result[i].weidu +"'>"
                              +  "<td><input type='checkbox' style='display:"+ dis +"' value='"+ i +"'></td>"
                              +  "<td style='color:"+ col +"'>"+ (result[i].orderNum == null?'':result[i].orderNum) +"</td>"
                              +  "<td>"+ result[i].stopName +"</td>"
                              +  "<td>"+ (result[i].dis2CllStop == null?'':(result[i].dis2CllStop).toFixed(2)) + "</td>"
                              +  "<td><a class='btn btn-primary shadow' data-plng='"+ result[i].pLng +"' data-plat='"+ result[i].pLat +"'>投影</a></td>"
                              +  "</tr>"
                    }

                    this.stuff(third,resLen);
            }

            function bindEvent(){

                //高德站点 -显示
                $("#a_stop_btn").on("click",function(event){
                    $("#a-result").html('');
                    if(stMarker){
                     map.removeOverlay(stMarker);
                    }
                    if(thirdMarker){
                     map.removeOverlay();
                    }
                    stMarker = null;
                    thirdMarker = null;
                    map.closeInfoWindow();
                    
                    $('#detailDialog #amap').addClass('in');
                    $('#detailDialog #amap').css({"height" : "auto"});
                    for (var i = 0; i < gMarkers.length; i++) {
                        map.removeOverlay(gMarkers[i]);
                    }
                    gMarkers = [];

                    var  gentb = new GenerTable();
                    gentb.connect(_this._getCity().cityId,'amap',g_lineId);
                    
                    return false;
                 })

                //高德站点 -隐藏
                $("#cancel_a_stop_btn").on('click',function(){
                    $('#detailDialog #amap').removeClass('in');
                    $('#detailDialog #amap').css({"height" : "0px"});
                    for (var i = 0; i < gMarkers.length; i++) {
                        map.removeOverlay(gMarkers[i]);
                    }
                    map.removeOverlay(thirdMarker);
                    map.removeOverlay(stMarker);
                    gMarkers = [];
                    $('#a-result').html('');

                    return false;
                });
            }

            function stuff(third,resLen){
                if(third == 'amap'){
                    $('#a-result').append(this.shtml);
                    $("#a-result input:checkbox").bind("click", function(e){
                        e.stopPropagation();
                    });
                    $(".gaode_Num").text('('+resLen+')');
                }else if(third == 'baidu'){
                    $('#collapseOne').append(this.shtml);
                }
                
            }

            function shadow(self){
                removeTwoMarker();
                
                var name = self.parent().parent().children().eq(2).text();
                var point = new BMap.Point(self.data('plng'), self.data('plat'));
                stMarker = new BMap.Marker(point,{icon:shadowIcon,offset:offset})
                map.addOverlay(stMarker);
                map.setCenter(point);
                
                //设置提示框
                var content = "<p>站名:"+ name +"</p>"
                            + "<p>经度:"+ self.data('plng') +"</p>"
                            + "<p>纬度:"+ self.data('plat') +"</p>"
                var infoWindow = new BMap.InfoWindow(content);
                stMarker.addEventListener('click',function(){
                    stMarker.openInfoWindow(infoWindow); 
                })
                stMarker.openInfoWindow(infoWindow);
                
                return false;
            }

            function trTipUpdate(self){
                removeTwoMarker();
                
                var cll = self.data('cll');
                var name = self.children().eq(2).text();
                var jdu = self.data('j');
                var wdu = self.data('w');
                var point = new BMap.Point(jdu, wdu);
                thirdMarker = new BMap.Marker(point)
                map.addOverlay(thirdMarker);
                map.setCenter(point);
                
               //设置提示框
                var content = "<p>站名:"+ name +"</p>"
                            + "<p>经度:"+ jdu +"</p>"
                            + "<p>纬度:"+ wdu +"</p>"
                            + "<a class='btn btn-primary "+ (cll == null?'hide':'show')+"' id='updstop' style='width:60px'>替换</a>"
                var infoWindow = new BMap.InfoWindow(content);
                thirdMarker.addEventListener('click',function(){
                    thirdMarker.openInfoWindow(infoWindow); 
                })
                
                thirdMarker.openInfoWindow(infoWindow);
                
                //给绑定事件
                setTimeout(function(){
                    $("#updstop").click(function(){
                        var op = {
                            name:name,
                            jingdu: jdu,
                            weidu:wdu,
                            order:cll
                        }

                        //修改站点
                        _this._reviseStopData(op);
                        removeTwoMarker();
                        map.closeInfoWindow();
                    })
                },200);
            }

            function removeTwoMarker(){
                map.removeOverlay(stMarker);
                map.removeOverlay(thirdMarker);
                stMarker = null;
                thirdMarker = null;
            }

            var gtable = new GenerTable();
            gtable.bindEvent();

            $("#a-result").on('click','.shadow',function(){
                shadow($(this));
            })
            
            $("#a-result").on("click", 'tr', function(event){
                trTipUpdate($(this));
            });

            /*$("#r-result").on('click','.shadow',function(){
                shadow($(this));
                return false;
            })
            
            $("#r-result").on("click", 'tr', function(event){
                trTipUpdate($(this));
                return false;
            });*/
            //百度站点 
            $("#recommand_stop_btn").on("click",function(event){
                if ($('#recommand_stopname').val().trim() == "") {
                    alert("请输入站点名称。");
                    return false;
                }
                if (local) {
                    local.clearResults();
                }
                _this._blockUI();
                var options = {
                        renderOptions: {map: map, panel: "r-result"},
                        onResultsHtmlSet: function() {
                            _this._unblockUI();
                            $('#r-result').children().css({'border' : "none"});
                            $('#r-result li a').hide();
                            $("#cancel_recommand_stop_btn").on("click", function (e) {
                                $('#detailDialog #collapseOne').removeClass('in');
                                $('#detailDialog #collapseOne').css({"height" : "0px"});
                                local.clearResults();
                                return false;
                            });
                            $('#detailDialog #collapseOne').addClass('in');
                            $('#detailDialog #collapseOne').css({"height" : "auto"});
                        }
                };
                local = new BMap.LocalSearch(map, options);
                local.search($('#recommand_stopname').val() + "-公交");
                return false;
            });
            
            

        },
        
        _gaoDeStopAll:function(connectResult){
            $("#showGaoDeAll").on('click',function(){
                var gdstop = new GaoDeStop();
                gdstop.showStop();
            })
            $("#hideGaoDeAll").on('click',function(){
                var gdstop = new GaoDeStop();
                gdstop.hideStop();
            })
            $("#updateGaoDeSelect").on('click',function(){
                var checkTr = $("#a-result :checked");
                for(var i=0;i<checkTr.length;i++){
                    var op = {
                            name:connectResult[checkTr.eq(i).val()].stopName,
                            jingdu: connectResult[checkTr.eq(i).val()].jingdu,
                            weidu:connectResult[checkTr.eq(i).val()].weidu,
                            order:connectResult[checkTr.eq(i).val()].cllStopOrder
                        }

                    //修改站点
                    _this._reviseStopData(op);
                        
                }
                var gtp = new GaoDeStop();
                gtp.removeMarker();
                map.closeInfoWindow();
                
            })
            
            function GaoDeStop(){
                this.dataSource = connectResult;
                this.showStop = showStop;
                this.hideStop = hideStop;
                this.removeMarker = removeMarker;
                this.drawMarker = drawMarker;
                this.addInfoWindow = addInfoWindow;
                this.openFirstWindow = openFirstWindow;
                //this.stopReplace = stopReplace;
            }
            
            function showStop(){
                if(this.dataSource){
                    this.removeMarker();
                    this.drawMarker();
                    this.openFirstWindow();
                }
            }
            
            function drawMarker(){
                //gaodeAllStopMarkers
                var date = this.dataSource;
                for(var i=0;i<date.length;i++){
                    var point = new BMap.Point(date[i].jingdu, date[i].weidu);
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker); 
                    gaodeAllStopMarkers.push(marker);
                    this.addInfoWindow(date[i],marker);
                }
                
            }
            
            function removeMarker(){
                if(stMarker != null){
                    map.removeOverlay(stMarker);
                    stMarker = null;
                }
                if(thirdMarker != null){
                    map.removeOverlay(thirdMarker);
                    thirdMarker = null;
                }
                for(var i=0;i<gaodeAllStopMarkers.length;i++){
                    map.removeOverlay(gaodeAllStopMarkers[i]);
                }
                gaodeAllStopMarkers = [];
            }
            
            function hideStop(){
                if(gaodeAllStopMarkers){
                    for(var i=0;i<gaodeAllStopMarkers.length;i++){
                        map.removeOverlay(gaodeAllStopMarkers[i]);
                    }
                    gaodeAllStopMarkers = [];
                }
                this.removeMarker();
            }
            
            function addInfoWindow(data,marker){
                var content = "<p>站名:"+ data.stopName +"</p>"
                            + "<p>经度:"+ data.jingdu +"</p>"
                            + "<p>纬度:"+ data.weidu +"</p>"
                            + "<a class='btn btn-primary "+ (data.cllStopOrder == null?'hide':'show')+"' id='updstop' style='width:60px'>替换</a>"
                var infoWindow = new BMap.InfoWindow(content);
                
                marker.addEventListener('click',function(){
                    marker.openInfoWindow(infoWindow);
                    
                    setTimeout(function(){
                        $("#updstop").click(function(){
                            var op = {
                                name:data.stopName,
                                jingdu: data.jingdu,
                                weidu:data.weidu,
                                order:data.cllStopOrder
                            }

                            //修改站点
                            _this._reviseStopData(op);
                            
                            var gtp = new GaoDeStop();
                            gtp.removeMarker();
                            map.closeInfoWindow();
                        })
                    },200);
                })
            }
            
            function openFirstWindow(){
                if(gaodeAllStopMarkers){
                    $(gaodeAllStopMarkers[0].K).click();
                }
            }
            
        },
        
        _reviseStopData:function(op){
            function ResviStop(){
                this.dataSource = op;
                this.stationId = null;
                this.afterModifyPhy = null;
                this.modifyUpdateData = modifyUpdateData;
                this.modifyUpdataStationList = modifyUpdataStationList;
                this.modifyStationInfo = modifyStationInfo;
                this.modifyStopList = modifyStopList;
                this.bimStopList = bimStopList;
                this.repaint = repaint;
                this.judgeProp = judgeProp;
                this.notNullUndefined = notNullUndefined;
                //this.find = find;
            }

            function judgeProp(){
                return updateData[this.dataSource.order-1].stationProp;
            }

            function notNullUndefined(data){
                if(data != null && data != undefined){
                    return true;
                }else{
                    return false;
                }
            }
            
            function modifyUpdateData(){
                var data = updateData[this.dataSource.order-1];
                this.stationId = data.stationId;

                data.stopName = this.dataSource.name;
                data.jingdu = this.dataSource.jingdu;
                data.weidu = this.dataSource.weidu;
                this.modifyStationInfo(data);
                this.afterModifyPhy = data.stationInfo;
            }
            
            /**
             * 修改物理站信息以及物理站包含的逻辑站信息
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            function modifyStationInfo(data){
                //真实物理
                if(this.judgeProp() == 0){
                    //修改物理站与全部关联逻辑站信息
                    data.stationInfo.stationName = this.dataSource.name;
                    data.stationInfo.lng = this.dataSource.jingdu;
                    data.stationInfo.lat = this.dataSource.weidu;

                    //修改物理站中的逻辑站
                    this.modifyStopList(data.stationInfo,'0');
                    
                }else if(this.judgeProp() == 1 && changeView){
                    //逻辑站
                    //修改物理站中的这个逻辑站信息
                    this.modifyStopList(data.stationInfo,'2');

                }else if(this.judgeProp() == 1 && !changeView){
                    //虚拟物理，修改物理站信息与这条线路对应站点信息
                    data.stationInfo.stationName = this.dataSource.name;
                    data.stationInfo.lng = this.dataSource.jingdu;
                    data.stationInfo.lat = this.dataSource.weidu;

                    //修改物理站中的逻辑站
                    this.modifyStopList(data.stationInfo,'1');
                }
            }
            
            /**
             * 修改物理站中的逻辑站
             * flag=0:修改所有逻辑站
             * flag=1:修改这条线路的逻辑站
             * flag=2:修改
             * @param  {[type]} stInfo [description]
             * @param  {[type]} flag   [description]
             * @return {[type]}        [description]
             */
            function modifyStopList(stInfo,flag){
                var stInfoStopList = stInfo.stopList;
                if(flag == '0'){
                    for(var i=0;i<stInfoStopList.length;i++){
                        this.bimStopList(stInfoStopList[i]);
                    }
                }else if(flag == '2'){
                    for(var i=0;i<stInfoStopList.length;i++){
                        if(stInfoStopList[i].lineNo == lineDatas[0].lineNo && stInfoStopList[i].direction == lineDatas[0].direction){
                            this.bimStopList(stInfoStopList[i]);
                        }
                    }
                }else if(flag == '1'){
                     for(var i=0;i<stInfoStopList.length;i++){
                        if(stInfoStopList[i].lineNo == lineDatas[0].lineNo && stInfoStopList[i].direction == lineDatas[0].direction){
                           this.bimStopList(stInfoStopList[i]);
                        }
                    }
                }
            }

            function modifyUpdataStationList(){
                for(var i=0;i<updateStationList.length;i++){
                    if(updateStationList[i].stationId == this.stationId){
                        updateStationList[i] = this.afterModifyPhy;
                    }
                }
            }

            function bimStopList(sstopList){
                if(this.notNullUndefined(sstopList.stopName)){
                    sstopList.stopName = this.dataSource.name;
                }
                if(this.notNullUndefined(sstopList.jingdu)){
                    sstopList.jingdu = this.dataSource.jingdu;
                }
                if(this.notNullUndefined(sstopList.weidu)){
                    sstopList.weidu = this.dataSource.weidu;
                }
            }

            function repaint(){
                for (var i=0; i<markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }
                markers=[];
                
                _this._renderTable();
                var points=[];
                for(var i=0;i<updateData.length;i++){
                    _this._markerMap(updateData[i],points);
                }
                _this._bindStopMarkerEvent();
                _this._drawLine(points);
            }
            
            var pomy =new ResviStop();
            pomy.modifyUpdateData();
            pomy.modifyUpdataStationList();
            pomy.repaint();
        },

        _editableMode: function() {
            $(document).on('click', "#myTab li:not('.active') a[href='#trajectory']", function(){
                //加脊线圈
                for (var i = 0; i < traMarkers.length; i++) {
                        map.addOverlay(traMarkers[i]);
                }
            });
            $(document).on('click', "#myTab li:not('.active') a[href!='#trajectory']", function(){
                //清除脊线圈
                for (var i = 0; i < traMarkers.length; i++) {
                    map.removeOverlay(traMarkers[i]);
                }
            });
            $(document).on('click', "#myTab li:not('.active') a[href!='#stops']", function(){
                map.removeEventListener("click", _this._showInfo);  
            });
            $(document).on('click', "#myTab li:not('.active') a[href ='#stops']", function(){
                $("#pickup").attr("disabled", false); 
            });
        },

        _save_btn: function() {
            $('#btn-draft').on('click', function() {
                confirm("确定保存当前的数据？", function() {
                    sendData("0");
                });
            });
            $('#btn-save').on('click', function() {
                confirm("确定保存当前的数据？", function() {
                    sendData("1");
                });
            })

            function sendData(status) {
                //校验
                if (!$("#lineInfo").webform('validate')) {
                    alert('线路信息填写格式有误.');
                    return false;
                }

                //原来的线路状态
                var lineStatus = lineDatas[0].status;
                var clineStatus = $('#lineInfo #status').val();
                var clineStatusText = $('#lineInfo #status').find("option:selected").text();
                //线路信息
                var line = {};
                line.lineId = lineDatas[0].lineId;
                line.id = lineDatas[0].id;
                line.cityId = _this._getCity().cityId;
                line.lineNo = $('#lineInfo input[name=lineNo]').val();
                line.lineName = $('#lineInfo input[name=lineName]').val();
                line.direction = $('#lineInfo input[name=direction]').val();
                line.firstTime = $('#lineInfo input[name=firstTime]').val();
                line.lastTime = $('#lineInfo input[name=lastTime]').val();
                line.status = clineStatus;
                line.stopsNum = 0;

                //过滤特殊字符
                line.lineName = _replaceBrackets(line.lineName.trim());
                if (clineStatus !== '0') {
                    line.lineName = line.lineName + '(' + clineStatusText + ')';
                    status = 0;
                }

                //站点信息
                var stop, newItem, stops = [];
                for (var i = 0; i < updateData.length; i++) {
                    newItem = {};
                    stop = updateData[i];
                    newItem.linemapId = stop.linemapId;
                    newItem.cityId = _this._getCity().cityId;
                    newItem.lineId = line.lineId;
                    newItem.lineNo = line.lineNo;
                    newItem.direction = parseInt($('#lineInfo input[name=direction]').val(),10);
                    newItem.orderNum = stop.orderNum;
                    newItem.stopName = stop.stopName;
                    newItem.jingdu = stop.jingdu;
                    newItem.weidu = stop.weidu;
                    newItem.sjingdu = (stop.sjingdu?stop.sjingdu:0);
                    newItem.stationId=stop.stationId+"";
                    newItem.sweidu = (stop.sweidu?stop.sweidu:0);
                    stops.push(newItem);
                }
                //脊线信息
                var tra, traItem, tras = [];
                for (var i = 0; i < jxData.length; i++) {
                    traItem = {}
                    tra = jxData[i];
                    traItem.traId = tra.traId;
                    traItem.cityId = _this._getCity().cityId;
                    traItem.lineId = line.lineId;
                    traItem.lineNo = line.lineNo;
                    traItem.direction = $('#lineInfo input[name=direction]').val();
                    traItem.orderNum = tra.order;
                    traItem.jingdu = tra.jingdu;
                    traItem.weidu = tra.weidu;
                    traItem.sjingdu = tra.sjingdu;
                    traItem.sweidu = tra.sweidu;
                    tras.push(traItem);
                }

                var o = {};
                o.line = line;
                o.maplist = stops;
                o.tralist = tras;

                //重载物理站
                var newStationList = [];
                if(updateStationList && updateStationList.length){
                    for(var i=0;i<updateStationList.length;i++){
                        var udStation = updateStationList[i];
                        var newStation = {};
                        newStation.cityId = udStation.cityId ;
                        newStation.isVirtual = udStation.isVirtual ;
                        newStation.lat = udStation.lat ;
                        newStation.lng = udStation.lng ;
                        newStation.slat = udStation.slat ;
                        newStation.slng = udStation.slng ;
                        newStation.stationId = udStation.stationId ;
                        newStation.stationName = udStation.stationName ;
                        newStation.stopExtend = (udStation.stopExtend?udStation.stopExtend:null) ;
                        newStation.stopList = [];
                        for(var y=0;y<udStation.stopList.length;y++){
                            var udStopList = udStation.stopList[y];
                            var sStopList = {};
                            sStopList.linemapId = udStopList.linemapId;
                            sStopList.lineNo = udStopList.lineNo ;
                            sStopList.direction = udStopList.direction ;
                            sStopList.orderNum = udStopList.orderNum;
                            sStopList.stopName = udStopList.stopName;
                            sStopList.jingdu = udStopList.jingdu;
                            sStopList.weidu = udStopList.weidu;
                            sStopList.sjingdu = udStopList.sjingdu;
                            sStopList.sweidu = udStopList.sweidu;
                            sStopList.stationId = udStopList.stationId;
                            sStopList.lineName = udStopList.lineName;
                            sStopList.nextStopName = udStopList.nextStopName ;
                            newStation.stopList.push(sStopList);
                        }
                        newStationList.push(newStation);
                    }
                }
                
                
                o.stationList = (newStationList.length ? newStationList : updateStationList);

                //如果没有票价信息，则不传lineExtend字段
                var simplePrice = $('#lineExtInfo input[name=simplePrice]').val() || '';
                var fullPrice = $('#lineExtInfo textarea[name=fullPrice]').val() || '';
                var crossCity = $('#lineExtInfo select[name=crossCity]').val();
                if (crossCity) {
                	crossCity = crossCity + ',' + _this._getCity().cityId;
                	_this._crossCityMapping();
                } else {
                	crossCity = '';
                }
                var oneBus = $('#lineExtInfo input[name=oneBus]').val();
                oneBus = (oneBus === undefined || oneBus === null) ? '' : oneBus;
                if ((simplePrice && simplePrice.trim()) || (fullPrice && fullPrice.replace(/\n/g, '').trim())
                		|| (crossCity && crossCity.trim()) || (oneBus && oneBus.trim())) {
                    simplePrice = simplePrice.trim().replace(/\-/g, '~').replace(/－/g, '~').replace(/～/g, '~');
                    fullPrice = fullPrice.replace(/\n/g, '').trim().replace(/\-/g, '~').replace(/－/g, '~').replace(/～/g, '~');
                    oneBus = oneBus.trim();
                    
                    var lineExt = {};
                    lineExt.eInfo = "{\"simplePrice\":\"" + simplePrice + "\",\"fullPrice\":\"" + fullPrice + "\","
                    			   + "\"crossCity\":\"" + crossCity + "\",\"oneBus\":\"" + oneBus + "\"}";
                    lineExt.cityId = _this._getCity().cityId;
                    lineExt.type = 0;
                    lineExt.relationId = line.lineId;
                    if (result_bak.lineExtend && result_bak.lineExtend.eId) {
                        lineExt.eId = result_bak.lineExtend.eId;
                    }
                    o.lineExtend = lineExt;
                }

                o = {
                        cityId: _this._getCity().cityId,
                        status: status,
                        json: JSON.stringify(o)
                }
                $.postLock(__baseUrl + '/baseData/saveWithStation', o, function(result) {
                    if (result._exception === true) {
                        alert("<p style='color:red'>保存失败!</p><div class='panel panel-default'><div class='panel-heading'>原因:</div><div class='panel-body'>" + result.message +"</div><div>", "fail");
                    } else {
                        var data = result.data;
                        var message = (data.errMsg ? data.errMsg : "") + (data.warningMsg ? data.warningMsg : "");
                        if (result.status == 'FAIL') {
                            alert("<p style='color:red'>保存失败!</p><div class='panel panel-default'><div class='panel-heading'>原因:</div><div class='panel-body'>" + message+"</div><div>", "fail");
                        } else {
                            if (message) {
                                message = "保存成功!<div class='panel panel-default'><div class='panel-heading'>注意:</div><div class='panel-body'>"+message+"</div></div>";

                            } else {
                                message = "保存成功!<div class='panel panel-default'><div class='panel-heading'>注意:</div><div class='panel-body'>"+message+"</div></div>";
                            }
                            
                            //进来时页面时脊线点的数目和站点数相同，保存时脊线点数目有变化
                            if(result_bak && result_bak.tralist && result_bak.tralist.length == result_bak.maplist.length && result_bak.tralist.length !=tras.length){
                                _this._showAppMapping(true, _this._getCity().cityId, g_lineId);//tras && tras.length  
                            }
                            
                            _this._resetLine();
                            //是否有站点增减
                            var result_errmsg = result.errmsg;
                            
                           
                            //如果下线/停运或由下线/停运改为正常，则查询是否有反向线路，有的话反向也下线/停运或正常
                            if ( clineStatus !== '0' || (clineStatus === '0' && lineStatus !== 0)) {
                                var o = {
                                        cityId: _this._getCity().cityId,
                                        lineNo: $('#lineInfo #lineNo').val(),
                                        direction: $('#lineInfo #direction').val() == "0" ? "1" : "0"
                                }
                                $.get(__baseUrl + '/baseData/queryline', o, function(result) {
                                    if (result._exception === true) {
                                        alert(result.message, "fail");
                                    } else {
                                        if (result.status == 'FAIL') {
                                            alert(message, "success", null, function() {
                                                _this._showAppMapping(result_errmsg, _this._getCity().cityId, g_lineId);
                                            }, false);
                                        } else {
                                            if (result.data && result.data.line) {
                                                var lineName = result.data.line.lineName;
                                                if (lineName.indexOf('(已停运)') >= 0) {
                                                    lineName = lineName.replace('(已停运)', '');
                                                } else if (lineName.indexOf('(已下线)') >= 0) {
                                                    lineName = lineName.replace('(已下线)', '');
                                                }
                                                result.data.line.status = clineStatus;
                                                if (clineStatus !== '0') {
                                                    result.data.line.lineName = lineName + '(' + clineStatusText + ')';
                                                } else {
                                                	result.data.line.lineName = lineName;
                                                }
                                                $.postLock(__baseUrl + '/baseData/saveWithStation', {
                                                    cityId: _this._getCity().cityId,
                                                    status: '0',
                                                    json: JSON.stringify(result.data)
                                                }, function(result) {
                                                    if (result._exception === true) {
                                                        alert("当前方向保存成功，但反向线路 上线/下线/停运 失败！！！！！！！！！！！！\n" + result.message, "fail");
                                                    } else {
                                                        var data = result.data;
                                                        var message1 = (data.errMsg ? data.errMsg : "") + (data.warningMsg ? data.warningMsg : "");
                                                        if (result.status == 'FAIL') {
                                                            alert("当前方向保存成功，但反向线路  上线/下线/停运 失败！！！！！！！！！！！！\n" + message1, "fail");
                                                        } else {
                                                            alert(message, "success", null, function() {
                                                                _this._showAppMapping(result_errmsg, _this._getCity().cityId, g_lineId);
                                                            }, false);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                alert(message, "success", null, function() {
                                    _this._showAppMapping(result_errmsg, _this._getCity().cityId, g_lineId);
                                }, false);
                            }
                        }
                    }
                });
            }
        },

        _showAppMapping: function(hasChange, cityId, lineId) {
        	if (hasChange || isReverse) {
        		//查询是否有第三方
        		$.get(__baseUrl + '/app/list', {
                    cityId: cityId,
                    status: '0'
                }, function(result){
                	if (!result || result.length === 0) {
                		alert('没有对应的第三方');
                		return;
                	}
                	currentLineId = lineId;
                	mapping_cityId = cityId;
                    $('#appNameRadios').empty();
                    for(var i = 0; result && i < result.length; i++) {
                        var record = result[i];
                        $('#appNameRadios').append('<div class="radio radio-inline" style="margin-top:0;">'
                                + '<input name="appName" type="radio" value="' + record.appId + '" id="appName' + record.appName + '">'
                                + '<label for="appName' + record.appName + '">' + record.appName + '</label>'
                                + '</div>');
                    }
                    $('#appNameRadios input:first').prop('checked', true);
                    $('input[name=appName]').click(function() {
                        var obj = {
                                cityId: cityId,
                                appName: $(this).val(),
                                lineId: currentLineId
                        }
                        $.get(__baseUrl + '/app/line-mapping', obj, function(result){
                            if (result._exception === true) {
                                alert('系统忙，请稍候再试');
                                return;
                            } else {
                                loadLayerData(result);
                            }
                        });
                    });
                    //有，则需要维护映射关系
                    if ($('input[name=appName]').val() !== undefined
                            && $('input[name=appName]').val() !== null && $('input[name=appName]').val() !== '') {
                    	isReverse = false;
                    	$.blockUI({
                            title:'请稍等', 
                            timeout: 60000,
                            message:'<i class="fa fa-spinner fa-pulse fa-3x" style="margin-top: 20px;"></i><p style="margin: 10px 0;">正在查询第三方映射关系...</p>',
                            baseZ:3000,
                            css: {
                                 border: 'none',
                                 width: '20%',
                                 left:    '40%'
                             }
                         }); 
                       var obj = {
                               cityId: cityId,
                               appName: $('input[name=appName]:checked').val(),
                               lineId: currentLineId
                       }
                       $.read(__baseUrl + '/app/line-mapping', obj, function(result){
                           if (result._exception === true) {
                               alert('系统忙，请稍候再试');
                               return;
                           } else {
                               $('#detail').modal('show');
                               loadLayerData(result);
                           }
                       });
                    }
                });
        	}
        },
        
        _crossCityMapping: function() {
        	$('#detail').on('hidden.bs.modal',function(){
        		$('#detail').off('hidden.bs.modal');
        		var crossCityId = $('#lineExtInfo select[name=crossCity]').val();
    			var crossCityText = $.codemap['cityCn'][crossCityId];
    			var cityText = $.codemap['cityCn'][_this._getCity().cityId];
    			var lineNo = lineDatas[0].lineNo;
    			var direction = lineDatas[0].direction;
    			if (crossCityId) {
    				//是跨城线路，则要维护另外一个城市的这条线路
    				alert('这条线路是跨城线路(' + cityText + '-' + crossCityText + ')，请维护 ' + crossCityText + ' 对应线路的映射关系.', 'success', 0, function() {
    					$.get(__baseUrl + '/baseData/detail', {cityId: crossCityId, lineNo: lineNo, direction: direction}, function(result) {
    						if (result._exception === true) {
    		                    alert(result.message);
    		                } else {
    		                    if (result.status == 'FAIL') {
    		                        alert(result.errmsg);
    		                    } else {
    		                    	var lineInfo = result.data.line;
    		                    	if (lineInfo.cityId && lineInfo.lineId) {
    		                    		$('#detail').modal('show');
    		                    		_this._showAppMapping(true, lineInfo.cityId, lineInfo.lineId);
    		                    	} else {
    		                    		alert(crossCityText + ' 不存在编号为 ' + lineNo + ', 方向为 ' + direction + ' 的线路');
    		                    	}
    		                    }
    		                }
    					});
    				}, false);
    			}
			});
        },

        _autoComplete: function() {
            $('#detailDialog #dm_navbar #cityId').change(function() {
                _this._save_disabled();

                var lineName = "";
                var o = {
                        pageNo: 1,
                        pageSize: 10000,
                        cityId: _this._getCity().cityId,
                        lineName: lineName,
                        direction: 0
                }
                $.read(__baseUrl + '/baseData/pager', o, function(result) {
                    if (result._exception === true) {
                        alert(result.message);
                        $('#lineSelector').html('');
                    } else {
                        var html = "", item;
                        for (var i = 0; i < result.content.length; i++) {
                            item = result.content[i];
                            html += "<option value='" + item.lineId + "'>" + item.lineName + "</option>"
                        }
                        $('#lineSelector').html(html);
                    }
                });
            });
            $('#dm_navbar #lineSelector').change(function() {
                my_distance_flag=false;
                _this._removePointsObjectLay();
                _this._paramInit();

                g_lineId = $("#dm_navbar #lineSelector").val();
                isReverse = false;
                _this._resetGlobal();
            });
        },
        
        _removePointsObjectLay:function(){
            $.each(pointsObject.allPointsMarker,function(i,ele){
                map.removeOverlay(ele);
            });
            $.each(pointsObject.allPointsPolyline,function(i,ele){
                map.removeOverlay(ele);
            });
        },

        _showPoint: function() {
            $('#show-point').on('click', function() {
                if (coords) {
                    map.removeOverlay(coords); 
                }
                var text = $('#route_point').val();
                if (text.trim() == "") {
                    alert("请输入站点坐标");
                    return;
                }
                text = text.replace("，", ",").split(",");
                if (text.length != 2) {
                    alert("坐标格式不正确");
                    return;
                }
                var point = new BMap.Point(text[0], text[1]);
                coords = new BMap.Marker(point);
                map.addOverlay(coords); 
                coords.setAnimation(BMAP_ANIMATION_BOUNCE);
                map.setCenter(point);
            });
            $('#clear-point').on('click', function() {
                map.removeOverlay(coords); 
            });

            //度分秒转换
            var lnglat=[],lnglatPints=[],lnglatPints_flag=false;
            $("#show-lnglat-convert").on({
                'click':function(){
                    var $lng_du=$("#lng_du"),$lng_fen=$("#lng_fen"),$lng_miao=$("#lng_miao");
                    var $lat_du=$("#lat_du"),$lat_fen=$("#lat_fen"),$lat_miao=$("#lat_miao");
                    if($lng_du.val()!='' || $lat_du.val()!=''){
                        var originalLng=$lng_du.val()*1+($lng_fen.val())/60*1+($lng_miao.val())/3600*1;
                        var originalLat=$lat_du.val()*1+($lat_fen.val())/60*1+($lat_miao.val())/3600*1;
                        var retPoint=wgs2bd(originalLng,originalLat);//转百度坐标
                        var point = new BMap.Point(retPoint.lng,retPoint.lat);
                        var coords = new BMap.Marker(point);
                        $.each(lnglatPints,function(i,ele){
                            if(ele.equals(point)){
                                lnglatPints_flag=true;
                            }else{
                                lnglatPints_flag=false;
                            }
                        })
                        if(lnglatPints_flag){
                            alert("相同点不可重复打!");
                        }else{
                            lnglat.push(coords);
                            lnglatPints.push(point);
                            var opts = {
                                      width : 200,     // 信息窗口宽度
                                      height: 50     // 信息窗口高度
                                }
                            coords.addEventListener("click",function(){
                                var p = coords.getPosition(); 
                                var infoWindow = new BMap.InfoWindow("经度:"+(p.lng).toFixed(9)+"<br>纬度:"+(p.lat).toFixed(9), opts);  // 创建信息窗口对象 
                                map.openInfoWindow(infoWindow,point);
                            });
                            map.addOverlay(coords); 
                            map.setCenter(point);
                        }
                    }else {
                        alert("还未填写经纬度!");
                    }

                }
            })
            $("#clear-lnglat-convert").on({
                'click':function(){
                    $.each(lnglat,function(i,ele){
                        map.removeOverlay(ele); 
                    })
                    lnglat=[],lnglatPints=[],lnglatPints_flag=false;
                }
            })

            //站点数据采集
            var collecMarkers = [];
            $('#collec-show').on('click',function(){
                if(collecMarkers.length){
                    for(var k=0;k<collecMarkers.length;k++){
                        map.removeOverlay(collecMarkers[k]);
                    }
                    collecMarkers = [];
                }
                $('#collec-result').html('');
                $.postLock(__baseUrl + '/baseData/getRtStopsImg',
                    {cityId: _this._getCity().cityId,
                     lineId:g_lineId},
                     function(result){
                        if(result.length){
                            var shtml = "";
                            for(var i=0;i<result.length;i++){
                                shtml += "<tr>"
                                      +  "<td>"+ result[i].orderNum +"</td>"
                                      +  "<td>"+ result[i].stopName +"</td>"
                                      +  "<td><a class='btn btn-primary seeImg'>查看图片</a></td>"
                                      +  "</tr>"
                            }
                            $('#collec-result').html(shtml);
                            $("#collec-result tr").map(function(index,element){
                                $(this).data("record",result[index].rtBusStopImgList);
                            })

                            //给每行绑定数据
                            $("#collec-result").on('click','tr',function(){
                                if(collecMarkers.length){
                                    for(var k=0;k<collecMarkers.length;k++){
                                        map.removeOverlay(collecMarkers[k]);
                                    }
                                    collecMarkers = [];
                                }
                                var rsx = $(this).data("record");
                                var coll_points = [];
                                if(rsx && rsx.length){
                                    for(var k=0;k<rsx.length;k++){
                                        var coll_point = new BMap.Point(rsx[k].lng,rsx[k].lat);
                                        coll_points.push(coll_point);
                                        var marker = new BMap.Marker(coll_point); 
                                        map.addOverlay(marker);
                                        collecMarkers.push(marker);

                                        var label = new BMap.Label(k+1);
                                        label.setStyle({
                                            backgroundColor:'black',
                                            color:'white'
                                        })
                                        label.setOffset(new BMap.Size(4, 3))
                                        marker.setLabel(label);
                                    }
                                }
                                map.setViewport(coll_points);

                            })
                            $('#detailDialog #collectionData').addClass('in');
                            $('#detailDialog #collectionData').css({"height" : "auto"});
                        }else{
                            alert("无数据!");
                        }
                })
            })
            $('#collec-hide').on('click',function(){
                if(collecMarkers.length){
                    for(var k=0;k<collecMarkers.length;k++){
                        map.removeOverlay(collecMarkers[k]);
                    }
                    collecMarkers = [];
                }
                $('#collec-result').html(''); 
                $('#detailDialog #collectionData').addClass('in');
                $('#detailDialog #collectionData').css({"height" : "0"});
            })

            $("#collec-result").on('click','.seeImg',function(){
                if(collecMarkers.length){
                    for(var k=0;k<collecMarkers.length;k++){
                        map.removeOverlay(collecMarkers[k]);
                    }
                    collecMarkers = [];
                }
                $(".imgArea ul").html("");
                var imgHtml = "";
                var record = $(this).closest("tr").data("record");
                for(var i=0;i<record.length;i++){
                    imgHtml += "<li><span class='badge' style='margin-left:40%;position: absolute;'>"+ (i+1) +"</span><a  href='"+ (record[i].sourceType == 3?(record[i].img):('/universe/car2' + record[i].img)) +"' class='imagebox' rel='[gall1]'><img style='width:120px' src="+ (record[i].sourceType == 3?(record[i].img+'@120w_120h'):('/universe/car2' + record[i].img)) +"></a></li>"
                }
                $(".imgArea ul").append(imgHtml);
                $('a[rel]').foxibox();
                $('#collectionImgList').modal('show');
                //return false;
            })

        },

        _stopNameAutoComplete: function() {
            $('#recommand_stopname').click(function() {
                var spanhtml = '<span class="autocomplete_label">';
                if (updateData && updateData.length > 0) {
                    var stopNames = [];
                    for (var i = 0; i < updateData.length; i++) {
                        stopNames.push(spanhtml + updateData[i].orderNum + '</span>' + updateData[i].stopName);
                    }
                    $('#recommand_stopname').autocomplete({
                        source: stopNames,
                        delay: 0,
                        minLength: 0,
                        response: function(e, content) {
                            var items = content.content;
                            for (var i = 0; i < items.length; i++) {
                                var value = items[i].value.split('>');
                                items[i].value = value[value.length - 1];
                            }
                        },
                        select: function(e, item) {

                            var stop = item.item;
                            var stopName = stop.value;
                            var orderNum = stop.label.replace(spanhtml, '').replace('</span>', '').replace(stopName, '');
                            for (var i = 0; i < updateData.length; i++) {
                                if (updateData[i].orderNum == orderNum && updateData[i].stopName == stopName) {
                                    var point = new BMap.Point(updateData[i].jingdu, updateData[i].weidu);
                                    map.setCenter(point);
                                    
                                    //多了这两次请求
                                    var cityText = $('#detailDialog #cityId').find("option:selected").text();
                                    cityText = getSelectText(cityText);
                                    var station = new AMap.StationSearch({
                                        pageIndex: 1,
                                        pageSize: 100,
                                        city: cityText.replace('test', '')
                                    });
                                    
                                    if(updateData[i].stationProp==0 || (updateData[i].stationProp==1 && !changeView)){
                                        markers[i].setIcon(rIcon_two_six);
                                    }else{
                                        markers[i].setIcon(rIcon_two);
                                    }

                                    updateData[i].markerIconColor = 1;
                                    
                                } else {
                                    if(updateData[i].stationProp==0){
                                        markers[i].setIcon(phy_shi);
                                    }else{
                                        if(changeView){
                                            markers[i].setIcon(rIcon);
                                        }else{
                                            if(updateData[i].stationInfo.stopList && updateData[i].stationInfo.stopList.length>1){
                                                markers[i].setIcon(phy_xu);
                                            }else{
                                                markers[i].setIcon(virOnlyOne);
                                            }
                                        }
                                    }
                                }
                            }


                            //高亮高德站点行
                            if($("#a-result").html() != "" && $("#a-result").html() != " " && $("#a-result").html() != '' && $("#a-result").html() != ' '){
                                $("#a-result tr").each(function(){
                                    if($(this).find("td").eq(1).text() == stopName){
                                        $(this).addClass("trselected")
                                               .siblings().removeClass("trselected");
                                    }
                                })
                            }
                            
                        }
                    });
                    $('#recommand_stopname').keydown();
                } else {
                    $('#recommand_stopname').autocomplete({
                        source: [],
                        delay: 0,
                        minLength: 0
                    });
                }
            });
        },

        _blockUI: function() {
            $.blockUI({
                title:'请稍等', 
                timeout: 0,
                message:'<i class="fa fa-spinner fa-pulse fa-3x" style="margin-top: 20px;"></i><p style="margin: 10px 0;">正在处理...</p>',
                baseZ:3000,
                css: {
                     border: 'none',
                     width: '20%',
                     left:    '40%'
                 }
         }); 
        },

        _unblockUI: function() {
            $.unblockUI(); 
        },

        reset: function() {
            $('#container').empty();
            $('#lineInfo').webform('clear');
            $('#table-map-body').empty();
            $('#jx-tbody').empty();
            $('.gpsdate .cars').empty();
            $('#r-result').empty();
            $('#detailDialog input[type=text]').val('');
            $('#detailDialog .datepicker').val(today);
            $('#detailDialog .datepicker').datepicker('update');
            $('#detailDialog #route_point').val('');
            $('#lineAccordion .panel-collapse').addClass('in').css({'height' : 'auto'});
            $('#trajectory .panel-collapse').addClass('in').css({'height' : 'auto'});
            $('#accordion .panel-collapse').removeClass('in').css({'height' : '0px'});
            _this._set_tab_view("tabs", 0);
        },

        _bindEvent:function(){
            if (isBind) return;
            isBind = true;
            //拖拽
            _this._drager();
            _this._mapBack();
            _this._jxReset();
            _this._jxReverse();
            _this._jxExchange();
            _this._jxBatchDel();
            _this._stopBatchDel();
            _this._lineReverseGen();
            _this._queryCar();
            _this._stopQury();
            _this.stopClear();
            _this._jxCompress();
            _this._heatmap();
            _this._clear_heatmap();
            _this._user_query();
            _this._clear_uq();
            _this._app_query();
            _this._app_clear();
            _this._avg_speed();
            _this._clear_speed();
            _this._recommand_stop_btn();
            _this._editableMode();
            _this._save_btn();
            _this._bind_reset();
            _this._autoComplete();
            _this._bindDataTableClick();
            _this._showPoint();
            _this._lines_heatmap_check();
            _this._stopNameAutoComplete();
            _this._checkAllStop();
            _this._stopDisQuery();
            _this.stopDisClear();
            _this._checkDisAllStop();
            _this.stopDisSH();
            _this._hisQuery();

            //var my_distance_flag=false;
            $("#mouse_distance").on({
                'click':function(){
                    if(!my_distance_flag){
                        map.disableDoubleClickZoom() ;
                        map.addEventListener('click',_this.doDistance);
                        $(this).text("关闭测距");

                        my_distance_flag=true;
                    }else {
                        map.enableDoubleClickZoom() ;
                        map.removeEventListener('click',_this.doDistance);
                        $(this).text("开启测距");
                        _this._removePointsObjectLay();
                        _this._paramInit();
                        my_distance_flag=false;
                    }

                }
            });
            
            $("#ycstation").click(function(){
                _this._removeCirleRangeMarker();
            })
            
            $("#merge_ycstation").click(function(){
                var heih = $("#rangMarkerRight table tbody");
                var heihCheck = heih.find('[type=checkbox]:checked');
                if(heihCheck.length > 1){
                    var stationIdArray = heihCheck.map(function(){
                            return  $(this).data('stationid');
                        });
                    var joinStationId = _this._mergerStations(stationIdArray);
                        
                    $.postLock(__baseUrl + '/baseData/mergeStations',{
                        stationIds:joinStationId.join(),
                        cityId:_this._getCity().cityId
                    },function(result){
                        if(result.status === 'OK'){
                            //重新查询周围物理站并且渲染
                            $("#ycstation").click();
                            alert('合并成功!');
                        }else{
                            alert('合并失败!');
                        }
                    })
                }
            })
            
            $("#view_change").click(function(){
                 //清除站点
                for (var i=0; i < markers.length; i++) {
                    map.removeOverlay(markers[i]);
                }
                markers=[];
                //清除蓝线
                map.removeOverlay(stopCurve);
                stopCurve=null;
                
                if(changeView){//"逻辑"+物理
                    changeView=false;
                }else{//虚拟+物理
                    changeView=true;
                }
                 //站点和蓝线
                var points=[];
                for(var j=0;j<updateData.length;j++){
                    _this._markerMap(updateData[j],points);
                }
                if (points.length > 0) {
                    if (resetView) {
                        //map.setViewport(points);
                    } else {
                        resetView = true;
                    }
                    _this._bindStopMarkerEvent();
                    _this._drawLine(points);
                } 
               
            })

            //记录用户习惯
            remeberPeopleLike();
        },
        _initMap:function(){
            map = new BMap.Map("container");      // 创建Map实例
            map.enableScrollWheelZoom();              //启用滚轮放大缩小
            map.enableKeyboard();                 //启用方向键移动地图功能
            map.addControl(new BMap.NavigationControl());
            var option2={anchor:BMAP_ANCHOR_BOTTOM_LEFT};
            map.addControl(new BMap.ScaleControl(option2));
            map.addControl(new BMap.OverviewMapControl());
            //map.setMaxZoom(18);
            $("#mouse_distance").text("开启测距");

            if(GetQueryString('jingdu') && GetQueryString('weidu')){
                printMarker();
            }
            
            function printMarker() {
                var jingdu = GetQueryString('jingdu');
                var weidu = GetQueryString('weidu');
                var marker = new BMap.Marker(new BMap.Point(jingdu, weidu));
                map.addOverlay(marker);
                marker.addEventListener('click',function(){
                    map.removeOverlay(marker);
                })
            }
                    

            function GetQueryString(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
            }
        },
        _showInfo:function(e){
            for (var i = 0; i < pickMarkers.length; i++) {
                 map.removeOverlay(pickMarkers[i]);
             }
             pickMarkers = [];
              $('#pickup-point').val(e.point.lng + "," + e.point.lat);
              var point = new BMap.Point(e.point.lng,e.point.lat);
               var Marker = new BMap.Marker(point);  // 创建标注
               map.addOverlay(Marker);               // 将标注添加到地图中
               //Marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
               pickMarkers.push(Marker);
          },
        _pickupLngLat:function(){
            $('#pickup').on("click",function(){
                $("#pickup").attr("disabled", true); 
                map.addEventListener("click", _this._showInfo);  
            });
        },

        _getCity: function() {
            var cityId = $('#detailDialog #dm_navbar #cityId').val();
            return {
                cityId: cityId,
                cityEn: $.codemap['cityEn'][cityId],
                cityCn: $.codemap['cityCn'][cityId]
            }
        },

        _initMenu: function() {
            var menu = new BMap.ContextMenu();
            var txtMenuItem = [
                {
                    text:'<span id="viewReverse">查看反向</span>',
                    callback:_this._lineReverse
                }
            ];
            for(var i=0; i < txtMenuItem.length; i++){
                menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
            }
            map.addContextMenu(menu);
        },

        _initMaxSlider: function() {
            $('#maxSlider').slider({
                range: 'min',
                  min: 1,
                  max: 10,
                  value: 5,
                  slide: function( event, ui ) {
                      if (heatOverlay[$('#heatmap_date').val().trim()] && heatOverlay[$('#heatmap_date').val().trim()].heatmap) {
                          heatOverlay[$('#heatmap_date').val().trim()].heatmap.setDataMax(avg_point * ui.value);
                      }
                      if (recHeatOverlay) {
                          recHeatOverlay.heatmap.setDataMax(avg_point_select * ui.value);
                      }
                  }
            });
            $('#speed_maxSlider').slider({
                range: 'min',
                  min: 1,
                  max: 30,
                  value: 5,
                  slide: function( event, ui ) {
                      if (speedPolys.length > 0) {
                          for (var i=0; i<speedPolys.length; i++) {
                              map.removeOverlay(speedPolys[i]);
                          }
                      }
                      if (speedData) {
                          _this._draw_speed(speedData, (ui.value - 1) * 0.5 + 3);
                      }
                  }
            });
        },

        _set_tab_view: function(tab, index) {
            var lis = $($('#' + tab).children()[0]).children();
            var divs = $($('#' + tab).children()[1]).children();
            for (var i = 0; i < lis.length; i++) {
                if (i != index) {
                    $(lis[i]).removeClass('active');
                    $(divs[i]).removeClass('active');
                } else {
                    $(lis[i]).addClass('active');
                    $(divs[i]).addClass('active');
                }
            }
        },

        _save_disabled: function() {
            $('#btn-save').prop("disabled", true);
            $('#btn-draft').prop("disabled", true);
            $('#mouse_distance').prop("disabled", true);
            $('#view_change').prop("disabled", true);
        },

        _save_enabled: function() {
            $('#btn-save').removeProp("disabled");
            $('#btn-draft').removeProp("disabled");
            $('#mouse_distance').removeProp("disabled");
            $('#view_change').removeProp("disabled");
        },

        initDialog: function() {
            _this.reset();
            _this._bindEvent();
            $('#detailDialog #dm_navbar #cityId').val(g_cityId);
            $('#detailDialog #dm_navbar #cityId').change();
            $('#select2-lineSelector-container').attr('title', '');
            $('#select2-lineSelector-container').text('');
            $('#canvasdiv').height($('#detail').height() - 68);

            setTimeout(function() {
                _this._resetGlobal();
                _this._pickupLngLat();
            }, 1000);
        },

        //页面初始化
        init:function(){
            _this._save_disabled();
            _this._initMap();
            _this._queryAll();
            _this._initMenu();
            _this._initMaxSlider();
            _this._dbclick();
        }
    };
    _this.initDialog();
}

function _replaceBrackets(str) {
    return str.replace(/\[/g,'(').replace(/{/g,'(').replace(/（/g,'(')
            .replace(/【/g,'(').replace(/「/g,'(').replace(/『/g,'(').replace(/</g,'(').replace(/〔/g,'(')
            .replace(/]/g,')').replace(/）/g,')').replace(/】/g,')')
            .replace(/」/g,')').replace(/』/g,')').replace(/〕/g,')').replace(/>/g,')').replace(/}/g,')').toUpperCase();
}

function remeberPeopleLike(){

    var flag_lengend = null,
        $lengend = $("#lengend"),
        $lgdImgSpan = $("#lengend_img span"),
        $lgdImg = $("#lengend_img");

    var operation = {
        _lengendLeft :function(){
            $lengend.css('left','-11%');
            $lgdImgSpan.css('left','20px');
            $lgdImgSpan.addClass('glyphicon-circle-arrow-right')
                        .removeClass('glyphicon-circle-arrow-left');
        },
        _lengendRight:function(){
            $lengend.css('left','0');
            $lgdImgSpan.css('left','0px');
            $lgdImgSpan.addClass('glyphicon-circle-arrow-left')
                                  .removeClass('glyphicon-circle-arrow-right');
        },
        _bindEvents:{
            _lengendImgClick:function(){
                $lgdImg.on('click',function(){
                    if(flag_lengend){
                        operation._lengendLeft();

                        flag_lengend = false;

                    }else{
                        operation._lengendRight();
                        
                        flag_lengend = true;
                    }
                })
            },
            _leavePage:function(){
                $(window).bind('beforeunload',function(){
                    if(window.localStorage){
                        window.localStorage.setItem("lengend",flag_lengend);
                    }
                });
            }
        },
        _remeberJudge:function(){
            if(localStorage.getItem("lengend") == 'true'){
                operation._lengendRight();
                flag_lengend = localStorage.getItem("lengend");
            }else{
                operation._lengendLeft();
                flag_lengend = true;
            }
        }
    }
    
    var init = function(){
        operation._remeberJudge();
        operation._bindEvents._lengendImgClick();
        operation._bindEvents._leavePage();
    }   

    init();
 
}
