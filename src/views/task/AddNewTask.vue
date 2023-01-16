<template>
  <div class="add-new-task container-xxl">
    <h1>Новая задача</h1>
    <form @submit.prevent="submit" class="row g-3">
      <h4>Какую систему проектируем?</h4>
      <div class="col-md-3">
        <select class="form-select form-select-lg mb-3" v-model="selectedSystem.title" @change="loadQuestionnaire">
          <option v-for="system in systems" :key="system.title" v-bind:value="system.title">{{system.description}}</option>
        </select>
      </div>
      <div class="col-12" v-if="selectedQuestionnaire">
        <div v-for="item in selectedQuestionnaire.content" :key="item.id">
            {{ item.question }} 
            <div class="form-check" v-if="item.answer.simpleAnswer != ''">
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
      <div v-else>... </div>
      <h4>Какой объем работ?</h4>
      <div class="col-12" v-for="stage in stageSet" :key="stage">
          <input type="checkbox" :id="stage.title" :value="stage.title" v-model="selectedStages">
          <label :for="stage.title">{{ stage.description }}  </label>
      </div>
      <h4>Укажите желаемую дату выполнения задачи</h4>
      <div class="col-12">
          <label for="desiredDueDateInput"></label>
          <input type="date" id="desiredDueDateInput" v-model="desiredDueDate">
      </div>
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
      selectedSystem: {
        title: "", description: ""
      },
      systems: [
        {title : "SOT", description : "Система видеонаблюдения"}, 
        {title : "SPS", description : "Система пожарной сигнализации"}, 
        {title : "APPZ", description : "Автоматизация противопожарной защиты"}, 
        {title : "AUPT", description : "Автоматическая установка пожаротушения"}, 
        {title : "SOUE", description : "Система оповещения и управления эвакуацией"}, 
        {title : "SOTS", description : "Система охранно-тревожной сигнализации"}, 
        {title : "SKUD", description : "Система контроля и управления доступом"}
        ],
      selectedStages: [],
      stageSet: [
        {title : "SPECIFICATION", description : "Спецификация"},
        {title : "ARRANGEMENT_OF_EQUIPMENT", description : "Расстанововка на планах"},
        {title : "STRUCTURAL_SCHEME", description : "Структурная схема"},
        {title : "EXPLANATORY_NOTE", description : "Пояснительная записка"},
        {title : "ACOUSTIC_CALCULATION" , description : "Акустический расчет"},
        {title : "CONNECTION_SCHEME", description : "Схема подключений"},
        {title : "POWER_SUPPLY_CALCULATION", description : "Расчет источников электропитания"},
        {title : "AXONOMETRIC_SCHEME" , description : "Аксонометрическая схема"},
        {title : "CABLE_LOCATION_CABLE", description : "Кабельный журнал"},
        {title : "PROJECT_DOCUMENTATION" , description : "Стадия П"},
        {title : "WORKING_DOCUMENTATION" , description : "Стадия Р"}
        ],
      selectedQuestionnaire: null,
      questionnaires: [],
      desiredDueDate: null,
    };
  },
  methods: {
    async loadQuestionnaire() {
        console.log("loadQuestionnaire");
        this.questionnaires.forEach(questionnaire => {
        const questionnaireToJson = JSON.parse(questionnaire);
        if (questionnaireToJson.system == this.selectedSystem.title) {
            this.selectedQuestionnaire = questionnaireToJson;
            console.log("this.selectedQuestionnaire" + this.selectedQuestionnaire);
        };
      });
    },
    async getAllQuestionnaires() {
      console.log("getAllQuestionnaires");
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
      console.log("submit");
      console.log("this.selectedQuestionnaire.system.title " + this.selectedQuestionnaire.system.title);
      const id = this.$route.params.id;
      let formattedDesiredDueDate = null;
      if(this.desiredDueDate != null) {
        this.desiredDueDate = new Date(this.desiredDueDate);
        let dd = this.desiredDueDate.getDate();
        let mm = this.desiredDueDate.getMonth() + 1;
        if(mm < 10) {
          mm = "0" + mm
        }
        let yy = this.desiredDueDate.getFullYear();
        formattedDesiredDueDate = dd + "." + mm + "." + yy;
      } else {
        this.desiredDueDate = new Date(this.desiredDueDate);
        formattedDesiredDueDate = this.desiredDueDate;
      }
      const task = {
        "id" : null,
        "ownerEmail" : JSON.parse(atob(localStorage.Authorization.split('.')[1])).sub,
        "ownerLastName": null,
        "ownerFirstName": null,
        "status" : "NEW",
        "statusDescription": null,
        "complexity" : "LEVEL_1",
        "projectId" : id, 
        "projectTitle": null,
        "commentList" : null,
        "securitySystem" : this.selectedSystem.title,
        "questionnaire" : JSON.stringify(this.selectedQuestionnaire),
        "performerEmail" : null,
        "performerLastName": null,
        "performerFirstName": null,
        "stageSet": this.selectedStages,
        "createdAt" : null,
        "guaranteedDueDate": null,
        "desiredDueDate": formattedDesiredDueDate,
        "actualLaunchDate": null,
        "estimatedCompletionDate": null,
        "dateOfActualCompletion": null
      };
      try {
        const taskRes = await fetch(`${baseURL}/task/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: JSON.stringify(task),
      });
      if (!projectFilesRes.ok) {
          const message = `An error has occured: ${projectFilesRes.status} - ${projectFilesRes.statusText}`;
          throw new Error(message);
        }
      const taskResData = await taskRes.json();
      this.task = taskResData;
      alert('Задача создана');
      } catch (err) {
        this.task = err.message;
      }
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