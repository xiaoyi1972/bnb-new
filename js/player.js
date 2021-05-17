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
        this.dir = 1; //朝向
        this.speed = 4; //速度
        this.bombCount = 5; //炸弹个数
        this.nowbombnum = 0
        this.bombMight = 2; //炸弹威力
        this.ride = false;  //是否骑乘
        this.kick = false;  //是否能踢泡
        this.x = 0; //像素x坐标
        this.y = 0; //像素y坐标
        this.status = 0; //运动动画帧
        this.init(0, 0)
        //  this.collision = new RectCollision(this.x, this.y, 48, 48)
        Game.players.push(this)
        this.moveActivate = null
        // this.getRide(2)
    }

    delRide() {
        this.ride = false
        this.rideThing.del()
        this.rideThing = null
        this.bmp.visible = false
        this.bmp = new Bitmap(Picplayerpath[1])
        this.bmp.pos = new Pos(this.x, this.y)
        this.bmp.size = new Size(48, 64)
        this.bmp.divide = new Pos(0, this.direction * 64)
        this.bmp.offset = new Pos(0, 12)

        this.bmp.CanCollision = true; //碰撞
        this.bmp.collision.size = new Size(40, 40)
        this.bmp.collision.offset = new Pos(4, 24)

        this.setZindex()
        /*this.Bitmap.pos.y+=12
        this.update();*/
    }

    getRide(type) {
        this.ride = true
        if (this.status >= 2)
            this.status = 0
        this.bmp.visible = false
        this.bmp = new Bitmap(Picplayerpath[2])
        this.bmp.pos = new Pos(this.x, this.y)
        this.bmp.size = new Size(48, 56)
        this.bmp.divide = new Pos(48, 0)
        this.bmp.offset = new Pos(0, 0)//new Pos(0, 16)
        this.bmp.pos.y -= 12

        this.bmp.CanCollision = true; //碰撞
        this.bmp.collision.size = new Size(40, 40)
        // this.bmp.collision.offset = new Pos((this.bmp.size.width - 40) / 2, (this.bmp.size.height - 40))
        this.rideThing = new Rider(type, this)
        this.bmp.collision.offset = new Pos((this.bmp.size.width - 40) / 2,
            (this.rideThing.bmp.size.height + this.rideThing.bmp.offset.y - 40)
            //(this.bmp.size.height - 40)
        )
        //console.log(this.rideThing.bmp.size.height + this.rideThing.bmp.offset.y - 40, this.bmp.size.height - 40)
        this.setZindex()
        //this.rideThing.update(t)
    }

    init(x, y) {//初始化
        this.setMap(new Pos(0, 0))
        const bmp = new Bitmap(Picplayerpath[1], new Pos(this.x, this.y))
        //    this.bmp.border = true
        bmp.Zindex = 3; //图像尺寸
        bmp.divide = new Pos(0, 64)
        bmp.size = new Size(48, 64)
        bmp.offset = new Pos(0, 0)//(4, 24)
        bmp.CanCollision = true; //碰撞
        bmp.collision.size = new Size(40, 40)
        bmp.collision.offset = new Pos((bmp.size.width - 40) / 2, (bmp.size.height - 40))
        //bmp.collision.offset = new Pos(4, 24)
        this.bmp = bmp
    }

    move(_dir) {//朝指定方向移动
        this.dir = _dir
        // console.log(this.x,this.y)
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

    update() {//更新像素图的属性
        if (this.moveActivate != null) { this.moveActivate() }
        else { this.enddirect() }
        this.bmp.pos = null
        this.bmp.pos = new Pos(this.x, this.y)

        if (!this.ride) this.bmp.divide.y = this.dir * 64
        else { this.bmp.divide.x = this.dir * 48 }
        if (this.ride)
            this.rideThing.update(this)
    }

    sumdirect() {//移动动画帧
        if (this.ride) return
        this.status++
        if (this.status === 18)
            this.status = 0
        if (Number.isInteger(this.status / 3))
            this.bmp.divide.x = this.status / 3 * 48
    }

    enddirect() {//移动结束重置
        this.status = 0
        this.bmp.divide.x = Math.floor(this.status / 3) * 48
    }

    getMap(offsetX = 0, offsetY = 0) {//获得像素坐标映射到地图坐标
        let rows = BlockMaps.length - 1
        let cols = BlockMaps[0].length - 1
        let MapY = Math.floor((this.x + this.bmp.collision.offset.x + offsetX - map.offset.x) / 40)
        let MapX = Math.floor((this.y + this.bmp.collision.offset.y + offsetY - map.offset.y) / 40)
        MapY = MapY > cols ? cols : MapY
        MapY = MapY < 0 ? 0 : MapY
        MapX = MapX > rows ? rows : MapX
        MapX = MapX < 0 ? 0 : MapX
        return new Pos(MapX, MapY)
    }

    getPointCenter() {
        const tilePos = this.getMap(20, 20);
        const playerCenterX = this.x + this.bmp.collision.offset.x - map.offset.x +
            this.bmp.collision.size.width / 2 - tilePos.y * 40
        const playerCenterY = this.y + this.bmp.collision.offset.y - map.offset.y +
            this.bmp.collision.size.height / 2 - tilePos.x * 40
        //     console.log(this.y + 20 + 16, tilePos.x)
        const dir = { l: 1, r: 2, u: 4, d: 8 }
        let val = 0;
        if (playerCenterX < 20) { val |= dir.l; }//console.log("局左")}
        if (playerCenterX > 20) { val |= dir.r; }//console.log("局右")}
        if (playerCenterY < 20) { val |= dir.u; }//console.log("局上")}
        if (playerCenterY > 20) { val |= dir.d; }//console.log("局下")}
        return val
    }

    setMap(pos) {//放置到地图指定坐标处
        this.x = pos.y * 40// - 4
        this.y = pos.x * 40// - 24
    }

    setZindex() {//设置层次属性
        let o = this.getMap(20, 20)
        let x = o.x
        this.bmp.Zindex = 3 * (x + 1) + 1
        return o.x
    }

    isCenterPos(_pos, _xline = true) {
        let a = -1
        if (_xline) {
            if ((this.x + 24) > _pos.y * 40 + 20 + 2) a = 0;//右
            else if ((this.x + 24) < _pos.y * 40 + 20 - 2) a = 1;//左
        }
        else {
            if ((this.y + 45) > _pos.x * 40 + 21 + 2) a = 0;//下
            else if ((this.y + 45) < _pos.x * 40 + 21 - 2) a = 1;//上
        }
        return a
    }

    banMove(pos) {
        return (map.isBlock(pos)
            && !map.value(pos.x, pos.y).property.canMove
            && !map.value(pos.x, pos.y).property.canHide)
            || bombMap.isIn(pos.x, pos.y)
    }

    moveBlock(_pos, _dir) {
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

    canMove(_prePos, dir = this.dir) {
        const center = this.getPointCenter()
        let bp = this.getMap(20, 20);//中心点
        const dup = this.bmp.collision.copy()
        const _dir = dir
        dup.pos.x += (_dir == directions.Right ? this.speed : _dir == directions.Left ? -this.speed : 0)
        dup.pos.y += (_dir == directions.Down ? this.speed : _dir == directions.Up ? -this.speed : 0)
        const dirs = { l: 1, r: 2, u: 4, d: 8 }
        let conflict = false, moveFix = false, blockerItem = null;
        const posSelect = new Pos(
            _dir == directions.Up ? -1 : _dir == directions.Down ? 1 : 0,
            _dir == directions.Left ? -1 : _dir == directions.Right ? 1 : 0)
        const posHandle = new Pos(bp.x + posSelect.x, bp.y + posSelect.y);
        const dirFix = ((_dir == directions.Up || _dir == directions.Down) * (center & dirs.r ? 1 : center & dirs.l ? -1 : 0)) +
            ((_dir == directions.Left || _dir == directions.Right) * (center & dirs.d ? 1 : center & dirs.u ? -1 : 0))
        if (this.banMove(posHandle)) {
            if (map.isBlock(posHandle) && dup.detect(map.value(posHandle.x, posHandle.y).bmp.collision)) {
                this.moveBlock(posHandle, _dir)
                const item = map.value(posHandle.x, posHandle.y);
                blockerItem = item;
            }
            else if (bombMap.isIn(posHandle.x, posHandle.y) && dup.detect(bombMap.dataAt(posHandle).bmp.collision)) {
                const item = bombMap.dataAt(posHandle);
                blockerItem = item;
            }
            conflict = true;
        }
        else if (!map.borderCheckReal(dup.pos, dup.offset)) { conflict = true }
        else {
            let tryPos = new Pos(
                (_dir == directions.Left || _dir == directions.Right) * dirFix + posHandle.x,
                (_dir == directions.Up || _dir == directions.Down) * dirFix + posHandle.y)
            if (dirFix != 0 && this.banMove(tryPos)/*&& map.isBlock(tryPos)*/) {
                const item = map.isBlock(tryPos) ? map.value(tryPos.x, tryPos.y) : bombMap.isIn(tryPos.x, tryPos.y) ?
                    bombMap.dataAt(tryPos) : null
                if (item != null && dup.detect(item.bmp.collision)) {
                    conflict = true;
                    moveFix = true;
                    blockerItem = item;
                }
            }
        }
        if (conflict) { //有障碍
            let dirCheck;
            if (blockerItem != null) {
                switch (_dir) {
                    case directions.Up: dup.top = blockerItem.bmp.collision.bottom; break
                    case directions.Down: dup.bottom = blockerItem.bmp.collision.top; break
                    case directions.Left: dup.left = blockerItem.bmp.collision.right; break
                    case directions.Right: dup.right = blockerItem.bmp.collision.left; break
                }
                if (moveFix) { //位移修正
                    switch (posSelect.y) {
                        case 0: dup.pos.x += -dirFix * this.speed; dirCheck = dirFix == 1 ? directions.Left : directions.Right;break
                        default: dup.pos.y += -dirFix * this.speed; dirCheck = dirFix == 1 ? directions.Up : directions.Down;break
                    }
                }
            }
            const pos = this.bmp.collisionRevise(dup)
            this.x = pos.x
            this.y = pos.y
            if (moveFix) return this.canMove(this.getMap(20,20),dirCheck)
        }
        let dangqian = this.getMap(20, 20)
        if (map.isBlock(dangqian) &&
            map.value(dangqian.x, dangqian.y).property.canMove)
            map.value(dangqian.x, dangqian.y).del()
        if (_prePos.x != dangqian.x || _prePos.y != dangqian.y) {
            if (map.isBlock(dangqian) &&
                map.value(dangqian.x, dangqian.y).property.canHide) {
                this.bmp.cover = true
                map.value(dangqian.x, dangqian.y).startHide(dangqian)
            }
        }
        else if (!map.isBlock(dangqian))
            this.bmp.cover = false
    }

    putBomb = () => {
        // console.log("放炸弹")
        let o = this.getMap(20, 20)
        let bomb = null
        if (this.nowbombnum < this.bombCount && !bombMap.isIn(o.x, o.y))
            bomb = new Bomb(o.x, o.y, this.bombMight, this)
    }

}
