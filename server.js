const {google} = require('googleapis');
const fs = require("fs");
const express = require('express')
const app = express();
const cors = require('cors');
const PORT = 8000;
//const { getHeapSpaceStatistics } = require('v8');
const keys = require(__dirname + '/data/keys.json');


app.get("/",  (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


// JWT=  json web token
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);


client.authorize(function(err, tokens){

    if(err){
        console.log(err);
        return;
    } else {
        console.log('Connected');
        gsrun(client);
    }

});



// User input 
let primaryKey = 'Raymond';
let line_item = 'Line_Item';
let cost = 'Cost';



// cl == client, access the cleint here
async function gsrun(client){

    const gsapi = google.sheets({version:'v4', auth: client});

    // create an object called opt with certain info in it
    const opt = {
        // Eric's spreadsheet test
        // spreadsheetId: '1Q9_cVWL0inbHybN9nNllhTFdj0ZpGRc3dY3txP8nS5s',
        // My spreadsheet
        spreadsheetId: '16vAB0L9icNsqY_OT7y7KEiCB_YvTp2SVdtTyBXhaHB0',
        // range: 'Sheet1!E10:E14'
        range: 'Sheet1!A1:Z1000',

        // Changing the output from each row to columns --> helps me parse by index! 
        majorDimension: 'COLUMNS'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    // I can remove this function. Seems a bit redundnat for this use case to add another column! 
    let newDataArray = dataArray.map(function(r){
        r.push(r[0] + '-' + r[1]);
        return r ;
    });
    console.table(newDataArray);

    // for (let i = 0; i < newDataArray.length; i++){
    //     console.log( "Current Index: "+ i + "\n" + newDataArray[i]);
    // }
        
    //console.table(newDataArray);

    // Grab all the values in the first column (since our data is mutated it should only be the headers!)
    var headers = newDataArray.map(cell => cell[0]);
    console.log(headers);
    // Split each name, I should save each name so that the user can click or use a drop down menu to select which one they want to use
    // E.g. Which one is the primary key?
    // which one is their line items (maybe they call it something else)
    // And which one is their cost figures they want to charge to the client
    headers.forEach(header => console.log(header));
    

}



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


