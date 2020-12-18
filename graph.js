const z = require("zebras")
const vegalite = require("vega-lite")
const vegaEmbed = require("vega-embed")
const Chart = require("chart.js")


const dataframe = z.readCSV("./P217SebringGP2.csv")
const dataParsed = z.parseNums(['Time', 'Throttle'])

time = z.getCol('Time', dataframe)
throttle = z.getCol('Throttle', dataframe)
brake = z.getCol('Brake', dataframe)
fuelInLitres = z.getCol('Fuel Level', dataframe)

function drawGraph(title, xAxis, yAxis, canvasName){
    var ctx = document.getElementById(canvasName)
    var myChart =new Chart(ctx, {
        type: 'line',
        data: {
          labels: xAxis,
          datasets: [
            { 
              data: yAxis,
              pointRadius: 0,
              label: "input",
            }
          ]
        },
        options: {
            title: {
                display: true,
                text: title
            },
        },
      })
}
drawGraph("Throttle", time, throttle, "throttleCanvas")
drawGraph("Brake", time, brake, "brakeCanvas")
drawGraph("Fuel", time, fuelInLitres, "fuelCanvas")