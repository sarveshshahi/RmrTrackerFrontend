<template>
<div>
    <FilledForms v-on:fetch-data="fetchReportData" />
</div>
</template>

<script>
import axios from "axios";
import FilledForms from "@/components/FilledForms.vue";
export default {
  data() {
    return {
      username: '',
      reportData: [],
      tableColumns: [],
    };
  },
  methods: {
    fetchReportData(filters) {
      const apiUrl = process.env.VUE_APP_ROOT_API+"/api/FilledForms"; 

      // Make API call to fetch report data with filters
      axios.get(apiUrl, { params: filters }).then((response) => {
        this.reportData = response.data;
        this.tableColumns = Object.keys(response.data[0]);
      });
    },
  },
  components: {
    FilledForms,   
  },
};
</script>

<style scoped>
</style>
