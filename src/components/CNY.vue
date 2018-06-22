<template>
    <span class="money"><em>&yen;</em><strong>{{value|formatCurrency}}</strong></span>
</template>
<script>
export default {
  name: "CNY",
  props: {
    value: { default: 0 }
  },
  data() {
    return {};
  }
};
</script>
<style lang="stylus" scoped>
.money em {
    font-size: 80%;
    color: #909399;
    margin-right: 2px;
    font-style:normal;
}

.money strong {
    font-weight: 600;
}
</style>



