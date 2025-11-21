const Specialite = require('../models/Specialite');

// Créer une nouvelle spécialité
const createSpecialite = async (req, res) => {
  try {
    const specialite = new Specialite(req.body);
    await specialite.save();
    res.status(201).json(specialite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir toutes les spécialités
const getAllSpecialites = async (req, res) => {
  try {
    const specialites = await Specialite.find().sort({ name: 1 });
    res.json(specialites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une spécialité par ID
const getSpecialiteById = async (req, res) => {
  try {
    const specialite = await Specialite.findById(req.params.id);
    if (!specialite) {
      return res.status(404).json({ error: 'Spécialité introuvable' });
    }
    res.json(specialite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une spécialité
const updateSpecialite = async (req, res) => {
  try {
    const specialite = await Specialite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!specialite) {
      return res.status(404).json({ error: 'Spécialité introuvable' });
    }
    res.json(specialite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une spécialité
const deleteSpecialite = async (req, res) => {
  try {
    const specialite = await Specialite.findByIdAndDelete(req.params.id);
    if (!specialite) {
      return res.status(404).json({ error: 'Spécialité introuvable' });
    }
    res.json({ message: 'Spécialité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSpecialite,
  getAllSpecialites,
  getSpecialiteById,
  updateSpecialite,
  deleteSpecialite
};