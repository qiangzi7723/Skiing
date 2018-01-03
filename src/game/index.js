let game,help,ground,player,coin;

let gameWidth,gameHeight;

// 游戏的配置表 数值的内容都在这里
const config={
    tileBgSpeed:-400,
    rotation:0.16,
    ground:{
        y:0.7
    },
    barrier:{
        height:0.1,
        x:1.2
    }
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

        game.load.atlasJSONArray("player", require('@/assets/img/game/player.png'), require('@/assets/img/game/player.json'));
        // game.load.image('player', require('@/assets/img/game/player.png'));
        game.load.image('bg', require('@/assets/img/game/bg.png'));
        game.load.image('tileBg', require('@/assets/img/game/bga.png'));
        game.load.image('ground',require('@/assets/img/game/ground.png'));

        game.load.image('coin',require('@/assets/img/game/coin.png'));
        game.load.image('fire',require('@/assets/img/game/fire.png'));
        game.load.image('bb',require('@/assets/img/game/bb.png'));

        game.load.image('bullet',require('@/assets/img/game/bullet.png'));

        game.load.onLoadComplete.add(() => {
            game.state.start('create');
        })
    }

    create() {
        // game.physics.startSystem(Phaser.Physics.ARCADE);


        new TileBg();
        new Ground();
        this.barriers=new BarrierControl();
        this.player=new Player();
        new Bullet(this.player);
    }

    update(){
        // game.physics.arcade.collide(coin, ground);
        // game.physics.arcade.collide(player, ground);

        // 待优化点，应该有自动回收的方案
        this.barriers.forEach(element => {
            element.forEachExists((b)=>{
                if(b.x<-200){
                    b.kill();
                }
            })
        });

    }

    render(){
        // game.debug.body(ground);
        // game.debug.body(this.player);
        // game.debug.body(this.barrier);
    }

}

class TileBg{
    constructor(){
        const tileBgHack=game.cache.getImage('tileBg');
        const s=gameHeight / tileBgHack.height;
        const tileBg = game.add.tileSprite(0, 0, gameWidth,gameHeight,'tileBg');
        tileBg.tileScale.setTo(s, s);
        tileBg.autoScroll(config.tileBgSpeed,0);

        game.stage.backgroundColor = '#124184';

    }
}

class BarrierControl{
    constructor(){
        this.barriersA=new Barrier('coin');
        this.barriersB=new Barrier('fire');
        this.barriersC=new Barrier('bb');
        this.barriers=[this.barriersA,this.barriersB,this.barriersC];

        game.time.events.loop(1500,this.generateBarrier,this)

        this.barrierRelativeY=gameHeight*(config.ground.y-config.barrier.height); // 障碍物相对于斜坡的位置

        return this.barriers;
    }
    generateBarrier(){
        const r=game.rnd.integerInRange(0, 2);
        const curBarrier=this.barriers[r].getFirstDead();
        if(curBarrier){
            curBarrier.reset(gameWidth*config.barrier.x,this.barrierRelativeY+gameWidth*config.barrier.x*config.rotation);
            curBarrier.body.velocity.y=config.tileBgSpeed*config.rotation;
            curBarrier.body.velocity.x=config.tileBgSpeed;
        }
    }
}

class Barrier{
    constructor(type){
        // this.coin=game.add.sprite(gameWidth*0.6,gameHeight*0.8,'coin');
        // help.heightSize(this.coin,0.1);
        // game.physics.enable(this.coin, Phaser.Physics.ARCADE);
        // this.coin.body.velocity.y=config.tileBgSpeed*config.rotation;
        // this.coin.body.velocity.x=config.tileBgSpeed;

        // return this.coin;

        this.barriers=game.add.group();
        this.barriers.enableBody = true;
        this.barriers.createMultiple(3,type);

        this.barriers.forEachDead((a)=>{
            help.heightSize(a,config.barrier.height);
            a.rotation=config.rotation;
        })

        return this.barriers;

    }
}

class Bullet{
    constructor(player){
        this.weapon=game.add.weapon(10,'bullet');
        this.weapon.bulletKillType=Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 400;
        this.weapon.fireRate = 60;
        this.weapon.trackSprite(player, 0, 0,true);

        this.onBulletInput();

    }
    onBulletInput(){
        $('.r').on('touchstart',()=>{
            this.weapon.fire();
        })
    }
}

class Ground{
    constructor(){
        ground=game.add.tileSprite(0,gameHeight*config.ground.y,gameWidth*1.1,gameHeight*0.3,'ground');
        ground.rotation=config.rotation;
        ground.autoScroll(config.tileBgSpeed,0);
    }
}

class Player {
    constructor(){
        this.positionY=gameHeight*0.6

        this.player=game.add.sprite(gameWidth*0.1,this.positionY,'player');
        this.player.animations.add("skiing", [0, 1], 5, true);
        this.player.play('skiing');

        help.heightSize(this.player,0.2);

        this.initPhysics();
        this.onJumpInput();

        this.canJump=true;


        return this.player;
    }
    initPhysics() {
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.rotation=config.rotation;
    }
    onJumpInput(){
        $('.l').on('touchstart',()=>{
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
            const tweenUp=game.add.tween(this.player).to({y:gameHeight*0.3},200);
            const tweenDown=game.add.tween(this.player).to({y:this.positionY},200);

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
