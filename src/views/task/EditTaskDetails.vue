<template>
  <div class="taskDetails container-xxl">
    <div class="task" v-if="task">
      <h1>Задача №{{ task.id }}</h1>
      <br >
      <div class="task">
        <form @submit.prevent="onSubmit" class="row g-3">
          <div>
            <p>Инициатор: {{ task.ownerLastName }} {{ task.ownerFirstName }} </p>
          </div>
          <div class="col-12">
            <label for="inputStatus" class="form-label">Статус: </label>
            <select id="inputStatus" v-model="selectedStatus">
                <option v-for="(status, key) in allAvailableTaskStatuses" :key="key">{{ status }}</option>
            </select>
          </div>
          <div class="col-12">
            <label for="inputStatus" class="form-label">Сложность: </label>
            <select id="inputComplexity" v-model="selectedComplexity">
              <option value="LEVEL_1"> * </option>
              <option value="LEVEL_2"> ** </option>
              <option value="LEVEL_3"> *** </option>
              <option value="LEVEL_4"> **** </option>
              <option value="LEVEL_5"> ***** </option>
            </select>
          </div>
          <div>
            <p>Проектируемая система: {{ task.securitySystemDescription }}  </p>
          </div>
          <div class="col-12">
            <p>Опросный лист</p>
            <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuestionnaire" aria-expanded="false" aria-controls="collapseQuestionnaire">
              Посмотреть опросный лист
            </button>
            <div class="collapse" id="collapseQuestionnaire">
              <div class="card card-body">
                <table class="table table-sm table-striped table-bordered table-hover">
                  <thead class="table-light">
                    <th>Вопрос</th>
                    <th>Ответ</th>
                  </thead>
                  <tbody class="table-striped">
                    <tr v-for="item in JSON.parse(this.task.questionnaire).content" :key="item.id">
                      <td>{{ item.question }}</td>
                      <td>
                        <div v-if="item.answer.simpleAnswer != ''">
                          {{ item.answer.simpleAnswer }}
                        </div>
                        <div v-else>
                        <div v-for="miniItem in item.answer.multipleAnswer" :key="miniItem.id">
                          {{ miniItem.question }} <br />
                          {{ miniItem.answer }}
                          <hr />
                        </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <p>Проект: {{ task.projectTitle }}</p>
          </div>
          <div class="col-12">
            <label for="inputPerformer" class="form-label">Исполнитель</label>
            <select id="inputPerformer" v-model="selectedPerformer">
                    <option v-for="(performer, key) in performers" :key="key">{{ performer.lastName }} {{ performer.firstName }}</option>
            </select>
          </div>
          <div>
            <p>Объем работы: {{ task.stageSetDescription }} </p>
          </div>
          <div>
            Дата создания задачи: {{ task.createdAt }} 
          </div>
          <!-- НЕ РАБОТАЕТ, ИСПРАВИТЬ-->
          <div class="col-12">
            <label for="desiredDueDateInput">Желаемая дата выполнения: {{ task.desiredDueDate }}</label>
            <input type="date" id="desiredDueDateInput" :value="desiredDueDate" @change="formatDesiredDueDate">
          </div>
          <div class="col-12">
            <label for="guaranteedDueDateInput">Назначенная дата выполнения: {{ task.guaranteedDueDate }}</label>
            <input type="date" id="guaranteedDueDateInput" v-model="task.guaranteedDueDate">
          </div>
          <div class="col-12">
            <label for="actualLaunchDateInput">Дата выдачи в работу: {{ task.actualLaunchDate }}</label>
            <input type="date" id="actualLaunchDateInput" v-model="task.actualLaunchDate">
          </div>
          <div class="col-12">
            <label for="estimatedCompletionDateInput">Предполагаемая дата выполнения: {{ task.estimatedCompletionDate }}</label>
            <input type="date" id="estimatedCompletionDateInput" v-model="task.estimatedCompletionDate">
          </div>
          <div class="col-12" >
            <label for="dateOfActualCompletionInput">Дата завершения: {{ task.dateOfActualCompletion }}</label>
            <input type="date" id="dateOfActualCompletionInput" v-model="task.dateOfActualCompletion">
          </div>



          <div class="col-12">
            <button type="submit" class="btn btn-primary" @click="submit">
              Сохранить
            </button>
          </div>
        </form> 
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "EditTaskDetails",
  data() {
    return {
      task: null,
      selectedComplexity: null,
      selectedStatus: null,
      allAvailableTaskStatuses: [],
      selectedPerformer: null,
      performers: [],
      employees: [],
      desiredDueDate: null,
    };
  },
  methods: {
    formatDesiredDueDate (event) {
      // Не работает, исправить!
        let formattedDate = null;
        let date = event.target.desiredDueDate;
        console.log("event.target.desiredDueDate " + event.target.desiredDueDate);
        console.log("date before " + date);
        date = new Date(date);
        console.log("date after " + date);
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        if(mm < 10) {mm = "0" + mm}
        let yy = date.getFullYear();
        formattedDate = dd + "." + mm + "." + yy;
        date = formattedDate;
        console.log("formattedDate " + formattedDate);
        this.task.desiredDueDate = formattedDate;
        return formattedDate;
      },
    async getTaskById() {
      const id = this.$route.params.id;
      if (id) {
        try {
          const taskRes = await fetch(`${baseURL}/task/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!taskRes.ok) {
            const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
            throw new Error(message);
          }
          const taskData = await taskRes.json();
          this.task = taskData;
        } catch (err) {
          this.task = err.message;
        }
      }
    },
    async getAllAvailableTaskStatuses() {
      const id = this.$route.params.id;
        if (id) {
          try {
            const taskStatusRes = await fetch(`${baseURL}/task/${id}/status`, {
              method: "GET",
              headers: {
                "Content-type": "application/json",
                Authorization: localStorage.Authorization,
              },
              credentials: "include",
              body: null,
            });
            if (!taskStatusRes.ok) {
              if (taskStatusRes.status == 401) {
                console.log("401: Unauthorized / Авторизуйтесь");
                this.$router.push("/login");
              }
              if (taskStatusRes.status == 403) {
                console.log("403: Forbidden / Доступ запрещён");
              }
              const message = `An error has occured: ${taskStatusRes.status} - ${taskStatusRes.statusText}`;
              console.log(message);
            } 
            const taskStatusResData = await taskStatusRes.json();
            this.allAvailableTaskStatuses = taskStatusResData;
          } catch (err) {
            this.task = err.message;
          }
      }
    },
    async getEmployees() {
      try {
        const employeeRes = await fetch(`${baseURL}/employee`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!employeeRes.ok) {
          if (employeeRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${employeeRes.status} - ${employeeRes.statusText}`;
          console.log(message);
        }
        const employeeData = await employeeRes.json();
        this.employees = employeeData;
        this.employees.forEach(employee => {
          if(
            employee.position == "HEAD_OF_DESIGN_DEPARTMENT" ||
            employee.position == "SENIOR_DESIGNER" ||
            employee.position == "MIDDLE_DESIGNER" ||
            employee.position == "JUNIOR_DESIGNER"
          ) {
            this.performers.push(employee);
          }
        });
      } catch (err) {
        this.employees = err.message;
      };
    },
    async submit() {
      const baseURL = "http://localhost:8080/api/v1";
      const id = this.$route.params.id;
      //Переписать! Некорректно работает
      // function formatDate(date) {
      //   let formattedDate = null;
      //   if(date != null) {
      //     if(date instanceof Date) {
      //       console.log("date before " + date);
      //       date = new Date(date);
      //       console.log("date after " + date);
      //       let dd = date.getDate();
      //       let mm = date.getMonth() + 1;
      //       if(mm < 10) {mm = "0" + mm}
      //       let yy = date.getFullYear();
      //       formattedDate = dd + "." + mm + "." + yy;
      //       date = formattedDate;
      //       console.log("formattedDate " + formattedDate);
      //     }
      //   } 
      // };
      // Переписать! Некорректно работает
      // this.task.desiredDueDate = formatDate(this.task.desiredDueDate);
      // this.task.guaranteedDueDate = formatDate(this.task.guaranteedDueDate);
      // this.task.actualLaunchDate = formatDate(this.task.actualLaunchDate);
      // this.task.estimatedCompletionDate = formatDate(this.task.estimatedCompletionDate);
      // this.task.dateOfActualCompletion = formatDate(this.task.dateOfActualCompletion);
    
      if (id) {
        try {
          const taskRes = await fetch(`${baseURL}/task/${id}`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: JSON.stringify(this.task),
          });
          if (!taskRes.ok) {
            const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
            throw new Error(message);
          }
        } catch (err) {
          this.task = err.message;
        }
        this.$router.push('/task');
      }
    },
  },
  created: function () {
    this.getTaskById();
    this.getAllAvailableTaskStatuses();
    this.getEmployees();
  },
};
</script>

<style>
</style>