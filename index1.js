const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
const scoreDisplay = document.querySelector(".score");

scoreDisplay.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  const cardElements = Array.from(gridContainer.querySelectorAll('.card'));
  
  cardElements.forEach((card, index) => {
    card.style.animation = `shuffle 1s ${index * 0.1}s forwards`;
  });

  setTimeout(() => {
    cardElements.forEach((card) => {
      card.style.animation = '';
    });

    cards.sort(() => Math.random() - 0.5);
    generateCards();
  }, 3500);
}

function generateCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("data-name", card.name);
  cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image}>
      </div>
      <div class="back"></div>
    `;
  cardElement.addEventListener("click", flipCard);
  return cardElement;
}

function generateCards() {
  gridContainer.innerHTML = "";
  cards.forEach((card) => {
    const cardElement = generateCardElement(card);
    gridContainer.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    score++;
    scoreDisplay.textContent = score;
    lockBoard = true;
    checkForMatch();
  }
}

function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  scoreDisplay.textContent = score;
}
