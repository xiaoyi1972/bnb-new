function newConflict(){
    const center = this.getPointCenter()
    let bp = this.getMap(20, 20);//中心点
    const dup = this.bmp.collision.copy()
    dup.pos.x += (_dir == directions.Right ? this.speed : (_dir == directions.Left ? -this.speed : 0))
    dup.pos.y += (_dir == directions.Down ? this.speed : (_dir == directions.Up ? -this.speed : 0))
    const dir = { l: 1, r: 2, u: 4, d: 8 }
    let conflict = false, moveFix = false, blockerItem = null;
    let posSelect = new Pos(_dir == directions.Up ? -1 : _dir == directions.Down ? 1 : 0,
        _dir == directions.Left ? -1 : _dir == directions.Right ? 1 : 0)
    let posHandle = new Pos(bp.x + posSelect.x, bp.y + posSelect.y);
    let dirFix = ((_dir == directions.Up || _dir == directions.Down) && (center & dir.r ? 1 : center & dir.l ? -1 : 0)) +
        ((_dir == directions.Left || _dir == directions.Right) && (center & dir.d ? 1 : center & dir.u ? -1 : 0))

    if (map.isBlock(posHandle) && dup.detect(map.value(posHandle.x, posHandle.y).bmp.collision)
    ) {
        const item = map.value(posHandle.x, posHandle.y);
        blockerItem = item;
        conflict = true;
    }
    else {
        let tryPos = new Pos(((_dir == directions.Left || _dir == directions.Right) ? dirFix : 0) + posHandle.x,
            ((_dir == directions.Up || _dir == directions.Down) ? dirFix : 0) + posHandle.y)
        if (dirFix != 0 && map.isBlock(tryPos)) {
            const item = map.value(tryPos.x, tryPos.y)
            if (dup.detect(item.bmp.collision)) {
                conflict = true;
                moveFix = true;
                blockerItem = item;
            }
        }
    }
    if (conflict) {
        switch (_dir) {
            case directions.Up: dup.top = blockerItem.bmp.collision.bottom; break
            case directions.Down: dup.bottom = blockerItem.bmp.collision.top; break
            case directions.Left: dup.left = blockerItem.bmp.collision.right; break
            case directions.Right: dup.right = blockerItem.bmp.collision.left; break
        }
        if (moveFix) {
            switch (posSelect.y) {
                case 0: dup.pos.x += -dirFix * this.speed; break
                default: dup.pos.y += -dirFix * this.speed; break
            }
        }
        const pos = this.bmp.collisionRevise(dup)
        this.x = pos.x
        this.y = pos.y
    }
}





function oldConflict(){
if (_dir == directions.Up) {
    if (map.isBlock(new Pos(bp.x - 1, bp.y)) && dup.detect(map.value(bp.x - 1, bp.y).bmp.collision)) {
        const item = map.value(bp.x - 1, bp.y);
        dup.top = item.bmp.collision.bottom;
    }
    else {
        let dirFix = center & dir.r ? 1 : (center & dir.l ? -1 : 0)
        if (dirFix != 0 && map.isBlock(new Pos(bp.x - 1, bp.y + dirFix))) {
            const item = map.value(bp.x - 1, bp.y + dirFix)
            if (dup.detect(item.bmp.collision)) {
                dup.top = item.bmp.collision.bottom;
                dup.pos.x += -dirFix * this.speed;
            }
        }
    }
    //   dup.top = item.bmp.collision.bottom;
}//上
else if (_dir == directions.Down) {
    if (map.isBlock(new Pos(bp.x + 1, bp.y)) && dup.detect(map.value(bp.x + 1, bp.y).bmp.collision)) {
        const item = map.value(bp.x + 1, bp.y);
        dup.bottom = item.bmp.collision.top;
    }
    else {
        let dirFix = center & dir.r ? 1 : (center & dir.l ? -1 : 0)
        if (dirFix != 0 && map.isBlock(new Pos(bp.x + 1, bp.y + dirFix))) {
            const item = map.value(bp.x + 1, bp.y + dirFix)
            if (dup.detect(item.bmp.collision)) {
                dup.bottom = item.bmp.collision.top;
                dup.pos.x += -dirFix * this.speed;
            }
        }
    }
    //  dup.bottom = item.bmp.collision.top;
}//下
else if (_dir == directions.Left) {
    if (map.isBlock(new Pos(bp.x, bp.y - 1)) && dup.detect(map.value(bp.x, bp.y - 1).bmp.collision)) {
        const item = map.value(bp.x, bp.y - 1);
        dup.left = item.bmp.collision.right;
    }
    else {
        let dirFix = center & dir.d ? 1 : (center & dir.u ? -1 : 0)
        if (dirFix != 0 && map.isBlock(new Pos(bp.x + dirFix, bp.y - 1))) {
            const item = map.value(bp.x + dirFix, bp.y - 1)
            if (dup.detect(item.bmp.collision)) {
                dup.left = item.bmp.collision.right;
                dup.pos.y += -dirFix * this.speed;
            }
        }
    }
    //  dup.left = item.bmp.collision.right;
}//左
else if (_dir == directions.Right) {
    if (map.isBlock(new Pos(bp.x, bp.y + 1)) && dup.detect(map.value(bp.x, bp.y + 1).bmp.collision)) {
        const item = map.value(bp.x, bp.y + 1);
        dup.right = item.bmp.collision.left;
    }
    else {
        let dirFix = center & dir.d ? 1 : (center & dir.u ? -1 : 0)
        if (dirFix != 0 && map.isBlock(new Pos(bp.x + dirFix, bp.y + 1))) {
            const item = map.value(bp.x + dirFix, bp.y + 1)
            if (dup.detect(item.bmp.collision)) {
                dup.right = item.bmp.collision.left;
                dup.pos.y += -dirFix * this.speed;
            }
        }
    }
}//右
}