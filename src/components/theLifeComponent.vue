<template>
    <div style="overflow-x: auto">
        <div class="game-wrapper">
            <section id="controls">
                <div class="tile is-ancestor">
                    <div class="tile is-12">
                        <div class="tile is-4 is-parent">
                            <article class="tile is-child notification is-primary">
                                <div class="control">
                                    <p class="title">
                                        Game Phase
                                    </p>
                                    <label class="radio">
                                        <input type="radio" value="setup" v-model="gamePhase" disabled>
                                        Setup
                                    </label>
                                    <label class="radio">
                                        <input type="radio" value="run" v-model="gamePhase" disabled>
                                        Running
                                    </label>
                                    <a class="button start-button is-primary is-inverted"
                                       v-on:click="startSimulation">
                                        {{ buttonText }}
                                    </a>
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
                                        <a class="button is-primary is-inverted resize-button" v-on:click="resetSize">Resize/Clear
                                            Board</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div class="tile is-4 is-parent">
                            <article class="tile is-child notification is-primary">
                                <p class="title">Living Cells: {{ getScore }}</p>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <the-life-board
                :height="height"
                :width="width"
                :living-cells="livingSquares"
                :game-phase="gamePhase"
                class="board"
                v-on:add-piece="addLivingCell"
                v-on:remove-piece="killCell">
        </the-life-board>
    </div>
</template>

<script>
    import TheLifeBoard from './theLifeComponents/theLifeBoard';
    export default {
        name: "theLifeComponent",
        components: {TheLifeBoard},
        data: function () {
            return {
                newHeight: 30,
                newWidth: 30,
                height: 30,
                width: 30,
                gamePhase: "setup",
                livingSquares: [],
                running: "",
                buttonText: "Start Simulation",
            }
        },
        methods: {
            resetSize() {
                this.height = parseInt(this.newHeight);
                this.width = parseInt(this.newWidth);
                this.livingSquares = [];
            },
            addLivingCell: function(coords) {
                this.livingSquares.push({x: coords.x, y:coords.y})
            },
            killCell: function(coords) {
                let newOccupied = this.livingSquares.filter(function(item){
                    if ((item.x !== coords.x) || (item.y !== coords.y)) {
                        return item;
                    }
                });
                this.livingSquares = newOccupied;
            },
            startSimulation: function() {
                if (this.gamePhase == "setup") {
                    this.gamePhase = "run";
                    this.buttonText = "Stop Simulation";
                    this.running = setInterval(this.processOneGeneration, 500);
                } else {
                    this.gamePhase = "setup";
                    this.buttonText = "Start Simulation";
                    clearInterval(this.running);
                }
            },
            processOneGeneration: function () {
                if (this.livingSquares.length == 0) {
                    this.startSimulation();
                }
                let updatedCellArray = [];
                for (var x = 1; x <= this.width; x++) {
                    for (var y = 1; y <= this.height; y++) {
                        if ((this.getNeighborCount(x, y) == 3) && (!this.cellIsAlive(x, y))) {
                            updatedCellArray.push({x, y});
                        }
                        else if (((this.getNeighborCount(x, y) == 2) || (this.getNeighborCount(x, y) == 3)) && (this.cellIsAlive(x, y))) {
                            updatedCellArray.push({x, y});
                        }
                    }
                }
                this.livingSquares = updatedCellArray;
            },
            getNeighborCount: function(x, y) {
                let neighbors = this.livingSquares.filter(function(item){
                    if (item.y == y -1 && ((item.x == x) || (item.x == x-1) || (item.x == x + 1))) {
                        return item;
                    }
                    if (item.y == y && ((item.x == x-1) || (item.x == x + 1))) {
                        return item;
                    }
                    if (item.y == y + 1 && ((item.x == x) || (item.x == x - 1) || (item.x == x + 1))) {
                        return item;
                    }
                });
                return neighbors.length;
            },
            cellIsAlive: function (x, y) {
                let alive = false;
                for (let cell of this.livingSquares) {
                    if ((x == cell.x) && (y == cell.y)) {
                        alive = true;
                    }
                }
                return alive;
            }
        },
        computed: {
            getScore: function () {
                return this.livingSquares.length;
            }
        }
    }
</script>

<style scoped>
    .game-wrapper {
        margin: 30px;
    }
    .button {
        margin-top: 5px;
    }
    .radio {
        width: 100%;
        margin: 0px;
    }
</style>