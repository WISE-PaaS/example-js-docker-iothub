
Build docker image in local

    docker build -t example-js-docker-iothub .

Tag it to a docker hub 

   docker tag example-js-docker-iothub tsian077/example-js-docker-iothub

Push it to docker hub

    docker push tsian077/example-js-docker-iothub

Change **manifest.yml** application name

check the application name in **manifest.yml** and **wise-paas service list**

Use cf(cloud foundry) push to WISE-PaaS

    cf push --docker-image tsian077/example-js-docker-iothub