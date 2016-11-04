package com.raymond.core.util;

import com.raymond.core.exception.MyException;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

public class JsonUtil {


	public static String toJSON(Object obj) {
	         StringWriter writer = new StringWriter();
	         ObjectMapper mapper = new ObjectMapper();
	         try {
	                mapper.writeValue(writer, obj);
	         } catch (JsonGenerationException e) {
	                throw new MyException(e);
	         } catch (JsonMappingException e) {
	                throw new MyException(e);
	         } catch (IOException e) {
	                throw new MyException(e);
	         }
	         return writer.toString();
	}

	public static <T> T fromJSON(String json, Class<T> clazz) {
	         ObjectMapper mapper = new ObjectMapper();
	         try {
	                return mapper.readValue(json, clazz);
	         } catch (JsonParseException e) {
	                throw new MyException(e);
	         } catch (JsonMappingException e) {
	                throw new MyException(e);
	         } catch (IOException e) {
	                throw new MyException(e);
	         } 
	    }
	public static <T> T fromJSON(InputStream json, Class<T> clazz) {
		ObjectMapper mapper = new ObjectMapper();
		try {
			return mapper.readValue(json, clazz);
		} catch (JsonParseException e) {
			throw new MyException(e);
		} catch (JsonMappingException e) {
			throw new MyException(e);
		} catch (IOException e) {
			throw new MyException(e);
		}
	}

}
