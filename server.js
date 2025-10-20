const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "CareFlow APffI is running!" });
});

// Routes
app.use('/api/auth', require('./routes/api/authRoutes'));
app.use('/api/appointments', require('./routes/api/appointmentRoutes'));
app.use('/api/disponibilites', require('./routes/api/disponibiliteRoutes'));
app.use('/api/consultations',require("./routes/api/consultationRoutes"));
app.use('/api/dossierMedical',require("./routes/api/dossierMedical"));
app.use('/api/users', require('./routes/api/userRoutes'));

// Database connection
const connectDB = require('./config/database');
connectDB();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CareFlow API',
      version: '1.0.0',
      description: 'Documentation de l\'API CareFlow',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur local',
      },
    ],
  },
  apis: ['./routes/api/*.js'], // Chemin vers vos fichiers de routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
