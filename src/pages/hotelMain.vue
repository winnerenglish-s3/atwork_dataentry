<template>
  <q-page>
    <div class="container">
      <div align="center ">
        <q-btn @click="goToAddHotel()" label="เพิ่มกิจการ" color="blue-grey-10" style="width:190px"></q-btn>
      </div>
      <div class="q-pt-md mobile-only">
        <div v-for="(item, index) in hotelList" :key="index">
          <q-toolbar class="no-padding">
            <div class="text-subtitle1 q-pr-sm">
              <span>{{ item.name }}</span>
            </div>
            <q-space></q-space>
            <q-btn @click.stop="deleteHotel(item)" icon="far fa-trash-alt" flat size="10px"></q-btn>
            <q-btn @click.stop="editHotel(item)" icon="fas fa-edit" flat size="10px"></q-btn>
          </q-toolbar>
          <q-separator />
        </div>
      </div>
      <!-- หน้า desktop -->
      <div class="desktop-only">
        <div class="q-mt-lg box-main" style="border-radius: 10px">
          <div v-for="(item, index) in hotelList" :key="index">
            <q-toolbar class="no-padding">
              <div class="text-subtitle1 q-pl-md">
                <span>{{ item.name }}</span>
              </div>
              <q-space></q-space>
              <q-btn @click.stop="deleteHotel(item)" icon="far fa-trash-alt" flat size="10px"></q-btn>
              <q-btn @click.stop="editHotel(item)" icon="fas fa-edit" flat size="10px"></q-btn>
            </q-toolbar>
            <q-separator />
          </div>
        </div>
      </div>
      <dialog-center
        :type="5"
        :practice="'แผนกภายในกิจการ'"
        :name="hotelData.name"
        v-if="isShowNoDeleteDialog"
        @emitConfirmDelete="isShowNoDeleteDialog = false"
      ></dialog-center>
      <!-- dialog ลบ กรณีไม่มีข้อมูล -->
      <dialog-center
        :type="3"
        :practice="'กิจการ'"
        :name="hotelData.name"
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
      hotelList: "",
      isShowNoDeleteDialog: false,
      hotelData: "",
      isShowDeleteDialog: false,
      isSnapLoadHotel: "",
      isDeleteDialogSucess: false
    };
  },
  methods: {
    deleteHotel(data) {
      this.hotelData = data;
      db.collection("department")
        .where("hotelId", "==", data.hotelId)
        .get()
        .then(async doc => {
          let apiURL =
            "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/delete?uid=" +
            this.hotelData.uid;
          await axios.get(apiURL);
          if (doc.size > 0) {
            this.isShowNoDeleteDialog = true;
          } else {
            this.isShowDeleteDialog = true;
          }
        });
    },
    editHotel(data) {
      this.$router.push("/hotelEdit/" + data.hotelId);
    },
    loadHotel() {
      this.isSnapLoadHotel = db.collection("hotel").onSnapshot(doc => {
        let temp = [];

        // console.log(doc.size);
        doc.forEach(element => {
          temp.push({ ...element.data(), hotelId: element.id });
        });
        temp.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        this.hotelList = temp;
      });
    },
    goToAddHotel() {
      this.$router.push("/hotelAdd");
    },
    dialogNoDelete() {},
    confirmDelete() {
      this.loadingShow();
      this.isShowDeleteDialog = false;
      db.collection("hotel")
        .doc(this.hotelData.hotelId)
        .delete()
        .then(() => {
          this.loadingHide();
          this.isDeleteDialogSucess = true;
        });
    }
  },
  mounted() {
    this.loadHotel();
  },
  beforeDestroy() {
    this.isSnapLoadHotel();
  }
};
</script>

<style scoped>
.box-main {
  border: 1px solid #263238;
}
</style>
