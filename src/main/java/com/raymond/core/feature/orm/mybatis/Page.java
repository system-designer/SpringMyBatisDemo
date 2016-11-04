package com.raymond.core.feature.orm.mybatis;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.RowBounds;

/**
 * Mybatis分页参数及查询结果封装. 注意所有序号从1开始.
 * 
 * @param <T>
 *            Page中记录的类型.
 * @author StarZou
 * @since 2014年5月18日 下午1:34:32
 **/
public class Page<T> extends RowBounds {
    // --分页参数 --//
    /**
     * 页编号 : 第几页
     */
    protected int pageNo = 1;
    /**
     * 页大小 : 每页的数量
     */
    protected int pageSize = 10;

    protected Object custom;

    // --结果 --//
    /**
     * 查询结果
     */
    protected List<T> content = new ArrayList<T>();
    
    protected List<String> pageSorts = new ArrayList<String>();

    /**
     * 总条数
     */
    protected int totalCount;

    /**
     * 总页数
     */
    protected int totalPages;

    // --计算 数据库 查询的参数 : LIMIT 3, 3; LIMIT offset, limit; --//
    protected int offset;
    protected int limit;

    // -- 构造函数 --//
    public Page() {
    	this.offset = (this.pageNo - 1) * this.pageSize;
        this.limit = this.pageSize;
    }

    public Page(int pageNo, int pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.offset = (this.pageNo - 1) * this.pageSize;
        this.limit = pageSize;
     }

    public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
		this.limit = this.pageSize;
		this.offset = (this.pageNo - 1) * this.pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
		this.limit = pageSize;
		this.offset = (this.pageNo - 1) * this.pageSize;
	}
    // -- 访问查询参数函数 --//
    /**
     * 获得当前页的页号,序号从1开始,默认为1.
     */
    public int getPageNo() {
        return pageNo;
    }

    /**
     * 获得每页的记录数量,默认为1.
     */
    public int getPageSize() {
        return pageSize;
    }

    /**
     * 根据pageNo和pageSize计算当前页第一条记录在总结果集中的位置,序号从1开始.
     */
    public int getFirst() {
        return ((this.pageNo - 1) * this.pageSize) + 1;
    }

   

    // -- 访问查询结果函数 --//
    /**
     * 取得页内的记录列表.
     */
    public List<T> getContent() {
        return content;
    }

    /**
     * 设置页内的记录列表.
     */
    public void setContent(final List<T> content) {
        this.content = content;
    }

    /**
     * 取得总记录数, 默认值为-1.
     */
    public int getTotalCount() {
        return totalCount;
    }

    /**
     * 设置总记录数.
     */
    public void setTotalCount(final int totalCount) {
        this.totalCount = totalCount;
        this.totalPages = this.getTotalPages();
    }

    /**
     * 根据pageSize与totalCount计算总页数, 默认值为-1.
     */
    public int getTotalPages() {
        if (totalCount < 0) {
            return -1;
        }
        int pages = totalCount / pageSize;
        return totalCount % pageSize > 0 ? ++pages : pages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    
    public String getPageSorts() {
		String sorts = "";
		for(String sort : pageSorts){
			sorts +=", " +sort;
		}
		if(!"".equals(sorts)){
			return sorts.substring(1);
		}
		return null;
	}

	public void setPageSorts(List<String> pageSorts) {
		this.pageSorts = pageSorts;
	}

	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}
	
	public Object getCustom() {
		return custom;
	}

	public void setCustom(Object custom) {
		this.custom = custom;
	}

	@Override
	public String toString() {
		return "Page [pageNo=" + pageNo + ", pageSize=" + pageSize
				+ ", content=" + content + ", pageSorts=" + pageSorts
				+ ", totalCount=" + totalCount + ", totalPages=" + totalPages
				+ ", offset=" + offset + ", limit=" + limit + "]";
	}
	
}
