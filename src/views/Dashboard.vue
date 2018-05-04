<template>
  <div class="about">
    <h1>This is an dashbord page</h1>
    <hello-world :msg="msg"></hello-world>
  </div>
</template>
<script>
import HelloWorld from "@/components/HelloWorld.vue";
export default {
  data() {
    return {
      msg: "dashboard!!"
    };
  },
  components: {
    HelloWorld
  }
};
</script>
