const z = require('zebras')

const df = z.readCSV('P217SebringGP2.csv')
const rowsToExtract = ['Speed', 'RPM', 'Throttle', 'Brake', 'SteeringWheelAngle', 'Lap', 'FuelLevel']
let outputDf = z.pickCols(rowsToExtract, df)
let timeArray = []
let seriesToCount = z.getCol('Speed', df)
let length = seriesToCount.length
for (i=1; i<= length; i++){
    timeArray.push(i*0.01666666666)
}
outputDf = z.addCol('Time', timeArray, outputDf)
console.log(timeArray.length, seriesToCount.length)
console.log(z.printHead(1, outputDf))
z.toCSV('./outputCsv.csv', outputDf)