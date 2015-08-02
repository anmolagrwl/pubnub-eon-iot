var five = require("johnny-five");
var board = new five.Board();
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo",
    no_wait_for_pending : true
});

var reading, message;

board.on("ready", function() {

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 100
  });

  sensor.scale([0, 10]).on("data", function() {
    reading = this.value.toFixed(2);
    // message = { "Magnitude" : reading };

    console.log(reading);

    pubnub.publish({
      channel   : 'pubnub-eon-iot',
      message   : {
        columns:[
          ['x', new Date().getTime()],
          ['Pressure Sensor', reading]
        ]
      }
    });

  });

});
