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
        if (!req.body.dateHeureDebut || !req.body.dateHeureFin || !req.body.medecin) {
    return res.status(400).json({ message: "Tous les champs requis doivent être fournis." });
}
if (!moment(req.body.dateHeureDebut, "YYYY-MM-DD HH:mm", true).isValid()) {
    return res.status(400).json({ message: "Le format de dateHeureDebut est invalide." });
}
if (!moment(req.body.dateHeureFin, "YYYY-MM-DD HH:mm", true).isValid()) {
    return res.status(400).json({ message: "Le format de dateHeureFin est invalide." });
}
if (moment(req.body.dateHeureDebut).isAfter(req.body.dateHeureFin)) {
    return res.status(400).json({ message: "La date de début doit être avant la date de fin." });
}
        //verifier le medecin existe 

        const medecin = await User.findById({_id:req.body.medecin, role:'doctor'}).select('-password');
if (!medecin) {
    return res.status(404).json({ message: "Médecin introuvable." });
}
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
exports.updateDisponibilite = async (req, res) => {
    try {
        // Validation des données
        if (!req.body.dateHeureDebut || !req.body.dateHeureFin) {
            return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
        }
        
        if (!moment(req.body.dateHeureDebut, "YYYY-MM-DD HH:mm", true).isValid()) {
            return res.status(400).json({ message: "Le format de dateHeureDebut est invalide." });
        }
        
        if (!moment(req.body.dateHeureFin, "YYYY-MM-DD HH:mm", true).isValid()) {
            return res.status(400).json({ message: "Le format de dateHeureFin est invalide." });
        }
        
        if (moment(req.body.dateHeureDebut).isAfter(req.body.dateHeureFin)) {
            return res.status(400).json({ message: "La date de début doit être avant la date de fin." });
        }

        // Trouver la disponibilité existante
        const disponibilite = await Disponibilite.findById(req.params.id);
        if (!disponibilite) {
            return res.status(404).json({ message: "Disponibilité introuvable." });
        }

        // Mettre à jour la disponibilité
        const disponibiliteUpdated = await Disponibilite.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        // Supprimer tous les anciens créneaux
        await Creneau.deleteMany({ disponibilite: req.params.id });
        
        // Créer de nouveaux créneaux basés sur les nouvelles dates
        let heureDebutMoment = moment(req.body.dateHeureDebut, "YYYY-MM-DD HH:mm");
        let heureFinMoment = moment(req.body.dateHeureFin, "YYYY-MM-DD HH:mm");
        
        // Calcul de la différence en minutes
        const differenceEnMinutes = heureFinMoment.diff(heureDebutMoment, 'minutes');
        const nombreDuCons = Math.floor(differenceEnMinutes / 30);
        
        let creneauActuel = moment(heureDebutMoment);
        let nouveauxCreneaux = [];
        
        // Créer les nouveaux créneaux
        for (let index = 0; index < nombreDuCons; index++) {
            const heureDebut = creneauActuel.format('HH:mm');
            const creneauFin = moment(creneauActuel).add(30, 'minutes');
            const heureFin = creneauFin.format('HH:mm');
            
            const creneau = await Creneau.create({
                heure_debut: heureDebut,
                heure_fin: heureFin,
                disponibilite: disponibilite._id,
                statut: "libre"
            });
            
            nouveauxCreneaux.push(creneau);
            creneauActuel = creneauFin;
        }
        
        res.status(200).json({
            message: 'Disponibilité et créneaux mis à jour avec succès',
            disponibilite: disponibiliteUpdated,
            creneaux: nouveauxCreneaux
        });

    } catch (error) {
        console.error('Erreur:', error);
        return res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
}
exports.deleteDisponibilite=async(req,res)=>{
    try {
        const disponibilite = await Disponibilite.findById(req.params.id);
        if (!disponibilite) {
            return res.status(404).json({ message: "Disponibilité introuvable." });
        }
        await  Disponibilite.findByIdAndDelete(req.params.id);
        await Creneau.deleteMany({ disponibilite: req.params.id });
        res.status(200).json({ message: "Disponibilité et ses créneaux supprimés avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur", error: error.message });
    }
}