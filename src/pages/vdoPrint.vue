<template>
  <div class="bg6">
    <div id="printBtn">
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title>
          <span>VDO</span>
        </q-toolbar-title>

          <q-btn
          dark
          round
          size="12px"
          color="amber-13"
          text-color="black"
          icon="fas fa-copy"
          class="q-mr-md"
          @click="copyText()"
        />


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
        <table style="width:90%; margin:auto;">
          <thead>
            <tr>
              <td>
                <div class="q-py-md"></div>
              </td>
            </tr>
            <tr style="height: 15px;" align="center">
              <td>
                <div class="q-mb-md">
                  <span class="text-h4">{{ title1 }}</span>
                  <br />
                  <span class="text-h5">{{ title2 }}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <table style="width:100%">
                <tr>
                  <td style="width:200px">
                    <span class="text-h6">{{ item.speaker }}</span>
                  </td>
                  <td class="text-h6">
                    <span>{{ item.sentenceEng }}</span>
                    <br />
                    <span>{{ item.sentenceTh }}</span>
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
      title2: this.$route.params.title2
    };
  },
  methods: {
    //โชว์ชื่อผู้พูด
    
    printBtn() {
      window.print();
    },
    closeBtn() {
      window.history.back();
    },
    copyText() {
      let tempText = "";
      this.data.forEach(element => {
        // element.expression.forEach(x => {
          tempText += element.sentenceEng + "\n";
        // });
      });
      var input = document.createElement("textarea");
      input.innerHTML = tempText;
      document.body.appendChild(input);
      input.select();
      var result = document.execCommand("copy");
      document.body.removeChild(input);
      this.$q.notify(
        {
          message  : "coppied",
          color : "secondary"
        }
      )
      return result;
    }
  },
  mounted() {
    if (this.$route.params.data == undefined) {
      window.history.back();
    }
  }
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
