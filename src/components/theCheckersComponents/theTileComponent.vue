<template>
    <div class="square"
         :style="getColor"
         v-on:click="updateSquare">
        <div v-if="isOccupied" class="checker"></div>
    </div>
</template>

<script>
    export default {
        name: "theTileComponent",
        props: ['color', 'xValue', 'yValue', 'gamePhase', 'isOccupied'],
        data: function () {
            return {
            }
        },
        methods: {
            updateSquare: function() {
                if (this.gamePhase === "setup") {
                    if (this.yValue > 4) {
                        if (this.isOccupied) {
                            this.$emit('remove-piece', {x: this.xValue, y: this.yValue});
                        } else {
                            this.$emit('add-piece', {x: this.xValue, y: this.yValue});
                        }
                    }
                } else {
                    this.$emit('move-attempted', {
                        "column": this.xValue,
                        "row": this.yValue,
                        "isOccupied": this.isOccupied,
                    })
                }
            },
        },
        computed: {
            getColor: function () {
                if (this.yValue == 4) {
                    return 'background-color: ' + this.color + '; border-bottom: 2px solid black;';
                }
                if (this.yValue == 5) {
                    return 'background-color: ' + this.color + '; border-top: 2px solid black;';
                } else {
                    return 'background-color: ' + this.color + ';';
                }
            },
        }
    }
</script>

<style scoped>
    .square {
        width: 40px;
        height: 40px;
        border: 1px solid grey;
        position: relative;
    }

    .checker {
        background-color: black;
        width: 25px;
        height: 25px;
        padding-bottom: auto;
        position: absolute;
        margin: 7px auto auto 6px;
        border-radius: 60px;
    }
    @media (max-width: 800px) {
        .square {
            width: 15px;
            height: 15px;
            border: 1px solid grey;
            position: relative;
        }

        .checker {
            background-color: black;
            width: 10px;
            height: 10px;
            padding-bottom: auto;
            position: absolute;
            margin: 1px auto auto 1px;
            border-radius: 60px;
        }
    }

</style>