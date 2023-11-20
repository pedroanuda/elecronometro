const { app, ipcMain, BrowserWindow, Tray, nativeImage, Menu, Notification } = require("electron");
const path = require("node:path");

let tray;
let janela;
let janelaSobre;
let paused;

const janelaMenu = Menu.buildFromTemplate([
    {label: "Sobre", click() {janelaSobre.show()}},
    {label: "Sair", role: "quit"}
])

let trayMenuTemplate = [
    {label: "Iniciar/Retomar", click() {playAction("play")}},
    {label: "Pausar", visible: false, click()  {playAction("pause")}},
    {label: "Parar", enabled: false, click: stopAction},
    {type: "separator"},
    {label: "Sair", role: "quit"}
]

let thumbarButtons = [
    {
        tooltip: "Iniciar/Retomar",
        icon: nativeImage.createFromPath(path.join(__dirname, "app/img/play.png")),
        click() {playAction("play")}
    },
    {
        tooltip: "Pausar",
        icon: nativeImage.createFromPath(path.join(__dirname, "app/img/pause.png")),
        click() {playAction("pause")},
        flags: ["hidden"]
    },
    {
        tooltip: "Parar",
        icon: nativeImage.createFromPath(path.join(__dirname, "app/img/stop.png")),
        click: stopAction,
        flags: ["disabled"]
    }
]

function criarJanela() {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, "app/img/elecronometro_icon.png")));
    tray.setTitle("Elecronômetro");
    tray.setToolTip("Elecronômetro");
    tray.setContextMenu(Menu.buildFromTemplate(trayMenuTemplate));

    janela = new BrowserWindow({
        width: 500,
        height: 300,
        minWidth: 420,
        minHeight: 220,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "#FFFFFF",
            height: 35
        },
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    })

    janelaSobre = new BrowserWindow({
        parent: janela,
        show: false,
        frame: false,
        resizable: false,
        fullscreenable: false,
        width: 320,
        height: 420,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    janela.loadFile("app/index.html");
    janela.setThumbarButtons(thumbarButtons);
    janelaSobre.loadFile("app/sobre.html");
}

ipcMain.handle("signals", (event, signals) => {
    paused = signals.paused;

    if (!signals.started) {
        thumbarButtons[0].flags = null;
        thumbarButtons[1].flags = ["hidden"];
        thumbarButtons[2].flags = ["disabled"];

        trayMenuTemplate[0].visible = true;
        trayMenuTemplate[1].visible = false;
        trayMenuTemplate[2].enabled = false;
    } else {
        thumbarButtons[2].flags = null;
        trayMenuTemplate[2].enabled = true;

        thumbarButtons[0].flags = signals.paused ? null : ["hidden"];
        thumbarButtons[1].flags = signals.paused ? ["hidden"] : null;

        trayMenuTemplate[0].visible = signals.paused;
        trayMenuTemplate[1].visible = !signals.paused;
    }

    tray.setContextMenu(Menu.buildFromTemplate(trayMenuTemplate));
    janela.setThumbarButtons(thumbarButtons);
})

ipcMain.handle("context-menu", (event, x, y) => {janelaMenu.popup({x, y})});
ipcMain.handle("close-about-window", (event) => janelaSobre.hide());

app.whenReady().then(() => {
    criarJanela();
})

/**
 * Ação de iniciar/pausar com direito a notificações.
 * @param {'play' | 'pause'} mode Indica se a ação está sendo usada como forma de iniciar/retomar ou pausar.
 */
function playAction(mode) {
    janela.webContents.send("playOrPause");
    if (!janela.isMinimized()) return;

    if (mode == "pause") new Notification({title: "Pausado", body: "Cronômetro pausado."}).show()
    else new Notification({
        title: paused ? "Retomado" : "Iniciado",
        body: paused ? "Cronômetro retomado." : "Cronômetro iniciado."
    }).show()
}


/** Ação de parar com direito a notificações. */
function stopAction() {
    janela.webContents.send("stop");
    if (!janela.isMinimized()) return;

    new Notification({title: "Parado", body: "Cronômetro finalizado."}).show();
}
