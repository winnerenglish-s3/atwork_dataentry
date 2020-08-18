<template>
  <q-page>
    <div class="container">
      <div>
        <div>ชื่อกิจการ</div>
        <q-input
          v-model.trim="datahotel.name"
          ref="name"
          outlined
          dense
          :error="isErrorNameHotel"
          :error-message="'ชื่อโรงแรมนี้มีอยู่แล้ว'"
          :rules="[value => !!value ]"
        ></q-input>
      </div>
      <div>
        <div>ชื่อ นามสกุลผู้ดูแลระบบ</div>
        <q-input
          v-model.trim="datahotel.adminName"
          ref="adminName"
          outlined
          dense
          :rules="[value => !!value ]"
        ></q-input>
      </div>

      <div>
        <div>เบอร์ติดต่อผู้ดูแลระบบ</div>
        <q-input
          v-model.trim="datahotel.adminPhone"
          ref="adminPhone"
          outlined
          dense
          :rules="[value => !!value ]"
        ></q-input>
      </div>
      <div>
        <div>อีเมลผู้ดูแลระบบ</div>
        <q-input
          v-model.trim="datahotel.email"
          ref="email"
          outlined
          dense
          :rules="[value => !!value ]"
          :readonly="$route.name == 'hotelEdit' ? true : false"
        ></q-input>
      </div>
      <div v-if="$route.name != 'hotelEdit'">
        <div>รหัสผ่านผู้ดูแลระบบ</div>
        <q-input
          v-model.trim="datahotel.password"
          ref="password"
          outlined
          dense
          :rules="[value => !!value ]"
        ></q-input>
      </div>
      <div v-else>
        <div>รหัสผ่านผู้ดูแลระบบ</div>
        <q-input ref="password" value="45646546" type="password" readonly outlined dense></q-input>
      </div>
      <div class="row">
        <div class="col-6 q-pr-sm q-py-md" align="right">
          <q-btn @click="cancelAddHotel()" dense style="width:150px" outline label="ยกเลิก"></q-btn>
        </div>
        <div class="col-6 q-pl-sm q-py-md">
          <q-btn @click="saveHotel()" dense color="blue-grey-10" style="width:150px" label="บันทึก"></q-btn>
        </div>
      </div>
      <dialog-center :type="6" v-if="isAddDialogSucess" @autoClose="addDialogSucess"></dialog-center>
    </div>
  </q-page>
</template>

<script>
import { db, axios } from "../router";
import dialogCenter from "../components/dialogSetting";
export default {
  components: {
    dialogCenter,
  },
  data() {
    return {
      datahotel: {
        name: "",
        adminName: "",
        adminPhone: "",
        email: "",
        password: "",
      },
      isAddDialogSucess: false,
      hotelList: "",
      nameHotelOld: "",
      isErrorNameHotel: false,
      errorNameDepartmentMessage: "",
    };
  },
  methods: {
    cancelAddHotel() {
      this.$router.push("/hotelMain");
    },
    async isCheckName(val) {
      let doc = await db.collection("hotel").where("name", "==", val).get();
      return doc.size ? true : false;
    },
    async saveHotel() {
      // check validate
      this.$refs.name.validate();
      this.$refs.adminName.validate();
      this.$refs.adminPhone.validate();
      this.$refs.email.validate();
      this.$refs.password.validate();
      if (
        this.$refs.name.hasError ||
        this.$refs.adminName.hasError ||
        this.$refs.adminPhone.hasError ||
        this.$refs.password.hasError ||
        this.$refs.email.hasError
      ) {
        return;
        // console.log("กรอก input ไม่ครบ");
      }
      if (this.nameHotelOld != this.datahotel.name) {
        let checkName = false;
        checkName = await this.isCheckName(this.datahotel.name);
        this.isErrorNameHotel = false;
        this.errorNameDepartmentMessage = "มีชื่อแผนกนี้แล้ว";

        if (checkName) {
          this.isErrorNameHotel = true;
          return;
        }
      }

      this.loadingShow();

      // บันทึก add
      if (this.$route.name == "hotelAdd") {
        let apiURL =
          "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/create";
        let registerData = {
          displayName: this.datahotel.adminName,
          email: this.datahotel.email,
          password: this.datahotel.password,
          accessProgram: ["HR"],
          isHrAdmin: true,
        };
        let sendData = await axios.post(apiURL, registerData);
        if (sendData.data.code) {
          if (sendData.data.code == "auth/email-already-exists") {
            this.$q.notify({
              message: "มีอีเมลนี้ในระบบแล้ว",
              color: "red",
            });
          } else {
            this.$q.notify({
              message: "กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง",
              color: "red",
            });
          }
          this.loadingHide();
          return;
        }
        let dataUpdate = { ...this.datahotel };
        delete dataUpdate.password;
        dataUpdate.uid = sendData.data.uid;

        db.collection("hotel")
          .add(dataUpdate)
          .then(async (doc) => {
            let updateRegisterData = {
              uid: sendData.data.uid,
              displayName: this.datahotel.adminName,
              accessProgram: ["HR"],
              hotelId: doc.id,
              isHrAdmin: true,
            };

            let apiURL =
              "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/hrUpdate";
            let sendDataUpdate = await axios.post(apiURL, updateRegisterData);
            let hotelId = doc.id;
            this.isAddDialogSucess = true;
            this.loadingHide();
          });
      } else {
        let apiURL =
          "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/updateDisplayName";
        await axios.post(apiURL, {
          uid: this.datahotel.uid,
          displayName: this.datahotel.adminName,
        });

        let dataUpdate = { ...this.datahotel };
        delete dataUpdate.password;
        db.collection("hotel")
          .doc(this.$route.params.hotelId)
          .update(dataUpdate)
          .then(() => {
            this.isAddDialogSucess = true;
            this.loadingHide();
          });
      }
    },

    addDialogSucess() {
      this.$router.push("/hotelMain");
    },
    loadHotelEdit() {
      db.collection("hotel")
        .doc(this.$route.params.hotelId)
        .get()
        .then((doc) => {
          this.datahotel.name = doc.data().name;
          this.datahotel.adminName = doc.data().adminName;
          this.datahotel.adminPhone = doc.data().adminPhone;
          this.datahotel.email = doc.data().email;
          this.datahotel.password = doc.data().password;
          this.datahotel.uid = doc.data().uid;
          this.nameHotelOld = doc.data().name;
        });
    },
  },
  mounted() {
    if (this.$route.name == "hotelEdit") {
      this.loadHotelEdit();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>