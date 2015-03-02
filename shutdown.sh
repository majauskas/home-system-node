#!/bin/sh
#


kill -9 $(ps -W | grep 'node' | awk '{print $1}')
