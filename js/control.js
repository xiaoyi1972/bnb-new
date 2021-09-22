let keys = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    19: 'Pause',
    20: 'Caps Lock',
    27: 'Esc',
    32: 'Space',
    33: 'PgUp',
    34: 'PgDn',
    35: 'End',
    36: 'Home',
    37: '←',
    38: '↑',
    39: '→',
    40: '↓',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    59: ';',
    61: '=',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    96: '0kpad',
    97: '1kpad',
    98: '2kpad',
    99: '3kpad',
    100: '4kpad',
    101: '5kpad',
    102: '6kpad',
    103: '7kpad',
    104: '8kpad',
    105: '9kpad',
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111: '/',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    173: '-',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
    undefined: "---",
    0: "---"
}

let currentKeyCode = 0
let isKeyup = false

function createRoleEvent(player) {
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keydownend)

    function keydown(event) {
        rolekey(player, event.keyCode)
    }

    function keydownend(event) {
        rolekeyend(player, event.keyCode)
    }

}

function rolekey(player, key) {
    if (key in { 37: 'Left', 38: 'UP', 39: 'Right', 40: 'Down' }) {
        if (key != currentKeyCode) {
            isKeyup = false
            //player.stopMove()
        }
        if (!isKeyup) {
            currentKeyCode = key
            isKeyup = true
            switch (key) {
                case 37: player.moveActivate = player.move.bind(player, directions.Left); break;//左；
                case 39:player.moveActivate = player.move.bind(player, directions.Right);break;//右；
                case 38:player.moveActivate = player.move.bind(player, directions.Up);break;//上；
                case 40: player.moveActivate = player.move.bind(player, directions.Down);break;//下；
            }
            player.moveActivate()
        }

    }

    /* else if (key == 81) {
         player.revive()
         //q；
     }
 
     else if (key == 87) {
         let ai = new AI(player)
         ai.getway()
         //q；
     }*/

    else if (key == 32) {
        player.putBomb()
        //空格；
    }
}

function rolekeyend(player, key) {
    if (key == currentKeyCode) {
        isKeyup = false
        player.moveActivate = null
        //player.stopMove()
    }

}
