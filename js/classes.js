

class bgParticle
{  
    constructor(x,y)
    {
        this.x = x
        this.y = y
        this.radius = 3
        this.color = '#F1F5F9'
        this.alpha = 0.05
    }

    draw()
    {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update()
    {
        this.draw()
        let dist = Math.hypot(player.x-this.x,player.y-this.y)

        if (dist < 50)
        {
            this.alpha = 0
        }
        else if (dist < 80)
        {
            this.alpha = 0.3
        }
        else if(this.alpha > 0.05)
        {
            this.alpha -= 0.01
        }
        else if(this.alpha < 0.05)
        {
            this.alpha += 0.01
        }
        // this.alpha -= 0.01
    }
}



class Particle
{  
    constructor(x,y,color)
    {
        this.friction = 0.98
        this.x = x
        this.y = y
        this.radius = Math.random()*2
        this.color = color
        this.alpha = 1
        this.velocity = {x: (Math.random()-0.5) * 6,y: (Math.random()-0.5) * 6}
    }

    draw()
    {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update()
    {
        this.draw()
        this.velocity.x *= this.friction
        this.velocity.y *= this.friction
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}


class Enemy
{  
    constructor()
    {
        this.radius = Math.random()*30 + 10
        this.color = `hsl(${Math.random()*360},50%,50%)`
        if (Math.random() < 0.5)
        {
            this.type = 'normal'
            this.speed = 1 + Math.random()*3

            if (Math.random() < 0.5)
            {
                this.x = (Math.random() < 0.5) ? -this.radius : innerWidth+this.radius
                this.y = Math.random() * innerHeight
            }
            else
            {
                this.y = (Math.random() < 0.5) ? -this.radius : innerHeight+this.radius
                this.x = Math.random() * innerWidth
            }
        }
        else
        {
            this.type = 'spinning'
            this.speed = 1 + Math.random()*2
            this.dist = 20

            if (Math.random() < 0.5)
            {
                this.center = { x: (Math.random() < 0.5) ? -2*this.radius-this.dist : innerWidth+this.dist+2*this.radius , 
                y: Math.random() * innerHeight}
            }
            else
            {
                this.center = {y: (Math.random() < 0.5) ? -2*this.radius-this.dist : innerHeight+this.dist+2*this.radius,
                x: Math.random() * innerWidth}
            }
        }
        this.rAngle = 0
        this.updateVelocity()
    }

    draw()
    {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }

    updateVelocity()
    {
        let angle
        if (this.type === 'normal')
        {
            angle = Math.atan2((player.y)-(this.y),(player.x)-(this.x))
        }
        else if(this.type === 'spinning')
        {
            angle = Math.atan2((player.y)-(this.center.y),(player.x)-(this.center.x))
        }
        const multiplier = this.speed
        this.velocity = {x: Math.cos(angle) * multiplier,y: Math.sin(angle)*multiplier}
    }
    update()
    {

        if (this.type === 'normal')
        {
            this.updateVelocity()
            this.x += this.velocity.x
            this.y += this.velocity.y


        }
        else if (this.type === 'spinning')
        {
            this.updateVelocity()
            this.center.x += this.velocity.x
            this.center.y += this.velocity.y
            const angle = this.rAngle * Math.PI / 180
            const overallDist = this.dist + this.radius
            this.x = this.center.x + Math.cos(angle)* overallDist
            this.y = this.center.y + Math.sin(angle)* overallDist
            this.rAngle = this.rAngle+5

        }
    }
}

class Projectile
{  
    constructor(x,y)
    {
        this.x = player.x
        this.y = player.y
        this.radius = 8
        this.color = 'white'
        const angle = Math.atan2(y-this.y,x-this.x)
        this.velocity = {x: Math.cos(angle) * 10,y: Math.sin(angle) * 10}
    }

    draw()
    {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = (player.status == 'MachineGun') ? '#FDE047' : this.color
        c.fill()
    }

    update()
    {
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}


class Player
{  
    constructor(x,y,radius,color)
    {
        this.status = 'normal'
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = {x:0,y:0}
        this.friction = 0.99
    }

    draw()
    {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = (this.status == 'normal' ) ? this.color : '#CA8A04'
        c.fill()
    }

    update()
    {
        this.draw()
        this.velocity.x *= this.friction
        this.velocity.y *= this.friction
        
        if (this.x+this.radius+this.velocity.x > innerWidth || this.x-this.radius+this.velocity.x < 0)
        {
            this.velocity.x = -this.velocity.x/2
        }
        if (this.y+this.radius+this.velocity.y > innerHeight || this.y-this.radius+this.velocity.y < 0)
        {
            this.velocity.y = -this.velocity.y/2
        }

        this.x += this.velocity.x
        this.y += this.velocity.y

    }

}

class PowerUp
{
    constructor()
    {
        this.x = 20 + (innerWidth-40)*Math.random()
        this.y = 20 + (innerHeight-40)*Math.random()
        this.image = new Image()
        this.image.src = '../img/lightningBolt.png'

        this.alpha = 1
        gsap.to(this,{
            alpha: 0.2,
            duration: 0.5,
            yoyo:true,
            repeat: -1

        })
    }

    draw()
    {
        c.save()
        c.globalAlpha = this.alpha
        c.drawImage(this.image,this.x,this.y)
        c.restore()
    }

    update()
    {
        this.draw()
    }
}