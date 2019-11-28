<template>
  <div>
    <!-- <div display="inline-block">과목명</div> -->
    <input class="input" type="text" v-model="searching" placeholder />
    <button @click="getData">Search</button>
    <p></p>
    <!-- <div v-for="lec in result" :key="lec.id">
      <div>{{lec}}</div>
      <p>{{lec.lecture_name}} {{lec.lecturer}} {{lec.credit}} {{lec.timeinfo}}</p>
      <button v-on:click="addToCart(lec.id, lec.lecturename)">add</button>
    </div>-->
    <!-- <div v-for="lec in result" :key="lec.id">
      <div v-bind:id="lec.id">
        <label v-bind:for="lec.id">
          {{ lec.group_name }} {{ lec.classification }} {{ lec.lecture_name }}
          {{ lec.credit }} {{ lec.lecturer }} {{ lec.timeinfo }}
        </label>
        <input
          type="checkbox"
          v-bind:id="lec.id"
          v-bind:value="lec.id"
          v-model="checkedLecture"
        />
      </div>
    </div>-->
    <div>
      <table>
        <tr>
          <th>소속</th>
          <th>구분</th>
          <th>과목명</th>
          <th>학점</th>
          <th>교강사</th>
          <th>시간정보</th>
          <th></th>
        </tr>
        <tr v-for="lec in result" :key="lec.id">
          <td>{{ lec.group_name }}</td>
          <td>{{ lec.classification }}</td>
          <td>{{ lec.lecture_name }}</td>
          <td>{{ lec.credit }}</td>
          <td>{{ lec.lecturer }}</td>
          <td>{{ lec.timeinfo }}</td>
          <td>
            <input
              type="checkbox"
              v-bind:id="lec.id"
              v-bind:value="lec.id"
              v-model="checkedLecture"
            />
          </td>
        </tr>
      </table>
    </div>
    <p>SELECTED LECTURES</p>
    <input
      type="number"
      min="2"
      max="27"
      step="1"
      placeholder="minimum credit"
      required
      v-model="mini"
    />
    <input
      type="number"
      min="2"
      max="27"
      step="1"
      placeholder="maximum credit"
      required
      width="30px"
      v-model="maxi"
    />
    <p>{{ checkedLecture }}</p>
    <button @click="getValid_0">SUBMIT</button>
    <button @click="getValid_v2">test1</button>
    <button @click="getValid_v3">test2</button>
    <button @click="getValid_v4">waterfall_test</button>
    <div>{{ val_result }}</div>
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
        params: {
          keyword: this.searching
        }
      })
        .then(response => {
          this.result = response.data;
        })
        .catch(error => {
          // handle errors
        });
    },

    getValid_0() {
      axios({
        method: "get",
        url: "http://localhost:3000/api/valid/valid0",
        params: {
          keyword: this.checkedLecture,
          mini: this.mini,
          maxi: this.maxi
        }
      })
        .then(response => {
          this.val_result = response.data;
        })
        .catch(error => {});
    },

    getValid_v2() {
      axios({
        method: "get",
        url: "http://localhost:3000/api/valid/valid_v2",
        params: {
          keyword: this.checkedLecture,
          mini: this.mini,
          maxi: this.maxi
        }
      })
        .then(response => {
          // this.val_result = response.data;
        })
        .catch(error => {});
    },

    getValid_v3() {
      axios({
        method: "get",
        url: "http://localhost:3000/api/valid/valid_v3"
      })
        .then(response => {
          // this.val_result = response.data;
        })
        .catch(error => {});
    },

    getValid_v4() {
      axios({
        method: "get",
        url: "http://localhost:3000/api/valid/valid_v4",
        params: {
          keyword: this.checkedLecture,
          mini: this.mini,
          maxi: this.maxi
        }
      })
        .then(response => {
          // this.val_result = response.data;
        })
        .catch(error => {});
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
      val_result: {},
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

table {
  width: 100%;
  border-collapse: collapse;
}
table th {
  font-size: 0.7rem;
}
table tr {
  height: 2rem;
  text-align: center;
  border-bottom: 1px solid #505050;
}
table tr:first-of-type {
  border-top: 2px solid #404040;
}
table tr td {
  padding: 1rem 0;
  font-size: 0.7rem;
}
.btn-cover {
  margin-top: 1.5rem;
  text-align: center;
}
.btn-cover .page-btn {
  width: 5rem;
  height: 2rem;
  letter-spacing: 0.5px;
}
.btn-cover .page-count {
  padding: 0 1rem;
}
</style>
