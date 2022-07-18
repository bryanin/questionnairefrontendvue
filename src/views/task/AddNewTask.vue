<template>
  <div class="add-new-task container-xxl">
    <h1>Новая задача</h1>
    <form @submit.prevent="submit" class="row g-3">
      <p>Какую систему проектируем?</p>
      <div class="col-md-3">
        <select v-model="selectedSystem" @change="loadQuestionnaire">
          <option v-for="system in systems" :key="system.id" v-bind:value="system.title">{{system.description}}</option>
        </select>
        <!-- <span>Выбрано: {{selectedSystem}}</span> -->
      </div>
      <div class="col-12" v-if="selectedQuestionnaire">
        <div v-for="item in selectedQuestionnaire.content" :key="item.id">
            {{ item.question }} 
            <div v-if="item.answer.simpleAnswer != ''">
              <input type="text" v-model="item.answer.simpleAnswer" class="form-control" />
            </div>
            <div v-else>
                <div v-for="miniItem in item.answer.multipleAnswer" :key="miniItem.id">
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-10"> {{ miniItem.question }} </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-10">
                      <input type="text" v-model="miniItem.answer" class="form-control" />
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
      <div v-else>Loading ... </div>
      <div class="col-12">
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </div>
    </form>
  </div>
</template>

<script>
const baseURL = "http://localhost:8080/api/v1";
export default {
  data() {
    return {
      selectedSystem: null,
      systems: [
        {"title" : "SOT", "description" : "Система видеонаблюдения"}, 
        {"title" : "SPS", "description" : "Система пожарной сигнализации"}, 
        {"title" : "APPZ", "description" : "Автоматизация противопожарной защиты"}, 
        {"title" : "AUPT", "description" : "Автоматическая установка пожаротушения"}, 
        {"title" : "SOUE", "description" : "Система оповещения и управления эвакуацией"}, 
        {"title" : "SOTS", "description" : "Система охранно-тревожной сигнализации"}, 
        {"title" : "SKUD", "description" : "Система контроля и управления доступом"}
        ],
      selectedQuestionnaire: null,
      questionnaires: [],

    };
  },
  methods: {
    async loadQuestionnaire() {
        this.questionnaires.forEach(questionnaire => {
        const questionnaireToJson = JSON.parse(questionnaire);
        if (questionnaireToJson.system == this.selectedSystem) {
            this.selectedQuestionnaire = questionnaireToJson;
        };
      });
    },
    async getAllQuestionnaires() {
      try {
        const questionnairesRes = await fetch(`${baseURL}/questionnaire`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.Authorization,
          },
          credentials: "include",
          body: null,
        });
        if (!questionnairesRes.ok) {
          if (questionnairesRes.status == 401) {
            console.log('401 Error: You should login');
            this.$router.push('/login');
          }
          const message = `An error has occured: ${questionnairesRes.status} - ${questionnairesRes.statusText}`;
          console.log(message);
        }
        const questionnairesData = await questionnairesRes.json();
        this.questionnaires = questionnairesData;
                
      } catch (err) {
        this.tasks = err.message;
      }

    },
    async submit() {
      const id = this.$route.params.id;
      const task = {
        "id" : null,
        "ownerEmail" : JSON.parse(atob(localStorage.Authorization.split('.')[1])).sub,
        "status" : "IN_HEAP",
        "complexity" : "LEVEL_1",
        "projectId" : id, 
        "commentList" : null,
        "system" : this.selectedQuestionnaire.system,
        "questionnaire" : JSON.stringify(this.selectedQuestionnaire),
        "performerId" : null,
        "createdAt" : null
      };
      await fetch(`${baseURL}/task/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: JSON.stringify(task),
      }).catch(err => {
        console.log(err.message);
      });
      
      await alert('Задача создана');
      await this.$router.push(`/project/${id}/`);
    }
  },
  created: function () {
    this.getAllQuestionnaires();
  },

}
</script>

<style>

</style>