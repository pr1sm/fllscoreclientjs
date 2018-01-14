import datetime
import socket
import threading
import time

WATCHDOG_INTERVAL = 5;

class ClientHandlerThread(threading.Thread):
    def __init__(self, client_socket, client_addr):
        super(ClientHandlerThread, self).__init__()
        self._stop_event = threading.Event()
        client_socket.settimeout(WATCHDOG_INTERVAL)
        self._client_socket = client_socket
        self._client_addr = client_addr
        self._client_name = '---'
        self._client_time = datetime.datetime.now()

    def stop(self):
        self._stop_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def send(self, message):
        self._client_socket.send(message.encode())

    def run(self):
        try:
            raw_bytes = self._client_socket.recv(1024)
            raw_request = raw_bytes.decode("utf-8")
            # print("Received: {}".format(raw_request))
            request = raw_request.strip().split(":", 2)
            if not len(request) == 2:
                self.send("invalid command\r\n")
            else:
                self.parse_command(request)

        except socket.timeout:
            print("{} - {}: Timeout occurred, closing connection".format(self._client_addr, self._client_name))
            self._client_socket.close()
            return

        self._client_socket.settimeout(2 * WATCHDOG_INTERVAL)
        while not self._stop_event.is_set():
            try:
                raw_bytes = self._client_socket.recv(1024)
                raw_request = raw_bytes.decode("utf-8")
                # print("Received: {}".format(raw_request))
                if not raw_request:
                    print("{} - {}: Connection Closed".format(self._client_addr, self._client_name))
                    break

                request = raw_request.strip().split(':', 2)
                if not len(request) == 2:
                    self.send("invalid command\r\n")
                    continue
                
                self.parse_command(request)

            except socket.timeout:
                print("{} - {}: Timeout occurred, closing connection".format(self._client_addr, self._client_name))
                self._client_socket.close()
                return
            except socket.error:
                time.sleep(0.1)

        self._client_socket.close()

    def parse_command(self, request):
        command = request[0]
        args = request[1].split("|")
        # print("{} - {}: Received {}:{}".format(self._client_addr, self._client_name, command, args))

        if command == "FLLScore":
            if len(args[0]) > 0:
                self._client_name = args[0].strip()

            self.send("Welcome:{}\r\n".format(WATCHDOG_INTERVAL))

        elif command == "Ping":
            self.send("Echo:\r\n")

        elif command == "Send Score":
            self.send("Score Header:11/10/2017 7:52:40 AM|48|60|10\r\n")
            self.send("Score:16449|Dolphin Spiders|310|310|-1|-1\r\n")
            self.send("Score:17557|Crimson Flying|145|145|-1|-1\r\n")
            self.send("Score:23402|Striking Heroes|270|270|-1|-1\r\n")
            self.send("Score:30150|Lightning Spanners|275|275|-1|245\r\n")
            self.send("Score:33256|Alpha Secret Agents|-1|-1|-1|-1\r\n")
            self.send("Score:36131|Ice Mutants|205|205|-1|-1\r\n")
            self.send("Score:41714|Muffin Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:45406|Venomous Slammers|-1|-1|-1|-1\r\n")
            self.send("Score:48551|Sneaky Falcons|-1|-1|-1|-1\r\n")
            self.send("Score:61655|Extreme Dragons|-1|-1|-1|-1\r\n")
            self.send("Score:74638|Butterfly Racoons|-1|-1|-1|-1\r\n")
            self.send("Score:90436|Fire Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:164490|Dolphin Spiders|310|310|-1|-1\r\n")
            self.send("Score:175570|Crimson Flying|145|145|-1|-1\r\n")
            self.send("Score:234020|Striking Heroes|270|270|-1|-1\r\n")
            self.send("Score:301500|Lightning Spanners|275|275|-1|245\r\n")
            self.send("Score:332560|Alpha Secret Agents|-1|-1|-1|-1\r\n")
            self.send("Score:361310|Ice Mutants|205|205|-1|-1\r\n")
            self.send("Score:417140|Muffin Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:454060|Venomous Slammers|-1|-1|-1|-1\r\n")
            self.send("Score:485510|Sneaky Falcons|-1|-1|-1|-1\r\n")
            self.send("Score:616550|Extreme Dragons|-1|-1|-1|-1\r\n")
            self.send("Score:746380|Butterfly Racoons|-1|-1|-1|-1\r\n")
            self.send("Score:904360|Fire Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:1644900|Dolphin Spiders|310|310|-1|-1\r\n")
            self.send("Score:1755700|Crimson Flying|145|145|-1|-1\r\n")
            self.send("Score:2340200|Striking Heroes|270|270|-1|-1\r\n")
            self.send("Score:3015000|Lightning Spanners|275|275|-1|245\r\n")
            self.send("Score:3325600|Alpha Secret Agents|-1|-1|-1|-1\r\n")
            self.send("Score:3613100|Ice Mutants|205|205|-1|-1\r\n")
            self.send("Score:4171400|Muffin Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:4540600|Venomous Slammers|-1|-1|-1|-1\r\n")
            self.send("Score:4855100|Sneaky Falcons|-1|-1|-1|-1\r\n")
            self.send("Score:6165500|Extreme Dragons|-1|-1|-1|-1\r\n")
            self.send("Score:7463800|Butterfly Racoons|-1|-1|-1|-1\r\n")
            self.send("Score:9043600|Fire Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:16449000|Dolphin Spiders|310|310|-1|-1\r\n")
            self.send("Score:17557000|Crimson Flying|145|145|-1|-1\r\n")
            self.send("Score:23402000|Striking Heroes|270|270|-1|-1\r\n")
            self.send("Score:30150000|Lightning Spanners|275|275|-1|245\r\n")
            self.send("Score:33256000|Alpha Secret Agents|-1|-1|-1|-1\r\n")
            self.send("Score:36131000|Ice Mutants|205|205|-1|-1\r\n")
            self.send("Score:41714000|Muffin Bandits|-1|-1|-1|-1\r\n")
            self.send("Score:45406000|Venomous Slammers|-1|-1|-1|-1\r\n")
            self.send("Score:48551000|Sneaky Falcons|-1|-1|-1|-1\r\n")
            self.send("Score:61655000|Extreme Dragons|-1|-1|-1|-1\r\n")
            self.send("Score:74638000|Butterfly Racoons|-1|-1|-1|-1\r\n")
            self.send("Score:90436000|Fire Bandits|-1|-1|-1|-1\r\n")
            self.send("Score Done:\r\n")

        elif command == "Send Last Update":
            _now = datetime.datetime.now()
            if _now.second != self._client_time.second :
                self._client_time = _now

            self.send("Last Update:{}\r\n".format(self._client_time.strftime("%m/%d/%Y %I:%M:%S %p")))
        else:
            self.send("invalid command\r\n")

bind_ip = "0.0.0.0"
bind_port = 8200

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((bind_ip, bind_port))
server.listen(5)
tpool = []

print("Listening on {}:{}".format(bind_ip, bind_port))

try:
    while True:
        client_sock, address = server.accept()
        client_addr = "{}:{}".format(address[0], address[1])
        print("Accepted connection from {}".format(client_addr))
        client_handler = ClientHandlerThread(client_sock, client_addr)
        tpool.append(client_handler)
        client_handler.start()
        tpool = [ thread for thread in tpool
                 if not thread.stopped()
                 ]
except KeyboardInterrupt:
    print("\nClosing...")
finally:
    for thread in tpool:
        thread.stop()
        thread.join()

    server.close()

