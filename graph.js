const z = require("zebras")
const vegalite = require("vega-lite")
const vegaEmbed = require("vega-embed")
const Chart = require("chart.js")
const { ipcRenderer } = require("electron")


ipcRenderer.on('print-file', (event, data) => {
    console.log(data)
    let dataframe = z.readCSV(filepath)
    let dataParsed = z.parseNums(['Time', 'Throttle'])

    time = z.getCol('Time', dataframe)
    throttle = z.getCol('Throttle', dataframe)
    brake = z.getCol('Brake', dataframe)
    fuelInLitres = z.getCol('Fuel Level', dataframe)

    function drawGraph(title, xAxis, yAxis, canvasName) {
        var ctx = document.getElementById(canvasName)
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
    drawGraph("Throttle", time, throttle, "throttleCanvas")
    drawGraph("Brake", time, brake, "brakeCanvas")
    drawGraph("Fuel", time, fuelInLitres, "fuelCanvas")
})