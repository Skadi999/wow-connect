//Currently selected tiles. Both can be "selected", but as soon as the second one is selected, they get de-selected after
//determining whether they get deleted or not
firstSelected = {}
secondSelected = {}

//Selects a tile based on the tile you've clicked on. When a second tile is selected, determines if they are to be deleted or not.
function handleIconClick(event) {
  if (Object.keys(firstSelected).length === 0) {
    firstSelected = selectIcon(event)
    event.target.classList.add("selected-cell")
  } else if (Object.keys(secondSelected).length === 0) {
    secondSelected = selectIcon(event)
    checkSelections()
  }
  // console.log(firstSelected);
}

function selectIcon(event) {
  let selectedIcon = {
    "cell": event.target.parentElement,
    "img": event.target.src,
    "x": event.target.getBoundingClientRect().x,
    "y": event.target.getBoundingClientRect().y,
  }
  return selectedIcon
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
    removeTilesAndCheckForVictory()
  } else {
    removeBorder()
  }

  firstSelected = {}
  secondSelected = {}
}

function removeTilesAndCheckForVictory() {
  removeElement(firstSelected)
  removeElement(secondSelected)
  if (isGameWon()) victory()
}

function compareCoordinates() {
  // Returns true if cells are eligible for removal - if the path between the 2 selected cells
  // takes a maximum of two 90 degree turns.
  if (firstSelected.x === secondSelected.x && firstSelected.y === secondSelected.y) {
    return false
  }

  if (checkPathBetweenTiles(firstSelected, secondSelected)) {
    return true
  }
  else {
    return isAbleToConnectTiles()
  }
}

function isAbleToConnectTiles() {
  //8 + GAP * i is the X or Y of each tile, where i is the (position-1) of the tile along the x/y axis.
  //So for example the element in the top left corner has an [x,y] of [8,8], the one to the right of it is [52,8] etc.

  //trace x
  for (let i = -1; i <= 14; i++) {
    let firstTileToMoveToward = { "x": 8 + GAP * i, "y": firstSelected.y }
    let secondTileToMoveToward = { "x": 8 + GAP * i, "y": secondSelected.y }

    if (tileConditions(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  //trace y
  for (let i = -1; i <= 10; i++) {
    let firstTileToMoveToward = { "x": firstSelected.x, "y": 8 + GAP * i }
    let secondTileToMoveToward = { "x": secondSelected.x, "y": 8 + GAP * i }

    if (tileConditions(firstTileToMoveToward, secondTileToMoveToward)) return true
  }
  return false
}

function tileConditions(firstTileToMoveToward, secondTileToMoveToward) {
  //Returns true if we pass all the conditions

  //Check whether there is a tile occupying the spot where we want to move to
  let isTileAtFirst = isExistsTileAtCoords(firstTileToMoveToward.x, firstTileToMoveToward.y)
  let isTileAtSecond = isExistsTileAtCoords(secondTileToMoveToward.x, secondTileToMoveToward.y)

  //An exception to the above rule is if the tile we want to move to is occupied by the selected cell
  if (firstSelected.x === firstTileToMoveToward.x && firstSelected.y === firstTileToMoveToward.y) isTileAtFirst = false
  if (secondSelected.x === secondTileToMoveToward.x && secondSelected.y === secondTileToMoveToward.y) isTileAtSecond = false

  //Checks the paths between tiles to see if there is anything in their way
  let firstSelToFirstMove = checkPathBetweenTiles(firstSelected, firstTileToMoveToward)
  let secondSelToSecondMove = checkPathBetweenTiles(secondSelected, secondTileToMoveToward)
  let firstMoveToSecondMove = checkPathBetweenTiles(firstTileToMoveToward, secondTileToMoveToward)

  if (firstSelToFirstMove && secondSelToSecondMove && firstMoveToSecondMove && !isTileAtFirst && !isTileAtSecond) return true
  return false
}

function checkPathBetweenTiles(firstSelected, secondSelected) {
  //Checks if the path between tiles is a straight line in which no other tiles stand in the way.

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

function isGameWon() {
  return document.querySelectorAll('.cell').length === 0
}

function victory() {
  console.log("Victory");

  //Checks if there are no more levels left
  if (levelCounter === levels.length - 1) {
    console.log("You've beaten the game!");
    return
  }
  //Transition to next level
  levelCounter++
  currentLevel = levels[levelCounter]
  populateRows()
}