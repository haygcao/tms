<template>
<div class="channel-list main-content">
    <el-row>
        <div class="page-breadcrumb clearfix">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>市场管理</el-breadcrumb-item>
                <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </el-row>
    <el-row>
        <el-form :inline="true" size="small" ref="searchForm" @keydown.native.enter.prevent="()=>{}" :model="searchForm">
            <el-form-item prop="name">
                    <el-input style="width:320px" clearable @keyup.enter.native="onSearchEnterPress"  v-model="searchForm.name" placeholder="渠道名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click.stop="onSearch"  icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="onAddChannel" icon="el-icon-circle-plus-outline">添加渠道</el-button>
            </el-form-item>
        </el-form>
    </el-row>

    <el-row>
        <div class="">
        <el-table ref="channel_table" :data="channelList.rows" size="medium" :row-key="(row)=>row.id" >

            <el-table-column type="index" label="" width="40">
            </el-table-column>
            <el-table-column prop="name" width="150" :show-overflow-tooltip="true" label="渠道名称">
            </el-table-column>
            <el-table-column width="100" label="">
              <template slot-scope="scope">
                <div class="channel-item-operate">
                  <el-tooltip class="item" effect="dark" content="编辑渠道" placement="top">
                <a @click="onUpdateChannel(scope.row)" type="text" size="small"><i class="el-icon-edit-outline"></i></a>
                  </el-tooltip>
                  <divider type="vertical"/>
                   <el-tooltip class="item" effect="dark" content="添加子渠道" placement="top">
                <a @click="onAddSubChannel(scope.row)" type="text" size="small"><i class="el-icon-tickets"></i></a>
                   </el-tooltip>
                </div>
                
              </template>
            </el-table-column>
            <el-table-column label="子渠道">
                <template slot-scope="scope">
                    <el-button class="sub-channel-tag" @click="onUpdateSubChannel(sub)" round :type="sub.state==1?'info':''" size="mini" v-for="sub in scope.row.market_sub_channels" :key="sub.id">{{sub.name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column width="80" label="状态">
                <template slot-scope="scope">
           <span :class="{'text-success':scope.row.state==1,'text-info':scope.row.state==0}"> {{scope.row.state==1?'启用':'禁用'}}</span>
          </template>
            </el-table-column>
            <el-table-column width="150" label="创建时间">
                <template slot-scope="scope">
            {{scope.row.created_at|formatDateTime("YYYY-MM-DD H:mm")}}
          </template>
             </el-table-column>
            <!-- <el-table-column fixed="right" label="" width="150">
                <template slot-scope="scope">
            <el-button @click="onUpdateChannel(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onAddSubChannel(scope.row)" type="text" size="small">添加子渠道</el-button>
          </template>
            </el-table-column> -->
        </el-table>
        </div>
    </el-row>
    <el-row>
        <div class="text-center">
            <el-pagination v-if="channelList.count" background @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next" :page-size="pageSize" :total="channelList.count">
            </el-pagination>
        </div>
    </el-row>
    <el-dialog :visible.sync="dialogAddMarketChannelVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">新增渠道</h2>
            <add-market-channel @success="onCreateSuccess"  v-if="dialogAddMarketChannelVisible" 
             @cancel="dialogAddMarketChannelVisible=false"></add-market-channel>
    </el-dialog>
     <el-dialog :visible.sync="dialogEditMarketChannelVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">编辑渠道</h2>
            <edit-market-channel @success="onUpdateSuccess"  v-if="dialogEditMarketChannelVisible" :channel_id="(selected_channel||{}).id"
             @cancel="dialogEditMarketChannelVisible=false"></edit-market-channel>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddMarketSubChannelVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">新增子渠道</h2>
            <add-sub-channel @success="onCreateSubChannelSuccess"  v-if="dialogAddMarketSubChannelVisible" :parent_channel="selected_channel"
             @cancel="dialogAddMarketSubChannelVisible=false"></add-sub-channel>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditMarketSubChannelVisible" :close-on-click-modal="false"  center >
            <h2 slot="title">编辑子渠道</h2>
            <edit-sub-channel @success="onUpdateSubChannelSuccess"  v-if="dialogEditMarketSubChannelVisible" :channel="selected_sub_channel"
             @cancel="dialogEditMarketSubChannelVisible=false"></edit-sub-channel>
    </el-dialog>
</div>
</template>

<script>
import AddMarketChannel from "@/views/market/AddMarketChannel.vue";
import AddSubChannel from "@/views/market/AddSubChannel.vue";
import EditMarketChannel from "@/views/market/EditMarketChannel.vue";
import EditSubChannel from "@/views/market/EditSubChannel.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        name: undefined
      },
      dialogAddMarketChannelVisible: false,
      dialogEditMarketChannelVisible: false,
      dialogAddMarketSubChannelVisible: false,
      dialogEditMarketSubChannelVisible: false,
      pageSize: 10,
      currentPage: 1,
      selected_channel: undefined,
      selected_sub_channel: undefined
    };
  },
  computed: {
    ...mapState({
      channelList: state => state.market_channel.list.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  watch: {
    // current_school(val, old) {
    //   if (val.id != old.id) {
    //     this.search();
    //   }
    // }
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    this.currentPage = to.params.page > 0 ? to.params.page : 1;
    this.searchForm = Object.assign(this.searchForm, to.query);
    this.search();
    next();
  },
  mounted() {
    // let query = this.$route.query;
    // this.searchForm = Object.assign({}, query);
    // this.currentPage = parseInt(this.$route.params.page);
    // this.search();
    this.currentPage =
      this.$route.params.page > 0 ? parseInt(this.$route.params.page) : 1;
    this.searchForm = Object.assign(
      {
        name: undefined
      },
      this.$route.query
    );

    this.search();
  },
  methods: {
    ...mapActions({
      getMarketChannelList: "getMarketChannelList"
      //   cancelOrder: "cancelOrder"
    }),

    onSearch() {
      this.currentPage = 1;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
      this.search();
    },
    search() {
      let payload = Object.assign({}, this.searchForm);
      payload.limit = this.pageSize;
      payload.offset = (this.currentPage - 1) * this.pageSize;
      payload.school_id = this.current_school.id;
      this.getMarketChannelList(payload);
    },
    onSearchEnterPress() {
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$router.push({
        name: this.$route.name,
        params: { page: this.currentPage },
        query: this.searchForm
      });
    },
    onAddChannel() {
      this.dialogAddMarketChannelVisible = true;
    },
    onCreateSuccess() {
      this.dialogAddMarketChannelVisible = false;
      this.$message.success("添加成功");
      this.onSearch();
    },
    onUpdateChannel(row) {
      this.selected_channel = row;
      this.dialogEditMarketChannelVisible = true;
    },
    onUpdateSuccess() {
      this.dialogEditMarketChannelVisible = false;
      this.$message.success("保存成功");
      this.onSearch();
    },
    onAddSubChannel(row) {
      this.dialogAddMarketSubChannelVisible = true;
      this.selected_channel = row;
    },
    onCreateSubChannelSuccess() {
      this.dialogAddMarketSubChannelVisible = false;
      this.$message.success("添加成功");
      this.onSearch();
    },
    onUpdateSubChannel(sub) {
      this.selected_sub_channel = sub;
      this.dialogEditMarketSubChannelVisible = true;
    },
    onUpdateSubChannelSuccess() {
      this.dialogEditMarketSubChannelVisible = false;
      this.$message.success("保存成功");
      this.onSearch();
    }
  },
  filters: {},
  components: {
    AddMarketChannel,
    EditMarketChannel,
    AddSubChannel,
    EditSubChannel
  }
};
</script>

<style>
.channel-list {
  background-color: #ffffff;
  height: fill-available;
}
.sub-channel-tag {
  margin: 3px;
}
.channel-item-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 160px;
}
.channel-item-operate {
  display: none;
}
.channel-item-operate a{
  padding: 5px;
}
.el-table__row:hover .channel-item-operate {
  display: block;
}
</style>

