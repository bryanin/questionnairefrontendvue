<template>
  <div class="employeeDetails container-xxl">
    <div class="employee" v-if="employee">
      <h1 class="title">{{ employee.lastName }} {{ employee.firstName }}</h1>
      <div class="employee">
        <dl class="row">
          <dt class="col-sm-3">ID</dt>
          <dd class="col-sm-9">
            {{ employee.id }}
          </dd>
          <dt class="col-sm-3">Email</dt>
          <dd class="col-sm-9">
            {{ employee.email }}
          </dd>
          <dt class="col-sm-3">Фамилия</dt>
          <dd class="col-sm-9">
            {{ employee.lastName }}
          </dd>
          <dt class="col-sm-3">Имя</dt>
          <dd class="col-sm-9">
            {{ employee.firstName }}
          </dd>
          <dt class="col-sm-3">Телефон</dt>
          <dd class="col-sm-9">
            {{ employee.phone }}
          </dd>
          <dt class="col-sm-3">Компания</dt>
          <dd class="col-sm-9">
            {{ employee.companyTitle }}
          </dd>
          <dt class="col-sm-3">Должность</dt>
          <dd class="col-sm-9">
            {{ employee.positionTitle }}
          </dd>
          <dt class="col-sm-3">Статус</dt>
          <dd class="col-sm-9">
            {{ employee.accessStatus }}
          </dd>
        </dl>
      </div>
      <div class="update-buttons">
        <button
          type="button"
          class="btn btn-primary float-right me-right"
          @click="updateEmployee"
        >
          Редактировать учетную запись
        </button>
        <!-- <button
          type="button"
          class="btn btn-danger float-right me-right"
          @click="deleteEmployee"
        >
          Удалить учетную запись
        </button> -->
      </div>
      <br />

      <h3>Задачи, связанные с пользователем</h3>

      <br />
      <div class="table-responsive-md" v-if="tasks != null">
        <table class="table table-sm table-striped table-bordered table-hover">
          <thead class="table-light">
            <th>ID</th>
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

    <div v-else>Loading...</div>

    
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "EmployeeDetails",
  data() {
    return {
      employee: null,
      tasks: [],
    };
  },
  methods: {
    async getEmployeeById() {
      const id = this.$route.params.id;
      if (id) {
        try {
          const employeeRes = await fetch(`${baseURL}/employee/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!employeeRes.ok) {
            const message = `An error has occured: ${employeeRes.status} - ${employeeRes.statusText}`;
            throw new Error(message);
          }
          const employeeData = await employeeRes.json();
          this.employee = employeeData;
          this.getTasks();
        } catch (err) {
          this.employee = err.message;
        }
      }
    },
    async getTasks() {
      const id = this.$route.params.id;
      try {
        const taskRes = await fetch(`${baseURL}/employee/${id}/task?owner=true&performer=true`, {
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
            console.log("401 Error: You should login");
            this.$router.push("/login");
          }
          const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
          console.log(message);
        }
        const taskData = await taskRes.json();
        this.tasks = taskData;
        // if (this.tasks != null) {
        //   this.tasks.forEach((task) => {
        //     task.createdAt = new Date(task.createdAt).toLocaleDateString(
        //       "ru-RU"
        //     );
        //   });
        // }
      } catch (err) {
        this.tasks = err.message;
      }
    },
    
    async updateEmployee() {
      const id = this.$route.params.id;
      await this.$router.push(`/employee/${id}/edit`);
    },
    // async deleteEmployee() {
    //   const areYouSure = confirm("Вы уверены, что хотите удалить пользователя?");
    //   if (areYouSure) {
    //     const id = this.$route.params.id;
    //     if (id) {
    //       try {
    //         const deleteEmployeeRes = await fetch(`${baseURL}/employee/${id}`, {
    //           method: "DELETE",
    //           headers: {
    //             "Content-type": "application/json",
    //             Authorization: localStorage.Authorization,
    //           },
    //           credentials: "include",
    //           body: null,
    //         });
    //         if (!deleteEmployeeRes.ok) {
    //           if (deleteEmployeeRes.status == 401) {
    //             console.log("401: Unauthorized / Авторизуйтесь");
    //             this.$router.push("/login");
    //           }
    //           if (deleteEmployeeRes.status == 403) {
    //             console.log("403: Forbidden / Доступ запрещён");
    //           }
    //           const message = `An error has occured: ${deleteEmployeeRes.status} - ${deleteEmployeeRes.statusText}`;
    //           console.log(message);
    //         }
    //         console.log(`Пользователь ${id} удален`);
    //         await alert("Пользователь удален");
    //         await this.$router.push("/employee");
    //       } catch (err) {
    //         this.employee = err.message;
    //       }
    //     }
    //   }
    // },
    
  },
  created: function () {
    this.getEmployeeById();
  },
};
</script>

<style>
.title {
  text-align: center;
}
.form-switch {
  float: right;
}
</style>