const fs = require('fs');
const crypto = require('crypto-js');

// Leggi il contenuto del db.json
let jsonData = fs.readFileSync('users.json', 'utf8');

// Chiave e iv (per aes-256-cbc, la chiave deve essere di 32 caratteri)
const key = 'wfK.2+WJ@MRr~6[p%G0SI+~!0-pq[Zi_';
const iv = crypto.lib.WordArray.random(16);

// Cripta il contenuto usando AES-256-CBC
let encryptedData = crypto.AES.encrypt(jsonData, key, { iv: iv }).toString();

// Salva il contenuto criptato su un nuovo file o sovrascrivi db.json
fs.writeFileSync('db.json.enc', encryptedData);

console.log('File criptato con successo.');
