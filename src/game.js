// EDIT the methods and make them into the Game class not binded to prototype

class Game {
    constructor() {
        this.towers = [[3, 2, 1], [], []];   // each disk is represented by a number, that is its size
    }                                                    // you can change number of disks and the start board representation
}

Game.prototype.isValidMove = function (startTowerIdx, endTowerIdx) {
    let validSt = (startTowerIdx >= 0 && startTowerIdx <= 2);
    let validEd = (endTowerIdx >= 0 && endTowerIdx <= 2);

    if (!(validEd && validSt))
        return false 

    let lenSt = this.towers[startTowerIdx].length;
    let lenEd = this.towers[endTowerIdx].length;

    let stDisk = this.towers[startTowerIdx][lenSt - 1];
    let edDisk = this.towers[endTowerIdx][lenEd - 1];

    return (stDisk && ((stDisk < edDisk) || !edDisk)) // start MUST be NOT empty.. start MUST be < end OR end is empty
};

Game.prototype.promptMove = function (reader, answerCallback) {
    // print stacks
    this.print()
    reader.question('please enter from-disk:', (fromD) => {
        const stIdx = parseInt(fromD);
        reader.question('please enter to-disk', (toD) => {   
            const edIdx = parseInt(toD);              
            answerCallback(stIdx, edIdx)
        })
    })
}

Game.prototype.run = function (reader, completionCallback) {
    // until all disks are in order in one tower
    // take from user the disk and tower to move to
    // update the towers if the move is correct 
    this.promptMove(reader, (fromID, toID) => {
        if (!this.move(fromID, toID)) {
            console.log(`Error: Not valid Move ! please try again`)
        }
        if (!this.isWon()){
            this.run(reader, completionCallback)
        } else {
            console.log(`Congratulations >> YOU WON the CANOI !`)
            completionCallback()
        }
    })
};

Game.prototype.print = function () {
    console.log(JSON.stringify(this.towers))
};

Game.prototype.isWon = function () {
    // move all the discs to the last or second tower
    return (this.towers[2].length == 3) || (this.towers[1].length == 3);
};

Game.prototype.move = function (startTowerIdx, endTowerIdx) {
    if (!this.isValidMove(startTowerIdx, endTowerIdx)) 
        return false;

    this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop())
    return true
};

module.exports = Game;
