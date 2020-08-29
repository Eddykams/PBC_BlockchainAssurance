Blockchain pour assurance

Descriptif : Cette application basé sur la Blockchain permet à un client qui désire souscrire à une police d'assurance, de pouvoir s"enregistrer sur la Blockchain
de choisir les actifs qu'il désire souscrire et d'annoncer ses intentions sur le réseau de la Blockchain. 
Connecté en synergie avec les entreprises d'assurance, ce dernier recoive clairement les annonces du souscripteur et lui font des propositions des souscriptions
par rapport aux actufs déclarés.

L'application est divisé en trois partie : 
- Assurance-app : Contient la partie Blockchain, les différens scripts et les contrats intélligents implementés dessus, écrit en Hyperledger
- Assureur-app : Front-end développé avec React-js, contient l'application de la compagnie d'assurance
- Client-app : Front-end développé avec React-js, contient l'application du souscripteur.


1.Assurance App
1.1. Pré-Réquis
- installer Hyperledger composer, procédé sur le lien suivant : https://hyperledger.github.io/composer/latest/installing/installing-index
- Installer Node
- Installer npm

1.2. Exécution
- Se placer sur le dosser Assurance-app
- composer network install --card PeerAdmin@hlfv1 --archiveFile assurance-app@0.0.9.bna
- composer network start --networkName assurance-app --networkVersion 0.0.9 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
- composer network ping --card admin@assurance-app
- export COMPOSER_TLS=true
- composer-rest-server -c admin@assurance-app -n never -u true -w true

2.Assureur-app
- Exécuter la commande npm install
- Modifier le fichier Package.json, cherchez la ligne Script-->Start : Ajouter PORT=3002
- Enregistrer et Exécuter npm start

3.Client-app
- Exécuter la commande npm install
- Modifier le fichier Package.json, cherchez la ligne Script-->Start : Ajouter PORT=3002
- Enregistrer et Exécuter npm start
