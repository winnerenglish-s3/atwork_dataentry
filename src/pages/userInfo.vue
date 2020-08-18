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
            <span class="text-white text-h6">ตั้งค่า</span>
          </div>
        </div>
        <div
          class="bg-white row shadow-3"
          :style=" $q.platform.is.mobile?null:'height: calc(100vh - 64px)'"
        >
          <div class="col-12">
            <div
              @click="markName()"
              class="row items-center cursor-pointer relative-position"
              :class="isNameClick == true? 'bg-blue-grey-4' : 'bg-white'"
              v-ripple
            >
              <div class="col-6 q-pa-md">
                <div class="text-subtitle1">ชื่อ - สกุล</div>
              </div>
              <div class="col-6 q-pr-sm" align="right">
                <q-icon name="fas fa-angle-right" />
              </div>
            </div>
            <q-separator class="q-m-md"></q-separator>
            <div
              @click="markPassword()"
              class="row items-center cursor-pointer relative-position"
              :class="isPasswordClick == true? 'bg-blue-grey-4' : 'bg-white'"
              v-ripple
            >
              <div class="col-6 q-pa-md q-py-lg">
                <div class="text-subtitle1">รหัสผ่าน</div>
              </div>
              <div class="col-6 q-pr-sm" align="right">
                <q-icon name="fas fa-angle-right" />
              </div>
            </div>
            <q-separator class="q-m-md"></q-separator>
          </div>

          <div class="col-12 self-end">
            <q-separator class="desktop-only"></q-separator>
            <div
              @click="markLogOut()"
              v-ripple
              class="desktop-only q-pa-md row items-center justify-center relative-position cursor-pointer"
              :class="isLogOutClick == true? 'bg-blue-grey-4' : 'bg-white'"
            >
              <div class="q-mr-md">
                <q-icon size="1.7em" name="fas fa-sign-out-alt" />
              </div>
              <div class>
                <div class="text-subtitle1 q-my-xs">ออกจากระบบ</div>
              </div>
            </div>
            <!-- mobile -->
            <div
              @click="markLogOut()"
              v-ripple
              class="q-pl-md q-pt-md q-pb-md row items-center justify-between relative-position cursor-pointer mobile-only"
            >
              <div>
                <div class="text-subtitle1 q-my-xs">ออกจากระบบ</div>
              </div>
              <div class="q-pr-sm" align="right">
                <q-icon name="fas fa-angle-right" />
              </div>
            </div>
            <q-separator></q-separator>
          </div>
        </div>
      </div>
      <!-- box1 หน้าแรก -->
      <div v-if="mainPage == true" align="center" class="desktop-only col flex flex-center">
        <div class="row justify-center items-center">
          <div>
            <q-icon name="fas fa-arrow-left" size="1.7em" />
          </div>
          <div class="q-ml-sm text-subtitle1">กรุณาเลือกการตั้งค่า</div>
        </div>
      </div>
      <div v-if="infoSetting == true" class="col q-pa-md desktop-only">
        <user-setting :infoData="type" :userInfo="userInfo" @backStep="val => getBackPage(val)"></user-setting>
      </div>
    </div>
    <!-- ต้องการลบข้อมูลรึไม่ -->
    <q-dialog v-model="dialogResetPassword">
      <q-card style="min-width: 350px; height:200px">
        <q-card-section align="center" class="q-mt-md text-subtitle1">
          <div class="q-mt-lg">คุณต้องการรีเซตรหัสผ่าน</div>
          <div>{{userInfo.email}}</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn style="width:120px" outline color="blue-grey-10" label="ยกเลิก" v-close-popup />
          <q-btn
            @click="confirmResetPassword()"
            color="blue-grey-10"
            style="width:120px"
            label="ยืนยัน"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <dialog-setting :type="2" v-if="isSuccessData == true" class="mobile-only"></dialog-setting>
  </q-page>
</template>

<script>
import { db, auth } from "../router";
import userSetting from "../components/userSetting";
import dialogSetting from "../components/dialogSetting";
import userSettingMobile from "./userSettingMobile.vue";
export default {
  components: {
    userSetting,
    dialogSetting
  },
  data() {
    return {
      isNameClick: false,
      isPasswordClick: false,
      isLogOutClick: false,
      infoSetting: false,
      mainPage: true,
      type: "",
      userInfo: "",
      isSuccessData: false,
      isToDialog: false,
      dialogResetPassword: false,
      authData: ""
    };
  },
  methods: {
    saveChangePassword() {
      let _this = this;
      auth
        .sendPasswordResetEmail(this.userInfo.email)
        .then(function() {
          _this.isSuccessData = true;
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    confirmResetPassword() {
      this.isSuccessData = false;
      this.dialogResetPassword = false;
      this.saveChangePassword();
    },
    async getBackPage(val) {
      this.isNameClick = false;
      this.isPasswordClick = false;
      this.isLogOutClick = false;
      this.infoSetting = false;
      this.mainPage = true;
      this.userInfo = await this.getUserInfo(
        this.$q.localStorage.getItem("uid")
      );
    },
    markName() {
      if (this.$q.platform.is.desktop) {
        this.mainPage = false;
        this.infoSetting = true;
        this.isNameClick = true;
        this.isPasswordClick = false;
        this.isLogOutClick = false;
        this.type = "1";
      } else {
        this.$router.push({
          name: "userSettingMobile",
          params: { type: "1", userInfo: this.userInfo }
        });
      }
    },
    markPassword() {
      if (this.$q.platform.is.desktop) {
        this.mainPage = false;
        this.infoSetting = true;
        this.isNameClick = false;
        this.isPasswordClick = true;
        this.isLogOutClick = false;
        this.type = "2";
      } else {
        this.dialogResetPassword = true;
      }
    },
    markLogOut() {
      this.logOut();
      // if (this.$q.platform.is.desktop) {
      //   this.mainPage = false;
      //   this.infoSetting = true;
      //   this.isNameClick = false;
      //   this.isPasswordClick = false;
      //   this.isLogOutClick = true;
      //   this.type = "3";
      // } else {
      //   this.$router.push({
      //     name: "userSettingMobile",
      //     params: { type: "3", userInfo: this.userInfo }
      //   });
      // }
    },
    loadUserData() {
      this.authData = auth.onAuthStateChanged(user => {
        if (user) {
          this.userInfo = user;
        }
      });
    }
  },
  async mounted() {
    this.loadUserData();
    // this.userInfo = await this.getUserInfo(this.$q.localStorage.getItem("uid"));
  },
  beforeDestroy() {
    this.authData = "";
  }
};
</script>

<style lang="scss" scoped>
</style>