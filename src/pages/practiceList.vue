<template>
  <q-page class="text-blue-grey-10">
    <!-- practiceList -->
    <!-- show content -->
    <div class="row">
      <div
        class
        :class="$q.platform.is.desktop?'col-3':'col-12'"
        :style="$q.platform.is.desktop? 'width: 360px;': 'width: 100%'"
      >
        <div class="q-pa-md bg-blue-grey-10 shadow-5">
          <div>
            <span class="text-white text-h6">แบบฝึกหัด</span>
          </div>
        </div>
        <div class="shadow-3 bg-white" style="height: calc(100vh - 64px);overflow-y:auto">
          <q-list class="rounded-borders" v-for="(itemLv,index) in levelList" :key="index">
            <q-expansion-item @click="showUnit(itemLv)" group="unitgroup">
              <template v-slot:header>
                <q-item-section>
                  {{ itemLv.name }}
                  <br v-if="!itemLv.status" />
                  <q-badge
                    v-if="!itemLv.status"
                    label="ปิดการใช้งาน"
                    color="blue-grey-7"
                    outline
                    class="q-px-xs"
                    style="width:fit-content"
                  ></q-badge>
                </q-item-section>
              </template>
              <q-card v-show="unitListShow.length==0">
                <div align="center" class="q-py-md">
                  <u class="cursor-pointer" @click="gotoAddLesson()">เพิ่มบทเรียน</u>
                </div>
              </q-card>
              <q-card v-for="(itemUnit,index2) in unitListShow" :key="index2">
                <div
                  class="row q-px-md q-py-sm relative-position cursor-pointer"
                  :class="activeKey==itemUnit.unitId || unitId == itemUnit.unitId ?'bg-blue-grey-4':''"
                  v-ripple
                  @click="gotoEdit(itemUnit, index2,itemLv.name),gotoEditMode(itemUnit)"
                >
                  <div class="col">
                    {{itemUnit.order}} -
                    <span style="text-decoration:underline">{{itemUnit.label}}</span>
                  </div>
                  <div class="col-1" align="right">
                    <q-icon name="fas fa-sync-alt" v-if="itemUnit.isShowSyncBtn"></q-icon>
                    <!-- เช็คว่ามีการซิงค์มั๊ย -->
                  </div>
                </div>
              </q-card>
            </q-expansion-item>
            <q-separator />
          </q-list>
        </div>
      </div>
      <div class="col" style="height:100vh;overflow-y:auto">
        <practice-main
          v-if="isShowPracticeMain"
          :levelId="levelId"
          :unitId="unitId"
          :unitName="unitName"
          :num="practiceListOrder"
          :levelName="levelName"
          :practiceListOrder="practiceListOrder"
          @finishSync="finishSync"
        ></practice-main>
        <div v-else class="full-height flex flex-center text-subtitle1 desktop-only">
          <q-icon name="fas fa-arrow-left" class="q-pr-sm"></q-icon>กรุณาเลือกตำแหน่งในเมนูด้านซ้าย
          <br />เพื่อทำการเพิ่ม / แก้ไขแบบฝึกหัด
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router";
import practiceMain from "../components/practiceMain.vue";
export default {
  components: {
    practiceMain,
  },
  data() {
    return {
      isShowPracticeMain: false,
      isActive: false,
      activeKey: "",
      levelList: [],
      unitList: [],
      unitListShow: [],
      levelId: "",
      unitId: "",
      num: "",
      unitName: "",
      levelName: "",
      practiceListOrder: null,
      currentLevelClick: "",
      snapLevel: "",
      snapUnit: "",
    };
  },
  methods: {
    gotoAddLesson() {
      this.$router.push("/lessonMainList");
    },
    finishSync(val) {
      this.showUnit(val.levelId);
      this.isShowPracticeMain = true;
    },
    gotoEditMode(itemUnit) {
      if (this.$q.platform.is.desktop) {
        this.isShowPracticeMain = true;
      } else {
        this.$router.push(
          "/practiceMain/" + itemUnit.levelId + "/" + itemUnit.unitId + "/"
        );
      }
    },
    gotoEdit(itemUnit, num, levelName) {
      if (this.$q.platform.is.desktop) {
        if (itemUnit == null) {
          this.isShowPracticeMain = false;
        } else {
          this.isShowPracticeMain = true;
          this.activeKey = itemUnit.unitId;
          this.levelId = itemUnit.levelId;
          this.unitId = itemUnit.unitId;
          this.num = num + 1;
          this.unitName = itemUnit.label;
          this.levelName = levelName;
          this.practiceListOrder = itemUnit.order;
          this.$q.sessionStorage.set("setItem", itemUnit);
          this.$q.sessionStorage.set("setNum", num);
          this.$q.sessionStorage.set("setLevelName", levelName);
        }
      }
    },

    loadLevel() {
      this.snapLevel = db.collection("level").onSnapshot((doc) => {
        let temp = [];
        doc.forEach((element) => {
          let showData = {
            levelId: element.id,
            name: element.data().name,
            status: element.data().status,
          };
          temp.push(showData);
        });
        temp.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        this.levelList = temp;
        this.loadUnit();
      });
    },

    loadUnit() {
      this.snapUnit = db.collection("unit").onSnapshot((doc) => {
        let temp = [];
        doc.forEach((element) => {
          let showData = {
            unitId: element.id,
            levelId: element.data().levelId,
            label: element.data().name,
            order: element.data().order,
            isShowSyncBtn: element.data().isShowSyncBtn,
          };
          temp.push(showData);
        });
        temp.sort((a, b) => {
          return a.order - b.order;
        });
        this.unitList = temp;
        this.showUnit(
          this.currentLevelClick,
          this.$q.sessionStorage.getItem("setLevel")
        );
        this.gotoEdit(
          this.$q.sessionStorage.getItem("setItem"),
          this.$q.sessionStorage.getItem("setNum"),
          this.$q.sessionStorage.getItem("setLevelName")
        );
      });
    },
    showUnit(value, val) {
      if (value) {
        this.$q.sessionStorage.set("setLevel", value);
      } else {
        if (val == null) {
          this.isShowPracticeMain = false;
        } else {
          value = val;
        }
      }
      this.activeKey = "";
      this.currentLevelClick = value;
      this.unitListShow = this.unitList.filter(
        (x) => x.levelId == value.levelId
      );
    },
  },
  mounted() {
    this.loadLevel();
  },
  beforeDestroy() {
    if (typeof this.snapLevel == "function") {
      this.snapLevel();
    }

    if (typeof this.snapUnit == "function") {
      this.snapUnit();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>