let game,help,ground,role;

class Game {
    constructor() {}

    initData() {
        const c = $('#canvas');
        this.w = c.width();
        this.h = c.height();
    }

    init() {
        this.initData();

        game = new Phaser.Game(this.w, this.h, Phaser.WEBGL, 'canvas', {
            preload: this.preload.bind(this), // 重新绑定this指向
            create: this.create.bind(this),
            render:this.render.bind(this)
        });

        game.state.start('preload');

        help = new GameHelp();
    }

    preload() {
        game.load.image('role', require('@/assets/img/role.png'));
        game.load.image('bg', require('@/assets/img/bg.png'));
        game.load.image('tileBg', require('@/assets/img/bga.png'));
        game.load.image('ground',require('@/assets/img/ground.png'));

        game.load.onLoadComplete.add(() => {
            game.state.start('create');
        })
    }

    create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        const tileBgHack=game.cache.getImage('tileBg');
        const s=this.w / tileBgHack.width;
        const tileBg = game.add.tileSprite(0, 0, this.w,this.h,'tileBg');
        tileBg.tileScale.setTo(s, s);
        tileBg.autoScroll(-100,0)
        // const role = new Role();

        new Ground();
        new Role();
    }

    render(){
        game.debug.body(ground);
        game.debug.body(role);
    }

}

class Ground{
    constructor(){
        ground=game.add.tileSprite(0,300,game.world.width,100,'ground');
        // game.physics.enable(ground, Phaser.Physics.ARCADE); //开启地面的物理系统
        game.physics.enable(ground, Phaser.Physics.ARCADE); //开启地面的物理系统
        
        ground.body.immovable = true; //让地面在物理环境中固定不动
        ground.rotation=0.1;
        ground.autoScroll(-100,0);
        console.log(ground);
    }
}

class Role {
    constructor(){
        // this.role=new Phaser.Image(game,0, 0, 'role');
        // this.role=game.add.image();
        // console.log(game.stage.add(this.role,-1));
        // game.world.rotation = 0.1;
        // game.stage.rotation=0.1;
        // console.log(game.stage)
        role=game.add.sprite(0,0,'role');
        this.initPhysics();
        game.stage.backgroundColor = '#124184';

    }
    initPhysics() {
        game.physics.enable(role, Phaser.Physics.ARCADE);
        // console.log(this.role)
        // this.role.body.velocity.x=10;
        // role.body.velocity.x=10;
        role.body.setSize(0,0,100,330)
        role.body.gravity.y=100;
        role.rotation=0.1;
        role.body.collideWorldBounds = true;
    }
}

class GameHelp {
    cover(entity) {
        entity.scale.setTo(game.world.width / entity.width);
    }
    widthSize(entity, v = 1) {
        // 参数v是占屏幕宽度的百分比
        entity.scale.setTo(game.world.width / entity.width * v);
    }
}

export default Game;
