<template>
    <div class="customer">
        <el-row class="page-header" style="padding-bottom:20px">
        <!-- <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>市场管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        
        <h3>客户管理 
        </h3>
          <el-button type="primary" size="small" @click="onAddCustomer" icon="el-icon-circle-plus-outline">添加客户</el-button>
        </el-row>
        <div class="main-content">
        <el-row>
            <el-form :inline="true" size="small" ref="searchForm" @keydown.native.enter.prevent="()=>{}" :model="searchForm">
                <el-form-item prop="keyword">
                        <el-input style="width:200px" clearable @keyup.enter.native="onSearchEnterPress"  v-model="searchForm.keyword" placeholder="孩子姓名/联系电话"></el-input>
                </el-form-item>
                <el-form-item prop="employee_id">
                       <el-select value-key="id" v-model="employee"  placeholder="顾问" clearable>
                        <el-option v-for="item in schoolConsultants" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item prop="type">
                       <el-select v-model="searchForm.type" placeholder="成交率" clearable>
                        <el-option v-for="item in Object.keys(customer_types)" :key="item" :label="customer_types[item]" :value="item"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item prop="state">
                       <el-select v-model="searchForm.state" placeholder="客户状态" clearable>
                        <el-option v-for="item in Object.keys(customer_states)" :key="item" :label="customer_states[item]" :value="item"></el-option>
                        </el-select>
                </el-form-item>
                <!-- <el-form-item prop="origin">
                       <el-select v-model="searchForm.employee_id" placeholder="来源" clearable>
                        <el-option v-for="item in schoolConsultants" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="danger" @click.stop="onSearch"  icon="el-icon-search">查询</el-button>
                </el-form-item>
                <el-form-item >
                </el-form-item>
            </el-form>
        </el-row>
        <el-row v-loading="loading" element-loading-spinner="loading-index">
        <div v-if="!loading" class="">
        <el-table ref="customer_table" :data="customerList.rows" size="medium" :row-key="(row)=>row.id" @selection-change="handleSelectionChange">>
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            label="家长"
            width="250">
            <template slot-scope="scope">
                <el-popover trigger="click" placement="top">
                <p class="parent-list-item" v-for="parent in scope.row.student_parents" :key="parent.id">
                    <span  class="pdr-10">({{parent.relation_type|parentRelation}})</span> {{ parent.name }}({{parent.mobile}})</p>
                <div slot="reference" class="name-wrapper">
                    <div><span  class="pdr-10">({{(scope.row.student_parents[0]||{}).relation_type|parentRelation}})</span>{{ (scope.row.student_parents[0]||{}).name }}({{(scope.row.student_parents[0]||{}).mobile}})</div>
                </div>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column label="孩子" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span size="mini" v-for="(child,index) in scope.row.students" :key="child.id"><divider v-if="index>0" type="vertical"/>{{child.name}}</span>
                </template>
            </el-table-column>
            <el-table-column width="70" label="成交率">
                <template slot-scope="scope">
                <span> {{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100" label="状态">
                <template slot-scope="scope">
                    {{scope.row.state|customer_state}}
                </template>
             </el-table-column>
              <el-table-column width="100" label="来源" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{scope.row.origin|customer_origin}}
                </template>
             </el-table-column>
             <el-table-column :show-overflow-tooltip="true" width="120" label="渠道">
                <template slot-scope="scope">
                    {{(scope.row.market_channel||{}).name}}
                </template>
             </el-table-column>
             <el-table-column width="120" label="顾问">
                <template slot-scope="scope">
                    {{(scope.row.customer_distributes[0]||{}).employee_name}}
                </template>
             </el-table-column>
             <el-table-column width="150" label="添加时间">
                <template slot-scope="scope">
                    {{scope.row.created_at|formatDateTime("YYYY-MM-DD")}}
                </template>
             </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                    <a @click="onShow(scope.row)" type="text" style="padding:8px;"><i class="el-icon-document"></i></a>
                    </el-tooltip>
                    <divider type="vertical"/>
                    <el-tooltip class="item" effect="dark" content="跟进" placement="top">
                    <a @click="onAddLog(scope.row)" type="text" style="padding:8px;"><i class="el-icon-edit"></i></a>
                    </el-tooltip>
                    <divider type="vertical"/>
                    <el-dropdown>
                      <span class="el-dropdown-link" style="padding:2 5px;">
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><a @click="onBookAudition(scope.row)">试听</a></el-dropdown-item>
                        <el-dropdown-item ><a @click="onContract(scope.row)">签单</a></el-dropdown-item>
                        <el-dropdown-item ><a @click="onRedistribute(scope.row)">转派</a></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        </div>
        </el-row>
        <el-row v-if="!loading">
            <div class="text-center">
                <el-pagination v-if="customerList.count" background @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSize" :total="customerList.count">
                </el-pagination>
            </div>
        </el-row>
        <el-dialog :visible.sync="dialogAddLogVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">添加记录</h2>
             <add-communication @create-success="onCreateLogSuccess" @create-error="onCreateLogError" @cancel="dialogAddLogVisible=!dialogAddLogVisible" :customer_id="current_customer_id" v-if="dialogAddLogVisible"></add-communication>
        </el-dialog>
         <el-dialog :visible.sync="dialogRedistributeVisible" :close-on-click-modal="false" >
            <h4 slot="title">选择要分配的顾问</h4>
             <el-form size="" :model="redistributeForm" ref="redistributeForm">
                <el-form-item prop="employee" label="选择顾问" :rules="[{required:true,message: '选择顾问',trigger: 'change'}]">
                       <el-select value-key="id" v-model="redistributeForm.employee"  placeholder="顾问">
                        <el-option v-for="item in schoolConsultants" :key="item.id" :label="item.name" :value="item"></el-option>
                        </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <el-button @click="onSubmitRedistribute">提交</el-button>
                </el-form-item> -->
             </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmitRedistribute">确 定</el-button>
              </span>
        </el-dialog>
    </div>
    </div>
</template>
<script>
import { MarketChannelOrigin } from "@/lib/constants";
import { mapGetters, mapState, mapActions } from "vuex";
import AddCommunication from "./AddCommunication.vue";
export default {
  data() {
    return {
      dialogRedistributeVisible: false,
      dialogAddLogVisible: false,
      current_customer_id: undefined,
      loading: false,
      redistributeForm: { customer_list: [], employee: undefined },
      searchForm: {
        keyword: undefined,
        // employee:undefined,
        employee_id: undefined,
        student_birthday_begin: undefined,
        student_birthday_end: undefined,
        state: undefined,
        type: undefined,
        market_channel_id: undefined
      },
      employee: undefined,
      customer_types: {
        A: "A意向强烈",
        B: "B有意向",
        C: "C一般",
        D: "无效"
      },
      customer_states: {
        0: "未联系",
        1: "跟踪中",
        2: "预约试听",
        3: "试听未签单",
        4: "已签单"
      },
      multipleSelectionCustomer: [],
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {
    ...mapState({
      schoolConsultants: state => state.school.schoolConsultants.data || [],
      channelList: state => state.market_channel.list.data || [],
      customerList: state => state.customer.list.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);

    this.search();
    next();
  },
  async mounted() {
    // this.getMarketChannelList();
    this.getConsultants({ school_id: this.current_school.id });
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign(
      {
        keyword: undefined,
        employee_id: undefined,
        student_birthday_begin: undefined,
        student_birthday_end: undefined,
        state: undefined,
        type: undefined,
        market_channel_id: undefined
      },
      this.$route.query
    );
    this.employee = this.schoolConsultants.find(
      v => v.id == this.searchForm.employee_id
    );
    this.searchForm.employee_id = undefined;
    // this.employee = {
    //   id: this.searchForm.employee_id
    // };
    this.search();
    this.$on("do_search", this.onSearch);
  },
  methods: {
    ...mapActions({
      getConsultants: "getConsultants",
      getMarketChannelList: "getMarketChannelList",
      searchCustomerList: "searchCustomerList",
      batchDistibuteCustomerToEmployee: "batchDistibuteCustomerToEmployee"
    }),
    handleSelectionChange(val) {
      this.multipleSelectionCustomer = val;
    },
    onTypeChanged() {
      this.$emit("do_search");
    },
    onStateChanged() {
      this.$emit("do_search");
    },
    async onSearch() {
      this.currentPage = 1;
      if (this.employee && this.employee.id) {
        this.searchForm.employee_id = this.employee.id;
      } else {
        this.searchForm.employee_id = undefined;
      }
      this.$router.push({
        params: { page: this.currentPage },
        query: Object.assign(this.searchForm, {
          _r: parseInt(Date.now() / 1000)
        })
      });

      //   this.search();
    },
    async search() {
      this.loading = true;
      let payload = Object.assign({}, this.searchForm);

      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      this.$nextTick(() => {
        this.searchCustomerList(payload).finally(res => {
          this.loading = false;
        });
      });
    },
    async onSearchEnterPress() {
      this.onSearch();
    },
    async onAddCustomer() {
      this.$router.push({ name: "customer_create" });
    },
    async onShow(row) {
      this.$router.push({
        name: "customer_detail",
        params: { id: row.customer_id }
      });
    },
    async onAddLog(row) {
      this.current_customer_id = row.customer_id;
      this.dialogAddLogVisible = true;
    },
    onCreateLogSuccess() {
      this.dialogAddLogVisible = false;
      this.$notify.success("提交成功");
      this.$nextTick(_ => {
        this.search();
      });
    },
    onCreateLogError() {
      this.dialogAddLogVisible = false;
      this.$notify.error("提交失败");
    },
    async onRedistribute(row) {
      this.dialogRedistributeVisible = true;
      this.redistributeForm.customer_list = [
        {
          customer_id: row.customer_id,
          employee_id: (row.customer_distributes[0] || {}).employee_id
        }
      ];
    },
    onSubmitRedistribute() {
      this.$refs["redistributeForm"].validate(valid => {
        if (valid) {
          let payload = Object.assign(
            { school_id: this.current_school.id },
            this.redistributeForm
          );
          this.batchDistibuteCustomerToEmployee(payload).then(res=>{
            if(res&&res.code==0){
              this.$notify.success('提交成功');
            }
            this.dialogRedistributeVisible = false;
          })
        }
      });
    },
    async onContract(row) {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    }
  },
  filters: {
    customer_type(val) {
      const _ = {
        A: "A意向强烈",
        B: "B有意向",
        C: "C一般",
        D: "无效"
      };
      return _[val] || "";
    },
    customer_state(val) {
      const _ = {
        0: "未联系",
        1: "跟踪中",
        2: "预约试听",
        3: "试听未签单",
        4: "已签单"
      };
      return _[val] || "";
    },
    customer_origin(val) {
      return MarketChannelOrigin[val] || "";
    }
  },
  components: {
    AddCommunication
  }
};
</script>
<style scoped>
.parent-list-item:not(:last-child) {
  border-bottom: 1px solid #cccccc;
}
.pd-20 {
  padding: 20px;
}
.pdr-10 {
  padding-right: 10px;
}
</style>


