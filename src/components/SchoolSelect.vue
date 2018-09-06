<template>

   <el-dropdown v-if="schools.length>0" trigger="click" @command="switchSchoolCommand">
        <span type="text" style="font-size:16px;" class="text-danger">
            {{current_school.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="school in schools" :key="school.id" :command="school.id"><span style="font-size:16px;">{{school.name}}</span></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "SchoolSelect",
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({ current_school: state => state.current_user.current_school }),

    schools() {
      let schools = this.$auth.userInfo().schools || [];
      return schools;
    }
  },
  mounted() {
    // let schools = this.$auth.userInfo().schools || [];
    if (this.schools.length > 0) {
      let franchisee_id = (this.$auth.userInfo().franchisee || {}).id;
      if (
        !this.current_school ||
        !this.current_school.id ||
        this.current_school.franchisee_id != franchisee_id
      ) {
        let school = Object.assign({}, this.schools[0], {
          franchisee_id: franchisee_id
        });
        this.switchSchool(school);
      }
    }
  },
  methods: {
    ...mapActions(["switchSchool", "clearState"]),

    switchSchoolCommand(command) {
      let sc = this.schools.find(v => v.id == command);
      let franchisee_id = (this.$auth.userInfo().franchisee || {}).id;
      let school = Object.assign({}, sc, {
        franchisee_id: franchisee_id
      });
      this.switchSchool(school);
      window.dispatchEvent(
        new CustomEvent("school-switched", { detail: school })
      );
    }
  },
  destroyed() {
    // this.clearState();
  }
};
</script>
