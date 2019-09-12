const { Client } = require('pg');
const fs = require('fs');
const client = new Client();

let rawdata = fs.readFileSync('sample.json');
let sampleData = JSON.parse(rawdata);
console.log(JSON.stringify(sampleData));

async function insertRow(r) {
    const res = await  client.query('INSERT INTO park_meter(isOccupied, timestamp, meter) VALUES($1, $2, $3);', 
                        [r.isOccupied, r.timestamp, r.meter]);
    // console.log(res.rows[0]);
}

async function start() {
    try {
        await client.connect();
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
        await client.query('CREATE TABLE IF NOT EXISTS park_meter ( \
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(), \
            isOccupied boolean NOT NULL, \
            timestamp integer NOT NULL, \
            meter JSON \
        );');

        for (let i = 0; i < sampleData.length; i++) {
            await insertRow(sampleData[i]);
        }

        await client.end();        
    } catch (error) {
        console.error(error.message);        
    }
}

start();
