import { OPCUAClient, AttributeIds } from "node-opcua";

const connectionURL = "opc.tcp://opcua-server:3000/UA/POCServer";

class OPCUAClientService {
  constructor() {
    this.client = OPCUAClient.create({
      autoAcceptUnknownCertificate: true,
      endpointMustExist: false
    });
    this.session = null;
  }

  async connect() {
    await this.client.connect(connectionURL);
    this.session = await this.client.createSession();
    console.log("Connected to OPC UA server");
  }

  async readCounter() {
    const nodeId = "ns=1;s=Counter";
    const dataValue = await this.session.read({
      nodeId: nodeId,
      attributeId: AttributeIds.Value,
    });
    return dataValue.value.value;
  }

  async writeCounter(value) {
    const nodeId = "ns=1;s=Counter";
    await this.session.writeSingleNode(nodeId, { dataType: "Double", value });
  }

  async test() {
    return 'exists';
  }

  async disconnect() {
    await this.session.close();
    await this.client.disconnect();
    console.log("Disconnected from OPC UA server");
  }
}

export default new OPCUAClientService();