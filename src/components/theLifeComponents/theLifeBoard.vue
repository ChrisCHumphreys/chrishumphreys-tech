<template>
    <div class="board-wrapper">
    <div class="is-multiline is-grouped-multiline row-holder" v-for="row in height">
        <div class="level-item life-col">
            <the-cell-component
                    class="life-row"
                v-for="tile in width"
                :x-value="tile"
                :y-value="row"
                :is-alive="checkIfLiving(row, tile)"
                :key="makeKey(row, tile)"
                v-on:add-piece="broadcastAddPiece"
                v-on:remove-piece="broadcastRemovePiece"
                :game-phase="gamePhase">
            </the-cell-component>
        </div>
    </div>
    </div>
</template>

<script>
    import TheCellComponent from './theCellComponent';
    export default {
        name: "theLifeBoard",
        props: ["height", "width", "livingCells", "gamePhase"],
        components: {
            TheCellComponent,
        },
        data: function() {
            return {
            }
        },
        methods: {
            makeKey: function (row, tile) {
                return (row.toString() + ', ' + tile.toString())
            },
            broadcastAddPiece: function (addMessage) {
                this.$emit('add-piece', {x: addMessage.x, y: addMessage.y});
            },
            broadcastRemovePiece: function (removeMessage) {
                this.$emit('remove-piece', {x: removeMessage.x, y: removeMessage.y});
            },
            checkIfLiving: function (row, tile) {
                let living = false;
                this.livingCells.forEach(function(item) {
                    if (tile == item.x && row == item.y) {
                        living =  true;
                    }
                });
                return living;
            },
        },
        computed: {

        }
    }
</script>

<style scoped>
    .board-wrapper {
        margin-top: 10px;
        display: inline-flex;
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