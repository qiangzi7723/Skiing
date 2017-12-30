<template>
    <section class='game-wrap'>
        <div id='canvas'></div>
    </section>
</template>

<script>
    import Game from '../game/index';
    export default {
        mounted() {
            const game = new Game();
            game.init();
        }
    };

</script>

<style lang='scss'>
    @import '../assets/scss/extend.scss';
    .game-wrap {
        width: 100vw;
        height: 100vh;
        #canvas {
            width: 100vw;
            height: 100vh;
            canvas {
            }
        }
    }

</style>
