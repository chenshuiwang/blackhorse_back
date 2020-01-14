<template>
  <div class="postlist">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="postlist" style="width: 100%" border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="title" label="标题" width="580"></el-table-column>
      <el-table-column prop="type" label="类型" width="50">
        <template slot-scope="scope">{{scope.row.type===1?'文章':'视频'}}</template>
      </el-table-column>
      <el-table-column prop="user.nickname" label="作者" width="180"></el-table-column>
      <el-table-column prop="create_date" label="发布时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分享" placement="top">
            <el-button type="info" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[2,4,6,8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totoalPage"
    ></el-pagination>
  </div>
</template>

<script>
import { getPostList } from "../apis/article.js";
export default {
  data() {
    return {
      postlist: [],
      pageSize: 2,
      pageIndex: 1,
      totoalPage: 12
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    edit(data) {
      console.log(data);
    },
    async getdata() {
      let res = await getPostList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      });
      //console.log(res);
      this.postlist = res.data.data;
      console.log(this.postlist)
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getdata()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
       this.pageIndex = val;
       this.getdata()
    }
  }
};
</script>
<style>
</style>