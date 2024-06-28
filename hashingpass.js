const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configura la connessione al database PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'HR database',
    password: '1234',
    port: 5432
});

const updatePasswords = async () => {
  try {
    // Recupera tutti gli utenti dal database
    const { rows } = await pool.query('SELECT id, "Password" FROM public."HR"');
    
    for (const user of rows) {
      // Hash la password esistente
      const hashedPassword = await bcrypt.hash(user.Password, 10);

      // Aggiorna la password hashata nel database
      await pool.query('UPDATE public."HR" SET "Password" = $1 WHERE id = $2', [hashedPassword, user.id]);
      console.log(`Password aggiornata per l'utente con ID ${user.id}`);
      console.log(hashedPassword)
    }

    console.log('Tutte le password sono state aggiornate.');
  } catch (error) {
    console.error('Errore durante l\'aggiornamento delle password:', error);
  } finally {
    // Chiudi la connessione al database
    await pool.end();
  }
};

updatePasswords();
