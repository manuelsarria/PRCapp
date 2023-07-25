const express = require('express');
const app = express();
const port = 4000;
const db = require('./db');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json());

// Ruta para acceder a la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Método para agregar un nuevo trackingnumber a la tabla y actualizar el deliverydate automáticamente
app.post('/add', (req, res) => {
  const { trackingnumber } = req.body;
  const deliverydate = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato 'YYYY-MM-DD'
  const shipmentdate = null; // No establecemos el shipmentdate en este momento

  const sql = 'INSERT INTO tracking (trackingnumber, deliverydate, shipmentdate) VALUES (?, ?, ?)';

  db.query(sql, [trackingnumber, deliverydate, shipmentdate], (err, result) => {
    if (err) {
      console.error('Error al agregar el trackingnumber:', err);
      res.status(500).json({ message: 'Error al agregar el trackingnumber' });
    } else {
      res.status(201).json({ message: 'El trackingnumber se ha agregado correctamente' });
    }
  });
});

// Método para agregar varios tracking numbers a la tabla
app.post('/add-all', (req, res) => {
  const { trackingnumbers } = req.body;
  const deliverydate = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato 'YYYY-MM-DD'
  const shipmentdate = null; // No establecemos el shipmentdate en este momento

  // Mapeamos los trackingnumbers para crear un array de valores para cada tracking number
  const values = trackingnumbers.map((trackingnumber) => [
    trackingnumber,
    deliverydate,
    shipmentdate,
  ]);

  const sql = 'INSERT INTO tracking (trackingnumber, deliverydate, shipmentdate) VALUES ?';

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error al agregar los trackingnumbers:', err);
      res.status(500).json({ message: 'Error al agregar los trackingnumbers' });
    } else {
      res.status(201).json({ message: 'Los trackingnumbers se han agregado correctamente' });
    }
  });
});

// Método para consultar el estado de un trackingnumber
app.get('/tracking/:trackingnumber', (req, res) => {
  const { trackingnumber } = req.params;
  const sql = 'SELECT * FROM tracking WHERE trackingnumber = ?';

  db.query(sql, [trackingnumber], (err, result) => {
    if (err) {
      console.error('Error al consultar el trackingnumber:', err);
      res.status(500).json({ message: 'Error al consultar el trackingnumber' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'El paquete no ha sido entregado' });
    } else {
      const packageInfo = result[0];
      if (packageInfo.deliverydate && packageInfo.shipmentdate) {
        res.status(200).json({
          message: 'El paquete ha sido embarcado y entregado',
          deliverydate: packageInfo.deliverydate,
          shipmentdate: packageInfo.shipmentdate,
        });
      } else if (packageInfo.deliverydate) {
        res.status(200).json({
          message: 'El paquete ha sido entregado en Bodega',
          deliverydate: packageInfo.deliverydate,
        });
      } else {
        res.status(200).json({ message: 'El paquete no ha sido entregado' });
      }
    }
  });
});

// Método para obtener los trackingnumbers con deliverydate pero sin shipmentdate
function getTrackingNumbersWithoutShipmentDate(callback) {
  const sql =
    'SELECT trackingnumber FROM tracking WHERE deliverydate IS NOT NULL AND shipmentdate IS NULL';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener los trackingnumbers sin shipmentdate:', err);
      callback([]);
    } else {
      const trackingNumbersWithoutShipmentDate = result.map((row) => row.trackingnumber);
      callback(trackingNumbersWithoutShipmentDate);
    }
  });
}

// Método para actualizar el shipmentdate en aquellos tracking numbers sin shipmentdate
app.put('/update/shipmentdate', (req, res) => {
  getTrackingNumbersWithoutShipmentDate((trackingNumbersWithoutShipmentDate) => {
    if (trackingNumbersWithoutShipmentDate.length === 0) {
      res.status(200).json({ message: 'No hay tracking numbers sin shipmentdate para actualizar' });
    } else {
      const sql = 'UPDATE tracking SET shipmentdate = CURRENT_DATE() WHERE trackingnumber IN (?)';

      db.query(sql, [trackingNumbersWithoutShipmentDate], (err, result) => {
        if (err) {
          console.error('Error al actualizar el shipmentdate:', err);
          res.status(500).json({ message: 'Error al actualizar el shipmentdate' });
        } else {
          res.status(200).json({ message: 'El shipmentdate se ha actualizado correctamente' });
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
