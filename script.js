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
