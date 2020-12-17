pd = require("node-pandas")
df = pd.readCsv("C:\\Users\\FunkyXive\\github\\electron-yeet\\testCsvFiles\\P217SebringGP.csv")
let time = df['"Time']
let distance = df['""Distance""']
let throttlePos = df['""Throttle""']
let brakePos = df['""Brake""']
let fuelInLiters = df['""Fuel Level""']
let fuelInPercent = df['""Fuel Remaining""']
let speedInMetersPerSec = df['""Ground Speed""']
console.log(df['""Ground Speed""']);
