<template>
    <h1>Задача на проектирование {{ this.task.id }}</h1>
</template>

<script>
export default {
  data() {
    return {
      task: [],
    };
  },
  mounted() {
    const headers = {
      Authorization:
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicnlhbmluLmRtaXRyaXlAbHVpcy5ydSIsInJvbGUiOiJNSURETEVfRU5HSU5FRVIiLCJpYXQiOjE2NTM4MzQ4OTcsImV4cCI6MTY1NDQzOTY5N30.f5uEkJLdtLIc1jcmwbHZqswq4tMBCGUeBIMfaRmFAwk",
      "Content-Type": "application/json",
    };
    fetch("http://localhost:8080/api/v1/task/" + $this.$route.id, {
      method: "GET",
      headers: headers,
      body: null,
    })
      .then((response) => response[id].json())
      .then((data) => (this.task[id] = data))
      .catch((error) => console.log(error.message));
  },
};
</script>