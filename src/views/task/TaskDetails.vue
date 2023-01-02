<template>
  <div class="taskDetails container-xxl">
    <div class="task" v-if="task">
      <h1>Задача №{{ task.id }}</h1>
      <div class="task">
        <dl class="row">
          <dt class="col-sm-3">Проект</dt>
          <dd class="col-sm-9">
            {{ project.title }} 
          </dd>
          <dt class="col-sm-3">Инициатор</dt>
          <dd class="col-sm-9">
            {{ task.ownerEmail }}
          </dd>
          <dt class="col-sm-3">Исполнитель</dt>
          <dd class="col-sm-9">
            <div v-if="task.performerId">
              {{ task.performerId }}
            </div>
            <div v-else>Не назначен</div>
          </dd>
          <dt class="col-sm-3">Статус задачи</dt>
          <dd class="col-sm-9">
            {{ task.status }}
          </dd>
          <dt class="col-sm-3">Объем работы</dt>
          <dd class="col-sm-9">
            {{ task.stageList }}
          </dd>
          <dt class="col-sm-3">Дата создания</dt>
          <dd class="col-sm-9">
            {{ task.createdAt }}
          </dd>
          <dt class="col-sm-3">Описание</dt>
          <dd class="col-sm-9">
            <table
              class="table table-sm table-striped table-bordered table-hover"
            >
              <thead class="table-light">
                <th>Вопрос</th>
                <th>Ответ</th>
              </thead>
              <tbody class="table-striped">
                <tr
                  v-for="item in JSON.parse(this.task.questionnaire).content"
                  :key="item.id"
                >
                  <td>{{ item.question }}</td>
                  <td>
                    <div v-if="item.answer.simpleAnswer != ''">
                      {{ item.answer.simpleAnswer }}
                    </div>
                    <div v-else>
                      <div
                        v-for="miniItem in item.answer.multipleAnswer"
                        :key="miniItem.id"
                      >
                        {{ miniItem.question }} <br />
                        {{ miniItem.answer }}
                        <hr />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </dd>
          <dt class="col-sm-3">Комментарии</dt>
          <dd class="col-sm-9">
            <!-- {{ task.commentList }} -->
            <table
              class="table table-sm table-striped table-bordered table-hover"
            >
              <thead class="table-light">
                <th>Отправитель</th>
                <th>Сообщение</th>
                <th>Ссылка</th>
                <th>Дата создания</th>
              </thead>
              <tbody class="table-striped">
                <tr v-for="item in this.task.commentList" :key="item.id">
                  <td>{{ item.authorEmail }}</td>
                  <td>{{ item.message }}</td>
                  <td>{{ item.filePath }}</td>
                  <td>{{ item.createdAt }}</td>
                </tr>
              </tbody>
            </table>
          </dd>
        </dl>
      </div>

      <div>
        <form @submit.prevent="submit">
          <p>
            Добавить комментарий
            <input type="text" v-model="messageText" />
            <input
              type="checkbox"
              id="attach"
              name="attach"
              v-model="addAttach"
            />
            <label for="attach"> Добавить файлы </label>
          </p>
          <div v-if="addAttach">
            <p>
              Ссылка на файлы
              <input type="text" v-model="messageAttach" />
            </p>
          </div>
          <button
            type="submit"
            class="btn btn-primary float-right me-right"
            @click="addComment"
          >
            Отправить комментарий
          </button>
        </form>
      </div>

      <hr />
      <div>
        <h4>Управление задачей</h4>

        <div class="accordion accordion-flush" id="accordionFlush">
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Необходимо внести корректировки в задачу?
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlush"
            >
              <div class="accordion-body">
                <div>
                  Изменить уровень сложности, состав документации, даты,
                  исполнителя и т.п.?
                </div>
                <button
                  type="button"
                  class="btn btn-primary float-right me-right"
                  @click="updateTask"
                >
                  Редактировать задачу
                </button>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                Изменить статус задачи
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlush"
            >
              <div class="accordion-body">
                <div>
                  В зависимости от текущего статуса задачи можно управлять
                  задачей
                </div>
                <button
                  type="button"
                  class="btn btn-primary float-right me-right"
                  @click="updateTaskStatus"
                >
                  Обновить статус задачи
                </button>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                Отправить клиенту опросный лист
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlush"
            >
              <div class="accordion-body">
                Для того, чтобы отправить email клиенту, вы можете либо указать
                его почтовый адрес вручную, либо использовать предлагаемые email
                <label
                  >Укажите email клиента<input
                    type="text"
                    v-model="recipient"
                    class="form-control"
                /></label>
                <button
                  type="button"
                  class="btn btn-success float-right me-right"
                  @click="sendSimpleEmail"
                >
                  Отправить опросный лист клиенту
                </button>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                Удалить задачу
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                Вы действительно хотите удалить задачу? Это действие нельзя
                отменить
                <button
                  type="button"
                  class="btn btn-primary float-right me-right"
                  @click="updateTaskStatus"
                >
                  Обновить статус задачи
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  name: "taskDetails",
  data() {
    return {
      task: null,
      project: null,
      recipient: "",
      messageBody: "",
      subject: "",
      addAttach: false,
      messageText: "",
      messageAttach: "",
      showTaskStatus: false,
    };
  },
  methods: {
    async sendSimpleEmail() {
      const email = {
        recipient: this.recipient,
        messageBody:
          "Добрый день! \nПросим Вас заполнить опросный лист: http://google.com \nПароль для входа: 1234 \n\n С уважением, проектная поддержка Луис+",
        subject: "Опросный лист",
      };
      try {
        const emailRes = await fetch(`${baseURL}/email/simple`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: JSON.stringify(email),
        });
        if (!emailRes.ok) {
          const message = `An error has occured: ${emailRes.status} - ${emailRes.statusText}`;
          throw new Error(message);
        }
        await alert("Опросный лист отправлен");
        await this.$router.push(`/task/`);
      } catch (err) {
        console.log(err.message);
      }
    },
    async getDataById() {
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
          this.task.createdAt = new Date(taskData.createdAt).toLocaleDateString(
            "ru-RU"
          );
          
        } catch (err) {
          this.task = err.message;
        }
        try {
          const taskCommentRes = await fetch(`${baseURL}/task/${id}/comment`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!taskCommentRes.ok) {
            const message = `An error has occured: ${taskCommentRes.status} - ${taskCommentRes.statusText}`;
            throw new Error(message);
          }
          const taskCommentData = await taskCommentRes.json();
          this.task.commentList = taskCommentData;
          this.task.commentList.forEach((element) => {
            element.createdAt = new Date(element.createdAt).toLocaleDateString(
              "ru-RU"
            );
          });
        } catch (err) {
          this.task = err.message;
        }
        try {
          const projectRes = await fetch(`${baseURL}/project/${id}`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: localStorage.Authorization,
            },
            credentials: "include",
            body: null,
          });
          if (!projectRes.ok) {
            const message = `An error has occured: ${projectRes.status} - ${projectRes.statusText}`;
            throw new Error(message);
          }
          const projectResData = await projectRes.json();
          this.project = projectResData;
          
        } catch (err) {
          this.project = err.message;
        }
      }
    },
    async updateTask() {
      const id = this.$route.params.id;
      await this.$router.push(`/task/${id}/edit`);
    },
    async updateTaskStatus() {
      const id = this.$route.params.id;
    },
    async deleteTask() {
      const areYouSure = confirm("Вы уверены, что хотите удалить задачу?");
      if (areYouSure) {
        const id = this.$route.params.id;
        if (id) {
          try {
            const deleteTaskRes = await fetch(`${baseURL}/task/${id}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
                Authorization: localStorage.Authorization,
              },
              credentials: "include",
              body: null,
            });
            if (!deleteTaskRes.ok) {
              if (taskRes.status == 401) {
                console.log("401: Unauthorized / Авторизуйтесь");
                this.$router.push("/login");
              }
              if (taskRes.status == 403) {
                console.log("403: Forbidden / Доступ запрещён");
              }
              const message = `An error has occured: ${deleteTaskRes.status} - ${deleteTaskRes.statusText}`;
              console.log(message);
            }
            console.log(`Задача ${id} удалена`);
            await alert("Задача удалена");
            await this.$router.push("/task");
          } catch (err) {
            this.task = err.message;
          }
        }
      }
    },
    async addComment() {
      const baseURL = "http://localhost:8080/api/v1";
      const id = this.$route.params.id;

      let comment = {
        id: null,
        authorEmail: JSON.parse(atob(localStorage.Authorization.split(".")[1]))
          .sub,
        createdAt: null,
        filePath: this.messageAttach,
        message: this.messageText,
        taskId: id,
      };

      try {
        const taskCommentRes = await fetch(`${baseURL}/task/${id}/comment`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: JSON.stringify(comment),
        });
        if (!taskCommentRes.ok) {
          const message = `An error has occured: ${taskCommentRes.status} - ${taskCommentRes.statusText}`;
          throw new Error(message);
        }
        const taskCommentData = await taskCommentRes.json();
        this.task.commentList = taskCommentData;
        this.task.commentList.forEach((element) => {
          element.createdAt = new Date(element.createdAt).toLocaleDateString(
            "ru-RU"
          );
        });
      } catch (err) {
        this.task = err.message;
      }
      // console.log(this.task.commentList);

      this.messageText = "";
      this.messageAttach = "";
    },
  },
  created: function () {
    this.getDataById();
  },
};
</script>

<style>
</style>