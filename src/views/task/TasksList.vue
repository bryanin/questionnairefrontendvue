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

    <div class="my-otpions">
      <div class="my-tasks">
        <input 
        type="checkbox" 
        id="my-tasks" 
        name="my-tasks" 
        :checked="myTasksFilter"> 
        <label for="my-tasks">Мои задачи</label>
      </div>
      <div class="actual-tasks">
        <input 
        type="checkbox" 
        id="actual-tasks" 
        name="actual-tasks" 
        :checked="actualTasksFilter"> 
        <label for="actual-tasks">Только актуальные задачи</label>
      </div>
    </div>
    <br>

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
          <th>Объем задачи</th>
          <th>Дата создания</th>
          <th></th>
        </thead>
        <tbody class="table-striped">
          <tr v-for="task in tasks" :key="task.id">
            <td class="task">{{ task.id }}</td>
            <td>{{ task.projectId }}</td>
            <td>{{ task.ownerLastName }} {{ task.ownerFirstName }}</td>
            <td>{{ task.securitySystemDescription }}</td>
            <td>{{ task.complexityDescription }}</td>
            <td>
              <div v-if="task.performerLastName">
                {{ task.performerLastName }} {{ task.performerFirstName }}
                </div>
                <div v-else>Не назначен</div>
            </td>
            <td>{{ task.statusDescription }}</td>
            <td>{{ task.stageSetDescription }}</td>
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
      tasks: [],
      users: [],
      filter: "",
      filteredTasks: [],
      actualTasksFilter: true,
      myTasksFilter: true,
    };
  },
  methods: {
    async getTasks() {
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
          console.log(taskData);
        }
        const taskData = await taskRes.json();
        this.tasks = taskData;
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
        const ownerLastNameModified = task.ownerLastName.toLowerCase();
        const ownerFirstNameModified = task.ownerFirstName.toLowerCase();
        const securitySystemDescriptionModified = task.securitySystemDescription.toLowerCase();
        const complexityDescriptionModified = task.complexityDescription.toLowerCase();
        //const performerLastNameModified = task.performerLastName.toLowerCase();
        //const performerFirstNameModified = task.performerFirstName.toLowerCase();
        const stageSetDescriptionModified = task.stageSetDescription.toString().toLowerCase();
        const createdAtModified = task.createdAt.toLowerCase();
        const searchTerm = this.filter.toLowerCase();
        if (
          idModified.includes(searchTerm) ||
          projectIdModified.includes(searchTerm) ||
          ownerLastNameModified.includes(searchTerm) ||
          ownerFirstNameModified.includes(searchTerm) ||
          securitySystemDescriptionModified.includes(searchTerm) ||
          complexityDescriptionModified.includes(searchTerm) ||
          //performerLastNameModified.includes(searchTerm) ||
          //performerFirstNameModified.includes(searchTerm) ||
          stageSetDescriptionModified.includes(searchTerm) ||
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
    this.getTasks();
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

