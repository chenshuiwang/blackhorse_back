<template>
  <div class="postpublish">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-form ref="post" :model="post" label-width="80px">
        <el-form-item label="标题：">
          <el-input v-model="post.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-radio-group v-model="post.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="内容：">
          <div id="app">
            <VueEditor :config="config" v-if="post.type===1" ref="myeditor" />
            <el-upload
              class="upload-demo"
              action="http://localhost:3000/upload"
              :headers="getToken()"
              :onsuccess="handlesuccess"
              v-if="post.type===2"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="栏目：">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="post.categories" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in catelist" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="封面：">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/upload"
            :headers="getToken()"
            :on-success="fengmian"
            :on-remove="removePost"
            list-type="picture-card"
            :file-list="post.cover"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-button
          type="primary"
          @click="publishPost"
          style="float:right;margin-bottom:20px"
        >{{btntext}}</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
import { getCategory } from "../apis/cate.js";
import { publishPost } from "../apis/article.js";
import { getArticleById, editArticleById } from "../apis/article.js";
export default {
  data() {
    return {
      btntext: "发布文章",
      catelist: [],
      post: {
        title: "",
        type: 1,
        content: "",
        categories: [],
        cover: []
      },
      config: {
        // 上传图片的配置
        uploadImage: {
          url: "http://localhost:3000/upload",
          name: "file",
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert("http://localhost:3000" + res.data.data.url);
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: "http://localhost:3000/upload",
          name: "file",
          headers: this.getToken(),
          uploadSuccess(res, insert) {
            insert("http://localhost:3000" + res.data.data.url);
          }
        }
      },
      isIndeterminate: true,
      checkAll: false
    };
  },
  components: {
    VueEditor
  },
  methods: {
    getToken() {
      let token = localStorage.getItem("login_token");
      return { Authorization: token };
    },
    handleCheckAllChange(val) {
      //console.log(val);
      this.post.categaries = val
        ? this.catelist.map(value => {
            return value.id;
          })
        : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      //console.log(value);
      let checkCount = value.length;
      this.checkAll = checkCount === this.catelist.length;
      this.isIndeterminate =
        checkCount > 0 && checkCount < this.catelist.length;
    },
    async publishPost() {
      if (this.$route.params.id) {
        console.log(this.$route.params.id);
        this.post.categories = this.post.categories.map(value => {
          return { id: value };
        });
        let res = await editArticleById(this.$route.params.id, this.post);
        console.log(res);
        if (res.data.message === "文章编辑成功") {
          this.$message.success("修改成功");
          this.$router.push({ name: "Postlist" });
        }
      } else {
        if (this.post.type === 1) {
          this.post.content = this.$refs.myeditor.editor.root.innerHTML;
        }
        this.post.categories = this.post.categories.map(value => {
          return { id: value };
        });
        //console.log(this.post);
        let res = await publishPost(this.post);
        console.log(res);
        if (res.data.message === "文章发布成功") {
          this.$message.success("文章发表成功");
          this.$router.push({ name: "Postlist" });
        }
      }
    },
    handlesuccess(response) {
      if (response.message === "文件上传成功") {
        this.post.content = "http://127.0.0.1:3000" + response.data.url;
      }
    },
    fengmian(response) {
      console.log(response);
      response.data.url = "http://127.0.0.1:3000" + response.data.url;

      if (response.message === "文件上传成功") {
        this.post.cover.push({ id: response.data.id, url: response.data.url });
      }
    },
    removePost(file) {
      console.log(file);
      let id;
      if (this.$route.params.id) {
        id = file.id;
      } else {
        id = file.response.data.id;
      }
      for (let i = 0; i < this.post.cover.length; i++) {
        if (this.post.cover[i].id === id) {
          this.post.cover.splice(i, 1);
        }
      }
    }
  },
  async mounted() {
    let res = await getCategory();
    //console.log(res);
    this.catelist = res.data.data.splice(2);
    let obj = this.$route.params;
    //console.log(obj);
    if (obj.id) {
      let post = await getArticleById(obj.id);
      this.post = post.data.data;
      console.log(212313)
    } else {
      return;
    }
    //console.log(this.post.cover);
    if (this.post.type === 1) {
      this.$refs.myeditor.editor.clipboard.dangerouslyPasteHTML(
        0,
        this.post.content
      );
      this.btntext = "编辑文章";
      this.post.categories = this.post.categories.map(value => {
        return value.id;
      });
    }
    if (
      this.post.categories.length === this.catelist.length ||
      this.post.categories.length === 0
    ) {
      this.isIndeterminate = false;
    }
    this.post.cover.forEach(value => {
      if (value.url.indexOf("http") === -1) {
        value.url = "http://127.0.0.1:3000" + value.url;
      }
    });
  }
};
</script>

<style lang='less' scoped>
.box-card {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>