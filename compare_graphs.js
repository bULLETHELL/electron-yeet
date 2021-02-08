const Chart = require("chart.js")

var df1 = null
var df2 = null
var time1 = null
var time2 = null
var throttle1 = null
var throttle2 = null
var brake1 = null
var brake2 = null
var fuelInLitres1 = null
var fuelInLitres2 = null

ipcRenderer.on('open-files', (event, args) => {
    df1 = z.readCSV("./" + args[0])
    df2 = z.readCSV("./" + args[1])

    time1 = z.getCol('Time', df1)
    time2 = z.getCol('Time', df2)
    throttle1 = z.getCol('Throttle', df1)
    throttle2 = z.getCol('Throttle', df2)
    brake1 = z.getCol('Brake', df1)
    brake2 = z.getCol('Brake', df2)
    fuelInLitres1 = z.getCol('FuelLevel', df1)
    fuelInLitres2 = z.getCol('FuelLevel', df2)
})

ipcRenderer.on('draw-fuel', (event, args) => {
    drawGraphFromDataframe(args.canvasTitle, time1, fuelInLitres1, args.canvasName, df1, "1")
    drawGraphFromDataframe(args.canvasTitle, time2, fuelInLitres2, args.canvasName, df2, "2")
})

ipcRenderer.on('delete-fuel', (event, arg) => {
    deleteGraph(arg, "1")
    deleteGraph(arg, "2")
})

ipcRenderer.on('draw-throttle', (event, args) => {
    drawGraphFromDataframe(args.canvasTitle, time1, throttle1, args.canvasName, df1, "1")
    drawGraphFromDataframe(args.canvasTitle, time2, throttle2, args.canvasName, df2, "2")
})

ipcRenderer.on('delete-throttle', (event, arg) => {
    deleteGraph(arg, "1")
    deleteGraph(arg, "2")
})

ipcRenderer.on('draw-brake', (event, args) => {
    drawGraphFromDataframe(args.canvasTitle, time1, brake1, args.canvasName, df1, "1")
    drawGraphFromDataframe(args.canvasTitle, time2, brake2, args.canvasName, df2, "2")
})

ipcRenderer.on('delete-brake', (event, arg) => {
    deleteGraph(arg, "1")
    deleteGraph(arg, "2")
})

ipcRenderer.on('draw-steering', (event, args) => {
    drawGraphFromDataframe(args.canvasTitle, time1, steering1, args.canvasName, df1, "1")
    drawGraphFromDataframe(args.canvasTitle, time2, steering2, args.canvasName, df2, "2")
})

ipcRenderer.on('delete-steering', (event, arg) => {
    deleteGraph(arg, "1")
    deleteGraph(arg, "2")
})


function drawGraphFromDataframe(title, xAxis, yAxis, canvasName, dataframe, divId) {
    var ctx = document.createElement("canvas")
    ctx.setAttribute("id", canvasName + divId)
    ctx.setAttribute("height", "250")
    ctx.setAttribute("width", "1920")
    document.getElementById(divId).appendChild(ctx)
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
                text: title + divId
            },
        },
    })
}

function deleteGraph(canvasName, divId) {
    document.getElementById(canvasName + divId).remove()
}