package com.raymond.core.util.webapi;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;



public class HttpRequestHelper {
	protected final static org.slf4j.Logger logger = LoggerFactory.getLogger(HttpRequestHelper.class);
	
	
	public static String request(String url) throws HttpException, IOException{
		HttpClient httpClient = new HttpClient() ;
		{
			httpClient.getParams().setConnectionManagerTimeout(30*1000);
			httpClient.getParams().setSoTimeout(5*60*1000);
		}
			GetMethod get = new GetMethod(url) ;
			httpClient.executeMethod(get) ;
			
			StringBuffer jsonb = new StringBuffer("");
			BufferedReader reader = new BufferedReader(new InputStreamReader(get.getResponseBodyAsStream()));
			String aline = null;
			while((aline=reader.readLine())!=null){
				jsonb.append(aline);
			}
			reader.close();
			return jsonb.toString() ;
	}
	
	public static void requestOnly(String url){
		try{
			request(url);
		}catch(Exception e){
			logger.error("HttpRequestHelper:requestOnly:["+url+"]\n"+e.getMessage());
		}
	}

	public static void main(String[] args) {
		try {
			String time = "2015-10-16 20:20:43";
			System.out.println(request("http//121.40.95.166:7000/universe/publish/getVersion?cityId=014&type=1&time="+time));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
