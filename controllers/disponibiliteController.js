const Disponibilite=require('../models/Disponibilite')
const dayjs = require('dayjs');
const User=require('../models/User');
const Creneau = require('../models/Creneau');
exports.getDisponibilites=async(req,res)=>{
   try {
    const disponibilites=await Disponibilite.find()
    res.status(200).json(disponibilites)
    
   } catch (error) {
    res.status(500).json({message:'Server Error',error:error.message})
   }
}
exports.createDisponibilite=async(req,res)=>{
    try {
        
        // const user=await User.findOne({_id:req.body.medecin});
        // res.json({user:user})
         const disponibilite=  await Disponibilite.create(req.body);
        // const t='112.2'
        const heureDebut=req.body.heureDebut.split(':')
        const heureFin=req.body.heureFin.split(':')
        const heureD=parseInt(heureDebut[0])
        const minutesD=parseInt(heureDebut[1])
        const heureF=parseInt(heureFin[0])
        const minutesF=parseInt(heureFin[1])
        const totalminutes=(heureF-heureD)*60-minutesD+minutesF
        const nombreDuCons=totalminutes/30
        // let creneau=[];
        // creneau.push({heure:req.body.heureDebut})
        let currentMinutes=minutesD;
        let currentHeure=heureD;
        let previousHeure = `${heureD}:${minutesD.toString().padStart(2, '0')}`;
        // let heurD1=[heureD,minutesD]
        for (let index = 0; index < nombreDuCons; index++) {
             if (currentMinutes==30) {
                currentMinutes=0
                currentHeure=currentHeure+1
                }else{
                    currentMinutes=30;
                }
                const formattedMinute = currentMinutes.toString().padStart(2, '0');//hadi likatkhli les minutes itktbo b '00'
                const current=await Creneau.create({
                    heure_debut:previousHeure,
                    heure_fin:`${currentHeure}:${formattedMinute}`,
                    // medecin:req.body.medecin,
                    disponibilite:disponibilite
                })
                previousHeure=`${currentHeure}:${formattedMinute}`;
                // creneau.push({heure:`${currentHeure}:${formattedMinute}`});
                
             }
           
            

        res.json({message:'Dispon0ibilite created successfully',disponibilite:disponibilite,
            })

   
    } catch (error) {
        res.status(500).json({message:'Server Error',error:error.message}   
    )}
      }