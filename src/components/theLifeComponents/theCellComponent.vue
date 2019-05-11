<template>
    <div class="square"
         v-bind:style="getColor"
         v-on:click="updateSquare">
    </div>
</template>

<script>

    export default {
        name: "theCellComponent",
        props: ['isAlive', 'xValue', 'yValue', 'gamePhase'],
        data: function () {
            return {
            }
        },
        methods: {
            updateSquare: function() {
                if (this.gamePhase === "setup") {
                    if (!this.isAlive) {
                        this.$emit('add-piece', {x: this.xValue, y: this.yValue});
                    } else {
                        this.$emit('remove-piece', {x: this.xValue, y: this.yValue});
                    }
                }
            }
        },
        computed: {
            getColor: function () {
                if (this.isAlive == true) {
                    return 'background-color: #0077af;';
                } else {
                    return 'background-color: white;';
                }
            },
        }
    }
</script>

<style scoped>
    .square {
        width: 20px;
        height: 20px;
        border: 1px solid grey;
        position: relative;
    }
    @media (max-width: 800px) {
        .square {
            width: 15px;
            height: 15px;
            /*padding-bottom: 40px;*/
            border: 1px solid grey;
            position: relative;
        }
    }

    @media (max-width: 600px) {
        .square {
            width: 15px;
            height: 15px;
            /*padding-bottom: 40px;*/
            border: 1px solid grey;
            position: relative;
        }
    }
</style>