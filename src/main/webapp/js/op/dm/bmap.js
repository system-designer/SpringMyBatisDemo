var ZMap = function() {
    this.mapObj = null, this.mapId = '', this.opts = '';
};

ZMap.prototype.createMap = function(mapId, opts) {
    if (this.mapObj) {
        this.mapObj.clearOverlay();
    }

    this.mapObj = new BMap.Map(mapId);
    this.mapId = mapId;
    this.opts = opts;
    if (opts) {
        var level = opts.level || 15;
        if (opts.lng && opts.lat) {
            var point = new BMap.Point(opts.lng, opts.lat);
            this.mapObj.centerAndZoom(point, level);
        } else if (opts.addr) {
            this.mapObj.centerAndZoom(opts.addr, level);
        } else {
            this.mapObj.centerAndZoom('北京', 15);
        }
        this.mapObj.enableScrollWheelZoom();

        if (opts.control) {
            var controls = this.controls();
            controls.addNavi();
            controls.addScale({
                anchor: opts.anchor ? opts.anchor: BMAP_ANCHOR_BOTTOM_LEFT
            });
            controls.addOverview();
        }
    }
};

ZMap.prototype.controls = function() {
    var _that = this;
    return {
        addNavi: function(opts) {
            _that.mapObj.addControl(new BMap.NavigationControl(opts));
        },
        addScale: function(opts) {
            _that.mapObj.addControl(new BMap.ScaleControl(opts));
        },
        addOverview: function(opts) {
            _that.mapObj.addControl(new BMap.OverviewMapControl(opts));
        }
    };
};

ZMap.prototype.iconMarker = function(icon, point) {
    var micon = new BMap.Icon(icon.img, new BMap.Size(icon.width, icon.height));
    var marker = new BMap.Marker(point, {
        icon: micon
    });
    this.mapObj.addOverlay(marker);
    return marker;
};

ZMap.prototype.labelMarker = function(msg, point) {
    var lbl = new BMap.Label(msg, {});
    var marker = new BMap.Marker(point);
    marker.setLabel(lbl);
    this.mapObj.addOverlay(marker);
    return marker;
};

ZMap.prototype.marker = function(point) {
    var marker = new BMap.Marker(point, {});
    this.mapObj.addOverlay(marker);
    return marker;
};

ZMap.prototype.markerCallback = function(coords, callback) {
		var point = new BMap.Point(coords);
    var marker = this.marker(point);
    this.addListener(marker, 'click', callback);
};

ZMap.prototype.point = function(coords) {
		return new BMap.Point(coords.lng, coords.lat)
};

ZMap.prototype.circle = function() {

};

ZMap.prototype.polyline = function() {

};

ZMap.prototype.pointCollection = function() {

};

ZMap.prototype.localSearch = function() {

};

ZMap.prototype.getMap = function() {
    return this.mapObj;
};

ZMap.prototype.addListener = function(obj, type, callback) {
    obj.addEventListener(type, function(e) {
        callback(e);
    });
};

ZMap.prototype.infoWindow = function(opts, msg, pObj, point) {
    var infoWindow = new BMap.InfoWindow(msg, opts);
    pObj.openInfoWindow(infoWindow, point);
};

ZMap.prototype.setZoom = function(level) {
    this.mapObj.setZoom(level);
};

ZMap.prototype.panTo = function(point) {
    this.mapObj.panTo(point);
};

ZMap.prototype.init = function() {
    if (this.mapObj) {
        this.mapObj.clearOverlay();
    }

    var evts = ['click', 'dblclick', 'dragend'];

    for (itm in evts) {
        this.mapObj.removeEventListener(evts[itm]);
    }
};
