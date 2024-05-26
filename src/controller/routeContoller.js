import pool from '../db/db.js';

export const getProducts = async (req, res) => {
    const { category, search } = req.query;
    let query = 'SELECT * FROM PRODUCTS';
    const queryParams = [];

    if (category || search) {
        query += ' WHERE';
        if (category) {
            queryParams.push(category);
            query += ` category = $${queryParams.length}`;
        }
        if (search) {
            if (category) query += ' AND';
            queryParams.push(`%${search}%`);
            query += ` name ILIKE $${queryParams.length}`;
        }
    }

    try {
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProduct = async (req, res) => {
    const { name, category, price, image_path, description } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO PRODUCTS (name, category, price, image_path, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, category, price, image_path, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};