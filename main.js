const { app, Menu, BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                {
                    label: 'Open File',
                    click: async(menuItem, browserWindow, event) => {
                        dialog.showOpenDialog({
                            properties: ['openFile', 'multiSelections'],
                            filters: [
                                { name: 'CSV Files', extensions: ['csv'] }
                            ]
                        }).then(result => {
                            if (result.filePaths.length == 1) {
                                win.loadURL(`file://${__dirname}/index.html`).then(() => {
                                    win.webContents.send('open-file', result.filePaths[0])
                                })
                            } else if (result.filePaths.length == 2) {
                                win.loadURL(`file://${__dirname}/compare_view.html`).then(() => {
                                    win.webContents.send('open-files', [result.filePaths[0], result.filePaths[1]])
                                })
                            } else {
                                alert("Something went wrong, please select 1 or 2 files")
                            }

                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [{
                    label: 'Compare laps',
                    click: async(menuItem, browserWindow, event) => {
                        win.loadURL(`file://${__dirname}/compare_view.html`)
                    }
                },
                {
                    label: 'Analyze single lap',
                    click: async(menuItem, browserWindow, event) => {
                        win.loadURL(`file://${__dirname}/index.html`)
                    }
                },
                {
                    label: 'Analyze a stint',
                    click: async(menuItem, browserWindow, event) => {
                        win.loadURL(`file://${__dirname}/stint_view.html`)
                    }
                },
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            submenu: [{
                label: 'Learn More',
                click: async() => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }]
        },
        {
            label: 'Graphs',
            submenu: [{
                    label: 'Fuel',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'fuelCanvas'
                        let canvasTitle = 'Fuel'
                        if (menuItem.checked) {
                            win.webContents.send('draw-fuel', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-fuel', canvasName)
                        }
                    }
                },
                {
                    label: 'Throttle',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'throttleCanvas'
                        let canvasTitle = 'Throttle'
                        if (menuItem.checked) {
                            win.webContents.send('draw-throttle', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-throttle', canvasName)
                        }
                    }
                },
                {
                    label: 'Brake',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'brakeCanvas'
                        let canvasTitle = 'Brake'
                        if (menuItem.checked) {
                            win.webContents.send('draw-brake', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-brake', canvasName)
                        }
                    }
                },
                {
                    label: 'Steering Input',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'steeringInputCanvas'
                        let canvasTitle = 'Steering Input'
                        if (menuItem.checked) {
                            win.webContents.send('draw-steering', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-steering', canvasName)
                        }
                    }
                },
                {
                    label: 'Speed',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'SpeedCanvas'
                        let canvasTitle = 'Speed'
                        if (menuItem.checked) {
                            win.webContents.send('draw-speed', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-speed', canvasName)
                        }
                    }
                },
                {
                    label: 'RPM',
                    type: 'checkbox',
                    click: async(menuItem, browserWindow, event) => {
                        let canvasName = 'rpmCanvas'
                        let canvasTitle = 'RPM'
                        if (menuItem.checked) {
                            win.webContents.send('draw-rpm', {
                                canvasName,
                                canvasTitle
                            })
                        } else {
                            win.webContents.send('delete-rpm', canvasName)
                        }
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})