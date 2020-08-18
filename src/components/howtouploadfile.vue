<template>
  <div>
    <!-- ดูวิธีการอัพโหลดวีดีโอ -->
    <q-scroll-area class="q-pb-sm q-px-md" style="height: 750px;">
      <div>
        <div class="text-subtitle1">
          <div class="q-py-sm">
            <q-btn class="boxUpload q-mx-md" flat label="1" />
            <span>เลือกไฟล์วิดีโอที่ต้องการอัปโหลด</span>
            <div class="text-center q-py-md">
              <q-img style="max-width:90%" src="../statics/upload/upload1.png" />
            </div>
          </div>
          <div class="q-py-sm">
            <q-btn class="boxUpload q-mx-md" flat label="2" />
            <span>ใส่ชื่อ และคำอธิบาย</span>
            <div class="text-center q-py-md">
              <q-img style="max-width:90%" src="../statics/upload/upload2.png" />
            </div>
          </div>
          <div class="q-py-sm">
            <q-btn class="boxUpload q-mx-md" flat label="3" />
            <span>เลือก “ไม่ วิดีโอนี้ไม่ได้สร้างมาเพื่อเด็ก”</span>
            <div class="text-center q-py-md">
              <q-img style="max-width:90%" src="../statics/upload/upload3.png" />
            </div>
          </div>
          <div class="q-py-sm">
            <q-btn class="boxUpload q-mx-md" flat label="4" />
            <span>เลือก “ระดับการแชร์”</span>
          </div>
          <div class="q-py-sm">
            <q-btn class="boxUpload q-mx-md" flat label="5" />
            <span>เลือก “ไม่เป็นสาธารณะ”</span>
            <div class="text-center q-py-md">
              <q-img style="max-width:90%" src="../statics/upload/upload5.png" />
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style  scoped>
.boxUpload {
  align-content: center;
  color: white;
  background: #263238;
  height: 35px;
  width: 35px;
  border-radius: 100%;
}
</style>