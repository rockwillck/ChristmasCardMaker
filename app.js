function bindFlower(canvas) {
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext("2d")

    const vector = [0, Math.random()*0.3+0.15, Math.random()+1]

    const focalLength = 10
    const scale = 1000
    function ttt(pt) {
        return [pt[0]*scale*1/(focalLength+pt[1])+canvas.width/2,-pt[2]*scale*1/(focalLength+pt[1])+canvas.height/2]
    }
    function normalize(vect, scale=1) {
        let dist = Math.sqrt(vect[0]**2 + vect[1]**2 + vect[2]**2)
        return [
            vect[0]/dist*scale, vect[1]/dist*scale, vect[2]/dist*scale,
        ]
    }

    var faces = [
        [
            [0,0,0],
            [normalize(vector)[0]*-3, normalize(vector)[1]*-3, normalize(vector)[2]*-3]
        ],
        [
            [0,0,0],
            [normalize(vector)[0]*-3, normalize(vector)[1]*-3, normalize(vector)[2]*-3]
        ],
        [
            [0,0,0],
            [normalize(vector)[0]*-3, normalize(vector)[1]*-3, normalize(vector)[2]*-3]
        ],
        [
            [0,0,0],
            [normalize(vector)[0]*-3, normalize(vector)[1]*-3, normalize(vector)[2]*-3]
        ]
    ]
    // generate leaves
    for (let level = 0.7; level >= 0.3; level -= Math.random()*0.1+0.05) {
        for (let theta = 0; theta < 2*Math.PI; theta += Math.random()*Math.PI/3+Math.PI/6) {
            let ortho = normalize([Math.cos(theta), Math.sin(theta), -(Math.cos(theta)*vector[0]+Math.sin(theta)*vector[1])/vector[2]])
            let diff = [ortho[0] - vector[0], ortho[1] - vector[1], ortho[2] - vector[2]]
                let interp = [
                    vector[0] + level*diff[0],
                    vector[1] + level*diff[1],
                    vector[2] + level*diff[2],
                ]

                let cross = [
                    vector[1]*interp[2] - vector[2]*interp[1],
                    vector[2]*interp[0] - vector[0]*interp[2],
                    vector[0]*interp[1] - vector[1]*interp[0]
                ]
                cross = normalize(cross, 0.7)

                let left = [interp[0] + cross[0], interp[1] + cross[1], interp[2] + cross[2]]
                let right = [interp[0] - cross[0], interp[1] - cross[1], interp[2] - cross[2]]

                faces.push([
                    [0,0,0],
                    normalize(left, level*2),
                    normalize(interp, level*2),
                    normalize(right, level*2)
                ])
        }
    }
    var cutoff = 0
    ctx.fillStyle = `rgba(${Math.random()*100+155}, ${Math.random()*100}, ${Math.random()*100}, 0.1)`
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = "rgba(0,0,0, 0.1)"
        let i = 0;
        for (let f of faces) {
            for (let j = 0; j < f.length; j++) {
                i++
                if (i <= cutoff) {
                    let start = f[j]
                    let end = f[(j+1)%f.length]
                    start = ttt(start)
                    end = ttt(end)
                    ctx.beginPath()
                    ctx.moveTo(start[0], start[1])
                    ctx.lineTo(end[0],end[1])
                    ctx.closePath()
                    ctx.stroke()
                }
                if (i <= cutoff && j == f.length - 1) {
                    ctx.beginPath()
                    ctx.moveTo(ttt(f[0])[0],ttt(f[0])[1])
                    for (let pt of f) {
                        let proj = ttt(pt)
                        ctx.lineTo(proj[0], proj[1])
                    }
                    ctx.closePath()
                    ctx.fill()
                }
            }
        }
        cutoff++
    }

    setInterval(render, 100)
}
bindFlower(document.getElementById("canvas1"))
bindFlower(document.getElementById("canvas2"))
bindFlower(document.getElementById("canvas3"))

function changeSRC(img) {
    newsrc = prompt("Please enter a image link:")
    img.src = newsrc
    updateAddress()
}
function updateAddress() {
    srcs = [...document.getElementsByClassName("ornament")].map(x => x.src)
    text1 = document.getElementById("hh").innerText
    text2 = document.getElementById("pp").innerText
    text3 = document.getElementById("ppp").innerText

    const params = new URLSearchParams();

    for (s of srcs) {
        params.append("imageurl", s);
    }
    params.append("t1", text1)
    params.append("t2", text2)
    params.append("t3", text3)
    history.replaceState({} , 'Christmas Card', window.location.pathname + "?" + params.toString());
}

onload = () => {
    let url = new URL(window.location.href)
    let srcs = new URLSearchParams(url.search).getAll("imageurl")
    for (let i = 0; i < Math.min(5, srcs.length); i++) {
        document.getElementsByClassName("ornament")[i].src= srcs[i]
    }
    let t1 = new URLSearchParams(url.search).getAll("t1")
    let t2 = new URLSearchParams(url.search).getAll("t2")
    let t3 = new URLSearchParams(url.search).getAll("t3")
    if (t1.length != 0) {
        document.getElementById("hh").innerText = t1
    }
    if (t2.length != 0) {
        document.getElementById("pp").innerText = t2
    }
    if (t3.length != 0) {
        document.getElementById("ppp").innerText = t3
    }
}