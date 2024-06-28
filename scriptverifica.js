const bcrypt = require('bcryptjs');

const password = '402P<;upb6yw';
const hashFromDatabase = '$2a$10$AUuXDauJoagHA9BjIfpxlegwAgRrDNEdFex4zRp6trkGvMps6dqEm'; // Hash reale dal database

// Hasha la password
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Errore durante l\'hashing della password:', err);
  } else {
    console.log('Password hashata:', hashedPassword);

    // Confronta l'hash generato con l'hash nel database
    bcrypt.compare(password, hashFromDatabase, (err, result) => {
      if (err) {
        console.error('Errore durante il confronto delle password:', err);
      } else {
        console.log('Confronto hash manuale, password valida:', result);
      }
    });
  }
});
