// Board Size
const [width, height] = [100,100]

const board = document.createElement('table');

for (let y = 1; y <= width; y++) {
  const row = document.createElement('tr');

  for (let x = 1; x <= width; x++) {
    const tile = document.createElement('td');
    const container = document.createElement('div');
    container.setAttribute('class', `coord-${x}-${y} ${x == 1 && y == 10 ? 'player' : ''}`);
    tile.append(container);
    row.append(tile);
  }
  board.append(row)
}
document.body.append(board)

const allTiles = document.querySelectorAll('td');

const randomPlace = allTiles[Math.floor(Math.random() * allTiles.length)]
// randomPlace.classList.add('place')
randomPlace.firstChild.classList.add('place')

// Controls
document.addEventListener('keyup', (e) => {
  const currentPosition = document.querySelector('.player');
  let [x, y] = currentPosition.classList[0].split('-').slice(1).map(num => Number(num));
  if (e.key == 'Enter') currentPosition.click();

  if (x >= 1 && x <= width && y >= 1 && y <= height) {
    currentPosition.classList.remove('player');
    if (e.key == 's' && y < height) y += 1
    if (e.key == 'w' && y > 1) y -= 1
    if (e.key == 'a' && x > 1) x -= 1
    if (e.key == 'd' && x < width) x += 1
    document.querySelector(`.coord-${x}-${y}`).classList.add('player');
  }
});
