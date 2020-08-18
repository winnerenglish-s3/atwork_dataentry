<template>
  <div class="bg-login">
    <div class="absolute-center text-subtitle1" align="center">
      <div :class="$q.platform.is.desktop?'text-h3':'text-h4'">Winner @Work</div>
      <div class="q-mt-md">Data Entry | User Management</div>
      <!-- Email -->
      <div class="q-ma-md" style="width:300px">
        <div class="q-ml-xs" align="left">อีเมล</div>
        <div>
          <q-input outlined v-model="email" />
        </div>
      </div>
      <!-- password -->
      <div class="q-ma-md" style="width:300px">
        <div class="q-ml-xs" align="left">รหัสผ่าน</div>
        <q-input
          @keyup.enter="login()"
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div @click="forgetPassword()" class="q-mt-sm cursor-pointer" align="right">
          <u>ลืมรหัสผ่าน?</u>
        </div>
      </div>
      <!-- login -->
      <div class="q-ma-md">
        <q-btn
          @click="login()"
          label="เข้าสู่ระบบ"
          class="q-ma-md bg-blue-grey-10 text-white"
          style="width:190px"
        />
      </div>
      <!-- -----------------------------------------dialog--------------------------------------- -->
      <q-dialog v-model="dialogWrongPassword">
        <q-card style="width:323px; height:200px">
          <q-card-section align="center">
            <div class="q-mt-md">
              <q-icon color="red" size="lg" name="far fa-times-circle" />
            </div>
          </q-card-section>

          <q-card-section align="center" class="q-pt-none">อีเมล หรือ รหัสผ่านผิดพลาด</q-card-section>

          <q-card-actions align="center">
            <q-btn v-close-popup style="width:190px" label="ตกลง" color="blue-grey-10" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { auth, db, axios } from "../router";
import { uid } from "quasar";
export default {
  data() {
    return {
      email: "",
      password: "",
      isPwd: true,
      dialogWrongPassword: false,
      isKey: false,
      loginKey: "",
      authLogin: "",
    };
  },
  methods: {
    login() {
      this.loadingShow();
      auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth
            .signInWithEmailAndPassword(this.email, this.password)
            .then(async (result) => {
              let apiURL =
                "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/getUserData?uid=" +
                result.user.uid;
              let getData = await axios.get(apiURL);
              const customClaims = getData.data.customClaims.accessProgram;

              if (customClaims.includes("dataEntry")) {
                this.loadingHide();
                this.$router.push("/practiceList");
              } else {
                auth.signOut();
                throw "error";
              }
            })
            .catch((error) => {
              console.log(error);
              this.showWrongPasswordDialog();
              this.loadingHide();
            });
        })
        .catch((error) => {});
    },
    forgetPassword() {
      this.$router.push("/forgetPassword");
    },

    showWrongPasswordDialog() {
      this.dialogWrongPassword = true;
    },
    checkUserLogin() {
      this.loadingShow();
      this.authLogin = auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.$router.push("/welcomeBack");
          this.loadingHide();
        } else {
          if (typeof this.authLogin == "function") {
            this.authLogin();
          }
          this.loadingHide();
        }
      });
    },
  },
  async mounted() {
    // เปิดใช้งานตอนจะใช้ Emulators เท่านั้น
    // if (location.hostname === "localhost") {
    //   db.collection("user_admin")
    //     .doc("8SiWHTYgYy1zcXtVmi1V")
    //     .set({
    //       uid: "svJzHjFCe5PHUKEI1TLNieCziUE2",
    //       email: "admin@admin.com",
    //       userGroup: ["practice", "level", "personel", "admin"],
    //       name: "Admin",
    //       loginKey: "y482bw"
    //     });
    // }

    this.checkUserLogin();
  },
  beforeDestroy() {
    if (typeof this.authLogin == "function") {
      this.authLogin();
    }
  },
};
</script>

<style>
.bg-login {
  background-image: url("../statics/bglogin.png");
  min-height: 100vh;
  background-position: left;
  background-repeat: no-repeat;
  width: 100%;
  background-size: cover;
}
</style>
