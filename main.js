
let canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let ctx = canvas.getContext("2d")
ctx.lineWidth = 2

for(x1=100; x1<1000; x1+=100){
  for(y1=100; y1<500; y1+=100){
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1+1, y1+1)
    ctx.stroke()
  }
}

ctx.lineWidth = 1

let prevX = null
let prevY = null
let draw  = false

// new 
let   i = 0, j = 0, k = 0; 
const s = new Array(100);
for(l=1; k<100; k++){
  s[k] = null
}

// end new

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    let data = canvas.toDataURL("imag/png")
    let a = document.createElement("a")
    a.href = data
    a.download = "sketch.png"
    a.click()
})



window.addEventListener("mousedown", (e) => draw = true)
window.addEventListener("mouseup", (e) => draw = false)

window.addEventListener("mousemove", function(e){
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX
        prevY = e.clientY
        return
    }

    let mouseX = e.clientX
    let mouseY = e.clientY
    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(mouseX, mouseY)
    ctx.stroke()

    // ---------- start loop over sensors 
    
    for(i=1; i<=8; i=i+1){
      for(j=1; j<=4; j=j+1){
    
    // ---------- start calculate sensor response 
    
    x = e.clientX;
    y = e.clientY;
    dx = e.clientX - prevX;
    dy = e.clientY - prevY;

    var d = ((y-100*j)*(y-100*j) + (x-100.1*i)*(x-100*i))^(0.5);
    k = 4*j + i;
    s[k] = s[k] + (dx*(y-100*j) - dy*(x-100*i))/(d+0.01);
    
    var out = "s_val_" + i;
    if(k<=8){
      document.getElementById(out).value = Math.round(s[k]);
      if(k==1){
        document.getElementById("d").value = d
      }
    }
    // start sensor point response visualization  
    
    ctx.beginPath()
    ctx.moveTo(100*i, 100*j)
    ctx.lineTo(100*i+dx/10, 100*j+dy/10)
    if(s[k]>0){
      ctx.strokeStyle = "#000"
    }else{
      ctx.strokeStyle = "#fff"
    }
    ctx.stroke()
    
    // restore color 
    ctx.strokeStyle = "#000"
    // go back to where you started
    ctx.moveTo(mouseX, mouseY)
    
    // end point sensor response visualization  
    } // end for loop on j     
    } // end for loop on i 
    
    // ----------
    prevX = e.clientX
    prevY = e.clientY
})

