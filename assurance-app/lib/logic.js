/**
 * Creer un nouveau actif (create new Asset)
 * @param {org.acme.riskanalysis.CreerNewActif} asset
 * @transaction
 */
async function creerNewActif(asset){
    let assetRegistry = await getAssetRegistry('org.acme.riskanalysis.PrivateAsset');
    var factory = getFactory()

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)
    var assetID = asset.souscripteur.id + num_id;
    var newAsset = factory.newResource('org.acme.riskanalysis', 'PrivateAsset', assetID)

    newAsset.souscripteur = asset.souscripteur
    newAsset.assetType = asset.assetType;
    newAsset.value = asset.value;
    newAsset.dureeMensuelle = asset.dureeMensuelle;

    await assetRegistry.add(newAsset)
}

/**
 * Analyse du Risque (Risk Analysis)
 * @param {org.acme.riskanalysis.RiskAnalysis} asset
 * @transaction
 */
async function riskAnalysis(asset){
    let assetRegistry = await getAssetRegistry('org.acme.riskanalysis.PrivateAsset');
    let score = 0

    if (asset.privateAsset.souscripteur.AnneeReclamation == 1) {
        score += 1
    }

    if (asset.privateAsset.souscripteur.AnneeReclamation == 2) {
        score += 2
    }

    if (asset.privateAsset.souscripteur.AnneeReclamation > 2) {
        score += 4
    }

    if (asset.privateAsset.description == 'Telephone') {
        score +=2
    }

    if (asset.privateAsset.description == 'Maison') {
        score +=3
    }

    if (asset.privateAsset.description == 'Voiture') {
        score +=2
    }

    if (asset.privateAsset.value < 10000.0) {
        score += 1
    }

    if (asset.privateAsset.value < 1000.0) {
        score += 1
    }

    asset.privateAsset.riskAnalysisScore = score

    assetRegistry.update(asset.privateAsset)
}

/**
 * Faire une Offre d'assurance (Make insurance offer)
 * @param {org.acme.riskanalysis.AssuranceOffreFormuler} insurance
 * @transaction
 */
async function AssuranceOffreFormuler(insurance){
    let assetRegistry = await getAssetRegistry('org.acme.riskanalysis.AssuranceOffre');

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)

    var factory = getFactory()
    var insuranceId = insurance.souscripteur.id + '' + num_id
    var insuranceOfferAsset = factory.newResource('org.acme.riskanalysis', 'AssuranceOffre', insuranceId)
    insuranceOfferAsset.souscripteur = insurance.souscripteur
    insuranceOfferAsset.assurancecompagny = insurance.assurancecompagny
    insuranceOfferAsset.privateAsset = insurance.privateAsset
    insuranceOfferAsset.dureeMensuelle = insurance.privateAsset.dureeMensuelle
    insuranceOfferAsset.MontantMensuel = insurance.MontantMensuel

    await assetRegistry.add(insuranceOfferAsset)
}

/**
 * Accepter une offre d'assurance(Accept Insurance offer)
 * @param {org.acme.riskanalysis.AssuranceOffreValidation} offer 
 * @transaction
 */
async function AssuranceOffreValidation(offer) {
    let insuranceOfferAssetRegistry = await getAssetRegistry('org.acme.riskanalysis.AssuranceOffre');
    let policyholderParticipantRegistry = await getParticipantRegistry('org.acme.riskanalysis.Souscripteur');
    let privateAssetParticipantRegistry = await getAssetRegistry('org.acme.riskanalysis.PrivateAsset');
    let insuranceCompanyParticipantRegistry = await getParticipantRegistry('org.acme.riskanalysis.AssuranceCompagny');

    var costToDebit = offer.offre.MontantMensuel;
    let insuranceCompany = "resource:org.acme.riskanalysis.AssuranceCompagny#" + offer.offre.assurancecompagny.id;

    if (offer.offre.souscripteur.balance < costToDebit) {
        throw new Error('Balance insuffisante')
    }
    offer.offre.souscripteur.balance -= costToDebit
    offer.offre.assurancecompagny.balance += costToDebit
    offer.offre.assurancecompagny.assuranceContrats += 1
    offer.offre.status = "accepter";
    offer.offre.privateAsset.assurancecompagny = offer.offre.assurancecompagny;

    await insuranceOfferAssetRegistry.update(offer.offre);
    await policyholderParticipantRegistry.update(offer.offre.souscripteur)
    await insuranceCompanyParticipantRegistry.update(offer.offre.assurancecompagny)
    await privateAssetParticipantRegistry.update(offer.offre.privateAsset)
}

/**
 * Creer une Revendication (a reclamation)
 * @param {org.acme.riskanalysis.ReclamationCreation} reclamation
 * @transaction
 */
async function reclamationCreation(reclamation){
    let assetResource = "resource:org.acme.riskanalysis.PrivateAsset#" + reclamation.privateAsset.id;
    let assetInsuranceOffer = await query('selectAssuranceCompanyByInsuredAsset', { privateAsset: assetResource });

    num_id = (Math.floor(Math.random() * ( 999999 - 100000) + 100000)).toString(10)


    let assetRegistry = await getAssetRegistry('org.acme.riskanalysis.Reclamation');

    var factory = getFactory()
    var reclamationId = reclamation.souscripteur.id + '' + num_id
    var newreclamation = factory.newResource('org.acme.riskanalysis', 'Reclamation', reclamationId)
    newreclamation.souscripteur = reclamation.souscripteur
    newreclamation.privateAsset = reclamation.privateAsset
    newreclamation.assurancecompagny = assetInsuranceOffer[0].assurancecompagny
    newreclamation.description = reclamation.description
    newreclamation.reclamationValue = reclamation.reclamationValue

    await assetRegistry.add(newreclamation)
}

/**
* Approuver ou Refuser une transaction
* @param {org.acme.riskanalysis.ReclamationValidation} handlereclamation
* @transaction
*/
async function ReclamationValidation(handlereclamation) {
    let reclamationsAssetRegistry = await getAssetRegistry('org.acme.riskanalysis.Reclamation');
    let policyholderParticipantRegistry = await getParticipantRegistry('org.acme.riskanalysis.Souscripteur');

    if ( handlereclamation.status === "denied" ) {
        handlereclamation.reclamation.status = handlereclamation.status
        await reclamationsAssetRegistry.update( handlereclamation.reclamation )
        return true
    }

    var costToPay = handlereclamation.reclamation.reclamationValue;
    handlereclamation.reclamation.souscripteur.balance += costToPay;
    handlereclamation.reclamation.status = handlereclamation.status

    await reclamationsAssetRegistry.update(handlereclamation.reclamation);
    await policyholderParticipantRegistry.update(handlereclamation.reclamation.souscripteur);

}



