<template>
  <div class="tasks container-xxl">
    <h1>Задачи на проектирование</h1>
    <div class="search">
      <input
        type="text"
        id="task_search"
        v-model="filter"
        @input="filterTasks"
        placeholder="Поиск по всем столбцам"
      />
    </div>
    <div class="table-responsive-md" v-if="tasks">
      <table class="table table-sm table-striped table-bordered table-hover">
        <thead class="table-light">
          <th>ID</th>
          <th>№ проекта</th>
          <th>Инициатор</th>
          <th>Система</th>
          <th>Сложность</th>
          <th>Исполнитель</th>
          <th>Статус</th>
          <th>Дата создания</th>
          <th></th>
        </thead>
        <tbody class="table-striped">
          <tr v-for="task in tasks" :key="task.id">
            <td class="task">{{ task.id }}</td>
            <td>{{ task.projectId }}</td>
            <td>{{ task.ownerEmail }}</td>
            <td>{{ task.system }}</td>
            <td>{{ task.complexity }}</td>
            <td>{{ task.performerId }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.createdAt }}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary"
                @click="
                  this.$router.push({
                    name: 'taskdetails',
                    params: { id: task.id },
                  })
                "
              >
                Открыть
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    <div v-else>Loading...</div>
  </div>

</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "TasksList",
  data() {
    return {
      tasks: null,
      users: null,
      filter: "",
      filteredTasks: [],
      
    };
  },
  methods: {
    async getAllData() {
      try {
        const taskRes = await fetch(`${baseURL}/task`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!taskRes.ok) {
          if (taskRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
          console.log(message);
        }
        const taskData = await taskRes.json();
        this.tasks = taskData;
        this.tasks.forEach((task) => {
          task.createdAt = new Date(task.createdAt).toLocaleDateString("ru-RU");
          if (task.performerId == null) {
            task.performerId = "Не назначен";
          }
        }
        );
        
      } catch (err) {
        this.tasks = err.message;
      }
    },

    async filterTasks() {
      this.filteredTasks = [];
      let all_task_TDs = document.querySelectorAll("td.task");
      this.tasks.forEach((task) => {
        const idModified = task.id.toString().toLowerCase();
        const projectIdModified = task.projectId.toString().toLowerCase();
        const ownerEmailModified = task.ownerEmail.toLowerCase();
        const systemModified = task.system.toLowerCase();
        const complexityModified = task.complexity.toLowerCase();
        const performerIdModified = task.performerId.toLowerCase();
        const createdAtModified = task.createdAt.toLowerCase();
        const searchTerm = this.filter.toLowerCase();
        if (
          idModified.includes(searchTerm) ||
          projectIdModified.includes(searchTerm) ||
          ownerEmailModified.includes(searchTerm) ||
          systemModified.includes(searchTerm) ||
          complexityModified.includes(searchTerm) ||
          performerIdModified.includes(searchTerm) ||
          createdAtModified.includes(searchTerm) ||
          searchTerm == ""
        ) {
          this.filteredTasks.push(task);
        }
      });

      if (this.filteredTasks != null) {
        let filteredTaskIDs = [];
        this.filteredTasks.forEach((filteredTask) => {
            filteredTaskIDs.push(filteredTask.id.toString());
        });

        [...all_task_TDs].forEach((taskTD) => {
            if (!filteredTaskIDs.includes(taskTD.innerHTML)) {
              taskTD.parentElement.classList.add("hidden-element");
            } else {
              taskTD.parentElement.classList.remove("hidden-element");
            }
        });
      }
    },
    async addTask() {
      await this.$router.push('/task/new');
    }

  },
  created: function () {
    this.getAllData();
  },
};
</script>


<style>
.hidden-element {
  display: none;
}
.search {
  margin: 10px;
  text-align: center;
}
#task_search {
  width: 50%;
}
.highlight {
  background-color: yellow;
}

</style>

