const {google} = require('googleapis');
//const { getHeapSpaceStatistics } = require('v8');
const keys = require('./keys.json');



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
        range: 'Sheet1!A1:D8'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;
    let newDataArray = dataArray.map(function(r){
        r.push(r[0] + '-' + r[1]);
        return r ;
    });
    console.log(newDataArray);
}