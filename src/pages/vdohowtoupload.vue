<template>
  <div>
    <div>
      <div class="text-h6 q-pa-md">การตั้งค่าการอัปโหลดวิดีโอ</div>
    </div>
    <howtouploadfile />
    <div class="text-center">
      <q-btn
        @click="$router.go(-1);"
        style="max-width:190px;width:100%"
        label="ปิด"
        class="bg-blue-grey-10 text-white q-mb-sm"
      />
    </div>
  </div>
</template>

<script>
import howtouploadfile from "../components/howtouploadfile.vue";
export default {
  components: {
    howtouploadfile
  }
};
</script>

<style  scoped>
</style>