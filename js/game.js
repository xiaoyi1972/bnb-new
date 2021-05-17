Array.get2dArray = function (_rows, _cols, _value) {
    return Array(_rows).fill(_value).map(() => Array(_cols).fill(_value))
}

class Bitmap {
    constructor(url, _pos = new Pos(-NaN, -NaN)) {
        Object.defineProperty(this, "pos", {
            get: function () { return this.m_pos; }, set: function (_pos) { this.m_pos = _pos; this.collisionCal(); }
        })
        Object.defineProperty(this, "size", {
            get: function () { return this.m_size; }, set: function (_size) { this.m_size = _size; }
        })
        Object.defineProperty(this, "offset", {
            get: function () { return this.m_offset; }, set: function (_offset) { this.m_offset = _offset; }
        })
        Object.defineProperty(this, "divide", {
            get: function () { return this.m_divide; }, set: function (_divide) { this.m_divide = _divide; }
        })
        Object.defineProperty(this, "visible", {
            get: function () { return this.m_visible; }, set: function (_var) {
                if (this.m_visible === _var) return
                if (!_var)
                    Game.sorted = false
                this.m_visible = _var;
            }
        })
        Object.defineProperty(this, "Zindex", {
            get: function () { return this.m_Zindex; }, set: function (_var) {
                if (this.m_Zindex === _var) return
                else {
                    Game.sorted = false
                    this.m_Zindex = _var;
                }
            }
        })
        Object.defineProperty(this, "CanCollision", {
            get: function () { return this.m_CanCollision; },
            set: function (able) {
                this.m_CanCollision = able
                if (able)
                    this.collisionCal()
                else {
                    if (this.hasOwnProperty("collision"))
                        delete this.collision
                }
            }
        })
        this.image = new Image()
        this.image.src = url
        this.border = false
        this.image.onload = () => {
            if (this.size == undefined) {
                this.size = new Size(this.image.width, this.image.height)
            }
            // this.collisionCal()
        }
        this.Zindex = 0; //绘图层次
        this.pos = _pos //位置
        this.divide = new Pos(0, 0); //分割
        this.size = null; //大小
        this.offset = new Pos(0, 0); //偏移
        this.visible = true; //可见
        this.cover = false; //覆盖
        this.CanCollision = false; //能否碰撞
        this.draw = this.draw.bind(this)
        this.showCollision = false//true
        Game.picArray.push(this)
        Game.sorted = false
    }

    collisionCal() {
        if (!this.CanCollision) return
        let pos = this.pos
        if (pos == undefined) pos = new Pos(0, 0)
        let size = this.size
        if (size == undefined) size = new Size(0, 0)
        let offset = this.offset
        if (offset == undefined) offset = new Pos(0, 0)
        if (this.collision == undefined)
            this.collision = new RectCollision(pos.x + offset.x, pos.y + offset.y, size.width, size.height)
        else {
            if (this.collision instanceof RectCollision) {
                this.collision.pos.x = pos.x + offset.x
                this.collision.pos.y = pos.y + offset.y
            }
        }
    }

    collisionRevise(val) {
        if (val instanceof RectCollision) {
            const pos = new Pos(val.pos.x - this.offset.x, val.pos.y - this.offset.y)
            return pos
        }
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(Game.globalOffset.x, Game.globalOffset.y)
        //ctx.setTransform(1, 0, 0, 1, Game.globalOffset.x, Game.globalOffset.y)
        if (this.size == null) {
            ctx.drawImage(this.image, this.pos.x + this.offset.x, this.pos.y + this.offset.y)
        }
        else {
            ctx.drawImage(this.image, this.divide.x, this.divide.y, this.size.width, this.size.height, this.pos.x + this.offset.x,
                this.pos.y + this.offset.y, this.size.width, this.size.height)
        }
        if (this.border) {
            ctx.strokeStyle = "#000000"
            ctx.strokeRect(this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.width, this.size.height)
        }
        if (this.showCollision) {
            if (this.collision && this.collision instanceof RectCollision) {
                ctx.strokeStyle = "#000000"
                ctx.lineWidth = 1
                ctx.strokeRect(this.collision.pos.x + 0.5 + this.collision.offset.x, this.collision.pos.y + 0.5 + this.collision.offset.y,
                    this.collision.size.width, this.collision.size.height)
            }
        }
        ctx.restore()
    }
}

class RectCollision {
    get left() { return this.pos.x + this.offset.x; }
    set left(val) { this.pos.x = val - this.offset.x; }
    get top() { return this.pos.y + this.offset.y; }
    set top(val) { this.pos.y = val - this.offset.y; }
    get right() { return this.pos.x + this.offset.x + this.size.width; }
    set right(val) { this.pos.x = val - this.offset.x - this.size.width; }
    get bottom() { return this.pos.y + this.offset.y + this.size.height; }
    set bottom(val) { this.pos.y = val - this.offset.y - this.size.height; }

    constructor(x, y, width, height) {
        this.pos = new Pos(x, y)
        this.size = new Size(width, height)
        this.offset = new Pos(0, 0)
    }

    reset(x, y, width, height) {
        this.pos.x = x
        this.pos.y = y
        this.size.width = width
        this.size.height = height
    }

    detect(other) {
        //   console.log(this,other)
        //   console.log(` this(left:${this.left};top:${this.top};right:${this.right};bottom:${this.bottom})\nother(left:${other.left};top:${other.top};right:${other.right};bottom:${other.bottom})`)
        return Math.max(this.left, other.left) < Math.min(this.right, other.right)
            && Math.max(this.top, other.top) < Math.min(this.bottom, other.bottom)
    }

    copy() {
        const duplicate = new RectCollision(this.pos.x, this.pos.y, this.size.width, this.size.height)
        duplicate.offset.x = this.offset.x
        duplicate.offset.y = this.offset.y
        return duplicate
    }
}

class Pos {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    copy() {
        let pos = new Pos(this.x, this.y)
        return pos
    }
}

class Size {
    constructor(width, height) {
        this.width = width
        this.height = height
    }
}

class Game {
    constructor() {
        this.canvas = document.createElement('Canvas')
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext("2d")
        this.canvas.width = 680
        this.canvas.height = 600
        //  gaoqing(this.canvas)
        //  this.end = false
        this.handle
    }

    start = () => {
        this.draw()
    }

    pause = () => {
        cancelAnimationFrame(this.handle)
        this.canvas.style.display = 'none'
    }

    draw = () => {
        Game.otherUpdate()
        if (!Game.sorted) {
            Game.picArray.sort((a, b) => { return a.visible && b.visible ? (a.Zindex < b.Zindex ? -1 : 1) : a.visible < b.visible ? 1 : -1 })
            Game.sorted = true
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        const sortedArr = []
        for (let i = 0, len = Game.picArray.length; i < len && Game.picArray[i].visible; i++) {
            if (!Game.picArray[i].cover)
                Game.picArray[i].draw(this.ctx)
            sortedArr.push(Game.picArray[i])
        }
        Game.picArray = sortedArr

        this.handle = requestAnimationFrame(this.draw)
    }
}

Game.get2dArray = function (_rows, _cols, _value) {
    return Array(_rows).fill(_value).map(x => Array(_cols).fill(_value))
}
Game.globalOffset = new Pos(20, 40)

Game.getLottery = function (arr) {
    let leng = 0
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
        item.update()
    })
    Game.bombs = Game.bombs.filter(item => item.die != true)
    Game.bombs.forEach((item) => {
        item.update()
    })
    Game.freshItem.deltaFrame++
    if (Game.freshItem.deltaFrame == 5) {
        Game.freshItem.arr.forEach((item) => {
            item.giftUpdate()
        })
        Game.freshItem.deltaFrame = 0
    }
    Game.blockMoveAnimate.deltaFrame++
    if (Game.blockMoveAnimate.deltaFrame == 1) {
        Game.blockMoveAnimate.arr = Game.blockMoveAnimate.arr.filter(item => typeof item.moveAnimateProperty != 'undefined')
        Game.blockMoveAnimate.arr.forEach((item) => {
            item.animateFuncCall()
        })
        Game.blockMoveAnimate.deltaFrame = 0
    }
}


function gaoqing(canvas) {
    function getPixelRatio(context) {
        let backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1
        return (window.devicePixelRatio || 1) / backingStore
    };
    let ctx = canvas.getContext('2d');
    const ratio = getPixelRatio(ctx)
    canvas.style.width = `${canvas.width}px`
    canvas.style.height = `${canvas.height}px`
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio
    ctx.scale(ratio, ratio);
}

Game.sorted = true //是否排序
Game.gArr = [];//物品概率数组
Game.picArray = new Array(); //图片数组
Game.players = new Array();//玩家数组
Game.bombs = new Array();//炸弹数组
Game.freshItem = { deltaFrame: 0, arr: new Array() };//物品刷新数组
Game.blockMoveAnimate = { deltaFrame: 0, arr: new Array() };;//块移动数组
let game = new Game()
//let a=new Bitmap("pic/red.png")