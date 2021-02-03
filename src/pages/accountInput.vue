<template>
  <q-page>
    <div align="right">
      อัพโหลดไพล์ Excel
    </div>
    <div class="container">
      <div class="q-pb-lg">
        <div>ชื่อแผนก</div>
        <q-select
          v-model="dataEmployee.departmentId"
          dense
          outlined
          :options="departmentOptions"
          map-options
          emit-value
        />
      </div>
      <div>
        <div>ชื่อ นามสกุล</div>
        <q-input
          v-model.trim="dataEmployee.name"
          ref="name"
          outlined
          dense
          :rules="[value => !!value]"
        ></q-input>
      </div>
      <div>
        <div>เบอร์โทร</div>
        <q-input
          v-model.trim="dataEmployee.tel"
          ref="tel"
          outlined
          dense
          :rules="[val => !!val]"
        ></q-input>
      </div>
      <div>
        <div>ตำแหน่งงาน</div>
        <q-input
          v-model.trim="dataEmployee.jobPosition"
          ref="jobPosition"
          outlined
          dense
          :rules="[val => !!val]"
        ></q-input>
      </div>
      <div class="row q-mb-md">
        <div class="col-12">
          <div>วันที่เริ่มงาน</div>
        </div>
        <div class="col-2">
          <q-select
            outlined
            v-model="selectedDay"
            :options="endDateOptions"
            dense=""
          />
        </div>
        <div class="col q-px-md">
          <q-select
            outlined
            v-model="selectedMonth"
            :options="monthOptions"
            @input="changeMonth()"
            dense=""
          />
        </div>
        <div class="col">
          <q-select
            outlined
            v-model="selectedYear"
            :options="yearOptions"
            @input="changeMonth()"
            dense=""
          />
        </div>
      </div>
      <div>
        <div>รหัสพนักงาน</div>
        <q-input
          v-model.trim="dataEmployee.empId"
          ref="empId"
          outlined
          dense
          :rules="[value => !!value]"
        ></q-input>
      </div>
      <div>
        <div>รหัสผู้ใช้งาน</div>
        <q-input
          v-model.trim="dataEmployee.username"
          ref="username"
          outlined
          dense
          :rules="[value => !!value]"
        ></q-input>
      </div>
      <div>
        <div>รหัสผ่าน</div>
        <q-input
          v-model.trim="dataEmployee.password"
          ref="password"
          outlined
          dense
          :rules="[value => value.length >= 6]"
          lazy-rules
        ></q-input>
      </div>
      <div class="q-pb-md">
        <div>บทเรียนเริ่มต้น</div>
        <q-select
          v-model="dataEmployee.startLevelId"
          dense
          outlined
          :options="levelOpions"
          map-options
          emit-value
        />
      </div>
      <div class="row">
        <div class="col-6 q-pr-sm q-py-md" align="right">
          <q-btn
            @click="cancelAddEmployee()"
            dense
            style="width:150px"
            outline
            label="ยกเลิก"
          ></q-btn>
        </div>
        <div class="col-6 q-pl-sm q-py-md">
          <q-btn
            @click="saveEmployee()"
            dense
            color="blue-grey-10"
            style="width:150px"
            label="บันทึก"
          ></q-btn>
        </div>
      </div>
      <dialog-center
        :type="6"
        v-if="isAddDialogSucess"
        @autoClose="addDialogSucess"
      />
    </div>
  </q-page>
</template>

<script>
import { db, axios } from "../router";
import dialogCenter from "../components/dialogSetting";
export default {
  components: {
    dialogCenter
  },
  data() {
    return {
      departmentOptions: [],
      levelOpions: [],
      dataEmployee: {
        departmentId: "",
        name: "",
        tel: "",
        username: "",
        password: "",
        startLevelId: "",
        star: 0,
        jobPosition: "",
        startJobDate: "",
        empId: ""
      },
      usernameOld: "",
      departmentAll: "",
      isAddDialogSucess: false,

      // Get Date
      selectedDay: 1,
      endDateOptions: [],

      selectedMonth: "มกราคม",
      monthOptions: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
      ],

      selectedYear: "",
      yearOptions: []
    };
  },
  methods: {
    async saveEmployee() {
      // check validate
      this.$refs.name.validate();
      this.$refs.tel.validate();
      this.$refs.username.validate();
      this.$refs.password.validate();

      this.$refs.jobPosition.validate();

      if (
        this.$refs.name.hasError ||
        this.$refs.tel.hasError ||
        this.$refs.password.hasError ||
        this.$refs.username.hasError ||
        this.$refs.jobPosition.hasError
      ) {
        return;
      }

      if (this.$route.name != "accountEdit") {
        let getData = await db
          .collection("employee")
          .where("username", "==", this.dataEmployee.username)
          .get();

        if (getData.size) {
          this.$q.notify({
            message: "มีรหัสผู้ใช้นี้อยู่ในระบบแล้ว",
            color: "negative",
            position: "top"
          });
          return;
        }

        this.loadingShow();

        let month = this.monthOptions.indexOf(this.selectedMonth);

        // ADD MODE
        db.collection("employee")
          .add({
            empId: this.dataEmployee.empId,
            password: this.dataEmployee.password,
            hotelId: this.$route.params.hotelId,
            departmentId: this.dataEmployee.departmentId,
            name: this.dataEmployee.name,
            username: this.dataEmployee.username,
            startLevelId: this.dataEmployee.startLevelId,
            tel: this.dataEmployee.tel,
            star: 0,
            jobPosition: this.dataEmployee.jobPosition,
            startJobDate:
              (this.selectedDay < 10
                ? "0" + this.selectedDay
                : this.selectedDay) +
              "/" +
              (month + 1 < 10 ? "0" + (month + 1) : (month + 1)) +
              "/" +
              this.selectedYear
          })
          .then(() => {
            this.loadingHide();
            this.isAddDialogSucess = true;
          });
      } else {
        if (this.dataEmployee.username != this.usernameOld) {
          let getData = await db
            .collection("employee")
            .where("username", "==", this.dataEmployee.username)
            .get();

          if (getData.size) {
            this.$q.notify({
              message: "มีรหัสผู้ใช้นี้อยู่ในระบบแล้ว",
              color: "negative",
              position: "top"
            });
            return;
          }
        }

        let month = this.monthOptions.indexOf(this.selectedMonth);

        this.dataEmployee.startJobDate =
          (this.selectedDay < 10 ? "0" + this.selectedDay : this.selectedDay) +
          "/" +
          (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
          "/" +
          this.selectedYear;

        // EDIT MODE
        db.collection("employee")
          .doc(this.$route.params.employeeId)
          // .add(this.dataEmployee)
          .update(this.dataEmployee)
          .then(() => {
            this.loadingHide();
            this.isAddDialogSucess = true;
          });
      }
    },
    cancelAddEmployee() {
      this.$router.push("/accountMain");
    },
    loadDepartment() {
      db.collection("department")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            let newData = {
              value: element.id,
              label: element.data().name,
              hotelId: element.data().hotelId
            };
            temp.push(newData);
          });
          temp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });

          this.departmentAll = temp;
          this.filleDepartment();
        });
    },
    filleDepartment() {
      this.departmentOptions = this.departmentAll.filter(
        x => x.hotelId == this.$route.params.hotelId
      );

      this.dataEmployee.departmentId = this.departmentOptions.filter(
        x => x.value == this.$route.params.departmentId
      )[0].value;
    },
    loadLevel() {
      this.loadingShow();
      db.collection("level")
        .where("status", "==", true)
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({
              value: element.id,
              label: element.data().name
            });
          });
          temp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
          this.levelOpions = temp;

          this.dataEmployee.startLevelId = this.levelOpions[0].value;
          this.loadingHide();
        });
    },
    loadEdit() {
      db.collection("employee")
        .doc(this.$route.params.employeeId)
        .get()
        .then(doc => {

          this.dataEmployee = doc.data();

          this.usernameOld = doc.data().username;







          let userdate = doc.data().startJobDate.split("/");

          let date = new Date();
          let month = date.getMonth();
          let year = date.getFullYear();
          let days = this.getDaysInMonth(month + 1, year);

          this.selectedDay = userdate[0]




          this.selectedMonth = this.monthOptions[userdate[1] - 1];

          this.selectedYear = userdate[2];

          for (let i = 0; i < 3; i++) {
            this.yearOptions.push(year + i);
          }

          for (let i = 1; i <= days; i++) {
            this.endDateOptions.push(i);
          }
        });
    },
    addDialogSucess() {
      this.$router.push("/accountMain");
    },
    getDaysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    changeMonth() {
      let year = this.selectedYear;
      let month = this.monthOptions.indexOf(this.selectedMonth);
      let days = this.getDaysInMonth(month + 1, year);
      this.endDateOptions = [];
      for (let i = 1; i <= days; i++) {
        this.endDateOptions.push(i);
      }
      if (this.selectedDay > days) {
        this.selectedDay = 1;
      }
    }
  },
  mounted() {
    this.loadDepartment();
    this.loadLevel();
    if (this.$route.name == "accountEdit") {
      // console.log("555");
      this.loadEdit();
      return;
    } else {
      let date = new Date();
      let month = date.getMonth();
      let year = date.getFullYear();
      let days = this.getDaysInMonth(month + 1, year);

      this.selectedMonth = this.monthOptions[month];
      this.selectedYear = year;

      for (let i = 0; i < 3; i++) {
        this.yearOptions.push(year + i);
      }

      for (let i = 1; i <= days; i++) {
        this.endDateOptions.push(i);
      }
    }
  }
};
</script>

<style></style>
