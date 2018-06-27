<template>
    <div class="text-info text-center"><slot><p>{{message}}</p></slot></div>
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

