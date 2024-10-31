import express, { json } from "express";
import mongoose from "mongoose";
import opcuaClientService from "./opcClient.js";
import Counter from "./models/counter.model.js";

const app = express();
app.use(json());

app.get("/read", async (req, res) => {
    try {
        const counter = await opcuaClientService.readCounter();
        const newRecord = new Counter({ value: counter });
        await newRecord.save();
        res.json({ value: counter });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/test", async (req, res) => {
    try {
        const exists = await opcuaClientService.test();
        res.json({value: exists});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post("/write", async (req, res) => {
    const { value } = req.body;
    try {
        await opcuaClientService.writeCounter(value);
        const newRecord = new Counter({ value });
        await newRecord.save();
        res.send("Value updated");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const start = async () => {
    await opcuaClientService.connect();
    console.log("Connected to OPCUA!");
    await mongoose.connect("mongodb://mongo:27017/poc_opc");
    console.log("Connected to MongoDB");
    app.listen(3001, () => console.log("API server listening on port 3001"));
}
  
start();