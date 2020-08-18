<template>
  <q-page class="text-blue-grey-10">
    <div class="container">
      <div style="max-width:700px" class="row justify-between">
        <div class="col text-left">
          <div class="row boxServer">
            <!-- แบบร่าง -->
            <div class="col">
              <q-radio
                color="blue-grey-10"
                @input="loadPracticeData(false)"
                v-model="mode "
                val="draft"
                label="แบบร่าง"
              />
            </div>
            <!-- เซิร์ฟเวอร์ -->
            <div class="col">
              <q-radio
                color="blue-grey-10"
                @input="loadPracticeData(true)"
                v-model="mode "
                val="server"
                label="เซิร์ฟเวอร์"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="q-ml-md" v-if="$q.platform.is.mobile">
            <sync-btn :practiceId="practiceId " :isServer="isDisable"></sync-btn>
          </div>
          <div class="row desktop-only" v-if="mode == 'draft'">
            <div class="q-mx-md">
              <sync-btn :practiceId="practiceId"></sync-btn>
            </div>
            <!-- ปุ่มพิมพ์-->
            <div class="mobile-hide">
              <q-btn
                v-if="mode == 'draft'"
                round
                color="blue-grey-10"
                icon="fas fa-print"
                @click="printBtn()"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-h6 text-center q-pt-md">
        <div>{{practiceData.levelName}}</div>
        <div>{{ practiceData.unitOrder + ". " + practiceData.unitName}}</div>
      </div>
      <div class="q-my-md boxCard text-left">
        <div class="bg-blue-grey-10 text-white boxVdo row q-px-xs">
          <div class="col self-center q-px-sm">วิดีโอสนทนา</div>
          <div class="col self-center q-px-xs" align="right">
            <q-btn
              v-if="mode  == 'draft'"
              @click="editBtn()"
              size="sm"
              icon="far fa-edit"
              round
              flat
            ></q-btn>
          </div>
        </div>
        <!-- <div
          style="border-top-left-radius: 6px;border-top-right-radius: 6px "
          class="bg-blue-grey-10 text-white q-py-sm q-pr-xs q-pl-sm text-subtitle1 row justify-between"
        >
          <div class="self-center">วิดีโอสนทนา</div>
          <div style="height:10px">
            <q-btn
              v-if="mode  == 'draft'"
              @click="editBtn()"
              size="sm"
              icon="far fa-edit"
              round
              flat
            ></q-btn>
          </div>
        </div>-->

        <div class="q-px-md q-py-sm">
          <div v-if="dataVdo.isVdo" align="center">
            <div class="q-my-md">
              <q-video
                style="max-width:500px;height:278px"
                :src="'https://www.youtube.com/embed/'+ linkVdo"
              />
            </div>
          </div>
          <div class="text-subtitle1">ลิงก์วิดีโอ</div>
          <div class="relative-position">
            <div class="absolute-center">{{fileVdo}}</div>
            <q-input outlined dense readonly />
          </div>
          <div class="text-center q-py-md">
            <u
              @click="$q.platform.is.desktop ?  isShowUpload = true : $router.push('/vdohowtoupload/' +  $route.params.levelId +
                  '/' +
                  $route.params.unitId +
                  '/' +
                  $route.params.practiceId) "
              class="text-blue-grey-10 text-center text-body2 cursor-pointer underline"
            >ขั้นตอนการตั้งค่าอัพโหลดไฟล์บน Youtube</u>
          </div>
        </div>
      </div>
      <q-separator />
      <div class="q-pt-md">
        <div class="text-center">
          <q-btn
            :disable="mode !='draft'"
            @click="addBtn()"
            style="max-width:190px;width:100%"
            class="bg-blue-grey-10 text-white text-subtitle1"
            label="เพิ่มบทสนทนา"
          />
        </div>
        <div class="text-center">
          <div
            v-for="item,index in practiceDataList"
            :key="index"
            class="q-my-md boxCard text-left relative-position"
          >
            <div
              class="absolute-top-left q-pa-sm mobile-only"
              v-if="item.status == 'waitForDelete'"
              style="z-index:30"
            >
              <a
                class="text-white cursor-pointer"
                @click="cancelDelete(item.key)"
                style="text-decoration:underline;"
              >ยกเลิกการลบ</a>
            </div>
            <q-btn
              dense
              style="z-index:30;width:190px;"
              class="absolute-center q-pa-sm text-blue-grey-10 desktop-only"
              v-if="item.status  == 'waitForDelete'"
              color="white"
              label="ยกเลิกการลบ"
              @click="cancelDelete(item.key)"
            ></q-btn>
            <div v-if="item.status  == 'waitForDelete'" class="absolute-center backDrop"></div>
            <div class="boxVdo bg-blue-grey-10 text-white q-py-xs q-px-xs row">
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
                  @click="deleteBtn(item.key,item.order)"
                  size="sm"
                  class="q-mr-sm"
                  round
                  flat
                  icon="far fa-trash-alt"
                />
                <q-btn
                  v-if="mode == 'draft'"
                  @click="editBtn(item.key)"
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
                      <q-item-section @click="editBtn(item.key)">แก้ไขคำถาม</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="deleteBtn(item.key,item.order)">ลบคำถาม</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <div class="q-px-md q-py-sm">
              <div class="self-center">{{showSpeakerName(item.speaker)}}</div>
              <div class="row">
                <div>
                  <q-btn
                    class="q-mr-xs"
                    v-if="item.isSound"
                    size="sm"
                    @click="playAudio(item.soundURL)"
                    round
                    flat
                    icon="fas fa-volume-up"
                  />
                </div>
                <div class="col self-center">
                  <span class="text-subtitle1">{{item.sentenceEng}}</span>
                  <div class="text-blue-grey-7 text-subtitle2">{{item.sentenceTh}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-dialog v-model="editVdoDialog">
        <q-card style="max-width:328px;width:100%;height:200px">
          <div class="text-h6 text-center q-pt-md q-pb-sm">
            <div>
              <div class="text-h6">แก้ไขวิดีโอ</div>
              <div class="text-subtitle1 text-left q-px-md">ลิงก์วิดีโอ</div>
              <div class="q-px-md">
                <q-input
                  autogrow
                  outlined
                  v-model="dataVdo.linkVdo"
                  dense
                  ref="link"
                  :rules="[ val => !!val ]"
                />
              </div>
            </div>
            <div align="center" class="q-px-md">
              <div class="row reverse-wrap justify-center" style="max-width:300px;width:100%">
                <div class="col-6 q-py-sm text-center">
                  <q-btn
                    dense
                    style="width:120px"
                    color="white"
                    outline
                    v-close-popup
                    text-color="blue-grey-10"
                    label="ยกเลิก"
                  />
                </div>
                <div class="col-6 q-py-sm text-center">
                  <q-btn
                    :disable="checkble"
                    @click="saveVdo()"
                    dense
                    style="width:120px"
                    color="blue-grey-10"
                    label="บันทึก"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="isShowUpload">
        <q-card style="max-width:610px;width:100%">
          <div>
            <div class="text-h6 q-px-lg q-py-md">การตั้งค่าการอัปโหลดวิดีโอ</div>
          </div>
          <howtouploadfile />
          <div class="text-center">
            <q-btn
              v-close-popup
              style="max-width:190px;width:100%"
              label="ปิด"
              class="bg-blue-grey-10 text-white q-mb-md"
            />
          </div>
        </q-card>
      </q-dialog>
      <!--แจ้ง ลบคำถาม  -->
      <dialog-setting
        :type="3"
        :name="name"
        :practice="'บทสนทนา'"
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
      <dialog-setting
        :type="6"
        v-if="isSaveVdoDialogSuccess"
        @autoClose="isSaveVdoDialogSuccess = false"
      ></dialog-setting>
    </div>
  </q-page>
</template>

<script>
import { db, st } from "../router";
import howtouploadfile from "../components/howtouploadfile.vue";
import dialogSetting from "../components/dialogSetting";
import syncBtn from "../components/syncBtn";
export default {
  components: {
    howtouploadfile,
    dialogSetting,
    syncBtn,
  },
  data() {
    return {
      name: "",
      practiceId: this.$route.params.practiceId,
      isSaveVdoDialogSuccess: false,
      isDeleteDialogSuccess: false,
      isDeleteDataDialogSuccess: false,
      isShowUpload: false,
      isDeleteDialog: false,
      orderId: "",
      isDeleteKey: "",
      mode: "draft",
      checkble: false,
      editVdoDialog: false,
      text: "",
      fileVdo: "",
      isKeyVdio: "",
      isKeyImage: "",
      tab: "sentence",
      linkVdo: "",
      practiceData: {
        levelName: "",
        unitName: "",
        unitOrder: "",
      },
      practiceDataList: [],
      dataVdo: {
        isVdo: false,
        linkVdo: "",
      },
      idVdo: "",
      playSoundURL: "",
      pathFile:
        "https://storage.googleapis.com/atwork-dee11.appspot.com/practice/",
      syncData: "",
      isDisable: false,
    };
  },
  methods: {
    showSpeakerName(speaker) {
      let res = "ลูกค้า";
      if (speaker == "employee") {
        res = "พนักงาน#1";
      } else if (speaker == "employee2") {
        res = "พนักงาน#2";
      } else if (speaker == "people") {
        res = "คนทั่วไป";
      }
      return res;
    },
    printBtn() {
      this.$router.push({
        name: "vdoPrint",
        params: {
          title1: this.practiceData.levelName,
          title2: this.practiceData.unitName,
          data: this.practiceDataList,
        },
      });
    },
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
            this.loadPracticeData();
            this.loadVdo();
          }
        });
    },
    // โหลดข้อมูลทั้งหมด
    loadPracticeData(val) {
      this.isDisable = val;
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
          let getSound = "";
          let temp = [];
          doc.forEach((element) => {
            if (element.data().isSound) {
              getSound = this.pathFile + "audio/" + element.id + ".mp3";
            }
            let dataKey = {
              key: element.id,
              soundURL: getSound,
            };
            let final = {
              ...dataKey,
              ...element.data(),
            };
            temp.push(final);
          });
          temp.sort((a, b) => a.order - b.order);

          this.practiceDataList = temp;
          this.loadingHide();
        });
    },
    // โหลดวีดีโอยูทู
    loadVdo() {
      let practiceId = this.$route.params.practiceId;
      db.collection("practice_list")
        .doc(practiceId)
        .get()
        .then((doc) => {
          if (doc.data().linkVdo) {
            this.idVdo = doc.id;
            this.dataVdo.isVdo = doc.data().isVdo;
            this.fileVdo = doc.data().linkVdo;
            let datakey = doc.data().linkVdo.split("/");
            this.linkVdo = datakey[3];
          }
        });
    },
    addBtn() {
      this.$router.push(
        "/vdoAdd/" +
          this.$route.params.levelId +
          "/" +
          this.$route.params.unitId +
          "/" +
          this.$route.params.practiceId
      );
    },

    // เล่นเสียง
    playAudio(sound) {
      if (this.playSoundURL != "") {
        this.playSoundURL.pause();
      }

      this.playSoundURL = new Audio(sound);

      this.playSoundURL.play();
    },
    editBtn(key) {
      if (key) {
        this.$router.push({
          name: "vdoEdit",
          params: {
            id: key,
          },
        });
      } else {
        this.dataVdo.linkVdo = "";
        this.editVdoDialog = true;
      }
    },
    // บันทึกวีดีโอ Youtube
    saveVdo() {
      this.$refs.link.validate();
      if (this.$refs.link.hasError) {
        return;
      }
      if (this.dataVdo.linkVdo) {
        let http = "https://youtu.be/";
        let key = this.dataVdo.linkVdo.split("/");
        let linkVdo = key[3];
        if (this.dataVdo.linkVdo == http + linkVdo && linkVdo.length == 11) {
        } else {
          this.dataVdo.linkVdo = "";
          return;
        }
      }
      this.fileVdo = this.dataVdo.linkVdo;
      if (!this.dataVdo.isVdo) {
        this.dataVdo.isVdo = true;

        db.collection("practice_list")
          .doc(this.$route.params.practiceId)
          .update(this.dataVdo);
      } else {
        db.collection("practice_list").doc(this.idVdo).update(this.dataVdo);
      }
      this.isSaveVdoDialogSuccess = true;
      this.editVdoDialog = false;
      this.loadVdo();
    },
    deleteBtn(key, id, index) {
      this.name = "รหัสลำดับ" + " " + id;
      this.isDeleteDataDialogSuccess = true;
      this.isDeleteKey = key;
      this.orderId = id;
    },
    // อัพเดด
    async deleteData() {
      this.isDeleteDataDialogSuccess = false;
      await this.updateSyncStatus(
        this.$route.params.practiceId,
        this.$route.params.unitId
      );
      db.collection("practice_draft").doc(this.isDeleteKey).update({
        status: "waitForDelete",
      });
      this.isDeleteDialogSuccess = true;
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
.boxCard {
  border: 1px solid #263238;
  border-radius: 10px;
}
.box {
  border: 1px solid #263238;
}
.boxVdo {
  height: 40px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.boxServer {
  width: 100%;
  max-width: 330px;
  border: 1px solid #263238;
}
</style>