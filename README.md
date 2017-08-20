# Plant Guardian

The project aims to create a simple watcher that keeps tabs on plant moisture and let's you check it in real time using your phone. It's based on an Arduino Nano, Raspberry Pi and some analog soil moisture sensors. Of course, you could head out and buy some pre-made device for this, but it's more fun building it yourself. This is the Node.js code for the main application. For the Arduino code, please check [this repository](https://github.com/jonathanlundstrom/plant-guardian-nano).

This was developed in partnership with [Conrad](https://www.conrad.se/) in their efforts to showcase makers around Sweden. I would therefore like to thank them for providing the hardware used in this project. Please also check out [their website](http://tekkie.se/) for more interesting projects.

### Usage
Clone the repository to a folder of your liking and use the following command to start the software:

    npm run server
    
### Build guide
Please refer to this link for a complete description on how and where to use this software.

[http://jonathanlundstrom.me/2017/08/20/project-plant-guardian/](http://jonathanlundstrom.me/2017/08/20/project-plant-guardian/)

### Supervisor job
If you wish to have the software running all the time, you can use Supervisor to accomplish this. This is the configuration file that I use. It should be placed in `/etc/supervisor/conf.d` and named `guardian.conf` or similar.

    [program:guardian]
    directory=/home/pi/Applications/PlantGuardian
    command=npm run server
    autostart=true
    autorestart=true
    stderr_logfile=/var/log/guardian.err.log
    stdout_logfile=/var/log/guardian.out.log

### Finished product
This section will in time be updated with a video of the final build and product.