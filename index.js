const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store');
var querystring = require('querystring');

const schema = {
    window_width: {
        type: 'number',
        default: 800,
        minimum: 10
    },
    window_height: {
        type: 'number',
        default: 600,
        minimum: 10
    },
    window_pos_x: {
        type: 'number',
        default: 100,
        minimum: 0
    },
    window_pos_y: {
        type: 'number',
        default: 100,
        minimum: 0
    },
    binding_port: {
        type: 'number',
        default: 12768
    }
}

const store = new Store({schema});
var win;

const createWindow = () => {
    win = new BrowserWindow({
        width: store.get('window_width'),
        height: store.get('window_height'),
        x: store.get('window_pos_x'),
        y: store.get('window_pos_y'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    win.loadFile('src/index.html')

    win.on('move', function(){
        var position = win.getPosition();
        store.set('window_pos_x', position[0]);
        store.set('window_pos_y', position[1]);
    })

    win.on('resize', function(){
        var size = win.getSize();
        store.set('window_width', size[0]);
        store.set('window_height', size[1]);
    })

    //win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()
})

/* 
    HTTP SERVER + PROTOCOL
*/

function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

var http = require('http');
http.createServer(function(req, res) {

    if (req.method == 'POST') {
       
        processPost(req, res, function() {
            var payl = {'url': req.url, 'data': req.post}
            win.webContents.send('webserver', payl)

            res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            res.end();
        });
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('OK');
    res.end();

}).listen(store.get('binding_port'));
