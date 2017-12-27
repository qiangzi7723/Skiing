let game,help;

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
        });

        game.state.start('preload');

        help = new GameHelp();
    }

    preload() {
        game.load.image('role', require('@/assets/img/role.png'));
        game.load.image('bg', require('@/assets/img/bg.png'));
        game.load.image('tileBg', require('@/assets/img/bga.png'));

        game.load.onLoadComplete.add(() => {
            game.state.start('create');
        })
    }

    create() {
        const tileBg = game.add.image(0, 0, 'tileBg');
        help.widthSize(tileBg);
        const role = new Role();
    }

}

class Role {
    constructor(){
        this.role=game.add.image(0, 0, 'role');
        this.initPhysics();
    }
    initPhysics() {
        game.physics.enable(this.role, Phaser.Physics.ARCADE);
        // console.log(this.role)
        // this.role.body.velocity.x=1;
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
