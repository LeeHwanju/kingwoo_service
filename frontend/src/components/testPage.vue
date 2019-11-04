<template>
  <div>
    <h1>test page</h1>
    <div class="container">
      <div class="outer">
        <div class="inner">
          <div>
            <div v-for="lec in lecture" :key="lec.id">
              <p>{{lec}}</p>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> <script>
export default {
  created: function() {
    this.$http.get(`/api/test/`).then(response => {
      this.lecture = response.data;
    });
  },
  data: function() {
    return { lecture: {} };
  }
};
</script>
