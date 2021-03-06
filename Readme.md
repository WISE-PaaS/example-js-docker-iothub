# Example-JS-Docker-Iothub

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message and we use docker package our application。

[cf-introduce Training Video](https://advantech.wistia.com/medias/ll0ov3ce9e)

[IotHub Training Video](https://advantech.wistia.com/medias/up3q2vxvn3)

## Environment Prepare

#### node.js(need include npm)

[node](https://nodejs.org/en/)

#### cf-cli

[cf-cli](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

Use to push application to WISE-PaaS，if you want to know more you can see this video

#### docker

[docker](https://www.docker.com/)

Use to packaged our application

#### Download this repository

    #download this repository
    git clone https://github.com/WISE-PaaS/example-js-docker-iothub.git
    
    #download what package the application need
    npm install

## Login to WISE-PaaS

![Imgur](https://i.imgur.com/JNJmxFy.png)

    #cf login -skip-ssl-validation -a {api.domain_name}  -u "account" -p "password"

    cf login –skip-ssl-validation -a api.wise-paas.io -u xxxxx@advtech.com.tw -p xxxxxx

    #check the cf status
    cf target

#### Manifest.yml

The file save the config when we push our application to the WISE-PaaS。

(Change **manifest.yml** application name to yours，because i already use it。)

And we need to bind the rabbitmq(iothub) service in our application so we write it to **manifest.yml**

(check the Service Instance name in **manifest.yml** and **wise-paas service list**，if you doesn't have it，you can create one by click add button)

![Imgur](https://i.imgur.com/rqZ6XL0.png)

![Imgur](https://i.imgur.com/S2rX4uI.png)

- name: Define our application serviceName
- memory: The memory we want to give to our app
- disk_quota: The disk we want to give to our app
- command: Start the application

Notice:You can add service instance by yourself

![Imgur](https://i.imgur.com/ajqSsn1.png)

## Application Introduce

#### index.js

This is a simple backend application and we can get the application config in WISE-PaaS

```js
const express = require("express");
const mqtt = require("mqtt");

const app = express();

app.get("/", (req, res) => {
  res.send("mqtt and iothub");
});

var port = process.env.PORT || 3000;
app.listen(port, (res, req) => {
  console.log(`listen port on ${port}`);
});

let vcap_services = JSON.parse(process.env.VCAP_SERVICES);
// Start Config
var config = {};
config.mqtt = {};
/** Modify this config ***/
config.timeout = 120 * 1000;
//service name in wise-Paas
config.mqtt.serviceName = "p-rabbitmq";

if (process.env.VCAP_SERVICES != null) {
  console.log("Using VCAP_SERVICES");
  let vcap_services = JSON.parse(process.env.VCAP_SERVICES);
}

// Parsing credentials from VCAP_SERVICES for binding service
if (vcap_services[config.mqtt.serviceName]) {
  console.log("Parsing " + config.mqtt.serviceName);
  config.mqtt.broker =
    "mqtt://" +
    vcap_services[config.mqtt.serviceName][0].credentials.protocols.mqtt.host;
  config.mqtt.username = vcap_services[
    config.mqtt.serviceName
  ][0].credentials.protocols.mqtt.username.trim();
  config.mqtt.password = vcap_services[
    config.mqtt.serviceName
  ][0].credentials.protocols.mqtt.password.trim();
  config.mqtt.port =
    vcap_services[config.mqtt.serviceName][0].credentials.protocols.mqtt.port;
}
//MQTT config
config.mqtt.options = {
  broker: config.mqtt.broker,
  reconnectPeriod: 1000,
  port: config.mqtt.port,
  username: config.mqtt.username,
  password: config.mqtt.password
};

config.mqtt.topic = "/hello"; //top we listen
config.mqtt.retain = true; // MQTT Publish Retain
```

`vcap_services` can get the environment on WISE-PaaS，

![Imgur](https://i.imgur.com/PYzkbLd.png)

Notice:The `config.mqtt.serviceName` mush be the same as the WISE-PaaS servicename

![Imgur](https://i.imgur.com/6777rmg.png)

This code use to connect to rabbitmq service，you can design the `client.on("message",)...`
and make it save data or do other thing。

```js
var client = mqtt.connect(config.mqtt.broker, config.mqtt.options);

client.on("connect", function() {
  client.subscribe(config.mqtt.topic);
  console.log("[MQTT]:", "Connected.");
});

client.on("message", function(topic, message) {
  console.log("[" + topic + "]:" + message.toString());
});

client.on("error", function(err) {
  console.log(err);
});

client.on("close", function() {
  console.log("[MQTT]: close");
});

client.on("offline", function() {
  console.log("[MQTT]: offline");
});
```


## Build docker image in local

#### Dockfile introduce

This file can help us build a docker image
it will use the node docker image first，it will download automatic，and save copy a file to /app ，next to install package by `npm install`，the port we set in `index.js` is 3000，and finally start it。

```
FROM node:8-alpine

ADD . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start
```

Use `docker build` to build our image，and it need to in path than we already define the Dockerfile

    docker build -t {image name} .
    docker build -t example-js-docker-iothub .

#### Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

![Imgur](https://i.imgur.com/SxiLcOH.png)

    #docker login to the docker hub
    docker login

    #docker tag {image name} {your account/dockerhub-resp name}
    docker tag example-js-docker-iothub WISE-PaaS/example-js-docker-iothub

#### Push it to docker hub

    #docker push {your account/dockerhub-resp name}
    docker push WISE-PaaS/example-js-docker-iothub

#### Push to WISE-PaaS

`cf push` can help us push application to the WISE-PaaS，but first you need to login。

![Imgur](https://i.imgur.com/JNJmxFy.png)

    #cf login -a api.{domain name} -u {WISE-PaaS/EnSaaS account} -p {WISE-PaaS/EnSaaS password}
    cf login -a api.wise-paas.io -u xxxxx@advantech.com -p xxxxxxxx

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iothub

Get application environment in WISE-PaaS

    cf env example-js-docker-iothub > env.json

## Send message use mqtt

#### Publisher.js

```js
const mqtt = require("mqtt");

const mqttUri =
  "mqtt://xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx%3A0516aa2a-0fe5-4683-a9d6-072dcf64df3c:Z2lUsjpx2y0KsohXeytcrRVeQ@40.81.27.10:1883";
// Use mqttUri or connectOpts

const client = mqtt.connect(mqttUri);

client.on("connect", connack => {
  setInterval(() => {
    publishMockTemp();
  }, 3000);
});

// Publish mock random temperature periodically
function publishMockTemp() {
  const temp = Math.floor(Math.random() * 7 + 22);
  client.publish("/hello", temp.toString(), { qos: 2 }, (err, packet) => {
    //if (!err) console.log('Data sent to /hello' + temp);
    if (err) {
      console.log(err);
    } else {
      console.log("Data send to /hello " + temp);
    }
  });
}
```

Edit the **publisher.js** `mqttUri` you can find the `uri` in env.json

- uri :"VCAP_SERVICES => p-rabbitmq => mqtt => uri"
- exnternalhost : "VCAP_SERVICES" => p-rabbitmq => externalHosts

Notice:You need to change the host to externalHosts

![Imgur](https://i.imgur.com/xErDczu.png)

to

![Imgur](https://i.imgur.com/YsSUgaz.png)

Open two terminal and check the application

    #cf logs {application name}
    cf logs example-js-docker-iothub

.

    node publisher.js

![Imgur](https://i.imgur.com/7TVqrC1.png)
