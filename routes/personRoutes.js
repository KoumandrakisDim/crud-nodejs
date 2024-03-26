const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Person } = require('../models');

// Create a new person
router.post('/', [
  check('firstName').notEmpty(),
  check('lastName').notEmpty(),
  check('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email } = req.body;
    const person = await Person.create({ firstName, lastName, email });
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Read list of persons
router.get('/', async (req, res) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Read single person by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a person
router.put('/:id', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    await person.update(req.body);
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a person
router.delete('/:id', async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    await person.destroy();
    res.json({ message: 'Person deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
