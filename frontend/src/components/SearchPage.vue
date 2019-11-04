<template>
  <div>
    <!-- <div display="inline-block">과목명</div> -->
    <input class="input" type="text" v-model="searching" placeholder />
    <button @click="getData">Search</button>
    <!-- <div>검색어 : {{searching}}</div> -->
    <div v-for="lec in result" :key="lec.id">
      <p>{{lec}}</p>
    </div>
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
    }
  },
  data: function() {
    return { result: {} };
  }
};
</script>