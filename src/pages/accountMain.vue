<template>
  <q-page class="text-blue-grey-10">
    <div class="container">
      <div>
        <!-- ชื่อโรงแรม -->
        <div class="row items-end">
          <div class="col-10">
            <q-select
              dense
              outlined
              v-model="hotelSelectedId"
              :options="hotelList"
              map-options
              emit-value
              @input="selectDepartment()"
            />
          </div>
          <div class="col-2" align="center">
            <q-btn
              dense
              size="14px"
              @click="goToAddHotel()"
              flat
              round
              color="blue-grey-10"
              icon="far fa-edit"
            ></q-btn>
          </div>
        </div>
        <!-- เพิ่มแผนก -->
        <div align="center" class="q-py-md text-subtitle1">
          <q-btn
            @click="addDepartment()"
            label="เพิ่มแผนก"
            color="blue-grey-10"
            style="width:148px"
          ></q-btn>
        </div>
      </div>
      <div v-for="(item,index) in deparmentSelect " :key="index" @click="filterEmployee(item)">
        <div class="mobile-only">
          <!-- รายชื่อแผนก -->
          <q-separator />

          <!-- show ชื่อแผนก -->
          <q-toolbar class="no-padding">
            <q-toolbar-title class="text-subtitle1">
              <q-icon v-if="clickedToolbar!=item.departmentId" name="fas fa-chevron-down"></q-icon>
              <q-icon v-else name="fas fa-chevron-up"></q-icon>
              {{item.name}}
            </q-toolbar-title>
            <q-btn @click.stop="addEmployee(item)" icon="fas fa-user-plus" flat size="10px"></q-btn>
            <q-btn @click.stop="deleteDepartment(item)" icon="far fa-trash-alt" flat size="10px"></q-btn>
            <q-btn @click.stop="editDepartment(item)" icon="fas fa-edit" flat size="10px"></q-btn>
          </q-toolbar>
          <q-separator v-if="clickedToolbar!=item.departmentId" />
          <!-- ชื่อพนักงาน -->

          <div v-if="clickedToolbar==item.departmentId">
            <div v-if="employeeList.length == 0">
              <!-- กรณีไม่มีพนักงานในแผนก -->
              <div
                v-if="employeeList.length==0"
                class="text-body2 q-py-md"
                align="center"
              >กรุณาเพิ่มพนักงาน</div>
            </div>
            <div v-for="(item2,index2) in employeeList" :key="index2">
              <!-- กรณีมีพนักงาน -->
              <q-toolbar class="no-padding">
                <q-toolbar-title class="text-body2 q-pl-lg">
                  <span class="q-pl-md">{{index2+1}}. {{item2.name}}</span>
                </q-toolbar-title>
                <q-btn class="invisible" icon="far fa-trash-alt" flat size="10px"></q-btn>
                <q-btn @click.stop="deleteEmployee(item2)" icon="far fa-trash-alt" flat size="10px"></q-btn>
                <q-btn @click.stop="editEmployee(item2)" icon="fas fa-edit" flat size="10px"></q-btn>
              </q-toolbar>
            </div>
            <q-separator />
          </div>
        </div>
        <!-- หน้า desktop -->
        <div class="desktop-only">
          <q-list
            class="rounded-borders q-mt-sm box-main bg-blue-grey-10 shadow-1"
            style="border-radius: 10px"
          >
            <q-expansion-item
              group="departmentGroup"
              class="text-white"
              expand-separator
              :label="item.name"
              :value="clickedToolbar==item.departmentId ? true : false"
            >
              <q-card>
                <q-card-section class="no-padding">
                  <div class="row justify-between">
                    <div class="col-10"></div>
                    <div class="col q-py-md">
                      <q-btn
                        size="12px"
                        @click.stop="addEmployee(item)"
                        icon="fas fa-user-plus"
                        round
                        dense
                        color="blue-grey-10"
                        flat
                      />
                    </div>
                    <div class="col q-py-md">
                      <q-btn
                        size="12px"
                        @click.stop="deleteDepartment(item)"
                        icon="far fa-trash-alt"
                        round
                        dense
                        color="blue-grey-10"
                        flat
                      />
                    </div>
                    <div class="col q-py-md">
                      <q-btn
                        size="12px"
                        @click.stop="editDepartment(item)"
                        icon="fas fa-edit"
                        round
                        dense
                        color="blue-grey-10"
                        flat
                      />
                    </div>
                  </div>
                  <q-separator color="blue-grey-10" />
                  <div v-if="employeeList.length == 0">
                    <!-- กรณีไม่มีพนักงานในแผนก -->
                    <div
                      v-if="employeeList.length==0"
                      class="text-body2 q-py-md text-blue-grey-10"
                      align="center"
                    >กรุณาเพิ่มพนักงาน</div>
                  </div>
                  <div
                    class="row text-blue-grey-10 text-subtitle1"
                    v-for="(item2,index2) in employeeList"
                    :key="index2"
                  >
                    <!-- กรณีมีพนักงาน -->

                    <div class="col-10 row items-center q-pl-md">{{index2+1}}. {{item2.name}}</div>
                    <div class="col q-py-md">
                      <q-btn dense round class="invisible" icon="far fa-trash-alt" flat size="12px"></q-btn>
                    </div>
                    <div class="col q-py-md">
                      <q-btn
                        round
                        @click.stop="deleteEmployee(item2)"
                        icon="far fa-trash-alt"
                        flat
                        dense
                        size="12px"
                      ></q-btn>
                    </div>
                    <div class="col q-py-md">
                      <q-btn
                        round
                        @click.stop="editEmployee(item2)"
                        icon="fas fa-edit"
                        flat
                        dense
                        size="12px"
                      ></q-btn>
                    </div>
                    <q-separator />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>

      <!-- Dialod เพิ่มชื่อแผนก -->
      <q-dialog v-model="addDepartmentDialog">
        <div style="width:330px" class="bg-white">
          <div align="center" class="bg-blue-grey-10 text-white q-py-sm text-h6">เพิ่มแผนก</div>
          <div class="q-ma-md">
            <div class="text-subtitle1">ชื่อแผนก</div>
            <div>
              <q-input
                :error="errorNameDepartment"
                :error-message="errorNameDepartmentMessage"
                @keyup="errorNameDepartment=false"
                dense
                outlined
                v-model="departmentName"
              ></q-input>
            </div>
            <div class="row">
              <div class="col-6 q-pr-sm q-py-md" align="right">
                <q-btn
                  @click="cancelAddDepartment()"
                  dense
                  style="width:120px"
                  outline
                  label="ยกเลิก"
                ></q-btn>
              </div>
              <div class="col-6 q-pl-sm q-py-md">
                <q-btn
                  @click="saveDepartment()"
                  dense
                  color="blue-grey-10"
                  style="width:120px"
                  label="บันทึก"
                ></q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-dialog>
      <dialog-center :type="6" v-if="addDialogSucess" @autoClose="autoCloseDialog"></dialog-center>
      <!-- dialog ลบ กรณีมีข้อมูล -->
      <dialog-center
        :type="5"
        :practice="'แผนกภายในกิจการ'"
        :name="dataDepartment.name"
        v-if="isShowNoDeleteDialog"
        @emitConfirmDelete="isShowNoDeleteDialog = false"
      ></dialog-center>
      <!-- dialog ลบ กรณีไม่มีข้อมูล -->
      <dialog-center
        :type="3"
        :practice="'กิจการ'"
        :name="dataDepartment.name"
        v-if="isShowDeleteDialog"
        @emitCancelDelete="isShowDeleteDialog = false"
        @emitConfirmDelete="confirmDelete"
      ></dialog-center>
      <!-- dialog ลบ สำเร็จ -->
      <dialog-center
        :type="4"
        v-if="isDeleteDialogSucess"
        @autoClose="isDeleteDialogSucess = false"
      ></dialog-center>
      <!-- dialog ลบ พนักงาน -->
      <dialog-center
        :type="3"
        :practice="'พนักงาน'"
        :name="dataEmployee.name"
        v-if="isShowDeleteDialogEmployee"
        @emitCancelDelete="isShowDeleteDialogEmployee = false"
        @emitConfirmDelete="confirmDeleteEmployee"
      ></dialog-center>
      <span></span>
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
      hotelSelectedId: "",
      hotelList: [],
      departmentAll: [],
      deparmentSelect: [],
      addDepartmentDialog: false,
      departmentName: "",
      addDialogSucess: false,
      userList: "",
      clickedToolbar: "",
      employeeAll: "",
      employeeList: "",
      editId: "",
      errorNameDepartment: false,
      errorNameDepartmentMessage: "",
      nameOld: "",
      isShowNoDeleteDialog: false,
      isShowDeleteDialog: false,
      isDeleteDialogSucess: false,
      nameDepartmentDialogDelete: "",
      isSnapShot: "",
      isShowDeleteDialogEmployee: false,
      dataEmployee: "",
      nameDepartmantOld: ""
    };
  },
  methods: {
    loadHotelList() {
      db.collection("hotel")
        .get()
        .then(doc => {
          if (doc.size) {
            doc.forEach(element => {
              let temp = {
                value: element.id,
                label: element.data().name
              };
              this.hotelList.push(temp);
            });
            this.hotelList.sort((a, b) => {
              return a.name > b.name ? 1 : -1;
            });
            this.hotelSelectedId = this.hotelList[0].value;
          } else {
            this.hotelSelectedId = "กรุณาเพิ่มกิจการ";
          }

          this.selectDepartment();
          this.loadEmployee();
        });
    },
    goToAddHotel() {
      this.$router.push("hotelMain");
    },
    loadDepartment() {
      this.isSnapShot = db.collection("department").onSnapshot(doc => {
        let temp = [];
        doc.forEach(element => {
          let temp1 = {
            departmentId: element.id
          };

          let final = { ...temp1, ...element.data() };

          temp.push(final);
        });
        this.departmentAll = temp;
        this.selectDepartment();
      });
    },

    selectDepartment() {
      this.deparmentSelect = this.departmentAll.filter(
        x => x.hotelId == this.hotelSelectedId
      );
      this.loadEmployee();
    },
    cancelAddDepartment() {
      this.addDepartmentDialog = false;
      this.departmentName = "";
    },
    async isCheckName(val) {
      let doc = await db
        .collection("department")
        .where("name", "==", val)
        .get();
      return doc.size ? true : false;
    },
    async saveDepartment() {
      if (this.departmentName == "") {
        // console.log("ไม่กรอกข้อมูล");
        this.errorNameDepartment = true;

        return;
      }
      if (this.nameDepartmantOld != this.departmentName) {
        let checkName = false;
        checkName = await this.isCheckName(this.departmentName);
        this.errorNameDepartment = false;
        this.errorNameDepartmentMessage = "มีชื่อแผนกนี้แล้ว";

        if (checkName) {
          this.errorNameDepartment = true;
          return;
        }
      }

      this.loadingShow();
      if (this.editId == "") {
        db.collection("department")
          .add({
            hotelId: this.hotelSelectedId,
            name: this.departmentName
          })
          .then(() => {
            this.loadingHide();
            this.addDepartmentDialog = false;
            this.addDialogSucess = true;
            this.clickedToolbar = "";
          });
      } else {
        // console.log("บันทึกตอนแก้ไข");
        db.collection("department")
          .doc(this.editId)
          .update({ name: this.departmentName })
          .then(() => {
            this.loadingHide();
            this.editId = "";
            this.addDepartmentDialog = false;
            this.addDialogSucess = true;
            this.clickedToolbar = "";
          });
      }
    },
    addDepartment() {
      this.addDepartmentDialog = true;
      this.errorNameDepartment = false;
      this.departmentName = "";
      this.editId = "";
    },
    autoCloseDialog(value) {
      this.addDialogSucess = false;
    },
    filterEmployee(data) {
      if (
        data.departmentId == this.clickedToolbar &&
        this.clickedToolbar != ""
      ) {
        this.clickedToolbar = "";
      } else {
        this.employeeList = this.employeeAll.filter(
          x => x.departmentId == data.departmentId
        );
        this.clickedToolbar = data.departmentId;
      }
    },
    loadEmployee() {
      this.isOnSnapshotEmployee = db
        .collection("employee")
        .where("hotelId", "==", this.hotelSelectedId)
        .onSnapshot(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), employeeId: element.id });
          });
          temp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
          this.employeeAll = temp;
        });
    },

    addEmployee(data) {
      this.$router.push(
        "/accountAdd/" + data.hotelId + "/" + data.departmentId
      );
    },
    deleteDepartment(data) {
      this.dataDepartment = data;
      db.collection("employee")
        .where("departmentId", "==", data.departmentId)
        .get()
        .then(doc => {
          if (doc.size > 0) {
            this.isShowNoDeleteDialog = true;
          } else {
            this.isShowDeleteDialog = true;
          }
        });
    },
    editDepartment(data) {
      this.nameDepartmantOld = data.name;
      this.errorNameDepartment = false;
      this.editId = data.departmentId;
      this.addDepartmentDialog = true;
      this.departmentName = data.name;
    },
    async isCheckName(val) {
      let doc = await db
        .collection("department")
        .where("name", "==", val)
        .where("hotelId", "==", this.hotelSelectedId)
        .get();
      return doc.size ? true : false;
    },

    editEmployee(data) {
      this.$router.push(
        "/accountEdit/" +
          data.hotelId +
          "/" +
          data.departmentId +
          "/" +
          data.employeeId
      );
    },
    confirmDelete() {
      this.loadingShow();
      this.isShowDeleteDialog = false;
      db.collection("department")
        .doc(this.dataDepartment.departmentId)
        .delete()
        .then(() => {
          this.loadingHide();
          this.isDeleteDialogSucess = true;
        });
    },
    deleteEmployee(data) {
      this.dataEmployee = data;
      this.isShowDeleteDialogEmployee = true;
    },
    async confirmDeleteEmployee() {
      this.loadingShow();
      this.isShowDeleteDialogEmployee = false;
      let apiURL =
        "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/delete?uid=" +
        this.dataEmployee.uid;
      let deleteEmp = await axios.get(apiURL);
      let departmentCurrent = this.departmentAll.filter(
        x => x.departmentId == this.clickedToolbar
      )[0];

      db.collection("employee")
        .doc(this.dataEmployee.employeeId)
        .delete()
        .then(() => {
          this.employeeList = this.employeeAll.filter(
            x => x.departmentId == departmentCurrent.departmentId
          );
          this.clickedToolbar = departmentCurrent.departmentId;
          if (departmentCurrent.length == 0) {
            this.clickedToolbar = "";
          }

          this.loadingHide();
          this.isDeleteDialogSucess = true;
        });
    }
  },
  mounted() {
    this.loadDepartment();
    this.loadHotelList();
  },
  beforeDestroy() {
    if (typeof this.isSnapShot == "function") {
      this.isSnapShot();
    }

    if (typeof this.isOnSnapshotEmployee == "function") {
      this.isOnSnapshotEmployee();
    }
  }
};
</script>

<style >
.box-main {
  border: 1px solid #263238;
}
</style>