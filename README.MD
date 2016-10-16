## About the project
This project is a simple audio-only baby monitor. Audio can be listened to simply by connecting to a web page, such as
from a cell phone. I built it for myself as a fun side project during my parental leave. I've been running from on a
Raspberry Pi 3.

## Prerequisits
### Microphone
If you're running is from a Raspberry Pi, you should be able to use any standard USB microphone.
### libav-tools
Install libav-tools for the avconv command:
```
apt-get install libav-tools
```
### Node.js
Install Node.js 6.x
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install -y nodejs
```
### Installation
For simple use, you may clone or copy this repository onto the device.
#### Running on startup
There are few ways to do this. One way is to create a cron job, which runs on startup.
```
crontab -e
```
Add the following line:
```
@reboot ~/baby-monitor/scripts/run
```
## Usage
### Starting the monitor
You can start the monitor like any npm project. From the root directory of the repository:
```
npm start
```
### Listening
Use a browser to connect to the Raspberri Pi, by default, on Raspbian, this should be http://raspberrypi:8080/. Click
the start button. That's it!

## Configuration
### Changing the audio device
Depending on the device used for recording the audio, the avconv command may need to be changed in the config.js file.
### Changing the port number
This can be changed from the config.js file a the root of the respository.
