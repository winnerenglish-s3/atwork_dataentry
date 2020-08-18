<template>
  <q-page align="center">
    <div class="container">
      <div class="row">
        <div class="col-sm-11 col-xs-12 relative-position">
          <!-- หัวข้อ -->
          <div class="q-ma-lg text-h6" align="center">
            <div>{{ getLevelName }}</div>
            <div>{{ getUnitName }}</div>
          </div>
          <!-- รหัสลำดับ -->
          <div>
            <div class="row items-center">
              <div class="text-subtitle1" align="left">รหัสลำดับ</div>
              <div class="q-ml-md text-body2 text-blue-grey-7" style="margin-top:0.7%">ตัวเลข 3 หลัก</div>
            </div>
            <q-input
              bg-color="white"
              dense
              ref="order"
              :rules="[val => !!val]"
              :error="isOrderError"
              :error-message="errorOrderMes"
              outlined
              mask="###"
              v-model.number="data.order"
              @keyup="isOrderError = false"
            />
          </div>
          <!-- ไฟล์รูปภาพ -->
          <div v-if="isAddMode">
            <div>
              <div class="row items-center">
                <div align="left" class="text-subtitle1">ไฟล์รูปภาพ</div>
                <div
                  class="q-ml-md text-blue-grey-7 text-body2"
                  style="margin-top:0.7%"
                >ไฟล์ jpg ขนาด 200x200 px เท่านั้น</div>
              </div>
              <div>
                <q-file accept=".jpg" bg-color="white" outlined v-model="uploadImg.file">
                  <template v-slot:append>
                    <!-- ปุ่มเลือกไฟล์ -->
                    <div
                      style="width:100px"
                      class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                      @click.stop="uploadImg.file = null"
                      v-if="!uploadImg.file"
                    >เลือกไฟล์</div>

                    <q-btn
                      dense
                      class="cursor-pointer text-white bg-blue-grey-10"
                      v-if="uploadImg.file"
                      @click="uploadImg.file = null"
                      icon="far fa-trash-alt"
                      size="12px"
                      style="padding:1.5px"
                    ></q-btn>
                  </template>
                  <div
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                    v-if="!uploadImg.file"
                  >ลากแล้ววาง หรือ</div>
                </q-file>
              </div>
            </div>
          </div>
          <div v-if="!isAddMode">
            <div>
              <div class="row items-center">
                <div align="left" class="text-subtitle1">ไฟล์รูปภาพ</div>
                <div
                  class="q-ml-md text-blue-grey-7 text-body2"
                  style="margin-top:0.7%"
                >ไฟล์ jpg ขนาด 200x200 px เท่านั้น</div>
              </div>
              <div>
                <q-file accept=".jpg" bg-color="white" outlined v-model="uploadImg.file">
                  <template v-slot:append>
                    <!-- ปุ่มเลือกไฟล์ -->
                    <div
                      style="width:100px"
                      class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                      @click.stop="uploadImg.file = null"
                      v-if="!data.isImage && uploadImg.file == null"
                    >เลือกไฟล์</div>

                    <q-btn
                      dense
                      class="cursor-pointer text-white bg-blue-grey-10"
                      v-if="data.isImage || uploadImg.file"
                      @click="(uploadImg.file = null), (data.isImage = false)"
                      icon="far fa-trash-alt"
                      size="12px"
                      style="padding:1.5px"
                    ></q-btn>
                  </template>
                  <div
                    v-if="data.isImage == true && !uploadImg.file"
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                  >
                    <span>{{ data.practiceId + ".jpg" }}</span>
                  </div>
                  <div
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                    v-if="!data.isImage && uploadImg.file == null"
                  >ลากแล้ววาง หรือ</div>
                </q-file>
              </div>
            </div>
          </div>

          <!-- ไฟล์เสียง -->
          <div v-if="isAddMode" class="q-pt-md">
            <div>
              <div class="row items-center">
                <div align="left" class="text-subtitle1">ไฟล์เสียง</div>
                <div
                  class="q-ml-md text-blue-grey-7 text-body2"
                  style="margin-top:0.7%"
                >ไฟล์ mp3 เท่านั้น</div>
              </div>
              <div>
                <q-file accept=".mp3" bg-color="white" outlined v-model="uploadSound.file">
                  <template v-slot:append>
                    <!-- ปุ่มเลือกไฟล์ -->
                    <div
                      style="width:100px;"
                      class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                      @click.stop="uploadSound.file = null"
                      v-if="!uploadSound.file"
                    >เลือกไฟล์</div>
                    <!-- ปุ่มลบไฟล์ -->
                    <q-btn
                      dense
                      class="cursor-pointer text-white bg-blue-grey-10"
                      v-if="uploadSound.file"
                      @click="uploadSound.file = null"
                      icon="far fa-trash-alt"
                      size="12px"
                      style="padding:1.5px"
                    ></q-btn>
                  </template>

                  <div
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                    v-if="!uploadSound.file"
                  >ลากแล้ววาง หรือ</div>
                </q-file>
              </div>
            </div>
          </div>
          <div v-if="!isAddMode" class="q-pt-md">
            <div>
              <div class="row items-center">
                <div align="left" class="text-subtitle1">ไฟล์เสียง</div>
                <div class="q-ml-md text-blue-grey-7" style="margin-top:0.7%">ไฟล์ mp3 เท่านั้น</div>
              </div>
              <div>
                <q-file accept=".mp3" bg-color="white" outlined v-model="uploadSound.file">
                  <template v-slot:append>
                    <!-- ปุ่มเลือกไฟล์ -->
                    <div
                      style="width:100px;"
                      class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                      @click.stop="uploadSound.file = null"
                      v-if="!data.isSound && uploadSound.file == null"
                    >เลือกไฟล์</div>
                    <!-- ปุ่มลบไฟล์ -->
                    <q-btn
                      dense
                      class="cursor-pointer text-white bg-blue-grey-10"
                      v-if="data.isSound || uploadSound.file"
                      @click="(uploadSound.file = null), (data.isSound = false)"
                      icon="far fa-trash-alt"
                      size="12px"
                      style="padding:1.5px"
                    ></q-btn>
                  </template>
                  <div
                    v-if="data.isSound == true && !uploadSound.file"
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                  >
                    <span>{{ data.practiceId + ".mp3" }}</span>
                  </div>
                  <div
                    style="width:1000px"
                    class="text-body2 text-grey-7 self-center"
                    v-if="!data.isSound && uploadSound.file == null"
                  >ลากแล้ววาง หรือ</div>
                </q-file>
              </div>
            </div>
          </div>

          <!-- คำศัพท์ -->
          <div class="q-mt-md">
            <div>
              <div class="text-subtitle1" align="left">คำศัพท์</div>
            </div>
            <q-input
              bg-color="white"
              dense
              ref="vocabulary"
              v-model="data.vocabulary"
              outlined
              :rules="[val => !!val]"
            />
          </div>

          <!-- คำแปล -->
          <div class="q-mt-md">
            <div>
              <div class="text-subtitle1" align="left">คำแปล</div>
            </div>
            <q-input
              bg-color="white"
              dense
              type="textarea"
              ref="meaning"
              v-model="data.meaning"
              outlined
              :rules="[val => !!val]"
            />
          </div>
        </div>
      </div>
      <div class="row" :style="$q.platform.is.desktop ? 'width:360px; margin-left:21%' : null">
        <!-- ยกเลิก -->
        <div class="q-mt-md col">
          <q-btn
            :to="
              '/flashcardMain/' +
                data.levelId +
                '/' +
                data.unitId +
                '/' +
                data.practiceId
            "
            label="ยกเลิก"
            dense
            style="width:150px"
            outline
            color="blue-grey-10"
          />
        </div>
        <!-- บันทึกข้อมูล -->
        <div class="q-mt-md col">
          <q-btn
            :disable="isClick"
            @click="saveData()"
            label="บันทึก"
            dense
            style="width:150px"
            color="white"
            class="bg-blue-grey-10"
          />
        </div>
      </div>
      <!-- --------------------------------------dialog--------------------------------------- -->
      <dialog-setting
        :type="6"
        v-if="isSaveFinish == true"
        @autoClose="
          $router.push(
            '/flashcardMain/' +
              data.levelId +
              '/' +
              data.unitId +
              '/' +
              data.practiceId
          )
        "
      ></dialog-setting>
    </div>
  </q-page>
</template>

<script>
import { db, st } from "../router";
import dialogSetting from "../components/dialogSetting";
export default {
  components: {
    dialogSetting
  },
  data() {
    return {
      isSaveFinish: false,
      successData: false,
      uploadSound: {
        file: null,
        status: false
      },
      uploadImg: {
        file: null,
        status: false
      },
      checkValidate: false,
      isClick: false,
      isAddMode: true,
      getLevelName: this.$route.params.getLevelName,
      getUnitName: this.$route.params.getUnitName,
      data: {
        order: "",
        vocabulary: "",
        meaning: "",
        levelId: this.$route.params.levelId,
        unitId: this.$route.params.unitId,
        status: "notSync",
        practiceId: this.$route.params.practiceId,
        isImage: false,
        isSound: false,
        type: "flashcard"
      },

      isOrderError: false,
      errorOrderMes: ""
    };
  },
  methods: {
    editMode() {
      this.isAddMode = false;
      this.oldOrder = this.$route.params.data.order;
      if (this.$route.params.levelId == undefined) {
        this.$router.push(
          "/flashcardMain/" +
            this.data.levelId +
            "/" +
            this.data.unitId +
            "/" +
            this.data.practiceId
        );
      }
      this.data = this.$route.params.data;
    },
    async saveData() {
      this.isOrderError = false;
      this.errorOrderMes = "";
      this.$refs.order.validate();
      this.$refs.vocabulary.validate();
      this.$refs.meaning.validate();
      if (
        this.$refs.order.hasError ||
        this.$refs.vocabulary.hasError ||
        this.$refs.meaning.hasError
      ) {
        return;
      }
      if (this.data.read == "") {
        this.checkValidate = true;
        return;
      }

      if (this.uploadImg.file != null) {
        this.data.isImage = true;
      }
      if (this.uploadSound.file != null) {
        this.data.isSound = true;
      }

      if (this.order == "") {
        this.isOrderError = true;

        this.$q.notify({
          message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
          color: "red",
          position: "top"
        });
        return;
      }
      let checkOrder = await db
        .collection("practice_draft")
        .where("order", "==", this.data.order)
        .where("practiceId", "==", this.data.practiceId)
        .get();

      if (this.$route.name == "flashcardInput") {
        if (checkOrder.size > 0) {
          this.errorOrderMes = "รหัสลำดับซ้ำ";
          this.isOrderError = true;
          this.$q.notify({
            message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
            color: "red",
            position: "top"
          });
          return;
        }
      }
      if (this.$route.name == "flashcardEdit") {
        if (this.data.order != this.oldOrder) {
          if (checkOrder.size > 0) {
            this.errorOrderMes = "รหัสลำดับซ้ำ";
            this.isOrderError = true;
            this.$q.notify({
              message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
              color: "red",
              position: "top"
            });
            return;
          } else {
            this.editData();
          }
          return;
        } else {
          this.editData();
        }
      }

      this.isClick = true;

      if (this.$route.name == "flashcardInput") {
        await this.updateSyncStatus(this.data.practiceId, this.data.unitId);
        db.collection("practice_draft")
          .add(this.data)
          .then(getId => {
            if (this.data.isImage == true) {
              st.child("practice/image/" + getId.id + ".jpg").put(
                this.uploadImg.file
              );
            }
            if (this.data.isSound == true) {
              st.child("practice/audio/" + getId.id + ".mp3").put(
                this.uploadSound.file
              );
            }
            this.isSaveFinish = true;
          });
      } else {
        this.editData();
      }
    },

    async editData() {
      await this.updateSyncStatus(this.data.practiceId, this.data.unitId);
      let temp = { type: "flashcard" };
      this.data.status = "notSync";
      this.data = { ...this.data, ...temp };
      db.collection("practice_draft")
        .doc(this.$route.params.id)
        .update(this.data)
        .then(() => {
          if (this.uploadImg.file) {
            if (this.data.isImage) {
              st.child("practice/image/" + this.$route.params.id + ".jpg").put(
                this.uploadImg.file
              );
            } else {
              st.child(
                "practice/image/" + this.$route.params.id + ".jpg"
              ).delete();
            }
          }
          if (this.uploadSound.file) {
            if (this.data.isSound) {
              st.child("practice/audio/" + this.$route.params.id + ".mp3").put(
                this.uploadSound.file
              );
            } else {
              st.child(
                "practice/audio/" + this.$route.params.id + ".mp3"
              ).delete();
            }
          }
          this.isSaveFinish = true;
        });
    }
  },
  mounted() {
    if (this.$route.name == "flashcardEdit") {
      if (this.$route.params.id == undefined) {
        this.$router.go(-1);
        return;
      }
      this.editMode();
    }
  }
};
</script>

<style lang="scss" scoped>
.font {
  font-size: 12px;
}
</style>
