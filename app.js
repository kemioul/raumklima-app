const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const PORT = 3000;

const { Temperatur, Feuchtigkeit, sequelize } = require('./models');
const raumklimaRoute = require('./routes/raumklima');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/raumklima', raumklimaRoute);

// GET – API endpoint pre zobrazenie všetkých teplôt
app.get('/temperatur', async (req, res) => {
  try {
    const daten = await Temperatur.findAll();
    res.json(daten);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Temperaturdaten.' });
  }
});

// POST – vytvorenie novej teploty
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
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Speichern der Temperatur.' });
  }
});

// GET – API endpoint pre zobrazenie všetkých vlhkostí
app.get('/feuchtigkeit', async (req, res) => {
  try {
    const daten = await Feuchtigkeit.findAll();
    res.json(daten);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Feuchtigkeitsdaten.' });
  }
});

// POST – vytvorenie novej vlhkosti
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
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Speichern der Feuchtigkeit.' });
  }
});

sequelize.sync().then(() => {
  console.log('Datenbanken synchronisiert');
  app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });
});
