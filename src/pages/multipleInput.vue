<template>
  <q-page>
    <div class="container">
      <div class="text-h6 text-center q-pb-md">
        <div>{{ practiceData.levelName }}</div>
        <div>{{ practiceData.unitOrder + ". " + practiceData.unitName }}</div>
      </div>
      <div class="q-pt-sm">
        <span>
          รหัสลำดับ
          <span class="q-mx-md text-grey-5">ตัวเลข 3 หลัก</span>
        </span>

        <div>
          <q-input
            mask="###"
            bg-color="white"
            outlined
            ref="orderid"
            v-model.number="data.order"
            dense
            lazy-rules
            :error="isErrorOrder"
            :error-message="orderMessage"
            :rules="[val => !!val]"
          />
        </div>
      </div>
      <div class="q-pb-md">
        <q-checkbox
          color="black"
          v-model="data.isQuestionSound"
          style="margin-left:-10px;"
          label="คำถามเป็นเสียง"
        />
      </div>
      <div class="q-pb-sm">
        <span>คำถาม</span>
        <div>
          <q-editor
            square
            outlined
            @input="checkEditor('question')"
            :definitions="
                data.isQuestionSound
                  ? {
                      upload: {
                        icon: 'cloud_upload',
                        label: 'อัปโหลดเสียง',
                        handler: uploadQuestion
                      }
                    }
                  : null
              "
            :toolbar="[
                ['bold', 'italic', 'underline'],
                ['upload', 'save']
              ]"
            v-model="data.question"
            min-height="7rem"
          />
          <div v-if="data.isQuestionSound" class="box-choice-sound bg-white row">
            <div
              :class="dataQuestion.status ? 'offset-1' : ''"
              class="col self-center q-pa-md"
              align="center"
            >
              <span v-if="isAddMode">
                <span v-if="!dataQuestion.status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                <span v-if="dataQuestion.status">{{ dataQuestion.file.name }}</span>
              </span>

              <span v-else>
                <span v-if="!dataQuestion.status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                <span v-if="dataQuestion.status && !dataQuestion.file">{{ $route.params.id }}</span>
                <span v-if="dataQuestion.status && dataQuestion.file">{{ dataQuestion.file.name }}</span>
              </span>
            </div>

            <div
              class="col-1 self-center"
              align="center"
              style="width:50px;"
              v-if="dataQuestion.status"
            >
              <q-btn
                @click="
                    (dataQuestion.status = false), (dataQuestion.file = null)
                  "
                dense
                icon="far fa-trash-alt"
                color="blue-grey-10"
                size="14px"
                style="padding-bottom:3px"
              />
            </div>
          </div>

          <input
            @change="fileSound($event.target.files[0], 5)"
            type="file"
            :id="'soundQuestion'"
            accept="audio/*"
            class="visually-hidden"
          />
        </div>
      </div>
      <div class="row">
        <!-- SECTION : ใช้ในกรณีอัพโหลดไพล์ -->
        <div class="q-py-md col-12">
          <div>
            ไฟล์รูปภาพ
            <span class="q-mx-md text-grey-5">ไฟล์ jpg ขนาด 200x200 px เท่านั้น</span>
          </div>
          <q-file
            accept=".jpg"
            bg-color="white"
            class="q-py-sm cursor-pointer text-grey-7"
            outlined
            square
            v-model="uploadImg.file"
            style="width:100%;"
          >
            <template v-slot:append>
              <!-- NOTE : ปุ่มเลือกไพล์ สำหรับ Add Mode -->
              <div v-if="isAddMode">
                <div
                  style="width:100px"
                  class="text-subtitle1 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                  @click.stop="uploadImg.file = null"
                  v-if="!uploadImg.file"
                >เลือกไฟล์</div>
                <div
                  class="cursor-pointer rounded-borders text-white bg-blue-grey-10"
                  v-if="uploadImg.file"
                  @click="uploadImg.file = null"
                >
                  <span class="far fa-trash-alt q-px-xs"></span>
                </div>
              </div>

              <!-- NOTE : ปุ่มเลือกไพล์ สำหรับ Edit Mode -->
              <div v-if="!isAddMode">
                <div
                  style="width:100px"
                  class="text-subtitle1 rounded-borders text-center bg-blue-grey-10 text-white q-pa-xs cursor-pointer"
                  @click.stop="uploadImg.file = null"
                  v-if="!data.isImage && !uploadImg.file"
                >เลือกไฟล์</div>
                <div
                  class="cursor-pointer rounded-borders text-white bg-blue-grey-10"
                  v-if="data.isImage || uploadImg.file"
                  @click="uploadImg.file = null,data.isImage = false"
                >
                  <span class="far fa-trash-alt q-px-xs"></span>
                </div>
              </div>
            </template>

            <div v-if="!uploadImg.file">
              <div style="width:100%" class="text-subtitle1 row absolute-center text-grey-7">
                <div
                  class="col text-center"
                  v-if="!uploadImg.file"
                  @click.stop="uploadImg.file = null"
                >
                  <span v-if="isAddMode">ลากแล้ววาง หรือ</span>
                  <span v-else>
                    <span v-if="data.isImage">{{$route.params.id}}</span>
                    <span v-else>ลากแล้ววาง หรือ</span>
                  </span>
                </div>
              </div>
            </div>
          </q-file>
        </div>
      </div>

      <div>
        <!-- SECTION : ใช้ในกรณีคำตอบเป็นเสียง -->
        <div class="row" style="width:360px">
          <div class="col-6">
            <q-checkbox
              style="margin-left:-10px;"
              v-model="data.isAnswerSound"
              val="teal"
              label="คำตอบเป็นเสียง"
              color="blue-grey-10"
            />
          </div>
        </div>

        <!-- SECTION : ตัวเลือกที่ 1 -->
        <div class="q-py-sm">
          <span>ตัวเลือก #1</span>
          <div>
            <q-editor
              square
              outlined
              :content-class="isErrorChoice1 ? 'brx' : null"
              @input="checkEditor('choice1')"
              :definitions="
                data.isAnswerSound
                  ? {
                      upload: {
                        icon: 'cloud_upload',
                        label: 'อัปโหลดเสียง',
                        handler: uploadIt1
                      }
                    }
                  : null
              "
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['upload', 'save']
              ]"
              v-model.trim="data.choices[0].choice"
              min-height="7rem"
            />
            <div v-if="data.isAnswerSound" class="box-choice-sound bg-white row">
              <div
                :class="dataFiles[0].status ? 'offset-1' : ''"
                class="col self-center q-pa-md"
                align="center"
              >
                <span v-if="isAddMode">
                  <span v-if="!dataFiles[0].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span v-if="dataFiles[0].status">{{ dataFiles[0].file.name }}</span>
                </span>

                <span v-else>
                  <span v-if="!dataFiles[0].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span
                    v-if="dataFiles[0].status && !dataFiles[0].file"
                  >{{ $route.params.id + "-1.mp3" }}</span>
                  <span v-if="dataFiles[0].status && dataFiles[0].file">{{ dataFiles[0].file.name }}</span>
                </span>
              </div>

              <div
                class="col-1 self-center"
                align="center"
                style="width:50px;"
                v-if="dataFiles[0].status"
              >
                <q-btn
                  @click="
                    (dataFiles[0].status = false), (dataFiles[0].file = null)
                  "
                  dense
                  icon="far fa-trash-alt"
                  color="blue-grey-10"
                  size="14px"
                  style="padding-bottom:3px"
                />
              </div>
            </div>
          </div>
          <input
            @change="fileSound($event.target.files[0], 1)"
            type="file"
            :id="'soundId1'"
            accept="audio/*"
            class="visually-hidden"
          />
        </div>

        <!-- SECTION : ตัวเลือกที่ 2 -->
        <div class="q-py-sm">
          <span>ตัวเลือก #2</span>
          <div>
            <q-editor
              square
              outlined
              :content-class="isErrorChoice2 ? 'brx' : null"
              @input="checkEditor('choice2')"
              :definitions="
                data.isAnswerSound
                  ? {
                      upload: {
                        icon: 'cloud_upload',
                        label: 'อัปโหลดเสียง',
                        handler: uploadIt2
                      }
                    }
                  : null
              "
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['upload', 'save']
              ]"
              v-model.trim="data.choices[1].choice"
              min-height="7rem"
            />
            <div v-if="data.isAnswerSound" class="box-choice-sound bg-white row">
              <div
                :class="dataFiles[1].status ? 'offset-1' : ''"
                class="col self-center q-pa-md"
                align="center"
              >
                <span v-if="isAddMode">
                  <span v-if="!dataFiles[1].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span v-if="dataFiles[1].status">{{ dataFiles[1].file.name }}</span>
                </span>

                <span v-else>
                  <span v-if="!dataFiles[1].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span
                    v-if="dataFiles[1].status && !dataFiles[1].file"
                  >{{ $route.params.id + "-2.mp3" }}</span>
                  <span v-if="dataFiles[1].status && dataFiles[1].file">{{ dataFiles[1].file.name }}</span>
                </span>
              </div>

              <div
                class="col-1 self-center"
                align="center"
                style="width:50px;"
                v-if="dataFiles[1].status"
              >
                <q-btn
                  @click="
                    (dataFiles[1].status = false), (dataFiles[1].file = null)
                  "
                  dense
                  icon="far fa-trash-alt"
                  color="blue-grey-10"
                  size="14px"
                  style="padding-bottom:3px"
                />
              </div>
            </div>
          </div>
          <input
            @change="fileSound($event.target.files[0], 2)"
            type="file"
            :id="'soundId2'"
            accept="audio/*"
            class="visually-hidden"
          />
        </div>

        <!-- SECTION : ตัวเลือกที่ 3 -->
        <div class="q-py-sm">
          <span>ตัวเลือก #3</span>
          <div>
            <q-editor
              square
              outlined
              @input="checkEditor('choice3')"
              :definitions="
                data.isAnswerSound
                  ? {
                      upload: {
                        icon: 'cloud_upload',
                        label: 'อัปโหลดเสียง',
                        handler: uploadIt3
                      }
                    }
                  : null
              "
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['upload', 'save']
              ]"
              v-model.trim="data.choices[2].choice"
              min-height="7rem"
            />
            <div v-if="data.isAnswerSound" class="box-choice-sound bg-white row">
              <div
                :class="dataFiles[2].status ? 'offset-1' : ''"
                class="col self-center q-pa-md"
                align="center"
              >
                <span v-if="isAddMode">
                  <span v-if="!dataFiles[2].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span v-if="dataFiles[2].status">{{ dataFiles[2].file.name }}</span>
                </span>

                <span v-else>
                  <span v-if="!dataFiles[2].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span
                    v-if="dataFiles[2].status && !dataFiles[2].file"
                  >{{ $route.params.id + "-3.mp3" }}</span>
                  <span v-if="dataFiles[2].status && dataFiles[2].file">{{ dataFiles[2].file.name }}</span>
                </span>
              </div>

              <div
                class="col-1 self-center"
                align="center"
                style="width:50px;"
                v-if="dataFiles[2].status"
              >
                <q-btn
                  @click="
                    (dataFiles[2].status = false), (dataFiles[2].file = null)
                  "
                  dense
                  icon="far fa-trash-alt"
                  color="blue-grey-10"
                  size="14px"
                  style="padding-bottom:3px"
                />
              </div>
            </div>
          </div>
          <input
            @change="fileSound($event.target.files[0], 3)"
            type="file"
            :id="'soundId3'"
            accept="audio/*"
            class="visually-hidden"
          />
        </div>

        <!-- SECTION : ตัวเลือกที่ 4 -->
        <div class="q-py-sm">
          <span>ตัวเลือก #4</span>
          <div>
            <q-editor
              square
              outlined
              @input="checkEditor('choice4')"
              :definitions="
                data.isAnswerSound
                  ? {
                      upload: {
                        icon: 'cloud_upload',
                        label: 'อัปโหลดเสียง',
                        handler: uploadIt4
                      }
                    }
                  : null
              "
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['upload', 'save']
              ]"
              v-model.trim="data.choices[3].choice"
              min-height="7rem"
            />
            <div v-if="data.isAnswerSound" class="box-choice-sound bg-white row">
              <div
                :class="dataFiles[3].status ? 'offset-1' : ''"
                class="col self-center q-pa-md"
                align="center"
              >
                <span v-if="isAddMode">
                  <span v-if="!dataFiles[3].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span v-if="dataFiles[3].status">{{ dataFiles[3].file.name }}</span>
                </span>

                <span v-else>
                  <span v-if="!dataFiles[3].status" class="text-grey-6">ยังไม่ใส่ไฟล์เสียง</span>
                  <span
                    v-if="dataFiles[3].status && !dataFiles[3].file"
                  >{{ $route.params.id + "-4.mp3" }}</span>
                  <span v-if="dataFiles[3].status && dataFiles[3].file">{{ dataFiles[3].file.name }}</span>
                </span>
              </div>

              <div
                class="col-1 self-center"
                align="center"
                style="width:50px;"
                v-if="dataFiles[3].status"
              >
                <q-btn
                  @click="
                    (dataFiles[3].status = false), (dataFiles[3].file = null)
                  "
                  dense
                  icon="far fa-trash-alt"
                  color="blue-grey-10"
                  size="14px"
                  style="padding-bottom:3px"
                />
              </div>
            </div>
          </div>
          <input
            @change="fileSound($event.target.files[0], 4)"
            type="file"
            :id="'soundId4'"
            accept="audio/*"
            class="visually-hidden"
          />
        </div>
      </div>
      <div class="q-py-sm">
        <span>ตัวเลือกที่ถูกต้อง</span>
        <div
          class="row q-px-md"
          :class="isCorrectAnswer && !data.correctAnswer ? 'brx' : 'boxAnswer'"
        >
          <div class="col-xs-6 col-md-3 col-sm-3">
            <q-radio
              style="margin-left:-10px"
              color="blue-grey-10"
              v-model.number="data.correctAnswer"
              :val="1"
              label="1"
              :disable="!data.choices[0].choice || !data.choices[1].choice"
            />
          </div>
          <div class="col-xs-6 col-md-3 col-sm-3">
            <q-radio
              style="margin-left:-10px"
              color="blue-grey-10"
              v-model.number="data.correctAnswer"
              :val="2"
              label="2"
              :disable="!data.choices[0].choice ||!data.choices[1].choice"
            />
          </div>
          <div class="col-xs-6 col-md-3 col-sm-3">
            <q-radio
              style="margin-left:-10px"
              color="blue-grey-10"
              :disable="
                !data.choices[2].choice ||
                  !data.choices[0].choice ||
                  !data.choices[1].choice
              "
              v-model.number="data.correctAnswer"
              :val="3"
              label="3"
            />
          </div>
          <div class="col-xs-6 col-md-3 col-sm-3">
            <q-radio
              style="margin-left:-10px"
              color="blue-grey-10 "
              :disable="
                !data.choices[3].choice ||
                  !data.choices[0].choice ||
                  !data.choices[1].choice ||
                  !data.choices[2].choice
              "
              v-model.number="data.correctAnswer"
              :val="4"
              label="4"
            />
          </div>
        </div>
      </div>
      <div class="q-pb-lg">
        <span>คำอธิบาย</span>
        <div>
          <q-editor
            square
            outlined
            :toolbar="[['bold', 'italic', 'underline']]"
            v-model="data.description"
            min-height="7rem"
          />
        </div>
      </div>
      <div align="center">
        <div class="row reverse-wrap justify-center" style="max-width:340px;width:100%">
          <div class="col-6 q-py-sm text-left">
            <q-btn
              v-close-popup
              dense
              @click="backBtn()"
              style="width:150px"
              color="white"
              outline
              text-color="blue-grey-10"
              label="ยกเลิก"
            />
          </div>
          <div class="col-6 q-py-sm text-right">
            <q-btn
              :disable="isSaveData"
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
    dialogSetting,
  },
  data() {
    return {
      uploadImg: {
        file: null,
        status: false,
      },
      // ข้อมูล
      dataQuestion: {
        file: null,
        status: false,
      },

      practiceData: {
        levelName: "",
        unitName: "",
        unitOrder: "",
      },
      data: {
        isImage: false,
        isSound: false,
        practiceId: this.$route.params.practiceId,
        levelId: this.$route.params.levelId,
        unitId: this.$route.params.unitId,
        order: "",
        question: "",
        description: "",
        correctAnswer: 0,
        choices: [
          { choice: "", isSound: false },
          { choice: "", isSound: false },
          { choice: "", isSound: false },
          { choice: "", isSound: false },
        ],
        isAnswerSound: false,
        isQuestionSound: false,
        status: "notSync",
        type: "multiplechoice",
      },

      dataFiles: [
        {
          file: null,
          status: false,
        },
        {
          file: null,
          status: false,
        },
        {
          file: null,
          status: false,
        },
        {
          file: null,
          status: false,
        },
      ],
      oldOrder: "",
      //   เช็คช่องคำถามข้อมูล & ตัวเลือก

      isErrorChoice1: false,
      isErrorChoice2: false,
      finishDialog: false,
      isErrorOrder: false,
      orderMessage: "",
      isAddMode: true,

      isSaveData: false,
      isSaveDialogSuccess: false,

      isCorrectAnswer: false,
    };
  },
  methods: {
    // โหลด ข้อมูล หน้าแก้ไข
    loadLevel() {
      let levelKey = this.$route.params.levelId;
      db.collection("level")
        .doc(levelKey)
        .get()
        .then((result) => {
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
        .then((result) => {
          if (result.exists) {
            this.practiceData.unitName = result.data().name;
            this.practiceData.unitOrder = result.data().order;
            // โหลดข้อมูล คำสั่ง
          }
        });
    },
    loadDataEdit() {
      this.loadingShow();

      db.collection("practice_draft")
        .doc(this.$route.params.id)
        .get()
        .then((doc) => {
          this.data = doc.data();
          this.oldOrder = doc.data().order;
          this.dataQuestion.status = doc.data().isSound;
          this.uploadImg.status = doc.data().isImage;
          doc.data().choices.map(async (x, index) => {
            if (x.isSound) {
              this.dataFiles[index].status = true;
            }
          });
          this.isLoad = false;
          this.loadingHide();
        });
    },
    // บันทึก
    async saveBtn() {
      // เช็คช่องกรอกข้อมูล ก่อนบันทึก ว่ากรอกข้อมูลรึยัง ข้อมูลที่จำเป็นต้องกรอก
      let hasChoice = this.data.choices.filter((x) => x.choice != "");
      this.$refs.orderid.validate();
      if (this.$refs.orderid.hasError) {
      }

      if (hasChoice.length < 2) {
        // การเช็คตัวเลือก 1&2 ถ้าข้อความน้อยก่ว่า 0 ให้ มีกรอบสีแดง
        let index = this.data.choices.findIndex((x) => x.choice == "");
        if (index == 0) {
          this.isErrorChoice1 = true;
        } else if (index == 1) {
          this.isErrorChoice2 = true;
        }
      }
      if (!this.data.correctAnswer) {
        this.isCorrectAnswer = true;
        return;
      }

      this.data.choices.map((x, index) => {
        if (hasChoice[index]) {
          this.data.choices[index].choice = hasChoice[index].choice;
        } else {
          this.data.choices[index].choice = "";
        }
      });
      if (this.uploadImg.file) {
        this.data.isImage = true;
        this.uploadImg.status = true;
      }
      if (this.dataQuestion.file) {
        this.data.isSound = true;
        this.dataQuestion.status = true;
      }

      this.dataFiles.map((x, index) => {
        if (x.status) {
          this.data.choices[index].isSound = true;
        } else {
          this.data.choices[index].isSound = false;
        }
      });
      if (this.data.order == "") {
        return;
      }

      await this.updateSyncStatus(
        this.$route.params.practiceId,
        this.$route.params.unitId
      );
      let getOrder = await db
        .collection("practice_draft")
        .where("order", "==", this.data.order)
        .where("practiceId", "==", this.data.practiceId)
        .get();
      if (getOrder.size > 0 && this.oldOrder != this.data.order) {
        this.orderMessage = "รหัสลำดับนี้มีการใช้งานแล้ว";
        this.isErrorOrder = true;
        setTimeout(() => {
          this.orderMessage = "";
          this.isErrorOrder = false;
        }, 1000);
      } else {
        this.loadingShow();
        this.isSaveData = true;
        //  หน้า เพิ่มข้อมูล
        if (this.isAddMode) {
          db.collection("practice_draft")
            .add(this.data)
            .then(async (doc) => {
              // เช็คขูอมูลภาพและเสียง
              if (this.uploadImg.status) {
                await st
                  .child("/practice/image/" + doc.id + ".jpg")
                  .put(this.uploadImg.file);
              }

              if (this.dataQuestion.status) {
                await st
                  .child("/practice/audio/" + doc.id + ".mp3")
                  .put(this.dataQuestion.file);
              }

              // แบบมีเสียง เพิ่ม
              if (this.data.isAnswerSound) {
                this.dataFiles.map((x, index) => {
                  if (x.status) {
                    st.child(
                      "/practice/audio/" + doc.id + "-" + (index + 1) + ".mp3"
                    ).put(x.file);
                  }
                });
              }
              this.loadingHide();
              this.isSaveDialogSuccess = true;
              setTimeout(() => {
                this.$router.push(
                  "/multipleMain/" +
                    this.data.levelId +
                    "/" +
                    this.data.unitId +
                    "/" +
                    this.data.practiceId
                );
              }, 1000);
            });
        }

        // หน้า แก้ไข
        else {
          this.data.status = "notSync";
          db.collection("practice_draft")
            .doc(this.$route.params.id)
            .set(this.data)
            .then(async () => {
              // เช็คขูอมูลภาพและเสียง
              if (this.data.isImage) {
                if (this.uploadImg.file) {
                  await st
                    .child("/practice/image/" + this.$route.params.id + ".jpg")
                    .put(this.uploadImg.file);
                }
              } else {
                if (this.uploadImg.status) {
                  await st
                    .child("/practice/image/" + this.$route.params.id + ".jpg")
                    .delete();
                }
              }
              if (this.data.isSound) {
                if (this.dataQuestion.file) {
                  await st
                    .child("/practice/audio/" + this.$route.params.id + ".mp3")
                    .put(this.dataQuestion.file);
                }
              } else {
                if (this.dataQuestion.status) {
                  await st
                    .child("/practice/audio/" + this.$route.params.id + ".mp3")
                    .delete();
                }
              }
              // แบบมีเสียง เพิ่ม
              if (this.data.isAnswerSound) {
                this.dataFiles.map(async (x, index) => {
                  if (x.status) {
                    if (x.file) {
                      await st
                        .child(
                          "/practice/audio/" +
                            this.$route.params.id +
                            "-" +
                            (index + 1) +
                            ".mp3"
                        )
                        .put(x.file);
                    }
                  } else {
                    if (this.data.choices[index].isSound) {
                      await st
                        .child(
                          "/practice/audio/" +
                            this.$route.params.id +
                            "-" +
                            (index + 1) +
                            ".mp3"
                        )
                        .delete();
                    }
                  }
                });
              }
              this.loadingHide();
              this.isSaveDialogSuccess = true;
              setTimeout(() => {
                this.$router.push(
                  "/multipleMain/" +
                    this.data.levelId +
                    "/" +
                    this.data.unitId +
                    "/" +
                    this.data.practiceId
                );
              }, 1000);
            });
        }
      }
    },
    checkEditor(type) {
      if (type == "choice1") {
        if (this.data.choices[0].choice == "") {
          this.data.correctAnswer = 0;
          this.isErrorChoice1 = true;
        } else {
          this.isErrorChoice1 = false;
        }
      } else if (type == "choice2") {
        if (this.data.choices[1].choice == "") {
          this.data.correctAnswer = 0;
          this.isErrorChoice2 = true;
        } else {
          this.isErrorChoice2 = false;
        }
      } else if (type == "choice3") {
        if (this.data.choices[2].choice == "") {
          this.data.correctAnswer = 0;
        }
      } else if (type == "choice4") {
        if (this.data.choices[3].choice == "") {
          this.data.correctAnswer = 0;
        }
      }
    },
    // การบันทึก ข้อมูลเสียงเข้าตัวแปล
    fileSound(val, type) {
      if (type == 1) {
        this.dataFiles[0].status = true;
        this.dataFiles[0].file = val;
      }
      if (type == 2) {
        this.dataFiles[1].status = true;
        this.dataFiles[1].file = val;
      }
      if (type == 3) {
        this.dataFiles[2].status = true;
        this.dataFiles[2].file = val;
      }
      if (type == 4) {
        this.dataFiles[3].status = true;
        this.dataFiles[3].file = val;
      }
      if (type == 5) {
        this.dataQuestion.status = true;
        this.dataQuestion.file = val;
      }
    },
    uploadQuestion() {
      var elem = document.querySelector("#soundQuestion");
      elem.value = "";

      elem.click();
    },
    uploadIt1() {
      var elem = document.querySelector("#soundId1");
      elem.value = "";

      elem.click();
    },
    uploadIt2() {
      var elem = document.querySelector("#soundId2");
      elem.value = "";

      elem.click();
    },
    uploadIt3() {
      var elem = document.querySelector("#soundId3");
      elem.value = "";

      elem.click();
    },
    uploadIt4() {
      var elem = document.querySelector("#soundId4");
      elem.value = "";

      elem.click();
    },
    backBtn() {
      this.$router.push(
        "/multipleMain/" +
          this.data.levelId +
          "/" +
          this.data.unitId +
          "/" +
          this.data.practiceId
      );
    },
  },
  mounted() {
    this.loadLevel();
    if (this.$route.name == "multipleEdit") {
      if (this.$route.params.id == undefined) {
        this.$router.go(-1);
        return;
      }
      this.isAddMode = false;
      this.loadDataEdit();
    }
  },
};
</script>
<style scoped>
.boxAnswer {
  border: 1px solid #fafafa;
}
.box-choice-sound {
  border: 1px solid #d4d4d4;
}
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}

.box-border-input {
  border: 1px solid#000;
}

.box-border-top {
  border-top: 1px solid#000;
}

.box-border-error {
  border: 1px solid#f00;
}

.text-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
