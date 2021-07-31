# Creating a Startup Script

This tutorial assumes you're using a Raspberry Pi as your server. If you're not, you can replace the directory in the two files in this folder to the paths that apply to you.

``` sh
cd ~
git clone https://github.com/wisepythagoras/pos-system
```

Put the `start-pos.sh` script in your home folder and then run the following:

``` sh
chmod 644 ~/pos-system/startup/pos-system.service
chmod +x ~/start-pos.sh
sudo cp ~/pos-system/startup/pos-system.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pos-system.service
sudo reboot
```

This should automatically start up the POS app on startup.
