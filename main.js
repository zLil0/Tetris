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

const player = []

const mapColliding = ({ playerCell }) => {
    return (playerCell.position.x + playerCell.velocity.x < 20 || playerCell.position.x + playerCell.velocity.x + 30 > 320)

}

shapes[1].map((lin, i) => {
    lin.map((col, j) => {
        if (col === '-') {
            player.push(new TetrisBlock({
                color: 'yellow',
                position: {
                    x: 20 + j * 30,
                    y: 20 + i * 30
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

const animate = () => {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground()
    player.map((playerCell) => {
        playerCell.draw()
    })


    if (((player[0].position.x + player[0].velocity.x + 30 <= 320) &&
        (player[1].position.x + player[1].velocity.x + 30 <= 320) &&
        (player[2].position.x + player[2].velocity.x + 30 <= 320) &&
        (player[3].position.x + player[3].velocity.x + 30 <= 320)) &&
        ((player[0].position.x + player[0].velocity.x >= 20) &&
            (player[1].position.x + player[1].velocity.x >= 20) &&
            (player[2].position.x + player[2].velocity.x >= 20) &&
            (player[3].position.x + player[3].velocity.x >= 20))) {
        player.map((playerCell) => {
            playerCell.moove()
        })
    }

    if ((player[0].position.y + 30 < 620) &&
    (player[1].position.y + 30 < 620)&&
    (player[2].position.y + 30 < 620) &&
    (player[3].position.y + 30 < 620)) {
        player.map((playerCell) => {
            playerCell.fall()
        })
    }
    


}
animate()

let keyPressed = {
    r: false,
    l: false
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
