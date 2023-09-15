//Format object removes and add fields as necessary
function removeUnwantedAtt(objectData){
    objectData.mongodb_id = objectData._id;
    delete objectData._id;
    delete objectData.__v
    
    return objectData;
}

module.exports = {
    removeUnwantedAtt,
}