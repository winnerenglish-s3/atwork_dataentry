const routes = [
  {
    path: "/",
    component: () => import("pages/login.vue"),
    name: "login"
  },
  {
    path: "/test1",
    component: () => import("pages/test1.vue")
  },
  {
    path: "/forgetPassword",
    component: () => import("pages/forgetPassword.vue")
  },
  {
    path: "/welcomeBack",
    component: () => import("pages/welcomeBack.vue")
  },
  // ------------------- multiple Print-------------------
  {
    path: "/multiplePrint",
    component: () => import("pages/multiplePrint.vue"),
    name: "multiplePrint"
  },
  {
    path: "/flashcardPrint",
    component: () => import("pages/flashcardPrint.vue"),
    name: "flashcardPrint"
  },
  {
    path: "/expressionPrint",
    component: () => import("pages/expressionPrint.vue"),
    name: "expressionPrint"
  },
  {
    path: "/vdoPrint",
    component: () => import("pages/vdoPrint.vue"),
    name: "vdoPrint"
  },
  {
    path: "/multiplePrint",
    component: () => import("pages/multiplePrint.vue"),
    name: "multiplePrint"
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // ------------------- practice list แบบฝึกหัด -------------------
      {
        path: "practiceList",
        component: () => import("pages/practiceList.vue"),
        name: "practiceList"
      },
      {
        path: "practiceMain/:levelId/:unitId",
        component: () => import("pages/practiceMain.vue"),
        name: "practiceMain"
      },
      // ------------------- flashcard -------------------
      {
        path: "flashcardMain/:levelId/:unitId/:practiceId",
        component: () => import("pages/flashcardMain.vue"),
        name: "flashcardMain"
      },
      {
        path: "flashcardInput/:levelId/:unitId/:practiceId",
        component: () => import("pages/flashcardInput.vue"),
        name: "flashcardInput"
      },
      {
        path: "flashcardEdit/:levelId/:unitId/:practiceId",
        component: () => import("pages/flashcardInput.vue"),
        name: "flashcardEdit"
      },
      // ------------------- multiple -------------------
      {
        path: "multipleMain/:levelId/:unitId/:practiceId",
        component: () => import("pages/multipleMain.vue"),
        name: "multipleMain"
      },
      {
        path: "multipleAdd/:levelId/:unitId/:practiceId",
        component: () => import("pages/multipleInput.vue"),
        name: "multipleAdd"
      },
      {
        path: "multipleEdit/:levelId/:unitId/:practiceId",
        component: () => import("pages/multipleInput.vue"),
        name: "multipleEdit"
      },
      // ------------------- expression -------------------
      {
        path: "expressionMain/:levelId/:unitId/:practiceId",
        component: () => import("pages/expressionMain.vue"),
        name: "expressionMain"
      },
      {
        path: "expressionInput/:levelId/:unitId/:practiceId",
        component: () => import("pages/expressionInput.vue"),
        name: "expressionInput"
      },
      {
        path: "expressionEdit/:levelId/:unitId/:practiceId",
        component: () => import("pages/expressionInput.vue"),
        name: "expressionEdit"
      },
      // ------------------- vdo -------------------
      {
        path: "vdoMain/:levelId/:unitId/:practiceId",
        component: () => import("pages/vdoMain.vue"),
        name: "vdoMain"
      },
      {
        path: "vdoAdd/:levelId/:unitId/:practiceId",
        component: () => import("pages/vdoInput.vue"),
        name: "vdoAdd"
      },
      {
        path: "vdoEdit/:levelId/:unitId/:practiceId",
        component: () => import("pages/vdoInput.vue"),
        name: "vdoEdit"
      },
      {
        path: "vdohowtoupload/:levelId/:unitId/:practiceId",
        component: () => import("pages/vdohowtoupload.vue"),
        name: "vdohowtoupload"
      },

      // ------------------- lessonMain ระดับการเรียน -------------------
      {
        path: "lessonMainList",
        component: () => import("pages/lessonMainList.vue"),
        name: "lessonMainList"
      },
      {
        path: "lessonInput",
        component: () => import("pages/lessonInputEdit.vue"),
        name: "lessonInput"
      },
      {
        path: "lessonEdit/:levelId",
        component: () => import("pages/lessonInputEdit.vue"),
        name: "lessonEdit"
      },
      {
        path: "lessonUnitlist/:levelId",
        component: () => import("pages/lessonUnitList.vue"),
        name: "lessonUnitlist"
      },
      // ------------------- account ผู้ใช้งาน -------------------
      {
        path: "accountMain",
        component: () => import("pages/accountMain.vue"),
        name: "accountMain"
      },
      {
        path: "hotelMain",
        component: () => import("pages/hotelMain.vue"),
        name: "hotelMain"
      },
      {
        path: "hotelAdd",
        component: () => import("pages/hotelInput.vue"),
        name: "hotelAdd"
      },
      {
        path: "hotelEdit/:hotelId",
        component: () => import("pages/hotelInput.vue"),
        name: "hotelEdit"
      },
      {
        path: "accountAdd/:hotelId/:departmentId",
        component: () => import("pages/accountInput.vue"),
        name: "accountAdd"
      },
      {
        path: "accountEdit/:hotelId/:departmentId/:employeeId",
        component: () => import("pages/accountInput.vue"),
        name: "accountEdit"
      },
      // ------------------- userMain ผู้ดูแลระบบ -------------------
      {
        path: "userMain",
        component: () => import("pages/userMain.vue"),
        name: "userMain"
      },
      {
        path: "userAdd",
        component: () => import("pages/userAddEdit.vue"),
        name: "userAdd"
      },
      {
        path: "userEdit",
        component: () => import("pages/userAddEdit.vue"),
        name: "userEdit"
      },
      // ------------------- user info -------------------
      {
        path: "userInfo",
        component: () => import("pages/userInfo.vue"),
        name: "userInfo"
      },
      {
        path: "userSettingMobile",
        component: () => import("pages/userSettingMobile.vue"),
        name: "userSettingMobile"
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
