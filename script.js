const revealItems = document.querySelectorAll('.reveal');
const flowerCards = document.querySelectorAll('.flower-card');
const letterDialog = document.querySelector('#letterDialog');
const openLetterButton = document.querySelector('[data-open-letter]');
const closeLetterButton = document.querySelector('[data-close-letter]');
const pickFlowerButton = document.querySelector('#pickFlower');
const flowerCount = document.querySelector('#flowerCount');
const toast = document.querySelector('#toast');

const palette = ['#E2D7F1', '#BBB6C8', '#9492A4', '#777887', '#5A6760'];
let pickedFlowers = 0;
let toastTimer;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function bloomCard(card) {
  const flower = card.dataset.flower;
  const note = card.dataset.note;
  const isBlooming = card.classList.toggle('is-blooming');

  card.setAttribute('aria-pressed', String(isBlooming));

  if (isBlooming) {
    showToast(`${flower}: ${note}`);
  }
}

flowerCards.forEach((card) => {
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');

  card.addEventListener('click', () => bloomCard(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      bloomCard(card);
    }
  });
});

function createPetalBurst(origin) {
  const rect = origin.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement('span');
    const angle = (Math.PI * 2 * index) / 18 + Math.random() * 0.35;
    const distance = 80 + Math.random() * 100;

    petal.className = 'petal-burst';
    petal.style.left = `${startX}px`;
    petal.style.top = `${startY}px`;
    petal.style.background = palette[Math.floor(Math.random() * palette.length)];
    petal.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    petal.style.setProperty('--y', `${Math.sin(angle) * distance + 45}px`);
    petal.style.setProperty('--r', `${Math.round(Math.random() * 480 - 240)}deg`);

    document.body.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}

pickFlowerButton.addEventListener('click', () => {
  pickedFlowers += 1;
  createPetalBurst(pickFlowerButton);

  if (pickedFlowers === 1) {
    flowerCount.textContent = '1 flor no seu buquê. 💜';
  } else if (pickedFlowers < 7) {
    flowerCount.textContent = `${pickedFlowers} flores no seu buquê.`;
  } else {
    flowerCount.textContent = `${pickedFlowers} flores — acho que você merece o jardim inteiro.`;
  }
});

openLetterButton.addEventListener('click', () => {
  letterDialog.showModal();
});

closeLetterButton.addEventListener('click', () => {
  letterDialog.close();
});

letterDialog.addEventListener('click', (event) => {
  const rect = letterDialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    letterDialog.close();
  }
});
