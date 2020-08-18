<template>
  <q-page>
    <div class="q-pa-md">
      <div class="text-subtitle1">ชื่อตำแหน่ง</div>
      <div>
        <q-input dense outlined readonly :value="positionName"></q-input>
      </div>
    </div>

    <div align="center" class="q-pb-md text-subtitle1">
      <q-btn
        dense
        color="blue-grey-10"
        style="width:190px"
        label="เพิ่มบทเรียน"
        @click="addLesson()"
      ></q-btn>
    </div>
    <!-- ShowLesson -->
    <q-separator />
    <div v-for="(item,index) in lessonList">
      <div class="row q-pa-sm bg-white">
        <div class="text-subtitle1 col self-center q-px-sm">{{item.order}} - {{item.name}}</div>

        <div class="col-1 self-center bg-white" align="right" style="width:60px;">
          <q-icon
            v-show="item.status != true"
            size="16px"
            name="fas fa-power-off"
            dense
            color="red-7"
            class="q-mx-sm"
            flat
          ></q-icon>
          <q-btn
            size="sm"
            icon="fas fa-ellipsis-v"
            round
            dense
            color="blue-grey-10"
            class="bg-white"
            flat
          >
            <q-menu anchor="top right" self="top right" :offset="[10, -38]">
              <q-list style="min-width: 170px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="editLessonBtn(item)">แก้ไขบทเรียน</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="deleteLessonBtn(item)">ลบบทเรียน</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <q-separator />
    </div>

    <q-dialog v-model="dialogLesson">
      <div class="bg-white row q-pb-lg" style="width:330px ;border-radius: 10px">
        <div
          align="center"
          style="width:330px"
          class="text-h6 bg-blue-grey-10 text-white q-py-sm"
        >เพิ่มบทเรียน</div>
        <div class="text-subtitle1 col-12 q-px-md q-pt-md" align="letf">
          <span>รหัสลำดับ</span>
          <span class="text-grey-5 text-body2 q-pl-sm">ตัวเลข 3 หลัก</span>
        </div>
        <div style="width:300px" class="q-mx-md">
          <q-input
            ref="order"
            dense
            mask="###"
            outlined
            v-model.number="dataLesson.order"
            :error="errorOrder"
            :error-message="errorOrderMessage"
            @keyup="errorOrder=false"
          ></q-input>
        </div>
        <span class="text-subtitle1 q-pt-sm q-mx-md">ชื่อบทเรียน</span>
        <div style="width:300px" class="q-mx-md">
          <q-input
            ref="name"
            dense
            outlined
            v-model="dataLesson.name"
            :error="errorLesson"
            @keyup="errorLesson=false"
            :error-message="errorLessonMessage"
          ></q-input>
        </div>
        <div class="col-12 q- q-px-md">
          <span class="text-black text-subtitle1">การใช้งานบทเรียน</span>

          <q-toggle v-model="dataLesson.status" color="secondary" />
        </div>
        <div class="col-6 q-pr-sm q-pt-md" align="right">
          <q-btn @click="cancelAddLesson()" dense style="width:120px" outline label="ยกเลิก"></q-btn>
        </div>
        <div class="col-6 q-pl-sm q-pt-md">
          <q-btn
            @click="saveLesson()"
            dense
            color="blue-grey-10"
            style="width:120px"
            label="ยืนยัน"
          ></q-btn>
        </div>
      </div>
    </q-dialog>

    <!-- Dialog บันทึกข้อมูลเรียบร้อย -->
    <dialog-setting :type="6" v-if="savedDataDialog" @autoClose="savedDataDialog = false"></dialog-setting>

    <!-- Dialog ลบข้อมูลเรียบร้อย -->
    <dialog-setting :type="4" v-if="deleted" @autoClose="deleted = false"></dialog-setting>

    <!-- Dialog ยืนยันการลบ -->
    <dialog-setting
      :type="3"
      :practice="topic"
      :name="detail"
      v-if="dialogDelete"
      @emitConfirmDelete="deleteLesson()"
      @emitCancelDelete="dialogDelete = false"
    ></dialog-setting>

    <!-- dialog ยืนยันการลบ -->
    <q-dialog v-model="dialogDeleteNull">
      <div
        class="bg-white row justify-center items-center q-py-md"
        style="width:323px"
        align="center"
      >
        <div class="text-subtitle1 q-mt-md col-12">
          ต้องการลบแบบฝึกหัดภายในบทเรียน
          <br />
          "{{detail}}"
        </div>

        <div class="q-pt-lg q-pb-md">
          <q-btn
            dense
            color="blue-grey-10"
            style="width:120px"
            @click="dialogDeleteNull = false"
            label="ตกลง"
          ></q-btn>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from "../router";
import { colors } from "quasar";
import dialogSetting from "../components/dialogSetting.vue";
export default {
  components: {
    dialogSetting
  },
  data() {
    return {
      errorLessonMessage: "",
      errorOrderMessage: "",
      dataLesson: {
        order: "",
        name: "",
        status: false,
        levelId: this.$route.params.levelId
      },
      dialogLesson: false,
      savedDataDialog: false,

      positionName: "",
      lessonList: "",
      editId: "",
      nameOld: "",
      orderOld: "",
      errorOrder: false,
      errorLesson: false,
      isSnap: "",
      dialogDeleteNull: false,
      dialogDelete: false,
      nameLesson: "",
      dataDelete: "",
      deleted: false,

      topic: "",
      detail: ""
    };
  },
  methods: {
    cancelAddLesson() {
      this.dialogLesson = false;
      this.editId = "";
    },
    async saveLesson() {
      this.errorOrder = false;
      this.errorOrderMessage = "";
      this.errorLesson = false;
      this.errorLessonMessage = "";

      if (this.dataLesson.order == "" || this.dataLesson.name == "") {
        // console.log("เช็ค input ว่าง");
        if (this.dataLesson.order == "") {
          this.errorOrder = true;
        }
        if (this.dataLesson.name == "") {
          this.errorLesson = true;
        }
        return;
      }

      if (
        this.nameOld != this.dataLesson.name ||
        this.orderOld != this.dataLesson.order
      ) {
        let checkName = false;
        let checkOrder = false;
        if (this.nameOld != this.dataLesson.name) {
          checkName = await this.isCheckName(this.dataLesson.name);
          // console.log("เช็คชื่อซ้ำ");
        }
        if (this.orderOld != this.dataLesson.order) {
          checkOrder = await this.isCheckOrder(this.dataLesson.order);
          // console.log("เช็คลำดับซ้ำ");
        }

        this.errorOrder = false;
        this.errorLesson = false;
        // console.log(checkName);
        // console.log(checkOrder);
        if (checkName || checkOrder) {
          if (checkOrder) {
            this.errorOrderMessage = "รหัสลำดับนี้มีผู้ใช้งานแล้ว";
            this.errorOrder = true;
            // console.log("ลำดับซ้ำ");
          }
          if (checkName) {
            this.errorLesson = true;
            this.errorLessonMessage = "ชื่อนี้มีผู้ใช้งานแล้ว";
            // console.log("ชื่อซ้ำ");
          }
          return;
        }
      }

      // console.log("add mode");

      this.dialogLesson = false;

      this.loadingShow();
      if (this.editId != "") {
        // console.log("save add");
        db.collection("unit")
          .doc(this.editId)
          .update(this.dataLesson)
          .then(() => {
            this.editId = "";
            this.loadingHide();

            this.savedDataDialog = true;
          });
      } else {
        // console.log("save edit");
        db.collection("unit")
          .add(this.dataLesson)
          .then(() => {
            this.loadingHide();

            this.savedDataDialog = true;
          });
      }
    },

    addLesson() {
      (this.dataLesson = {
        order: "",
        name: "",
        status: false,
        levelId: this.$route.params.levelId
      }),
        (this.errorOrder = false),
        (this.errorLesson = false),
        (this.dialogLesson = true);
    },

    async isCheckName(val) {
      let doc = await db
        .collection("unit")
        .where("name", "==", val)
        .where("levelId", "==", this.dataLesson.levelId)
        .get();

      return doc.size ? true : false;
    },

    async isCheckOrder(val) {
      let doc = await db
        .collection("unit")
        .where("order", "==", val)
        .where("levelId", "==", this.dataLesson.levelId)
        .get();

      return doc.size ? true : false;
    },
    // ลบบทเรียน
    async deleteLessonBtn(data) {
      this.topic = "บทเรียน";
      this.detail = data.name;

      let awaitDraft = await db
        .collection("practice_draft")
        .where("levelId", "==", data.levelId)
        .where("unitId", "==", data.unitId)
        .get();

      let awaitServer = await db
        .collection("practice_server")
        .where("levelId", "==", data.levelId)
        .where("unitId", "==", data.unitId)
        .get();

      if (awaitServer.size || awaitDraft.size) {
        this.dialogDeleteNull = true;
      } else {
        this.dataDelete = data;
        this.dialogDelete = true;
      }
    },
    // แก้ไขบทเรียน
    editLessonBtn(data) {
      let coppyData = { ...data };
      this.dialogLesson = true;
      this.dataLesson = coppyData;
      this.editId = data.unitId;
      this.orderOld = coppyData.order;
      this.nameOld = coppyData.name;
    },
    loadNamePosition() {
      db.collection("level")
        .doc(this.$route.params.levelId)
        .get()
        .then(doc => {
          this.positionName = doc.data().name;
        });
      this.loadDataLesson();
    },
    loadDataLesson() {
      this.isSnap = db
        .collection("unit")
        .where("levelId", "==", this.$route.params.levelId)
        .onSnapshot(doc => {
          let temp = [];
          doc.forEach(element => {
            let dataLesson = {
              levelId: element.data().levelId,
              name: element.data().name,
              order: element.data().order,
              status: element.data().status,
              unitId: element.id
            };

            temp.push(dataLesson);
          });
          temp.sort((a, b) => {
            return a.order - b.order;
          });
          this.lessonList = temp;
        });
    },
    okDelete() {
      this.dialogDeleteNull = false;
    },
    cancelDelete() {
      this.dialogDelete = false;
    },
    deleteLesson() {
      this.dialogDelete = false;

      db.collection("unit")
        .doc(this.dataDelete.unitId)
        .delete()
        .then(() => {
          this.deleted = true;
        });
    }
  },
  beforeDestroy() {
    this.isSnap();
  },
  mounted() {
    this.loadNamePosition();
  }
};
</script>

<style >
</style>