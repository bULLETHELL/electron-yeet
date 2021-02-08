const z = require("zebras")
const csv = require('csv-parser');
const fs = require('fs');
const fastcsv = require('fast-csv');
const { count } = require("console");
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}
function zebrasFunction(filename, fileInfo){
    const df = z.readCSV(filename)
    console.log('File loaded into zebras dataframe')
    console.log('Extracting relevant columns')
    const rowsToExtract = ['Speed', 'RPM', 'Throttle', 'Brake', 'SteeringWheelAngle', 'Lap', 'FuelLevel']
    let outputDf = z.pickCols(rowsToExtract, df)
    let timeArray = []
    let seriesToCount = z.getCol('Speed', df)
    let length = seriesToCount.length
    console.log('Calculating time column')
    for (i=1; i<= length; i++){
        timeArray.push(i*0.01666666666)
    }
    outputDf = z.addCol('Time', timeArray, outputDf)
    console.log('Exporting csv')
    z.toCSV("ADD PATH HERE", outputDf)// MORTEN TILFØJ DIN LORTEPATH DER
    console.log('Done!')
}
function formattingFunction(inputFile){
    var rows = []
    var counter = 1
    var driverName, car, track, date, time, sessionType

    const rowsToIgnore = [1,2,3,4,5,6,7,8,9,11,12]
    fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
        counter++
        if (counter == 2){
            let nameString
            let tempString2 = objToString(row)
            tempString2 = tempString2.split('::')
            nameString = tempString2[1].split('\n')
            driverName = nameString[1]
            car = tempString2[2].split('\n')
            car = car[0]
            console.log(driverName, car)
        }
        if (counter == 3){
            let tempString3 = objToString(row)
            tempString3 = tempString3.split('::')
            tempString3 = tempString3[2].split('\n')
            track = tempString3[0]
            console.log(track)
        }
        if (counter == 4){
            let tempString4 = objToString(row)
            tempString4 = tempString4.split('::')
            tempString4 = tempString4[2].split('\n')
            sessionType = tempString4[0]
            console.log(sessionType)
        }
        if (counter == 5){
            let tempString5 = objToString(row)
            tempString5 = tempString5.split('::')
            tempString5 = tempString5[2].split('\n')
            date = tempString5[0]
            console.log(date)
        }
        if (counter == 6){
            let tempString6 = objToString(row)
            tempString6 = tempString6.split('::')
            tempString6 = tempString6[2].split('\n')
            time = tempString6[0]
            console.log(time)
        }
        if (!rowsToIgnore.includes(counter)){
            rows.push(row)
        }
    })
    .on('end', () => {
        fastcsv.writeToPath('./out.csv', rows).on('finish', () => {
            console.log('CSV file successfully processed')
            console.log('Waiting for zebras function')
            zebrasFunction('out.csv', [driverName, car, track, date, time, sessionType])
        })
    })
}
formattingFunction('testcsv.csv')