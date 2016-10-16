"use strict"

const http = require('http');
const spawn = require('child_process').spawn;
const fs = require('fs');
const config = require('./config.json');

const recorder = {
    _ffmpeg : null,
    _clients : [],
    start : function() {   
        if (this._ffmpeg == null && this._clients.length > 0) {
            console.log("Starting to record."); 
            this._ffmpeg = spawn("/bin/sh", [
                "-c", config["record-command"] 
            ]);

            this._ffmpeg.on('error', (error) => {
                console.error(error);
            });

            this._ffmpeg.on('exit', (code) => {
                console.log(`avconv exited with ${code}.`);
                this._ffmpeg = null;
                this.start();
            });

            this._ffmpeg.stderr.on('data', (data) => {
                console.error(`[avconv] ${data}`);    
            });

            this._ffmpeg.stdout.on('data', (data) => {
                for (var i = 0; i < this._clients.length; i++) {
                    this._clients[i].write(data);
                }
            });
        }
    },

    stop : function() {
        if (this._ffmpeg != null) {
            this._ffmpeg.kill();
        }
    },

    addClient : function(client) {    
        this._clients.push(client);
        this.start();
    },

    removeClient : function(client) {
        var index = this._clients.indexOf(client);
        if (index >= 0) {
            this._clients.splice(index, 1);
            if (this._clients.length == 0) {
                this.stop();
            }
        }
    }
};

const server = http.createServer((request, response) => {
    console.log("Received request " + request.url);
    
    const siteBase = 'site';
    var filePath = siteBase + request.url;
    if (filePath == siteBase + '/') {
        filePath = siteBase + '/index.htm';
    }
    
    if (filePath.endsWith('.mp3')) {        
        response.writeHead(200, { 
            'Content-Type' : "audio/mp3",
            'Cache-control' : 'no-cache' 
        });

        response.on('close', () => {
            console.log("Request ended.");
            recorder.removeClient(response); 
        });

        response.on('error', (error) => {
            console.error(error)
        });

        recorder.addClient(response);

    } else {
        fs.readFile(filePath, (error, content) => {
            response.writeHead(200, { 'Content-Type' : "text/html" });
            response.end(content, 'utf-8');
        });
    }
});

server.listen(config["port"], () => {
    console.log(`Server listening on port ${config.port}.`)
});
