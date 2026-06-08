const reviewCount = document.querySelector("#reviewCount");
const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

let completedReviews = Number(localStorage.getItem("completedReviews")) || 0;
completedReviews += 1;

localStorage.setItem("completedReviews", completedReviews);
reviewCount.textContent = completedReviews;

currentYear.textContent = new Date().getFullYear();
lastModified.textContent = document.lastModified;
