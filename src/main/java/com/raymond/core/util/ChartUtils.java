package com.raymond.core.util;

import org.apache.xmlbeans.impl.util.Base64;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.*;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.RectangleInsets;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;

/**
 * Created by Raymond on 2016/3/31
 */
public class ChartUtils {
    /**
     * 创建时序图
     *
     * @param title          标题
     * @param timeAxisLabel  横轴(时间轴)名
     * @param valueAxisLabel 纵轴名
     * @param dataSet        数据集
     * @param daySpan        时间轴单元跨度:0默认1一天
     * @return 时序图的base64字符串
     */
    public static String createTimeSeriesChart(String title, String timeAxisLabel,
                                               String valueAxisLabel, TimeSeriesCollection dataSet, int daySpan) {
        String base64Str = "";
        //绘制图表
        Font titleFont = new Font("宋体", Font.BOLD, 20);
        Font itemFont = new Font("宋体", Font.PLAIN, 14);
        Font labelFont = new Font("宋体", Font.PLAIN, 16);

        final JFreeChart chart = ChartFactory.createTimeSeriesChart(title,
                timeAxisLabel, valueAxisLabel, dataSet, true, true, false);
        chart.getTitle().setFont(titleFont);
        chart.getLegend().setItemFont(itemFont);
        //场景
        XYPlot plot = (XYPlot) chart.getPlot();
        plot.setBackgroundPaint(Color.lightGray);
        plot.setDomainGridlinePaint(Color.white);
        plot.setRangeGridlinePaint(Color.white);
        plot.setAxisOffset(new RectangleInsets(5.0, 5.0, 5.0, 5.0));
        plot.setDomainCrosshairVisible(true);
        plot.setRangeCrosshairVisible(true);

        XYItemRenderer r = plot.getRenderer();
        if (r instanceof XYLineAndShapeRenderer) {
            XYLineAndShapeRenderer renderer = (XYLineAndShapeRenderer) r;
            renderer.setBaseShapesVisible(true);
            renderer.setBaseShapesFilled(true);
            renderer.setDrawSeriesLineAsPath(true);
        }

        //数轴(纵轴)
        final NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setLabelFont(labelFont);
        rangeAxis.setStandardTickUnits(NumberAxis.createStandardTickUnits());
        //时间轴(横轴)
        DateAxis dateAxis = (DateAxis) plot.getDomainAxis();
        dateAxis.setDateFormatOverride(new SimpleDateFormat("MM/dd"));
        dateAxis.setLabelFont(labelFont);
        if (daySpan != 0) {
            dateAxis.setTickUnit(new DateTickUnit(DateTickUnitType.DAY, daySpan));
        } else {
            dateAxis.setTickUnit(new DateTickUnit(DateTickUnitType.DAY, 1));
        }

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ChartUtilities.writeChartAsJPEG(baos, chart, 800, 450);
            baos.flush();
            base64Str = new String(Base64.encode(baos.toByteArray()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64Str;
    }

    /**
     * 创建水平直方图
     *
     * @param title           标题
     * @param domainAxisLabel 横轴(类别轴)名
     * @param valueAxisLabel  纵轴名
     * @param dataSet         数据集
     * @return
     */
    public static String createHistogramChart(String title, String domainAxisLabel,
                                              String valueAxisLabel, CategoryDataset dataSet) {
        String base64Str = "";
        //绘制图表
        Font titleFont = new Font("宋体", Font.BOLD, 20);
        Font itemFont = new Font("宋体", Font.PLAIN, 14);
        Font labelFont = new Font("宋体", Font.PLAIN, 16);

        final JFreeChart chart = ChartFactory.createBarChart(title, domainAxisLabel, valueAxisLabel, dataSet,
                PlotOrientation.VERTICAL, true, true, false);
        chart.getTitle().setFont(titleFont);
        chart.getLegend().setItemFont(itemFont);

        final CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.lightGray);
        plot.setDomainGridlinePaint(Color.white);
        plot.setRangeGridlinePaint(Color.white);
        plot.setAxisOffset(new RectangleInsets(5.0, 5.0, 5.0, 5.0));
        plot.setDomainCrosshairVisible(true);
        plot.setRangeCrosshairVisible(true);

        //纵轴(数轴)
        ValueAxis rangeAxis = plot.getRangeAxis();
        rangeAxis.setLabelFont(labelFont);
        //横轴(类别轴)
        CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setLabelFont(labelFont);

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ChartUtilities.writeChartAsJPEG(baos, chart, 800, 450);
            baos.flush();
            base64Str = new String(Base64.encode(baos.toByteArray()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64Str;
    }

    /**
     * 创建垂直柱状图
     *
     * @param title
     * @param domainAxisLabel 纵轴名称
     * @param valueAxisLabel  横轴名称
     * @param dataSet         数据集合
     * @return
     */
    public static String createBarChart(String title, String domainAxisLabel,
                                        String valueAxisLabel, CategoryDataset dataSet) {
        String base64Str = "";
        Font titleFont = new Font("宋体", Font.BOLD, 20);
        Font itemFont = new Font("宋体", Font.PLAIN, 14);
        Font labelFont = new Font("宋体", Font.PLAIN, 16);

        // 生成柱状图
        final JFreeChart chart = ChartFactory.createBarChart(title, domainAxisLabel,
                valueAxisLabel, dataSet, // data
                PlotOrientation.HORIZONTAL, // orientation
                true, // include legend
                true, false);

        chart.getTitle().setFont(titleFont);
        chart.getLegend().setItemFont(itemFont);

        final CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.lightGray);
        plot.setDomainGridlinePaint(Color.white);
        plot.setRangeGridlinePaint(Color.white);
        plot.setAxisOffset(new RectangleInsets(5.0, 5.0, 5.0, 5.0));
        plot.setDomainCrosshairVisible(true);
        plot.setRangeCrosshairVisible(true);

        //纵轴(数轴)
        ValueAxis rangeAxis = plot.getRangeAxis();
        rangeAxis.setLabelFont(labelFont);
        //横轴(类别轴)
        CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setLabelFont(labelFont);

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ChartUtilities.writeChartAsJPEG(baos, chart, 800, 450);
            baos.flush();
            base64Str = new String(Base64.encode(baos.toByteArray()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return base64Str;
    }
}
