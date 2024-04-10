const audio = {
    shoot : new Howl({
        src: '../audio/shoot.wav',
        volume: 0.04
    }),
    death : new Howl({
        src: '../audio/Death.wav',
        volume: 0.1
    }),
    select : new Howl({
        src: '../audio/Select.wav',
        volume: 0.1,
        html5: true
    }),
    powerUp: new Howl({
        src: '../audio/powerup.wav',
        volume: 0.1
    }),
    bgMusic: new Howl({
        src: '../audio/hyper.wav',
        volume: 0.1,
        loop: true
    }),
    blow: new Howl({
        src: '../audio/blow.wav',
        volume: 0.1
    }),
}