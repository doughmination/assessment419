/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Clove Nytrix Doughmination Twilight
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, subject to the MIT License terms.
 * See https://opensource.org/licenses/MIT for the full licence text.
 */

const ANIMALS = ["🦁", "🐘", "🦒", "🐊", "🦜", "🐧", "🦋", "🐠"];

let cards = [];
let flipped = [];
let matched = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let locked = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  // Reset state
  clearInterval(timerInterval);
  flipped = [];
  matched = 0;
  moves = 0;
  seconds = 0;
  locked = false;

  document.getElementById("moveCount").textContent = "0";
  document.getElementById("pairCount").textContent = "0";
  document.getElementById("timer").textContent = "0s";
  document.getElementById("winMessage").style.display = "none";

  // Build deck
  const deck = shuffle([...ANIMALS, ...ANIMALS]);
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  cards = deck.map((animal, i) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.dataset.animal = animal;
    card.dataset.index = i;
    card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">🍬</div>
                <div class="card-back">${animal}</div>
            </div>
        `;
    card.addEventListener("click", () => onCardClick(card));
    board.appendChild(card);
    return card;
  });

  // Start timer on first click — handled in onCardClick
}

function onCardClick(card) {
  if (locked) return;
  if (card.classList.contains("flipped")) return;
  if (card.classList.contains("matched")) return;

  // Start timer on first flip
  if (moves === 0 && flipped.length === 0) {
    timerInterval = setInterval(() => {
      seconds++;
      document.getElementById("timer").textContent = seconds + "s";
    }, 1000);
  }

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    document.getElementById("moveCount").textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  locked = true;
  const [a, b] = flipped;

  if (a.dataset.animal === b.dataset.animal) {
    // Match!
    setTimeout(() => {
      a.classList.add("matched");
      b.classList.add("matched");
      matched++;
      document.getElementById("pairCount").textContent = matched;
      flipped = [];
      locked = false;

      if (matched === ANIMALS.length) {
        clearInterval(timerInterval);
        showWin();
      }
    }, 400);
  } else {
    // No match — shake and flip back
    a.classList.add("wrong");
    b.classList.add("wrong");

    setTimeout(() => {
      a.classList.remove("flipped", "wrong");
      b.classList.remove("flipped", "wrong");
      flipped = [];
      locked = false;
    }, 900);
  }
}

function showWin() {
  const winMessage = document.getElementById("winMessage");
  const winText = document.getElementById("winText");
  winText.textContent = `You matched all 8 pairs in ${moves} moves and ${seconds} seconds! 🌟`;
  winMessage.style.display = "flex";
}

document.getElementById("resetBtn").addEventListener("click", startGame);

// Kick off on page load
startGame();
