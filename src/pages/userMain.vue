<template>
  <q-page>
    <div class="container">
      <div align="center">
        <q-btn style="width:190px" color="blue-grey-10" label="เพิ่มผู้ดูแลระบบ" @click="addUser()"></q-btn>
      </div>
      <div v-if="isLoadUser">
        <q-card class="rounded-borders q-pa-md q-mt-md br" v-for="item in nameArr" :key="item.id">
          <q-card-section class="no-padding">
            <q-btn dense color="blue-grey-10" round :label="item"></q-btn>
          </q-card-section>
          <q-card-section
            class="no-padding"
            v-for="(item2, index) in dataUser.filter(x => x.displayName[0] == item)"
            :key="index"
          >
            <div class="row q-mt-md">
              <div class="col">
                <div class="text-subtitle1">{{ item2.displayName }}</div>
                <div class="text-subtitle2 text-blue-grey-7">{{ item2.email }}</div>

                <span v-if="item2.customClaims">
                  <span v-for="(item3,index2) in item2.customClaims.dataEntryPermissions">
                    <q-badge
                      color="blue-grey-7"
                      outline
                      class="q-mr-sm q-mt-sm"
                    >{{ convertPremision.filter(x => x.type == item3)[0].name }}</q-badge>
                  </span>
                </span>
              </div>
              <div class="col-1 self-center" style="width:100px;" align="right">
                <div class="desktop-only">
                  <q-btn
                    flat
                    size="sm"
                    class="q-mr-md"
                    round
                    icon="far fa-trash-alt"
                    @click="deleteBtn(item2)"
                  ></q-btn>
                  <q-btn flat size="sm" round icon="far fa-edit" @click="editBtn(item2)"></q-btn>
                </div>
                <div class="mobile-only">
                  <q-btn size="13px" icon="fas fa-ellipsis-v" round dense flat>
                    <q-menu :offset="[-15, 0]" self="top right">
                      <q-list style="min-width: 120px">
                        <q-item clickable v-close-popup>
                          <q-item-section @click="editBtn(item2)">แก้ไขข้อมูล</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section @click="deleteBtn(item2)">ลบ</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </div>
            </div>
            <q-separator
              v-if="
                index !=
                  dataUser.filter(x => x.displayName[0] == item).length -
                    1
              "
              class="q-my-md"
            />
          </q-card-section>
        </q-card>
      </div>
      <!-- dialog ต้องการลบข้อมูล -->
      <q-dialog v-model="deleteDataDialog" persistent>
        <div
          class="bg-white row justify-center items-center"
          style="width:320px;height:152px"
          align="center"
        >
          <div>
            <div class="text-subtitle1 q-pb-md">คุณต้องการลบ "{{ nameDialog }}" หรือไม่</div>
            <div class="row q-pt-md">
              <div class="col-6 q-pr-sm">
                <q-btn dense style="width:120px" outline label="ยกเลิก" @click="cencel()"></q-btn>
              </div>
              <div class="col-6 q-pl-sm" align="right">
                <q-btn
                  dense
                  color="blue-grey-10"
                  style="width:120px"
                  label="ยืนยัน"
                  @click="confirm()"
                ></q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { db, axios, auth } from "../router";
export default {
  data() {
    return {
      isLoadUser: false,
      deleteKey: "",
      dataUser: [],
      nameArr: "",
      deleteDataDialog: false,
      nameDialog: "",
      uid: "",
      convertPremision: [
        {
          name: "แบบฝึกหัด",
          type: "practice",
        },
        {
          name: "บทเรียน",
          type: "level",
        },
        {
          name: "ผู้ใช้งาน",
          type: "personel",
        },
        {
          name: "ผู้ดูแลระบบ",
          type: "admin",
        },
      ],
    };
  },
  methods: {
    async loadDataUser() {
      this.loadingShow();
      const apiURL =
        "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/getAllUser";

      let userData = await axios.get(apiURL);

      let getOnlyDataentryUser = userData.data.filter((x) =>
        x.customClaims.accessProgram.includes("dataEntry")
      );

      this.dataUser = getOnlyDataentryUser;
      this.isLoadUser = true;

      let nameArr = getOnlyDataentryUser.map((x) => x.displayName.slice(0, 1));
      nameArr.sort((a, b) => (a > b ? 1 : -1));
      nameArr = [...new Set(nameArr)];
      this.nameArr = nameArr;
      this.loadingHide();
    },

    addUser() {
      this.$router.push("userAdd");
    },
    editBtn(data) {
      this.$router.push({ name: "userEdit", params: data });
    },
    deleteBtn(item) {
      this.nameDialog = item.displayName;
      this.deleteDataDialog = true;
      this.uid = item.uid;
    },
    cencel() {
      this.deleteDataDialog = false;
    },
    async confirm() {
      // DELETE USER FROM AUTH
      const apiURL =
        "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/user/delete?uid=" +
        this.uid;
      await axios.get(apiURL);
      this.deleteDataDialog = false;
      this.loadDataUser();
    },
  },
  mounted() {
    this.loadDataUser();
  },
};
</script>

<style lang="scss" scoped></style>
