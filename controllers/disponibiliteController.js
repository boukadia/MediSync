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
        console.log(req.body);
        
        
        // Utiliser moment pour parser les dates ISO complètes
        let heureDebutMoment = moment(req.body.dateHeureDebut,"YYYY-MM-DD HH:mm");
        let heureFinMoment = moment(req.body.dateHeureFin,"YYYY-MM-DD HH:mm");
        // heureDebutMoment.format("YYYY-MM-DD HH:mm");
        // heureFinMoment.format("YYYY-MM-DD HH:mm");
        console.log(heureDebutMoment);
        console.log(heureFinMoment);
        
        // Extraire les heures et minutes
        const heureD = heureDebutMoment.hours();
        const minutesD = heureDebutMoment.minutes();
        const heureF = heureFinMoment.hours();
        const minutesF = heureFinMoment.minutes();
        
        // console.log(heureD, minutesD, heureF, minutesF);
        
        // Calcul de la différence en minutes
        const differenceEnMinutes = heureFinMoment.diff(heureDebutMoment, 'minutes');
        const nombreDuCons = Math.floor(differenceEnMinutes / 30);
        
        // console.log(`Différence: ${differenceEnMinutes} minutes, ${nombreDuCons} créneaux de 30 min`);
        
        let creneauActuel = moment(heureDebutMoment);
        console.log(creneauActuel);
        
        let creneauxCrees = [];
        
        for (let index = 0; index < nombreDuCons; index++) {
            console.log(creneauActuel);
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
            console.log( { heure_debut: heureDebut, heure_fin: heureFin });
             
            creneauxCrees.push(current);
            
        //     // Mettre à jour le créneau actuel pour le prochain tour
            creneauActuel = creneauFin;
        }
        console.log(creneauxCrees);
        
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


// exports.createDisponibilite = async (req, res) => {
//     try {
//         // const disponibilite = await Disponibilite.create(req.body);
        
//         // Utiliser moment pour parser les heures
//         const heureDebutMoment = moment(req.body.heureDebut, 'HH:mm');
//         const heureFinMoment = moment(req.body.heureFin, 'HH:mm');
//         console.log(heureDebutMoment);
//         console.log(heureFinMoment);
        
//         // Extraire les heures et minutes
//         const heureD = heureDebutMoment.hours();
//         const minutesD = heureDebutMoment.minutes();
//         const heureF = heureFinMoment.hours();
//         const minutesF = heureFinMoment.minutes();
//         console.log(heureD, minutesD, heureF, minutesF);
        
//         // Calcul de la différence en minutes
//         const differenceEnMinutes = heureFinMoment.diff(heureDebutMoment, 'minutes');
//         const nombreDuCons = Math.floor(differenceEnMinutes / 30);
        
//         // Point de départ pour générer les créneaux
//         let creneauActuel = moment(heureDebutMoment);
        
//         // for (let index = 0; index < nombreDuCons; index++) {
//         //     // Format de l'heure de début du créneau actuel
//         //     const heureDebut = creneauActuel.format('HH:mm');
            
//         //     // Ajouter 30 minutes pour l'heure de fin
//         //     const creneauFin = moment(creneauActuel).add(30, 'minutes');
//         //     const heureFin = creneauFin.format('HH:mm');
            
//         //     // Créer le créneau
//         //     const current = await Creneau.create({
//         //         heure_debut: heureDebut,
//         //         heure_fin: heureFin,
//         //         disponibilite: disponibilite
//         //     });
            
//         //     // Mettre à jour le créneau actuel pour le prochain tour
//         //     creneauActuel = creneauFin;
//         // }
        
//         // res.json({
//         //     message: 'Disponibilité créée avec succès',
//         //     disponibilite: disponibilite
//         // });
//     } catch (error) {
//         console.error('Erreur:', error);
//         res.status(500).json({
//             message: 'Erreur du serveur',
//             error: error.message
//         });
//     }
// }









// exports.createDisponibilite=async(req,res)=>{
//     try {
        
//         // const user=await User.findOne({_id:req.body.medecin});
//         // res.json({user:user})
//          const disponibilite=  await Disponibilite.create(req.body);
   
//         // const t='112.2'
//         const heureDebut=req.body.heureDebut.split(':')
//         const heureFin=req.body.heureFin.split(':')
//         const heureD=parseInt(heureDebut[0])
//         const minutesD=parseInt(heureDebut[1])
//         const heureF=parseInt(heureFin[0])
//         const minutesF=parseInt(heureFin[1])
//         const totalminutes=(heureF-heureD)*60-minutesD+minutesF
//         const nombreDuCons=totalminutes/30
//         // let creneau=[];
//         // creneau.push({heure:req.body.heureDebut})
//         let currentMinutes=minutesD;
//         let currentHeure=heureD;
//         let previousHeure = `${heureD}:${minutesD.toString().padStart(2, '0')}`;
//         // let heurD1=[heureD,minutesD]
//         for (let index = 0; index < nombreDuCons; index++) {
//              if (currentMinutes==30) {
//                 currentMinutes=0
//                 currentHeure=currentHeure+1
//                 }else{
//                     currentMinutes=30;
//                 }
//                 const formattedMinute = currentMinutes.toString().padStart(2, '0');//hadi likatkhli les minutes itktbo b '00'
//                 const current=await Creneau.create({
//                     heure_debut:previousHeure,
//                     heure_fin:`${currentHeure}:${formattedMinute}`,
//                     // medecin:req.body.medecin,
//                     disponibilite:disponibilite
//                 })
//                 previousHeure=`${currentHeure}:${formattedMinute}`;
//                 // creneau.push({heure:`${currentHeure}:${formattedMinute}`});
                
//              }
           
            

//         res.json({message:'Dispon0ibilite created successfully',disponibilite:disponibilite,
//             })

   
//     } catch (error) {
//         res.status(500).json({message:'Server Error',error:error.message}   
//     )}
    //   }