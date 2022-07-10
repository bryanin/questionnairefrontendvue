<template>
  <div class="add-new-task container-xxl">
    <h1>Новая задача</h1>
    <form @submit.prevent="submit" class="row g-3">
      <p>Какую систему проектируем?</p>
      <div class="col-md-3">
        <select v-model="selectedSystem" @change="loadQuestionnaire">
          <option v-for="system in systems" :key="system.id" v-bind:value="system.title">{{system.description}}</option>
        </select>
        <span>Выбрано: {{selectedSystem}}</span>
      </div>
      <div class="col-12" v-if="selectedQuestionnaire">
        <div v-for="item in selectedQuestionnaire.content" :key="item.id">
          <label>
            {{ item.question }} 
            <div v-if="item.answer.simpleAnswer != null"> <input type="text" v-model="item.answer.simpleAnswer" class="form-control" /> </div>
            <div v-else> <input type="text" v-model="item.answer.multipleAnswer" class="form-control" /></div>
          </label>
         
          
          
          
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
      //totalQuestionnaire: null,
      selectedQuestionnaire: null,
      questionnaires: [
        {
    "system" : "SOT",
    "content": [
        {
            "question": "Какой тип системы ВН требуется организовать на объекте?",
            "answer": {
                "simpleAnswer": "Цифровой или аналоговый",
                "multipleAnswer": []
            }
        },
        {
            "question": "Существует ли минимально допустимое разрешение (МП)?",
            "answer": {
                "simpleAnswer": "Нет",
                "multipleAnswer": []
            }
        },
        {
            "question": "Камеры для внутреннего наблюдения установить в помещениях:",
            "answer": {
                "simpleAnswer": "Холлы, коридоры, входы на этаж и в здание",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите особый температурный режим в местах установки камер (например, отметьте, какие помещения неотапливаемые) /дополнительные требования к оборудованию (например, взрывозащищенное оборудование)",
            "answer": {
                "simpleAnswer": "Нет",
                "multipleAnswer": []
            }
        },
        {
            "question": "Способ прокладки кабельных линий к камерам в помещениях",
            "answer": {
                "simpleAnswer": "В гофре и кабель-канале",
                "multipleAnswer": []
            }
        },
        {
            "question": "Камеры для наружного наблюдения установить для наблюдения за объектами",
            "answer": {
                "simpleAnswer": "По периметру здания и на въезде на территорию",
                "multipleAnswer": []
            }
        },
        {
            "question": "Способ прокладки кабельных линий к уличным камерам",
            "answer": {
                "simpleAnswer": "Воздушные линии (с применением троса), крепление к фасаду и столбам",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите, какие задачи системы видеонаблюдения должны выполняться",
            "answer": {
                "simpleAnswer": "",
                "multipleAnswer": [
                    {
                        "question": "Обнаружение - позволяет определить с высокой степенью достоверности присутствие того или иного объекта в поле зрения камеры наблюдения",
                        "answer": "По периметру здания"
                    },
                    {
                        "question": "Распознавание - позволяет с высокой степенью уверенности заявить является ли текущий случай единичным или он уже был замечен ранее (тот же объект или другой)",
                        "answer": "Остальные помещения"
                    },
                    {
                        "question": "Идентификация - детали должны быть достаточно различимы для идентификации личности человека вне всякого сомнения",
                        "answer": "На входах в здание"
                    }
                ]
            }
        },
        {
            "question": "Необходимы ли функции видеоаналитики",
            "answer": {
                "simpleAnswer": "",
                "multipleAnswer": [
                    {
                        "question": "Распознавание лиц (если требуется, укажите количество каналов и объем базы лиц)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Распознавание государственных регистрационных знаков транспортных средств (если требуется, укажите количество каналов и скорость движения транспортного средства)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Распознавание марки и модели транспортного средства",
                        "answer": "Нет"
                    },
                    {
                        "question": "Детектор нарушений ПДД (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Детектор ношения маски (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Детектор дыма и огня (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Трекер объектов (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Нейротрекер объектов (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Подключение POS-терминала (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Централизованные веб-отчеты",
                        "answer": "Нет"
                    },
                    {
                        "question": "Интеграция со СКУД (если требуется, укажите бренд СКУД, количество контроллеров и пр. информацию)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Интеграция систем периметральной охраны (если требуется, укажите бренд ПСО, количество контроллеров и пр. информацию)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Интеграция с ЕЦХД (если требуется, укажите количество каналов)",
                        "answer": "Нет"
                    },
                    {
                        "question": "Иное",
                        "answer": "Нет"
                    }
                ]
            }
        },
        {
            "question": "В качестве ядра системы видеонаблюдения будет использоваться (сервер / видеорегистратор)",
            "answer": {
                "simpleAnswer": "На усмотрение проектировщика",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите место расположения центрального оборудования",
            "answer": {
                "simpleAnswer": "Серверная (отмечена на планировках)",
                "multipleAnswer": []
            }
        },
        {
            "question": "Требуется ли функция просмотра с места размещения видеорегистратора/сервера (если да, то на каком количестве мониторов)",
            "answer": {
                "simpleAnswer": "Нет, просмотр будет на месте размещения оператора системы",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите место расположения оборудования оператора системы",
            "answer": {
                "simpleAnswer": "Пост охраны (отмечен на планировках)",
                "multipleAnswer": []
            }
        },
        {
            "question": "Функционал ПО, доступный с АРМ",
            "answer": {
                "simpleAnswer": "Мониторинг и администрирование",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите место расположения периферийного сетевого оборудования (в помещениях или на улице, если требуется)",
            "answer": {
                "simpleAnswer": "Определить проектом",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите количество дней хранения архива",
            "answer": {
                "simpleAnswer": "30",
                "multipleAnswer": []
            }
        },
        {
            "question": "Осуществляем непрерывную запись (24 часа в сутки) или запись по движению, по событию (12-14 часов в сутки)",
            "answer": {
                "simpleAnswer": "По движению",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите необходимую частоту кадров в секунду",
            "answer": {
                "simpleAnswer": "24",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите желаемое разрешение записи",
            "answer": {
                "simpleAnswer": "2МП",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите предпочитаемый видеокодек (H.264, H.265, MJPEG)",
            "answer": {
                "simpleAnswer": "H.265",
                "multipleAnswer": []
            }
        },
        {
            "question": "Если необходим резерв работы системы по питанию, то на какое время",
            "answer": {
                "simpleAnswer": "15 минут",
                "multipleAnswer": []
            }
        },
        {
            "question": "Требуется ли интеграция с системами Безопасный Город или Безопасный Регион",
            "answer": {
                "simpleAnswer": "Нет",
                "multipleAnswer": []
            }
        },
        {
            "question": "Укажите при необходимости дополнительные требования к системе СВН (запись звука, использование тревожных вх/вых, ИК-подсветка, интеграция с др. системами объекта и т.д.)",
            "answer": {
                "simpleAnswer": "Нет",
                "multipleAnswer": []
            }
        }
    ]
},
        {
          "system" : "SPS",
          "content": []
        },
        {
          "system" : "APPZ",
          "content": []
        },
        {
          "system" : "AUPT",
          "content": []
        },
        {
          "system" : "SOUE",
          "content": []
        },
        {
          "system" : "SOTS",
          "content": []
        },
        {
          "system" : "SKUD",
          "content": []
        }
      ],

    };
  },
  methods: {
    async loadQuestionnaire() {
      this.questionnaires.forEach(q => {
        if (q.system == this.selectedSystem) {
          this.selectedQuestionnaire = q;
        };
        //this.totalQuestionnaire = this.selectedQuestionnaire;
      });
      //console.log("selectedQuestionnaire = " + JSON.stringify(this.selectedQuestionnaire));
    },
    async getAllData() {

      // try {
      //   const systemsRes = await fetch(`${baseURL}/task`, {
      //     method: "GET",
      //     headers: {
      //       "Content-type": "application/json",
      //       Authorization: localStorage.Authorization,
      //     },
      //     credentials: "include",
      //     body: null,
      //   });
      //   if (!taskRes.ok) {
      //     if (taskRes.status == 401) {
      //       console.log('401 Error: You should login');
      //       this.$router.push('/login');
      //     }
      //     const message = `An error has occured: ${taskRes.status} - ${taskRes.statusText}`;
      //     console.log(message);
      //   }
      //   const taskData = await taskRes.json();
      //   this.tasks = taskData;
      //   this.tasks.forEach((task) => {
      //     task.createdAt = new Date(task.createdAt).toLocaleDateString("ru-RU");
      //     if (task.performerId == null) {
      //       task.performerId = "Не назначен";
      //     }
      //   }
      //   );
        
      // } catch (err) {
      //   this.tasks = err.message;
      // }

    },
    async submit() {
      const id = this.$route.params.id;
      await fetch("http://localhost:8080/api/v1/questionnaire/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: this.selectedQuestionnaire,
      }).catch(err => {
        console.log(err.message);
      });
      const task = {
        "id" : null,
        "ownerEmail" : JSON.parse(atob(localStorage.Authorization.split('.')[1])).sub,
        "status" : "IN_HEAP",
        "complexity" : "LEVEL_1",
        "projectId" : id, 
        "commentList" : null,
        "questionnaireId" : null,
        "createdAt" : null
      };
      await fetch("http://localhost:8080/api/v1/task/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.Authorization,
        },
        credentials: "include",
        body: this.selectedQuestionnaire,
      }).catch(err => {
        console.log(err.message);
      });
      
      await alert('Задача создана');
      await this.$router.push(`/project/${id}/`);
    }
  },
  // created: function () {
  //   this.getDataById();
  // },

}
</script>

<style>

</style>