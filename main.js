const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.width = 600
canvas.height = 640

let xi = 20, yi = 20, xf = 320, yf = 620

const drawBackground = () => {
    ctx.beginPath()
    ctx.fillStyle = '#858585'
    ctx.fillRect(18, 18, 305, 605)
    ctx.fillStyle = 'black'
    ctx.fillRect(xi, yi, 300, 600)
    ctx.closePath()


    for (let i = xi, j = yi; j <= yf; i += 30, j += 30) {
        if (i <= xf) {
            ctx.beginPath()
            ctx.moveTo(i, yi)
            ctx.lineTo(i, yf)
            ctx.strokeStyle = '#272727'
            ctx.stroke()
            ctx.closePath()
        }
        ctx.beginPath()
        ctx.moveTo(xi, j)
        ctx.lineTo(xf, j)
        ctx.strokeStyle = '#272727'
        ctx.stroke()
        ctx.closePath()
    }
}




const shapes = [
    [
        [' ', '-', '-', ' '],
        [' ', '-', '-', ' ']
    ],
    [
        [' ', ' ', '-', ' '],
        ['-', '-', '-', ' ']
    ],
    [
        ['-', ' ', ' ', ' '],
        ['-', '-', '-', ' ']
    ],
    [
        [' ', '-', ' ', ' '],
        ['-', '-', '-', ' ']
    ],
    [
        ['-', '-', ' ', ' '],
        [' ', '-', '-', ' ']
    ],
    [
        [' ', '-', '-', ' '],
        ['-', '-', ' ', ' ']
    ],
    [
        [' ', ' ', ' ', ' '],
        ['-', '-', '-', '-']
    ]
]

class TetrisBlock {
    constructor({ color, position, velocity }) {
        this.color = color
        this.position = position
        this.velocity = velocity
        this.mooveBuffer = 0
        this.fallBuffer = 0
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, 30, 30)
        ctx.strokeStyle = "#202020"
        ctx.lineWidth = 3
        ctx.strokeRect(this.position.x + 1, this.position.y + 1, 28, 28)
        ctx.closePath()
    }
    moove() {
        this.mooveBuffer += this.velocity.x

        if (this.mooveBuffer === 30 || this.mooveBuffer === -30) {
            this.position.x += this.mooveBuffer
            this.mooveBuffer = 0
        }
    }
    fall() {
        this.fallBuffer += this.velocity.y

        if (this.fallBuffer === 30 || this.fallBuffer === -30) {
            this.position.y += this.fallBuffer
            this.fallBuffer = 0
        }
    }

}

const staticBlocks = []

let player = []


let nextPiece = Math.floor(Math.random() * 7)

let currentPiece

const randomPiece = () => {
    currentPiece = nextPiece
    nextPiece = Math.floor(Math.random() * 7)
}

const collidingWithMap = () => {
    return (((player[0].position.x + player[0].velocity.x + 30 <= 320) &&
        (player[1].position.x + player[1].velocity.x + 30 <= 320) &&
        (player[2].position.x + player[2].velocity.x + 30 <= 320) &&
        (player[3].position.x + player[3].velocity.x + 30 <= 320)) &&
        ((player[0].position.x + player[0].velocity.x >= 20) &&
            (player[1].position.x + player[1].velocity.x >= 20) &&
            (player[2].position.x + player[2].velocity.x >= 20) &&
            (player[3].position.x + player[3].velocity.x >= 20)))
}


const newPiece = () => {
    randomPiece()
    let color = ''
    switch (currentPiece) {
        case 0: color = 'yellow'
            break
        case 1: color = 'orange'
            break
        case 2: color = 'blue'
            break
        case 3: color = 'purple'
            break
        case 4: color = 'red'
            break
        case 5: color = 'green'
            break
        case 6: color = 'cyan'
            break
    }
    shapes[currentPiece].map((lin, i) => {
        lin.map((col, j) => {
            if (col === '-') {
                player.push(new TetrisBlock({
                    color: color,
                    position: {
                        x: 110 + j * 30,
                        y: -40 + i * 30
                    },
                    velocity: {
                        x: 0,
                        y: 2
                    }
                })
                )
            }
        })
    })
}
newPiece()
drawBackground()


let rotatePosition = 0


player.map((playerCell) => {
    playerCell.draw()
})




const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()

    staticBlocks.map((block) => {
        block.draw()
    })

    if (!collidingWithMap()) {
        player.map((playerCell) => {
            playerCell.velocity.x = 0
        })
    }

    staticBlocks.map((block) => {
        if (((player[0].position.x + player[0].velocity.x <= block.position.x + 30 && player[0].position.x + player[0].velocity.x + 30 >= block.position.x && player[0].position.y === block.position.y) ||
            (player[1].position.x + player[1].velocity.x <= block.position.x + 30 && player[1].position.x + player[1].velocity.x + 30 >= block.position.x && player[1].position.y === block.position.y) ||
            (player[2].position.x + player[2].velocity.x <= block.position.x + 30 && player[2].position.x + player[2].velocity.x + 30 >= block.position.x && player[2].position.y === block.position.y) ||
            (player[3].position.x + player[3].velocity.x <= block.position.x + 30 && player[3].position.x + player[3].velocity.x + 30 >= block.position.x && player[3].position.y === block.position.y))) {
            player.map((playerCell) => {
                playerCell.mooveBuffer = 0
            })
        }
    })
    player.map((playerCell) => {
        if (playerCell.position.y >= 20) {
            playerCell.draw()
        }
        playerCell.moove()
    })


    if ((player[0].position.y + 30 < 620) &&
        (player[1].position.y + 30 < 620) &&
        (player[2].position.y + 30 < 620) &&
        (player[3].position.y + 30 < 620)) {
        player.map((playerCell) => {
            playerCell.fall()
        })
    }
    else if ((player[0].position.y + 30 === 620) ||
        (player[1].position.y + 30 === 620) ||
        (player[2].position.y + 30 === 620) ||
        (player[3].position.y + 30 === 620)) {
        player.map((playerCell) => {
            staticBlocks.push(playerCell)
        })
        player = []
        rotatePosition = 0
        newPiece()
    }

    staticBlocks.map((block) => {
        if ((player[0].position.y + 30 === block.position.y && player[0].position.x === block.position.x) ||
            (player[1].position.y + 30 === block.position.y && player[1].position.x === block.position.x) ||
            (player[2].position.y + 30 === block.position.y && player[2].position.x === block.position.x) ||
            (player[3].position.y + 30 === block.position.y && player[3].position.x === block.position.x)) {
            player.map((playerCell) => {
                staticBlocks.push(playerCell)
            })
            player = []
            rotatePosition = 0
            newPiece()
        }
    })




}
animate()

let keyPressed = {
    r: false,
    l: false
}

const rotate = () => {
    let fstX = 0, fstY = 0, sndX = 0, sndY = 0, thdX = 0, thdY = 0, fthX = 0, fthY = 0
    if (rotatePosition === 0) {
        rotatePosition++
        switch (currentPiece) {
            case 1: fstY = 30; sndY = -60; sndX = 30; thdY = -30; fthX = -30;
                break
            case 2: fstY = -30; fstX = 60; sndY = -60; sndX = 30; thdY = -30; fthX = -30;
                break
            case 3: fstX = 30; sndY = -60; sndX = 30; thdY = -30; fthX = -30;
                break
            case 4: fstY = -30; fstX = 30; thdY = -30; thdX = -30; fthX = -60;
                break
            case 5: fstX = 30; sndY = 30; thdY = -60; thdX = 30; fthY = -30;
                break
            case 6: fstY = -90; fstX = 30; sndY = -60; thdY = -30; thdX = -30; fthX = -60;
                break
        }
    }
    else if (rotatePosition === 1) {
        rotatePosition++
        switch (currentPiece) {
            case 1: fstX = -60; sndY = 30; sndX = 30; fthY = -30; fthX = -30;
                break
            case 2: fstY = 60; sndY = 30; sndX = 30; fthY = -30; fthX = -30;
                break
            case 3: fstY = 30; fstX = -30; sndY = 30; sndX = 30; fthY = -30; fthX = -30;
                break
            case 4: fstY = 30; fstX = -30; thdY = 30; thdX = 30; fthX = 60;
                rotatePosition = 0
                break
            case 5: fstX = -30; sndY = -30; thdY = 60; thdX = -30; fthY = 30;
                rotatePosition = 0
                break
            case 6: fstY = 90; fstX = -30; sndY = 60; thdY = 30; thdX = 30; fthX = 60;
                rotatePosition = 0
                break
        }
    }
    else if (rotatePosition === 2) {
        rotatePosition++
        switch (currentPiece) {
            case 1: fstY = -60; sndY = 30; sndX = -30; fthY = -30; fthX = 30;
                break
            case 2: fstX = -60; sndY = 30; sndX = -30; fthY = -30; fthX = 30;
                break
            case 3: fstY = -30; fstX = -30; sndY = 30; sndX = -30; fthY = -30; fthX = 30;
                break
        }
    }
    else if (rotatePosition === 3) {
        switch (currentPiece) {
            case 1: fstY = 30; fstX = 60; sndX = -30; thdY = 30; fthY = 60; fthX = 30;
                break
            case 2: fstY = -30; sndX = -30; thdY = 30; fthY = 60; fthX = 30;
                break
            case 3: fstX = 30; sndX = -30; thdY = 30; fthY = 60; fthX = 30;
                break
        }
        rotatePosition = 0
    }
    player.map((playerCell, i) => {
        switch (i) {
            case 0:
                playerCell.position.y += fstY
                playerCell.position.x += fstX
                break
            case 1:
                playerCell.position.y += sndY
                playerCell.position.x += sndX
                break
            case 2:
                playerCell.position.y += thdY
                playerCell.position.x += thdX
                break
            case 3:
                playerCell.position.y += fthY
                playerCell.position.x += fthX
                break
        }
    })

}

document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowRight') {
        keyPressed.r = true
        player.map((playerCell) => {
            playerCell.velocity.x = 10
        })
    }
    else if (key === 'ArrowLeft') {
        keyPressed.l = true
        player.map((playerCell) => {
            playerCell.velocity.x = -10
        })
    }
    if (key === 'z') {
        rotate()
    }
})
document.addEventListener('keyup', ({ key }) => {
    if (key === 'ArrowRight') {
        keyPressed.r = false
        if (!keyPressed.l) {
            player.map((playerCell) => {
                playerCell.velocity.x = 0
            })
        }
    }
    else if (key === 'ArrowLeft') {
        keyPressed.l = false
        if (!keyPressed.r) {
            player.map((playerCell) => {
                playerCell.velocity.x = 0
            })
        }
    }
})
