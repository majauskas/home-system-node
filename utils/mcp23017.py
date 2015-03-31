#! /usr/bin/python

import smbus
import sys
import getopt
import time 
bus = smbus.SMBus(1)

address = 0x20 # I2C address of MCP23017
bus.write_byte_data(0x20,0x00,0x00) # Set all of bank A to outputs 
bus.write_byte_data(0x20,0x01,0x00) # Set all of bank B to outputs 

def decToBin(n):
	if n==0: return ''
	else:
	    return decToBin(n/2) + str(n%2)

def main():
  #bus.write_byte_data(address,0x12,00000000)
  dec =  bus.read_byte_data(address,0x12)
  print decToBin(dec) 
  sys.exit()

if __name__ == "__main__":
   main()
