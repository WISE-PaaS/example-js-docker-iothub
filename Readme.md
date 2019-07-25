# Example-JS-Docker-Iothub

This example tell you how to use the WISE-PaaS rabbitmq service to receive and send message and we use docker package our application。

Build docker image in local
 
    docker build -t {image name} .
    docker build -t example-js-docker-iothub .

Go to docker hub add a new **Repository**

Tag image to a docker hub  
[Docker Hub](https://hub.docker.com/)

    #docker tag {image name} {your account/dockerhub-resp name}
    docker tag example-js-docker-iothub WISE-PaaS/example-js-docker-iothub



Push it to docker hub

    #docker push {your account/dockerhub-resp name}
    docker push WISE-PaaS/example-js-docker-iothub

Change **manifest.yml** application name

check the application name in **manifest.yml** and **wise-paas service list**
![https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/service_list_rabbitmq_name.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/service_list_rabbitmq_name.PNG)
![https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/manifestname.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/manifestname.PNG)

Use cf(cloud foundry) push to WISE-PaaS

    #cf push --docker-image {your account/dockerhub-resp}
    cf push --docker-image WISE-PaaS/example-js-docker-iothub

Get application environment in WISE-PaaS

    cf env example-js-docker-iothub > env.json



Edit the **publisher.py** `mqttUri` to mqtt=>uri you can find in env.json 

when you get it you need to change the host to  externalHosts

![https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/externalhost.PNG](https://github.com/WISE-PaaS/example-js-docker-iothub/blob/master/source/externalhost.PNG)

* uri :"VCAP_SERVICES => p-rabbitmq => mqtt => uri"
* exnternalhost : "VCAP_SERVICES" => p-rabbitmq => externalHosts



open two terminal
    
    #cf logs {application name}
    cf logs example-js-docker-iothub 

.

    python publisher.py
