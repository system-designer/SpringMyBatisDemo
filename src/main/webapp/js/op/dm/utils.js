define(function(require, exports, module) {

var BMap_plugin = function(id) {
	this.map = null;
	this.line, this.maplist, this.tralist;
	//红色脊线的Polyline
	this.tra_polyline;
    //脊线的Point集合
	this.traPoints= new Array();
    //脊线的Marker集合
	this.traMarkers= [];
    //蓝线站点线的Polyline
	this.stopCurve;
    //所有站点的Marker集合
	this.markers=[];
	
	//站点Marker的offset
	this.offset =new BMap.Size(0,-15);
    //站点序号Label的Marker
    this.defaultLableOffsetSize = new BMap.Size(0, 30);
    //脊线圈Marker的offset
    this.tra_offset = new BMap.Size(0,0);

    //站点默认图标(紫)
    this.rIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-item.png",new BMap.Size(30,30));
    //站点选中图标(蓝)
    this.rIcon_two = new BMap.Icon(__baseUrl + "/images/cll-linemap-item_1.png",new BMap.Size(30,30));
    //脊线圈默认图标(蓝)
    this.jxBlueIcon = new BMap.Icon(__baseUrl + "/images/circle_blue.png", new BMap.Size(16, 16));
    //脊线圈选中图标(绿)
    this.jxGreenIcon = new BMap.Icon(__baseUrl + "/images/circle_green.png", new BMap.Size(16, 16));
    
    this._BMap(id);
};

BMap_plugin.prototype._BMap = function(id) {
	this.map = new BMap.Map(id);
	//this.map.centerAndZoom('天津',14);
	this.map.enableScrollWheelZoom();          	//启用滚轮放大缩小
	this.map.addControl(new BMap.NavigationControl());
   /* var option2={anchor:BMAP_ANCHOR_TOP_LEFT};
    map.addControl(new BMap.ScaleControl(option2));*/
	this.map.addControl(new BMap.OverviewMapControl());
	this.map.setMaxZoom(18);
};

BMap_plugin.prototype.init = function(line, maplist, tralist) {
	this.line = line;
	this.maplist = maplist;
	this.tralist = tralist;
	this.drawStop(maplist);
	this.drawTraLine(tralist);
	this.drawTraMarker(tralist);
}

BMap_plugin.prototype.drawStop = function(maplist) {
	// 站点和站点蓝线
	var updateData = maplist.slice(0);
	for (var i = 0; i < updateData.length; i++) {
		// 默认状态为0;
		updateData[i].markerIconColor = 0;
		updateData[i].status = "";
		updateData[i].id = i;
	}
	var points = [];
	for (var j = 0; j < updateData.length; j++) {
		this._drawStopMarker(updateData[j], points);
	}
	this._drawStopLine(points);
};

BMap_plugin.prototype.drawTraLine = function(tralist) {
	//脊线
	var points = [];
    for (var i=0; i<tralist.length; i++) {
        points.push(new BMap.Point(tralist[i].jingdu,tralist[i].weidu));
    }
    this._drawTraLine(points);
};

BMap_plugin.prototype.drawTraMarker = function(tralist) {
	//脊线圈
	var jxData = [];
    if(tralist.length>0) {
        //装载脊线数据到全局数组
        for (var j=0; j<tralist.length; j++) {
            var tableItem = {};
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
    }
    this._drawTraMarker(jxData);
};

BMap_plugin.prototype._drawStopLine = function(points) {
	this.map.removeOverlay(this.stopCurve);
	var curve = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
    this.map.addOverlay(curve); //添加到地图中
    this.map.setViewport(points);
    this.stopCurve = curve;
};

BMap_plugin.prototype._drawStopMarker = function(itemData, points) {
	var rIcon = new BMap.Icon(__baseUrl + "/images/cll-linemap-item.png",new BMap.Size(30,30));
    var point = new BMap.Point(itemData.jingdu,itemData.weidu);
    var marker = new BMap.Marker(point,{icon:rIcon,offset:this.offset});  // 创建标注
    marker.enableDragging();
    if(itemData.markerIconColor==0){
        marker.setIcon(rIcon);
    }
    if(itemData.markerIconColor==1){
        marker.setIcon(rIcon_two);
    }
    var label = new BMap.Label(itemData.orderNum);
    label.setOffset(this.defaultLableOffsetSize);
    marker.setLabel(label);
    this.map.addOverlay(marker);    // 将标注添加到地图中
    this.markers.push(marker);
    if(points){
        points.push(point);
    }
};

BMap_plugin.prototype._drawTraLine = function(points) {
	if (points) {
        if (this.tra_polyline != undefined) {
        	this.map.removeOverlay(this.tra_polyline);
        }
        var  traLine = new BMap.Polyline(points, {strokeColor:"red", strokeWeight:2, strokeOpacity:0}); //创建折线对象
        traLine.enableMassClear();
        this.map.addOverlay(traLine); //添加到地图中

        //给全局脊线变量赋值
        this.tra_polyline = traLine;
    }
};

BMap_plugin.prototype._drawTraMarker = function(data) {
	if(data){
        for (var i=0; i<data.length; i++) {
            var point = new BMap.Point(data[i].jingdu, data[i].weidu);
            var marker = new BMap.Marker(point,{icon:this.jxBlueIcon,offset:this.tra_offset});
//            		marker.setOffset(tra_offset);
            if (data[i].markerIconColor == 1) {
                marker.setIcon(this.jxBlueIcon);
            }
            if (data[i].markerIconColor == 2) {
                marker.setIcon(this.jxGreenIcon);
            }
            marker.enableDragging();
            this.map.addOverlay(marker);
            this.traMarkers.push(marker);
            this.traPoints.push(point);
        }
    }else{
        alert("尚无脊线！");
    }
};

//地图上的站点信息还原
BMap_plugin.prototype.stopReset = function(data) {
	this.drawStop(this.maplist);
}
//地图上的脊线信息还原
BMap_plugin.prototype.traReset = function(data) {
	this.drawStop(this.maplist);
	this.drawTraLine(this.tralist);
	this.drawTraMarker(this.tralist);
}

module.exports = BMap_plugin;
	
});