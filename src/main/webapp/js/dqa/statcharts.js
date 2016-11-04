/**
 * Created by Raymond on 2016/8/4.
 */
define(function (require, exports, module) {
    var jQuery = require('jquery');
    var $ = jQuery;
    require('myutil.rest');
    require('jquery.blockUI');
    require('highcharts');
    module.exports = jQuery;
    var common = require('myutil.common');

    (function ($) {
        $.widget("ui.statcharts", {
            options: {
                id : 'lll',
                chartType: 'chartType',
                title: 'title',
                subtitle: 'subtitle',
                series: 'series',
                yText : null,
                plotLines: [],
                formatter: function () {
                }
            },
            _create: function () {
            	Highcharts.setOptions({ global: { useUTC: false } });
                if (this.options.plotLines && this.options.plotLines.length > 0) {
                    var range = this.options.plotLines;
                    var length = range.length > 6 ? 6 : range.length;
                    this.options.plotLines = [];
                    for (var i = 0; i < length; i++) {
                        if(typeof range[i] == 'object'){
                            this.options.plotLines.push(range[i]);
                        }else{
                            var label = '';
                            if (i % 2 == 0) {
                                label = '下界:' + range[i];
                            } else if (i % 2 == 1) {
                                label = '上界:' + range[i];
                            }
                            var plotLine = {
                                color: Highcharts.getOptions().colors[6 - i],
                                width: 2,
                                value: range[i],
                                label: {'text': label}
                            };
                            this.options.plotLines.push(plotLine);
                        }
                    }
                }
                if (this.options.chartType == 'trend') {
                    this.trendChart();
                } else if (this.options.chartType == 'distribution') {
                    this.distributionChart();
                } else if (this.options.chartType == 'rate') {
                    this.rateChart();
                }
            },
            trendChart: function () {
                if (!this.options.formatter) {
                    this.options.formatter = function () {
                        return Highcharts.dateFormat('%m-%d', this.value);
                    }
                }
                if(this.options.legendType == 1){
                	legend = {
          				   enabled : true,
         				   itemStyle: {
         			           fontWeight: 'normal'
         			       }
         			    };
                }else{
                	legend = {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        };
                }
                $(this.element).highcharts({
                	credits:{
	   				     enabled:false
	   				},
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: this.options.title,
                        x: -20
                    },
                    subtitle: {
                        text: this.options.subtitle
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: this.options.formatter
                        }
                    },
                    yAxis: {
                        labels: {format: '{value}', style: {color: Highcharts.getOptions().colors[1]}},
                        title: {text: this.options.yText==null?'数量(秒)':this.options.yText, style: {color: Highcharts.getOptions().colors[1]}},
                        plotLines: this.options.plotLines
                    },
                    legend: legend,
                    series: this.options.series
                });
                $('#' + this.options.id).data('chart',chart);
            },
            distributionChart: function () {
                if (!this.options.formatter) {
                    this.options.formatter = function () {
                        return this.value + "秒";
                    }
                }else{
                	this.options.formatter = function () {
                		return Highcharts.dateFormat('%m-%d %H:%M:%S', this.value) + "时";
                    }
                }
                if(this.options.legendType == 1){
                	legend = {
          				   enabled : true,
         				   itemStyle: {
         			           fontWeight: 'normal'
         			       }
         			    };
                	xType = 'datetime';
                }else{
                	legend = {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        };
                	xType = 'linear';
                }
                $(this.element).highcharts({
                	credits:{
	   				     enabled:false
	   				},
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: this.options.title,
                        x: -20
                    },
                    subtitle: {
                        text: this.options.subtitle
                    },
                    xAxis: {
                        type: xType,
                        labels: {
                            formatter: this.options.formatter
                        }
                    },
                    yAxis: {
                        labels: {format: '{value}', style: {color: Highcharts.getOptions().colors[1]}},
                        title: {text: this.options.yText==null?'数量(个)':this.options.yText, style: {color: Highcharts.getOptions().colors[1]}},
                        plotLines: this.options.plotLines
                    },
                    legend: legend,
                    series: this.options.series
                });
            },
            rateChart: function () {
                if (!this.options.formatter) {
                    this.options.formatter = function () {
                        return Highcharts.dateFormat('%m-%d', this.value);
                    }
                }
                if(this.options.legendType == 1){
                	legend = {
          				   enabled : true,
         				   itemStyle: {
         			           fontWeight: 'normal'
         			       }
         			    };
                }else{
                	legend = {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        };
                }
                $(this.element).highcharts({
                	credits:{
	   				     enabled:false
	   				},
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: this.options.title,
                        x: -20
                    },
                    subtitle: {
                        text: this.options.subtitle
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: this.options.formatter
                        }
                    },
                    yAxis: {
                        labels: {format: '{value}', style: {color: Highcharts.getOptions().colors[1]}},
                        title: {text: this.options.yText==null?'百分比(%)':this.options.yText, style: {color: Highcharts.getOptions().colors[1]}},
                        plotLines: this.options.plotLines
                    },
                    legend: legend,
                    series: this.options.series
                });
            },
            setXRange: function (xLowValue, xHighValue) {
                var chart = $(this.element).highcharts();
                if (chart.xAxis[0].userOptions.type == "datetime") {
                    chart.xAxis[0].setExtremes(Date.parse(xLowValue, '%Y-%m-%d'), Date.parse(xHighValue, '%Y-%m-%d'));
                } else {
                    chart.xAxis[0].setExtremes(xLowValue, xHighValue);
                }
            },
            setYRange: function (yLowValue, yHighValue) {
                var chart = $(this.element).highcharts();
                chart.yAxis[0].setExtremes(yLowValue, yHighValue);
            },
            setRange: function (xLowValue, xHighValue, yLowValue, yHighValue) {
                var chart = $(this.element).highcharts();
                if (chart.xAxis[0].userOptions.type == "datetime") {
                    chart.xAxis[0].setExtremes(Date.parse(xLowValue, '%Y-%m-%d'), Date.parse(xHighValue, '%Y-%m-%d'), false);
                } else {
                    chart.xAxis[0].setExtremes(xLowValue, xHighValue, false);
                }
                chart.yAxis[0].setExtremes(yLowValue, yHighValue, false);
                chart.redraw();
            }
        });

    }(jQuery) );
});