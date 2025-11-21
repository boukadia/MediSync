const Creneau = require('../models/Creneau');

// Créer un nouveau créneau
const createCreneau = async (req, res) => {
  try {
    const creneau = new Creneau(req.body);
    await creneau.save();
    await creneau.populate(['disponibilite', 'medecin']);
    res.status(201).json(creneau);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les créneaux
const getAllCreneaux = async (req, res) => {
  try {
    const { statut, medecin } = req.query;
    
    let query = {};
    if (statut) query.statut = statut;
    if (medecin) query.medecin = medecin;

    const creneaux = await Creneau.find(query)
      .populate('disponibilite')
      .populate('medecin', 'name email')
      .sort({ heure_debut: 1 });
    
    res.json(creneaux);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un créneau par ID
const getCreneauByDisponibilite = async (req, res) => {
  try {
    const creneau = await Creneau.find({disponibilite:req.params.id})
      .populate('disponibilite')
      .populate('medecin', 'name email phone');
    
    if (!creneau) {
      return res.status(404).json({ error: 'Créneau introuvable' });
    }
    
   return res.json(creneau);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un créneau
const updateCreneau = async (req, res) => {
  try {
    const creneau = await Creneau.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['disponibilite', 'medecin']);
    
    if (!creneau) {
      return res.status(404).json({ error: 'Créneau introuvable' });
    }
    
    res.json(creneau);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un créneau
const deleteCreneau = async (req, res) => {
  try {
    const creneau = await Creneau.findByIdAndDelete(req.params.id);
    
    if (!creneau) {
      return res.status(404).json({ error: 'Créneau introuvable' });
    }
    
    res.json({ message: 'Créneau supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les créneaux libres
const getCreneauxLibres = async (req, res) => {
  try {
    const { medecin, date } = req.query;
    
    let query = { statut: 'libre' };
    if (medecin) query.medecin = medecin;
    
    const creneaux = await Creneau.find(query)
      .populate('disponibilite')
      .populate('medecin', 'name')
      .sort({ heure_debut: 1 });
    
    res.json(creneaux);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Réserver un créneau
const reserverCreneau = async (req, res) => {
  try {
    const creneau = await Creneau.findById(req.params.id);
    
    if (!creneau) {
      return res.status(404).json({ error: 'Créneau introuvable' });
    }
    
    if (creneau.statut === 'reserve') {
      return res.status(400).json({ error: 'Créneau déjà réservé' });
    }
    
    creneau.statut = 'reserve';
    await creneau.save();
    await creneau.populate(['disponibilite', 'medecin']);
    
    res.json({ message: 'Créneau réservé avec succès', creneau });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Libérer un créneau
const libererCreneau = async (req, res) => {
  try {
    const creneau = await Creneau.findById(req.params.id);
    
    if (!creneau) {
      return res.status(404).json({ error: 'Créneau introuvable' });
    }
    
    creneau.statut = 'libre';
    await creneau.save();
    await creneau.populate(['disponibilite', 'medecin']);
    
    res.json({ message: 'Créneau libéré avec succès', creneau });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCreneau,
  getAllCreneaux,
  getCreneauByDisponibilite,
  updateCreneau,
  deleteCreneau,
  getCreneauxLibres,
  reserverCreneau,
  libererCreneau
};