<template>
  <div class="documentpagedownloadprogressrow">
    <div
      class="documentpagedownloadprogressrow__container"
      v-for="file in files"
      :key="file.id"
    >
      <span
        class="documentpagedownloadprogressrow__item"
        v-if="full_format"
        >Происходит скачивание файла "{{file.name}}" объемом {{ file.formatted_size() }} - {{ file.progress }}%</span
      >
      <span
        class="documentpagedownloadprogressrow__item"
        v-if="!full_format && file.progress < 100"
        >({{ file.formatted_size() }} - {{ file.progress }}%)</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "DocumentPageDownloadProgressRow",
  props: {
    files: {
      type: Array,
      required: true,
    },
    full_format: {
      type: Boolean,
      default: false
    }
  },
};
</script>
<style scoped>
.documentpagedownloadprogressrow {
  display: flex;
}
.documentpagedownloadprogressrow__item {
  padding: 3px;
}
</style>