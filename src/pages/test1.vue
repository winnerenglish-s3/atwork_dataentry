<template>
  <div>
    <div>
      <q-btn label="set session" @click="setSession()"></q-btn>
    </div>

    <div>
      <q-btn label="set LocalStorage" @click="setLocalStorage()"></q-btn>
    </div>

    <p>SessionStorage= {{ $q.sessionStorage.getItem("testSession") }}</p>

    <p>LocalStorage = {{ $q.localStorage.getItem("testLocalStorage") }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: [1, 2, 3],
      test1: [5, 6, 7],
      indexClick: 0,
    };
  },
  methods: {
    setSession(index) {
      this.indexClick = index;
      this.$q.sessionStorage.set("testSession", "12345 Session");
    },
    setLocalStorage() {
      this.$q.localStorage.set("testLocalStorage", "12345 LocalStorage");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>