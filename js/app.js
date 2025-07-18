class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000
    this._totalCalories = 0
    this._meals = []
    this._workouts = []
  }

  addMeal(meal) {
    this._meals.push(meal)
    this._totalCalories += meal.calories
  }

  addWorkout(workout) {
    this._workouts.push(workout)
    this._totalCalories -= workout.calories
  }

  //   get totalCalories() {
  //     return this._totalCalories
  //   }

  //   get calorieLimit() {
  //     return this._calorieLimit
  //   }

  //   set calorieLimit(value) {
  //     this._calorieLimit = value
  //   }
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
const breakfast = new Meal('Breakfast', 400)
const lunch = new Meal('Lunch', 200)
const workout = new Workout('Workout', 300)

tracker.addMeal(breakfast)
tracker.addMeal(lunch)
tracker.addWorkout(workout)

console.log(tracker._totalCalories)
console.log(tracker)

