import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'
import CalorieTracker from './Tracker'
import { Meal, Workout } from './Items'
import './css/bootstrap.css'
import './css/style.css'


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
    } else {
      const workout = new Workout(name, +calories)
      this._tracker.addWorkout(workout)
    }

    document.getElementById(`${type}-form`).reset()

    const collapseItem = document.getElementById(`collapse-${type}`)
    const bsCollapse = new Collapse(collapseItem, {
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
