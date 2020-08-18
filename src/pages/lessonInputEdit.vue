<template>
  <q-page>
    <div class="text-subtitle1">ชื่อตำแหน่ง</div>
    <div>
      <q-input
        ref="namePosition"
        dense
        outlined
        v-model="dataPosition.name"
        @keyup="errorNamePosition=false"
        :rules="[val => !!val]"
      ></q-input>
      <div class="row q-pt-lg">
        <div class="col-6 q-pr-sm" align="right">
          <q-btn dense style="width:150px" @click="cancelNamePosition()" outline label="ยกเลิก"></q-btn>
        </div>
        <div class="col-6 q-pl-sm" align="left">
          <q-btn
            @click="saveNamePosition()"
            :disable="isSaveData"
            dense
            color="blue-grey-10"
            style="width:150px"
            label="บันทึก"
          ></q-btn>
        </div>
      </div>
    </div>

    <!-- dialog บันทึกสำเร็จ -->
    <dialog-setting :type="6" v-if="savedDataDialog" @autoClose="$router.push('/lessonMainList')"></dialog-setting>

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

          <div class="q-mt-lg q-mb-sm">ในระบบมีตำแหน่ง “{{dataPosition.name}}” อยู่แล้ว</div>
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
  </q-page>
</template>

<script>
import { db, axios } from "../router";
import dialogSetting from "../components/dialogSetting.vue";
export default {
  components: {
    dialogSetting
  },
  data() {
    return {
      dataPosition: { name: "", status: false },
      savedDataDialog: false,
      errorNamePosition: false,
      nameOld: "",
      errorNamePositionMessage: "",
      dialogDupilcatePosition: false,

      isSaveData: false
    };
  },
  methods: {
    cancelNamePosition() {
      this.$router.push("/lessonMainList");
    },
    async saveNamePosition() {
      if (this.dataPosition.name == "") {
        this.errorNamePosition = true;
        return;
      }

      this.isSaveData = true;

      if (this.nameOld != this.dataPosition.name) {
        let checkName = false;
        this.dialogDupilcatePosition = false;
        checkName = await this.isCheckName(this.dataPosition.name);

        if (checkName) {
          this.dialogDupilcatePosition = true;
          this.isSaveData = false;
          return;
        }
      }

      this.loadingShow();

      this.savedDataDialog = true;

      if (this.$route.name == "lessonEdit") {
        // console.log(this.$route.params.levelId);
        // console.log(this.dataPosition.name);
        db.collection("level")
          .doc(this.$route.params.levelId)
          .update(this.dataPosition)
          .then(() => {
            this.loadingHide();
          });
      } else {
        db.collection("level")
          .add(this.dataPosition)
          .then(() => {
            this.loadingHide();
          });
      }
    },
    async isCheckName(val) {
      let doc = await db
        .collection("level")
        .where("name", "==", val)
        .get();
      return doc.size ? true : false;
    },

    loadNamePisition() {
      db.collection("level")
        .doc(this.$route.params.levelId)
        .get()
        .then(doc => {
          this.dataPosition.name = doc.data().name;
          this.nameOld = doc.data().name;
        });
    }
  },
  mounted() {
    if (this.$route.name == "lessonEdit") {
      this.loadNamePisition();
    }
  }
};
</script>

<style >
</style>