const Node = require("../models/Node");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongoose");
require("dotenv").config();
// handle errors

module.exports.create_node = async (req, res) => {

    const {buildName, owner} = req.body;
    console.log("Create node:", buildName, owner);
    let status = 'deploy in progress'
    try{
        const node = await Node.create({buildName,owner,status});
            res.status(201).json({ 
                id: node._id,
                
            });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't creade node!"})
    }
}

module.exports.populate_node = async (req, res) => {
    // -code
    // -imageId (same as the folder path)
    // -containerId
    const {docId, code, imageId, containerId} = req.body;

    console.log("->> Update Node doc:",docId, code, imageId, containerId);

    try{
        const doc = await Node.findByIdAndUpdate(
            docId,
            {
                code,
                imageId,
                containerId,
                status: 'deploy completed'
            })
        res.status(200).json({ 
            containerId
        });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't update node!"})
    }
}

module.exports.get_user_nodes = async (req, res) => {
    // /get-user-nodes
    const {owner} = req.body;

    console.log("->> Owner to extract nodes:",owner);
    try{
        const doc = await Node.find({owner})
        
        console.log("DB resp mongoose:", doc)
        let extractNodesData = []
        doc.forEach((el)=>{
            console.log("iterate:",el)
            console.log("core:", el._id)
            console.log("name:", el.buildName)
            console.log("status:", el.status)
            extractNodesData.push({
                id:el._id,
                buildName: el.buildName,
                status: el.status
            })
        })

        console.log("extraced:",extractNodesData)

        res.status(200).json({ 
            nodes: extractNodesData
        });
    }
    catch(e)
    {
        res.status(400).send({test: "Can't update node!"})
    }
}