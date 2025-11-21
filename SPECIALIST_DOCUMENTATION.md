# Documentation du Modèle Specialist - MediSync

## Vue d'ensemble

Le modèle `Specialist` a été créé pour gérer spécifiquement les informations des médecins spécialistes dans le système MediSync. Il étend les fonctionnalités du modèle `User` en ajoutant des données spécialisées pour les professionnels de santé.

## Structure des fichiers

### Fichiers créés/modifiés :

1. **`models/Specialist.js`** - Modèle de données principal
2. **`controllers/specialistController.js`** - Contrôleur avec toutes les opérations CRUD
3. **`routes/api/specialistRoutes.js`** - Routes API avec validation
4. **`validators/specialistValidator.js`** - Validation des données d'entrée
5. **`scripts/migrateSpecialists.js`** - Script de migration pour les docteurs existants
6. **`server.js`** - Ajout des routes spécialistes

## Modèle de données (Specialist.js)

### Champs principaux :

```javascript
{
  userId: ObjectId,              // Référence vers User (doctor)
  specialite: String,            // Spécialité médicale (enum)
  numLicence: String,            // Numéro de licence médicale (unique)
  anneExperience: Number,        // Années d'expérience
  diplomes: Array,              // Diplômes obtenus
  certifications: Array,        // Certifications professionnelles
  horaires: Map,                // Horaires de travail par jour
  tarifConsultation: Number,    // Tarif de consultation
  dureeConsultation: Number,    // Durée standard d'une consultation
  accepteUrgence: Boolean,      // Accepte les urgences
  consultationEnLigne: Boolean, // Propose consultations en ligne
  presentation: String,         // Présentation personnelle
  langues: Array,              // Langues parlées
  rating: Object,              // Note moyenne et nombre d'avis
  status: String               // Statut (actif/inactif/suspendu)
}
```

### Spécialités disponibles :
- Cardiologie
- Dermatologie
- Endocrinologie
- Gastroenterologie
- Gynecologie
- Neurologie
- Ophtalmoloqie
- Orthopedia
- Pediatrie
- Psychiatrie
- Radiologie
- Urologie
- Medecine_Generale
- Chirurgie_Generale
- Anesthesie
- ORL

## API Endpoints

### Routes publiques :
- `GET /api/specialists` - Liste des spécialistes avec filtres
- `GET /api/specialists/:id` - Détails d'un spécialiste
- `GET /api/specialists/:id/availability` - Disponibilités d'un spécialiste

### Routes protégées (Admin) :
- `POST /api/specialists` - Créer un spécialiste
- `PUT /api/specialists/:id` - Modifier un spécialiste
- `DELETE /api/specialists/:id` - Supprimer un spécialiste

### Routes pour docteurs :
- `GET /api/specialists/user/:userId` - Profil spécialiste par userId
- `GET /api/specialists/:id/stats` - Statistiques d'un spécialiste

## Paramètres de filtrage

### GET /api/specialists

```javascript
{
  specialite: 'Cardiologie',     // Filtrer par spécialité
  ville: 'Casablanca',          // Filtrer par ville (dans User.address)
  rating: 4,                    // Rating minimum
  page: 1,                      // Page (pagination)
  limit: 10                     // Nombre par page
}
```

## Exemples d'utilisation

### 1. Créer un spécialiste

```javascript
POST /api/specialists
Authorization: Bearer <admin_token>

{
  "userId": "674a1b2c3d4e5f6789012345",
  "specialite": "Cardiologie",
  "numLicence": "CARD12345",
  "anneExperience": 10,
  "tarifConsultation": 500,
  "dureeConsultation": 45,
  "accepteUrgence": true,
  "consultationEnLigne": true,
  "presentation": "Cardiologue expérimenté spécialisé en cardiologie interventionnelle.",
  "langues": ["Francais", "Arabe", "Anglais"],
  "diplomes": [{
    "nom": "Doctorat en Médecine",
    "institution": "Faculté de Médecine de Rabat",
    "anneeObtention": 2010
  }],
  "horaires": {
    "lundi": {
      "debut": "09:00",
      "fin": "17:00",
      "pause": { "debut": "12:00", "fin": "14:00" }
    }
  }
}
```

### 2. Rechercher des spécialistes

```javascript
GET /api/specialists?specialite=Cardiologie&ville=Casablanca&rating=4&page=1&limit=10

Response:
{
  "specialists": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 3. Obtenir les statistiques d'un spécialiste

```javascript
GET /api/specialists/:id/stats
Authorization: Bearer <doctor_token>

Response:
{
  "stats": {
    "totalAppointments": 156,
    "appointmentsThisMonth": 23,
    "appointmentsByStatus": [...],
    "upcomingAppointments": [...],
    "rating": {
      "moyenne": 4.2,
      "nombreAvis": 45
    }
  }
}
```

## Migration des données existantes

Pour migrer les docteurs existants vers le système de spécialistes :

```bash
# Créer les profils spécialistes pour tous les docteurs
node scripts/migrateSpecialists.js migrate

# Voir les statistiques
node scripts/migrateSpecialists.js stats

# Nettoyer les spécialistes orphelins
node scripts/migrateSpecialists.js cleanup
```

## Validation des données

Le système utilise `express-validator` pour valider :

- **userId** : Doit être un ObjectId valide et référencer un User avec role='doctor'
- **specialite** : Doit être dans la liste des spécialités autorisées
- **numLicence** : Doit être unique et entre 3-20 caractères
- **anneExperience** : Entre 0 et 50 ans
- **tarifConsultation** : Nombre positif
- **dureeConsultation** : Entre 15 et 120 minutes
- **langues** : Tableau de langues valides
- **rating** : Entre 0 et 5

## Relation avec d'autres modèles

### Liens existants :
- **User** : Un spécialiste est lié à un utilisateur avec role='doctor'
- **Appointment** : Les rendez-vous utilisent doctorId (User._id)
- **Consultation** : Les consultations référencent medecin (User._id)
- **Disponibilite** : Les disponibilités référencent medecin (User._id)

### Intégration recommandée :
Pour utiliser pleinement le système de spécialistes, il faudrait :

1. Modifier les contrôleurs existants pour utiliser les données Specialist
2. Ajouter des endpoints pour gérer les horaires et disponibilités via Specialist
3. Implémenter le système de rating/avis
4. Ajouter la recherche géographique avancée

## Permissions et sécurité

### Rôles et permissions :
- **Admin** : Peut créer, modifier, supprimer tous les spécialistes
- **Doctor** : Peut consulter et modifier son propre profil spécialiste
- **Patient** : Peut consulter les profils publics des spécialistes
- **Public** : Peut rechercher et voir les informations de base

### Middleware utilisés :
- `auth` : Authentification requise
- `checkPermission` : Vérification des permissions par rôle
- Validation complète des données d'entrée

## Installation et utilisation

1. **Installer les dépendances** (si pas déjà fait) :
   ```bash
   npm install express-validator
   ```

2. **Démarrer le serveur** :
   ```bash
   npm start
   ```

3. **Migrer les données existantes** :
   ```bash
   node scripts/migrateSpecialists.js migrate
   ```

4. **Tester l'API** :
   ```bash
   # Obtenir tous les spécialistes
   GET http://localhost:3000/api/specialists
   
   # Rechercher des cardiologues
   GET http://localhost:3000/api/specialists?specialite=Cardiologie
   ```

## Prochaines étapes

1. Implémenter un système de notation/avis patients
2. Ajouter la géolocalisation pour la recherche par proximité
3. Créer des vues spécialisées pour les différents types de consultations
4. Intégrer avec le système de paiement
5. Ajouter des notifications push pour les spécialistes

## Support et maintenance

- **Tests** : Ajouter des tests unitaires et d'intégration
- **Documentation API** : Intégrer avec Swagger
- **Monitoring** : Ajouter des logs pour les opérations critiques
- **Backup** : S'assurer que les données spécialistes sont sauvegardées

---

Cette documentation couvre l'ensemble du système Specialist créé pour MediSync. Le système est maintenant prêt pour l'utilisation en production avec toutes les fonctionnalités de base implémentées.