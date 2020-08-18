<template>
  <q-page>
    <!-- หน้าแสดงข้อมูล -->
    <div>
      <div class="q-pa-md" align="center">
        <q-btn
          @click="addPosition()"
          style="width:190px"
          dense
          color="blue-grey-10"
          class="text-subtitle1"
          label="เพิ่มตำแหน่ง"
        />
      </div>
      <!-- list -->
      <div
        class="shadow-1 bg-blue-grey-10"
        style="border-radius: 10px"
        v-for="(item,index) in dataPosition "
        :key="index"
      >
        <q-list class="rounded-borders q-mt-sm box-main" style="border-radius: 10px">
          <q-expansion-item
            group="level"
            @click="showLesson(item.levelId)"
            class="text-white text-subtitle1"
            :label="item.name"
            :value="item.levelId == currentLessonClickedId ? true : false"
          >
            <q-card style="border-bottom-left-radius: 10px ; border-bottom-right-radius:10px">
              <div class="relative-position cursor-pointer" v-ripple>
                <div class="row items-center q-px-md">
                  <div class="col-lg-8 col-xs-10">
                    <span class="text-black text-subtitle1">การใช้งาน</span>

                    <q-toggle
                      class="text-blue-grey-10"
                      @input="statusLevel(item)"
                      v-model="item.status"
                      color="secondary"
                    />
                  </div>
                  <!-- เมนู mobile -->
                  <div class="col self-center mobile-only" align="right">
                    <q-btn size="sm" icon="fas fa-ellipsis-v" round dense color="blue-grey-10" flat>
                      <q-menu anchor="top right" self="top right" :offset="[15, -33]">
                        <q-list style="min-width: 144px">
                          <q-item clickable v-close-popup>
                            <q-item-section @click="editPositionBtn(item)">แก้ไขตำแหน่ง</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup>
                            <q-item-section @click="editLessonBtn(item)">แก้ไขบทเรียน</q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup>
                            <q-item-section @click="deletePositionBtn(item)">ลบตำแหน่ง</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                  <!-- menu desktop -->
                  <div class="col desktop-only">
                    <div class="row justify-between text-blue-grey-10">
                      <div @click="deletePositionBtn(item)">
                        <u>ลบตำแหน่ง</u>
                      </div>
                      <div @click="editPositionBtnPc(item)">
                        <u>แก้ไขตำแหน่ง</u>
                      </div>
                      <div @click="addLessonBtnPc(item)">
                        <u>เพิ่มบทเรียน</u>
                      </div>
                    </div>
                  </div>
                </div>
                <q-separator class="bg-blue-grey-10" />
                <!-- ปุ่มเพิ่มบทเรียน mobile-->
                <div v-show="showLessonList == 0 " align="center" class="q-py-lg mobile-only">
                  <div @click="addLesson(item) " class="text-blue-grey-10">
                    <u>เพิ่มบทเรียน</u>
                  </div>
                </div>

                <!-- ปุ่มเพิ่มบทเรียน desktop -->
                <div v-show="showLessonList == 0 " align="center" class="q-py-lg desktop-only">
                  <div class="text-blue-grey-10">กรุณาเพิ่มบทเรียน</div>
                </div>

                <!-- เนื้อหาบทเรียน  -->
                <div
                  class="row items-center"
                  v-for="(item2,index2) in showLessonList "
                  :key="index2"
                >
                  <div
                    class="text-blue-grey-10 q-pl-md text-subtitle1 col q-py-xs"
                  >{{item2.order}} - {{item2.name}}</div>
                  <!-- mobile -->
                  <div
                    :style="item2.status == true?'visibility:hidden':null"
                    class="col-1 mobile-only q-py-xs"
                    style="width:55px;"
                    align="center"
                  >
                    <q-icon size="xs" name="fas fa-power-off" dense color="negative" flat></q-icon>
                  </div>
                  <!-- desktop -->
                  <div class="col desktop-only" align="right">
                    <q-badge
                      :style="item2.status == true?'visibility:hidden':null"
                      outline
                      color="blue-grey-6"
                      class="q-mx-md"
                      label="ปิดการใช้การ"
                    />
                    <q-btn
                      size="sm"
                      flat
                      round
                      class="q-mx-md"
                      @click="deleteLessonBtnPc(item2) "
                      color="blue-grey-10"
                      icon="far fa-trash-alt"
                    />
                    <q-btn
                      @click="editLessonBtnPc(item2) "
                      size="sm"
                      flat
                      round
                      class="q-mx-sm"
                      color="blue-grey-10"
                      icon="far fa-edit"
                    />
                  </div>

                  <q-separator />
                </div>
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <!-- NOTE : Dialog delete Position -->
    <dialog-setting
      :type="3"
      :practice="topic"
      :name="detail"
      v-if="dialogDelete"
      @emitConfirmDelete="deletePosition()"
      @emitCancelDelete="dialogDelete = false"
    ></dialog-setting>

    <!-- NOTE : Dialog delete Lesson -->
    <dialog-setting
      :type="3"
      :practice="topic"
      :name="detail"
      v-if="deleteLesson"
      @emitConfirmDelete="deleteLessonBtn()"
      @emitCancelDelete="deleteLesson = false"
    ></dialog-setting>

    <dialog-setting :type="4" v-if="deleted" @autoClose="deleted = false"></dialog-setting>

    <dialog-setting :type="6" v-if="savedDataDialog" @autoClose="savedDataDialog = false"></dialog-setting>

    <!-- dialog การไม่ให้ลบ -->
    <q-dialog v-model="dialogNoDelete">
      <div
        class="bg-white row justify-center items-center q-py-md"
        style="width:323px"
        align="center"
      >
        <div class="text-subtitle1 q-mt-md col-12">
          ต้องการลบบทเรียนภายในตำแหน่ง
          <br />
          “{{detail}}”
        </div>

        <div class="q-pt-lg q-pb-md">
          <q-btn
            dense
            color="blue-grey-10"
            style="width:120px"
            @click="dialogNoDelete = false"
            label="ตกลง"
          ></q-btn>
        </div>
      </div>
    </q-dialog>

    <!-- dialog เช็คในระบบมี Position อยุ่แล้ว -->
    <q-dialog v-model="dialogDupilcatePosition">
      <div
        class="bg-white row justify-center items-center q-py-md"
        style="width:323px"
        align="center"
      >
        <div class="text-subtitle1 q-mt-md col-12">
          <div>
            <q-icon name="far fa-times-circle" class="text-red-10" size="lg"></q-icon>
          </div>

          <div class="q-mt-lg q-mb-sm">ในระบบมีตำแหน่ง “{{dataPositionPc.name}}” อยู่แล้ว</div>
        </div>

        <div class="q-pb-md">
          <q-btn
            dense
            color="blue-grey-10"
            style="width:120px"
            @click="dialogDupilcatePosition = false"
            label="ตกลง"
          ></q-btn>
        </div>
      </div>
    </q-dialog>

    <!-- Dialog Lesson เพิ่มบทเรียน -->
    <q-dialog v-model="dialogLesson" class="desktop-only">
      <div class="row" style="max-width:400px;width:100%;border-radius: 10px">
        <div align="center" class="col-12 text-h6 bg-blue-grey-10 text-white q-py-sm">เพิ่มบทเรียน</div>
        <div class="col-12 row bg-white q-pb-lg q-px-md">
          <div class="col-12">
            <div class="text-subtitle1 col-12 q-pt-md" align="letf">
              <span>รหัสลำดับ</span>
              <span class="text-grey-5 text-body2 q-pl-sm">ตัวเลข 3 หลัก</span>
            </div>
            <q-input
              ref="order"
              dense
              mask="###"
              outlined
              v-model.number="dataLesson.order"
              :error="errorOrder"
              :error-message="errorOrderMsg"
              @keyup="errorOrder=false"
            ></q-input>
          </div>

          <div class="col-12">
            <span class="text-subtitle1 q-pt-sm">ชื่อบทเรียน</span>
            <q-input
              ref="name"
              dense
              outlined
              v-model="dataLesson.name"
              :error="errorLesson"
              :error-message="errorNameMsg"
              @keyup="errorLesson=false"
            ></q-input>
          </div>
          <div class="col-12">
            <span class="text-black text-subtitle1">การใช้งาน</span>

            <q-toggle v-model="dataLesson.status" color="secondary" />
          </div>
          <div class="col-6 q-pr-sm q-pt-md" align="right">
            <q-btn @click="cancelAddLessonPc()" dense style="width:120px" outline label="ยกเลิก"></q-btn>
          </div>
          <div class="col-6 q-pl-sm q-pt-md">
            <q-btn
              @click="saveLessonPc()"
              dense
              color="blue-grey-10"
              style="width:120px"
              label="บันทึก"
            ></q-btn>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- Dialog Position บันทึกข้อมูลของตำแหน่ง -->
    <q-dialog v-model="dialogAddPosition" class="desktop-only">
      <div class="bg-white row q-pb-lg" style="width:400px ;border-radius: 10px">
        <div
          align="center"
          style="width:400px"
          class="text-h6 bg-blue-grey-10 text-white q-py-sm"
        >เพิ่มตำแหน่ง</div>

        <div style="width:362px" class="q-mx-md">
          <div class="text-subtitle1 q-mt-lg">ชื่อตำแหน่ง</div>
          <div>
            <q-input
              ref="namePosition"
              dense
              outlined
              v-model="dataPositionPc.name"
              :error="errorNamePosition"
              :error-message="errorNamePositionMessage"
              @keyup="errorNamePosition=false"
            ></q-input>
          </div>
        </div>
        <div class="col-12 q-mb-sm q-mt-sm" align="center">
          <q-btn
            @click="cancelAddPositionPc()"
            class="q-mx-md"
            dense
            style="width:120px"
            outline
            label="ยกเลิก"
          ></q-btn>
          <q-btn
            @click="savePositionPc()"
            dense
            class="q-mx-md"
            color="blue-grey-10"
            style="width:120px"
            label="ยืนยัน"
          ></q-btn>
        </div>
      </div>
    </q-dialog>

    <!-- Dialog Lesson ไม่สามารถลบได้เนื่องจากมีข้อมูล แบบฝึกหดัแล้ว -->
    <q-dialog v-model="dialogNoDeleteLesson">
      <div
        class="bg-white row justify-center items-center q-py-md"
        style="width:323px"
        align="center"
      >
        <div class="text-subtitle1 q-mt-md col-12">
          ต้องลบแบบฝึกหัดภายในบทเรียน
          <br />
          "{{detail}}"
        </div>

        <div class="q-pt-lg q-pb-md">
          <q-btn
            dense
            color="blue-grey-10"
            style="width:120px"
            @click="dialogNoDeleteLesson = false"
            label="ตกลง"
          ></q-btn>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from "../router";
import dialogSetting from "../components/dialogSetting.vue";
export default {
  components: {
    dialogSetting
  },
  data() {
    return {
      // mobile
      text: "",
      model: 1,
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      status: false,
      deleteDialog: "",
      dialogNoDelete: false,
      dialogDelete: false,

      dataPosition: [],
      lessonList: "",
      showLessonList: "",
      isSnap: "",
      namePosition: "",
      dataDelete: "",
      deleted: false,
      // desktop
      dialogLesson: false,
      dataLesson: {
        order: "",
        name: "",
        status: false,
        levelId: this.$route.params.levelId
      },
      errorOrder: false,
      errorLesson: false,
      editId: "",
      orderOld: "",
      savedDataDialog: false,
      dialogAddPosition: false,
      dataPositionPc: { name: "", status: false },
      errorNamePosition: false,
      nameOld: "",
      editPositionMode: false,
      nameLesson: "",
      dialogNoDeleteLesson: false,
      deleteLesson: false,
      dataDeleteLessson: "",
      editLessonMode: false,
      errorOrderMsg: "",
      errorNameMsg: "",
      errorNamePositionMessage: "",
      dialogDupilcatePosition: false,

      // ข้อมูลการลบ ตำแหน่ง
      topic: "",
      detail: "",
      currentLessonClickedId: ""
    };
  },
  methods: {
    // ********************************** mobile **********************************
    // ปุ่มเพิ่มตำแหน่ง
    addPosition() {
      if (this.$q.platform.is.desktop) {
        this.editPositionMode = false;
        this.dialogAddPosition = true;
        this.dataPositionPc.name = "";
      } else {
        this.$router.push("lessonInput");
      }
    },
    // ปุ่มแก้ไขตำแหน่ง mobile
    editPositionBtn(levelId) {
      this.$router.push("lessonEdit/" + levelId.levelId);
    },

    // ปุ่มเพิ่มบทเรียน mobile

    addLesson(levelId) {
      this.$router.push("lessonUnitList/" + levelId.levelId);
    }, // ปุ่มแก้ไขบทเรียน mobile
    editLessonBtn(item) {
      this.$router.push("lessonUnitList/" + item.levelId);
    },
    // ปุ่มลบตำแหน่ง
    deletePositionBtn(data) {
      this.topic = "ตำแหน่ง";
      this.detail = data.name;

      db.collection("unit")
        .where("levelId", "==", data.levelId)
        .get()
        .then(doc => {
          if (doc.size > 0) {
            //  กรณีมีข้อมูลในแบบฝึกหัด ขึ้นแจ้งเตือน ให้ลบ
            this.dialogNoDelete = true;
          } else {
            //  กรณีไม่มีข้อมูลในแบบฝึกหัด ขึ้นแจ้งเตือน ไม่ให้ลบ
            this.dataDelete = data;
            this.dialogDelete = true;
          }
        });

      // db.collection("practice_server")
      //   .where("levelId", "==", data.levelId)
      //   .get()
      //   .then(doc => {
      // console.log(doc.size);

      //   });
    },
    // โหลดข้อมูลตำแหน่งออกมาโชว์
    loadDataPosition() {
      db.collection("level").onSnapshot(doc => {
        this.dataPosition = [];
        doc.forEach(element => {
          let showData = {
            levelId: element.id,
            name: element.data().name,
            status: element.data().status
          };
          this.dataPosition.push(showData);
          this.dataPosition.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          });
        });
        this.lessonList = [];
        this.loadDataLesson();
      });
    },
    // โหลดข้อมูลบทเรียน
    loadDataLesson() {
      this.lessonList = [];
      this.isSnap = db
        .collection("unit")

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
    // ฟังชั่นแยกบทเรียนออกมาโชว์ให้ตรงกับตำแหน่งของตัวเอง
    showLesson(levelId) {
      this.currentLessonClickedId = levelId;
      this.showLessonList = this.lessonList.filter(x => x.levelId == levelId);
    },

    // ปุ่มตกลง หน้า dialog ลบตำแหน่งที่มีไม่ข้อมูลบทเรียน
    deletePosition() {
      this.dialogDelete = false;

      // console.log(this.dataDelete.levelId);
      db.collection("level")
        .doc(this.dataDelete.levelId)
        .delete()
        .then(() => {
          this.deleted = true;
          this.showLesson();
        });
    },
    // ฟังชั่นอัปเดตสถานะของตำแหน่ง
    statusLevel(data) {
      db.collection("level")
        .doc(data.levelId)
        .update({
          status: data.status
        });
    },
    // *************************************** desktop ***********************************
    // ปุ่มยกเลิก dialog เพิ่มบทเรียน ของ pc
    cancelAddLessonPc() {
      this.dialogLesson = false;
      this.editId = "";
    }, // ปุ่มแก้ไขบทเรียน pc
    addLessonBtnPc(data) {
      (this.dataLesson = {
        order: "",
        name: "",
        status: false,
        levelId: data.levelId
      }),
        (this.errorOrder = false),
        (this.errorLesson = false),
        (this.dialogLesson = true);
    }, // ปุ่มแก้ไขตำแหน่ง pc
    editPositionBtnPc(data) {
      this.nameOld = data.name;
      this.dataPositionPc = { ...data };
      this.editPositionMode = true;
      this.dialogAddPosition = true;
    },
    // ปุ่มบันทึก dialog เพิ่มบทเรียน ของ pc

    async saveLessonPc() {
      this.errorOrderMsg = "";
      this.errorOrder = false;
      this.errorLesson = false;

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

      if (this.orderOld != this.dataLesson.order) {
        let checkOrder = false;

        checkOrder = await this.isCheckOrder(this.dataLesson.order);

        this.errorOrder = false;
        // this.errorLesson = false;
        if (checkOrder) {
          this.errorOrderMsg = "รหัสลำดับนี้มีแล้ว";
          this.errorOrder = true;
          return;
          // if (checkOrder) {

          // }
          // if (checkName) {
          //   this.errorNameMsg = "ชื่อนี้มีผู้ใช้งานแล้ว";
          //   this.errorLesson = true;
          // }
        }
      }

      this.loadingShow();

      this.dialogLesson = false;

      if (this.editId != "") {
        // console.log("save edit");
        db.collection("unit")
          .doc(this.editId)
          .update(this.dataLesson)
          .then(() => {
            this.editId = "";
            this.loadingHide();
            this.savedDataDialog = true;

            this.showLesson(this.dataLesson.levelId);
          });
      } else {
        // console.log("save add");
        db.collection("unit")
          .add(this.dataLesson)
          .then(() => {
            this.loadingHide();
            this.savedDataDialog = true;

            this.showLesson(this.dataLesson.levelId);
          });
      }
    },

    async checkLevelName(val) {
      let doc = await db
        .collection("level")
        .where("name", "==", val)
        .get();

      return doc.size ? true : false;
    },
    // เช็คชื่อซ้ำ
    async isCheckName(val) {
      // console.log(val);
      let doc = await db
        .collection("unit")
        .where("name", "==", val)
        .where("levelId", "==", this.dataLesson.levelId)
        .get();
      return doc.size ? true : false;
    },
    // เช็ครหัสลำดับซ้ำ
    async isCheckOrder(val) {
      let doc = await db
        .collection("unit")
        .where("order", "==", val)
        .where("levelId", "==", this.dataLesson.levelId)
        .get();

      return doc.size ? true : false;
    }, // แก้ไขบทเรียน
    editLessonBtnPc(data) {
      this.errorOrder = false;
      this.editLessonMode = true;
      // console.log(data);
      let coppyData = { ...data };
      this.dialogLesson = true;
      this.dataLesson = coppyData;
      this.editId = data.unitId;
      this.orderOld = coppyData.order;
      this.nameOld = coppyData.name;
    },
    cancelAddPositionPc() {
      this.dialogAddPosition = false;
    },
    async savePositionPc() {
      this.currentLessonClickedId = "";
      if (this.dataPositionPc.name == "") {
        this.errorNamePosition = true;
        return;
      }

      if (this.nameOld != this.dataPositionPc.name) {
        let checkName = false;
        checkName = await this.checkLevelName(this.dataPositionPc.name);

        this.errorNamePosition = false;

        if (checkName) {
          this.dialogAddPosition = false;

          this.dialogDupilcatePosition = true;
          // this.errorNamePosition = true;
          // this.errorNamePositionMessage = "ชื่อนี้มีตำแหน่งแล้ว";

          return;
        }
      }

      this.loadingShow();
      this.dialogAddPosition = false;

      if (this.editPositionMode == true) {
        // console.log("edit");
        db.collection("level")
          .doc(this.dataPositionPc.levelId)
          .update(this.dataPositionPc)
          .then(() => {
            this.loadingHide();
            this.savedDataDialog = true;
            this.showLessonList = this.lessonList.filter(
              x => x.levelId == this.currentLessonClickedId
            );
            setTimeout(() => {
              this.savedDataDialog = false;
            }, 1000);
          });
      } else {
        // console.log("add");
        db.collection("level")
          .add(this.dataPositionPc)
          .then(doc => {
            this.loadingHide();
            this.savedDataDialog = true;
          });
      }
    },
    async isCheckName(val) {
      let doc = await db
        .collection("unit")
        .where("name", "==", val)
        .get();

      // console.log(doc.size);

      return doc.size ? true : false;
    },
    // dialog ลบบทเรียน
    async deleteLessonBtnPc(data) {
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
        this.dialogNoDeleteLesson = true;
      } else {
        this.dataDeleteLessson = data;
        this.deleteLesson = true;
      }
    },
    // ยกเลิก dialog ลบบทเรียน
    cancelDeleteLesson() {
      this.deleteLesson = false;
    },
    // ลบ lesson
    deleteLessonBtn() {
      this.deleteLesson = false;

      db.collection("unit")
        .doc(this.dataDeleteLessson.unitId)
        .delete()
        .then(() => {
          this.deleted = true;

          this.showLesson(this.dataDeleteLessson.levelId);
        });
    },
    testShowExpansion() {}
  },
  mounted() {
    this.loadDataPosition();
  }
};
</script>


<style >
.box-main {
  border: 1px solid #263238;
}
</style>