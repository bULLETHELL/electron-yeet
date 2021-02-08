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
    lapSeries = z.getCol('Lap', dataframe)
    lapToPick = z.median(lapSeries)
    filteredDf = z.filter(r => r.Lap == lapToPick, dataframe)
    time = z.getCol('Time', filteredDf)
    throttle = z.getCol('Throttle', filteredDf)
    brake = z.getCol('Brake', filteredDf)
    fuelInLitres = z.getCol('Fuel Level', filteredDf)
    speed = z.getCol('Speed', filteredDf)
    rpm = z.getCol('RPM', filteredDf)

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

ipcRenderer.on('draw-speed', (even, arg)=> {
    drawGraph(arg.canvasTitle, time, speed, arg.canvasName)
})

ipcRenderer.on('draw-rpm', (even, arg)=> {
    drawGraph(arg.canvasTitle, time, rpm, arg.canvasName)
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

ipcRenderer.on('delete-speed', (even, arg)=> {
    drawGraph(arg.canvasTitle, time, speed, arg.canvasName)
})

ipcRenderer.on('delete-rpm', (even, arg)=> {
    drawGraph(arg.canvasTitle, time, rpm, arg.canvasName)
})
//drawGraph("Throttle", time, throttle, "throttleCanvas")
//drawGraph("Brake", time, brake, "brakeCanvas")
//drawGraph("Fuel", time, fuelInLitres, "fuelCanvas")