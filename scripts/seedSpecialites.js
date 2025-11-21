const mongoose = require('mongoose');
const Specialite = require('../models/Specialite');
require('dotenv').config();

// Données fictives pour les spécialités
const specialitesData = [
  {
    name: 'Cardiologie',
    description: 'Spécialité médicale qui s\'occupe des troubles du cœur et des vaisseaux sanguins'
  },
  {
    name: 'Dermatologie', 
    description: 'Médecine spécialisée dans le diagnostic et traitement des maladies de la peau'
  },
  {
    name: 'Neurologie',
    description: 'Spécialité médicale clinique qui étudie et traite les troubles du système nerveux'
  },
  {
    name: 'Pédiatrie',
    description: 'Branche de la médecine consacrée aux enfants et aux adolescents'
  },
  {
    name: 'Gynécologie',
    description: 'Spécialité médico-chirurgicale qui s\'occupe de l\'appareil génital féminin'
  },
  {
    name: 'Orthopédie',
    description: 'Spécialité chirurgicale qui concerne le traitement des affections de l\'appareil locomoteur'
  },
  {
    name: 'Psychiatrie',
    description: 'Spécialité médicale traitant de la maladie mentale et des troubles psychologiques'
  },
  {
    name: 'Ophtalmologie',
    description: 'Spécialité médico-chirurgicale consacrée aux maladies de l\'œil et de ses annexes'
  },
  {
    name: 'ORL',
    description: 'Oto-rhino-laryngologie : spécialité traitant les troubles de l\'oreille, du nez et de la gorge'
  },
  {
    name: 'Radiologie',
    description: 'Spécialité médicale qui utilise l\'imagerie médicale pour diagnostiquer et traiter'
  },
  {
    name: 'Anesthésie',
    description: 'Spécialité médicale visant à assurer l\'anesthésie et la réanimation des patients'
  },
  {
    name: 'Médecine Générale',
    description: 'Soins de santé primaires dispensés au premier contact avec le système de soins'
  },
  {
    name: 'Chirurgie Générale',
    description: 'Spécialité chirurgicale qui traite les affections chirurgicales de l\'abdomen'
  },
  {
    name: 'Endocrinologie',
    description: 'Spécialité médicale qui s\'occupe des troubles hormonaux et du système endocrinien'
  },
  {
    name: 'Gastroentérologie',
    description: 'Spécialité médicale qui s\'occupe du système digestif et de ses maladies'
  },
  {
    name: 'Urologie',
    description: 'Spécialité chirurgicale qui s\'intéresse à l\'appareil urinaire et à l\'appareil génital masculin'
  },
  {
    name: 'Pneumologie',
    description: 'Spécialité médicale traitant les maladies des poumons et de l\'appareil respiratoire'
  },
  {
    name: 'Rhumatologie',
    description: 'Spécialité médicale qui s\'intéresse aux troubles de l\'appareil locomoteur'
  },
  {
    name: 'Oncologie',
    description: 'Spécialité médicale d\'étude, de diagnostic et de traitement des cancers'
  },
  {
    name: 'Gériatrie',
    description: 'Spécialité médicale consacrée aux personnes âgées et au vieillissement'
  },
  {
    name: 'Hématologie',
    description: 'Spécialité médicale qui étudie le sang et ses maladies'
  },
  {
    name: 'Néphrologie',
    description: 'Spécialité médicale qui s\'occupe des maladies des reins'
  },
  {
    name: 'Chirurgie Plastique',
    description: 'Chirurgie de reconstruction et d\'amélioration esthétique'
  },
  {
    name: 'Médecine du Travail',
    description: 'Prévention des risques professionnels et surveillance de la santé au travail'
  },
  {
    name: 'Médecine d\'Urgence',
    description: 'Prise en charge des urgences médicales et chirurgicales'
  }
];

// Script pour créer les spécialités
const createSpecialites = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('🔗 Connecté à MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    console.log(`📋 Création de ${specialitesData.length} spécialités...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const specialiteData of specialitesData) {
      try {
        // Vérifier si la spécialité existe déjà
        const existingSpecialite = await Specialite.findOne({ 
          name: { $regex: new RegExp(`^${specialiteData.name}$`, 'i') } 
        });
        
        if (existingSpecialite) {
          console.log(`⚠️  Ignorée: ${specialiteData.name} (déjà existante)`);
          skippedCount++;
          continue;
        }

        // Créer la nouvelle spécialité
        const specialite = new Specialite(specialiteData);
        await specialite.save();
        
        console.log(`✅ Créée: ${specialiteData.name}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Erreur pour ${specialiteData.name}:`, error.message);
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RÉSUMÉ:');
    console.log(`   ✅ Spécialités créées: ${createdCount}`);
    console.log(`   ⚠️  Spécialités ignorées: ${skippedCount}`);
    console.log(`   📊 Total dans la BD: ${createdCount + skippedCount}`);
    console.log('🎉 Création terminée avec succès!');

  } catch (error) {
    console.error('💥 Erreur lors de la création des spécialités:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connexion fermée');
  }
};

// Script pour vider la table des spécialités
const clearSpecialites = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('🔗 Connecté à MongoDB');

    const count = await Specialite.countDocuments();
    await Specialite.deleteMany({});
    
    console.log(`🗑️  ${count} spécialités supprimées`);
    console.log('✨ Table Specialites vidée');

  } catch (error) {
    console.error('💥 Erreur lors de la suppression:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connexion fermée');
  }
};

// Script pour afficher les statistiques
const showStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medisync');
    console.log('🔗 Connecté à MongoDB');
    
    const total = await Specialite.countDocuments();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STATISTIQUES DES SPÉCIALITÉS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Nombre total de spécialités: ${total}`);
    
    if (total > 0) {
      console.log('\\n📝 Liste des spécialités:');
      const specialites = await Specialite.find().sort({ name: 1 });
      specialites.forEach((spec, index) => {
        console.log(`   ${index + 1}. ${spec.name}`);
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('💥 Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Connexion fermée');
  }
};

// Vérifier les arguments de ligne de commande
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'create':
  case 'seed':
    createSpecialites();
    break;
  case 'clear':
  case 'empty':
    clearSpecialites();
    break;
  case 'stats':
  case 'list':
    showStats();
    break;
  case 'reset':
    console.log('🔄 Reset: Vidage puis création...');
    clearSpecialites().then(() => {
      setTimeout(() => createSpecialites(), 1000);
    });
    break;
  default:
    console.log(`
🏥 SCRIPT SPÉCIALITÉS MÉDICALES

Usage: node scripts/seedSpecialites.js [command]

📋 Commandes disponibles:
  create/seed  - Créer les spécialités (ignore les doublons)
  clear/empty  - Vider la table des spécialités
  stats/list   - Afficher les statistiques et la liste
  reset        - Vider puis recréer toutes les spécialités

📝 Exemples:
  node scripts/seedSpecialites.js create
  node scripts/seedSpecialites.js stats
  node scripts/seedSpecialites.js reset
`);
}

module.exports = {
  createSpecialites,
  clearSpecialites,
  showStats
};