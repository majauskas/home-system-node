# home-system-node
home-system for raspberry pi



## Usage
npm install

git clone git://github.com/quick2wire/quick2wire-gpio-admin.git
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio

suso npm install forever -g

sudo forever start -a -l /home/pi/logs-home-system-node.txt /home/pi/home-system-node/updater.js

## Developing
http://translate.google.com/translate_tts?tl=it&q=allarme%20%C3%A8%20stato%20disattivato
http://translate.google.com/translate_tts?tl=it&q=Finestra Grande In Sala � aperta
http://translate.google.com/translate_tts?tl=it&q=Finestra In Cucina � aperta
http://translate.google.com/translate_tts?tl=it&q=Finestra In Cameretta � aperta
http://translate.google.com/translate_tts?tl=it&q=Porta Ingresso � aperta
http://translate.google.com/translate_tts?tl=it&q=Finestra In Bagno Sopra � aperta

### Tools

ApacheBench
ab -n 100 -c 100 http://10.221.6.69:8081/Event

curl -X POST http://10.221.6.69:8080/433mhz/24/0111111111100011001/123683453

001001010101000101010001
0000111110100101000000001000011111000101

0000111100111101000000001000011100101101        chiudi
0000111100111101000000000010011110001101        apri
0000111100111101000000000000101010101010        batt ko inserita


0000111110100101000000001000011111000101        chiudi batt ko
0000111110100101000000000010011100100101        apri   batt ko
0000111110100101000000000000101001000010        batt ko inserita
0000111110100101000000000000101101000001        batt ok inserita



#1
0000001010100011000000001000011111010100        chiudi
0000001010100011000000000010011100110100        apri
0000001010100011000000000000101001010001        batt ko inserita
0000001010100011000000000000101101010000        batt ok inserita

#2
0000111110110110000000001000011110110100        chiudi
0000111110110110000000000010011100010100        apri
0000111110110110000000000000101000110001        batt ko inserita
0000111110110110000000000000101100110000        batt ok inserita


000001000000010000000011                        telecomando off
000001000000010011000000                        telecomando on
000001000000010000001100                        telecomando mutto 


011111110001010101000101						porta ingresso


 +-----+-----+---------+------+---+--B Plus--+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 |     |     |    3.3v |      |   |  1 || 2  |   |      | 5v      |     |     |
 |   2 |   8 |   SDA.1 | ALT0 | 1 |  3 || 4  |   |      | 5V      |     |     |
 |   3 |   9 |   SCL.1 | ALT0 | 1 |  5 || 6  |   |      | 0v      |     |     |
 |   4 |   7 | GPIO. 7 |   IN | 0 |  7 || 8  | 1 | ALT0 | TxD     | 15  | 14  |
 |     |     |      0v |      |   |  9 || 10 | 1 | ALT0 | RxD     | 16  | 15  |
 |  17 |   0 | GPIO. 0 |   IN | 0 | 11 || 12 | 0 | IN   | GPIO. 1 | 1   | 18  |
 |  27 |   2 | GPIO. 2 |   IN | 0 | 13 || 14 |   |      | 0v      |     |     |
 |  22 |   3 | GPIO. 3 |   IN | 0 | 15 || 16 | 0 | IN   | GPIO. 4 | 4   | 23  |
 |     |     |    3.3v |      |   | 17 || 18 | 0 | IN   | GPIO. 5 | 5   | 24  |
 |  10 |  12 |    MOSI | ALT0 | 0 | 19 || 20 |   |      | 0v      |     |     |
 |   9 |  13 |    MISO | ALT0 | 0 | 21 || 22 | 0 | IN   | GPIO. 6 | 6   | 25  |
 |  11 |  14 |    SCLK | ALT0 | 0 | 23 || 24 | 1 | ALT0 | CE0     | 10  | 8   |
 |     |     |      0v |      |   | 25 || 26 | 1 | ALT0 | CE1     | 11  | 7   |
 |   0 |  30 |   SDA.0 |   IN | 1 | 27 || 28 | 1 | IN   | SCL.0   | 31  | 1   |
 |   5 |  21 | GPIO.21 |   IN | 1 | 29 || 30 |   |      | 0v      |     |     |
 |   6 |  22 | GPIO.22 |   IN | 1 | 31 || 32 | 0 | IN   | GPIO.26 | 26  | 12  |
 |  13 |  23 | GPIO.23 |   IN | 0 | 33 || 34 |   |      | 0v      |     |     |
 |  19 |  24 | GPIO.24 |   IN | 0 | 35 || 36 | 0 | IN   | GPIO.27 | 27  | 16  |
 |  26 |  25 | GPIO.25 |   IN | 0 | 37 || 38 | 0 | IN   | GPIO.28 | 28  | 20  |
 |     |     |      0v |      |   | 39 || 40 | 0 | IN   | GPIO.29 | 29  | 21  |
 +-----+-----+---------+------+---+----++----+---+------+---------+-----+-----+
 | BCM | wPi |   Name  | Mode | V | Physical | V | Mode | Name    | wPi | BCM |
 +-----+-----+---------+------+---+--B Plus--+---+------+---------+-----+-----+


