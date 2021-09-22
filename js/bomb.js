let bombeffect = 'pic/Explosion.png'
let bombpic = {
    0: { url: 'pic/bomb.png' },
    1: { url: 'pic/bomb1.png' }
}

let bombArray, bombArea = Game.get2dArray(map.row, map.col, 0)

class BombMap {
    constructor(_rows, _cols) {
        this.row = _rows
        this.col = _cols
        this.map = Array(_rows).fill(0).map(() => Array(_cols).fill(null))
    }

    dataAt(pos) {
        return this.map[pos.x][pos.y]
    }

    isIn(x, y) {
        if ((x > -1 && x < this.row) && (y > -1 && y < this.col) && this.map[x][y] instanceof Bomb) return 1
        else return 0
    }

    set(x, y, bomb) {
        this.map[x][y] = bomb
    }

    del(x, y) {
        this.map[x][y] = null
    }
}

let bombMap = new BombMap(13, 15)


class bd {
    constructor(_level, _bomb) {
        this.bomb = _bomb
        this.effects = new Array(5).fill().map((val, n) => Array(n == 4 ? 1 : _level).fill(null)) //0 上 1 下 2 左 3 右
    }

    create(x, y) { //创建爆炸水波贴图
        const gs = [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]]
        for (let index = 0; index < this.effects.length; index++)
            for (let i = 0; i < this.effects[index].length; i++) {
                let bmp = new Bitmap(bombeffect)
                const r1 = i + 1
                bmp.Zindex = 1
                bmp.size = new Size(40, 40)
                bmp.offset = new Pos(map.offset.x, map.offset.y)
                bmp.pos = new Pos((y + r1 * gs[index][0]) * 40 - 0.5, (x + r1 * gs[index][1]) * 40 - 2)
                bmp.divide = new Pos(0 * 40, index * 40)
                bmp.animate = new Animator(this.update.bind(this), 2)
                bmp.animate.updateAnimateProperty = {
                    bmp: bmp,
                    len: this.effects[index].length,
                    index: index,
                    i: i
                }
                if (index != 4 && i > 2) bmp.cover = i > 2
                this.effects[index][i] = bmp
            }
    }

    update(anime) { //爆炸动画帧
        if (typeof anime.updateAnimateProperty != 'undefined') {
            const property = anime.updateAnimateProperty
            const bmp = property.bmp
            if (0 <= anime.time && anime.time < 15) {
                const frame = Math.min(parseInt(anime.time / 1) - 3)
                if (property.i < property.len && property.i < 3 + (property.len - 3) / 4 * frame && property.index != 4)
                    bmp.cover = false
                bmp.divide.x = anime.time * 40
            }
            else if (anime.time == 15) {
                delete anime.updateAnimateProperty
                bmp.anime = null
                bmp.visible = false
                this.bomb.die = true
            }
        }
    }

    jugdeLimit(x, y) { //爆炸范围限制检测
        let res = false
        if (map.isBlock(new Pos(x, y))) {
            let item = map.value(x, y)
            if (item.property.canBomb) {
                if (item.type == 0 && !item.property.canHide) res = true
                bombArea[x][y] = 1
            }
            else
                res = true
        }
        return res
    }

    limit(x, y) { //调整爆炸的范围
        const gs = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]
        for (let index = 0; index < this.effects.length - 1; index++)
            for (let i = 1, level = this.effects[index].length; i <= level; i++) {
                const p = new Pos(x + i * gs[index][0], y + i * gs[index][1])
                if (this.jugdeLimit(p.x, p.y) || !map.borderCheck(p)) {
                    this.effects[index].splice(i - 1, level - i + 1)
                    break
                }
            }
        this.jugdeLimit(x, y)
    }

}

class Bomb {
    constructor(_x, _y, _level, _player) {
        bombMap.map[_x][_y] = this
        this.player = _player
        this.x = _x
        this.y = _y
        this.level = _level //_level; //威力
        this.die = false //爆炸完毕
        this.bd = new bd(this.level, this) //爆炸贴图类
        this.player.nowbombnum++ //玩家已经使用的炸弹数
        this.moving = false //正在移动
        this.init(_x, _y)
    }

    init(x, y) { //初始化贴图
        this.bmp = new Bitmap(bombpic[0].url)
        this.bmp.offset = new Pos(map.offset.x - 2, map.offset.y - 0.5)
        this.bmp.pos = new Pos(y * 40, x * 40)
        this.bmp.size = new Size(44, 41)
        this.bmp.Zindex = (x + 1) * 3
        this.bmp.cover = this.player.bmp.cover
        this.bmp.CanCollision = true; //碰撞
        this.bmp.collision.size = new Size(40, 40)
        this.bmp.collision.offset = new Pos(2, 0.5)
        // Game.bombs.push(this);return
        this.bmp.animate = new Animator(this.update.bind(this), 11)
    }

    update(anime) { //炸弹动画帧
        if (this.moving) return
        if (anime.time < 15) {
            const n = anime.time % 3
            this.bmp.divide.x = n * 44
        }
        else if (anime.time >= 15) Game.bombs.push(this) //this.boomUpdate()
    }


    deal = (called = false) => { //递归检查其余泡
        this.bmp.visible = false
        bombMap.del(this.x, this.y)
        this.bd.limit(this.x, this.y)
        this.searchbomb(this.x, this.y)
        this.bd.create(this.x, this.y)
        if (!called) this.boom()
        this.player.nowbombnum--
    }

    searchbomb = (x, y) => { //找其它炸弹
        const gs = [[-1, 0], [1, 0], [0, -1], [0, 1], [0, 0]]
        const effects = this.bd.effects
        for (let index = 0; index < effects.length - 1; index++)
            for (let i = 1, level = effects[index].length; i <= level; i++) {
                const p = new Pos(x + i * gs[index][0], y + i * gs[index][1])
                if (bombMap.isIn(p.x, p.y)) {
                    const linked = bombMap.dataAt(p)
                    bombMap.del(p.x, p.y)
                    linked.deal(true)
                }
            }
    }

    boom() { //爆炸
        for (let x = 0, len1 = bombArea.length; x < len1; x++)
            for (let y = 0, len2 = bombArea[0].length; y < len2; y++) {
                if (bombArea[x][y]) {
                    let type = map.value(x, y)
                    bombArea[x][y] = 0
                    if (type.property.canBomb) {
                        type.del()
                        if (type.property.produce)
                            map.addGift(x, y, Game.getLottery(Game.gArr))
                    }
                }
            }
    }

    move(dir) { //触发踢泡
        if (this.moving) return
        else {
            if (this.bmp.animate instanceof Animator) {
                const animate = new Animator(this.moveUpdate.bind(this), 1)
                const properties = {
                    move: [new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1), new Pos(0, 1)][dir],
                    bmp: this.bmp, pos: new Pos(this.x, this.y),
                    del: function () { this.next = null }.bind(this.bmp.animate),
                    check: function (x, y) {
                        if (map.isBlock(new Pos(x, y))) {
                            const item = map.value(x, y)
                            if (item.type == 0 && !item.property.canHide)
                                return false
                        }
                        if (!map.borderCheck(new Pos(x, y))) { return false }
                        if (bombMap.isIn(x, y)) { return false }
                        return true
                    }
                }
                if (properties.check(properties.pos.x + properties.move.x, properties.pos.y + properties.move.y)) {
                    animate.updateAnimateProperty = properties
                    this.bmp.animate.next = animate
                    this.moving = true
                }
            }
        }
    }

    moveUpdate(anime) { //踢泡动画帧
        const property = anime.updateAnimateProperty
        const n = anime.time, bmp = property.bmp
        const pos = property.pos.copy()
        const move = property.move, check = property.check

        pos.x += move.x //地图坐标
        pos.y += move.y

        if (!check(pos.x, pos.y)) {
            property.del()
            this.moving = false
            this.x = property.pos.x
            this.y = property.pos.y
            bmp.Zindex = (property.x + 1) * 3
            return
        }
        else {
            if (anime.time === 4) {
                bombMap.del(property.pos.x, property.pos.y)
                property.pos = pos
                bombMap.set(property.pos.x, property.pos.y, this)
                this.x = property.pos.x
                this.y = property.pos.y
                anime.time = 0
            }
            bmp.pos = new Pos(bmp.pos.x + move.y * 10, bmp.pos.y + move.x * 10)
            bmp.Zindex = (property.x + 1) * 3
        }
    }
}

