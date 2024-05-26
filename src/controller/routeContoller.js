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
const getNextProductId = async () => {
    try {
        const result = await pool.query('SELECT MAX(id) FROM PRODUCTS');
        const maxId = result.rows[0].max;
        return maxId ? maxId + 1 : 1;
    } catch (err) {
        throw err;
    }
};

export const createProduct = async (req, res) => {
    const { name, category, price, image, description } = req.body;

    try {
        const id = await getNextProductId();

        const result = await pool.query(
            'INSERT INTO PRODUCTS (id, name, category, price, image, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, name, category, price, image, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};