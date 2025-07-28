import './css/bootstrap.css'
import './css/style.css'
import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'



class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit()
    this._totalCalories = Storage.getTotalCalories()
    this._meals = Storage.getMeals()
    this._workouts = Storage.getWorkouts()

    this._displayCaloriesLimit()
    this._displayCaloriesTotal()
    this._displayCaloriesConsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesRemaining()
    this._displayCaloriesProgress()
    document.getElementById("limit").value = this._calorieLimit
  }

  // Public Methodes
  addMeal(meal) {
    this._meals.push(meal)
    this._totalCalories += meal.calories
    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveMeal(meal)
    this._displayeNewMeal(meal)
    this._render()
  }

  addWorkout(workout) {
    this._workouts.push(workout)
    this._totalCalories -= workout.calories
    Storage.updateTotalCalories(this._totalCalories)
    Storage.saveWorkout(workout)
    this._displayNewWorkout(workout)
    this._render()
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id)

    if (index !== -1) {
      const removedMeal = this._meals[index]
      this._totalCalories -= removedMeal.calories
      Storage.updateTotalCalories(this._totalCalories)
      this._meals.splice(index, 1)
      Storage.removeMeal(id)
      this._render()
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id)

    if (index !== -1) {
      const removedWorkout = this._workouts[index]
      this._totalCalories += removedWorkout.calories
      Storage.updateTotalCalories(this._totalCalories)
      this._workouts.splice(index, 1)
      Storage.removeWorkout(id)
      this._render()
    }
  }

  resetDay() {
    this._totalCalories = 0
    this._meals = []
    this._workouts = []
    Storage.clearAll()
    this._render()
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit
    Storage.setCalorieLimit(calorieLimit)
    this._displayCaloriesLimit()
    this._render()
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayeNewMeal(meal))
    this._workouts.forEach((workout) => this._displayNewWorkout(workout))
  }

  // Private Methodes
  _displayCaloriesTotal() {
    const caloriesEl = document.getElementById("calories-total")
    caloriesEl.textContent = this._totalCalories
  }
  _displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById("calories-limit")
    caloriesLimitEl.textContent = this._calorieLimit
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed")
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    )
    caloriesConsumedEl.textContent = consumed
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned")
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    )
    caloriesBurnedEl.textContent = burned
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining")
    const remaining = this._calorieLimit - this._totalCalories
    caloriesRemainingEl.textContent = remaining
    const progressEl = document.getElementById("calorie-progress")

    // Make Bg Danger
    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      )
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-danger")
      progressEl.classList.remove("bg-success")
      progressEl.classList.add("bg-danger")
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      )
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light")
      progressEl.classList.remove("bg-danger")
      progressEl.classList.add("bg-success")
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById("calorie-progress")
    const percentage = (this._totalCalories / this._calorieLimit) * 100
    const width = Math.min(percentage, 100)
    progressEl.style.width = `${width}%`
  }

  _displayeNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items")
    const mealEl = document.createElement("div")
    mealEl.classList.add("card", "my-2")
    mealEl.setAttribute("data-id", meal.id)

    mealEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h5 class="mx-1">${meal.name}</h5>
          <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `

    mealsEl.appendChild(mealEl)
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items")
    const workoutEl = document.createElement("div")
    workoutEl.classList.add("card", "my-2")
    workoutEl.setAttribute("data-id", workout.id)

    workoutEl.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h5 class="mx-1">${workout.name}</h5>
          <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
            ${workout.calories}
          </div>
           <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `

    workoutsEl.appendChild(workoutEl)
  }

  // Render
  _render() {
    this._displayCaloriesTotal()
    this._displayCaloriesConsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesRemaining()
    this._displayCaloriesLimit()
    this._displayCaloriesProgress()
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.calories = calories
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.calories = calories
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit")
    }
    return calorieLimit
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit)
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories
    } else {
      totalCalories = +localStorage.getItem("totalCalories")
    }
    return totalCalories
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories)
  }

  static getMeals() {
    let meals
    if (localStorage.getItem("meals") === null) {
      meals = []
    } else {
      meals = JSON.parse(localStorage.getItem("meals"))
    }
    return meals
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals()
    meals.push(meal)
    localStorage.setItem("meals", JSON.stringify(meals))
  }

  static removeMeal(id) {
    const meals = Storage.getMeals()
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1)
      }
    })
    localStorage.setItem("meals", JSON.stringify(meals))
  }

  static getWorkouts() {
    let workouts
    if (localStorage.getItem("workouts") === null) {
      workouts = []
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"))
    }
    return workouts
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts()
    workouts.push(workout)
    localStorage.setItem("workouts", JSON.stringify(workouts))
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts()
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1)
      }
    })
    localStorage.setItem("workouts", JSON.stringify(workouts))
  }

  static clearAll() {
    // localStorage.removeItem("calorieLimit")
    localStorage.removeItem("meals")
    localStorage.removeItem("workouts")
    localStorage.removeItem("totalCalories")

    // If you want to clear all local storage
    // localStorage.clear();
  }
}

// App
class App {
  constructor() {
    this._tracker = new CalorieTracker()
    this._loadEventListeners()
    this._tracker.loadItems()
  }

  // Event Listener
  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"))
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"))
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"))
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"))
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"))
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"))
    document
      .getElementById("reset")
      .addEventListener("click", this._resetDay.bind(this))
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this))
  }

  // Add New Item
  _newItem(type, e) {
    e.preventDefault()
    const name = document.getElementById(`${type}-name`).value
    const calories = document.getElementById(`${type}-calories`).value

    if (name === "" || calories === "") {
      alert("Please fill in all fields")
      return
    }

    if (type === "meal") {
      const meal = new Meal(name, +calories)
      this._tracker.addMeal(meal)
      //   console.log(meal.id)
    } else {
      const workout = new Workout(name, +calories)
      this._tracker.addWorkout(workout)
    }

    document.getElementById(`${type}-form`).reset()

    const collapseItem = document.getElementById(`collapse-${type}`)
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    })
    bsCollapse.hide()
  }

  // Remove Item
  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").dataset.id

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id)

        e.target.closest(".card").remove()
      }
    }
  }

  // Filter Items
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block"
      } else {
        item.style.display = "none"
      }
    })
  }

  // Reset day
  _resetDay() {
    this._tracker.resetDay()
    document.getElementById("meal-items").innerHTML = ""
    document.getElementById("workout-items").innerHTML = ""
    document.getElementById("meal-form").value = ""
    document.getElementById("meal-calories").value = ""
    document.getElementById("workout-calories").value = ""
    document.getElementById("workout-form").value = ""
    document.getElementById("filter-meals").value = ""
    document.getElementById("filter-workouts").value = ""
  }

  // Set Calories Limit
  _setLimit(e) {
    e.preventDefault()
    let limit = document.getElementById("limit").value
    if (limit === "") {
      alert("Please add a limit")
      return
    }
    this._tracker.setLimit(+limit)
    limit = ""

    const modelEl = document.getElementById("limit-modal")
    const bsModel = Modal.getInstance(modelEl)
    bsModel.hide()
  }
}

// Initialize the App
const app = new App()
