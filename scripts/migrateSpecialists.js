const mongoose = require('mongoose');
const User = require('../models/User');
const Specialist = require('../models/Specialite');
require('dotenv').config();

// Script de migration pour créer des profils spécialistes pour les docteurs existants
const migrateExistingDoctors = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('Connecté à MongoDB');

    // Trouver tous les utilisateurs avec le rôle 'doctor'
    const doctors = await User.find({ role: 'doctor' });
    console.log(`Trouvé ${doctors.length} docteurs`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const doctor of doctors) {
      try {
        // Vérifier si le spécialiste existe déjà
        const existingSpecialist = await Specialist.findOne({ userId: doctor._id });
        
        if (existingSpecialist) {
          console.log(`Spécialiste déjà existant pour ${doctor.name}`);
          skippedCount++;
          continue;
        }

        // Créer un nouveau spécialiste
        const specialistData = {
          userId: doctor._id,
          specialite: doctor.specialite || 'Medecine_Generale',
          numLicence: doctor.numLicence || `LIC${doctor._id.toString().slice(-8)}`,
          anneExperience: doctor.anneExperience || 1,
          tarifConsultation: 300, // Tarif par défaut en MAD
          dureeConsultation: 30,
          accepteUrgence: false,
          consultationEnLigne: false,
          presentation: `Dr. ${doctor.name} - Spécialiste en ${doctor.specialite || 'Médecine Générale'}`,
          langues: ['Francais', 'Arabe'],
          horaires: {
            lundi: { debut: '09:00', fin: '17:00', pause: { debut: '12:00', fin: '14:00' } },
            mardi: { debut: '09:00', fin: '17:00', pause: { debut: '12:00', fin: '14:00' } },
            mercredi: { debut: '09:00', fin: '17:00', pause: { debut: '12:00', fin: '14:00' } },
            jeudi: { debut: '09:00', fin: '17:00', pause: { debut: '12:00', fin: '14:00' } },
            vendredi: { debut: '09:00', fin: '17:00', pause: { debut: '12:00', fin: '14:00' } }
          },
          status: 'actif'
        };

        const specialist = new Specialist(specialistData);
        await specialist.save();
        
        console.log(`✅ Spécialiste créé pour ${doctor.name}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Erreur lors de la création du spécialiste pour ${doctor.name}:`, error.message);
      }
    }

    console.log('\n=== RÉSUMÉ DE LA MIGRATION ===');
    console.log(`Spécialistes créés: ${createdCount}`);
    console.log(`Spécialistes ignorés (déjà existants): ${skippedCount}`);
    console.log('Migration terminée');

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
};

// Script pour nettoyer les spécialistes orphelins (sans utilisateur associé)
const cleanupOrphanedSpecialists = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('Connecté à MongoDB pour nettoyage');

    const specialists = await Specialist.find().populate('userId');
    let deletedCount = 0;

    for (const specialist of specialists) {
      if (!specialist.userId || specialist.userId.role !== 'doctor') {
        await Specialist.findByIdAndDelete(specialist._id);
        console.log(`🗑️  Spécialiste orphelin supprimé: ${specialist._id}`);
        deletedCount++;
      }
    }

    console.log(`Spécialistes orphelins supprimés: ${deletedCount}`);

  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Fonction pour afficher les statistiques
const showStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('=== STATISTIQUES ===');
    
    const doctorsCount = await User.countDocuments({ role: 'doctor' });
    const specialistsCount = await Specialist.countDocuments();
    
    console.log(`Nombre de docteurs: ${doctorsCount}`);
    console.log(`Nombre de spécialistes: ${specialistsCount}`);
    
    // Statistiques par spécialité
    const specialtiesCounts = await Specialist.aggregate([
      { $group: { _id: '$specialite', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nRépartition par spécialité:');
    specialtiesCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count}`);
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'migrate':
    migrateExistingDoctors();
    break;
  case 'cleanup':
    cleanupOrphanedSpecialists();
    break;
  case 'stats':
    showStats();
    break;
  default:
    console.log(`
Usage: node scripts/migrateSpecialists.js [command]

Commands:
  migrate  - Créer des profils spécialistes pour les docteurs existants
  cleanup  - Supprimer les spécialistes orphelins
  stats    - Afficher les statistiques

Exemples:
  node scripts/migrateSpecialists.js migrate
  node scripts/migrateSpecialists.js stats
`);
}

module.exports = {
  migrateExistingDoctors,
  cleanupOrphanedSpecialists,
  showStats
};