const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HR database',
  password: '1234',
  port: 5432
});

const secretKey = 'your-secret-key';

// Funzione per hash della password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Funzione per confrontare la password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generazione del token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.Email, nome: user.Nome, ruolo: user.Ruolo }, secretKey, { expiresIn: '1h' });
};

// Middleware per verificare il token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    req.user = decoded;
    next();
  });
};

// Rotta di login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', req.body);

  try {
    const { rows } = await pool.query('SELECT * FROM public."HR" WHERE "Email" = $1', [email]);

    if (rows.length === 0) {
      console.log('User not found');
      return res.status(400).send('User not found');
    }

    const user = rows[0];
    console.log('User found:', user);

    const isValidPassword = await comparePassword(password, user.Password);
    console.log('Password ricevuta:', password);
    console.log('Password nel database:', user.Password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(400).send('Invalid password');
    }

    const token = generateToken(user);
    res.json({ token, nome: user.Nome, ruolo: user.Ruolo });
    console.log('Login successful, token generated:', token);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});

// Rotte protette
app.get('/users', verifyToken, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM public."HR"');
  res.json(rows);
});

app.get('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM public."HR" WHERE id = $1', [id]);
  res.json(rows[0]);
});

app.post('/users', verifyToken, async (req, res) => {
  const { nome, cognome, email, password, ruolo } = req.body;
  const hashedPassword = await hashPassword(password);
  const { rows } = await pool.query(
    'INSERT INTO public."HR" ("Nome", "Cognome", "Email", "Password", "Ruolo") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cognome, email, hashedPassword, ruolo]
  );
  res.json(rows[0]);
});

app.put('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nome, cognome, email, password, ruolo } = req.body;
  const hashedPassword = await hashPassword(password);
  const { rows } = await pool.query(
    'UPDATE public."HR" SET "Nome" = $1, "Cognome" = $2, "Email" = $3, "Password" = $4, "Ruolo" = $5 WHERE id = $6 RETURNING *',
    [nome, cognome, email, hashedPassword, ruolo, id]
  );
  res.json(rows[0]);
});

app.delete('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM public."HR" WHERE id = $1', [id]);
  res.json({ message: 'User deleted' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
