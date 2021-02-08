const z = require("zebras")


df = z.readCSV('outputnigger.csv')
lapSeries = z.getCol('Lap', df)
lapToPick = z.median(lapSeries)
filteredDf = z.filter(r => r.Lap == lapToPick, df)
console.log(z.printTail(10, filteredDf))