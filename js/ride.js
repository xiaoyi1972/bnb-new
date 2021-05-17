let ridePic = {
    1: { url: "pic/Owl.png", width: 40, height: 40, offsetX: 0, offsetY: -15, speed: 4, canMove: false },
    2: { url: "pic/SlowTurtle.png", width: 48, height: 32, offsetX: -4, offsetY: -9, speed: 2, canMove: false },
    3: { url: "pic/Turtle.png", width: 48, height: 32, offsetX: -4, offsetY: -9, speed: 6, canMove: false },
    4: { url: "pic/FastUFO.png", width: 52, height: 31, offsetX: -6, offsetY: -9, speed: 6, canMove: true }
} //player width 48 height 56

class Rider {
    constructor(type, player) {
        this.player = player
        this.type = type
        this.canMove = ridePic[this.type].canMove
        this.speed = ridePic[this.type].speed
        this.bmp = null
        this.init(this.type)
    }

    init(type) {
        this.bmp = new Bitmap(ridePic[type].url)
        this.bmp.pos = this.player.bmp.pos
        this.bmp.divide.y = new Pos(Math.floor(this.player.status / 9) * ridePic[this.type].width,
            this.player.dir * ridePic[this.type].height)
        this.bmp.size = new Size(ridePic[this.type].width, ridePic[this.type].height)
        this.bmp.offset = new Pos(ridePic[this.type].offsetX + (this.player.bmp.size.width - 40) / 2,
            this.player.bmp.size.height + ridePic[this.type].offsetY)
        this.bmp.Zindex = this.player.bmp.Zindex
        this.bmp.cover = this.player.bmp.cover
    }

    update() {
        this.bmp.Zindex = this.player.bmp.Zindex
        this.bmp.pos.x = this.player.bmp.pos.x// + ridePic[this.type].offsetX
        this.bmp.pos.y = this.player.bmp.pos.y// + ridePic[this.type].offsetY
        this.bmp.divide.y = this.player.dir * ridePic[this.type].height
        this.bmp.divide.x = Math.floor(this.player.status / 9) * ridePic[this.type].width
        this.bmp.cover = this.player.bmp.cover
    }

    del() {
        this.bmp.visible = false
    }
}
