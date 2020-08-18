<template>
  <div class="bg6">
    <div id="printBtn">
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title>
          <span>VDO</span>
        </q-toolbar-title>
        <q-btn
          class="q-mr-md"
          dark
          round
          size="12px"
          color="amber-13"
          text-color="black"
          icon="fas fa-print"
          @click="printBtn()"
        />
        <q-btn
          dark
          round
          size="12px"
          color="amber-13"
          text-color="black"
          icon="fas fa-times"
          @click="closeBtn()"
        />
      </q-toolbar>
    </div>

    <div align="center">
      <div class="bg7 printMe shadow-1 paper-a4 q-my-lg cl2">
        <!-- หัวกระดาษ -->
        <table style="width:90%; margin:auto;">
          <thead>
            <tr style="height: 15px;" align="center">
              <td colspan="2">
                <span class="text-h4">{{title1}}</span>
                <br />
                <span class="text-h5">{{title2}}</span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in data" :key="index">
              <table style="width:100%">
                <tr>
                  <td style="width:200px">
                    <span class="text-h6">{{item.speaker}}</span>
                  </td>
                  <td class="text-h6">
                    <span>{{item.sentenceEng}}</span>
                    <br />
                    <span>{{item.sentenceTh}}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <hr />
                  </td>
                </tr>
              </table>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: this.$route.params.data,
      title1: this.$route.params.title1,
      title2: this.$route.params.title2,
    };
  },
  methods: {
    printBtn() {
      window.print();
    },
    closeBtn() {
      window.history.back();
    },
  },
  mounted() {
    if (this.$route.params.data == undefined) {
      window.history.back();
    }
  },
};
</script>

<style scoped>
.greybox {
  outline: 1px solid gray;
}
.boxGrap {
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
}
.box {
  border: 1px solid #5c5c5c;
}
.paper-a4 {
  background: #ffffff;
  width: 210mm;
  min-height: 297mm;
  max-height: fit-content;
}
@media print {
  body {
    background: #ffffff;
  }
  .bg-print {
    padding: 0px 0px;
  }
  body,
  .printMe {
    background: #ffffff;
    margin: 0px 0px;
    margin-bottom: 0px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    border: transparent;
  }

  #printBtn {
    display: none;
  }
}
@page {
  margin: 0mm;
  width: 210mm;
  height: 297mm;
  /* size: landscape; portrait */
}
</style>