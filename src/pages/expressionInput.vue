<template>
  <q-page align="center">
    <div class="container" align="center">
      <div class="row">
        <div class="col-sm-12 col-xs-12 relative-position">
          <!-- หัวข้อ -->
          <div class="q-ma-lg text-h6" align="center">
            <div>{{getLevelName}}</div>
            <div>{{getUnitName}}</div>
          </div>
          <!-- รหัสลำดับ -->
          <div>
            <div class="row">
              <div class="text-subtitle1" align="left">รหัสลำดับ</div>
              <div class="text-subtitle1 q-ml-md text-grey-7" style="margin-top:0.7px">ตัวเลข 3 หลัก</div>
            </div>
            <q-input
              dense
              ref="order"
              :error="isOrderError"
              :error-message="errorOrderMes"
              outlined
              mask="###"
              v-model.number="order"
              @keyup="isOrderError = false"
            />
          </div>
          <!-- ปุ่มเพิ่ม -->
          <div align="center">
            <q-btn
              @click="boxCount++"
              v-if="boxCount+2 && boxCount < 3 "
              style="width:190px"
              class="bg-blue-grey-10"
              color="white"
            >เพิ่มประโยคที่ {{boxCount+2}}</q-btn>
          </div>
        </div>
      </div>
      <div class="row" v-for="(i) in boxCount+1" :key="i">
        <div class="col-sm-12 col-xs-12 relative-position">
          <q-card class="q-mt-lg text-black">
            <div class="row items-center justify-between bg-blue-grey-10 text-white q-pa-xs">
              <div align="left" class="q-ml-sm text-subtitle1">ประโยคที่ {{i}}</div>
              <!-- ถังขยะ -->
              <div align="right">
                <q-btn
                  v-if="i != 1"
                  @click="opendialogDeleteCard(i-1)"
                  flat
                  class="cursor-pointer"
                  size="sm"
                  round
                  icon="far fa-trash-alt"
                />
              </div>
            </div>
            <!-- radio button -->

            <div class="q-pa-md">
              <div>
                <div align="left" class="row">
                  <div class="col-md-3 col-xs-6">
                    <q-radio
                      dense
                      color="blue-grey-10"
                      class="col-6"
                      v-model="sentence[i-1].speaker"
                      val="customer"
                      label="ลูกค้า"
                    />
                  </div>
                  <div class="col-md-3 col-xs-6">
                    <q-radio
                      dense
                      color="blue-grey-10"
                      class="col-6"
                      v-model="sentence[i-1].speaker"
                      val="employee"
                      label="พนักงาน"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div class="q-mt-md">
                  <div align="left">ประโยคภาษาอังกฤษ</div>
                  <div>
                    <q-input
                      dense
                      :ref="'sentenceEng'+i"
                      :error="sentence[i-1].errorEng"
                      outlined
                      v-model="sentence[i-1].sentenceEng"
                      hide-bottom-space
                    />
                  </div>
                </div>
                <div class="q-mt-md">
                  <div align="left">ประโยคภาษาไทย</div>
                  <div>
                    <q-input
                      dense
                      :error="sentence[i-1].errorTh"
                      :ref="'sentenceTh'+i"
                      outlined
                      v-model="sentence[i-1].sentenceTh"
                      hide-bottom-space
                    />
                  </div>
                </div>
                <!-- ไฟล์เสียง -->
                <div v-if="isAddMode">
                  <div class="q-mt-md">
                    <div class="row items-center">
                      <div align="left" class="text-subtitle1">ไฟล์เสียง</div>
                      <div
                        class="q-ml-md text-blue-grey-7 text-body2"
                        style="margin-top:0.7%"
                      >ไฟล์ mp3 เท่านั้น</div>
                    </div>
                    <div>
                      <q-file
                        accept=".mp3"
                        bg-color="white"
                        outlined
                        v-model="sentence[i-1].uploadSound"
                      >
                        <template v-slot:append>
                          <!-- ปุ่มเลือกไฟล์ -->
                          <div
                            style="width:100px;"
                            class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                            @click.stop="sentence[i-1].uploadSound = null"
                            v-if="!sentence[i-1].uploadSound"
                          >เลือกไฟล์</div>
                          <!-- ปุ่มลบไฟล์ -->
                          <div
                            class="cursor-pointer rounded-borders text-white bg-blue-grey-10"
                            v-if="sentence[i-1].uploadSound"
                            @click="sentence[i-1].uploadSound = null"
                          >
                            <span style class="far fa-trash-alt q-px-xs"></span>
                          </div>
                        </template>
                        <div
                          v-if="sentence[i-1].isSound == true"
                          style="width:1000px"
                          class="text-body2 text-grey-7 self-center"
                        >{{sentence[i-1].uploadSound}}</div>
                        <div
                          style="width:1000px"
                          class="text-body2 text-grey-7 self-center"
                          align="right"
                          v-if="!sentence[i-1].uploadSound"
                        >ลากแล้ววาง หรือ</div>
                      </q-file>
                    </div>
                  </div>
                </div>
                <div v-if="!isAddMode">
                  <div class="q-mt-md">
                    <div class="row items-center">
                      <div align="left" class="text-subtitle1">ไฟล์เสียง</div>
                      <div
                        class="q-ml-md text-blue-grey-7"
                        style="margin-top:0.7%"
                      >ไฟล์ mp3 เท่านั้น</div>
                    </div>
                    <div>
                      <q-file
                        accept=".mp3"
                        bg-color="white"
                        outlined
                        v-model="uploadSound[i-1].file"
                      >
                        <template v-slot:append>
                          <!-- ปุ่มเลือกไฟล์ -->
                          <div
                            style="width:100px;"
                            class="text-body2 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                            @click.stop="uploadSound[i-1].file = null"
                            v-if="!sentence[i-1].isSound && uploadSound[i-1].file == null"
                          >เลือกไฟล์</div>
                          <!-- ปุ่มลบไฟล์ -->
                          <div
                            class="cursor-pointer rounded-borders text-white bg-blue-grey-10"
                            v-if="sentence[i-1].isSound || uploadSound[i-1].file "
                            @click="sentence[i-1].isSound = false ,uploadSound[i-1].file = null "
                          >
                            <span style class="far fa-trash-alt q-px-xs"></span>
                          </div>
                        </template>
                        <div
                          v-if="sentence[i-1].isSound"
                          style="width:1000px"
                          class="text-body2 text-grey-7 self-center"
                          align="left"
                        >
                          <span>{{$route.params.id +"-"+(i) + ".mp3"}}</span>
                        </div>

                        <div
                          style="width:1000px"
                          class="text-body2 text-grey-7 self-center"
                          v-if="uploadSound[i-1].file == null && sentence[i-1].isSound == false"
                        >ลากแล้ววาง หรือ</div>
                      </q-file>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
      <div class="row justify-center q-mt-md" style="width:100%;">
        <!-- ยกเลิก -->
        <div class="q-px-md">
          <q-btn
            :to="'/expressionMain/'+ levelId+'/'+unitId+'/'+practiceId"
            label="ยกเลิก"
            dense
            :style="$q.platform.is.desktop?'width:150px':'width:120px'"
            outline
            color="blue-grey-10"
          />
        </div>
        <!-- บันทึกข้อมูล -->
        <div class="q-px-md">
          <q-btn
            @click="saveData()"
            label="บันทึก"
            dense
            :style="$q.platform.is.desktop?'width:150px':'width:120px'"
            color="white"
            class="bg-blue-grey-10"
          />
        </div>
      </div>
    </div>
    <!-- --------------------------------------dialog--------------------------------------- -->
    <!-- ยืนยันการลบ -->
    <q-dialog v-model="dialogdeleteCard" persistent>
      <q-card style="min-width: 350px; height:200px">
        <q-card-section></q-card-section>

        <q-card-section align="center" class="q-pt-md text-h6">คุณต้องการลบ "ประโยคที่ {{getIndex}}"</q-card-section>

        <q-card-actions align="center" class="q-mt-md">
          <q-btn style="width:120px" outline label="ยกเลิก" color="blue-grey-10" v-close-popup />
          <q-btn
            @click="confirmDeleteCard()"
            style="width:120px"
            label="ตกลง"
            color="blue-grey-10"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <dialog-setting :type="4" v-if="isShowDailogDeleteFinish == true"></dialog-setting>
    <dialog-setting
      :type="6"
      @autoClose="$router.push(
              '/expressionMain/' +
                levelId +
                '/' +
                unitId +
                '/' +
                practiceId
            )"
      v-if="isShowDialogSaveFinish == true"
    ></dialog-setting>
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
      getUnitName: this.$route.params.getUnitName,
      getLevelName: this.$route.params.getLevelName,
      practiceId: this.$route.params.practiceId,
      levelId: this.$route.params.levelId,
      unitId: this.$route.params.unitId,
      successData: false,
      isAddMode: true,
      getIndex: "",
      dialogdeleteCard: false,
      isShowDailogDeleteFinish: false,
      isShowDialogSaveFinish: false,
      boxCount: 1,
      type: "",
      order: "",
      oldOrder: this.$route.params.order,
      isOrderError: false,
      errorSentenceEng1: false,
      errorOrderMes: "",

      uploadSound: [
        {
          file: null,
          status: false
        },
        {
          file: null,
          status: false
        },
        {
          file: null,
          status: false
        },
        {
          file: null,
          status: false
        }
      ],
      sentence: [
        {
          sentenceEng: "",
          sentenceTh: "",
          speaker: "customer",
          errorEng: false,
          errorTh: false,
          isSound: false,
          uploadSound: null
        },
        {
          sentenceEng: "",
          sentenceTh: "",
          speaker: "customer",
          errorEng: false,
          errorTh: false,
          isSound: false,
          uploadSound: null
        },
        {
          sentenceEng: "",
          sentenceTh: "",
          speaker: "customer",
          errorEng: false,
          errorTh: false,
          isSound: false,
          uploadSound: null
        },
        {
          sentenceEng: "",
          sentenceTh: "",
          speaker: "customer",
          errorEng: false,
          errorTh: false,
          isSound: false,
          uploadSound: null
        }
      ]
    };
  },
  methods: {
    editMode() {
      this.isAddMode = false;
      if (
        this.$route.params.levelId == undefined ||
        this.$route.params.order == undefined
      ) {
        this.$router.push(
          "/expressionMain/" +
            this.levelId +
            "/" +
            this.unitId +
            "/" +
            this.practiceId
        );
      }
      this.levelId = this.$route.params.levelId;
      this.practiceId = this.$route.params.practiceId;
      this.order = this.$route.params.order;
      this.oldOrder = this.$route.params.order;
      this.unitId = this.$route.params.unitId;
      let getSentence = this.$route.params.expression;
      this.boxCount = this.$route.params.expression.length - 1;
      let loop = 4 - this.$route.params.expression.length;
      for (let i = 0; i < loop; i++) {
        getSentence.push({
          sentenceEng: "",
          sentenceTh: "",
          speaker: ""
        });
      }
      this.sentence = getSentence;
    },
    async saveData() {
      this.isOrderError = false;
      this.errorOrderMes = "";
      for (let i = 0; i < this.boxCount + 1; i++) {
        this.sentence[i].errorEng = false;
        this.sentence[i].errorTh = false;
      }
      for (let i = 0; i < this.boxCount + 1; i++) {
        if (!this.sentence[i].sentenceEng.length) {
          this.sentence[i].errorEng = true;
        }
        if (!this.sentence[i].sentenceTh.length) {
          this.sentence[i].errorTh = true;
        }
      }
      let filter = this.sentence.filter(
        x => x.errorEng == true || x.errorTh == true
      );
      if (filter.length > 0) {
        this.$q.notify({
          message: "กรุณาตรวจสอบข้อมูลให้ถูกต้อง",
          color: "red",
          position: "top"
        });
        return;
      }
      // this.$refs.order.validate();
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
        .where("order", "==", this.order)
        .where("practiceId", "==", this.practiceId)
        .get();
      // console.log(checkOrder.size);
      if (this.$route.name == "expressionInput") {
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
      if (this.$route.name == "expressionEdit") {
        if (this.order != this.oldOrder) {
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

      await this.updateSyncStatus(this.practiceId, this.unitId);
      if (this.$route.name == "expressionInput") {
        let filterData = this.sentence.filter(
          x => x.sentenceEng != "" && x.sentenceTh != ""
        );

        let newFilterData = [];
        filterData.forEach(element => {
          let data = {
            sentenceEng: element.sentenceEng,
            sentenceTh: element.sentenceTh,
            speaker: element.speaker,
            isSound: element.uploadSound != null ? true : false
          };
          newFilterData.push(data);
        });

        db.collection("practice_draft")
          .add({
            type: "expression",
            unitId: this.unitId,
            levelId: this.levelId,
            practiceId: this.practiceId,
            expression: newFilterData,
            order: this.order,
            status: "notSync"
          })
          .then(getId => {
            filterData.forEach((element, index) => {
              // console.log(element);
              if (element.uploadSound != null) {
                let soundId = getId.id + "-" + (index + 1);
                // console.log(soundId);
                st.child("practice/audio/" + soundId + ".mp3").put(
                  element.uploadSound
                );
              }
            });

            this.sentence = [
              {
                sentenceEng: "",
                sentenceTh: "",
                speaker: "customer",
                uploadSound: null
              },
              {
                sentenceEng: "",
                sentenceTh: "",
                speaker: "customer",
                uploadSound: null
              },
              {
                sentenceEng: "",
                sentenceTh: "",
                speaker: "customer",
                uploadSound: null
              },
              {
                sentenceEng: "",
                sentenceTh: "",
                speaker: "customer",
                uploadSound: null
              }
            ];
            this.isShowDialogSaveFinish = true;
          });
      } else {
        this.editData();
      }
    },

    async editData() {
      await this.updateSyncStatus(this.practiceId, this.unitId);
      let filterData = this.sentence.filter(
        x => x.sentenceEng != "" && x.sentenceTh != ""
      );

      filterData.map((x, index) => {
        if (this.uploadSound[index].file) {
          x.isSound = true;
        }
      });
      db.collection("practice_draft")
        .doc(this.$route.params.id)
        .update({
          type: "expression",
          levelId: this.levelId,
          unitId: this.unitId,
          order: this.order,
          status: "notSync",
          expression: filterData
        })
        .then(() => {
          filterData.map((x, index) => {
            if (x.isSound == true) {
              if (this.uploadSound[index].file) {
                st.child(
                  "practice/audio/" +
                    this.$route.params.id +
                    "-" +
                    (index + 1) +
                    ".mp3"
                ).put(this.uploadSound[index].file);
              }
            }
          });
          this.isShowDialogSaveFinish = true;
        });
    },
    opendialogDeleteCard(index) {
      this.isShowDailogDeleteFinish = false;
      this.getIndex = index + 1;
      if (
        this.sentence[index].sentenceEng.length > 0 ||
        this.sentence[index].sentenceTh.length > 0
      ) {
        this.dialogdeleteCard = true;
      } else {
        this.moveData(index);
      }
    },
    moveData() {
      this.sentence.splice(this.getIndex - 1, 1);
      this.sentence.push({ sentenceEng: "", sentenceTh: "" });
      this.boxCount--;
    },
    confirmDeleteCard() {
      this.dialogdeleteCard = false;
      this.isShowDailogDeleteFinish = true;
      this.moveData();
    }
  },
  mounted() {
    if (this.$route.name == "expressionEdit") {
      this.editMode();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
