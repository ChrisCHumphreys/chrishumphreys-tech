1<template>
    <div class="game-wrapper">
        <h1 class="title">
            {{ title }}
        </h1>
        <section>
            <div class="tile is-ancestor">
                <div class="tile is-12">
                    <div class="tile is-4 is-parent">
                        <article class="tile is-child notification is-primary">
                            <div class="control">
                                <p class="title">
                                    Game Phase
                                </p>
                                <label class="radio">
                                    <input type="radio" value="setup" v-model="gamePhase">
                                    Setup
                                </label>
                                <label class="radio">
                                    <input type="radio" value="play" v-model="gamePhase">
                                    Play
                                </label>
                            </div>
                        </article>
                    </div>
                    <div class="tile is-4 is-parent">
                        <article class="tile is-child notification is-primary">
                            <p class="title">Board Size</p>
                            <div class="field">
                                <div class="control">
                                    <label for="height">Height</label>
                                    <input class="input is-primary" id="height" type="text"
                                           v-model="newHeight">
                                    <label for="width">Width</label>
                                    <input class="input is-primary" id="width" type="text"
                                           v-model="newWidth">
                                    <a class="button is-success resize-button" v-on:click="resetSize">Resize/Clear Board</a>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div class="tile is-4 is-parent" v-if="!showError">
                        <article class="tile is-child notification is-primary">
                            <p class="title">Current Score: {{ currentScore }}</p>
                        </article>
                    </div>
                    <div class="tile is-2 is-parent" v-if="showError">
                        <article class="tile is-child notification is-danger">
                            <p class="title">Current Score: {{ currentScore }}</p>
                            <p>{{ errorText }}</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <the-board-component
                    :game-phase="gamePhase"
                    :board-height="boardHeight"
                    :board-width="boardWidth"
                    :occupied-squares="occupiedSquares"
                    v-on:add-piece="addPieceToCheckersArray"
                    v-on:remove-piece="removeFromCheckersArray"
                    v-on:move-attempted="validateAndExecuteMove"/>
        </section>
    </div>
</template>

<script>
    import theBoardComponent from './theCheckersComponents/theBoardComponent'

    export default {
        props: {'title': String},
        name: "theCheckersComponent",
        components: {
            theBoardComponent,
        },
        data: function () {
            return {
                'gamePhase': "setup",
                'boardHeight': 30,
                'boardWidth': 30,
                'newHeight': 30,
                'newWidth': 30,
                'occupiedSquares': [],
                'errorText': "Unknown Error",
                'showError': false,
                'moveBeginning': {
                    x: -1,
                    y: -1,
                },
                'moveEnd': {
                    x: -1,
                    y: -1,
                },
                'pieceBeingJumped': {
                    x: -1,
                    y: -1,
                }
            }
        },
        methods: {
            resetSize() {
                this.boardHeight = parseInt(this.newHeight, 10);
                this.boardWidth = parseInt(this.newWidth, 10);
                this.resetMove();
                this.gamePhase = "setup";
                this.occupiedSquares = [];
            },
            addPieceToCheckersArray(location) {
                this.occupiedSquares.push(location);
            },
            removeFromCheckersArray(location) {
                let newOccupied = this.occupiedSquares.filter(function(item){
                    if ((item.x !== location.x) || (item.y !== location.y)) {
                        return item;
                    }
                });
                this.occupiedSquares = newOccupied;
            },
            validateAndExecuteMove(moveDetails) {
                this.clearErrors();
                let tileBeingChecked = {};
                tileBeingChecked.x = moveDetails.column;
                tileBeingChecked.y = moveDetails.row;
                if (this.moveBeginning.x === -1) {
                    this.validateAndMakeBeginningMove(tileBeingChecked);
                } else if (this.moveEnd.x === -1) {
                    this.validateAndMakeSecondMove(tileBeingChecked);
                } else {
                    this.resetMove();
                }
            },
            validateAndMakeBeginningMove(tileBeingChecked) {
                if (this.tileIsOccupied(tileBeingChecked)) {
                    this.setMoveBegin(tileBeingChecked.x, tileBeingChecked.y)
                } else {
                    this.setMoveBegin(-1, -1);
                    this.createError('Invalid Move - Square is Empty')
                }
            },
            validateAndMakeSecondMove(tileBeingChecked) {
                if (this.tileIsOccupied(tileBeingChecked)) {
                    this.resetMove();
                    this.createError('Invalid Move - Must Move To An Empty Square');
                } else {
                    this.setMoveEnd(tileBeingChecked.x, tileBeingChecked.y);
                    if (this.moveIsValid()) {
                        this.removeFromCheckersArray(this.pieceBeingJumped);
                        this.addPieceToCheckersArray({x: this.moveEnd.x, y: this.moveEnd.y});
                        this.removeFromCheckersArray(this.moveBeginning);
                        this.resetMove();
                    } else {
                        this.resetMove();
                    }
                }
            },
            moveIsValid() {
                if (!this.isValidDistance()) {
                    this.createError('Invalid Move!');
                    return false;
                }
                if (!this.isJumping()) {
                    this.createError('Must Jump another Piece');
                    return false;
                }
                return true;
            },
            tileIsOccupied(tileBeingChecked) {
                let checkerFound = false;
                this.occupiedSquares.forEach(knownTile => {
                    if (knownTile.x === tileBeingChecked.x && knownTile.y === tileBeingChecked.y) {
                        checkerFound = true;
                    }
                });
                return checkerFound;
            },
            setMoveBegin(x, y) {
              this.moveBeginning.x = x;
              this.moveBeginning.y = y;
            },
            setMoveEnd(x, y) {
                this.moveEnd.x = x;
                this.moveEnd.y = y;
            },
            setBeingJumped(x, y) {
                this.pieceBeingJumped.x = x;
                this.pieceBeingJumped.y = y;
            },
            isValidDistance() {
                let distanceMoved = 0;
                if(this.moveBeginning.x === this.moveEnd.x) {
                    if (this.moveBeginning.y - this.moveEnd.y < 0) {
                        distanceMoved = (this.moveBeginning.y - this.moveEnd.y) * -1;
                    } else {
                        distanceMoved = (this.moveBeginning.y - this.moveEnd.y);
                    }
                    if (distanceMoved !== 2) {
                        return false;
                    }
                }
                if (this.moveBeginning.y === this.moveEnd.y) {
                    if (this.moveBeginning.x - this.moveEnd.x < 0) {
                        distanceMoved = (this.moveBeginning.x - this.moveEnd.x) * -1;
                    } else {
                        distanceMoved = (this.moveBeginning.x - this.moveEnd.x);
                    }
                    if (distanceMoved !== 2) {
                        return false;
                    }
                }
                if (this.moveBeginning.x !== this.moveEnd.x && this.moveBeginning.y !== this.moveEnd.y) {
                    return false;
                }
                return true;
            },
            isJumping() {
                let tileToJump = {};
                if (this.moveBeginning.x < this.moveEnd.x) {
                    tileToJump = {x: this.moveBeginning.x + 1, y: this.moveBeginning.y};
                    if (!this.tileIsOccupied(tileToJump)) {
                        return false;
                    }
                }
                if (this.moveBeginning.x > this.moveEnd.x) {
                    tileToJump = {x: this.moveBeginning.x - 1, y: this.moveBeginning.y};
                    if (!this.tileIsOccupied(tileToJump)) {
                        return false;
                    }
                }
                if (this.moveBeginning.y < this.moveEnd.y) {
                    tileToJump = {x: this.moveBeginning.x, y: this.moveBeginning.y + 1};
                    if (!this.tileIsOccupied(tileToJump)) {
                        return false;
                    }
                }
                if (this.moveBeginning.y > this.moveEnd.y) {
                    tileToJump = {x: this.moveBeginning.x, y: this.moveBeginning.y - 1};
                    if (!this.tileIsOccupied(tileToJump)) {
                        return false;
                    }
                }
                this.pieceBeingJumped = tileToJump;
                return true;
            },
            resetMove() {
                this.setMoveBegin(-1, -1);
                this.setMoveEnd(-1, -1);
                this.setBeingJumped(-1, -1);
            },
            createError(errorText) {
                this.errorText = errorText;
                this.showError = true;
            },
            clearErrors() {
                this.errorText = "Unknown Error";
                this.showError = false;
            }
        },
        computed: {
            currentScore: function () {
                let highScore = 0;
                this.occupiedSquares.forEach(function (item) {
                    if (item.y < 5) {
                        let tempScore = 5 - item.y;
                        if (tempScore > highScore) {
                            highScore = tempScore;
                        }
                    }
                });
                return highScore;
            }
        },
    }
</script>

<style scoped>

    .game-wrapper {
        margin: 30px;
        overflow: auto;
        overflow-y: hidden;
        justify-content: center;
        align-items: center;
    }

    .resize-button {
        margin-top: 5px;
    }

</style>