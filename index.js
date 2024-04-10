
const canvas = document.querySelector('canvas')
const menuRestart = document.querySelector('#menuRestart')
const menuStart = document.querySelector('#menuStart')
const restartGameButton = document.querySelector('#restartGame')
const startGameButton = document.querySelector('#startGame')
const menuScore = document.querySelector('#menuScore')
const soundOn = document.querySelector('#soundOn')
const soundOff = document.querySelector('#soundOff')

canvas.height = window.innerHeight
canvas.width = innerWidth

const c = canvas.getContext('2d')



let enemies = []
let projectiles = []
let particles = []
let powerUps = []
let bgParticles = []

const player = new Player(innerWidth/2, innerHeight/2 ,10,'white')
let animateID
let enemyIntervalID
let powerUpIntervalID
let score = 0
let mouseX 
let mouseY
let frame = 0
let gameActive = false

function createEnemies()
{
    enemyIntervalID = setInterval(() => {
        const newEnemy = new Enemy()
        enemies.push(newEnemy)
    },2000)
}

function createPowerUps()
{
    powerUpIntervalID = setInterval(() => {
        const powerUp = new PowerUp()
        powerUps.push(powerUp)
    },15000)
}

function createProjectile(event)
{
    const _p = new Projectile(event.clientX,event.clientY)
    projectiles.push(_p)

    audio.shoot.play()
}

function animate()
{
    animateID = requestAnimationFrame(animate)
    frame++

    c.fillStyle = 'rgba(0,0,0,0.3)'
    c.rect(0,0,innerWidth,innerHeight)
    c.fill()


    for (let i=0 ; bgParticles.length>i ; i++)
    {
        const bgP = bgParticles[i]
        bgP.update()
    }

    player.update()


    // power ups
    for (let i=powerUps.length-1 ; i>=0 ; i--)
    {
        const powerUp = powerUps[i]

        const dist = Math.hypot(player.x-powerUp.x,player.y-powerUp.y)
        if (dist < powerUp.image.height/2 + player.radius + 4)
        {
            player.status = 'MachineGun'
            setTimeout(() => {
                player.status = 'normal'
            },6000)

            powerUps.splice(i,1)

            audio.powerUp.play()
            continue
        }
        powerUp.update()

    }

    for (let i=projectiles.length-1; i>=0 ; i--)
    {
        const projectile = projectiles[i]
        let isRemoved = false
        for (let j=enemies.length-1 ; j>=0 ; j--)
        {
            const enemy = enemies[j]
            // collision
            if (Math.sqrt(((enemy.x-projectile.x) ** 2) + ((enemy.y-projectile.y) ** 2)) < enemy.radius+projectile.radius)
            {
                for (let i=0; enemy.radius*2>i ; i++) // creating particles
                {
                    particles.push(new Particle(projectile.x,projectile.y,enemy.color))
                }

                if (enemy.radius > 25)
                {
                    gsap.to(enemy,{
                        radius: enemy.radius-10
                    })
                    // enemy.radius -= 10
                    score += 10
                }
                else
                {
                    score += 30
                    enemies.splice(j,1)
                }

                projectiles.splice(i,1)
                isRemoved = true

                audio.blow.play()


                break
            }
        }
        if (!isRemoved)
        {
            projectile.draw()
            projectile.update()
        }
    }

    for (let i=enemies.length-1; i>=0 ; i--)
    {
        const enemy = enemies[i]
        const radius = enemy.radius
        if (enemy.type === 'normal' && (enemy.x-radius > window.innerWidth || enemy.x+radius < 0 || enemy.y+radius < 0 || enemy.y-radius > innerHeight))
        {
            enemies.splice(i,1)
        }
        else if(enemy.type === 'spinning' && (enemy.center.x > window.innerWidth+enemy.dist+2*enemy.radius  || -2*enemy.radius-enemy.dist > enemy.center.x ||  innerHeight + enemy.radius*2 + enemy.dist < enemy.center.y || enemy.center.y < -2*enemy.radius-enemy.dist))
        {
            enemies.splice(i,1)
        }
        // player collision dedection with enemy or other
        else if (Math.sqrt(((enemy.x-player.x) ** 2) + ((enemy.y-player.y) ** 2)) < enemy.radius+player.radius + 1)
        {
            endGame()
        }

        enemy.draw()
        enemy.update()
    }

    for (let i=particles.length-1 ; i>=0 ; i--)
    {
        const particle = particles[i]

        if (particle.alpha < 0.05)
        {
            particles.splice(i,1)
            continue
        }

        particle.update()
    }

    if (player.status == 'MachineGun' && frame%5 == 0)
    {
        createProjectile({clientX: mouseX, clientY : mouseY})
    }
    // console.log(animateID)

}

function createBgParticles()
{
    for (let r=0; window.innerHeight+30>r ; r+= 30)
    {
        for (let c = 0; window.innerWidth+30>c ; c+= 30)
        {
            bgParticles.push(new bgParticle(c,r))
        }
    }
}

function init()
{
    enemies = []
    projectiles = []
    particles = []
    bgParticles = []
    powerUps = []
    score = 0
    player.status = 'normal'
    createBgParticles()
    animateID = requestAnimationFrame(animate)
    createEnemies()
    createPowerUps()

    audio.select.play()

    gameActive = true
}

function endGame()
{
    cancelAnimationFrame(animateID)
    clearInterval(enemyIntervalID)
    clearInterval(powerUpIntervalID)
    menuScore.innerHTML = score
    menuRestart.style.display = 'flex'
    gsap.fromTo('#menuRestart',{
        opacity: 0,
        scale: 0.8
    },{
        opacity: 1,
        scale: 1,
        ease: 'expo.out',
        duration: 1
    })

    gameActive = false
    audio.death.play()
}

document.addEventListener('click',(event) => {
    if (!audio.bgMusic.playing())
    {
        audio.bgMusic.play()
    }
    if (gameActive) 
        createProjectile(event)
})


restartGameButton.addEventListener('click',() => {
    init()
    gsap.to('#menuRestart',{
        opacity:0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: () => {
            menuRestart.style.display = 'none'
        }
    })
})

window.addEventListener('keydown',(event) => {
    if (event.key == 'w' || event.key == 'W' || event.key == 'ArrowUp')
    {  
        // gsap.to(player.velocity,{
        //     y : player.velocity.y-3
        // })
        player.velocity.y -= 3
    }
    else if(event.key == 's' || event.key == 'S' || event.key == 'ArrowDown')
    {
        // gsap.to(player.velocity,{
        //     y : player.velocity.y+3
        // })
        player.velocity.y += 3
    }
    else if(event.key == 'd' || event.key == 'D' || event.key == 'ArrowRight')
    {
        // gsap.to(player.velocity,{
        //     x : player.velocity.x+3
        // })
        player.velocity.x += 3
    }
    else if(event.key == 'a' || event.key == 'A' || event.key == 'ArrowLeft')
    {
        // gsap.to(player.velocity,{
        //     x : player.velocity.x-3
        // })
        player.velocity.x -= 3
    }
})


startGameButton.addEventListener('click',() => {
    init()
    gsap.to('#menuStart',{
        opacity:0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.in',
        onComplete: () => {
            menuStart.style.display = 'none'
        }
    })
})

window.addEventListener('mousemove',(event) => {
    mouseX = event.clientX
    mouseY = event.clientY
})

// muting
soundOn.addEventListener('click',() => {
    soundOn.style.display = 'none'
    soundOff.style.display = 'block'

    for (let key in audio)
    {
        audio[key].mute(true)
    }
})

//unmuting
soundOff.addEventListener('click',() => {
    soundOff.style.display = 'none'
    soundOn.style.display = 'block'

    for (let key in audio)
    {
        audio[key].mute(false)
    }
})

window.addEventListener("resize",() => {
    enemies = []
    projectiles = []
    particles = []
    powerUps = []
    bgParticles = []
    createBgParticles()
    player.x = window.innerWidth/2
    player.y = window.innerHeight/2
    canvas.width = innerWidth
    canvas.height = innerHeight

})

document.addEventListener('visibilitychange',() => {
    if (document.hidden)
    {
        clearInterval(enemyIntervalID)
        clearInterval(powerUpIntervalID)
    }
    else
    {
        createEnemies()
        createPowerUps()
    }
})