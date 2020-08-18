<template>
  <q-page>
    <div class="container" align="center">
      <!-- box เซิร์ฟเวอร์  -->
      <div class="row justify-between">
        <div class="col text-left">
          <div class="row boxServer">
            <!-- แบบร่าง -->
            <div class="col">
              <q-radio
                @input="loadPracticeData(false)"
                color="blue-grey-10"
                v-model="mode"
                val="draft"
                label="แบบร่าง"
              />
            </div>
            <!-- เซิร์ฟเวอร์ -->
            <div class="col">
              <q-radio
                @input="loadPracticeData(true)"
                color="blue-grey-10"
                v-model="mode"
                val="server"
                label="เซิร์ฟเวอร์"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="q-ml-md" v-if="$q.platform.is.mobile">
            <sync-btn :practiceId="practiceId" :isServer="isDisable"></sync-btn>
          </div>
          <div class="row desktop-only" v-if="mode == 'draft'">
            <div class="q-mx-md">
              <sync-btn :practiceId="practiceId"></sync-btn>
            </div>
            <!-- ปุ่มพิมพ์ -->
            <div class="mobile-hide">
              <q-btn
                v-if="mode == 'draft'"
                round
                color="blue-grey-10"
                icon="fas fa-print"
                @click="printMe()"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-h6">
        <div class="q-pt-md">{{ practiceData.levelName }}</div>
        <div>{{ practiceData.unitOrder + ". " + practiceData.unitName }}</div>
      </div>
      <!-- box คำสั่ง -->
      <div class="box text-left q-my-md">
        <div class="bg-blue-grey-10 text-white boxQuestion row q-px-xs">
          <div class="col self-center q-px-sm">คำสั่ง</div>
          <div class="col self-center" align="right">
            <q-btn
              v-if="mode == 'draft'"
              @click="editQuestion()"
              size="sm"
              round
              flat
              icon="far fa-edit"
            />
          </div>
        </div>
        <div class="row q-px-md q-py-sm">
          <div class="col-12 self-center q-py-sm">
            <span class="text-subtitle1" v-if="instrunction.eng">{{ instrunction.eng }}</span>
            <span v-else>ยังไม่ระบุ</span>
          </div>
          <q-separator class="q-my-xs" />
          <div class="col-12 self-center q-py-sm">
            <span class="text-subtitle1" v-if="instrunction.th ">{{ instrunction.th }}</span>
            <span v-else>ยังไม่ระบุ</span>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <!-- ปุ่ม เพิ่มคำถาม -->
      <div>
        <q-btn
          @click="addQuestion()"
          style="width:190px"
          dense
          :disable="mode == 'server'"
          color="blue-grey-10"
          label="เพิ่มคำถาม"
        />
      </div>
      <!-- โชว์ DATA -->

      <div
        v-for="(item, index) in practiceDataList"
        :key="index"
        class="box text-left q-my-md relative-position"
      >
        <div
          class="absolute-top-left q-pa-sm mobile-only"
          v-if="item.status == 'waitForDelete'"
          style="z-index:30"
        >
          <a
            class="text-white cursor-pointer"
            @click="cancelDelete(item.id)"
            style="text-decoration:underline;"
          >ยกเลิกการลบ</a>
        </div>
        <q-btn
          dense
          style="z-index:30;width:190px;"
          class="absolute-center text-blue-grey-10 desktop-only"
          v-if="item.status  == 'waitForDelete'"
          color="white"
          label="ยกเลิกการลบ"
          @click="cancelDelete(item.id)"
        ></q-btn>
        <div v-if="item.status == 'waitForDelete'" class="absolute-center backDrop"></div>
        <div class="boxQuestion bg-blue-grey-10 text-white q-py-xs q-px-xs row">
          <div class="col self-center q-px-sm">
            <span class="desktop-only">รหัสลำดับ {{ item.order }}</span>
            <span
              class="mobile-only"
              v-if="item.status != 'waitForDelete'"
            >รหัสลำดับ {{ item.order }}</span>
          </div>
          <div class="col self-center desktop-only" align="right">
            <q-btn
              v-if="mode == 'draft'"
              @click="deleteBtn(item.id, item.order, index)"
              size="sm"
              class="q-mr-sm"
              round
              flat
              icon="far fa-trash-alt"
            />
            <q-btn
              v-if="mode == 'draft'"
              @click="editData(item)"
              size="sm"
              flat
              round
              icon="far fa-edit"
            />
          </div>
          <q-btn
            class="mobile-only"
            v-if="mode== 'draft'"
            size="13px"
            icon="fas fa-ellipsis-v"
            round
            dense
            flat
          >
            <q-menu anchor="top right" self="top right" :offset="[7,-37]">
              <q-list style="min-width: 120px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="editData(item)">แก้ไขคำถาม</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="deleteBtn(item.id,item.order,index)">ลบคำถาม</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <div v-if="item.imageURL || item.question || item.isQuestionSound" class="q-px-md q-pt-md">
          <div>
            <span class="q-pr-sm">{{index + 1 + "."}}</span>
            <div class="text-center" v-if="item.imageURL">
              <img style="max-width:200px;width:100%;" :src="item.imageURL" alt />
            </div>
            <q-btn
              round
              size="xs"
              flat
              icon="fas fa-volume-up"
              v-if="item.audioURL && item.isQuestionSound"
              @click="playAudio(item.audioURL)"
              class="q-mr-xs"
            ></q-btn>
            <span class="q-mr-sm" v-if="item.isQuestionSound && !item.isSound">
              <q-icon class="text-grey-6 no-pointer-events" name="fas fa-volume-mute  "></q-icon>
            </span>
            <span v-if="item.question" v-html="item.question"></span>
          </div>
        </div>
        <div class="q-px-md q-py-md">
          <div v-for="(items, index2) in item.choices" :key="index2">
            <div v-if="item.isAnswerSound && items.choice">
              <span
                class="q-pr-sm q-pl-xs"
                :class="
                  item.correctAnswer == index2 + 1
                    ? 'bg-secondary text-white '
                    : ''
                "
              >
                <span v-if="!items.isSound && item.correctAnswer != index2 + 1">
                  <q-icon class="text-grey-6 no-pointer-events" name="fas fa-volume-mute "></q-icon>
                </span>
                <span v-if="!items.isSound && item.correctAnswer == index2 + 1">
                  <q-icon class="text-white no-pointer-events" name="fas fa-volume-mute  "></q-icon>
                </span>
                <q-btn
                  v-if="items.isSound "
                  flat
                  round
                  size="xs"
                  icon="fas fa-volume-up"
                  @click="playAudio(items.soundURL)"
                ></q-btn>
                {{ index2 + 1 + ") " + items.choice }}
              </span>
            </div>
            <div v-if="!item.isAnswerSound">
              <span
                v-if="items.choice"
                class="q-pr-sm"
                :class="
                  item.correctAnswer == index2 + 1
                    ? 'bg-secondary text-white '
                    : ''
                "
              >{{ index2 + 1 + ") " + items.choice }}</span>
            </div>
          </div>
        </div>
        <div class="q-px-md q-pb-md" v-if="item.description">
          <q-separator class="q-mb-sm"></q-separator>
          <span v-html="item.description"></span>
        </div>
      </div>

      <!-- dialog แก่ไข คำสั่ง -->
      <q-dialog v-model="isQuestionDialog" persistent>
        <q-card style="max-width:600px;width:100%">
          <div class="text-h6 text-center q-pt-md q-pb-sm">แก้ไขคำสั่ง</div>
          <div class="q-px-md">
            <div>
              <span>คำสั่งภาษาอังกฤษ</span>
              <q-input
                dense
                autogrow
                :rules="[ val => val && val.length > 0]"
                ref="instrunctionEng"
                outlined
                type="text"
                v-model="instrunctionEng"
              />
            </div>
            <div>
              <span>คำสั่งภาษาไทย</span>
              <q-input
                dense
                autogrow
                :rules="[ val => val && val.length > 0 ]"
                ref="instrunctionTh"
                outlined
                type="text"
                v-model="instrunctionTh"
              />
            </div>
          </div>
          <div align="center">
            <div class="row q-mb-md q-px-lg" style="max-width:400px;width:100%">
              <div class="col q-px-sm">
                <q-btn
                  v-close-popup
                  dense
                  style="max-width:150px;width:100%"
                  color="white"
                  outline
                  text-color="black"
                  label="ยกเลิก"
                />
              </div>
              <div class="col q-px-sm">
                <q-btn
                  @click="saveBtn()"
                  dense
                  style="max-width:150px;width:100%"
                  color="black"
                  label="บันทึก"
                />
              </div>
            </div>
          </div>
        </q-card>
      </q-dialog>

      <!--แจ้ง ลบคำถาม  -->
      <dialog-setting
        :type="3"
        :name="name"
        :practice="'คำถาม'"
        v-if="isDeleteDataDialogSuccess"
        @emitConfirmDelete="deleteData"
        @emitCancelDelete="isDeleteDataDialogSuccess = false"
      ></dialog-setting>
      <!--ลบเรียบร้อย  -->
      <dialog-setting
        :type="4"
        v-if="isDeleteDialogSuccess"
        @autoClose="isDeleteDialogSuccess = false"
      ></dialog-setting>
      <!-- บันทึกเรียบร้อย  -->
      <dialog-setting :type="6" v-if="isSaveDialogSuccess" @autoClose="isSaveDialogSuccess = false"></dialog-setting>
    </div>
  </q-page>
</template>

<script>
import { db, st } from "../router";
import syncBtn from "../components/syncBtn";
import dialogSetting from "../components/dialogSetting";
export default {
  components: {
    dialogSetting,
    syncBtn,
  },
  data() {
    return {
      name: "",
      mode: "draft",
      practiceData: {
        levelName: "",
        unitName: "",
        unitOrder: "",
      },
      instrunction: {
        eng: "",
        th: "",
      },
      practiceDataList: [],
      orderId: "",
      instrunctionTh: "",
      instrunctionEng: "",
      practiceId: this.$route.params.practiceId,
      indexKey: "",
      deleteKey: "",
      questionAdd: false,
      questionKey: "",
      pathFile:
        "https://storage.googleapis.com/atwork-dee11.appspot.com/practice/",
      playSoundURL: "",
      isSaveDialogSuccess: false,
      isQuestionDialog: false,

      isDeleteDataDialogSuccess: false,
      isDeleteDialogSuccess: false,
      isDisable: false,
      syncData: "",
    };
  },
  methods: {
    loadLevel() {
      this.loadingShow();

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
            this.loadInstrunction();
          }
        });
    },

    loadInstrunction() {
      let practiceId = this.$route.params.practiceId;
      db.collection("practice_list")
        .doc(practiceId)
        .get()
        .then((result) => {
          if (result.exists) {
            if (result.data().instrunctionEng) {
              this.instrunction.eng = result.data().instrunctionEng;
              this.instrunctionEng = result.data().instrunctionEng;
            } else {
              this.instrunction.eng = "";
            }

            if (result.data().instrunctionTh) {
              this.instrunction.th = result.data().instrunctionTh;
              this.instrunctionTh = result.data().instrunctionTh;
            } else {
              this.instrunction.th = "";
            }
          }

          this.loadPracticeData();
        });
    },
    // โหลดข้อมูลเข้ามาเก็บไว้ทั้งหมด
    loadPracticeData(val) {
      this.isDisable = val;
      this.loadingShow();
      this.practiceDataList = [];
      let practiceId = this.$route.params.practiceId;

      let dbData;
      if (typeof this.syncData == "function") {
        this.syncData();
      }

      if (this.mode == "draft") {
        dbData = db.collection("practice_draft");
      } else {
        dbData = db.collection("practice_server");
      }

      this.syncData = dbData
        .where("practiceId", "==", practiceId)
        .onSnapshot((doc) => {
          let temp = [];

          doc.forEach((element) => {
            let getSound = "";
            let getImage = "";
            let getChoiceSound = element.data().choices;

            if (element.data().isImage) {
              getImage = this.pathFile + "image/" + element.id + ".jpg";
            }
            if (element.data().isSound) {
              getSound = this.pathFile + "audio/" + element.id + ".mp3";
            }
            if (element.data().isAnswerSound) {
              getChoiceSound.map(async (x, index) => {
                if (x.isSound) {
                  getChoiceSound[index].soundURL =
                    this.pathFile +
                    "audio/" +
                    element.id +
                    "-" +
                    (index + 1) +
                    ".mp3";
                }
              });
            }

            let dataKey = {
              id: element.id,
              imageURL: getImage,
              audioURL: getSound,
              choices: getChoiceSound,
            };

            let final = {
              ...element.data(),
              ...dataKey,
            };

            temp.push(final);
          });

          temp.sort((a, b) => a.order - b.order);

          this.practiceDataList = temp;

          this.loadingHide();
        });
    },
    // กดไปหน้าเพิ่มข้อมูล
    addQuestion() {
      this.$router.push(
        "/multipleAdd/" +
          this.$route.params.levelId +
          "/" +
          this.$route.params.unitId +
          "/" +
          this.$route.params.practiceId
      );
    },
    // กดไปหน้าแก้ไขข้อมูล
    editQuestion() {
      this.isQuestionDialog = true;
    },
    // บันทึกข้อมูลคำสั่ง
    saveBtn() {
      this.$refs.instrunctionTh.validate();
      this.$refs.instrunctionEng.validate();

      if (
        this.$refs.instrunctionTh.hasError ||
        this.$refs.instrunctionEng.hasError
      ) {
        return;
      }
      this.instrunction = {
        th: this.instrunctionTh,
        eng: this.instrunctionEng,
      };
      this.isQuestionDialog = false;

      let practiceId = this.$route.params.practiceId;

      db.collection("practice_list").doc(practiceId).update({
        instrunctionTh: this.instrunction.th,
        instrunctionEng: this.instrunction.eng,
      });

      this.isSaveDialogSuccess = true;
    },

    // กดปุ่ม ICON ลบ เพื่องเก็บ KEY
    deleteBtn(key, id, index) {
      this.name = "รหัสลำดับ" + " " + id;
      this.isDeleteDataDialogSuccess = true;
      this.orderId = id;
      this.deleteKey = key;
      this.indexKey = index;
    },
    // ลบข้อมูล
    async deleteData() {
      await this.updateSyncStatus(
        this.$route.params.practiceId,
        this.$route.params.unitId
      );
      this.isDeleteDataDialogSuccess = false;

      db.collection("practice_draft")
        .doc(this.deleteKey)
        .update({
          status: "waitForDelete",
        })
        .then(() => {
          this.isDeleteDialogSuccess = true;
        });
    },
    // ยกเลิกการลบข้อมูล
    async cancelDelete(key) {
      await this.updateSyncStatus(
        this.$route.params.practiceId,
        this.$route.params.unitId
      );
      db.collection("practice_draft").doc(key).update({
        status: "notSync",
      });
    },
    // กดปุ่ม ICON แก้ไข เพื่องเก็บ KEY ส่งไปหน้า แก้ไขข้อมูล
    editData(item) {
      this.$router.push({
        name: "multipleEdit",
        params: {
          id: item.id,
        },
      });
    },
    printMe() {
      this.$router.push({
        name: "multiplePrint",
        params: {
          title1: this.practiceData.levelName,
          title2: this.practiceData.unitName,
          data: this.practiceDataList,
        },
      });
    },
  },
  mounted() {
    this.loadLevel();
  },
  beforeDestroy() {
    if (typeof this.syncData == "function") {
      this.syncData();
    }
  },
};
</script>
<style scoped>
.box {
  border: 1px solid #263238;
  border-radius: 10px;
}
.boxQuestion {
  height: 40px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.boxServer {
  max-width: 330px;
  width: 100%;
  border: 1px solid #263238;
}
.answer {
  color: white;
}
</style>
