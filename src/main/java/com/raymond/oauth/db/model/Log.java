package com.raymond.oauth.db.model;

public class Log {
    private Long id;

    private Long user;

    private String userName;

    private String createTime;

    private String ip;

    private String methodText;

    private String signature;

    private Integer status;

    private String code;

    private String parames;

    private String result;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime == null ? null : createTime.trim();
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip == null ? null : ip.trim();
    }

    public String getMethodText() {
        return methodText;
    }

    public void setMethodText(String methodText) {
        this.methodText = methodText == null ? null : methodText.trim();
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature == null ? null : signature.trim();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getParames() {
        return parames;
    }

    public void setParames(String parames) {
        this.parames = parames == null ? null : parames.trim();
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result == null ? null : result.trim();
    }

	@Override
	public String toString() {
		return "Log [user=" + user + ", userName=" + userName + ", createTime="
				+ createTime + ", ip=" + ip + ", methodText=" + methodText
				+ ", signature=" + signature + ", status=" + status + ", code="
				+ code + ", parames=" + parames + ", result=" + result + "]";
	}
    
    
}