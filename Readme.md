# Example-JS-Docker-Iothub

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message and we use docker package our application。


#### Environment Prepare

node.js(need include npm)

[https://nodejs.org/en/](https://nodejs.org/en/)

cf-cli

[https://docs.cloudfoundry.org/cf-cli/install-go-cli.html](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

docker

[https://www.docker.com/](https://www.docker.com/)

#### Download this repository

    git clone https://github.com/WISE-PaaS/example-js-docker-iothub/

#### Build docker image in local
 
    docker build -t {image name} .
    docker build -t example-js-docker-iothub .

#### Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

    #docker login to the docker hub
    docker login
    
    #docker tag {image name} {your account/dockerhub-resp name}
    docker tag example-js-docker-iothub WISE-PaaS/example-js-docker-iothub



#### Push it to docker hub

    #docker push {your account/dockerhub-resp name}
    docker push WISE-PaaS/example-js-docker-iothub

#### Change **manifest.yml** application name to yours

check the Service Instance name in **manifest.yml** and **wise-paas service list**
![Imgur](https://i.imgur.com/rqZ6XL0.png)

![Imgur](https://i.imgur.com/S2rX4uI.png)

#### Use cf(cloud foundry) push to WISE-PaaS

![Imgur](https://i.imgur.com/JNJmxFy.png)

    #cf login -a api.{domain name} -u {WISE-PaaS/EnSaaS account} -p {WISE-PaaS/EnSaaS password}
    cf login -a api.wise-paas.io -u xxxxx@advantech.com -p xxxxxxxx

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iothub

Get application environment in WISE-PaaS

    cf env example-js-docker-iothub > env.json



#### Edit the **publisher.py** `mqttUri` to mqtt=>uri you can find in env.json 

when you get it you need to change the host to  externalHosts

![Imgur](https://i.imgur.com/xErDczu.png)

* uri :"VCAP_SERVICES => p-rabbitmq => mqtt => uri"
* exnternalhost : "VCAP_SERVICES" => p-rabbitmq => externalHosts



open two terminal
    
    #cf logs {application name}
    cf logs example-js-docker-iothub 

.

    node publisher.js
