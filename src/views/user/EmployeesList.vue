<template>
  <div class="employees container-xxl">
    <h1>Сотрудники</h1>
    <div class="search">
      <input
        type="text"
        id="employee_search"
        v-model="filter"
        @input="filterEmployees"
        placeholder="Поиск по всем столбцам"
      />
    </div>
    <div class="table-responsive-md" v-if="employees">
      <table class="table table-sm table-striped table-bordered table-hover">
        <thead class="table-light">
          <th>ID</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Почта</th>
          <th>Телефон</th>
          <th>Должность</th>
          <th>Статус</th>
          <th></th>
        </thead>
        <tbody class="table-striped">
          <tr v-for="employee in employees" :key="employee.id">
            <td class="employee">{{ employee.id }}</td>
            <td>{{ employee.lastName }}</td>
            <td>{{ employee.firstName }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.accessStatus }}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary"
                @click="
                  this.$router.push({
                    name: 'employeedetails',
                    params: { id: employee.id },
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
  name: "EmployeesList",
  data() {
    return {
      employees: null,
      filter: "",
      filteredEmployees: [],
      
    };
  },
  methods: {
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
      } catch (err) {
        this.employees = err.message;
      };
      
    },
    async filterEmployees() {
      this.filteredEmployees = [];
      let all_employee_TDs = document.querySelectorAll("td.employee");
      this.employees.forEach((employee) => {
        const idModified = employee.id.toString().toLowerCase();
        const lastNameModified = employee.lastName.toString().toLowerCase();
        const firstNameModified = employee.firstName.toLowerCase();
        const emailModified = employee.email.toLowerCase();
        const phoneModified = employee.phone.toLowerCase();
        const positionModified = employee.position.toLowerCase();
        const accessStatusModified = employee.accessStatus.toLowerCase();
        const searchTerm = this.filter.toLowerCase();
        if (
          idModified.includes(searchTerm) ||
          lastNameModified.includes(searchTerm) ||
          firstNameModified.includes(searchTerm) ||
          emailModified.includes(searchTerm) ||
          phoneModified.includes(searchTerm) ||
          positionModified.includes(searchTerm) ||
          accessStatusModified.includes(searchTerm) ||
          searchTerm == ""
        ) {
          this.filteredEmployees.push(employee);
        }
      });

      if (this.filteredEmployees != null) {
        let filteredEmployeeIDs = [];
        this.filteredEmployees.forEach((filteredEmployee) => {
            filteredEmployeeIDs.push(filteredEmployee.id.toString());
        });

        [...all_employee_TDs].forEach((employeeTD) => {
            if (!filteredEmployeeIDs.includes(employeeTD.innerHTML)) {
              employeeTD.parentElement.classList.add("hidden-element");
            } else {
              employeeTD.parentElement.classList.remove("hidden-element");
            }
        });
      }
    }

  },
  created: function () {
    this.getEmployees();
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
#employee_search {
  width: 50%;
}
.highlight {
  background-color: yellow;
}

</style>