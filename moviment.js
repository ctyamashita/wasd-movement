let mode = localStorage.getItem("mode") || '2D';

// list of objects
const obj = {
  'height': 5,
  'width': 5,
  'place': 2,
  'disk': 2,
  'box': 4,
  'carpet': 2
}

// Board Size
// let [height, width] = [obj['width'], obj['height']];

let availableTiles;

const modeBtn = document.createElement('div');
const modeBtnTop = document.createElement('div');
const modeBtnLeft = document.createElement('div');
const sideContainer = document.createElement('div');
const modeBtnRight = document.createElement('div');

const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');
const inputs = document.createElement('div');
inputs.classList.add('inputs');

const addInputs = (type, quantity) => {
  const typeInput = document.createElement('input');
  const typeLabel = document.createElement('label');
  typeLabel.for = type;
  typeLabel.innerText = type;
  typeInput.id = type;
  typeInput.value = quantity
  typeInput.type = 'number';
  typeInput.onchange = () => {
    const newValue =  Number(document.querySelector(`#${type}`).value);
    obj[type] = newValue;
    updateBoard();
  }

  inputs.append(typeLabel);
  inputs.append(typeInput);
}

inputContainer.append(inputs);
document.body.append(inputContainer);

// Mode button
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
    place.nextElementSibling.style.opacity = 0;
  });
  setTimeout(() => {
    player.parentElement.style.opacity = 1;
    player.style.opacity = 1;
    places.forEach(place => {
      place.parentElement.style.background = 'radial-gradient(white 5%, rgba(255,255,255,0.3) 28%, transparent 70%)';
      place.style.opacity = 1;
      place.nextElementSibling.style.opacity = 1;
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

//bg modal
const bg = document.createElement('div');
bg.classList.add('bg');
document.body.append(bg);

const generateBoard = () => {
  const board = document.createElement('table');
  const height = obj['height'];
  const width = obj['width'];

  for (let y = 1; y <= height; y++) {
    const row = document.createElement('tr');
    const fixedY = 1 + height - y

    for (let x = 1; x <= width; x++) {
      const tile = document.createElement('td');
      if (window.screen.height < window.screen.width) {
        tile.style.width = `${80/width}vh`
        tile.style.height = `${80/width}vh`
      } else {
        tile.style.width = `${80/height}vw`
        tile.style.height = `${80/height}vw`
      }
      const container = document.createElement('div');
      const fixedX = 1 + width - x;
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

window.onresize = () => {
  const tiles = document.querySelectorAll('td');
  const height = obj['height'];
  const width = obj['width'];
  if (window.innerHeight < window.innerWidth) {
    tiles.forEach((tile) => {
      tile.style.width = `${80/width}vh`
      tile.style.height = `${80/width}vh`
    })
  } else {
    tiles.forEach((tile) => {
      tile.style.width = `${80/height}vw`
      tile.style.height = `${80/height}vw`
    })
  }
}

// Add object to board at random location

// Helper
const addToBoard = (thing) => {
  const index = Math.floor(Math.random() * availableTiles.length);
  let randomCoord = availableTiles.splice(index, 1);
  // console.log(randomCoord, availableTiles);
  // if (randomCoord.length == 0) randomCoord = [availableTiles.pop()];

  const objEl = randomCoord[0].firstChild
  objEl.classList.add(thing);
  if (thing == 'place') {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = 'Bubble test';
    objEl.parentElement.append(bubble);
    const modal = document.createElement('div');
    modal.classList.add(objEl.classList[0].replace('coord-',''));
    modal.classList.add('modal');
    document.body.append(modal);
    bubble.onclick = () => { modal.classList.toggle('expand') };
  } else if (thing == 'box') {
    const wallLeft = document.createElement('div');
    const wallRight = document.createElement('div');
    const boxCeiling = document.createElement('div');
    wallLeft.classList.add('l-wall');
    wallRight.classList.add('r-wall');
    boxCeiling.classList.add('ceiling-box');
    objEl.parentElement.append(boxCeiling);
    objEl.append(wallLeft);
    objEl.append(wallRight);
  } else if (thing == 'carpet') {
    objEl.classList.remove(thing);
    const carpet = document.createElement('div');
    carpet.classList.add('carpet');
    objEl.parentElement.append(carpet);
  }
}

const walkableTile = (x,y) => {
  const tile = document.querySelector(`.coord-${x}-${y}`)
  return !tile.classList.contains('disk') && !tile.classList.contains('box')
}

const updateBoard = () => {
  const previousBoard = document.querySelector('.board-container');
  if (previousBoard) previousBoard.remove();

  generateBoard();
  const newBoard = document.querySelector('.board-container');
  mode = localStorage.getItem("mode");
  if (mode == '2D') newBoard.classList.add('flat');
  for (const [key,value] of Object.entries(obj)) {
    if (!(key === 'height' || key === 'width')) {
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
  const height = obj['height'];
  const width = obj['width'];

  if (currentPosition.classList.contains('place')) {
    // click if enter or space
    if (e.key == 'Enter' || e.code == 'Enter' || e.key == ' ' || e.code == 'Space' ) {
      currentPosition.nextElementSibling.click();
    } else if (['w', 'ArrowUp','s', 'ArrowDown','a', 'ArrowLeft','d', 'ArrowRight', 'Escape'].includes(e.key)) {
      document.querySelectorAll(`.modal`).forEach(modal => modal.classList.remove('expand'));
    }
  }

  // check if it's allowed to move to coord
  if (x >= 1 && x <= width && y >= 1 && y <= height && document.activeElement.tagName != "INPUT") {
    currentPosition.classList.remove('player');
    if (['w', 'ArrowUp'].includes(e.key) && y < height && walkableTile(x, y + 1)) y += 1
    if (['s', 'ArrowDown'].includes(e.key) && y > 1  && walkableTile(x, y - 1)) y -= 1
    if (['a', 'ArrowLeft'].includes(e.key) && x > 1  && walkableTile(x - 1, y)) x -= 1
    if (['d', 'ArrowRight'].includes(e.key) && x < width  && walkableTile(x + 1, y)) x += 1
    document.querySelector(`.coord-${x}-${y}`).classList.add('player');
  }
});
