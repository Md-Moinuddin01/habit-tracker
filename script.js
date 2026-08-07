const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const remainingHabits = document.getElementById("remainingHabits");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const celebrationMessage = document.getElementById("celebrationMessage");
const todayDate = document.getElementById("todayDate");
const greeting = document.getElementById("greeting");
const quoteText = document.getElementById("motivationalQuote");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

let habits = [];
let currentFilter = "all";

const motivationalQuotes = [
  "Keep going!",
  "You're doing great!",
  "One habit at a time.",
  "Small steps still count.",
  "Consistency beats perfection."
];

function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (!savedHabits) {
    habits = [];
    return;
  }

  try {
    habits = JSON.parse(savedHabits);
  } catch (error) {
    habits = [];
  }
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setDateAndGreeting() {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  todayDate.textContent = today.toLocaleDateString("en-US", options);

  const hour = today.getHours();
  let message = "Good day!";


  if (hour < 12) {
    message = "Good morning!";
  } else if (hour < 18) {
    message = "Good afternoon!";
  } else {
    message = "Good evening!";
  }

  greeting.textContent = message;
}

function setDailyQuote() {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  quoteText.textContent = motivationalQuotes[randomIndex];
}

function getThemePreference() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeIcon.textContent = theme === "dark" ? "D" : "L";
  themeLabel.textContent = theme === "dark" ? "Dark Mode" : "Light Mode";
  localStorage.setItem("theme", theme);
}





function addHabit() {
  const habitName = habitInput.value.trim();

  if (!habitName) {
    alert("Please type a habit first.");
    return;
  }

  habits.unshift({
    id: Date.now(),
    name: habitName,
    completed: false,
    completedDate: ""
  });

  habitInput.value = "";
  saveHabits();
  renderHabits();
}

function toggleHabitComplete(habitId) {
  habits = habits.map(function (habit) {
    if (habit.id === habitId) {
      const isCompleted = !habit.completed;
      return {
        ...habit,
        completed: isCompleted,
        completedDate: isCompleted ? getTodayKey() : ""
      };
    }

    return habit;
  });


  
  saveHabits();
  renderHabits();
}

function editHabit(habitId) {
  const habit = habits.find(function (item) {
    return item.id === habitId;
  });

  if (!habit) {
    return;
  }

  const newName = prompt("Edit habit name:", habit.name);

  if (newName === null) {
    return;
  }

  const trimmedName = newName.trim();

  if (!trimmedName) {
    alert("Habit name cannot be empty.");
    return;
  }

  habit.name = trimmedName;
  saveHabits();
  renderHabits();
}

function deleteHabit(habitId) {
  const shouldDelete = confirm("Are you sure you want to delete this habit?");

  if (!shouldDelete) {
    return;
  }

  habits = habits.filter(function (habit) {
    return habit.id !== habitId;
  });

  saveHabits();
  renderHabits();
}

function getFilteredHabits() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return habits.filter(function (habit) {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm);
    const isCompletedToday = habit.completed;

    if (!matchesSearch) {
      return false;
    }

    if (currentFilter === "completed") {
      return isCompletedToday;
    }

    if (currentFilter === "pending") {
      return !isCompletedToday;
    }

    return true;
  });
}

function updateStatistics() {
  const totalCount = habits.length;
  const completedCount = habits.filter(function (habit) {
    return habit.completed;
  }).length;
  const remainingCount = totalCount - completedCount;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  totalHabits.textContent = totalCount;
  completedHabits.textContent = completedCount;
  remainingHabits.textContent = remainingCount;
  progressFill.style.width = progressPercent + "%";
  progressText.textContent = progressPercent + "% complete";

  const allDone = totalCount > 0 && completedCount === totalCount;
  celebrationMessage.hidden = !allDone;
}

