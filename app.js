const express = require('express');
const path = require('path');
const app = express();

const { Temperatur, Feuchtigkeit, sequelize } = require('./models');
const raumklimaRoute = require('./routes/raumklima');

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/raumklima', raumklimaRoute);

app.get('/temperatur', async (req, res) => {
  try {
    const daten = await Temperatur.findAll();
    res.json(daten);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Temperaturdaten.' });
  }
});

app.post('/temperatur', async (req, res) => {
  const temperatur = parseFloat(req.body.temperatur);
  if (isNaN(temperatur)) {
    return res.status(400).send('Ungültige Temperatur');
  }

  try {
    await Temperatur.create({ wert: temperatur });

    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      return res.redirect('/raumklima');
    }

    res.json({ message: `Temperatur ${temperatur} gespeichert.` });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Temperatur.' });
  }
});

app.get('/feuchtigkeit', async (req, res) => {
  try {
    const daten = await Feuchtigkeit.findAll();
    res.json(daten);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Feuchtigkeitsdaten.' });
  }
});

app.post('/feuchtigkeit', async (req, res) => {
  const feuchtigkeit = parseFloat(req.body.feuchtigkeit);
  if (isNaN(feuchtigkeit)) {
    return res.status(400).send('Ungültige Feuchtigkeit');
  }

  try {
    await Feuchtigkeit.create({ wert: feuchtigkeit });

    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      return res.redirect('/raumklima');
    }

    res.json({ message: `Feuchtigkeit ${feuchtigkeit} gespeichert.` });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern der Feuchtigkeit.' });
  }
});

sequelize.sync().then(() => {
  console.log('Datenbanken synchronisiert');
  app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });
});
