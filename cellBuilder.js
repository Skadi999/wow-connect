function populateRows() {
  let wrapper = document.querySelector(".wrapper")

  for (let i = 0; i < currentLevel.coords.length; i++) {
    let cell = createCell(currentLevel.coords[i])
    wrapper.append(cell)
  }
  populateCellsWithImages()
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