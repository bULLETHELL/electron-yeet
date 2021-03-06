const Chart = require("chart.js")

var dataframe = null
var time = null
var throttle = null
var brake = null
var fuelInLitres = null
var lapSeries = null
var lapToPick = null
var filteredDf = null
var speed = null
var rpm = null
var steering = null

ipcRenderer.on('open-file', (event, arg) => {
    document.getElementById("loadedFile").innerHTML = "Loaded File: " + arg
    dataframe = z.readCSV(arg)
    lapSeries = z.getCol('Lap', dataframe)
    lapToPick = z.median(lapSeries)
    filteredDf = z.filter(r => r.Lap == lapToPick, dataframe)
    time = z.getCol('Time', filteredDf)
    throttle = z.getCol('Throttle', filteredDf)
    brake = z.getCol('Brake', filteredDf)
    fuelInLitres = z.getCol('FuelLevel', filteredDf)
    speed = z.getCol('Speed', filteredDf)
    rpm = z.getCol('RPM', filteredDf)
    steering = z.getCol('SteeringWheelAngle', filteredDf)
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

ipcRenderer.on('draw-speed', (event, arg) => {
    drawGraph(arg.canvasTitle, time, speed, arg.canvasName)
})

ipcRenderer.on('draw-rpm', (event, arg) => {
    drawGraph(arg.canvasTitle, time, rpm, arg.canvasName)
})

ipcRenderer.on('draw-steering', (event, arg) => {
    drawGraph(arg.canvasTitle, time, steering, arg.canvasName)
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

ipcRenderer.on('delete-speed', (event, arg) => {
    document.getElementById(arg).remove()
})

ipcRenderer.on('delete-rpm', (event, arg) => {
    document.getElementById(arg).remove()
})

ipcRenderer.on('delete-steering', (event, arg) => {
    document.getElementById(arg).remove()
})