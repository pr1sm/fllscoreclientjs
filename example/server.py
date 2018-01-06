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

    def stop(self):
        self._stop_event.set()

    def stopped(self):
        return self._stop_event.is_set()

    def run(self):
        raw_request = ''
        try:
            raw_request = self._client_socket.recv(1024)
            request = raw_request.strip().split(':', 2)
            if not len(request) == 2:
                self._client_socket.send('invalid command\r\n')
            else:
                self.parse_command(request)

        except socket.timeout:
            print '{} - {}: Timeout occurred, closing connection'.format(self._client_addr, self._client_name)
            self._client_socket.close()
            return

        self._client_socket.settimeout(2 * WATCHDOG_INTERVAL)
        while not self._stop_event.is_set():
            try:
                raw_request = self._client_socket.recv(1024)
                if not raw_request:
                    print '{} - {}: Connection Closed'.format(self._client_addr, self._client_name)
                    break

                request = raw_request.strip().split(':', 2)
                if not len(request) == 2:
                    self._client_socket.send('invalid command\r\n')
                    continue
                
                self.parse_command(request)

            except socket.timeout:
                print '{} - {}: Timeout occurred, closing connection'.format(self._client_addr, self._client_name)
                self._client_socket.close()
                return
            except socket.error:
                time.sleep(0.1)

        self._client_socket.close()

    def parse_command(self, request):
        command = request[0]
        args = request[1].split('|')
        print '{} - {}: Received {}:{}'.format(self._client_addr, self._client_name, command, args)

        if command == 'FLLScore':
            if len(args[0]) > 0:
                self._client_name = args[0].strip()

            self._client_socket.send('Welcome:{}\r\n'.format(WATCHDOG_INTERVAL))

        elif command == 'Ping':
            self._client_socket.send('Echo:\r\n')

        elif command == 'Send Score':
            self._client_socket.send('Score Header:11/10/2017 7:52:40 AM|12|36|6\r\n')
            self._client_socket.send('Score:16449|Dolphin Spiders|310|310|-1|-1\r\n')
            self._client_socket.send('Score:17557|Crimson Flying|145|145|-1|-1\r\n')
            self._client_socket.send('Score:23402|Striking Heroes|270|270|-1|-1\r\n')
            self._client_socket.send('Score:30150|Lightning Spanners|275|275|-1|245\r\n')
            self._client_socket.send('Score:33256|Alpha Secret Agents|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:36131|Ice Mutants|205|205|-1|-1\r\n')
            self._client_socket.send('Score:41714|Muffin Bandits|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:45406|Venomous Slammers|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:48551|Sneaky Falcons|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:61655|Extreme Dragons|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:74638|Butterfly Racoons|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score:90436|Fire Bandits|-1|-1|-1|-1\r\n')
            self._client_socket.send('Score Done:\r\n')

        elif command == 'Send Last Update':
            self._client_socket.send('Last Update:11/10/2017 7:52:40 AM\r\n')

        else:
            self._client_socket.send('invalid command\r\n')

bind_ip = '0.0.0.0'
bind_port = 8100

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((bind_ip, bind_port))
server.listen(5)
tpool = []

print 'Listening on {}:{}'.format(bind_ip, bind_port)

try:
    while True:
        client_sock, address = server.accept()
        client_addr = '{}:{}'.format(address[0], address[1])
        print 'Accepted connection from {}'.format(client_addr)
        client_handler = ClientHandlerThread(client_sock, client_addr)
        tpool.append(client_handler)
        client_handler.start()
        tpool = [ thread for thread in tpool
                 if not thread.stopped()
                 ]
except KeyboardInterrupt:
    print '\nClosing...'
finally:
    for thread in tpool:
        thread.stop()
        thread.join()

    server.close()

