## Description
A simple application server that prints a message at a given time in the future

### Implementation notes:

1. Setting notifications on the redis server: CONFIG SET notify-keyspace-events Ex
2. Subscribing to expire events: PSUBSCRIBE '__keyevent@0__:expired'
3. For each echo message a unique uuid 'x' is generated as the key while the message is the value. 
4. Each uuid is backed by 'opaque:x' which is a reference to the same message in case the server was down while the message expired.
5. When an expire event is trigged, it receives as payload the key expired, to get the message and opaque key is generated to get the message. 
5. While the server is up again it checks to see if there exists and opaque:* message and echo them.
5. The exp time is calculated by substracting the future time - current time
6. For each unique uuid x we create an 'opaque:uuid' key where the 

## Installation
```bash
$ npm install
```
## Running the app
```bash
# development
$ npm run start:development

# docker-compose
$ docker-compose build
$ docker-compose up -d
```

## Echo a message
Open your browser and navigate to http://localhost:3000/redis-master/api/swagger


