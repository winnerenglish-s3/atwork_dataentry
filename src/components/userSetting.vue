<template>
  <div class="full-height flex flex-center" align="center">
    <!-- box2 แก้ไขชื่อ -->
    <div style="width:100%;max-width:328px" v-show="infoData == '1'">
      <div>
        <div v-if="$q.platform.is.desktop" class="text-h6">แก้ไข ชื่อ นามสกุล</div>
        <div class="q-mt-lg">
          <div align="left" class="text-subtitle1">ชื่อ นามสกุล</div>
          <div>
            <q-input dense outlined ref="name" v-model="name" :rules="[val => !!val]" />
          </div>
        </div>
        <div class="row justify-center">
          <div class="q-px-sm">
            <q-btn
              @click="backMainPage()"
              class="text-subtitle1"
              label="ยกเลิก"
              style="width:120px"
              outline
              color="blue-grey-10"
            />
          </div>
          <div class="q-px-sm">
            <q-btn
              @click="saveChangeName()"
              class="bg-blue-grey-10 text-white text-subtitle1"
              label="บันทึก"
              style="width:120px"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- box3 แก้ไขรหัสผ่าน -->
    <div style="width:100%;max-width:328px" class v-show="infoData == '2'" align="center">
      <div class="text-subtitle1">คุณต้องการรีเซตรหัสผ่าน</div>
      <div class="text-subtitle1">"{{userInfo.email}}"</div>

      <div class="row justify-center q-mt-xl">
        <q-btn
          @click="backMainPage()"
          class="q-mx-sm text-subtitle1"
          label="ยกเลิก"
          style="width:120px"
          outline
          color="blue-grey-10"
        />
        <q-btn
          @click="saveChangePassword()"
          class="q-mx-sm bg-blue-grey-10 text-white text-subtitle1"
          label="ตกลง"
          style="width:120px"
        />
      </div>
    </div>
    <!-- box4 ออกจากระบบ -->
    <div v-show="infoData == '3'" align="center">
      <div class="text-h6 q-mb-md">ออกจากระบบ</div>
      <div>
        <q-btn
          @click="logOut()"
          class="bg-blue-grey-10 text-white text-subtitle1"
          style="width:190px;"
          label="เฉพาะอุปกรณ์ปัจจุบัน"
        />
      </div>
      <div class="q-mt-md">
        <q-btn
          @click="logOutAll()"
          class="text-subtitle1"
          style="width:190px"
          label="อุปกรณ์ทั้งหมด"
          outline
        />
      </div>
      <div class="q-mt-md">
        <q-btn
          @click="backMainPage()"
          class="text-subtitle1"
          style="width:190px"
          label="กลับสู่โปรแกรม"
          outline
        />
      </div>
    </div>
    <!-- -------------------------------------------Diaolog--------------------------------------- -->
    <dialog-setting :type="6" v-if="isDialogSuccess == true" @autoClose="backMainPage()"></dialog-setting>
    <dialog-setting :type="2" v-if="dialogEmail == true"></dialog-setting>

    <!-- dont complete data -->
    <q-dialog v-model="dialogDontChangeData">
      <q-card
        :style="$q.platform.is.desktop?'min-width: 350px; height:200px; margin-left:23%':'min-width: 350px; height:200px'"
      >
        <q-card-section align="center" class="q-pt-xl">
          <div class="text-subtitle1">คุณกำลังออกจากหน้านี้</div>
          <div class="text-subtitle1">ต้องการบันทึกข้อมูลหรือไม่</div>
        </q-card-section>

        <q-card-actions align="center" class="q-mt-xs" style="width:350px">
          <q-btn style="width:90px" label="ยกเลิก" outline v-close-popup />
          <q-btn @click="backMainPage()" style="width:90px" label="ไม่บันทึก" outline />
          <q-btn @click="saveChangeName()" style="width:90px" label="บันทึก" color="blue-grey-10" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { auth, db, axios } from "../router";
import { uid } from "quasar";
import userInfo from "../pages/userInfo.vue";
import dialogSetting from "../components/dialogSetting.vue";
export default {
  components: {
    dialogSetting
  },
  props: ["infoData", "userInfo"],
  data() {
    return {
      name: this.userInfo.displayName,
      oldPassword: "",
      newPassword: "",
      confrimPassword: "",
      isPwd1: true,
      isPwd2: true,
      isPwd3: true,

      isPasswordPage: false,
      isLogOutPage: false,
      isDialogSuccess: false,
      dialogEmail: false,
      dialogDontChangeData: false
    };
  },
  watch: {
    infoData() {
      // console.log(this.infoData);
      if (this.infoData == "1") {
        this.$refs.name.resetValidation();
      }
    }
  },
  methods: {
    backMainPage() {
      if (this.$q.platform.is.desktop) {
        this.$emit("backStep", false);
      } else {
        this.$router.push("/userInfo");
      }
    },
    async saveChangeName() {
      this.loadingShow();
      this.$refs.name.validate();
      if (this.$refs.name.hasError) {
        return;
      }
      const apiURL =
        "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/updateDisplayName";

      let updateData = await axios.post(apiURL, {
        displayName: this.name,
        uid: this.userInfo.uid
      });
      this.loadingHide();
      this.isDialogSuccess = true;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    saveChangePassword() {
      let _this = this;
      auth
        .sendPasswordResetEmail(this.userInfo.email)
        .then(function() {
          _this.dialogEmail = true;
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // ตกลง
    confirmEmail() {
      this.backMainPage();
    },
    async logOutAll() {
      this.loadingShow();
      let genCode = Math.random()
        .toString(36)
        .substring(7);

      let signOut = await db
        .collection("user_admin")
        .doc(this.userInfo.userId)
        .update({ loginKey: genCode });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
</style>