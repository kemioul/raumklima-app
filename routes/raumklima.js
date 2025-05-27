const express = require('express');
const router = express.Router();
const { Temperatur, Feuchtigkeit } = require('../models');

router.get('/', async (req, res) => {
  try {
    const temperaturDaten = await Temperatur.findAll({ order: [['createdAt', 'DESC']] });
    const feuchtigkeitsDaten = await Feuchtigkeit.findAll({ order: [['createdAt', 'DESC']] });
    res.render('index', { temperaturDaten, feuchtigkeitsDaten });
  } catch (err) {
    res.status(500).send('Fehler beim Laden der Raumdaten');
  }
});

module.exports = router;
