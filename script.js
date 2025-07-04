
const MIN_HEIGHT = 10;
const MAX_HEIGHT = 200;
const MIN_BARS = 15;
const MAX_BARS = 25;

let dataArray = [];
let isRunning = false;
let isPaused = false;
let comparisonCount = 0;
let swapCount = 0;
let animationSpeed = 2;
let currentAlgorithm = 'bubbleSort';
let pauseResolver = null;

const container = document.getElementById('bars-container');
const compDisplay = document.getElementById('comparisons');
const swapDisplay = document.getElementById('swaps');
const algorithmPicker = document.getElementById('algorithm-select');
const speedSlider = document.getElementById('speed-range');

const timeComplexity = {
  bubbleSort: 'O(n²)',
  selectionSort: 'O(n²)', 
  insertionSort: 'O(n²)',
  quickSort: 'O(n log n)' 
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomData() {
  const numBars = getRandomInt(MIN_BARS, MAX_BARS);
  dataArray = [];
  
  for (let i = 0; i < numBars; i++) {
    dataArray.push(getRandomInt(MIN_HEIGHT, MAX_HEIGHT));
  }
  
  drawBars();
  resetStats();
  updateComplexityDisplay();
}

function resetStats() {
  comparisonCount = 0;
  swapCount = 0;
  compDisplay.textContent = '0';
  swapDisplay.textContent = '0';
}

function updateComplexityDisplay() {
  document.getElementById('complexity').textContent = timeComplexity[currentAlgorithm];
}

function drawBars(activeStates = {}) {
  container.innerHTML = ''; 
  
  dataArray.forEach((height, index) => {
    const barElement = document.createElement('div');
    barElement.className = 'bar';
    
    if (activeStates[index]) {
      barElement.classList.add(activeStates[index]);
    }
    
    barElement.style.height = `${height}px`;
    
    const valueLabel = document.createElement('div');
    valueLabel.className = 'bar-label';
    valueLabel.textContent = height;
    barElement.appendChild(valueLabel);
    
    container.appendChild(barElement);
  });
}

function getAnimationDelay() {
  switch(animationSpeed) {
    case 1: return 250; 
    case 2: return 120;  
    case 3: return 60;  
    default: return 120;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

algorithmPicker.addEventListener('change', (e) => {
  if (isRunning) return;
  currentAlgorithm = e.target.value;
  updateComplexityDisplay();
});

speedSlider.addEventListener('change', (e) => {
  animationSpeed = parseInt(e.target.value);
});

document.getElementById('generate-array').addEventListener('click', () => {
  if (isRunning) return;
  createRandomData();
});

document.getElementById('start-sorting').addEventListener('click', async () => {
  if (isRunning) return;
  
  isRunning = true;
  isPaused = false;
  
  try {
    await runSortingAlgorithm();
  } catch (error) {
    console.error('Sorting error:', error);
  } finally {
    isRunning = false;
  }
});

document.getElementById('pause-sorting').addEventListener('click', () => {
  isPaused = !isPaused;
  
  if (!isPaused && pauseResolver) {
    pauseResolver();
  }
});

document.getElementById('reset').addEventListener('click', () => {
  if (isRunning) return;
  createRandomData();
});

async function runSortingAlgorithm() {
  const visualizationStep = async (highlights = {}) => {
    drawBars(highlights);
    
    compDisplay.textContent = comparisonCount.toString();
    swapDisplay.textContent = swapCount.toString();
    
    await delay(getAnimationDelay());
    
    while (isPaused) {
      await new Promise(resolve => {
        pauseResolver = resolve;
      });
    }
  };
  
  const statistics = {
    comparisons: (count) => { 
      comparisonCount += count; 
    },
    swaps: (count) => { 
      swapCount += count; 
    },
    setSorted: () => {
      const allSorted = {};
      for (let i = 0; i < dataArray.length; i++) {
        allSorted[i] = 'sorted';
      }
      drawBars(allSorted);
    }
  };
  
  const algorithmModule = await import(`./algorithms/${currentAlgorithm}.js`);
  await algorithmModule.default(dataArray, visualizationStep, statistics);
  
  const finalState = {};
  dataArray.forEach((_, idx) => {
    finalState[idx] = 'sorted';
  });
  drawBars(finalState);
}

document.addEventListener('DOMContentLoaded', () => {
  createRandomData();
});