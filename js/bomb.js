let bombeffect = 'pic/Explosion.png';
let bombpic = {
    0: { url: 'pic/bomb.png' },
    1: { url: 'pic/bomb1.png' }
};
//let bombSum = new Array();
let bombArray, bombArea = Game.get2dArray(map.row, map.col, 0);


class BombMap {
    constructor(_rows, _cols) {
        this.row = _rows;
        this.col = _cols;
        this.map = Array(_rows).fill(0).map(x => Array(_cols).fill(null));
    }

    isIn(x, y) {
        if ((x > -1 && x < this.row) && (y > -1 && y < this.col) && this.map[x][y] instanceof Bomb)
            return 1;
        else
            return 0;
    }

    del(x, y) {
        this.map[x][y] = null;
    }
}

let bombMap = new BombMap(13, 15);


class bd {
    constructor(_level) {
        this.up = _level;
        this.down = _level;
        this.left = _level;
        this.right = _level;
        this.upEffects = new Array();
        this.downEffects = new Array();
        this.leftEffects = new Array();
        this.rightEffects = new Array();
        this.centerEffects = new Array();
        this.allEffects = new Array();
    }
}

class Bomb {
    constructor(_x, _y, _level, _player) {
        bombMap.map[_x][_y] = this;
        this.player = _player;
        this.x = _x;
        this.y = _y;
        this.level = _level; //威力
        this.time = 0; //炸弹未爆炸动画时间
        this.boomtime = 0; //爆炸时间
        this.die = false; //爆炸完毕b
        this.bombeffects = new Array(); //爆炸范围数组
        this.bd = new bd(_level); //爆炸贴图类
        this.player.nowbombnum++; //玩家已经使用的炸弹数
        this.startStop = false; //开始
        this.moving = false; //正在移动
        this.distance = 0; //距离
        this.moveTrue = false; //能够踢
        this.init(_x, _y);
        Game.bombs.push(this);
    }

    init(x, y) { //初始化贴图
        this.bmp = new Bitmap(bombpic[0].url);
        this.bmp.offset = new Pos(4, 36);
        this.bmp.pos = new Pos(y * 40 - 0.5, x * 40 - 2);
        this.bmp.size = new Size(44, 41);
        this.bmp.Zindex = (x + 1) * 3;
        this.bmp.cover = this.player.bmp.cover;
    }

    update = () => {
        let upt = Math.floor(this.time / 11)
        if (upt < 15) {
            let n = upt % 3;
            this.bmp.divide.x = n * 44;
        }
        if (upt >= 15) {
            this.boomUpdate();
        }
        this.time++;
    }

    boomUpdate = () => {//启动爆炸
        let bombt = Math.floor(this.boomtime / 2)
        if (this.boomtime == 0) {
            this.bmp.visible = false;
            bombMap.del(this.x, this.y);
            this.limitEffect(this.x, this.y)
            this.searchbomb(this.x, this.y)
            this.createEffect();
            this.boom();
            this.player.nowbombnum--;
        }

        else if (0 <= bombt && bombt < 15) {
            this.changeEffect(bombt);
        }

        else if (bombt == 15) {
            this.deleteEffect();
            this.die = true;
            return;
        }
        this.boomtime++;
    }

    searchbomb = (x, y) => {//找其它炸弹
        Game.bombs.forEach((t) => {
            let isXline = (t.x == x && (t.y > y ? (t.y - y) <= this.bd.right + 1 : (y - t.y) <= this.bd.left + 1))
            let isYline = (t.y == y && (t.x > x ? (t.x - x) <= this.bd.down + 1 : (x - t.x) <= this.bd.up + 1))
            let istime = this.time > t.time
            if ((isXline || isYline) && istime)
                t.time = this.time;
        })
    }

    createEffect = () => {//创建爆炸水波贴图
        for (let i = 0; i < this.bd.up; i++) {
            let bmp = new Bitmap(bombeffect);
            bmp.Zindex = 1;
            bmp.size = new Size(40, 40);
            bmp.offset = new Pos(4, 36);
            this.bd.upEffects.push(bmp);
            this.bd.allEffects.push(bmp);
        }

        for (let i = 0; i < this.bd.down; i++) {
            let bmp = new Bitmap(bombeffect);
            bmp.Zindex = 1;
            bmp.size = new Size(40, 40);
            bmp.offset = new Pos(4, 36);
            this.bd.downEffects.push(bmp);
            this.bd.allEffects.push(bmp);
        }

        for (let i = 0; i < this.bd.left; i++) {
            let bmp = new Bitmap(bombeffect);
            bmp.Zindex = 1;
            bmp.size = new Size(40, 40);
            bmp.offset = new Pos(4, 36);
            this.bd.leftEffects.push(bmp);
            this.bd.allEffects.push(bmp);
        }

        for (let i = 0; i < this.bd.right; i++) {
            let bmp = new Bitmap(bombeffect);
            bmp.Zindex = 1;
            bmp.size = new Size(40, 40);
            bmp.offset = new Pos(4, 36);
            this.bd.rightEffects.push(bmp);
            this.bd.allEffects.push(bmp);
        }

        let bmp = new Bitmap(bombeffect);
        bmp.Zindex = 1;
        bmp.size = new Size(40, 40);
        bmp.offset = new Pos(4, 36);
        this.bd.centerEffects.push(bmp);
        this.bd.allEffects.push(bmp);
    }

    jugdeLimit(x, y) {
        let res = false;
        // console.log(x, y)
        if (bombMap.isIn(x, y)) {
            res = true;
        }
        else if (map.isBlock(new Pos(x, y))) {
            let item = map.value(x, y);
            if (item.property.canBomb) {
                if (item.type == 0)
                    res = true;
                bombArea[x][y] = 1;
            }
            else
            res = true;
        }
        return res;
    }

    limitEffect = (x, y) => { //调整爆炸的范围
        for (let i = 1; i <= this.level; i++) {
            if ((i - 1) < this.bd.up && ((x - i > -1))) {
                if (this.jugdeLimit(x - i, y) && (i - 1) < this.bd.up)
                    this.bd.up = i - 1;
            }

            if ((i - 1) < this.bd.down && ((x + i < BlockMaps.length))) {
                if (this.jugdeLimit(x + i, y) && (i - 1) < this.bd.down)
                    this.bd.down = i - 1;
            }

            if ((i - 1) < this.bd.left && ((y - i > -1))) {
                if (this.jugdeLimit(x, y - i) && (i - 1) < this.bd.left)
                    this.bd.left = i - 1;
            }

            if ((i - 1) < this.bd.right && ((y + i < BlockMaps[0].length))) {
                if (this.jugdeLimit(x, y + i) && (i - 1) < this.bd.right)
                    this.bd.right = i - 1;
            }
        }
        this.jugdeLimit(x, y);
    }

    changeEffect = (n) => {//改变水波贴图
        for (let i = 0; i < this.bd.up; i++) {
            let r1 = i + 1;
            this.bd.upEffects[i].pos = new Pos(this.y * 40 - 0.5, (this.x - r1) * 40 - 2);
            this.bd.upEffects[i].divide = new Pos(n * 40, 0 * 40);
        }
        for (let i = 0; i < this.bd.down; i++) {
            let r1 = i + 1;
            this.bd.downEffects[i].pos = new Pos(this.y * 40 - 0.5, (this.x + r1) * 40 - 2);
            this.bd.downEffects[i].divide = new Pos(n * 40, 1 * 40);
        }
        for (let i = 0; i < this.bd.left; i++) {
            let r1 = i + 1;
            this.bd.leftEffects[i].pos = new Pos((this.y - r1) * 40 - 0.5, (this.x) * 40 - 2);
            this.bd.leftEffects[i].divide = new Pos(n * 40, 2 * 40);
        }
        for (let i = 0; i < this.bd.right; i++) {
            let r1 = i + 1;
            this.bd.rightEffects[i].pos = new Pos((this.y + r1) * 40 - 0.5, (this.x) * 40 - 2);
            this.bd.rightEffects[i].divide = new Pos(n * 40, 3 * 40);
        }
        this.bd.centerEffects[0].pos = new Pos((this.y) * 40 - 0.5, (this.x) * 40 - 2);
        this.bd.centerEffects[0].divide = new Pos(n * 40, 4 * 40);
    }

    deleteEffect = () => {
        this.bd.allEffects.forEach(t => {
            t.visible = false;
        })
    }

    boom() {
        for (let x = 0, len1 = bombArea.length; x < len1; x++)
            for (let y = 0, len2 = bombArea[0].length; y < len2; y++) {
                if (bombArea[x][y]) {
                    let type = map.value(x, y);
                    bombArea[x][y] = 0;
                    if (type.property.canBomb) {
                        type.del();
                        if (type.property.produce)
                            map.addGift(x, y, Game.getLottery(Game.gArr));

                    }
                }
            }
    }
}

