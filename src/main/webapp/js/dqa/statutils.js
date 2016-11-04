/**
 * Created by Raymond on 2016/8/10.
 */
//统计工具类
var statUtils = {};
seajs.use(['jquery', 'bootstrap', 'bootstrap.datepicker', 'myutil.init', 'statcharts'],
    function ($) {
        $(function () {
            //阻止浏览器菜单
            document.oncontextmenu = function () {
                return false;
            };
            //修改坐标轴区间
            $("#saveRangeBtn").on('click', function () {
                var chartId = $("#updChartId").val();
                var xLowValue = $("#updRangeDialog input[name=xLowValue]").val();
                var xHighValue = $("#updRangeDialog input[name=xHighValue]").val();
                var yLowValue = $("#updRangeDialog input[name=yLowValue]").val();
                var yHighValue = $("#updRangeDialog input[name=yHighValue]").val();
                if (!xLowValue || !xHighValue || !yLowValue || !yHighValue) {
                    alert("上下界不能为空!");
                    return false;
                }
                if(xLowValue.indexOf('-') != -1){
                	var xLowValueNum = Date.parse(xLowValue);
                	var xHighValueNum = Date.parse(xHighValue);
                    if (parseFloat(xLowValueNum) >= parseFloat(xHighValueNum)) {
                		alert("X轴上下界设置有误!");
                		return false;
                	}
                }else{
                    if (parseFloat(xLowValue) >= parseFloat(xHighValue)) {
                		alert("X轴上下界设置有误!");
                		return false;
                	}
                }
                if (parseFloat(yLowValue) >= parseFloat(yHighValue)) {
                    alert("Y轴上下界设置有误!");
                    return false;
                }
                $("#" + chartId).statcharts("setRange", xLowValue, xHighValue
                    , yLowValue, yHighValue);
                $("#updRangeDialog").modal('hide');
            });
        });
        //显示弹出框,修改坐标轴的间隔
        function showRangeDialog(target) {
            $("#updRangeDialog").modal('show');
            $("#updChartId").val($(target).attr("id"));
            var chart = $(target).highcharts();
            if (chart.userOptions.xAxis.type == "datetime") {
                $("#updRangeDialog input[name=xLowValue]").val(Highcharts.dateFormat('%Y-%m-%d', chart.xAxis[0].min));
                $("#updRangeDialog input[name=xHighValue]").val(Highcharts.dateFormat('%Y-%m-%d', chart.xAxis[0].max));
            } else {
                $("#updRangeDialog input[name=xLowValue]").val(chart.xAxis[0].min);
                $("#updRangeDialog input[name=xHighValue]").val(chart.xAxis[0].max);
            }
            $("#updRangeDialog input[name=yLowValue]").val(chart.yAxis[0].min);
            $("#updRangeDialog input[name=yHighValue]").val(chart.yAxis[0].max);
        }

        statUtils = {showRangeDialog: showRangeDialog};
    });

//构造参数
function genParams() {
    var validate = {'cityId': '城市', 'dateFrom': '起始日期', 'dateTo': '结束日期', 'dataSource': '数据源'};
    var params = {
        cityId: $('#cityId').val(),
        dateFrom: $('#dateFrom').val(),
        dateTo: $('#dateTo').val(),
        dataSource: $('#dataSource').val()
    };
    var msg = '';
    for(var param in params){
        if (params[param] == '') {
            msg += ',' + validate[param];
        }
    }
    if(msg != ''){
        msg = msg.substring(1, msg.length);
        alert(msg + "不能为空！");
        return false;
    }

    if (params.dateTo) {
        if (!toDate(params.dateFrom, params.dateTo)) {
            alert("开始日期不能大于结束日期！");
            return false;
        }
    } else {
        params.dateTo = params.dateFrom;
    }
    return params;
}

function toDate(str1,str2){
    var sd1=str1.split("-");
    var sd2=str2.split("-");
    var d1 = new Date(sd1[0],sd1[1],sd1[2]);
    var d2 = new Date(sd2[0],sd2[1],sd2[2]);
    return d1<=d2
}