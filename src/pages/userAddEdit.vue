<template>
  <q-page>
    <div class="container">
      <div>
        <div class="text-subtitle1">ชื่อ นามสกุล</div>
        <q-input ref="name" outlined dense v-model="dataUser.displayName" :rules="[val => !!val ]"></q-input>
      </div>

      <div>
        <div class="text-subtitle1">อีเมล</div>
        <q-input
          :readonly="$route.name=='userEdit'"
          type="email"
          ref="email"
          outlined
          dense
          v-model="dataUser.email"
          :rules="[val => !!val]"
        ></q-input>
      </div>

      <div>
        <div class="text-subtitle1">รหัสผ่าน</div>
        <div class="text-subtitle2">ไม่ต่ำกว่า 6 ตัวอักษร</div>

        <q-input
          ref="password"
          v-model="dataUser.password"
          dense
          outlined
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[val => val.length>=6 ]"
          :readonly="$route.name == 'userEdit' ? true : false"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <!-- checkbox -->
      <div class="row">
        <div class="text-subtitle1 row items-center">สิทธิ์การใช้งาน</div>
        <div class="text-subtitle1">
          <q-checkbox
            :color="!isEroorCheckbox?'blue-grey-10':'negative'"
            keep-color
            @input="checkboxAll()"
            v-model="all"
            label="ทั้งหมด"
          />
        </div>
      </div>
      <div class="text-subtitle1">
        <q-option-group
          keep-color
          :color="!isEroorCheckbox?'blue-grey-10':'negative'"
          @input="checkbox()"
          :options="userOptions"
          label="Notifications"
          type="checkbox"
          v-model="dataUser.dataEntryPermissions"
        />
      </div>
      <div v-show="isEroorCheckbox" class="q-py-md" align="center">
        <q-icon size="22px" name="fas fa-exclamation-circle" dense color="negative" flat></q-icon>
        <span class="text-body2 text-negative q-pl-sm">กรุณาเลือกสิทธิ์อย่างน้อยหนึ่งสิทธิ๋</span>
      </div>
      <!-- ปุ่ม -->
      <div class="row q-pt-md">
        <div class="col-6 q-pr-sm" align="right">
          <q-btn dense style="width:150px" outline label="ยกเลิก" @click="cencel()"></q-btn>
        </div>
        <div class="col-6 q-pl-sm" align="left">
          <q-btn dense color="blue-grey-10" style="width:150px" label="บันทึก" @click="saveData()"></q-btn>
        </div>
      </div>
    </div>
    <!-- dialog บันทึกสำเร็จ -->
    <q-dialog v-model="saveDataDialog">
      <div
        class="bg-white row justify-center items-center"
        style="width:320px;height:200px"
        align="center"
      >
        <div>
          <q-icon name="far fa-check-circle" class="text-secondary" size="40px" />
          <div class="text-subtitle1 q-pt-md">บันทึกข้อมูลเรียบร้อยแล้ว</div>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { db, axios } from "../router";
export default {
  data() {
    return {
      dataUser: {
        displayName: "",
        email: "",
        password: "",
        dataEntryPermissions: []
      },

      isPwd: true,
      saveDataDialog: false,

      userOptions: [
        {
          label: "แบบฝึกหัด",
          value: "practice"
        },
        { label: "บทเรียน", value: "level" },

        { label: "ผู้ใช้งาน", value: "personel" },
        { label: "ผู้ดูแลระบบ", value: "admin" }
      ],
      all: false,
      isEroorCheckbox: false
    };
  },
  methods: {
    cencel() {
      this.$router.push("userMain");
    },

    async saveData() {
      // check validate
      this.$refs.name.validate();
      this.$refs.email.validate();
      this.$refs.password.validate();

      if (
        this.$refs.name.hasError ||
        this.$refs.email.hasError ||
        this.$refs.password.hasError
      ) {
        // console.log("ยังไม่กรอกข้อมูล");
        return;
      }
      // check checkbox

      if (this.dataUser.dataEntryPermissions == "") {
        // console.log("ไม่ได้เลือกเช็คบ็อค");
        this.isEroorCheckbox = true;
        return;
      }
      this.loadingShow();

      // บันทึกข้อมูล
      if (this.$route.name == "userAdd") {
        let dataUser = {
          email: this.dataUser.email,
          password: this.dataUser.password,
          displayName: this.dataUser.displayName,
          dataEntryPermissions: this.dataUser.dataEntryPermissions,
          accessProgram: ["dataEntry"]
        };
        let apiURL =
          "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/create";

        await axios.post(apiURL, dataUser);

        this.loadingHide();
        this.saveDataDialog = true;
        setTimeout(() => {
          this.$router.push("userMain");
        }, 1000);
      } else {
        this.editMode();
      }
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "รูปแบบ E-mail ไม่ถูกต้อง";
    },
    async isCheckEmail(val) {
      if (this.$route.name != "userEdit") {
        let doc = await db
          .collection("user_admin")
          .where("email", "==", val)
          .get();
        return !doc.size || "E-mail นี้มีผู้ใช้งานแล้ว";
      }
    },
    checkboxAll() {
      this.isEroorCheckbox = false;
      if (this.all) {
        let test = this.userOptions.map(x => {
          return x.value;
        });
        this.dataUser.dataEntryPermissions = test;
      } else {
        this.dataUser.dataEntryPermissions = [];
      }
    },
    checkbox() {
      this.isEroorCheckbox = false;
      if (
        this.dataUser.dataEntryPermissions.length == this.userOptions.length
      ) {
        this.all = true;
      } else {
        this.all = false;
      }
    },
    loadDataEdit() {
      let isEmpty = !Object.keys(this.$route.params).length;
      if (!isEmpty) {
        this.dataUser.password = "123456789";
        this.dataUser.displayName = this.$route.params.displayName;
        this.dataUser.email = this.$route.params.email;
        this.dataUser.uid = this.$route.params.uid;
        if (this.$route.params.customClaims) {
          this.dataUser.dataEntryPermissions = this.$route.params.customClaims.dataEntryPermissions;
          this.dataUser.accessProgram = ["dataEntry"];
          if (
            this.$route.params.customClaims.dataEntryPermissions.length == 4
          ) {
            this.all = true;
          }
        }
      } else {
        this.$router.push("/userMain");
      }
    },
    async editMode() {
      const apiURL =
        "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/update";
      let editUserData = await axios.post(apiURL, this.dataUser);
      this.loadingHide();
      this.saveDataDialog = true;
      setTimeout(() => {
        this.$router.push("userMain");
      }, 1000);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  },
  mounted() {
    if (this.$route.name == "userEdit") {
      this.loadDataEdit();
    }
  }
};
</script>

<style >
</style>