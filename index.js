//x: start coord: 8, end coord: 580
//y: start coord: 8, end coord: 404

//The images are currently entered manually
let imageDirectory = "Warrior"
let images = ["1", "2", "3", "4", "5", "6", "7",
  "8", "9", "10", "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34",
  "35", "36", "37", "38", "39", "40", "41", "42", "43"]
let selectedImages = selectNRandomImages(25)
//Distance between 2 adjacent tiles along one axis. The distance is calculated between each of the tiles' top-left corner.
const GAP = 44
//Currently selected tiles. Both can be "selected", but as soon as the second one is selected, they get de-selected after
//determining whether they get deleted or not
firstSelected = {}
secondSelected = {}

function selectNRandomImages(n) {
  let randomImages = []
  for (let i = 1; i <= n; i++) {
    let img = Math.floor(Math.random() * images.length);
    while (randomImages.includes(images[img])) {
      img = Math.floor(Math.random() * images.length);
    }
    randomImages.push(images[img])
  }
  console.log(randomImages);
  return randomImages
}

populateRows()

//Populates the grid with tiles, each tile having a random picture selected from the images variable.
//The grid layouts are located in coordinates.js
function populateRows() {
  let wrapper = document.querySelector(".wrapper")

  for (let i = 0; i < firstLevel.length; i++) {
    let cell = createCell(firstLevel[i])
    wrapper.append(cell)
  }
  populateCellsWithImages()
}

function populateCellsWithImages() {
  cells = document.querySelectorAll('.cell')
  if (cells.length % 2 === 1) throw new Error('Odd number of cells!') 

  pic = getRandomImage()
  cellsWithoutPics = getCellIndicesWithoutPics(cells)

  while (cellsWithoutPics.length > 0) {
    randomCellPos = Math.floor(Math.random() * cellsWithoutPics.length);
    randomCellIndex = cellsWithoutPics[randomCellPos]
    addGivenPictureToCell(cells[randomCellIndex], pic)

    //do it a second time with the same image to ensure that every image appears an even number of times.
    cellsWithoutPics = getCellIndicesWithoutPics(cells)
    randomCellPos = Math.floor(Math.random() * cellsWithoutPics.length);
    randomCellIndex = cellsWithoutPics[randomCellPos]
    addGivenPictureToCell(cells[randomCellIndex], pic)

    //Finally generate a new pic and recreate cells without pics.
    pic = getRandomImage()
    cellsWithoutPics = getCellIndicesWithoutPics(cells)
  }
}

function getCellIndicesWithoutPics(cells) {
  let cellsWithoutPics = []
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].firstChild) cellsWithoutPics.push(i)
  }
  return cellsWithoutPics
}

function createCell(coords) {
  // coords parameter: A string representation of the row/column of the cell, separated by a comma, such as "1,2"
  let splitCoords = coords.split(',')
  let cell = document.createElement('div')
  cell.className = 'cell'
  cell.style.gridRowStart = parseInt(splitCoords[0])
  cell.style.gridColumnStart = parseInt(splitCoords[1])

  cell.addEventListener('click', event => {
    handleIconClick(event)
  });

  return cell
}

function addGivenPictureToCell(cell, picture) {
  let pic = document.createElement('img')
  pic.className = 'cell-img'
  pic.src = picture

  cell.append(pic)
}

function addPictureToCell(cell) {
  let pic = document.createElement('img')
  pic.className = 'cell-img'
  pic.src = getRandomImage()

  cell.append(pic)
}

function getRandomImage() {
  const img = Math.floor(Math.random() * selectedImages.length);
  return `${imageDirectory}/${selectedImages[img]}.png`
}

//Selects a tile based on the tile you've clicked on. When a second tile is selected, determines if they are to be deleted or not.
function handleIconClick(event) {
  if (Object.keys(firstSelected).length === 0) {
    firstSelected = selectIcon(event)
    event.target.classList.add("selected-cell")
  } else if (Object.keys(secondSelected).length === 0) {
    secondSelected = selectIcon(event)
    checkSelections()
  }
  console.log(firstSelected);
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