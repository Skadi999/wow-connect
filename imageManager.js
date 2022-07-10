const images = populateImagesArray(currentLevel.totalImagesInDirectory)
const selectedImages = selectNRandomImages(currentLevel.selectedImagesNumber)

function populateImagesArray(n) {
  //Builds the image array which consists of the names of all images in the current level's image directory.
  //Image names are always 1,2,3,...n. n represents the amount of images in the directory and
  //is given in currentLevel.totalImagesInDirectory
  let imgs = []
  for (let i = 1; i <= n; i++) {
    imgs.push(String(i))
  }
  return imgs
}

function selectNRandomImages(n) {
  //Selects a number of random images out of the total images in the level's directory.
  //This number represents how many different images there will be in the game at the current level.
  let randomImages = []
  for (let i = 1; i <= n; i++) {
    let img = Math.floor(Math.random() * images.length);
    while (randomImages.includes(images[img])) {
      img = Math.floor(Math.random() * images.length);
    }
    randomImages.push(images[img])
  }
  return randomImages
}

function populateCellsWithImages() {
  //Adds images to every cell in the game, ensuring there is always an even number of each image
  cells = document.querySelectorAll('.cell')
  if (cells.length % 2 === 1) throw new Error('Odd number of cells!')

  pic = getRandomImage()
  cellsWithoutPics = getCellIndicesWithoutPics(cells)

  while (cellsWithoutPics.length > 0) {
    addPicToRandomCellWithoutPic(cellsWithoutPics, cells, pic)

    //do it a second time with the same image to ensure that every image appears an even number of times.
    cellsWithoutPics = getCellIndicesWithoutPics(cells)
    addPicToRandomCellWithoutPic(cellsWithoutPics, cells, pic)

    //Finally generate a new pic and refresh cells without pics.
    pic = getRandomImage()
    cellsWithoutPics = getCellIndicesWithoutPics(cells)
  }
}

function addPicToRandomCellWithoutPic(cellsWithoutPics, cells, pic) {
  randomCellPos = selectRandomIndexFromArray(cellsWithoutPics)
  randomCellIndex = cellsWithoutPics[randomCellPos]
  addGivenPictureToCell(cells[randomCellIndex], pic)
}

function getCellIndicesWithoutPics(cells) {
  let cellsWithoutPics = []
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].firstChild) cellsWithoutPics.push(i)
  }
  return cellsWithoutPics
}

function addGivenPictureToCell(cell, picture) {
  let pic = document.createElement('img')
  pic.className = 'cell-img'
  pic.src = picture

  cell.append(pic)
}

function getRandomImage() {
  const img = selectRandomElementFromArray(selectedImages)
  return `${currentLevel.imageDirectory}/${img}.png`
}