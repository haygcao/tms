<template>
    <div >
         <el-row class="page-header">
              <h3 class="text-info">客户信息 </h3>
         </el-row>
         <div class="main-content" v-loading="loading" element-loading-spinner="loading-index">
             <empty-data-view v-if="!customer||!customer.customer_id"><h3>
                 <el-alert v-if="!loading"
                        title="无法获取客户信息"
                        type="error"
                        :closable="false"
                        show-icon>
                    </el-alert>
                 </h3></empty-data-view>
             <div v-else>
        <h3>孩子信息 <el-button  size="mini" icon="el-icon-plus">添加孩子</el-button></h3>
         <!-- <el-row>
             <el-col style="padding:5px"  :xs="24" :sm="12" :md="8" :lg="8" v-for="item in customer.students" :key="item.id">
             <student-card :student="item" >
                 <div slot="toolbar">
                     <a @click="onRemoveStudent(item)" title="删除"><i class="el-icon-delete"></i></a>
                    <divider type="vertical"/>
                     <a @click="onEditStudent(item)" title="修改"><i class="el-icon-edit-outline"></i></a>
                 </div>
             </student-card>
             </el-col>
         </el-row> -->
         <el-row class="block">
             <el-table ref="parents_table" :data="customer.students||[]" size="medium" :row-key="(row)=>row.id" width="auto">

             <el-table-column prop="name" width="120"  :show-overflow-tooltip="true" label="姓名">
            </el-table-column>
            <el-table-column  label="" width="120">
                <template slot-scope="scope">
                <div class="">
                  <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <a @click="onEditStudent(scope.row)" type="text" size="small"><i class="el-icon-edit-outline"></i></a>
                  </el-tooltip>
                  <divider type="vertical"/>
                   <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <a @click="onRemoveStudent(scope.row)" type="text" size="small"><i class="el-icon-delete"></i></a>
                   </el-tooltip>
                </div>
              </template>
            </el-table-column>
           
            <el-table-column width="120" :show-overflow-tooltip="true" label="昵称" prop="nickname">
            </el-table-column>
            <el-table-column width="120" :show-overflow-tooltip="true"  prop="name_en" label="英文名">
            </el-table-column>
            <el-table-column width="" :show-overflow-tooltip="true"  prop="birthday" label="生日">
                <template slot-scope="scope">{{scope.row.birthday}}({{scope.row.birthday|age}})</template>
            </el-table-column>
            
        </el-table>
         </el-row>
         <h3>家长信息 <el-button size="mini" icon="el-icon-plus">添加家长</el-button></h3>
         <el-row class="block">
             <el-table ref="parents_table" :data="customer.student_parents||[]" size="medium" :row-key="(row)=>row.id" width="auto">

            <el-table-column prop="relation_type" label="#" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.relation_type|parentRelation}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="" width="120">
                <template slot-scope="scope">
                <div class="channel-item-operate">
                  <el-tooltip class="item" effect="dark" content="修改" placement="top">
                <a @click="onUpdateParent(scope.row)" type="text" size="small"><i class="el-icon-edit-outline"></i></a>
                  </el-tooltip>
                  <divider type="vertical"/>
                   <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <a @click="onRemoveParent(scope.row)" type="text" size="small"><i class="el-icon-delete"></i></a>
                   </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" width="120"  :show-overflow-tooltip="true" label="姓名">
            </el-table-column>
            <el-table-column width="120" label="电话" prop="mobile">
            </el-table-column>
            <el-table-column width="120" :show-overflow-tooltip="true"  prop="email" label="邮箱">
            </el-table-column>
            <el-table-column width="" :show-overflow-tooltip="true"  prop="wechat" label="微信">
            </el-table-column>
            
        </el-table>
         </el-row>
         <h3>其它信息 <el-button size="mini" icon="el-icon-edit-outline">修改</el-button></h3>
         <el-row class="block" style="">
             <el-form size="small" label-width="100px">
                 <el-form-item  label="顾问" >
                       <label>{{customer.customer_distributes[0].employee_name}}</label>
                    </el-form-item>
                    <el-form-item label="来源" >
                         <label>{{customer.origin|customer_origin}}</label>
                    </el-form-item>
                    <el-form-item v-if="customer.market_channel_id" label="渠道" >
                        <label>{{(customer.market_channel||{}).name}}</label>
                    </el-form-item>
                    <el-form-item v-if="customer.market_sub_channel_id"  label="子渠道">
                       <label>{{(customer.market_sub_channel||{}).name}}</label>
                    </el-form-item>
                    <el-form-item label="客户意向" >
                       <label>{{customer.type|customer_type}}</label>
                    </el-form-item>
                    
                   <el-form-item label="地区">
                        <label>{{regionName(customer.customer.province_code)}}</label><label>{{regionName(customer.customer.city_code)}}</label>
                    </el-form-item>
                    <el-form-item label="详细地址">
                       <label>{{customer.customer.address}}</label>
                    </el-form-item>
                    
                    <el-form-item label="推荐人">
                         <label>{{customer.referrer}}</label>
                    </el-form-item>
                    <el-form-item label="备注">
                      <label>{{customer.description}}</label>
                    </el-form-item>
             </el-form>
         </el-row>
         </div>
         </div>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { MarketChannelOrigin } from "@/lib/constants";
import StudentCard from "./StudentCard.vue";
export default {
  data() {
    return {
      loading: true,
      customer: {}
    };
  },
  computed: {
    ...mapState({
      schoolConsultants: state => state.school.schoolConsultants.data || [],
      channelList: state => state.market_channel.list.data || [],
      current_school: state => state.current_user.current_school
    }),
    ...mapGetters(["regionName"])
  },

  async mounted() {
    this.loading = true;
    try {
      let res = await this.getCustomerById({
        id: this.$route.params.id,
        school_id: this.current_school.id
      });
      if (res && res.code == 0) {
        this.customer = res.data;
      } else {
        this.customer = null;
      }
    } catch (err) {
      this.customer = null;
      this.$notify.error("获取数据出错");
    } finally {
      this.loading = false;
    }

    this.getRegions();
  },
  methods: {
    ...mapActions({
      getRegions: "getRegions",
      getCustomerById: "getCustomerById",
      getMarketChannelList: "getMarketChannelList",
      searchCustomerList: "searchCustomerList"
    }),
    onRemoveStudent(item) {},
    onEditStudent(item) {},
    onUpdateParent(item) {},
    onRemoveParent(item) {}
  },
  components: {
    StudentCard: StudentCard
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
  }
};
</script>

<style scoped>
.img-circle {
  background-color: #ebeef5;
  border: 1px solid #e4e7ed;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  border-radius: 50%;
  display: inline-block;
  height: 60px;
  width: 60px;
  background-color: rgb(121, 199, 183);
}
</style>
