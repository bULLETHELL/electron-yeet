const z = require("zebras")
const vegalite = require("vega-lite")
const vegaEmbed = require("vega-embed")
const Chart = require("chart.js")
const dataframe = z.readCSV("./P217SebringGP2.csv")
const dataParsed = z.parseNums(['Time', 'Throttle'])
//const time = z.getCol('"Time', parsedData)
//console.log(z.head(5, parsedData))
//console.log(z.getCol('""Throttle""', dataframe))
/*
let graph= {
    data: {values: dataParsed},
    width: 700,
    height: 350,
    mark: {type: 'line', strokeWidth: .8},
    encoding: {
      x: {field: "Time", type: "temporal"},
      y: {field: "Throttle", type: "quantitative", scale: {type:'log'}}
    }
  }

vegaEmbed("#graph", graph)
*/
time = z.getCol('Time', dataframe)
throttle = z.getCol('Throttle', dataframe)
console.log(time)
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: time,
    datasets: [
      { 
        data: throttle
      }
    ]
  },
  options: {
      
  }
});