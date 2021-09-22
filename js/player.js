let Picplayerpath = {
    1: 'pic/role1.png',
    2: 'pic/Role1Ride.png',
    3: 'pic/BigPopo.png',
    4: 'pic/Role1Die.png',
    5: 'pic/Role1Ani.png'
}
const directions = { Up: 0, Down: 1, Left: 2, Right: 3 }

class Player {
    constructor() {
        this.dir = 1 //朝向
        this.m_speed = 3 //速度
        this.speedMax = 5 //最大速度
        this.bombCountMax = 6 //最大炸弹数量
        this.bombCount = 1 //炸弹个数
        this.nowbombnum = 0 //当前可用炸弹数量
        this.bombMightMax = 6 //炸弹最大威力
        this.bombMight = 1 //炸弹威力
        this.kick = false  //是否能踢泡
        this.x = 0 //像素x坐标
        this.y = 0 //像素y坐标
        this.status = 0 //运动动画帧
        this.init(0, 0)
        Game.players.push(this)
        this.moveActivate = null
        this.setMap(0, 0)
        this.setZindex()
    }

    get speed() {
        if (this.ride) return this.rideThing.speed
        else return this.m_speed
    }

    set speed(n) {
        this.m_speed = n
    }

    get ride() { return this.rideThing instanceof Rider } //是否骑乘

    delRide() { //删除坐骑
        const dup = this.bmp.collision.copy()
        this.rideThing.del()
        this.rideThing = null
        this.bmp.visible = false
        this.bmp = new Bitmap(Picplayerpath[1])
        this.bmp.pos = new Pos(this.x, this.y)
        this.bmp.size = new Size(48, 64)
        this.bmp.divide = new Pos(0, this.direction * 64)
        this.bmp.CanCollision = true; //碰撞
        this.bmp.collision.size = new Size(40, 40)
        this.bmp.collision.offset = new Pos(4, 24)
        this.bmp.collision.bottom = dup.bottom
        this.bmp.collision.left = dup.left
        const pos = this.bmp.collisionRevise(this.bmp.collision)
        this.x = pos.x
        this.y = pos.y
        this.setZindex()
    }

    getRide(type) { //得到坐骑
        if (this.ride) return
        const dup = this.bmp.collision.copy()
        if (this.status >= 2) this.status = 0
        this.bmp.visible = false
        this.bmp = new Bitmap(Picplayerpath[2])
        this.bmp.pos = new Pos(this.x, this.y)
        this.bmp.size = new Size(48, 56)
        this.bmp.divide = new Pos(0, 0)
        this.bmp.offset = new Pos(0, 0)
        this.bmp.CanCollision = true //碰撞
        this.bmp.collision.size = new Size(40, 40)
        this.rideThing = new Rider(type, this)
        this.bmp.collision.offset = new Pos((this.bmp.size.width - 40) / 2, (this.rideThing.bmp.size.height + this.rideThing.bmp.offset.y - 40))
        this.bmp.collision.bottom = dup.bottom
        this.bmp.collision.left = dup.left
        const pos = this.bmp.collisionRevise(this.bmp.collision)
        this.x = pos.x
        this.y = pos.y
        this.setZindex()
    }

    init() { //初始化
        const bmp = new Bitmap(Picplayerpath[1], new Pos(this.x, this.y))
        bmp.Zindex = 3; //图像尺寸
        bmp.divide = new Pos(0, 64)
        bmp.size = new Size(48, 64)
        bmp.offset = new Pos(0, 0)//(4, 24)
        bmp.CanCollision = true; //碰撞
        bmp.collision.size = new Size(40, 40)
        bmp.collision.offset = new Pos((bmp.size.width - 40) / 2, (bmp.size.height - 40))
        this.bmp = bmp
    }

    move(_dir) { //朝指定方向移动
        this.dir = _dir
        const prePos = this.getMap(20, 20);
        switch (_dir) {
            case directions.Up: this.y -= this.speed; break
            case directions.Down: this.y += this.speed; break
            case directions.Left: this.x -= this.speed; break
            case directions.Right: this.x += this.speed; break
        }
        this.canMove(prePos)
        this.sumdirect()
        this.setZindex()
    }

    update() { //更新像素图的属性
        if (this.moveActivate != null) { this.moveActivate() }
        else { this.enddirect() }
        this.bmp.pos = new Pos(this.x, this.y)
        if (!this.ride) this.bmp.divide.y = this.dir * 64
        else {
            this.bmp.divide.x = this.dir * 48
        }
        if (this.ride)
            this.rideThing.update()
    }

    sumdirect() { //移动动画帧
        this.status++
        if (this.status === 18)
            this.status = 0
        if (this.ride) return
        if (Number.isInteger(this.status / 3))
            this.bmp.divide.x = this.status / 3 * 48
    }

    enddirect() { //移动结束重置
        this.status = 0
        this.bmp.divide.x = Math.floor(this.status / 3) * 48
    }

    getMap(offsetX = 0, offsetY = 0) { //获得像素坐标映射到地图坐标
        let rows = BlockMaps.length - 1
        let cols = BlockMaps[0].length - 1
        let MapY = parseInt((this.x + this.bmp.collision.offset.x + offsetX - map.offset.x) / 40)
        let MapX = parseInt((this.y + this.bmp.collision.offset.y + offsetY - map.offset.y) / 40)
        MapY = MapY > cols ? cols : MapY
        MapY = MapY < 0 ? 0 : MapY
        MapX = MapX > rows ? rows : MapX
        MapX = MapX < 0 ? 0 : MapX
        return new Pos(MapX, MapY)
    }

    getPointCenter() { //获得角色在当前格子中的偏向
        const tilePos = this.getMap(20, 20);
        const playerCenterX = this.x + this.bmp.collision.offset.x - map.offset.x +
            this.bmp.collision.size.width / 2 - tilePos.y * 40
        const playerCenterY = this.y + this.bmp.collision.offset.y - map.offset.y +
            this.bmp.collision.size.height / 2 - tilePos.x * 40
        const dir = { l: 1, r: 2, u: 4, d: 8 }
        let val = 0;
        if (playerCenterX < 20) { val |= dir.l; }
        if (playerCenterX > 20) { val |= dir.r; }
        if (playerCenterY < 20) { val |= dir.u; }
        if (playerCenterY > 20) { val |= dir.d; }
        return val
    }

    setMap(x, y) { //放置到地图指定坐标处
        this.x = x * 40 + map.offset.x - this.bmp.collision.offset.x
        this.y = y * 40 + map.offset.y - this.bmp.collision.offset.y
    }

    setZindex() { //设置层次属性
        let o = this.getMap(20, 20)
        let x = o.x
        this.bmp.Zindex = 3 * (x + 1) + 1
        return o.x
    }

    moveBlock(_pos, _dir) { //推块
        let pos = _pos.copy()
        switch (_dir) {
            case directions.Up: pos.x--; break
            case directions.Down: pos.x++; break
            case directions.Left: pos.y--; break
            case directions.Right: pos.y++; break
        }
        if ((!bombMap.isIn(pos.x, pos.y) && map.borderCheck(pos))
            && map.isBlock(_pos)
            && map.value(_pos.x, _pos.y).property.canPush) {
            if (!map.isBlock(pos) || (map.isBlock(pos) && map.value(pos.x, pos.y).property.canHide))
                map.value(_pos.x, _pos.y).startMove(pos)
        }
    }

    moveBomb(_pos, _dir) { //推泡
        let pos = _pos.copy()
        switch (_dir) {
            case directions.Up: pos.x--; break
            case directions.Down: pos.x++; break
            case directions.Left: pos.y--; break
            case directions.Right: pos.y++; break
        }
        if (bombMap.isIn(_pos.x, _pos.y)) {

            const item = bombMap.dataAt(_pos)
            item.move(_dir)
        }
    }

    banMove(pos, instantBlock = false) { //禁止通过的物件
        return (map.isBlock(pos)
            && map.value(pos.x, pos.y).type == 0
            && (this.ride && this.rideThing.canMove ?
                !map.value(pos.x, pos.y).property.canMove :
                (!instantBlock ?
                    // !map.value(pos.x, pos.y).property.canMove &&
                    !map.value(pos.x, pos.y).property.canHide
                    : true))
            || bombMap.isIn(pos.x, pos.y)
        )
        /*  return (map.isBlock(pos)
          && map.value(pos.x, pos.y).type == 0
          && (!instantBlock ?
             // !map.value(pos.x, pos.y).property.canMove &&
              !map.value(pos.x, pos.y).property.canHide
              : true)
          || bombMap.isIn(pos.x, pos.y)
      )*/
    }

    canMove(_prePos, dir = this.dir) { //移动碰撞检测
        const center = this.getPointCenter()
        let bp = this.getMap(20, 20);
        const dup = this.bmp.collision.copy()
        const dirs = { l: 1, r: 2, u: 4, d: 8 }, dirsArr = [-1, 1, -1, 1], vertical = dir < 2
        let conflict = false, moveFix = false, blockerItem = null;
        const posSelect = new Pos(dirsArr[dir] * vertical, dirsArr[dir] * !vertical)
        if (vertical) dup.pos.y += this.speed * posSelect.x
        else dup.pos.x += this.speed * posSelect.y
        const posHandle = new Pos(bp.x + posSelect.x, bp.y + posSelect.y)
        const dirFix = (vertical) * (center & dirs.r ? 1 : center & dirs.l ? -1 : 0) +
            (!vertical) * (center & dirs.d ? 1 : center & dirs.u ? -1 : 0)
        if (this.banMove(posHandle)) {
            if (map.isBlock(posHandle) && dup.detect(map.value(posHandle.x, posHandle.y).bmp.collision)) {
                const item = map.value(posHandle.x, posHandle.y).bmp.collision.copy()
                this.moveBlock(posHandle, dir)
                blockerItem = item
            }
            else if (bombMap.isIn(posHandle.x, posHandle.y) && dup.detect(bombMap.dataAt(posHandle).bmp.collision)) {
                if (this.kick) this.moveBomb(posHandle, dir)
                const item = bombMap.dataAt(posHandle).bmp.collision.copy()
                blockerItem = item
            }
            conflict = true
        }
        else if (!map.borderCheckReal(dup.pos, dup.offset)) { conflict = true }
        else {
            let tryPos = new Pos((!vertical) * dirFix + posHandle.x, (vertical) * dirFix + posHandle.y)
            if (dirFix != 0 && this.banMove(tryPos, true)) {
                const item = map.isBlock(tryPos) ? map.value(tryPos.x, tryPos.y) :
                    bombMap.isIn(tryPos.x, tryPos.y) ? bombMap.dataAt(tryPos) : null
                if (item != null && dup.detect(item.bmp.collision)) {
                    conflict = true, moveFix = true, blockerItem = item.bmp.collision.copy()
                }
            }
        }
        if (conflict) {
            if (blockerItem != null) {
                switch (dir) {
                    case directions.Up: dup.top = blockerItem.bottom; break
                    case directions.Down: dup.bottom = blockerItem.top; break
                    case directions.Left: dup.left = blockerItem.right; break
                    case directions.Right: dup.right = blockerItem.left; break
                }
                if (moveFix) {
                    switch (posSelect.y) {
                        case 0:
                            dup.pos.x += -dirFix * this.speed
                            dup.right = Math.max(dup.right, blockerItem.left)
                            dup.left = Math.min(dup.left, blockerItem.right)
                            break
                        default:
                            dup.pos.y += -dirFix * this.speed
                            dup.bottom = Math.max(dup.bottom, blockerItem.top)
                            dup.top = Math.min(dup.top, blockerItem.bottom)
                            break
                    }
                }
            }
            const pos = this.bmp.collisionRevise(dup)
            this.x = pos.x
            this.y = pos.y
        }
        let curPos = this.getMap(20, 20)
        if (!(this.ride && this.rideThing.canMove))
            if (map.isBlock(curPos)) {
                const item = map.value(curPos.x, curPos.y)
                if (item.type == 1 && item.property.canMove) {
                    item.pick(this)
                    item.del()
                }
            }
        if (_prePos.x != curPos.x || _prePos.y != curPos.y) {
            if (map.isBlock(curPos) &&
                map.value(curPos.x, curPos.y).property.canHide) {
                this.bmp.cover = true
                map.value(curPos.x, curPos.y).startHide(curPos)
            }
        }
        else if (!map.isBlock(curPos))
            this.bmp.cover = false
    }

    putBomb() { //放炸弹
        let o = this.getMap(20, 20)
        let bomb = null
        if (this.nowbombnum < this.bombCount && !bombMap.isIn(o.x, o.y) && (map.isBlock(o) ?
            map.value(o.x, o.y).type == 0 ? map.value(o.x, o.y).property.canHide : true : true))
            bomb = new Bomb(o.x, o.y, this.bombMight, this)
    }
}
