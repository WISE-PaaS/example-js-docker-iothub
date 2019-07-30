# Example-JS-Docker-Iothub

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message and we use docker package our application。

## Environment Prepare

#### node.js(need include npm)

[node](https://nodejs.org/en/)

#### cf-cli

[cf-cli](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

Use to push application to WISE-PaaS，if you want to know more you can see this video
[cf-introduce](https://advantech.wistia.com/medias/ll0ov3ce9e)

#### docker

[docker](https://www.docker.com/)

Use to packaged our application

#### Download this repository

    git clone https://github.com/WISE-PaaS/example-js-docker-iothub.git

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

#### Manifest.yml setting

Change **manifest.yml** application name to yours

check the Service Instance name in **manifest.yml** and **wise-paas service list**

![Imgur](https://i.imgur.com/rqZ6XL0.png)

![Imgur](https://i.imgur.com/S2rX4uI.png)

- name: Define our application serviceName
- memory: The memory we want to give to our app
- disk_quota: The disk we want to give to our app
- command:

Notice:You can add service instance by yourself

![Imgur](https://i.imgur.com/ajqSsn1.png)

#### application introduce in `index.js`

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

#### Push to WISE-PaaS

`cf push` can help us push application to the WISE-PaaS，but first you need to login。

![Imgur](https://i.imgur.com/JNJmxFy.png)

    #cf login -a api.{domain name} -u {WISE-PaaS/EnSaaS account} -p {WISE-PaaS/EnSaaS password}
    cf login -a api.wise-paas.io -u xxxxx@advantech.com -p xxxxxxxx

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iothub

Get application environment in WISE-PaaS

    cf env example-js-docker-iothub > env.json

#### Send message use mqtt

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
