<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-blue-grey-10"
      elevated
      v-if="$route.name != 'practiceList' && $route.name != 'userInfo'"
    >
      <q-toolbar>
        <q-toolbar-title class="q-py-md" style="font-weight:normal">
          <!-- NOTE : เมนูสำหรับ pc  -->
          <div class="text-h6" v-if="$q.platform.is.desktop">
            <span class v-if="routeName.back">
              <router-link class="text-white" :to="routeName.backPath">{{routeName.back}}</router-link>
              <span class="fas fa-chevron-right q-mx-sm"></span>
            </span>
            <span class v-if="routeName.back2">
              <router-link class="text-white" :to="routeName.backPath2">{{routeName.back2}}</router-link>
              <span class="fas fa-chevron-right q-mx-sm"></span>
            </span>
            <span class="text-h6 q-ml-xs">{{routeName.name}}</span>
          </div>

          <!-- NOTE : เมนูสำหรับมือถือ -->
          <div v-if="$q.platform.is.mobile">
            <router-link
              :to="routeName.backPath"
              class="text-white"
              v-if="routeName.backPath && !routeName.backPath2"
            >
              <span class="fas fa-arrow-left q-ml-sm q-mr-md"></span>
            </router-link>
            <router-link :to="routeName.backPath2" class="text-white" v-if="routeName.backPath2">
              <span class="fas fa-arrow-left q-ml-sm q-mr-md"></span>
            </router-link>
            <span class="text-h6 q-ml-xs">{{routeName.name}}</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- เมนูคอมพิวเตอร์ -->
    <q-drawer
      :breakpoint="800"
      show-if-above
      content-class="desktop-only bg-grey-1 bg-blue-grey-10 row "
      :width="100"
      v-if="$q.platform.is.desktop"
    >
      <div
        class="row text-body2 text-blue-grey-4 self-start"
        style="border-right: 1px solid #000"
        align="center"
        v-if="isLoadUserInfo"
      >
        <div
          v-if="userInfo.userGroup.includes('practice')"
          class="full-width q-py-md relative-position cursor-pointer"
          :class="
            $route.name == 'practiceList' || $route.name == 'flashcardMain' || $route.name == 'flashcardInput' || $route.name == 'flashcardEdit' ||  $route.name == 'multipleMain' || $route.name == 'multipleAdd' || $route.name == 'multipleEdit' || $route.name == 'vdoMain' || $route.name == 'vdoAdd' || $route.name == 'vdoEdit' || $route.name == 'vdohowtoupload' || $route.name == 'expressionMain' || $route.name == 'expressionInput' || $route.name == 'expressionEdit'
              ? 'active-line active-text'
              : 'no-active-line'
          "
          v-ripple
          @click="$route.name != 'practiceList' ? $router.push('/practiceList') : null"
        >
          <div>
            <q-icon name="fas fa-book" size="25px" />
          </div>
          <div class="q-pt-sm">แบบฝึกหัด</div>
        </div>
        <div
          class="full-width q-py-md relative-position cursor-pointer"
          :class="
            $route.name == 'lessonMainList'
              ? 'active-line active-text'
              : 'no-active-line'
          "
          v-ripple
          @click="$route.name != 'lessonMainList' ? $router.push('/lessonMainList') : null"
          v-if="userInfo.userGroup.includes('level')"
        >
          <div>
            <q-icon name="fas fa-signal" size="25px" />
          </div>
          <div class="q-pt-sm" style="font-size: 14px">บทเรียน</div>
        </div>

        <div
          class="full-width q-py-md relative-position cursor-pointer"
          :class="
            $route.name == 'accountMain' || $route.name == 'accountAdd' || $route.name == 'accountEdit' || $route.name == 'hotelMain' || $route.name == 'hotelAdd' || $route.name == 'hotelEdit' 
              ? 'active-line active-text'
              : 'no-active-line'
          "
          v-ripple
          @click="$route.name != 'accountMain' ? $router.push('/accountMain') : null"
          v-if="userInfo.userGroup.includes('personel')"
        >
          <div>
            <q-icon name="fas fa-user-tie" size="25px" />
          </div>
          <div class="q-pt-sm">ผู้ใช้งาน</div>
        </div>
        <div
          class="full-width q-py-md relative-position cursor-pointer"
          :class="
             $route.name == 'userMain' || $route.name == 'userAdd' || $route.name == 'userEdit' 
              ? 'active-line active-text'
              : 'no-active-line'
          "
          v-ripple
          @click="$route.name != 'userMain' ? $router.push('/userMain') : null"
          v-if="userInfo.userGroup.includes('admin')"
        >
          <div>
            <q-icon name="fas fa-user-edit" size="25px" />
          </div>
          <div class="q-pt-sm">ผู้ดูแลระบบ</div>
        </div>
        <div
          class="full-width q-py-md relative-position cursor-pointer"
          :class="
            $route.name == 'userInfo'
              ? 'active-line active-text'
              : 'no-active-line'
          "
          v-ripple
          @click="$route.name != 'userInfo' ? $router.push('/userInfo') : null"
        >
          <div>
            <q-icon name="fas fa-cog" size="25px" />
          </div>
          <div class="q-pt-sm">ตั้งค่า</div>
        </div>
      </div>
      <div class="self-end"></div>
    </q-drawer>

    <!-- เมนูมือถือ -->
    <q-footer elevated v-if="$q.platform.is.mobile">
      <div class="mobile-only row bg-blue-grey-10 text-blue-grey-4" align="center">
        <div
          class="col q-pa-xs q-pt-sm relative-position cursor-pointer"
          :class="
            $route.name == 'practiceList' || $route.name == 'practiceMain' || $route.name == 'flashcardMain' || $route.name == 'flashcardInput' || $route.name == 'flashcardEdit' ||  $route.name == 'multipleMain' || $route.name == 'multipleAdd' || $route.name == 'multipleEdit' || $route.name == 'vdoMain' || $route.name == 'vdoAdd' || $route.name == 'vdoEdit' || $route.name == 'vdohowtoupload' || $route.name == 'expressionMain' || $route.name == 'expressionInput' || $route.name == 'expressionEdit'
              ? 'active-line-bottom active-text'
              : 'no-active-line-bottom'
          "
          @click="$router.push('/practiceList')"
          v-ripple
        >
          <q-icon name="fas fa-book" size="25px" />
          <br />
          <span style="font-size:11px">แบบฝึกหัด</span>
        </div>
        <div
          class="col q-pa-xs q-pt-sm relative-position cursor-pointer"
          :class="
            $route.name == 'lessonMainList' || $route.name == 'lessonInput' || $route.name == 'lessonEdit' || $route.name == 'lessonUnitlist'
              ? 'active-line-bottom active-text'
              : 'no-active-line-bottom'
          "
          @click="$route.name != 'lessonMainList' ? $router.push('/lessonMainList') : null"
          v-ripple
        >
          <q-icon name="fas fa-signal" size="25px" />
          <br />
          <span style="font-size:11px">บทเรียน</span>
        </div>
        <div
          class="col q-pa-xs q-pt-sm relative-position cursor-pointer"
          :class="
            $route.name == 'accountMain' || $route.name == 'accountAdd' || $route.name == 'accountEdit' || $route.name == 'hotelMain' || $route.name == 'hotelAdd' || $route.name == 'hotelEdit' 
              ? 'active-line-bottom active-text'
              : 'no-active-line-bottom'
          "
          @click="$router.push('/accountMain')"
          v-ripple
        >
          <q-icon name="fas fa-user-tie" size="25px" />
          <br />
          <span style="font-size:11px">ผู้ใช้งาน</span>
        </div>
        <div
          class="col q-pa-xs q-pt-sm relative-position cursor-pointer"
          :class="
            $route.name == 'userMain' || $route.name == 'userAdd' || $route.name == 'userEdit' 
              ? 'active-line-bottom active-text'
              : 'no-active-line-bottom'
          "
          @click="$router.push('/userMain')"
          v-ripple
        >
          <q-icon name="fas fa-user-edit" size="25px" />
          <br />
          <span style="font-size:11px">ผู้ดูแลระบบ</span>
        </div>
        <div
          class="col q-pa-xs q-pt-sm relative-position cursor-pointer"
          :class="
            $route.name == 'userInfo' || $route.name == 'userSettingMobile'
              ? 'active-line-bottom active-text'
              : 'no-active-line-bottom'
          "
          @click="$router.push('/userInfo')"
          v-ripple
        >
          <q-icon name="fas fa-cog" size="25px" />
          <br />
          <span style="font-size:11px">ตั้งค่า</span>
        </div>
      </div>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view
        :class="
          $route.name == 'practiceList' || $route.name == 'userInfo' || $route.name == 'lessonUnitlist'
            ? ''
            : 'q-pa-md'
        "
        :style="
          $route.name == 'practiceList' || $route.name == 'userInfo'
            ? ''
            : 'max-width:1000px;width:100%;margin:auto'
        "
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth, db, axios } from "../router";
export default {
  name: "MainLayout",

  data() {
    return {
      userInfo: {},
      isLoadUserInfo: false,
      isKey: false,
      loginKey: "",
      headerBarList: [
        {
          name: "บทเรียน",
          type: "lessonMainList",
        },
        {
          name: "แบบฝึกหัด",
          type: "practiceList",
        },
        {
          name: "ผู้ใช้งาน",
          type: "accountMain",
        },
        {
          name: "ผู้ดูแลระบบ",
          type: "userMain",
        },
        {
          name: "ตั้งค่า",
          type: "userInfo",
        },
      ],
      snapUser: "",
    };
  },
  methods: {
    async loadUserInfo() {
      this.loadingShow();
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          // กรณี Login อยู่ในระบบ
          let apiURL =
            "https://us-central1-atwork-dee11.cloudfunctions.net/atworkFunctions/getUserData?uid=" +
            user.uid;
          let getData = await axios.get(apiURL);
          this.userInfo.userGroup =
            getData.data.customClaims.dataEntryPermissions;
          this.isLoadUserInfo = true;
          this.loadingHide();
        } else {
          this.loadingHide();
          this.$router.push("/");
          this.$q.localStorage.clear();
          this.$q.sessionStorage.clear();
        }
      });
    },
  },
  computed: {
    checkActiveRouteName() {},
    routeName() {
      let result;

      let practicePath =
        this.$route.params.levelId +
        "/" +
        this.$route.params.unitId +
        "/" +
        this.$route.params.practiceId;

      // Link Router List
      let routeList = [
        // NOTE : Router Practice
        {
          name: "แบบฝึกหัด",
          back: "",
          backPath: "/practiceList",
          back2: "",
          backPath2: "",
          type: "practiceMain",
        },
        // NOTE : Router Flashcard
        {
          name: "การ์ดคำศัพท์",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "",
          backPath2: "",
          type: "flashcardMain",
        },
        // NOTE : Router Flashcard Add
        {
          name: "เพิ่มคำศัพท์",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "การ์ดคำศัพท์",
          backPath2: "/flashcardMain/" + practicePath,
          type: "flashcardInput",
        },
        // NOTE : Router Flashcard Edit
        {
          name: "แก้ไขคำศัพท์",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "การ์ดคำศัพท์",
          backPath2: "/flashcardMain/" + practicePath,
          type: "flashcardEdit",
        },
        // NOTE : Router Multiple
        {
          name: "เลือกคำตอบ",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "",
          backPath2: "",
          type: "multipleMain",
        },
        // NOTE : Router Multiple Add
        {
          name: "เพิ่มเลือกคำตอบ",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "เลือกคำตอบ",
          backPath2: "/multipleMain/" + practicePath,
          type: "multipleAdd",
        },
        // NOTE : Router Multiple Edit
        {
          name: "แก้ไขเลือกคำตอบ",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "เลือกคำตอบ",
          backPath2: "/multipleMain/" + practicePath,
          type: "multipleEdit",
        },
        // NOTE : Router Expression
        {
          name: "ประโยคสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "",
          backPath2: "",
          type: "expressionMain",
        },
        // NOTE : Router Expression Add
        {
          name: "เพิ่มประโยคสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "ประโยคสนทนา",
          backPath2: "/expressionMain/" + practicePath,
          type: "expressionInput",
        },
        {
          name: "แก้ไขประโยคสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "ประโยคสนทนา",
          backPath2: "/expressionMain/" + practicePath,
          type: "expressionEdit",
        },
        // NOTE : Router Video
        {
          name: "บทสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "",
          backPath2: "",
          type: "vdoMain",
        },
        {
          name: "เพิ่มบทสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "บทสนทนา",
          backPath2: "/vdoMain/" + practicePath,
          type: "vdoAdd",
        },
        {
          name: "แก้ไขบทสนทนา",
          back: "แบบฝึกหัด",
          backPath: "/practiceList",
          back2: "บทสนทนา",
          backPath2: "/vdoMain/" + practicePath,
          type: "vdoEdit",
        },
        {
          name: "การตั้งค่าการอัปโหลดวีดีโอ",
          back: "",
          backPath: "/vdoMain/" + practicePath,
          back2: "",
          backPath2: "",
          type: "vdohowtoupload",
        },
        // NOTE : Router Lesson
        {
          name: "บทเรียน",
          back: "",
          backPath: "",
          back2: "",
          backPath2: "",
          type: "lessonMainList",
        },
        {
          name: "เพิ่มตำแหน่ง",
          back: "",
          backPath: "/lessonMainList",
          back2: "",
          backPath2: "",
          type: "lessonInput",
        },
        {
          name: "แก้ไขตำแหน่ง",
          back: "",
          backPath: "/lessonMainList",
          back2: "",
          backPath2: "",
          type: "lessonEdit",
        },
        {
          name: "บทเรียน",
          back: "",
          backPath: "/lessonMainList",
          back2: "",
          backPath2: "",
          type: "lessonUnitlist",
        },
        // NOTE : Router Account
        {
          name: "ผู้ใช้งาน",
          back: "",
          backPath: "",
          back2: "",
          backPath2: "",
          type: "accountMain",
        },
        {
          name: "กิจการ",
          back: "ผู้ใช้งาน",
          backPath: "/accountMain",
          back2: "",
          backPath2: "",
          type: "hotelMain",
        },
        {
          name: "เพิ่มกิจการ",
          back: "ผู้ใช้งาน",
          backPath: "/accountMain",
          back2: "กิจการ",
          backPath2: "/hotelMain",
          type: "hotelAdd",
        },
        {
          name: "แก้ไขกิจการ",
          back: "ผู้ใช้งาน",
          backPath: "/accountMain",
          back2: "กิจการ",
          backPath2: "/hotelMain",
          type: "hotelEdit",
        },
        {
          name: "เพิ่มพนักงาน",
          back: "ผู้ใช้งาน",
          backPath: "/accountMain",
          back2: "",
          backPath2: "",
          type: "accountAdd",
        },
        {
          name: "แก้ไขพนักงาน",
          back: "ผู้ใช้งาน",
          backPath: "/accountMain",
          back2: "",
          backPath2: "",
          type: "accountEdit",
        },

        // NOTE : Router User
        {
          name: "ผู้ดูแลระบบ",
          back: "",
          backPath: "",
          back2: "",
          backPath2: "",
          type: "userMain",
        },
        {
          name: "เพิ่มผู้ดูแลระบบ",
          back: "ผู้ดูแลระบบ",
          backPath: "/userMain",
          back2: "",
          backPath2: "",
          type: "userAdd",
        },
        {
          name: "แก้ไขผู้ดูแลระบบ",
          back: "ผู้ดูแลระบบ",
          backPath: "/userMain",
          back2: "",
          backPath2: "",
          type: "userEdit",
        },
        // NOTE : Router User Setting
        {
          name: "ตั้งค่า",
          back: "",
          backPath: "",
          back2: "",
          backPath2: "",
          type: "userInfo",
        },
        {
          name: "แก้ไข ชื่อ นามสกุล",
          back: "",
          backPath: "/userInfo",
          back2: "",
          backPath2: "",
          type: "userSettingMobile",
        },
        {
          name: "แก้ไขผู้ดูแลระบบ",
          back: "",
          backPath: "/userMain",
          back2: "",
          backPath2: "",
          type: "userEdit",
        },
      ];

      result = routeList.filter((x) => x.type == this.$route.name)[0];

      return result;
    },
  },

  mounted() {
    this.loadUserInfo();
  },
};
</script>
<style lang="scss" scoped>
.active-line {
  border-left: 7px solid #fff;
}
.active-text {
  color: #fff;
}
.no-active-line {
  border-left: 7px solid #263238;
}
.active-line-bottom {
  border-bottom: 5px solid #fff;
}
.no-active-line-bottom {
  border-bottom: 5px solid #263238;
}

.text-underline {
  text-decoration: underline;
}
</style>
