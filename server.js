require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});

// ===== AUTH ENDPOINTS =====
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2 LIMIT 1',
      [email, password]
    );
    
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING *',
      [email, password, name]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CUSTOMERS/CLIENTS ENDPOINTS =====
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        full_name as name,
        email,
        phone,
        address,
        city,
        created_at,
        created_by as "createdByUserId"
      FROM clients 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, email, address, city, createdByUserId } = req.body;
    const result = await pool.query(
      'INSERT INTO clients (full_name, phone, email, address, city, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, phone, email, address, city, createdByUserId]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        full_name as name,
        email,
        phone,
        address,
        city,
        created_at,
        created_by as "createdByUserId"
      FROM clients 
      WHERE id = $1
    `, [req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, phone, email, address, city } = req.body;
    const result = await pool.query(
      'UPDATE clients SET full_name = $1, phone = $2, email = $3, address = $4, city = $5 WHERE id = $6 RETURNING *',
      [name, phone, email, address, city, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== SERVICES ENDPOINTS =====
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.client_id as "customerId",
        s.appliance_id as "applianceId",
        s.technician_id as "technicianId",
        s.description,
        s.status,
        s.warranty_status as "warrantyStatus",
        s.created_at as "createdAt",
        s.scheduled_date as "scheduledDate",
        s.completed_date as "completedDate",
        s.technician_notes as "technicianNotes",
        s.cost,
        s.used_parts as "usedParts",
        s.machine_notes as "machineNotes",
        s.is_completely_fixed as "isCompletelyFixed",
        s.business_partner_id as "businessPartnerId",
        c.full_name as "customerName",
        a.model as "applianceModel",
        m.name as "applianceBrand"
      FROM services s 
      LEFT JOIN clients c ON s.client_id = c.id 
      LEFT JOIN appliances a ON s.appliance_id = a.id
      LEFT JOIN manufacturers m ON a.manufacturer_id = m.id
      ORDER BY s.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        c.full_name as "customerName",
        a.model as "applianceModel",
        m.name as "applianceBrand"
      FROM services s 
      LEFT JOIN clients c ON s.client_id = c.id 
      LEFT JOIN appliances a ON s.appliance_id = a.id
      LEFT JOIN manufacturers m ON a.manufacturer_id = m.id
      WHERE s.id = $1
    `, [req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { customerId, applianceId, description, status, technicianId } = req.body;
    const result = await pool.query(
      'INSERT INTO services (client_id, appliance_id, description, status, technician_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [customerId, applianceId, description, status || 'pending', technicianId]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { description, status, technicianNotes, cost, completedDate } = req.body;
    const result = await pool.query(
      `UPDATE services SET 
        description = COALESCE($1, description), 
        status = COALESCE($2, status), 
        technician_notes = COALESCE($3, technician_notes),
        cost = COALESCE($4, cost),
        completed_date = COALESCE($5, completed_date)
      WHERE id = $6 RETURNING *`,
      [description, status, technicianNotes, cost, completedDate, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== APPLIANCES ENDPOINTS =====
app.get('/api/appliances', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        c.full_name as "clientName"
      FROM appliances a
      LEFT JOIN clients c ON a.client_id = c.id
      ORDER BY a.id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== TECHNICIANS ENDPOINTS =====
app.get('/api/technicians', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM technicians ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FST Servis API is running' });
});

const PORT = 8082;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FST Servis Backend API running on port ${PORT}`);
  console.log(`Database connected: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'Not configured'}`);
});
