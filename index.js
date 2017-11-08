// An ultra simple Node.js implementation of the game of Life, with a Hustle
// twist! Conditions are as follows:
//
// 1. Any hustler with fewer than 2 hustler neighbors stop hustling.
// 2. Any hustler with 2 or 3 hustler neighbors keeps hustling.
// 3. Any hustler more than 3 hustler neighbors stop hustling.
// 4. Any nonhustler with exactly 3 hustler neighbors starts hustling again.

'use scrict'

let _ = require('lodash')
let term = require('terminal-kit').terminal

// Starting hustler grid
let INIT_GRID = [
    [true, true, true, true, true],
    [false, true, false, false, true],
    [false, false, false, false, false],
    [true, true, false, false, false]
]

/**
 * neighbors(): count hustler and nonhustler neighbors of a given grid cell
 * @targetX {Number} x coordinate of cell to check
 * @targetY {Number} y coordinate of cell to check
 * @return  {Object} count of adjacent hustlers and nonhustlers
 */
let neighbors = (grid, targetX, targetY) => {
    let hustlerCount = 0;
    let nonhustlerCount = 0;

    for(let y = targetY - 1; y <= targetY + 1; y++) {
        for(let x = targetX - 1; x <= targetX + 1; x++) {
            if(x > -1 && y > -1 && x < grid[0].length && y < grid.length && (x !== targetX || y !== targetY)) {
                if(grid[y][x]) {
                    hustlerCount++
                } else {
                    nonhustlerCount++
                }
            }
        }
    }

    return { hustlers: hustlerCount, nonhustlers: nonhustlerCount }
}

/**
 * hustle(): resursively iterates hustle grid to next generation, end state
 * is when no generational changes have happened
 * @currentGeneration   {Array}     current generation of hustle grid
 * @generationCount     {Number}    accumulated generation count
 */
let hustle = (currentGeneration, generationCount) => {
    // Initialize next generation with values from current generation
    let nextGeneration = _.cloneDeep(currentGeneration)

    // Check neighbors for all cells in current generation and swap values
    // based on specific conditions in next generation
    for(let y = 0; y < currentGeneration.length; y++) {
        for(let x = 0; x < currentGeneration[0].length; x++) {
            let counts = neighbors(currentGeneration, x, y)
            if(currentGeneration[y][x]) {    // If this cell is a hustler...
                if(counts.hustlers < 2) { // dies
                    nextGeneration[y][x] = false
                } else if(counts.hustlers === 2 || counts.hustlers === 3) { //lives
                    nextGeneration[y][x] = true
                } else if(counts.hustlers > 3) { //dies
                    nextGeneration[y][x] = false
                }
            } else {                         // If this cell is a nonhustler...
                if(counts.hustlers === 3) {
                    nextGeneration[y][x] = true
                }
            }
        }
    }

    // End state! When no generational changes have taken place, we're done.
    // Otherwise, move on to the next generation.
    if(_.isEqual(nextGeneration, currentGeneration)) {
        term('No change, ending hustle. Number of generations: ')
        term.bgRed()
        term(generationCount)
    } else {
        hustle(nextGeneration, generationCount + 1)
    }
}

// Start hustling!
hustle(INIT_GRID, 0)
