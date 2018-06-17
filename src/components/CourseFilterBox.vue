<template>
    <div class="search-block">
      <div class="search-row">
        <div class="search-row-title">学科</div>
        <div class="search-conditions">
        <router-link class="search-item" :class="{'active': searchForm.subject==undefined}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{subject:undefined})}">全部</router-link>
        <router-link class="search-item" :class="{'active': searchForm.subject==item.key}"   :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{subject:item.key})}" v-for="item in subjects" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">年级</div>
        <div class="search-conditions">
        <router-link class="search-item" :class="{'active': searchForm.grade==undefined}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{grade:undefined})}">全部</router-link>
        <router-link class="search-item" :class="{'active': searchForm.grade==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{grade:item.key})}" v-for="item in subjectGrades" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">学期</div>
        <div class="search-conditions">
        <router-link class="search-item" :class="{'active': searchForm.term==undefined}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{term:undefined})}">全部</router-link>
        <router-link class="search-item" :class="{'active': searchForm.term==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{term:item.key})}" v-for="item in terms" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      <div class="search-row">
        <div class="search-row-title">班型</div>
        <div class="search-conditions">
        <router-link class="search-item" :class="{'active': searchForm.class_type==undefined}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{class_type:undefined})}">全部</router-link>
        <router-link class="search-item" :class="{'active': searchForm.class_type==item.key}" :to="{name:$route.name,params:{page:1},query:Object.assign({},searchForm,{class_type:item.key})}" v-for="item in class_types" :key="item.key">{{item.name}}</router-link>
        </div>
      </div>
      </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "course-filter",
  props: {
    searchForm: {
      Object,
      default: function() {
        return {
          term: undefined,
          grade: undefined,
          subject: undefined,
          class_type: undefined
        };
      }
    }
  },
  data() {
    return {
      //   searchForm: Object.assign(
      //     {
      //       term: undefined,
      //       grade: undefined,
      //       subject: undefined,
      //       class_type: undefined
      //     },
      //     this.model
      //   )
      // subjectGrades: []
    };
  },
  computed: {
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "course_settings"
    ]),
    subjectGrades() {
      let sub = this.course_settings.find(
        v => v.key == this.searchForm.subject
      );
      return sub ? sub.grades : [];
    }
  },
  watch: {
    // "searchForm.subject": {
    //   handler: function(val, old) {
    //     console.log("searchForm.subject", val, this.course_settings);
    //     let sub = this.course_settings.find(
    //       v => v.key == this.searchForm.subject
    //     );
    //     this.subjectGrades = sub ? sub.grades : [];
    //   }
    // }
  }
};
</script>
<style scoped>
.search-block {
  /* border: 1px solid #e4e7ed; */
  font-size: 14px;
  background-color: #ffffff;
}
.search-block .search-row {
  padding: 10px 5px;
  border-bottom: 1px dashed #e4e7ed;
}
.search-block .search-row::before,
.search-block .search-row::after {
  content: "";
  display: table;
  line-height: 0;
}
.search-block .search-row::after {
  clear: both;
}
.search-block .search-conditions {
  padding-left: 90px;
}
.search-block .search-row:last-child {
  border-bottom: transparent;
}
.search-block .search-row-title {
  color: #909399;
  text-align: right;
  width: 60px;
  margin-right: 30px;
  float: left;
}
.search-block a:hover {
  color: #409eff;
}
.search-block a:visited {
  color: #303133;
}
.search-block a {
  color: #303133;
}
.search-block a.active {
  color: #409eff;
  /* color: #ffffff;
    background-color: #409eff;
    padding: 2px 5px;
    border-radius: 2px; */
}
.search-block .search-item {
  text-decoration: none;
  margin: 10px 30px 10px 0;
}
</style>

