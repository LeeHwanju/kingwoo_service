<template>
  <div>
    <!-- <div display="inline-block">과목명</div> -->
    <input class="input" type="text" v-model="searching" placeholder />
    <button @click="getData">Search</button>
    <!-- <div v-for="lec in result" :key="lec.id">
      <div>{{lec}}</div>
      <p>{{lec.lecture_name}} {{lec.lecturer}} {{lec.credit}} {{lec.timeinfo}}</p>
      <button v-on:click="addToCart(lec.id, lec.lecturename)">add</button>
    </div>-->
    <div v-for="lec in result" :key="lec.id">
      <div v-bind:id="lec.id">
        <label
          v-bind:for="lec.id"
        >{{lec.group_name}} {{lec.classification}} {{lec.lecture_name}} {{lec.credit}} {{lec.lecturer}} {{lec.timeinfo}}</label>
        <input type="checkbox" v-bind:id="lec.id" v-bind:value="lec.id" v-model="checkedLecture" />
        <!-- <button v-bint:id="lec.id" v-on:click="addToCart(lec.id)">add</button> -->
      </div>
    </div>
    <p>selected lecture</p>
    <p>{{checkedLecture}}</p>
    <button @click="submitToServer">SUBMIT</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    getData() {
      axios({
        method: "get",
        url: "http://localhost:3000/api/test/search",
        params: { keyword: this.searching }
      })
        .then(response => {
          this.result = response.data;
        })
        .catch(error => {
          // handle errors
        });
    },
    // addToCart(id, name) {
    //   alert("add " + name + " success");
    // }
    submitToServer() {
      // alert("SUBMIT complete");
      axios({
        method: "get",
        url: "http://localhost:3000/api/test/submit",
        params: { ownData: this.checkedLecture }
      })
        .then(response => {})
        .catch(error => {
          // handle errors
        });
    }
  },
  data: function() {
    return {
      result: {},
      checkedLecture: []
    };
  }
};
</script>
<style>
#app > div > div > p {
  display: inline-block;
}
#app > div > div > button {
  display: inline-block;
}
</style>