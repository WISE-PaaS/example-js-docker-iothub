
const mqtt = require('mqtt')


const mqttUri = 'mqtt://f456d95d-b76f-43e9-8b35-bac8383bf941%3A25dbf2be-9d86-44e9-8bea-f01e82032052:AopU9zUuHB5z0Gtv5ymbSrs0D@40.81.27.10:1883'
// Use mqttUri or connectOpts
const client = mqtt.connect(mqttUri);

client.on('connect', (connack) => {
  setInterval(() => {
    publishMockTemp();
  }, 3000);
});

// Publish mock random temperature periodically
function publishMockTemp() {
  
  const temp = Math.floor((Math.random() * 7) + 22);
  client.publish('/hello', temp.toString(), { qos: 2 }, (err, packet) => {
      //if (!err) console.log('Data sent to /hello' + temp);
      if(err)
      {
          
          console.log(err)
      }else{
          
          console.log('Data send to /hello ' + temp);
      }
    });
  
}
