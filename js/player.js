let Picplayerpath = {
    1: 'pic/role1.png',
    2: 'pic/Role1Ride.png',
    3: 'pic/BigPopo.png',
    4: 'pic/Role1Die.png',
    5: 'pic/Role1Ani.png'
};
let directions = { Up: 0, Down: 1, Left: 2, Right: 3 };

class Player {
    constructor() {
        this.dir = 1; //朝向
        this.speed = 4; //速度
        this.bombCount = 5; //炸弹个数
        this.nowbombnum = 0;
        this.bombMight = 2; //炸弹威力
        this.ride = false;  //是否骑乘
        this.kick = false;  //是否能踢泡
        this.x = 0; //像素x坐标
        this.y = 0; //像素y坐标
        this.status = 0; //运动动画帧
        this.init(0, 0);
        Game.players.push(this);
        this.moveActivate = null;
        this.getRide(1);
    }


    delRide() {
        this.ride = false;
        this.rideThing.del();
        this.rideThing = null;
        this.bmp.visible = false;
        this.bmp = new Bitmap(Picplayerpath[1]);
        this.bmp.pos = new Pos(this.x, this.y);
        this.bmp.size = new Size(48, 64);
        this.bmp.divide = new Pos(0, this.direction * 64);
        this.bmp.offset = new Pos(0, 12);
        this.setZindex();
        /*this.Bitmap.pos.y+=12;
        this.update();*/
    }



    getRide(type) {
        this.ride = true;
        if (this.status >= 2)
            this.status = 0;
        this.bmp.visible = false;
        this.bmp = new Bitmap(Picplayerpath[2]);
        this.rideThing = new Rider(type, this);
        this.bmp.pos = new Pos(this.x, this.y);
        this.bmp.size = new Size(48, 56);
        this.bmp.divide = new Pos(48, 0);
        this.bmp.offset = new Pos(0, 12);
        this.bmp.pos.y -= 12;
        this.setZindex();
        //this.rideThing.update(t);
    }

    init(x, y) {//初始化
        this.setMap(new Pos(0, 0))
        this.bmp = new Bitmap(Picplayerpath[1], new Pos(this.x, this.y));
        this.bmp.border = true;
        this.bmp.Zindex = 3;
        this.bmp.divide.x = 0;
        this.bmp.divide.y = 64;
        this.bmp.size = new Size(48, 64);
        this.bmp.offset = new Pos(4, 24);

    }

    move(_dir) {//朝指定方向移动
        this.dir = _dir;
        //console.log("dir", this.dir);
        let prePos = this.getMap(24, 45);
        switch (_dir) {
            case 0: this.y -= this.speed; break;
            case 1: this.y += this.speed; break;
            case 2: this.x -= this.speed; break;
            case 3: this.x += this.speed; break;
        }
        this.canMove(prePos);
        this.sumdirect();
        this.setZindex();
    }

    update() {//更新像素图的属性
        if (this.moveActivate != null) {
            this.moveActivate();
        }
        else {
            this.enddirect();
        }
        this.bmp.pos = null;
        this.bmp.pos = new Pos(this.x, this.y);

        // if (this.ride)
        //   this.bmp.pos.y -= 12;
        if (!this.ride)
            this.bmp.divide.y = this.dir * 64;
        else {
            this.bmp.divide.x = this.dir * 48;
        }

        if (this.ride)
            this.rideThing.update(this);
    }

    sumdirect() {//移动动画帧
        this.status++;
        if (this.status === 18)
            this.status = 0;
        this.bmp.divide.x = Math.floor(this.status / 3) * 48;
    }

    enddirect() {//移动结束重置
        this.status = 0;
        this.bmp.divide.x = Math.floor(this.status / 3) * 48;
    }

    getMap(offsetX = 0, offsetY = 0) {//获得像素坐标映射到地图坐标
        let rows = BlockMaps.length - 1;
        let cols = BlockMaps[0].length - 1;
        let MapY = Math.floor((this.x + offsetX) / 40);
        let MapX = Math.floor((this.y + offsetY) / 40);
        MapY = MapY > cols ? cols : MapY;
        MapY = MapY < 0 ? 0 : MapY;
        MapX = MapX > rows ? rows : MapX;
        MapX = MapX < 0 ? 0 : MapX;
        return new Pos(MapX, MapY);
    }

    setZindex() {//设置层次属性
        let o = this.getMap(24, 44);
        let x = o.x;
        this.bmp.Zindex = 3 * (x + 1) + 1;
        return o.x;
    }

    setMap(pos) {//放置到地图指定坐标处
        this.x = pos.x * 40 - 4;
        this.y = pos.y * 40 - 24;
    }

    isCenterPos(_pos, _xline = true) {
        let a = -1;
        if (_xline) {
            if ((this.x + 24) > _pos.y * 40 + 20 + 2) a = 0;//右
            else if ((this.x + 24) < _pos.y * 40 + 20 - 2) a = 1;//左
        }
        else {
            if ((this.y + 45) > _pos.x * 40 + 21 + 2) a = 0;//下
            else if ((this.y + 45) < _pos.x * 40 + 21 - 2) a = 1;//上
        }
        return a;
    }

    banMove(pos) {
        return (map.isBlock(pos)
            && !map.value(pos.x, pos.y).property.canMove
            && !map.value(pos.x, pos.y).property.canHide)
            || bombMap.isIn(pos.x, pos.y)
    }

    moveBlock(_pos, _dir) {
        let pos = _pos.copy();
        switch (_dir) {
            case directions.Up: pos.x--; break;
            case directions.Down: pos.x++; break;
            case directions.Left: pos.y--; break;
            case directions.Right: pos.y++; break;
        }
        if ((!bombMap.isIn(pos.x, pos.y))
            && map.isBlock(_pos)
            && map.value(_pos.x, _pos.y).property.canPush) {
            if (!map.isBlock(pos) || (map.isBlock(pos) && map.value(pos.x, pos.y).property.canHide))
                map.value(_pos.x, _pos.y).startMove(pos);
        }
    }

    canMove(_prePos) {//判断是否能移动
        let bp = this.getMap(24, 45);//中心点
        let up = new Pos(bp.x - 1, bp.y);
        let down = new Pos(bp.x + 1, bp.y);
        let left = new Pos(bp.x, bp.y - 1);
        let right = new Pos(bp.x, bp.y + 1);

        let test = 47 + 40;
        let borderxy = {
            top: this.y + 24,
            bottom: this.y + 64,
            left: this.x + 4,
            right: this.x + 44
        };

        let setToPos = (pos, _x = true, _y = true) => {
            if (_x)
                this.x = pos.y * 40 - 4;
            if (_y)
                this.y = pos.x * 40 - 24;
        }

        switch (this.dir) {
            case directions.Up:
                if (map.borderCheck(up)) {
                    if (this.banMove(up)) {//向上有块
                        if (borderxy.top < up.x * 40 + 40) {
                            this.moveBlock(up, this.dir);
                            //this.y = (bp.x) * 40 - 24;
                            setToPos(bp, false);
                        }
                    }
                    else {//向上无块
                        let dp = { l: new Pos(up.x, up.y - 1), r: new Pos(up.x, up.y + 1) }
                        if (this.isCenterPos(bp) == 1) {//左
                            if (map.borderCheck(dp.l))
                                if (this.banMove(dp.l)) {
                                    if (borderxy.top < up.x * 40 + 40) {//往右修正
                                        this.y = (bp.x) * 40 - 24;
                                        this.x += this.speed
                                    }
                                }
                        }
                        else if (this.isCenterPos(bp) == 0) {//右
                            if (map.borderCheck(dp.r))
                                if (this.banMove(dp.r)) {
                                    if (borderxy.top < up.x * 40 + 40) {//往左修正
                                        this.y = (bp.x) * 40 - 24;
                                        this.x -= this.speed
                                    }
                                }
                        }
                    }
                }
                if (borderxy.top < 0) {
                    this.y = 0 - 24;
                }
                break;

            case directions.Down:
                if (map.borderCheck(down)) {
                    if (this.banMove(down)) { //向下有块
                        if (borderxy.bottom > down.x * 40) {
                            this.moveBlock(down, this.dir);
                            //this.y = (bp.x + 1) * 40 - 64;
                            setToPos(bp, false);
                        }
                    }
                    else {//向下无块
                        let dp = { l: new Pos(down.x, down.y - 1), r: new Pos(down.x, down.y + 1) }
                        if (this.isCenterPos(bp) == 1) {//左
                            if (map.borderCheck(dp.l))
                                if (this.banMove(dp.l)) {
                                    if (borderxy.bottom > down.x * 40) {
                                        this.y = (bp.x + 1) * 40 - 64;
                                        this.x += this.speed    //往右修正
                                    }
                                }
                        }
                        else if (this.isCenterPos(bp) == 0) {//右
                            if (map.borderCheck(dp.r))
                                if (this.banMove(dp.r)) {
                                    if (borderxy.bottom > down.x * 40) {
                                        this.y = (bp.x + 1) * 40 - 64;
                                        this.x -= this.speed //往左修正
                                    }
                                }
                        }
                    }
                }
                if ((borderxy.bottom) > map.row * 40) {
                    this.y = map.row * 40 - 64;
                }
                break;

            case directions.Left:
                if (map.borderCheck(left)) {
                    if (this.banMove(left)) {//向左有块
                        if (borderxy.left < left.y * 40 + 40) {
                            this.moveBlock(left, this.dir);
                            //this.x = (bp.y) * 40 + 20 - 24;
                            setToPos(bp, true, false);
                        }
                    }
                    else {//向左无块
                        let dp = { u: new Pos(left.x - 1, left.y), d: new Pos(left.x + 1, left.y) }
                        if (this.isCenterPos(bp, false) == 1) {//上
                            if (map.borderCheck(dp.u))
                                if (this.banMove(dp.u)) {
                                    if (borderxy.left < left.y * 40 + 40) {
                                        this.x = (bp.y) * 40 + 20 - 24;
                                        this.y += this.speed;
                                    }
                                }
                        }
                        else if (this.isCenterPos(bp, false) == 0) {//下
                            if (map.borderCheck(dp.d))
                                if (this.banMove(dp.d)) {
                                    if (borderxy.left < left.y * 40 + 40) {
                                        this.x = (bp.y) * 40 + 20 - 24;
                                        this.y -= this.speed;
                                    }
                                }
                        }
                    }
                }
                if (this.x + 24 < 20) {
                    this.x = 20 - 24;
                }
                break;

            case directions.Right:
                if (map.borderCheck(right)) {
                    if (this.banMove(right)) {//向右有块

                        if (borderxy.right > right.y * 40) {
                            this.moveBlock(right, this.dir);
                            //this.x = (bp.y) * 40 + 20 - 24;
                            setToPos(bp, true, false);
                        }
                    }
                    else {//向右无块
                        let dp = { u: new Pos(right.x - 1, right.y), d: new Pos(right.x + 1, right.y) }
                        if (this.isCenterPos(bp, false) == 1) {//上
                            if (map.borderCheck(dp.u))
                                if (this.banMove(dp.u)) {
                                    if (borderxy.right > right.y * 40) {
                                        this.x = (bp.y) * 40 + 20 - 24;
                                        this.y += this.speed;
                                    }
                                }
                        }
                        else if (this.isCenterPos(bp, false) == 0) {//下
                            if (map.borderCheck(dp.d))
                                if (this.banMove(dp.d)) {
                                    if (borderxy.right > right.y * 40) {
                                        this.x = (bp.y) * 40 + 20 - 24;
                                        this.y -= this.speed;
                                    }
                                }
                        }
                    }
                }
                if ((this.x + 24) > ((map.col - 1) * 40) + 20) {
                    this.x = (map.col - 1) * 40 + 20 - 24;
                }
                break;
        }
        let dangqian = this.getMap(24, 45);
        if (map.isBlock(dangqian) &&
            map.value(dangqian.x, dangqian.y).property.canMove)
            map.value(dangqian.x, dangqian.y).del();

        if (_prePos.x != dangqian.x || _prePos.y != dangqian.y) {
            if (map.isBlock(dangqian) &&
                map.value(dangqian.x, dangqian.y).property.canHide) {
                this.bmp.cover = true;
                map.value(dangqian.x, dangqian.y).startHide(dangqian);
            }
        }
        else if (!map.isBlock(dangqian))
            this.bmp.cover = false;

    }

    putBomb = () => {
        // console.log("放炸弹")
        let o = this.getMap(24, 45);
        let bomb = null;
        if (this.nowbombnum < this.bombCount && !bombMap.isIn(o.x, o.y))
            bomb = new Bomb(o.x, o.y, this.bombMight, this);
    }

}
