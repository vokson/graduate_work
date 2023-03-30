<template>
  <button
    class="btn"
    :class="{
      btn_primary: type === 'primary',
      btn_secondary: type === 'secondary',
      btn_success: type === 'success',
      btn_warning: type === 'warning',
      btn_danger: type === 'danger',
      btn_disabled: disabled === true,
      btn_small: size === 'small',
      btn_middle: size === 'middle',
      btn_big: size === 'big',
    }"
    :disabled="disabled"
  >
    {{ caption }}
  </button>
</template>

<script>
export default {
  name: "BtnComponent",
  props: {
    caption: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: String,
      required: false,
      default: "middle",
    },
  },
};
</script>

<style>
.btn {
  display: inline-block;
  padding: 0.375em 0.75em 0.375em 0.75em;
  border: 1px solid;
  color: white;
  box-sizing: border-box;
  line-height: 1.5;
}

.btn_small {
  border-radius: 3px;
  font-size: 12px;
}

.btn_middle {
  border-radius: 4px;
  font-size: 16px;
}

.btn_big {
  border-radius: 8px;
  font-size: 32px;
}

.btn_disabled {
  background-color: gray !important;
  border-color: gray !important;
}

.btn_primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn_primary:hover {
  background-color: rgb(11, 94, 215);
  border-color: rgb(11, 94, 215);
}
.btn_secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn_secondary:hover {
  background-color: rgb(92, 99, 106);
  border-color: rgb(92, 99, 106);
}
.btn_success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn_success:hover {
  background-color: rgb(21, 115, 71);
  border-color: rgb(21, 115, 71);
}
.btn_danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn_danger:hover {
  background-color: rgb(187, 45, 59);
  border-color: rgb(187, 45, 59);
}
.btn_warning {
  color: black;
  background-color: #ffc107;
  border-color: #ffc107;
}
.btn_warning:hover {
  background-color: rgb(255, 202, 44);
  border-color: rgb(255, 202, 44);
}
</style>