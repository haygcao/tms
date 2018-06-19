<template>
    <div class="course-list">
  <el-row>
     <div class="page-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      </el-breadcrumb>
     </div>
  </el-row>
  <el-row>
      <el-popover
          placement="bottom"
          width="320"
          trigger="click">
          <el-form size="small" :model="createProductForm" label-position="top" ref="createProductForm">
            <el-form-item label="学科" prop="subject">
                <el-select v-model="createProductForm.subject">
                    <el-option v-for="item in course_settings" :key="item.key" :label="item.name" :value="item.key.toString()"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班型" prop="class_type" >
                <el-select v-model="createProductForm.class_type">
                    <el-option v-for="item in class_types" :key="item.key" :value="item.key.toString()" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价(元)" prop="price" >
                <el-input type="number" v-model="createProductForm.price" style="width:200px;" :min="1" :max="100" label="课次单价"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitCreateProduct">确定</el-button>
              </el-form-item>
          </el-form>
        <el-button slot="reference" @click="onCreateProduct" icon="el-icon-plus" type="danger" size="small" round>添加产品</el-button>
        </el-popover>
  </el-row>
  <el-row>
  <el-table
    :data="productList"
    stripe
    border=""
    style="width: 100%">
     <el-table-column
      label="学科">
       <template slot-scope="scope">
          {{ scope.row.subject|subjectName }}
      </template>
    </el-table-column>
    <el-table-column
      label="班型">
       <template slot-scope="scope">
          {{ scope.row.class_type|classType }}
      </template>
    </el-table-column>
    <el-table-column
      label="单价">
       <template slot-scope="scope">
          {{ scope.row.price|money }}
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
          <el-popover
          placement="left"
          width="320"
          trigger="click">
          <el-form size="small" :model="updateProductForm" label-position="top" :ref="scope.row.id">
            <el-form-item label="单价(元)" prop="price" >
                <el-input type="number" v-model="updateProductForm.price" style="width:200px;" :min="1" :max="100" label="课次单价"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitUpdateProduct">确定</el-button>
              </el-form-item>
          </el-form>
        <el-button slot="reference" @click="handleUpdateClick(scope.row)" icon="el-icon-edit" type="primary" size="small">修改价格</el-button>
        </el-popover>
        <!-- <el-button @click="handleUpdateClick(scope.row)" type="text" size="small">修改</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  </el-row>
   <!-- <el-dialog :visible.sync="dialogAddProductVisible" :close-on-click-modal="false" center >
            <h2 slot="title">修改员工信息</h2>
            <keep-alive>
            <edit-employee mode="edit" :employeeId="selectedEmployee.id"  v-if="dialogEditEmployeeVisible" 
            @success="onEditEmployeeSuccess" @cancel="dialogAddStudentVisible=false"></edit-employee>
            </keep-alive>
  </el-dialog> -->
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      updateProductForm: {
        id: undefined,
        price: undefined
      },
      createProductForm: {
        subject: undefined,
        class_type: undefined,
        price: undefined
      },
      createProductRules: {
        subject: [{ required: true, message: "请选择学科", trigger: "blur" }],
        class_type: [
          { required: true, message: "请选择班型", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入课次单价", trigger: "blur" },
          {
            pattern: /^[0-9]\d*$/,
            message: "请输入一个数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      productList: state => state.product.list.data || []
      // regions: state => state.region.regions
    }),
    ...mapGetters([
      "terms",
      "subjects",
      "class_types",
      "grades",
      "lesson_times",
      "course_settings"
    ])
  },
  mounted() {
    this.getProductList();
  },
  methods: {
    ...mapActions({
      getProductList: "getProductList",
      createProduct: "createProduct",
      updateProduct: "updateProduct"
    }),
    onCreateProduct() {
      this.createProductForm = {
        subject: undefined,
        class_type: undefined,
        price: undefined
      };
    },
    submitCreateProduct() {
      this.$refs["createProductForm"].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.createProductForm);
          payload.price = parseInt(payload.price);
          this.createProduct(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getProductList();
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    handleUpdateClick(item) {
      this.updateProductForm.id = item.id;
      this.updateProductForm.price = undefined;
    },
    submitUpdateProduct() {
      let self = this;
      if (!this.$refs[this.updateProductForm.id]) {
        return false;
      }
      this.$refs[this.updateProductForm.id].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.updateProductForm);
          payload.price = parseInt(payload.price);
          self.updateProduct(payload).then(res => {
            if (res && res.code == 0) {
              this.$message.success("保存成功 ");
              this.getProductList();
            } else {
              this.$message.error("保存失败  " + res.message);
            }
          });
        }
      });
    }
  }
};
</script>

