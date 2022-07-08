//x: start coord: 8, end coord: 580
//y: start coord: 8, end coord: 404
let images = ["01", "01_1", "01_2", "01_3", "01_4", "01_5", "02"]
const GAP = 44

populateRows()

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


firstSelected = {}
secondSelected = {}

function handleIconClick(event) {
  if (Object.keys(firstSelected).length === 0) {
    firstSelected = selectIcon(event, firstSelected)
    event.target.classList.add("selected-cell")
  } else if (Object.keys(secondSelected).length === 0) {
    secondSelected = selectIcon(event, secondSelected)
    checkSelections()
  }
  console.log(firstSelected);
  // console.log(secondSelected);
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
  if (firstSelected.img !== secondSelected.img) {
    removeBorder()
    firstSelected = {}
    secondSelected = {}
    return
  }

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
  //x
  for (let i = -1; i <= 14; i++) {
    // if i === - 1 sets the x to 0 to represent edges of the grid (2 tiles can meet outside of the grid)
    // else sets it to a location of a tile of the grid. Each tile is located at n * GAP + 8 where n is 
    // the position of the tile in the grid.
    let x = 8 + GAP * i

    let firstTileToMoveToward = {"x": x, "y": firstSelected.y}
    let secondTileToMoveToward = {"x": x, "y": secondSelected.y}

    console.log(`first selected: ${firstSelected.x},${firstSelected.y}`);
    console.log(`second selected: ${secondSelected.x},${secondSelected.y}`);
    console.log(`first move: ${firstTileToMoveToward.x},${firstTileToMoveToward.y}`);
    console.log(`second move: ${secondTileToMoveToward.x},${secondTileToMoveToward.y}`);

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
    // if (!meetingSpotCondition(firstTileToMoveToward, secondTileToMoveToward)) continue


    // if (checkPathsAfterMoving(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  //y
  for (let i = -1; i <= 10; i++) {
    // if i === - 1 sets the y to 0 to represent edges of the grid (2 tiles can meet outside of the grid)
    // else sets it to a location of a tile of the grid. Each tile is located at n * GAP + 8 where n is 
    // the position of the tile in the grid.
    let y = 8 + GAP * i

    let firstTileToMoveToward = { "x": firstSelected.x, "y": y }
    let secondTileToMoveToward = { "x": secondSelected.x, "y": y }

    console.log(`first selected: ${firstSelected.x},${firstSelected.y}`);
    console.log(`second selected: ${secondSelected.x},${secondSelected.y}`);
    console.log(`first move: ${firstTileToMoveToward.x},${firstTileToMoveToward.y}`);
    console.log(`second move: ${secondTileToMoveToward.x},${secondTileToMoveToward.y}`);

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

    // if (!meetingSpotCondition(firstTileToMoveToward, secondTileToMoveToward)) continue

    // if (checkPathsAfterMoving(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  return false
}

function meetingSpotCondition(firstTileToMoveToward, secondTileToMoveToward) {
  // Compare coordinates of selected tile and place where we want to move, if coords are same return false.
  // Also compares coords of first tile where we want to move with the second one
  if ((firstSelected.x === firstTileToMoveToward.x && firstSelected.y === firstTileToMoveToward.y) ||
    (secondSelected.x === secondTileToMoveToward.x && secondSelected.y === secondTileToMoveToward.y) ||
    (firstTileToMoveToward.x === secondTileToMoveToward.x && firstTileToMoveToward.y === secondTileToMoveToward.y)) {
    return false
  }
  //If a tile already exists in the place we want to move to, return false
  if (isExistsTileAtCoords(firstTileToMoveToward.x, firstTileToMoveToward.y)) {
    return false
  }
  if (isExistsTileAtCoords(secondTileToMoveToward.x, secondTileToMoveToward.y)) {
    return false
  }

  return true
}

function checkPathsAfterMoving(firstTileToMoveToward, secondTileToMoveToward) {
  if (checkPathBetweenTiles(firstSelected, firstTileToMoveToward) &&
    checkPathBetweenTiles(secondSelected, secondTileToMoveToward) &&
    checkPathBetweenTiles(firstTileToMoveToward, secondTileToMoveToward)) return true
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