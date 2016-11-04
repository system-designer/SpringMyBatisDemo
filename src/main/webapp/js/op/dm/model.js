define(function(require, exports, module) {

    var Model = function(opts) {
      this.cityId = opts.cityId;
      this.lineId = opts.lineId;
      this.lineNo = opts.lineNo;
      this.direction = opts.direction;
      this.line = opts.data.line;
      this.lineExtend = opts.data.lineExtend;
      this.tralist = opts.data.tralist || [];
      this.maplist = opts.data.maplist || [];
      this.stationList = opts.data.stationList || [];
      this.build();
      //TODO clone data
    };

    Model.prototype = {
      build: function() {
        //主要是将物理站点的数据与逻辑站一一对应，方便后续操作
        var stationMap = {};
        var stationList = this.stationList;
        for (var i = 0; i < stationList.length; i++) {
          stationMap[stationList[i].stationId] = stationList[i];
        }
        var station;
        var maplist = this.maplist;
        for (var i = 0; i < maplist.length; i++) {
          station = stationMap[maplist[i].stationId];
          if (station) {
            maplist[i].stationInfo = station;
          } else {
            maplist[i].stationId = 0;
            maplist[i].stationInfo = [];
          }
        }
        stationMap = null;
      },
      set: function(model) {
        this.line.set(model.line);
        this.lineExtend.set(model.lineExtend);
        this.tralist.set(model.tralist);
        this.maplist.set(model.maplist);
        this.stationList.set(model.stationList);
      },
      get: function() {
        return {
          line: this.line.get(),
          lineExtend: this.lineExtend.get(),
          tralist: this.tralist.get(),
          maplist: this.maplist.get(),
          stationList: this.stationList.get()
        }
      },
      addTrajectory: function(item) {
          var index = item.orderNum - 1;
          var data = this.tralist;
          item = new this.line(item);
          data.splice(index, 0, item);
          for (var i = index + 1; i < data.length; i++) {
            data[i].orderNum = parseInt(data[i].orderNum, 10) + 1;
          }
      },
      delTrajectory: function(orders) {
          var data = this.tralist;
          var count = 1;
          var orders = ('' + orders).split(',');
          if (orders.length === 2) {
            count = orders[1] - order[0] + 1;
          }
          data.splice(orders[0] - 1 , count);
          for (var i = orders[0]; i < data.length; i++) {
            data[i].orderNum = parseInt(data[i].orderNum, 10) - count;
          }
      },
      updateTrajecotry: function(item) {
          var updateItem = this.tralist[item.orderNum - 1];
          updateItem.jingdu = item.jingdu;
          updateItem.weidu = item.weidu;
      },
      addStop: function(item) {
        var index = item.orderNum - 1;
        var data = this.maplist;
        item = new this.stop(item);
        item.stationInfo = new this.station(item);
        data.splice(index, 0, item);
        for (var i = index + 1; i < data.length; i++) {
          data[i].orderNum = parseInt(data[i].orderNum, 10) + 1;
        }
      },
      delStop: function(orders) {
          var data = this.maplist;
          var count = 1;
          var orders = ('' + orders).split(',');
          if (orders.length === 2) {
            count = orders[1] - order[0] + 1;
          }
          data.splice(orders[0] - 1 , count);
          for (var i = orders[0]; i < data.length; i++) {
            data[i].orderNum = parseInt(data[i].orderNum, 10) - count;
          }
      },
      updateStop: function(item) {
          var updateItem = this.maplist[item.orderNum - 1];
          updateItem.stopName = item.stopName;
          updateItem.jingdu = item.jingdu;
          updateItem.weidu = item.weidu;
      }
    };

    //线路
    Model.line = function(item) {
        this.cityId = opts.cityId;
        this.direction = opts.direction;
        this.firstTime = opts.firstTime;
        this.id = opts.id;
        this.lastTime = opts.lastTime;
        this.lineId = opts.lineId;
        this.lineName = opts.lineName;
        this.lineNo = opts.lineNo;
        this.status = opts.status;
        this.stopsNum = opts.stopsNums;
    };

    Model.lineExtend = function(item) {

    };

    Model.trajectory = function(item) {
        this.cityId = item.cityId;
        this.direction = item.direction;
        this.lineId = item.lineId;
        this.lineNo = item.lineNo;
        this.traId = item.traId;
        this.jingdu = item.jingdu || 0;
        this.weidu = item.weidu || 0;
        this.sjingdu = item.sjingdu || 0;
        this.sweidu = item.sweidu || 0;
        this.orderNum = item.orderNum;
    };

    Model.station = function(item) {
        this.cityId = item.cityId;
        this.isVirtual = item.isVirtual || 0;
        this.lat = item.lat || 0;
        this.lng = item.lng || 0;
        this.slat = item.slat || 0;
        this.slng = item.slng || 0;
        this.stationId = item.stationId || 0;
        this.stationName = item.stationName || item.stopName;
        this.stopExtend = item.stopExtend;
        this.stopList = item.stopList || [item];
        
    };

    Model.stop = function(item) {
        this.cityId = item.cityId;
        this.direction = item.direction;
        this.lineId = item.lineId;
        this.lineNo = item.lineNo;
        this.linemapId = item.traId;
        this.jingdu = item.jingdu || 0;
        this.weidu = item.weidu || 0;
        this.sjingdu = item.sjingdu || 0;
        this.sweidu = item.sweidu || 0;
        this.orderNum = item.orderNum;
        this.stationId = item.stationId || 0;
        this.stopName = item.stopName;
    };

    module.exports = Model;

});
