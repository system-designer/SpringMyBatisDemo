package com.raymond.oauth.db.model;

public class Codeitem {
    private Long id;

    private String code;

    private String codemap;

    private String name;

    private String sort;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getCodemap() {
        return codemap;
    }

    public void setCodemap(String codemap) {
        this.codemap = codemap == null ? null : codemap.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort == null ? null : sort.trim();
    }

	@Override
	public String toString() {
		return "Codeitem [id=" + id + ", code=" + code + ", codemap=" + codemap
				+ ", name=" + name + ", sort=" + sort + "]";
	}
    
    
}