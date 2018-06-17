<template>
    <div class="text-info text-center"><p>{{message}}</p></div>
</template>
<script>
export default {
  name: "empty-data-view",
  props: {
    message: {
      String,
      default: function() {
        return "空空如也～";
      }
    }
  }
};
</script>

