package com.raymond.core.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import net.sf.jxls.exception.ParsePropertyException;
import net.sf.jxls.transformer.XLSTransformer;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;

/**
 * Excel文件生成工具类
 * @author 周扬
 * 2014-12-20
 */
public class ExcelUtils {
	/**
	 * 生成Excel
	 * @author 周扬
	 * @param is 模板文件流
	 * @param data 数据map
	 * @param os 输出流
	 * @throws ParsePropertyException
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public static void doExcel(InputStream is, Map<String,Object> data, OutputStream os) throws ParsePropertyException, InvalidFormatException, IOException{
		XLSTransformer transformer = new XLSTransformer();
		Workbook wb = transformer.transformXLS(is, data);
		wb.write(os);
	}
	
	/**
	 * 生成Excel
	 * @param source 模板文件路径
	 * @param data	数据map
	 * @param dest 模板文件路径
	 * @throws ParsePropertyException
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public static void doExcel(String source, Map<String,Object> data, String dest) throws ParsePropertyException, InvalidFormatException, IOException{
		File in = new File(source);
		File out = new File(dest);
		doExcel(in, data, out);
	}
	/**
	 * 生成Excel
	 * @param source 模板文件
	 * @param data 数据map
	 * @param dest 模板文件路径
	 * @throws ParsePropertyException
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public static void doExcel(File source, Map<String,Object> data, File dest) throws ParsePropertyException, InvalidFormatException, IOException{
		FileInputStream is = new FileInputStream(source);
		FileOutputStream os = new FileOutputStream(dest);
		doExcel(is, data, os);
		is.close();
		os.close();
	}
	/**
	 * 生成多sheet 的 Excel
	 * @param is 模板文件流
	 * @param list 数据集合
	 * @param sheetNames 每个sheet的名称集合
	 * @param beanName 'list' 自定义名称，在excel中要用这个参数进行获取数据
	 * @param beanParams 代码转换用map集合
	 * @param os 输出流
	 * @throws ParsePropertyException
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	public static void doExcel(InputStream is,List<?> list,List<?> sheetNames,String beanName, Map<String,Object> beanParams, OutputStream os) throws ParsePropertyException, InvalidFormatException, IOException{
		XLSTransformer transformer = new XLSTransformer();
		Workbook wb = transformer.transformMultipleSheetsList(is, list, sheetNames, beanName, beanParams, 0);
		wb.write(os);
	}
	
}
