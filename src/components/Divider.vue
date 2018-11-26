<template>
    <div :class="classes">
        <span v-if="hasSlot" :class="slotClasses">
            <slot></slot>
        </span>
    </div>
</template>

<script>
function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}
const prefixCls = "tms-divider";

export default {
  name: "Divider",
  props: {
    type: {
      type: String,
      default: "horizontal",
      validator(value) {
        return oneOf(value, ["horizontal", "vertical"]);
      }
    },
    orientation: {
      type: String,
      default: "center",
      validator(value) {
        return oneOf(value, ["left", "right", "center"]);
      }
    },
    dashed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasSlot() {
      return !!this.$slots.default;
    },
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-with-text-${this.orientation}`]: this.hasSlot,
          [`${prefixCls}-dashed`]: !!this.dashed
        }
      ];
    },
    slotClasses() {
      return [`${prefixCls}-inner-text`];
    }
  }
};
</script>
<style scoped>
.tms-divider {
  font-size: 14px;
  line-height: 1.5;
  color: #515a6e;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #e8eaec;
}
.tms-divider-vertical {
  margin: 0 8px;
  display: inline-block;
  height: 0.9em;
  width: 1px;
  vertical-align: middle;
  position: relative;
  top: -0.06em;
}
.tms-divider-horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
  clear: both;
}

.tms-divider-horizontal.tms-divider-with-text-center:after,
.tms-divider-horizontal.tms-divider-with-text-center:before,
.tms-divider-horizontal.tms-divider-with-text-left:after,
.tms-divider-horizontal.tms-divider-with-text-left:before,
.tms-divider-horizontal.tms-divider-with-text-right:after,
.tms-divider-horizontal.tms-divider-with-text-right:before {
  content: "";
  display: table-cell;
  position: relative;
  top: 50%;
  width: 50%;
  border-top: 1px solid #e8eaec;
  -webkit-transform: translateY(50%);
  transform: translateY(50%);
}

.tms-divider-horizontal.tms-divider-with-text-center,
.tms-divider-horizontal.tms-divider-with-text-left,
.tms-divider-horizontal.tms-divider-with-text-right {
  display: table;
  white-space: nowrap;
  text-align: center;
  background: 0 0;
  font-weight: 500;
  color: #17233d;
  font-size: 16px;
  margin: 16px 0;
}
.tms-divider-horizontal.tms-divider-with-text-left .tms-divider-inner-text,
.tms-divider-horizontal.tms-divider-with-text-right .tms-divider-inner-text {
  display: inline-block;
  padding: 0 10px;
}
.tms-divider-horizontal.tms-divider-with-text-left:after,
.tms-divider-horizontal.tms-divider-with-text-right:before {
  top: 50%;
  width: 95%;
}
.tms-divider-horizontal.tms-divider-with-text-left:before {
  top: 50%;
  width: 5%;
}
.tms-divider-dashed {
    background: 0 0;
    border-top: 1px dashed #e8eaec;
}
/* .tms-divider-horizontal.tms-divider-with-text-left,
.tms-divider-horizontal.tms-divider-with-text-right {
  font-size: 14px;
} */
</style>
