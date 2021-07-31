#!/bin/bash

function start_daemon {
    cd /home/pi/pos-system

    while true; do
        ./bin/pos-system >> /home/pi/pos.log
        sleep 1
    done
}

export -f background

nohup bash -c start_daemon &
