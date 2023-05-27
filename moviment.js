let mode = localStorage.getItem("mode") || '2D';

// list of objects
const obj = {
  'height': 5,
  'width': 5,
  'place': 2,
  'blocked': 2,
  'box': 4,
  'carpet': 2
}

// Board Size
let [width, height] = [obj['width'], obj['height']];

let availableTiles;

const modeBtn = document.createElement('div');
const modeBtnTop = document.createElement('div');
const modeBtnLeft = document.createElement('div');
const sideContainer = document.createElement('div');
const modeBtnRight = document.createElement('div');

const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');

const addInputs = (type, quantity) => {
  const typeInput = document.createElement('input');
  const typeLabel = document.createElement('label');
  typeLabel.for = type;
  typeLabel.innerText = type;
  typeInput.id = type;
  typeInput.value = quantity
  typeInput.type = 'number';
  typeInput.onchange = () => {
    const newValue =  document.querySelector(`#${type}`).value;
    if (type == 'width') {
      width = newValue;
    } else if (type == 'height') {
      height = newValue;
    }
    obj[type] = newValue;
    updateBoard();
  }
  inputContainer.append(typeLabel);
  inputContainer.append(typeInput);
}

document.body.append(inputContainer);


modeBtn.classList.add('mode');
if (mode == '2D') modeBtn.classList.add('flat');
modeBtnRight.innerText = mode == '3D' ? '3D' : '2D'

modeBtn.onclick = () => {
  const el = document.querySelector('.box-right-btn');
  document.querySelector('.board-container').classList.toggle('flat');
  document.querySelector('.mode').classList.toggle('flat');
  el.innerText = el.innerText == '3D' ? '2D' : '3D';
  localStorage.setItem("mode", el.innerText);

  const player = document.querySelector('.player');
  const places = document.querySelectorAll('.place');

  player.parentElement.style.opacity = 0;
  player.style.opacity = 0;
  places.forEach(place => {
    place.parentElement.style.background = 'transparent';
    place.style.opacity = 0;
  });
  setTimeout(() => {
    player.parentElement.style.opacity = 1;
    player.style.opacity = 1;
    places.forEach(place => {
      place.parentElement.style.background = 'radial-gradient(white 5%, rgba(255,255,255,0.3) 28%, transparent 70%)';
      place.style.opacity = 1;
    });
  }, 2700);
};
modeBtnTop.classList.add('box-top-btn');
modeBtnRight.classList.add('box-right-btn');
modeBtnLeft.classList.add('box-left-btn');

sideContainer.classList.add('box-side-container');
sideContainer.append(modeBtnLeft);
sideContainer.append(modeBtnRight);

modeBtn.append(modeBtnTop);
modeBtn.append(sideContainer);

document.body.append(modeBtn);

const generateBoard = () => {
  const board = document.createElement('table');

  for (let y = 1; y <= width; y++) {
    const row = document.createElement('tr');
    const fixedY = 1 + width - y

    for (let x = 1; x <= height; x++) {
      const tile = document.createElement('td');
      if (window.screen.height < window.screen.width) {
        tile.style.width = `${80/width}vh`
        tile.style.height = `${80/width}vh`
      } else {
        tile.style.width = `${80/width}vw`
        tile.style.height = `${80/width}vw`
      }
      const container = document.createElement('div');
      const fixedX = 1 + height - x;
      container.setAttribute('class', `coord-${fixedX}-${fixedY}`);
      tile.style.order = (width + height) - y - x;
      tile.append(container);
      row.append(tile);
    }
    board.append(row)
  }
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');
  boardContainer.append(board);
  document.body.append(boardContainer);
  // All tiles
  availableTiles = Array.from(document.querySelectorAll('td'));

  // adding player
  addToBoard('player');
}

// Add object to board at random location

// Helper
const addToBoard = (string) => {
  const index = Math.floor(Math.random() * availableTiles.length);
  let randomCoord = availableTiles.splice(index, 1);
  if (!randomCoord) randomCoord = [availableTiles.pop()];
  const objEl = randomCoord[0].firstChild
  objEl.classList.add(string);
  if (string == 'place') {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = 'Bubble test.'
    objEl.append(bubble);
    objEl.onclick = () => { console.log('click')}
  } else if (string == 'box') {
    const wallLeft = document.createElement('div');
    const wallRight = document.createElement('div');
    const boxCeiling = document.createElement('div');
    wallLeft.classList.add('l-wall');
    wallRight.classList.add('r-wall');
    boxCeiling.classList.add('ceiling-box');
    objEl.parentElement.append(boxCeiling);
    objEl.append(wallLeft);
    objEl.append(wallRight);
  } else if (string == 'carpet') {
    objEl.classList.remove(string);
    const carpet = document.createElement('div');
    carpet.classList.add('carpet');
    objEl.parentElement.append(carpet);
  }
}

const walkableTile = (x,y) => {
  const tile = document.querySelector(`.coord-${x}-${y}`)
  return !tile.classList.contains('blocked') && !tile.classList.contains('box')
}

const updateBoard = () => {
  const previousBoard = document.querySelector('.board-container');
  if (previousBoard) previousBoard.remove();

  generateBoard();
  const newBoard = document.querySelector('.board-container');
  mode = localStorage.getItem("mode");
  if (mode == '2D') newBoard.classList.add('flat');
  for (const [key,value] of Object.entries(obj)) {
    if (key !== 'height' || key !== 'width') {
      for (let times = 0; times < value; times++) {
        addToBoard(key);
      }
    }
  }
}

updateBoard();


for (const [key,value] of Object.entries(obj)) {
  addInputs(key, value);
}


// Controls
document.addEventListener('keyup', (e) => {
  const currentPosition = document.querySelector('.player');
  let [x, y] = currentPosition.classList[0].split('-').slice(1).map(num => Number(num));

  // click if enter or space
  if (e.key == 'Enter' || e.code == 'Enter' || e.key == ' ' || e.code == 'Space' ) currentPosition.click();

  // check if it's allowed to move to coord
  if (x >= 1 && x <= width && y >= 1 && y <= height) {
    currentPosition.classList.remove('player');
    if ((e.key == 'w' || e.key == 'ArrowUp') && y < height && walkableTile(x, y + 1)) y += 1
    if ((e.key == 's' || e.key == 'ArrowDown') && y > 1  && walkableTile(x, y - 1)) y -= 1
    if ((e.key == 'a' || e.key == 'ArrowLeft') && x > 1  && walkableTile(x - 1, y)) x -= 1
    if ((e.key == 'd' || e.key == 'ArrowRight') && x < width  && walkableTile(x + 1, y)) x += 1
    document.querySelector(`.coord-${x}-${y}`).classList.add('player');
  }
});
