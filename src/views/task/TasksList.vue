<template>
  <div class="tasks container-xxl">
    <h1>Задачи на проектирование</h1>
    <div class="tasks-error" v-if="error">
      Oops! Error encountered: {{ error.message }}, {{ this.error }}
    </div>
    <div class="table-of-tasks" v-else-if="tasks">
      <table class="table table-striped tasks-list">
        <thead>
          <th>id</th>
          <th>performer id</th>
          <th>project id</th>
          <th>system</th>
          <th>complexity</th>
          <th>owner</th>
          <th>status</th>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.performerId }}</td>
            <td>{{ task.projectId }}</td>
            <td>{{ task.system }}</td>
            <td>{{ task.taskComplexity }}</td>
            <td>{{ task.taskStarterEmail }}</td>
            <td>{{ task.taskStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { onMounted } from 'vue';
export default {
  name: "Tasks",
  setup() {
    
    let tasks = [];

    let error = {}
      
    onMounted(async () => {
      await fetch('http://localhost:8080/api/v1/task', {
        method: 'GET',
        headers: {
          'Content-type' : 'application/json',
          'Authorization' : localStorage.Authorization,
        },
        credentials: 'include',
        body: null,
      })
      .then(response => response.json())
      .then(items => {
        tasks = items;
    })
      .catch(err => {
        console.log(error.message);
        error = err;
        });
    });

    return {
      tasks,
      error
    };
  },

}
</script>


<style>
</style>

