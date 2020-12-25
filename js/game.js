Array.get2dArray = function (_rows, _cols, _value) {
    return Array(_rows).fill(_value).map(x => Array(_cols).fill(_value));
}

class Bitmap {
    constructor(url, _pos = new Pos(-NaN, -NaN)) {
        this.image = new Image();
        this.image.src = url;
        this.border = false;
        this.image.onload = () => {
            if (this.size == null) {
                this.size = new Size(this.image.width, this.image.height);
            }
        }
        this.Zindex = 0; //绘图层次
        this.pos = _pos //位置
        this.divide = new Pos(0, 0); //分割
        //this.size=new Size(this.image.width,this.image.height);
        this.size = null; //大小
        this.offset = new Pos(0, 0); //偏移
        this.visible = true; //可见
        this.cover = false; //覆盖
        Game.picArray.push(this);
    }

    draw = (ctx) => {
        if (this.size == null) {
            ctx.drawImage(this.image, this.pos.x + this.offset.x, this.pos.y + this.offset.y);
        }
        else {
            //ctx.strokeRect(this.pos.x+this.offset.x,this.pos.y+this.offset.y,this.size.width,this.size.height);
            ctx.drawImage(this.image, this.divide.x, this.divide.y, this.size.width, this.size.height, this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.width, this.size.height);
        }
        if (this.border) {
            ctx.strokeStyle = "#000000";
            ctx.strokeRect(this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.width, this.size.height);
        }
    }

}

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        let pos = new Pos(this.x, this.y);
        return pos;
    }
}

class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class Game {
    constructor() {
        this.canvas = document.createElement('Canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 680;
        this.canvas.height = 600;
        //  this.end = false;
        this.handle;
    }

    start = () => {
        this.draw();
    }

    pause = () => {
        cancelAnimationFrame(this.handle);
        this.canvas.style.display = 'none';
    }

    draw = () => {
        let drawItem = 0;
        let currentZindex = 0;
        for (let i = 0; i < Game.picArray.length; i++) {
            let o = Game.picArray[i];
            if (!o.visible) {
                Game.picArray[i] = null;
                Game.picArray.splice(i, 1); //删除数组不可见元素
            }
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        while (drawItem < Game.picArray.length) {
            for (let i = 0; i < Game.picArray.length; i++) {
                if (Game.picArray[i].Zindex == currentZindex) {
                    if (!Game.picArray[i].cover)
                        Game.picArray[i].draw(this.ctx);
                    drawItem++;
                }
            }
            currentZindex++;
        }
        Game.otherUpdate();

        this.handle = requestAnimationFrame(this.draw);
    }
}

Game.get2dArray = function (_rows, _cols, _value) {
    return Array(_rows).fill(_value).map(x => Array(_cols).fill(_value));
}

Game.getLottery = function (arr) {
    let leng = 0;
    for (let i = 0; i < arr.length; i++) {
        leng += arr[i]                                     //获取总数
    }
    for (let i = 0; i < arr.length; i++) {
        let random = parseInt(Math.random() * leng);       //获取 0-总数 之间的一个随随机整数
        if (random < arr[i]) {
            return i                                     //如果在当前的概率范围内,得到的就是当前概率
        }
        else {
            leng -= arr[i]                                 //否则减去当前的概率范围,进入下一轮循环
        }
    }
}

Game.otherUpdate = () => {
    Game.players.forEach((item, index) => {
        item.update();
    })
    Game.bombs = Game.bombs.filter(item => item.die != true)
    Game.bombs.forEach((item) => {
        item.update();
    })
    Game.freshItem.deltaFrame++;
    if (Game.freshItem.deltaFrame == 5) {
        Game.freshItem.arr.forEach((item) => {
            item.giftUpdate();
        })
        Game.freshItem.deltaFrame = 0;
    }
    Game.blockMoveAnimate.deltaFrame++;
    if (Game.blockMoveAnimate.deltaFrame == 1) {
        Game.blockMoveAnimate.arr = Game.blockMoveAnimate.arr.filter(item => typeof item.moveAnimateProperty != 'undefined')
        Game.blockMoveAnimate.arr.forEach((item) => {
            item.animateFuncCall();
        })
        Game.blockMoveAnimate.deltaFrame = 0;
    }
}

Game.gArr = [];//物品概率数组
Game.picArray = new Array(); //图片数组
Game.players = new Array();//玩家数组
Game.bombs = new Array();//炸弹数组
Game.freshItem = { deltaFrame: 0, arr: new Array() };//物品刷新数组
Game.blockMoveAnimate = { deltaFrame: 0, arr: new Array() };;//块移动数组;
let game = new Game();
//let a=new Bitmap("pic/red.png");