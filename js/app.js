class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000
    this._totalCalories = 0
    this._meals = []
    this._workouts = []

    this._displayCaloriesLimit()
    this._displayCaloriesTotal()
    this._displayCaloriesConsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesRemaining()
  }

  // Public Methodes
  addMeal(meal) {
    this._meals.push(meal)
    this._totalCalories += meal.calories
    this._render()
  }

  addWorkout(workout) {
    this._workouts.push(workout)
    this._totalCalories -= workout.calories
    this._render()
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
  }




  // Render
  _render() {
    this._displayCaloriesTotal()
    this._displayCaloriesConsumed()
    this._displayCaloriesBurned()
    this._displayCaloriesRemaining()
    // this._displayCaloriesLimit()
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

const tracker = new CalorieTracker()
const breakfast = new Meal("Breakfast", 400)
const lunch = new Meal("Lunch", 1500)
const workout = new Workout("Workout", 1000)
const pushUp = new Workout("Push-up", 500)

tracker.addMeal(breakfast)
tracker.addMeal(lunch)
tracker.addWorkout(workout)
tracker.addWorkout(pushUp)


console.log(tracker._totalCalories)
console.log(tracker)
