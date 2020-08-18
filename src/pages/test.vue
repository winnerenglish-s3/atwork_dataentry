<template>
  <div>
    <!-- dialog บันทึกข้อมูลเรียนร้อยแล้ว -->
    <q-dialog v-model="saveData">
      <div
        class="bg-white row justify-center items-center"
        style="width:320px;height:200px"
        align="center"
      >
        <div>
          <q-icon name="far fa-check-circle" class="text-secondary" size="40px" />
          <div class="text-subtitle1 q-pt-md">บันทึกข้อมูลเรียบร้อยแล้ว</div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>