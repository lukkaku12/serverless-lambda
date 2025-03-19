const { Pool } = require("pg");

// Configuración de PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Crear un contacto
module.exports.createContact = async (event) => {
  const { name, email } = JSON.parse(event.body);
  
  const client = await pool.connect();
  await client.query("INSERT INTO contacts (name, email) VALUES ($1, $2)", [name, email]);
  client.release();

  return { statusCode: 201, body: JSON.stringify({ message: "Contacto creado" }) };
};

// Obtener un contacto
module.exports.getContact = async (event) => {
  const { id } = event.pathParameters;

  const client = await pool.connect();
  const result = await client.query("SELECT * FROM contacts WHERE id = $1", [id]);
  client.release();

  if (result.rows.length === 0) {
    return { statusCode: 404, body: JSON.stringify({ message: "No encontrado" }) };
  }

  return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
};

// Actualizar un contacto
module.exports.updateContact = async (event) => {
  const { id } = event.pathParameters;
  const { name, email } = JSON.parse(event.body);

  const client = await pool.connect();
  await client.query("UPDATE contacts SET name = $1, email = $2 WHERE id = $3", [name, email, id]);
  client.release();

  return { statusCode: 200, body: JSON.stringify({ message: "Contacto actualizado" }) };
};

// Eliminar un contacto
module.exports.deleteContact = async (event) => {
  const { id } = event.pathParameters;

  const client = await pool.connect();
  await client.query("DELETE FROM contacts WHERE id = $1", [id]);
  client.release();

  return { statusCode: 200, body: JSON.stringify({ message: "Contacto eliminado" }) };
};