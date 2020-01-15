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
            <el-button type="info" icon="el-icon-share" @click="shareDialogFormVisible = false">
              <el-dialog title="分享设置" :visible.sync="shareDialogFormVisible">
                <el-form :model="shareForm">
                  <el-form-item label="分享用户" :label-width="'100px'">
                    <el-input auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="分享感言" :label-width="'100px'">
                    <el-select placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="shareDialogFormVisible = false">取 消</el-button>
                  <el-button type="primary">确 定</el-button>
                </div>
              </el-dialog>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="del"></el-button>
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
      totoalPage: 0,
      shareDialogFormVisible: false
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    edit(data) {
      this.$router.push({path:`postPublish/${data.id}`})
    },
    del(){
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    shareForm() {
      //this.shareDialogFormVisible = false;
    },
    share() {
      //this.shareDialogFormVisible = true;
    },
    async getdata() {
      let res = await getPostList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      });
      console.log(res);
      this.postlist = res.data.data;
      this.totoalPage = res.data.total;
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getdata();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.getdata();
    }
  }
};
</script>
<style>
</style>