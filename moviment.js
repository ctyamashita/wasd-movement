// Board Size
const [width, height] = [5,5]

const board = document.createElement('table');

for (let y = 1; y <= height; y++) {
  const row = document.createElement('tr');
  const fixedY = 1 + height - y

  for (let x = 1; x <= width; x++) {
    const tile = document.createElement('td');
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
let availableTiles = Array.from(document.querySelectorAll('td'));

// Add object to board at random location

// Helper
const addToBoard = (string) => {
  const index = Math.floor(Math.random() * availableTiles.length);
  const randomCoord = availableTiles.splice(index, 1);
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

// list of objects
// const objects = ['player', 'place', 'blocked', 'blocked', 'box', 'box', 'carpet', 'carpet', 'carpet', 'carpet', 'carpet', 'carpet', 'carpet', 'carpet'];

const obj = {
  'player': 1,
  'place': 3,
  'blocked': 3,
  'box': 4,
  'carpet': 6
}

// check if number of objects is valid
// objects.length >= (width * height) ? alert('Too many objects!') : objects.forEach((obj) => addToBoard(obj));

for (const [key,value] of Object.entries(obj)) {
  for (let times = 0; times < value; times++) {
    addToBoard(key);
  }
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
