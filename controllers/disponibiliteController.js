const Disponibilite = require('../models/Disponibilite')
const User = require('../models/User');
const Creneau = require('../models/Creneau');
const moment = require('moment'); // Assurez-vous d'installer moment: npm install moment



exports.getDisponibilites=async(req,res)=>{
   try {
    const disponibilites=await Disponibilite.find()
    res.status(200).json(disponibilites)
    
   } catch (error) {
    res.status(500).json({message:'Server Error',error:error.message})
   }
}
exports.createDisponibilite = async (req, res) => {
    try {
        // Créer d'abord la disponibilité
        const disponibilite = await Disponibilite.create(req.body);
        
        
        // Utiliser moment pour parser les dates ISO complètes
        let heureDebutMoment = moment(req.body.dateHeureDebut,"YYYY-MM-DD HH:mm");
        let heureFinMoment = moment(req.body.dateHeureFin,"YYYY-MM-DD HH:mm");
        // heureDebutMoment.format("YYYY-MM-DD HH:mm");
        // heureFinMoment.format("YYYY-MM-DD HH:mm");
        
        // Extraire les heures et minutes
        const heureD = heureDebutMoment.hours();
        const minutesD = heureDebutMoment.minutes();
        const heureF = heureFinMoment.hours();
        const minutesF = heureFinMoment.minutes();
        
        
        // Calcul de la différence en minutes
        const differenceEnMinutes = heureFinMoment.diff(heureDebutMoment, 'minutes');
        const nombreDuCons = Math.floor(differenceEnMinutes / 30);
        
        
        let creneauActuel = moment(heureDebutMoment);
        
        let creneauxCrees = [];
        
        for (let index = 0; index < nombreDuCons; index++) {
            // Format de l'heure de début du créneau actuel
            const heureDebut = creneauActuel.format('HH:mm');
            
            // Ajouter 30 minutes pour l'heure de fin
            const creneauFin = moment(creneauActuel).add(30, 'minutes');
            const heureFin = creneauFin.format('HH:mm');
            
            const current = await Creneau.create({
                heure_debut: heureDebut,
                heure_fin: heureFin,
                disponibilite: disponibilite._id,
                statut: "libre"
            });
             
            creneauxCrees.push(current);
            
            creneauActuel = creneauFin;
        }
        
        res.json({
            message: 'Disponibilité créée avec succès',
            disponibilite: disponibilite,
            creneaux: creneauxCrees
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            message: 'Erreur du serveur',
            error: error.message
        });
    }
}