const z = require("zebras")
const Chart = require("chart.js")
const { ipcRenderer } = require("electron")


var dataframe = null
var time = null
var throttle = null
var brake = null
var fuelInLitres = null

ipcRenderer.on('open-file', (event, arg) => {
    document.getElementById("loadedFile").innerHTML = "Loaded File: " + arg
    dataframe = z.readCSV(arg)
    time = z.getCol('Time', dataframe)
    throttle = z.getCol('Throttle', dataframe)
    brake = z.getCol('Brake', dataframe)
    fuelInLitres = z.getCol('Fuel Level', dataframe)
})

function drawGraph(title, xAxis, yAxis, canvasName) {
    var ctx = document.createElement("canvas")
    ctx.setAttribute("id", canvasName)
    ctx.setAttribute("height", "250")
    ctx.setAttribute("width", "1920")
    document.getElementById("canvasses").appendChild(ctx)
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                data: yAxis,
                pointRadius: 0,
                label: "input",
            }]
        },
        options: {
            title: {
                display: true,
                text: title
            },
        },
    })
}

ipcRenderer.on('draw-fuel', (event, arg) => {
    drawGraph(arg.canvasTitle, time, fuelInLitres, arg.canvasName)
})

ipcRenderer.on('draw-throttle', (event, arg) => {
    drawGraph(arg.canvasTitle, time, throttle, arg.canvasName)
})

ipcRenderer.on('draw-brake', (event, arg) => {
    drawGraph(arg.canvasTitle, time, brake, arg.canvasName)
})

ipcRenderer.on('delete-fuel', (event, arg) => {
    document.getElementById(arg).remove()
})

ipcRenderer.on('delete-throttle', (event, arg) => {
    document.getElementById(arg).remove()
})

ipcRenderer.on('delete-brake', (event, arg) => {
    document.getElementById(arg).remove()
})

//drawGraph("Throttle", time, throttle, "throttleCanvas")
//drawGraph("Brake", time, brake, "brakeCanvas")
//drawGraph("Fuel", time, fuelInLitres, "fuelCanvas")