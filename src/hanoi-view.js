/*Connect with css with adding and removing classes
  Connect with node.js (game) with instance variables
  Connect with browser Dom with JQuery  .eq(), .index(), find(), children(),...
  */

class View {
    constructor(hanoiGame, $domEl) {
        this.game = hanoiGame;
        this.$domEl = $domEl;
        // install click handler on each pile
        /* when calling a class function from OUTSIDE the class scope, MUST bind it to the 
        class instance
        */ 
        this.$domEl.on('click', 'ul', this.clickTowerHandler.bind(this))
        this.selectedFromTowerId = null;

        this.setupTowers()
        this.render()
    }
}

View.prototype.setupTowers = function () { 
    /*
    We're setting up the skeleton for our towers
    here. It consist of three <ul> elements,
    each with three nested <li>s.
    We want the <ul>s to be side by side, so their parent
    `.hanoi` is display: flex. The <li> elements all will be
    invisible by default. Adding a disk class to
    them will make them visible.
    */

    this.$domEl.empty();
    let $tower, $disk;

    for (let towerId= 0; towerId < 3; towerId++) {
        $tower = $("<ul>");
        this.$domEl.append($tower);

        for (let diskId = 0; diskId < 3; diskId++) {
            $disk = $("<li>")
            $tower.append($disk)
        }
    } 
}

View.prototype.render = function () {  
    // remove, select, remove childrenClasses, add childrenClasses
    /*
    Rather than removing all our elements from the page
    and building them up again, we are removing only the
    classes and re-adding them as necessary. This is a
    more light-weight approach and will speed up the
    redrawing in the browser.
    */
    $towers = this.$domEl.find("ul");
    $towers.removeClass(); 

    if(this.selectedFromTowerId !== null) {
        $towers.eq(this.selectedFromTowerId).addClass("selected")
    }
    
    this.game.towers.forEach((tower, towerId) => { 
        $disks = $towers.eq(towerId).children();
        $disks.removeClass()
        tower.forEach((diskSize, diskId) => {
        /*
        Since our disks are stacked from bottom to top
        as [3, 2, 1], we have to select from the back
        of our jQuery object, using negative indices.
        in array: (first apper, Last put) 3, 2, 1 
        in ul: (first) 1, 2, 3
        */
            $disks.eq(-1 * (diskId + 1)).addClass(`disk-${diskSize}`)
        });
    });
}

View.prototype.move = function (event, toTowerId) {

    if (!this.game.move(this.selectedFromTowerId, toTowerId)) {
        alert(`Invalid Move !`)
    }
   
    this.selectedFromTowerId = null;
    
    if (this.game.isWon()){
        // Remove click handler
        this.$domEl.off('click');
        this.$domEl.addClass('game-over')
        alert(`Congratulations >> YOU WON the HANOI !`)
    } 
}

View.prototype.clickTowerHandler = function (event) {
    let toTowerId = $(event.currentTarget).index();

    if (this.selectedFromTowerId !== null) { // second click
        this.move(event, toTowerId)
        console.log("second click")
        console.log("After second click", this.selectedFromTowerId)
    } else {  // first click .. select tower to move from
        this.selectedFromTowerId = toTowerId
        console.log("first click")
        console.log("selected Id", toTowerId)
    }

    this.render()
}

module.exports = View;