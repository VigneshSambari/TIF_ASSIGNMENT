//Format object removes and add fields as necessary
function removeUnwantedAtt(objectData){
    delete objectData._id;
    delete objectData.__v
    
    return objectData;
}

module.exports = {
    removeUnwantedAtt,
}