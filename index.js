//x: start coord: 8, end coord: 580
//y: start coord: 8, end coord: 404

//The images are currently entered manually, to change it we must use serverside framework
let images = ["01", "01_1", "01_2", "01_3", "01_4", "01_5", "02"]
//Distance between 2 adjacent tiles along one axis. The distance is calculated between each of the tiles' top-left corner.
const GAP = 44
//Currently selected tiles. Both can be "selected", but as soon as the second one is selected, they get de-selected after
//determining whether they get deleted or not
firstSelected = {}
secondSelected = {}

populateRows()

//Populates the grid with tiles, each tile having a random picture selected from the images variable.
//The grid layouts are located in coordinates.js
function populateRows() {
  let wrapper = document.querySelector(".wrapper")

  for (let i = 0; i < firstLevel.length; i++) {
    let split = firstLevel[i].split(',')
    let cell = document.createElement('div')
    cell.className = 'cell'
    cell.style.gridRowStart = parseInt(split[0])
    cell.style.gridColumnStart = parseInt(split[1])

    let pic = document.createElement('img')
    pic.className = 'cell-img'
    pic.src = getRandomImage()

    cell.append(pic)

    cell.addEventListener('click', event => {
      handleIconClick(event)
    });

    wrapper.append(cell)
  }
}

function getRandomImage() {
  const img = Math.floor(Math.random() * images.length);
  return `icons_first/${images[img]}.png`
}

//Selects a tile based on the tile you've clicked on. When a second tile is selected, determines if they are to be deleted or not.
function handleIconClick(event) {
  if (Object.keys(firstSelected).length === 0) {
    firstSelected = selectIcon(event, firstSelected)
    event.target.classList.add("selected-cell")
  } else if (Object.keys(secondSelected).length === 0) {
    secondSelected = selectIcon(event, secondSelected)
    checkSelections()
  }
  console.log(firstSelected);
}

function selectIcon(event, selection) {
  selection = {
    "cell": event.target.parentElement,
    "img": event.target.src,
    "x": event.target.getBoundingClientRect().x,
    "y": event.target.getBoundingClientRect().y,
  }
  return selection
}

function checkSelections() {
  //if images are not the same, deselect and exit.
  if (firstSelected.img !== secondSelected.img) {
    removeBorder()
    firstSelected = {}
    secondSelected = {}
    return
  }
  //Else, check if tiles are to be deleted. If yes - delete. If no, remove visual border. Selections will be cleared regardless.
  if (compareCoordinates()) {
    removeElement(firstSelected)
    removeElement(secondSelected)
  } else {
    removeBorder()
  }

  firstSelected = {}
  secondSelected = {}
}

function compareCoordinates() {
  // Returns true if cells are eligible for removal - if the path between the 2 selected cells
  // takes a maximum of two 90 degree turns.
  if (firstSelected.x === secondSelected.x && firstSelected.y === secondSelected.y) {
    return false
  }
  let isStraightLineConnection = checkPathBetweenTiles(firstSelected, secondSelected)
  if (isStraightLineConnection) return true
  else {
    return findMeetingSpotOfTiles()
  } 
}

function findMeetingSpotOfTiles() {
  //8 + GAP * i is the X or Y of each tile, where i is the (position-1) of the tile along the x/y axis.
  //So for example the element in the top left corner has an [x,y] of [8,8], the one to the right of it is [52,8] etc.

  //trace x
  for (let i = -1; i <= 14; i++) {
    let firstTileToMoveToward = { "x": 8 + GAP * i, "y": firstSelected.y}
    let secondTileToMoveToward = { "x": 8 + GAP * i, "y": secondSelected.y}

    console.log(`first selected: ${firstSelected.x},${firstSelected.y}`);
    console.log(`second selected: ${secondSelected.x},${secondSelected.y}`);
    console.log(`first move: ${firstTileToMoveToward.x},${firstTileToMoveToward.y}`);
    console.log(`second move: ${secondTileToMoveToward.x},${secondTileToMoveToward.y}`);

    if (meetingSpotConditions(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  //trace y
  for (let i = -1; i <= 10; i++) {
    let firstTileToMoveToward = { "x": firstSelected.x, "y": 8 + GAP * i }
    let secondTileToMoveToward = { "x": secondSelected.x, "y": 8 + GAP * i }

    console.log(`first selected: ${firstSelected.x},${firstSelected.y}`);
    console.log(`second selected: ${secondSelected.x},${secondSelected.y}`);
    console.log(`first move: ${firstTileToMoveToward.x},${firstTileToMoveToward.y}`);
    console.log(`second move: ${secondTileToMoveToward.x},${secondTileToMoveToward.y}`);

    if (meetingSpotConditions(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  return false
}

function meetingSpotConditions(firstTileToMoveToward, secondTileToMoveToward) {
  let isTileAtFirst = isExistsTileAtCoords(firstTileToMoveToward.x, firstTileToMoveToward.y)
  let isTileAtSecond = isExistsTileAtCoords(secondTileToMoveToward.x, secondTileToMoveToward.y)
  console.log(`Is there a tile at first to move to? ${isTileAtFirst}`);
  console.log(`Is there a tile at second to move to? ${isTileAtSecond}`);

  if (firstSelected.x === firstTileToMoveToward.x && firstSelected.y === firstTileToMoveToward.y) isTileAtFirst = false
  if (secondSelected.x === secondTileToMoveToward.x && secondSelected.y === secondTileToMoveToward.y) isTileAtSecond = false

  let firstSelToFirstMove = checkPathBetweenTiles(firstSelected, firstTileToMoveToward)
  let secondSelToSecondMove = checkPathBetweenTiles(secondSelected, secondTileToMoveToward)
  let firstMoveToSecondMove = checkPathBetweenTiles(firstTileToMoveToward, secondTileToMoveToward)
  console.log(`first selected to first move: ${firstSelToFirstMove}`);
  console.log(`second selected to second move: ${secondSelToSecondMove}`);
  console.log(`first move to second move: ${firstMoveToSecondMove}`);

  if (firstSelToFirstMove && secondSelToSecondMove && firstMoveToSecondMove && !isTileAtFirst && !isTileAtSecond) return true
  return false
}

function checkPathBetweenTiles(firstSelected, secondSelected) {
  //Exit if the path between tiles is not a straight line.
  if (firstSelected.x !== secondSelected.x && firstSelected.y !== secondSelected.y) return false

  if (firstSelected.x < secondSelected.x || firstSelected.y < secondSelected.y) {
    for (let i = firstSelected.x + GAP; i < secondSelected.x; i += GAP) {
      // Check that no tile occupies the x coordinate of i value
      if (isExistsTileAtCoords(i, firstSelected.y)) return false
    }
    for (let i = firstSelected.y + GAP; i < secondSelected.y; i += GAP) {
      // Check that no tile occupies the y coordinate of i value
      if (isExistsTileAtCoords(firstSelected.x, i)) return false
    }
  } else {
    for (let i = secondSelected.x + GAP; i < firstSelected.x; i += GAP) {
      // Check that no tile occupies the x coordinate of i value
      if (isExistsTileAtCoords(i, secondSelected.y)) return false
    }
    for (let i = secondSelected.y + GAP; i < firstSelected.y; i += GAP) {
      // Check that no tile occupies the y coordinate of i value
      if (isExistsTileAtCoords(secondSelected.x, i)) return false
    }
  }
  return true
}

function isExistsTileAtCoords(x, y) {
  // Returns true if there is a cell occupying the specified coordinates.
  cellPics = document.querySelectorAll('.cell-img')
  for (let i = 0; i < cellPics.length; i++) {
    if (cellPics[i].getBoundingClientRect().x == x && cellPics[i].getBoundingClientRect().y == y) {
      return true
    }
  }
  return false
}

function removeBorder() {
  let elem = document.querySelector(".selected-cell")
  elem.classList.remove("selected-cell")
}

function removeElement(selection) {
  selectedCell = selection.cell
  selectedCell.parentElement.removeChild(selectedCell)
}