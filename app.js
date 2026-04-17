const express = require('express');
const fs = require('fs');

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello Express');
});


app.get('/api/users', (req, res) => {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur serveur');
    }
    res.json(JSON.parse(data));
  });
});


app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erreur serveur');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.id === id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  });
});


app.post('/api/users', (req, res) => {
  const newUser = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erreur serveur');

    const users = JSON.parse(data);

    // نعطيو id جديد
    newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    users.push(newUser);

    fs.writeFile('users.json', JSON.stringify(users), err => {
      if (err) return res.status(500).send('Erreur serveur');

      res.status(201).json(newUser);
    });
  });
});


app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erreur serveur');

    let users = JSON.parse(data);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).send('User not found');
    }

    users[index] = { ...users[index], ...updatedData };

    fs.writeFile('users.json', JSON.stringify(users), err => {
      if (err) return res.status(500).send('Erreur serveur');

      res.json(users[index]);
    });
  });
});


app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erreur serveur');

    let users = JSON.parse(data);
    const newUsers = users.filter(u => u.id !== id);

    fs.writeFile('users.json', JSON.stringify(newUsers), err => {
      if (err) return res.status(500).send('Erreur serveur');

      res.send('User deleted');
    });
  });
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});