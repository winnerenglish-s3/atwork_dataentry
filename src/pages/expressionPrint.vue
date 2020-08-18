<template>
  <div class="bg6">
    <div id="printBtn">
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title>
          <span>Expression</span>
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
      <div class="bg7 paper-a4 q-my-lg cl2 q-px-md q-pb-sm">
        <!-- หัวกระดาษ -->
        <table style="width:95%; margin:auto;">
          <thead>
            <tr>
              <td>
                <div class="q-py-md"></div>
              </td>
            </tr>
            <tr style="height: 15px;" align="center">
              <td>
                <div class="q-mb-md">
                  <span class="text-h4">{{title1}}</span>
                  <br />
                  <span class="text-h5">{{title2}}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in data" :key="index">
              <td>
                <q-separator class="q-my-md" />
                <div class="row">
                  <div class="col-1" style="width:30px;">{{index+1}}.</div>
                  <div class="col row" v-for="(val,index2) in item.expression" :key="index2">
                    <div class="col">
                      <div>
                        <span v-html="val.speaker == 'employee' ? 'พนักงาน' : 'ลูกค้า'"></span>
                      </div>
                      <div class="q-mt-sm">
                        <q-icon v-if="val.isSound" name="fas fa-volume-up" class="q-mr-sm"></q-icon>
                        <span v-html="val.sentenceEng"></span>
                      </div>
                      <div>
                        <span v-html="val.sentenceTh"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
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
    this.data = this.data.filter((x) => x.collection == "draft");
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
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
}
@media print {
  body {
    background: #ffffff;
  }
  .bg-print {
    padding: 0px 0px;
  }
  body,
  .paper-a4 {
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