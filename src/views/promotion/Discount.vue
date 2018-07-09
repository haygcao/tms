<template>
    <div class="promotion">
        <vue-headful title="促销折扣-睿乐教育" description="睿乐教育" />
        <el-row >
            <div class="page-breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>业务管理</el-breadcrumb-item>
                <el-breadcrumb-item>折扣设置</el-breadcrumb-item>
            </el-breadcrumb>
            </div>
        </el-row>
        <el-row><h3>连报折扣</h3></el-row>
        <el-row v-for="(discount,index) in discounts" :key="index" >
            <el-form size="small" :inline="true" :model="discount" class="demo-form-inline">
                <el-form-item>
                    <span name="label">单个订连报课次数&ge;</span>
                    <el-input-number :precision="0" :min="1" @change="onDiscountChanged(discount)" :max="300" controls-position="right" v-model="discount.min_quantity"></el-input-number>
                    <!-- <el-input v-model="newDiscountForm.min_quantity" style="width:80px;" placeholder=""></el-input> -->
                </el-form-item>
                <el-form-item>
                    <span name="label">享受折扣率</span>
                    <el-input-number :precision="0" :min="1" :max="100" @change="onDiscountChanged(discount)" controls-position="right" v-model="discount.discount_percent"></el-input-number>%
                </el-form-item>
                <el-form-item>
                    <el-tooltip class="item" effect="dark" content="删除折扣" placement="top">
                    <el-button type="warning" size="small" @click="onRemoveDiscount(discount)" icon="el-icon-delete"></el-button>
                    </el-tooltip>
                    <el-button type="danger" v-show="discount.dirty" @click="onUpdateDiscount(discount)">保存</el-button>
                    <span class="text-danger text-small margin-l-10">{{discount|discount_name}}</span>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
             <el-tooltip class="item" effect="dark" content="添加折扣" placement="top">
            <el-button v-show="!addNewDiscount" type="danger" size="small" @click="onAddDiscount" icon="el-icon-plus"></el-button>
             </el-tooltip>
        </el-row>
        <el-row v-if="addNewDiscount">
            <el-form size="small" :inline="true" :model="newDiscountForm" class="demo-form-inline">
                <el-form-item>
                    <span name="label">单个订连报课次数&ge;</span>
                    <el-input-number :precision="0" :min="1" :max="300" controls-position="right" v-model="newDiscountForm.min_quantity"></el-input-number>
                    <!-- <el-input v-model="newDiscountForm.min_quantity" style="width:80px;" placeholder=""></el-input> -->
                </el-form-item>
                <el-form-item>
                    <span name="label">享受折扣率</span>
                    <el-input-number :precision="0" :min="1" :max="100" controls-position="right" v-model="newDiscountForm.discount_percent"></el-input-number>%
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" v-show="newDiscountForm.min_quantity&&newDiscountForm.discount_percent" @click="onSubmitDiscount">保存</el-button>
                    <span class="text-danger text-small margin-l-10" v-if="newDiscountForm.min_quantity&&newDiscountForm.discount_percent">{{newDiscountForm|discount_name}}</span>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      addNewDiscount: false,
      newDiscountForm: {
        min_quantity: undefined,
        discount_percent: undefined,
        subject: undefined,
        class_type: undefined,
        title: undefined,
        discount_type: 1
      },
      discounts: []
    };
  },
  computed: {
    ...mapState({
      //   discounts: state => state.discount.list.data || [],
      current_school: state => state.current_user.current_school
    })
  },
  mounted() {
    this.loadDiscounts();
  },
  methods: {
    ...mapActions({
      createDiscount: "createDiscount",
      removeDiscount: "removeDiscount",
      updateDiscount: "updateDiscount",
      getDiscountList: "getDiscountList"
    }),
    loadDiscounts() {
      this.addNewDiscount = false;
      this.getDiscountList({ school_id: this.current_school.id }).then(res => {
        this.discounts = (res.data || []).map(v => {
          return Object.assign({}, v);
        });
      });
    },
    onDiscountChanged(discount) {
      discount.dirty = true;
    },
    onUpdateDiscount(discount) {
      let self = this;
      let payload = Object.assign({}, discount);
      let disct =
        ~~(payload.discount_percent / 10) === payload.discount_percent / 10
          ? ~~(payload.discount_percent / 10)
          : payload.discount_percent / 10;
      payload.title = `满${payload.min_quantity}次课享${disct}折`;
      this.updateDiscount(payload).then(res => {
        if (res && res.code == 0 && res.data == true) {
          self.$message.success("保存成功！");
          return this.loadDiscounts();
        } else if (res && res.code == 0 && res.data == false) {
          self.$message.warning("存在相似的折扣设置");
          return this.loadDiscounts();
        }
        self.$message.error("保存失败！");
      });
    },
    onAddDiscount() {
      this.addNewDiscount = true;
    },
    onRemoveDiscount(discount) {
      this.removeDiscount(discount).then(res => {
        if (res && res.code == 0) {
          this.$message.success("删除成功！");
          return this.loadDiscounts();
        }
        this.$message.error("删除失败！");
      });
    },
    onSubmitDiscount() {
      let self = this;
      let payload = Object.assign({}, self.newDiscountForm);
      payload.school_id = self.current_school.id;
      let disct =
        ~~(payload.discount_percent / 10) === payload.discount_percent / 10
          ? ~~(payload.discount_percent / 10)
          : payload.discount_percent / 10;
      payload.title = `满${payload.min_quantity}次课享${disct}折`;
      this.createDiscount(payload).then(res => {
        if (res && res.code == 0 && res.data == true) {
          self.$message.success("保存成功！");
          return this.loadDiscounts();
        } else if (res && res.code == 0 && res.data == false) {
          self.$message.warning("存在相似的折扣设置");
          return this.loadDiscounts();
        }
        self.$message.error("保存失败！");
      });
    }
  },
  filters: {
    discount_name(payload) {
      let disct =
        ~~(payload.discount_percent / 10) === payload.discount_percent / 10
          ? ~~(payload.discount_percent / 10)
          : payload.discount_percent / 10;
      return `满${payload.min_quantity}次课享${disct}折`;
    }
  }
};
</script>
<style scoped>
.margin-l-10 {
  margin-left: 10px;
}
</style>



