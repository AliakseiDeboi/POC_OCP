import { OPCUAClient, AttributeIds, DataType } from "node-opcua";

const connectionURL = "opc.tcp://localhost:3000/UA/POCServer";

const startClient = async () => {
  const client = OPCUAClient.create({ endpointMustExist: false });

  await client.connect(connectionURL);

  const session = await client.createSession();

  const nodeId = "ns=1;s=Counter"; 

  //getter
  const readCounter = async () => {
    const dataValue = await session.read({
      nodeId: nodeId,
      attributeId: AttributeIds.Value,
    });

    console.log("Current counter:", dataValue.value.value);
  }

  //setter
  const setCounter = async () => {
    const answer = await session.write([{
        nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: { 
            value: { 
                dataType: DataType.Double,
                value: 34
            }
        }
    }]);
    }

  //Fetching the data every 2 sec
  setInterval(readCounter, 2000);

  await setCounter();
}

startClient();