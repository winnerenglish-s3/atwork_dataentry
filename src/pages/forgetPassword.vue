<template>
  <div class="bg-login">
    <div class="absolute-center text-subtitle1" align="center">
      <div class="text-h6">ลืมรหัสผ่าน</div>
      <div class="q-mt-md">กรุณากรอกอีเมลในช่องข้างล่างเพื่อเริ่มการตั้งค่ารหัสผ่านใหม่</div>
      <!-- Email -->
      <div class="q-mt-lg" style="width:300px">
        <div class="q-ml-xs" align="left">อีเมล</div>
        <div>
          <q-input @keyup.enter="sendEmail()" outlined v-model="email" />
        </div>
      </div>

      <!-- login button -->
      <div class="q-ma-md">
        <q-btn
          @click="sendEmail()"
          label="ส่งข้อมูล"
          class="q-ma-md bg-blue-grey-10 text-white"
          style="width:190px"
        />
        <div>
          <router-link to="/" class="text-black">
            <u>ย้อนกลับ</u>
          </router-link>
        </div>
      </div>
      <!-- ------------------------------dialog------------------------ -->
      <!-- correct Email -->
      <q-dialog v-model="dialogEmail">
        <q-card style="width:323px; height:200px">
          <q-card-section align="center">
            <div class="q-mt-md">
              <q-icon color="secondary" size="lg" name="far fa-check-circle" />
            </div>
          </q-card-section>

          <q-card-section align="center" class="q-pt-none">
            <div>เราทำการส่งอีเมลสำหรับการตั้งค่ารหัสผ่านใหม่</div>
            <div>ไปยังอีเมลของคุณแล้ว</div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn @click="confirmEmail()" style="width:190px" label="ตกลง" color="blue-grey-10" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- wrong Email -->
      <q-dialog v-model="dialogWrongEmail">
        <q-card style="width:323px; height:200px">
          <q-card-section align="center">
            <div class="q-mt-md">
              <q-icon class="error-text" size="40px" name="far fa-times-circle" />
            </div>
          </q-card-section>

          <q-card-section align="center" class="q-pt-none">ไม่พบอีเมลผู้ใช้ในระบบ</q-card-section>

          <q-card-actions align="center">
            <q-btn v-close-popup style="width:190px" label="ลองใส่อีกครั้ง" color="blue-grey-10" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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

      email: ""
    };
  },
  methods: {
    // ส่งข้อมูล
    sendEmail() {
      let _this = this;
      auth
        .sendPasswordResetEmail(this.email)
        .then(function() {
          _this.dialogEmail = true;
        })
        .catch(function(error) {
          _this.dialogWrongEmail = true;
        });
    },
    // ตกลง
    confirmEmail() {
      this.$router.push("/");
    }
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
