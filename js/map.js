let floorType = { 0: { url: "pic/floor.bmp", offset: new Pos(0, 0) } }
let blockType = {
    1: {
        url: "pic/red.png", offset: new Pos(0, -17),
        canBomb: false, create: true, produce: false, canMove: false, canPush: false, canHide: false
    },
    2: {
        url: "pic/blue.png", offset: new Pos(0, -17),
        canBomb: false, create: true, produce: false, canMove: false, canPush: false, canHide: false
    },
    3: {
        url: "pic/yellow.png", offset: new Pos(0, -17),
        canBomb: false, create: true, produce: false, canMove: false, canPush: false, canHide: false
    },
    4: {
        url: "pic/tree.png", offset: new Pos(0, -27),
        canBomb: false, create: true, produce: false, canMove: false, canPush: false, canHide: false
    },
    5: {
        url: "pic/grass.png", offset: new Pos(0, -17),
        canBomb: true, create: true, produce: false, canMove: false, canPush: false, canHide: true
    },
    6: {
        url: "pic/redblock.png", offset: new Pos(0, -4),
        canBomb: true, create: true, produce: true, canMove: false, canPush: false, canHide: false
    },
    7: {
        url: "pic/yellowblock.png", offset: new Pos(0, -4),
        canBomb: true, create: true, produce: true, canMove: false, canPush: false, canHide: false
    },
    8: {
        url: "pic/yellowbox.png", offset: new Pos(0, -4),
        canBomb: true, create: true, produce: false, canMove: false, canPush: true, canHide: false
    }
}

let giftType = {
    0: { odds: 190 },
    1: { url: "pic/Gift1.png", offset: new Pos(-1, -5), size: new Size(42, 45), odds: 40 },
    2: { url: "pic/Gift2.png", offset: new Pos(-1, -5), size: new Size(42, 45), odds: 40 },
    3: { url: "pic/Gift3.png", offset: new Pos(-1, -5), size: new Size(42, 45), odds: 40 },
    4: { url: "pic/Gift4.png", offset: new Pos(-1, -5), size: new Size(42, 45), odds: 3 },
    5: { url: "pic/Gift7.png", offset: new Pos(2, -2), size: new Size(36, 38), odds: 3 },
    6: { url: "pic/Gift8.png", offset: new Pos(2, -2), size: new Size(36, 41), odds: 3 },
    7: { url: "pic/Gift9.png", offset: new Pos(0, -2), size: new Size(40, 41), odds: 7 },
    8: { url: "pic/Gift6.png", offset: new Pos(-1, -3), size: new Size(42, 46), odds: 7 },
    9: { url: "pic/Gift5.png", offset: new Pos(-1, -2.5), size: new Size(42, 45), odds: 7 }
}

for (let i in giftType) {
    Game.gArr.push(giftType[i].odds)
}


let FloorMaps = [[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0]]


let BlockMaps = [[0, 7, 6, 7, 6, 5, 0, 0, 8, 5, 3, 6, 3, 0, 3],
[0, 1, 8, 1, 8, 4, 8, 0, 0, 4, 7, 6, 0, 0, 0],
[0, 0, 7, 6, 7, 5, 0, 8, 8, 5, 3, 8, 3, 8, 3],
[8, 1, 8, 1, 8, 4, 8, 0, 0, 4, 6, 7, 6, 7, 6],
[6, 7, 6, 7, 6, 5, 0, 0, 8, 5, 3, 8, 3, 8, 3],
[7, 1, 7, 1, 7, 4, 8, 8, 0, 0, 7, 6, 7, 6, 7],
[4, 5, 4, 5, 4, 5, 0, 0, 8, 5, 4, 5, 4, 5, 4],
[6, 7, 6, 7, 6, 0, 8, 0, 0, 4, 7, 1, 7, 1, 7],
[2, 8, 2, 8, 2, 5, 0, 8, 8, 5, 6, 7, 6, 7, 6],
[7, 6, 7, 6, 7, 4, 8, 0, 0, 4, 8, 1, 8, 1, 8],
[2, 0, 2, 8, 2, 5, 0, 0, 8, 5, 7, 6, 7, 6, 0],
[0, 0, 6, 7, 6, 4, 8, 8, 0, 4, 8, 1, 8, 1, 0],
[2, 0, 2, 8, 2, 5, 0, 0, 8, 5, 6, 7, 6, 0, 0]]



/*let FloorMaps = [
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0]]

let BlockMaps = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 6, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]*/

class Block {
    constructor(_pos, _index, _map, _type = 0) {
        this.map = _map
        this.pos = _pos
        this.type = _type;//类型 0 块 1 物品
        this.property = _type == 0 ? blockType[_index] : giftType[_index]
        this.create()
        this.map.dataSet(_pos.x, _pos.y, this)
        this.hideItem = null
    }

    create() {
        let type = this.property
        let bmp = new Bitmap(type.url)
        bmp.divide = new Pos(0, 0)
        bmp.pos = new Pos(this.pos.y * 40 + type.offset.x, this.pos.x * 40 + type.offset.y)
        bmp.offset = new Pos(this.map.offset.x + type.offset.x, this.map.offset.y)
        bmp.Zindex = 3 * (this.pos.x + 1)
        this.bmp = bmp

        this.bmp.CanCollision = true; //碰撞
        this.bmp.collision.size = new Size(40, 40)
        this.bmp.collision.offset = new Pos(- type.offset.x, - type.offset.y)
        if (this.type == 1) {
            this.property = {
                ...this.property,
                ...{ canBomb: true, create: true, produce: false, canMove: true, canPush: false, canHide: false }
            }
            let shadow_bmp = new Bitmap("pic/ShadowGift.png")
            bmp.pos.y -= 6
            this.gift = { index: 0, Upoffset: 0, turn: 0, pre: new Pos(this.bmp.pos.x, this.bmp.pos.y) }
            this.bmp.size = this.property.size
            this.shadow = { index: 0, bmp: shadow_bmp }
            shadow_bmp.offset = new Pos(4 + type.offset.x, 36)
            shadow_bmp.pos.x = this.bmp.pos.x + this.bmp.size.width / 2 - 9
            shadow_bmp.pos.y = this.bmp.pos.y + this.bmp.size.height - 6
            shadow_bmp.Zindex = bmp.Zindex - 1
            shadow_bmp.size = new Size(18, 9)
            shadow_bmp.divide = new Pos(this.shadow.index * 19, 0)
            Game.freshItem.arr.push(this)
        }
    }

    giftUpdate() {
        if (this.type == 1) {
            if (typeof this.shadow != 'undefined' && typeof this.gift != 'undefined') {
                //this.shadow.index = (this.shadow.index + 1) % 2
                this.shadow.index = (this.gift.Upoffset == 0) ? 1 : 0
                this.gift.index = (this.gift.index + 1) % 3
            }
            this.bmp.pos.y = this.gift.pre.y - this.gift.Upoffset
            if (!this.gift.turn)
                this.gift.Upoffset++
            else
                this.gift.Upoffset--
            if (this.gift.Upoffset == 6) {
                this.gift.turn = !this.gift.turn
            }
            if (this.gift.Upoffset == 0) {
                this.gift.turn = !this.gift.turn
            }
            this.bmp.divide = new Pos(this.gift.index * this.bmp.size.width, 0)
            this.shadow.bmp.divide = new Pos(this.shadow.index * 19, 0)
        }
    }

    del() {
        // console.log(1)
        this.bmp.visible = false
        if (typeof this.shadow != 'undefined')
            this.shadow.bmp.visible = false
        if (this.map.dataAt(this.pos.x, this.pos.y) == this)
            this.map.dataSet(this.pos.x, this.pos.y, null)
        if (this.map.dataAt(this.pos.x, this.pos.y) != null &&
            this.map.dataAt(this.pos.x, this.pos.y).property.canHide) {
            if (this.map.dataAt(this.pos.x, this.pos.y).hideItem == this)
                this.map.dataAt(this.pos.x, this.pos.y).hideItem = null
        }
        if (this.type == 1) {
            //  console.log("nice")
            let index = Game.freshItem.arr.indexOf(this)
            if (index != -1)
                Game.freshItem.arr.splice(index, 1)
        }
    }

    startMove(_pos) {
        let _times = 10
        if (typeof this.moveAnimateProperty != 'undefined') {
            return
        }
        if (this.map.dataAt(_pos.x, _pos.y) == null) {
            this.bmp.cover = false
        }
        this.moveAnimateProperty = {
            times: _times,
            moveToPos: _pos,
            distanceDelta: {
                x: (_pos.y - this.pos.y) * 40 / _times,
                y: (_pos.x - this.pos.x) * 40 / _times
            },
            timeCount: 0,
        }
        this.animateFuncCall = this.moveAnimateUpdate
        Game.blockMoveAnimate.arr.push(this)
    }

    moveAnimateUpdate() {
        if (typeof this.moveAnimateProperty != 'undefined') {
            this.bmp.pos = new Pos(this.bmp.pos.x + this.moveAnimateProperty.distanceDelta.x,
                this.bmp.pos.y + this.moveAnimateProperty.distanceDelta.y)
            this.moveAnimateProperty.timeCount++
            if (this.moveAnimateProperty.timeCount == this.moveAnimateProperty.times) {

                if (this.map.dataAt(this.pos.x, this.pos.y) != null &&
                    this.map.dataAt(this.pos.x, this.pos.y).property.canHide)
                    this.map.dataAt(this.pos.x, this.pos.y).hideItem = null
                else
                    this.map.dataSet(this.pos.x, this.pos.y, null)

                this.pos = this.moveAnimateProperty.moveToPos
                if (this.map.dataAt(this.pos.x, this.pos.y) != null &&
                    this.map.dataAt(this.pos.x, this.pos.y).property.canHide) {
                    this.map.dataAt(this.pos.x, this.pos.y).hideItem = this
                    this.bmp.cover = true
                }
                else {
                    this.map.dataSet(this.pos.x, this.pos.y, this)
                    this.bmp.cover = false
                }
                this.bmp.Zindex = 3 * (this.pos.x + 1)
                delete this.animateFuncCall
                delete this.moveAnimateProperty
            }
        }
    }

    startHide(_pos) {
        let _times = 5
        if (typeof this.moveAnimateProperty != 'undefined') {
            return
        }
        this.moveAnimateProperty = {
            times: _times,
            timeCount: 0,
        }
        this.animateFuncCall = this.hidedAnimateUpdate
        Game.blockMoveAnimate.arr.push(this)
    }

    hidedAnimateUpdate() {
        if (typeof this.moveAnimateProperty != 'undefined') {
            let shakeX = 0
            switch (this.moveAnimateProperty.timeCount) {
                case 0: shakeX = -4; break
                case 2: shakeX = 8; break
                case 4: shakeX = -4; break
            }
            this.bmp.pos.x += shakeX
            this.moveAnimateProperty.timeCount++
            if (this.moveAnimateProperty.timeCount == this.moveAnimateProperty.times) {
                this.bmp.Zindex = 3 * (this.pos.x + 1)
                delete this.moveAnimateProperty
            }
        }
    }
}

class Map {
    constructor(_rows, _cols) {
        this.row = _rows
        this.col = _cols
        this.data = new Array(this.row * this.col).fill(null) //Game.get2dArray(_rows, _cols, null)
        this.offset = new Pos(4, 24)
        this.initFloor()
        this.initBlock()
        this.copyTo = this.copyTo.bind(this)
    }

    index(i, j) { return i * this.col + j }
    value(i, j) { return this.data[this.index(i, j)].hideItem != null ? this.data[this.index(i, j)].hideItem : this.data[this.index(i, j)] }
    dataSet(i, j, val) { this.data[this.index(i, j)] = val }
    dataAt(i, j) { return this.data[this.index(i, j)] }

    copyTo() {
        for (let i = 0; i < this.row; i++)
            for (let j = 0; j < this.col; j++) {
                this.data(this.index(i, j)) = parseInt(BlockMaps[i][j])
            }
    }

    initFloor() {
        for (let i = 0; i < FloorMaps.length; i++)
            for (let j = 0; j < FloorMaps[0].length; j++) {
                this.addFloor(i, j, FloorMaps[i][j])
            }
    }

    initBlock() {//把块添加到画图
        for (let i = 0; i < BlockMaps.length; i++)
            for (let j = 0; j < BlockMaps[0].length; j++) {
                this.addBlock(i, j, BlockMaps[i][j])
            }
    }

    addFloor(_row, _col, _index) {
        let type = floorType[0]
        let bmp = new Bitmap(type.url)
        bmp.divide = new Pos(0, 0)
        bmp.pos = new Pos(_col * 40, _row * 40 + type.offset.y)
        bmp.size = new Size(40, 40)
        bmp.divide = new Pos(40 * _index, 0)
        bmp.offset = this.offset //new Pos(4, 24)
        bmp.Zindex = 1
    }

    addBlock(_row, _col, _index) {
        if (_index === 0) return
        new Block(new Pos(_row, _col), _index, this)
    }

    addGift(_row, _col, _index) {
        if (_index === 0) return
        new Block(new Pos(_row, _col), _index, this, 1)
    }

    borderCheck(pos) {
        let res = true
        if (pos.x < 0 || pos.x > this.row - 1 || pos.y < 0 || pos.y > this.col - 1)
            res = false
        return res
    }

    borderCheckReal(_pos, _offset) {
        let res = true
        const delta = new Pos(this.offset.x - _offset.x, this.offset.y - _offset.y)
        if (_pos.x < 0 + delta.x) { _pos.x = 0 + delta.x; res = false }
        if (_pos.x > (this.col - 1) * 40 + delta.x) { _pos.x = (this.col - 1) * 40 + delta.x; res = false }
        if (_pos.y < 0 + delta.y) { _pos.y = 0 + delta.y; res = false }
        if (_pos.y > (this.row - 1) * 40 + delta.y) { _pos.y = (this.row - 1) * 40 + delta.y; res = false }
        return res
    }

    isBlock(pos) {
        if (pos.x < 0 || pos.x > this.row - 1 || pos.y < 0 || pos.y > this.col - 1) return false
        if (this.dataAt(pos.x, pos.y) instanceof Block) return true
        else return false
    }
}

let map = new Map(BlockMaps.length, BlockMaps[0].length)


