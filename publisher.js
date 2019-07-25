

const mqtt = require('mqtt')

//const mqttUri ='mqtt://f34cde9b-b664-4a94-baa8-e702148c60af%3A12983c35-3c84-47d5-a63b-c053d060af10:oJdl8HCvrNPSALZajVC5uJG6I@40.81.26.31:1883';

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
