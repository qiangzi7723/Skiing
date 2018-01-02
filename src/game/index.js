let game,help,ground,role,coin;

let gameWidth,gameHeight;

const paramConfig={
    tileBgSpeed:-400,
    rotation:0.16
}

class Game {
    constructor() {
        // 针对DPR大于1的手机进行高倍缩放
        this.defaultDpr=1;
        this.defaultDpr=window.devicePixelRatio;
    }

    resizeDPR(){

        const c = $('#canvas');
        gameWidth=this.w = c.width();
        gameHeight=this.h = c.height();

        if(this.defaultDpr>=2){
            gameWidth=this.w*=2;
            gameHeight=this.h*=2;
        }
    }

    resizeCanvasDPR(){
        if(this.defaultDpr>=2){
            $('canvas').width(this.w/2);
            $('canvas').height(this.h/2);
        }
    }

    init() {
        this.resizeDPR();

        game = new Phaser.Game(this.w, this.h, Phaser.WEBGL, 'canvas', {
            preload: this.preload.bind(this), // 重新绑定this指向
            create: this.create.bind(this),
            render:this.render.bind(this),
            update:this.update.bind(this)
        });

        game.state.start('preload');

        help = new GameHelp();
    }

    preload() {
        this.resizeCanvasDPR();

        game.load.image('role', require('@/assets/img/role.png'));
        game.load.image('bg', require('@/assets/img/bg.png'));
        game.load.image('tileBg', require('@/assets/img/bga.png'));
        game.load.image('ground',require('@/assets/img/ground.png'));
        game.load.image('coin',require('@/assets/img/coin.png'));

        game.load.onLoadComplete.add(() => {
            game.state.start('create');
        })
    }

    create() {
        // game.physics.startSystem(Phaser.Physics.ARCADE);


        new TileBg();
        new Ground();
        new BarrierControl();
        this.role=new Role();
    }

    update(){
        // game.physics.arcade.collide(coin, ground);
        // game.physics.arcade.collide(role, ground);
    }

    render(){
        // game.debug.body(ground);
        // game.debug.body(this.role);
        // game.debug.body(this.barrier);
    }

}

class TileBg{
    constructor(){
        const tileBgHack=game.cache.getImage('tileBg');
        const s=gameHeight / tileBgHack.height;
        const tileBg = game.add.tileSprite(0, 0, gameWidth,gameHeight,'tileBg');
        tileBg.tileScale.setTo(s, s);
        tileBg.autoScroll(paramConfig.tileBgSpeed,0);

        game.stage.backgroundColor = '#124184';

    }
}

class BarrierControl{
    constructor(){
        this.barrier=new Barrier();
        game.time.events.loop(500,this.generateBarrier,this)
    }
    generateBarrier(){
        const curBarrier=this.barrier.getFirstDead();
        if(curBarrier){
            curBarrier.reset()
        }
    }
}

class Barrier{
    constructor(){
        // this.coin=game.add.sprite(gameWidth*0.6,gameHeight*0.8,'coin');
        // help.heightSize(this.coin,0.1);
        // game.physics.enable(this.coin, Phaser.Physics.ARCADE);
        // this.coin.body.velocity.y=paramConfig.tileBgSpeed*paramConfig.rotation;
        // this.coin.body.velocity.x=paramConfig.tileBgSpeed;

        // return this.coin;

        this.barriers=game.add.group();
        this.barriers.createMultiple(5,'coin');

        // this.barriers.forEachExists((a)=>{
        //     console.log(a)
        // })

        // this.barriers.forEachDead((a)=>{
        //     console.log(a,'DEAD')
        // })

        return this.barriers;

    }
}

class Ground{
    constructor(){
        ground=game.add.tileSprite(0,gameHeight*0.7,gameWidth*1.1,gameHeight*0.3,'ground');
        ground.rotation=paramConfig.rotation;
        ground.autoScroll(paramConfig.tileBgSpeed,0);
    }
}

class Role {
    constructor(){
        this.positionY=gameHeight*0.6

        this.role=game.add.sprite(gameWidth*0.1,this.positionY,'role');
        help.heightSize(this.role,0.2);

        this.initPhysics();
        this.onJumpInput();

        this.canJump=true;

        return this.role;
    }
    initPhysics() {
        game.physics.enable(this.role, Phaser.Physics.ARCADE);
        this.role.rotation=paramConfig.rotation;
    }
    onJumpInput(){
        $('.l').on('tap',()=>{
            this.jump();
        })
        // game.input.onTap.add(()=>{
        //     console.log(2)
        //     this.jump();
        // })
    }
    jump(){
        if(this.canJump){
            this.canJump=false;
            const tweenUp=game.add.tween(this.role).to({y:gameHeight*0.3},100);
            const tweenDown=game.add.tween(this.role).to({y:this.positionY},100);

            tweenUp.chain(tweenDown);
            tweenUp.start();

            tweenDown.onComplete.add(()=>{
                this.canJump=true;
            })
        }
    }
}

class GameHelp {
    cover(entity) {
        entity.scale.setTo(gameWidth / entity.width);
    }
    widthSize(entity, v = 1) {
        // 参数v是占屏幕宽度的百分比
        entity.scale.setTo(gameWidth / entity.width * v);
    }
    heightSize(entity, v = 1) {
        // 参数v是占屏幕宽度的百分比
        entity.scale.setTo(gameHeight / entity.height * v);
    }
}

export default Game;
