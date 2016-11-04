
	var cg_pi = 3.14159265358979324; 
	var cg_x_pi = cg_pi * 3000.0 / 180.0; 
	var cg_a = 6378245.0;
	var cg_ee = 0.00669342162296594323;



	function wgs2bd(lon, lat){
		var gcj_point = wgs2gcj(lon,lat);
		var bd_point  = gcj2bd(gcj_point.lng,gcj_point.lat);
		return bd_point;
	}

	function gcj2bd(gg_lng,gg_lat) 
	{ 
		var point = {};
		var bd_lat, bd_lng;
	    var x = gg_lng, y = gg_lat; 
	    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * cg_x_pi); 
	    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * cg_x_pi); 
	    bd_lng = z * Math.cos(theta) + 0.0065; 
	    bd_lat = z * Math.sin(theta) + 0.006; 
		point.lng = bd_lng;
		point.lat = bd_lat;
	    return point;
	} 


	function wgs2gcj(wgLon, wgLat)
        {	
			var point = {};
            var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
            var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
            var radLat = wgLat / 180.0 * cg_pi;
            var magic = Math.sin(radLat);
            magic = 1 - cg_ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((cg_a * (1 - cg_ee)) / (magic * sqrtMagic) * cg_pi);
            dLon = (dLon * 180.0) / (cg_a / sqrtMagic * Math.cos(radLat) * cg_pi);
			point.lng = wgLon + dLon;
			point.lat = wgLat + dLat;
            return point;
        }

		function transformLat(x, y)
        {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * cg_pi) + 20.0 * Math.sin(2.0 * x * cg_pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * cg_pi) + 40.0 * Math.sin(y / 3.0 * cg_pi)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * cg_pi) + 320 * Math.sin(y * cg_pi / 30.0)) * 2.0 / 3.0;
            return ret;
        }

        function transformLon(x, y)
        {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * cg_pi) + 20.0 * Math.sin(2.0 * x * cg_pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * cg_pi) + 40.0 * Math.sin(x / 3.0 * cg_pi)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * cg_pi) + 300.0 * Math.sin(x / 30.0 * cg_pi)) * 2.0 / 3.0;
            return ret;
        }


















