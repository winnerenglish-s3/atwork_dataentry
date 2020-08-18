<template>
  <div class="bg6">
    <div id="printBtn">
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title>
          <span>Flashcard</span>
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
                <q-separator class="q-my-sm" />
                <div class="row">
                  <div class="col-1 q-pa-sm" style="width:fit-content;">
                    <span v-html="item.order"></span>
                  </div>
                  <div class="col-1 q-pa-sm" style="width:fit-content;">
                    <q-img :src="item.img" v-if="item.isImage" style="width:150px;" />
                    <q-img src="../statics/noimage.jpg" v-if="!item.isImage" style="width: 150px" />
                  </div>
                  <div class="col q-pa-sm q-pl-lg">
                    <q-icon v-if="item.isSound" class="q-mr-sm" name="fas fa-volume-up"></q-icon>
                    <span>{{item.vocabulary}}</span>
                    <br />
                    <span>{{item.meaning}}</span>
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
  max-width: 210mm;
  width: 95%;
  min-height: 297mm;
  max-height: fit-content;
  font-size: 100%;
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
    width: 210mm;
    min-height: 297mm;
    max-height: fit-content;
    font-size: 100%;
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
}
</style>