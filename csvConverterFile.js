const z = require("zebras")

const dataframe = z.readCSV("./P217SebringGP2.csv")

time = z.getCol('Time', dataframe)
throttle = z.getCol('Throttle', dataframe)
brake = z.getCol('Brake', dataframe)
fuelInLitres = z.getCol('FuelLevel', dataframe)
steeringInputInRadians = z.getCol('SteeringWheelAngle', dataframe)
