<template>
    <div>
        <el-row class="page-header">
              <h3 class="text-info">跟进记录 </h3>
            
         </el-row>
         
         <div class="main-content" >
            <el-row style="margin-bottom:30px;">
                <el-popover
                    placement="bottom"
                    width="640"
                    v-model="showAddCommunicationForm"
                    trigger="manual">
                <add-communication @create-success="onCreateSuccess" @create-error="onCreateError" @cancel="showAddCommunicationForm=!showAddCommunicationForm" :customer_id="customer_id" v-if="showAddCommunicationForm"></add-communication>
             <el-button  slot="reference"  style="width:100%" type="" plain size="" icon="el-icon-plus" @click="onAddLog">添加记录</el-button>
                </el-popover>
            </el-row>
         <div v-loading="loading" element-loading-spinner="loading-index">
             <empty-data-view class="info-block" v-if="!communications||communications.count<1"><h3>暂时没有跟进记录</h3></empty-data-view>
             <el-row v-if="communications&&communications.count>0" class="block"> 
                 <el-table :show-header="true" ref="communications_table" :data="communications.rows" size="medium" :row-key="(row)=>row.id" >
                    <el-table-column prop="student_name" width="80" :show-overflow-tooltip="true" label="孩子">
                    </el-table-column>
                    <el-table-column prop="student_parent_name" width="80" :show-overflow-tooltip="true" label="家长">
                    </el-table-column>
                    <el-table-column width="120" :show-overflow-tooltip="true" label="联系电话">
                        <template slot-scope="scope">{{(scope.row.student_parent||{}).mobile}}</template>
                    </el-table-column>
                    <el-table-column prop="employee_name" width="80" :show-overflow-tooltip="true" label="顾问">
                    </el-table-column>
                    <el-table-column prop="communication_type" width="80"  label="沟通方式">
                        <template slot-scope="scope">{{scope.row.communication_type|communication_type}}</template>
                    </el-table-column>
                    <el-table-column prop="customer_type" width="50"  label="意向">
                    </el-table-column>
                    <el-table-column prop="communication_time" width="150"  label="沟通时间">
                        <template slot-scope="scope">
                          {{scope.row.communication_time|formatDateTime("YYYY-MM-DD H:mm")}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="next_communication_time" width="150"  label="下次跟进时间">
                        <template slot-scope="scope">{{scope.row.next_communication_time|formatDateTime("YYYY-MM-DD")}}</template>
                    </el-table-column>
                    <el-table-column prop="content" :show-overflow-tooltip="true" label="沟通内容">
                    </el-table-column>
                 </el-table>
             </el-row>
         </div>
         </div>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import AddCommunication from "./AddCommunication.vue";
export default {
  data() {
    return {
      loading: false,
      communications: [],
      showAddCommunicationForm: false
    };
  },
  computed: {
    ...mapState({
      schoolConsultants: state => state.school.schoolConsultants.data || [],
      current_school: state => state.current_user.current_school
    }),
    customer_id() {
      return this.$route.params.id;
    }
    // ...mapGetters(["regionName"])
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    ...mapActions({
      //   getRegions: "getRegions",
      //   getCustomerById: "getCustomerById",
      getCommunicationsByCustomerId: "getCommunicationsByCustomerId",
      createCommunication: "createCommunication"
    }),
    async loadData() {
      this.loading = true;
      try {
        let res = await this.getCommunicationsByCustomerId({
          customer_id: this.$route.params.id,
          school_id: this.current_school.id,
          limit: 50,
          offset: 0
        });
        if (res.code == 0) {
          this.communications = res.data || [];
        }
      } catch (err) {
        this.$notify.error("无法获取数据");
      } finally {
        this.loading = false;
      }
    },
    onAddLog() {
      this.showAddCommunicationForm = true;
    },
    onCreateSuccess() {
      this.showAddCommunicationForm = false;
      this.loadData();
    },
    onCreateError() {
      this.showAddCommunicationForm = false;
      this.$notify.error("添加记录失败");
    }
  },
  components: {
    AddCommunication
  },
  filters: {
    communication_type(val) {
      const communication_types = {
        0: "电话",
        1: "面谈",
        2: "QQ",
        3: "微信",
        4: "其它"
      };
      return communication_types[val] || "";
    }
  }
};
</script>

