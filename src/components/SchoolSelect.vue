<template>
   <el-dropdown size="small" trigger="click" @command="switchSchoolCommand">
        <el-button type="danger" plain size="small">
            {{current_school.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="school in schools" :key="school.id" :command="school.id">{{school.name}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "SchoolSelect",
  props: {
  },
  data() {
    return {
    };
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
      this.switchSchool(this.schools[0]);
    }
  },
  methods: {
    ...mapActions(["switchSchool"]),
    
    switchSchoolCommand(command) {
      let school = this.schools.find(v => v.id == command);
      this.switchSchool(school);
    }
  }
};
</script>
