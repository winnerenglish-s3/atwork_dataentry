<template>
  <div class="bg-login">
    <div class="absolute-center text-subtitle1" align="center">
      <div :class="$q.platform.is.desktop?'text-h3':'text-h4'">{{userInfo.name}}</div>
      <div class="q-mt-md">"ชีวิตต้องสู้ เพราะกู้มาเยอะ"</div>

      <!-- login button -->
      <div class="q-mะ-md">
        <q-btn
          @click="welcomeBack()"
          label="เข้าสู่ระบบ"
          class="q-ma-md bg-blue-grey-10 text-white"
          style="width:190px"
        />
        <div @click="toLoginPage()" class="cursor-pointer">
          <u>เข้าสู่ระบบด้วยบัญชีอื่น</u>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../router";
export default {
  data() {
    return {
      dialogEmail: false,
      dialogWrongEmail: false,
      userInfo: "",
      authState: ""
    };
  },
  methods: {
    // ส่งข้อมูล
    welcomeBack() {
      this.$router.push("/practiceList");
    },
    toLoginPage() {
      this.logOut();
    },
    getCurrentUser() {
      this.authstate = auth.onAuthStateChanged(user => {
        if (user) {
          this.userInfo = { name: user.displayName };
        } else {
        }
      });
    }
  },
  mounted() {
    this.getCurrentUser();
  },
  beforeDestroy() {
    this.authState = "";
  }
};
</script>

<style>
.bg-login {
  background-image: url("../statics/bglogin.png");
  min-height: 100vh;
  /* background-repeat: no-repeat;
  width: 100%;
  background-position: center;
  background-attachment: fixed;
  background-size: cover; */
}
</style>
