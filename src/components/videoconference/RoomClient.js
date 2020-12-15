const MEDIA_TYPE = {
  audio: "audioType",
  video: "videoType",
  screen: "screenType",
};

/*
DEBUGGING

window.rc = null;
window.consumers = [];
window.producers = [];
*/

const config = {
  video: {
    width: { min: 640, ideal: 1920 },
    height: { min: 400, ideal: 1080 },
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  },
};

class RoomClient {
  constructor(mediasoupClient, socket, callId) {
    window.rc = this;
    this.mediasoupClient = mediasoupClient;
    this.socket = socket;
    this.callId = callId;

    // We will eventually have...
    // Two transports
    this.producerTransport = null;
    this.consumerTransport = null;

    // A device
    this.device = null;

    // Consumers and producers
    this.consumers = {};
    this.producers = {};

    // Event handlers
    this.handlers = { consume: [] };
  }

  async request(name, data) {
    return new Promise((resolve, reject) => {
      this.socket.emit(name, data, (response) => {
        if (response.error) reject(response.error);
        else resolve(response);
      });
    });
  }

  async handleTransportConnect(transport) {
    return new Promise((resolve, reject) => {
      // Wait for the producer transport to connect...
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        console.log("got connect!");
        await this.request("establishDtls", {
          dtlsParameters,
          callId: this.callId,
          transportId: transport.id,
        });

        callback();
        resolve();
      });
    });
  }

  async init() {
    // Request to join the room.
    // We will recieve two transports and
    // and rtpCapabilities object, if we are allowed in.
    const {
      producerTransportInfo,
      consumerTransportInfo,
      routerRtpCapabilities,
    } = await this.request("join", { callId: this.callId });

    // Load up a local media device consistent
    // with the server's RTP capabilities.
    this.device = await this.loadDevice(routerRtpCapabilities);

    // Set up both transports and promise to send
    // dtls info when they connect (this won't occur until
    // someone actually produces).
    this.producerTransport = this.device.createSendTransport(
      producerTransportInfo
    );
    this.handleTransportConnect(this.producerTransport);

    this.consumerTransport = this.device.createRecvTransport(
      consumerTransportInfo
    );
    this.handleTransportConnect(this.consumerTransport);

    // Declare what our device is capable of.
    await this.request("declareRtpCapabilities", {
      rtpCapabilities: this.device.rtpCapabilities,
    });

    // We don't actually need to wait for this request to come back.
    this.request("finishConnecting", { callId: this.callId });

    // When our producer transport is producing a new stream,
    // inform the server.
    this.producerTransport.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        console.log("Sending produce request");

        const { producerId } = await this.request("produce", {
          callId: this.callId,
          kind,
          rtpParameters,
        });

        callback({ id: producerId });
      }
    );

    // When we get a consumer, fire an event.
    this.socket.on("consume", async (info) => {
      const { consumer, stream } = await this.consume(info);

      this.socket.emit("resumeConsumer", {
        callId: this.callId,
        consumerId: consumer.id,
      });

      this.handlers.consume.forEach((f) => f(info.kind, stream));
    });
  }

  getMediaConstraints(type, deviceId) {
    if (type === MEDIA_TYPE.audio) {
      return { audio: { deviceId } };
    } else if (type === MEDIA_TYPE.video) {
      return {
        video: {
          width: config.video.width,
          height: config.video.height,
          deviceId,
        },
      };
    }
  }

  async produce(type, deviceId = null) {
    const mediaConstraints = this.getMediaConstraints(type, deviceId);
    console.log("Media constraints are", mediaConstraints);
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    console.log("Got stream");

    const track = (type === MEDIA_TYPE.audio
      ? stream.getAudioTracks()
      : stream.getVideoTracks())[0];

    const params = { track };

    console.log("got track");

    if (type === MEDIA_TYPE.video) {
      params.encodings = config.video.encodings;
      params.codecOptions = config.video.codecOptions;
    }

    console.log("producing with params", params);

    const producer = await this.producerTransport.produce(params);
    console.log("produced with id", producer.id);
    window.producers.push(producer);
    this.producers[producer.id] = producer;
  }

  async loadDevice(routerRtpCapabilities) {
    const device = new this.mediasoupClient.Device();

    await device.load({ routerRtpCapabilities });

    return device;
  }

  async consume(info) {
    const consumer = await this.consumerTransport.consume(info);
    const stream = new MediaStream();

    this.consumers[consumer.id] = consumer;

    stream.addTrack(consumer.track);

    console.log("Successfully created stream.");
    return { consumer, stream };
  }

  async on(event, fn) {
    if (!(event in this.handlers)) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(fn);
  }

  async terminate() {
    console.log("sending request to terminate");
    await this.request("terminate", { callId: this.callId });
  }
}

export default RoomClient;
