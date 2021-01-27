const z = require("zebras")
const vegalite = require("vega-lite")
const vegaEmbed = require("vega-embed")
const Chart = require("chart.js")
const { ipcRenderer } = require("electron")



let dataframe = z.readCSV("./P217SebringGP2.csv")
let dataParsed = z.parseNums(['Time', 'Throttle'])

time = z.getCol('Time', dataframe)
throttle = z.getCol('Throttle', dataframe)
brake = z.getCol('Brake', dataframe)
fuelInLitres = z.getCol('Fuel Level', dataframe)

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
document.getElementById("lapFuelText").innerHTML = `Fuel used this lap: ${fuelInLitres[0] - fuelInLitres[fuelInLitres.length-1]}`

ipcRenderer.on('draw-fuel', (event, arg) => {
    drawGraph(arg.canvasTitle, time, fuelInLitres, arg.canvasName)
})

ipcRenderer.on('draw-throttle', (event, arg) => {
    drawGraph(arg.canvasTitle, time, throttle, arg.canvasName)
})

ipcRenderer.on('draw-brake', (event, arg) => {
    drawGraph(arg.canvasTitle, time, brake, arg.canvasName)
})

//drawGraph("Throttle", time, throttle, "throttleCanvas")
//drawGraph("Brake", time, brake, "brakeCanvas")
//drawGraph("Fuel", time, fuelInLitres, "fuelCanvas")