package tet.service.junit4;

import org.junit.Test;

import com.alibaba.fastjson.JSONObject;
import com.raymond.core.util.DateUtils;

public class CommonTest {
	
	@Test
	public void testDate(){
		System.out.println(JSONObject.toJSONString(DateUtils.getBetweenDates("2016-07-01", "2016-08-01")));
	}
	
}
