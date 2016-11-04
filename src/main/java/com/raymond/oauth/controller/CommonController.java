package com.raymond.oauth.controller;

import com.google.common.io.BaseEncoding;
import com.google.common.io.Files;
import com.raymond.core.exception.MyException;
import com.raymond.oauth.db.model.User;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.UUID;

/**
 * 公共视图控制器
 * 
 * @author Raymond
 * 
 **/
@Controller
public class CommonController {
	@Value("${upload.img.path}")
	private String basePath;
	
	
    /**
     * 首页
     * 
     * @param request
     * @return
     */
    @RequestMapping({"/","/index"})
    public String index(HttpServletRequest request) {
        return "index";
    }
    @RequestMapping("/module/common-chpwd")
    public String password(){
    	return "module/common/chpwd";
    }

    @RequestMapping(value="js/umeditor/data/**/{date}/{name}", method=RequestMethod.GET)
	public void download(HttpServletRequest request, HttpServletResponse response,@PathVariable("date") String date,@PathVariable("name") String name) throws IOException{
		String url = request.getRequestURI();
    	File file = new File(new File(basePath),  date + "/" + name+url.substring(url.lastIndexOf(".")));
		if (!file.exists()) {
			throw new MyException("文件不存在");
		}
		if (request.getHeader("User-Agent").toLowerCase().indexOf("firefox") > 0) {
			name = new String(name.getBytes("utf-8"), "ISO8859-1");
		}
		response.addHeader("Content-Disposition", "attachment; filename="+ name);
		response.setContentType("application/unknow");
		FileInputStream fis = new FileInputStream(file);
		byte[] buff = new byte[1024 * 10];
		ServletOutputStream sos = response.getOutputStream();
		int len = 0;
		while ((len = fis.read(buff)) > 0) {
			sos.write(buff, 0, len);
		}
		fis.close();
		sos.flush();
		sos.close();

	}

    @RequestMapping("common/base64/upload")
	@ResponseBody
	public JSONObject uploadBase64(@RequestParam("filename") String filename,
			@RequestParam("base64") String base64){
		File temp = new File(this.basePath);
		if(!temp.exists()) temp.mkdirs();
		JSONObject file = new JSONObject();
		file.put("filename", filename);
		file.put("extName", Files.getFileExtension(filename));
		file.put("shortName", Files.getNameWithoutExtension(filename));
		
		File tempFile = new File(temp, UUID.randomUUID().toString() + "." + Files.getFileExtension(filename));
		file.put("tempName",tempFile.getName());
		try {
			Files.write(BaseEncoding.base64().decode(base64),tempFile);
			file.put("fileSize",tempFile.length());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return file;
	}
    @RequestMapping("/common/upload")
	@ResponseBody
    public JSONObject upload(User user,@RequestParam("file") MultipartFile[] files) throws IllegalStateException, IOException{
    	for(MultipartFile file : files){
    		if(file!=null){
        		File f = new File(basePath);
        		if(!f.isDirectory())f.mkdirs();
        		File localFile = new File(basePath+"/"+file.getOriginalFilename());
        		file.transferTo(localFile);
        	}
    	}
    	
    	JSONObject json = new JSONObject();
    	json.put("message", "上传成功");
    	return json;
    }
}