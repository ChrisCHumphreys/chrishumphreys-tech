<template>
    <div class="columns is-h-scrollable">
        <div class="column">
            <div class="is-multiline is-centered row-holder"
                 v-for="row in boardHeight">
                <div class="level-item life-col">
                    <the-tile-component
                            class="life-row"
                            v-for="tile in boardWidth"
                            :x-value="tile"
                            :y-value="row"
                            :key="makeKey(row, tile)"
                            :game-phase="gamePhase"
                            :color="assignColorToTile(row, tile)"
                            :is-occupied="checkIfOccupied(tile, row)"
                            v-on:add-piece="broadcastAddPiece"
                            v-on:remove-piece="broadcastRemovePiece"
                            v-on:move-attempted="broadcastMoveAttempted">
                    </the-tile-component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TheTileComponent from "./theTileComponent";

    export default {
        name: "theBoardComponent",
        props: ["gamePhase", "boardHeight", "boardWidth", "occupiedSquares"],
        components: {
            TheTileComponent
        },
        data: function () {
            return {
            }
        },
        methods: {
            assignColorToTile: function (row, tile) {
                if ((row + tile) % 2 === 0) {
                    return "#006199";
                } else {
                    return "#da1852";
                }
            },
            makeKey: function (row, tile) {
                return (row.toString() + ', ' + tile.toString())
            },
            broadcastAddPiece(location) {
                this.$emit('add-piece', location);
            },
            broadcastRemovePiece(location) {
                this.$emit('remove-piece', location);
            },
            broadcastMoveAttempted(moveDetails) {
                this.$emit('move-attempted', moveDetails);
            },
            checkIfOccupied(tile, row) {
                let hasPiece = false;
                this.occupiedSquares.forEach(function(item) {
                    if (tile == item.x && row == item.y) {
                        hasPiece =  true;
                    }
                });
                return hasPiece;
            }
        },
    }
</script>

<style scoped>
    .is-h-scrollable {
        margin-top: 10px;
        white-space: nowrap;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        height: auto;
    }
    .life-col {
        flex-direction: row;
    }
    .life-row {
        flex-direction: row;
    }
    .row-holder {
        min-width: 100%;
        max-width: 100%;
    }

</style>