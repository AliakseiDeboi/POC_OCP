import { OPCUAServer, Variant, DataType, NodeId, NodeIdType, StatusCodes } from "node-opcua";

const startServer = async () => {
  const server = new OPCUAServer({
    port: 3000,
    resourcePath: "/UA/POCServer",
  });

  await server.initialize();

  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();

  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "POCDevice",
  });

  const nodeId = new NodeId(NodeIdType.STRING, 'Counter', 1);

  let counter = 1;

  namespace.addVariable({
    componentOf: device,
    browseName: "Counter",
    nodeId,
    dataType: "Double",
    value: {
      get: () => new Variant({ dataType: DataType.Double, value: counter }),
      set: (variant) => {
        counter = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  //Let's change counter as a simulation of data change
  setInterval(() => {
    counter += Math.random() * 2 - 1;
  }, 1000);

  await server.start();

  console.log("Server is listening on port 3000...");
}

startServer();