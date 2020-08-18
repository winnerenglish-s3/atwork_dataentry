<template>
  <q-page>
    <div class="container">
      <div class="text-h6 text-center">
        <div>{{practiceData.levelName}}</div>
        <div>{{ practiceData.unitOrder + ". " + practiceData.unitName}}</div>
      </div>
      <div class="q-pt-sm">
        <span>รหัสลำดับ</span>
        <span class="q-mx-md text-grey-5">ตัวเลข 3 หลัก</span>
        <div>
          <q-input
            mask="###"
            bg-color="white"
            outlined
            ref="orderid"
            v-model.number="vdoObject.order"
            dense
            :error="isErrorOrder"
            :error-message="orderMessage"
            :rules="[val => !!val]"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6 col-md-3 col-sm-3 q-pb-md">
          <q-radio
            style="margin:-10px"
            color="blue-grey-10"
            v-model="vdoObject.speaker"
            :val="'customer'"
            label="ลูกค้า"
          />
        </div>

        <div class="col-xs-6 col-md-3 col-sm-3 q-pb-md">
          <q-radio
            style="margin:-10px"
            color="blue-grey-10"
            v-model="vdoObject.speaker"
            :val="'employee'"
            label="พนักงาน#1"
          />
        </div>
        <div class="col-xs-6 col-md-3 col-sm-3 q-pb-md">
          <q-radio
            style="margin:-10px"
            color="blue-grey-10"
            v-model="vdoObject.speaker"
            :val="'employee2'"
            label="พนักงาน#2"
          />
        </div>
        <div class="col-xs-6 col-md-3 col-sm-3 q-pb-md">
          <q-radio
            style="margin:-10px"
            color="blue-grey-10"
            v-model="vdoObject.speaker"
            :val="'people'"
            label="คนทั่วไป"
          />
        </div>
      </div>
      <div>
        <span>ประโยคภาษาอังกฤษ</span>
        <div>
          <q-input
            autogrow
            bg-color="white"
            outlined
            ref="eng"
            v-model="sentenceEng"
            dense
            type="text"
            :rules="[ val => !!val]"
          />
        </div>
      </div>
      <div>
        <span>ประโยคภาษาไทย</span>
        <div>
          <q-input
            autogrow
            bg-color="white"
            outlined
            ref="th"
            v-model.trim="sentenceTh"
            dense
            type="text"
            :rules="[ val => !!val ]"
          />
        </div>
      </div>
      <div>
        <div class="text-left">
          ไฟล์เสียง
          <span class="q-mx-md text-grey-5">ไฟล์ mp3 เท่านั้น</span>
        </div>
        <q-file accept="audio/*" bg-color="white" outlined v-model="uploadAudio">
          <template class="relative-position" v-slot:append>
            <div
              style="width:100px"
              class="text-subtitle1 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
              @click.stop="uploadAudio = null"
              v-if="!uploadAudio && !isKeyAudio"
            >เลือกไฟล์</div>
            <div v-if="uploadAudio || isKeyAudio" class="text-body1 absolute-center">{{isKeyAudio}}</div>
            <div
              class="cursor-pointer rounded-borders text-white bg-blue-grey-10"
              v-if="uploadAudio || isKeyAudio"
              @click="uploadAudio  = null ; isKeyAudio = ''"
            >
              <span class="far fa-trash-alt q-px-xs"></span>
            </div>
          </template>
          <div
            style="width:100%"
            class="text-subtitle1 row absolute-center text-grey-7"
            v-if="!uploadAudio && !isKeyAudio"
          >
            <span class="col text-center">ลากแล้ววาง หรือ</span>
          </div>
        </q-file>
      </div>
      <div align="center">
        <div class="row reverse-wrap justify-center q-pt-md" style="max-width:340px;width:100%">
          <div class="col-6 q-py-sm text-left">
            <q-btn
              v-close-popup
              @click="backBtn()"
              dense
              style="width:150px"
              color="white"
              outline
              text-color="blue-grey-10"
              label="ยกเลิก"
            />
          </div>
          <div class="col-6 q-py-sm text-right">
            <q-btn
              :disable="isCheckble"
              @click="saveBtn()"
              dense
              style="width:150px"
              color="blue-grey-10"
              label="บันทึก"
            />
          </div>
        </div>
      </div>
      <dialog-setting :type="6" v-if="isSaveDialogSuccess" @autoClose="isSaveDialogSuccess = false"></dialog-setting>
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
      isCheckble: false,
      uploadAudio: null,
      isKeyAudio: "",
      vdoObject: {
        order: "",
        practiceId: this.$route.params.practiceId,
        levelId: this.$route.params.levelId,
        unitId: this.$route.params.unitId,
        sentenceEng: "",
        sentenceTh: "",
        isSound: false,
        speaker: "customer",
        status: "notSync",
        type: "vdo"
      },
      sentenceEng: "",
      sentenceTh: "",
      practiceData: {
        levelName: "",
        unitName: "",
        unitOrder: ""
      },
      isErrorOrder: false,
      orderMessage: "",
      orderOld: "",
      isSaveDialogSuccess: false
    };
  },
  methods: {
    loadLevel() {
      let levelKey = this.$route.params.levelId;
      db.collection("level")
        .doc(levelKey)
        .get()
        .then(result => {
          if (result.exists) {
            this.practiceData.levelName = result.data().name;
            // โหลดข้อมูล Unit
            this.loadUnit();
          }
        });
    },
    loadUnit() {
      let unitKey = this.$route.params.unitId;
      db.collection("unit")
        .doc(unitKey)
        .get()
        .then(result => {
          if (result.exists) {
            this.practiceData.unitName = result.data().name;
            this.practiceData.unitOrder = result.data().order;
            // โหลดข้อมูล คำสั่ง
          }
        });
    },
    loadEdit() {
      db.collection("practice_draft")
        .doc(this.$route.params.id)
        .get()
        .then(doc => {
          if (doc.data().isSound) {
            this.isKeyAudio = doc.id + ".mp3";
          }
          this.orderOld = doc.data().order;
          this.sentenceEng = doc.data().sentenceEng;
          this.sentenceTh = doc.data().sentenceTh;
          this.vdoObject = doc.data();
        });
    },

    async saveBtn() {
      this.vdoObject.sentenceEng = this.sentenceEng;
      this.vdoObject.sentenceTh = this.sentenceTh;
      this.$refs.orderid.validate();
      this.$refs.eng.validate();
      this.$refs.th.validate();
      if (
        this.$refs.orderid.hasError ||
        this.$refs.eng.hasError ||
        this.$refs.th.hasError
      ) {
        return;
      }
      let getOrder = await db
        .collection("practice_draft")
        .where("order", "==", this.vdoObject.order)
        .where("practiceId", "==", this.vdoObject.practiceId)
        .get();
      if (getOrder.size > 0 && this.orderOld != this.vdoObject.order) {
        this.orderMessage = "รหัสลำดับนี้มีการใช้งานแล้ว";
        this.isErrorOrder = true;
        this.loadingHide();
        setTimeout(() => {
          this.orderMessage = "";
          this.isErrorOrder = false;
        }, 1000);
        return;
      } else {
        this.loadingShow();
        await this.updateSyncStatus(
          this.$route.params.practiceId,
          this.$route.params.unitId
        );
        this.isCheckble = true;
        if (this.$route.name == "vdoAdd") {
          if (this.uploadAudio) {
            this.vdoObject.isSound = true;
          }
          db.collection("practice_draft")
            .add(this.vdoObject)
            .then(async doc => {
              if (this.uploadAudio) {
                await st
                  .child("/practice/audio/" + doc.id + ".mp3")
                  .put(this.uploadAudio);
              }
              this.loadingHide();
              this.isSaveDialogSuccess = true;
              setTimeout(() => {
                this.$router.push(
                  "/vdoMain/" +
                    this.vdoObject.levelId +
                    "/" +
                    this.vdoObject.unitId +
                    "/" +
                    this.vdoObject.practiceId
                );
              }, 1000);
            });
        } else {
          if (this.uploadAudio || this.isKeyAudio) {
            this.vdoObject.isSound = true;
          } else {
            this.vdoObject.isSound = false;
          }
          this.vdoObject.status = "notSync";
          db.collection("practice_draft")
            .doc(this.$route.params.id)
            .set(this.vdoObject)
            .then(() => {
              if (this.uploadAudio) {
                st.child(
                  "/practice/audio/" + this.$route.params.id + ".mp3"
                ).put(this.uploadAudio);
              }
              this.loadingHide();
              this.isSaveDialogSuccess = true;
              setTimeout(() => {
                this.$router.push(
                  "/vdoMain/" +
                    this.vdoObject.levelId +
                    "/" +
                    this.vdoObject.unitId +
                    "/" +
                    this.vdoObject.practiceId
                );
              }, 1000);
            });
        }
      }

      return;
    },
    backBtn() {
      this.$router.push(
        "/vdoMain/" +
          this.vdoObject.levelId +
          "/" +
          this.vdoObject.unitId +
          "/" +
          this.vdoObject.practiceId
      );
    }
  },
  mounted() {
    this.loadLevel();
    if (this.$route.name == "vdoEdit") {
      if (this.$route.params.id == undefined) {
        this.$router.go(-1);
        return;
      }
      this.loadEdit();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>