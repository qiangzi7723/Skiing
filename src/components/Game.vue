<template>
    <section class='game-wrap'>
        <div id='canvas'>
            <i class='l'></i>
            <i class='r'></i>
        </div>
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
            position: relative;
        }
        .l{
            width: 50vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
        }
        .r{
            width: 50vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 50%;
        }
    }

</style>
