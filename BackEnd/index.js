//Backend-index.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
// Creating a MySQL database connection:
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error", err);
    } else {
        console.log("Connected to database");
    }
});

app.use('/home', (req, res) => {
    res.json("Hi, this is done");
});

app.post('/api/employees', (req, res) => {
    try {
        const {
            emp_id,
            first_name,
            last_name,
            contact_no,
            email,
            dob,
            address,
        } = req.body;

        // Insert data into the database
        const insertQuery = `
            INSERT INTO employees (emp_id, first_name, last_name, contact_no, email, dob, address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const insertValues = [
            emp_id,
            first_name,
            last_name,
            contact_no,
            email,
            dob,
            address,
        ];

        db.query(insertQuery, insertValues, (insertError, insertResults) => {
            if (insertError) {
                console.error('Error inserting data:', insertError);
                res.status(500).json({ error: 'An error occurred while inserting data.' });
            } else {
                const insertedId = insertResults.insertId;
                // Fetch the inserted data
                const fetchQuery = `
                    SELECT * FROM employees WHERE emp_id = ?
                `;

                db.query(fetchQuery, [insertedId], (fetchError, fetchResults) => {
                    if (fetchError) {
                        console.error('Error fetching data:', fetchError);
                        res.status(500).json({ error: 'An error occurred while fetching data.' });
                    } else {
                        const fetchedData = fetchResults[0];
                        res.json({ status: 'success', data: fetchedData });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error inserting/fetching data:', error);
        res.status(500).json({ error: 'An error occurred while inserting/fetching data.' });
    }
});
app.get('/api/employees', (req, res) => {
    try {
        // Fetch all data from the database
        const fetchAllQuery = `
            SELECT * FROM employees
        `;

        db.query(fetchAllQuery, (fetchError, fetchResults) => {
            if (fetchError) {
                console.error('Error fetching data:', fetchError);
                res.status(500).json({ error: 'An error occurred while fetching data.' });
            } else {
                const fetchedData = fetchResults;
                res.json({ status: 'success', data: fetchedData });
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.get('/api/employees/:id', (req, res) => {
    try {
      const empId = req.params.id;
  
      // Fetch the employee data by ID from the database
      const fetchByIdQuery = `
        SELECT * FROM employees WHERE emp_id = ?
      `;
  
      db.query(fetchByIdQuery, [empId], (fetchError, fetchResults) => {
        if (fetchError) {
          console.error('Error fetching data by ID:', fetchError);
          res.status(500).json({ error: 'An error occurred while fetching data by ID.' });
        } else {
          const fetchedData = fetchResults[0];
          res.json(fetchedData);
        }
      });
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      res.status(500).json({ error: 'An error occurred while fetching data by ID.' });
    }
  });

  app.delete('/api/employees/:id', (req, res) => {
    try {
        const empId = req.params.id;

        // Delete the employee record from the database
        const deleteQuery = `
            DELETE FROM employees WHERE emp_id = ?
        `;

        db.query(deleteQuery, [empId], (deleteError, deleteResults) => {
            if (deleteError) {
                console.error('Error deleting data by ID:', deleteError);
                res.status(500).json({ error: 'An error occurred while deleting data by ID.' });
            } else {
                res.json({ status: 'success', message: 'Employee deleted successfully.' });
            }
        });
    } catch (error) {
        console.error('Error deleting data by ID:', error);
        res.status(500).json({ error: 'An error occurred while deleting data by ID.' });
    }
});

// Add this route to your index.js for updating an employee
app.put('/api/employees/:id', (req, res) => {
  try {
    const empId = req.params.id;
    const {
      emp_id,
      first_name,
      last_name,
      contact_no,
      email,
      dob,
      address,
    } = req.body;

    // Update data in the database
    const updateQuery = `
      UPDATE employees
      SET emp_id=?, first_name=?, last_name=?, contact_no=?, email=?, dob=?, address=?
      WHERE emp_id=?
    `;

    const updateValues = [
      emp_id,
      first_name,
      last_name,
      contact_no,
      email,
      dob,
      address,
      empId, // Use empId as the WHERE condition
    ];

    db.query(updateQuery, updateValues, (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating data:', updateError);
        res.status(500).json({ error: 'An error occurred while updating data.' });
      } else {
        res.json({ status: 'success', message: 'Employee updated successfully.' });
      }
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred while updating data.' });
  }
});


app.post('/login', (req, res) => {
  const { UserName, Password } = req.body;
  
  const sql = 'SELECT * FROM employees WHERE first_name = ? AND dob = ?';
  const values = [UserName, Password];
  console.log(values);
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error checking credentials: ', err);
      res.status(500).json({ message: 'Error checking credentials' });
    } else {
      console.log(results);
      if (results.length > 0) {
       
        const token = jwt.sign({ username: UserName }, secretKey, { expiresIn: '1h' }); 

        res.json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ message: 'Login unsuccessful. Wrong username or password' });
      }
    }
  });
});

app.post('/get-user-info', (req, res) => {
  const { username, dob } = req.body;

  const sql = 'SELECT * FROM employees WHERE first_name = ? AND dob = ?';
  const values = [username, dob];
  console.log(values);
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching user data: ', err);
      res.status(500).json({ message: 'Error fetching user data' });
    } else {
      if (results.length > 0) {
        // User found, send user data
        const user = results[0];
        console.log(user);
        res.status(200).json(user);
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

  

  
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
