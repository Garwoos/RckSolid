-- Compte utilisateur
CREATE TABLE IF NOT EXISTS User (
  id_User VARCHAR(100) PRIMARY KEY, 
  mail_User VARCHAR(100) NOT NULL UNIQUE,
  password_User VARCHAR(100) NOT NULL,
  name_User VARCHAR(100) NOT NULL
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ajout de la colonne created_at pour la date de création du compte
-- La colonne created_at est ajoutée avec une valeur par défaut de l'horodatage actuel
ALTER TABLE User
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

/*leagueId: "028097a5-db34-4bfe-b79a-15f719dbd028", queueType: "RANKED_SOLO_5x5", tier: "PLATINUM", … }
​​
freshBlood: false
​​
hotStreak: false
​​
inactive: false
​​
leagueId: "028097a5-db34-4bfe-b79a-15f719dbd028"
​​
leaguePoints: 55
​​
losses: 15
​​
puuid: "BDOlvNmcRHM0TOcn9rSpiOOhAdrYfVejrwmrxjABNTydFW_gzlJwPy9RaBxvU9KP_kW-fiwQA9187g"
​​
queueType: "RANKED_SOLO_5x5"
​​
rank: "IV"
​​
summonerId: "SK4mJycK8i9bnt7lR5X3ATf0kERWz0lov5MdBOpn9P73O_Fs"
​​
tier: "PLATINUM"
​​
veteran: false
​​
wins: 20*/

-- Comptes LOL
CREATE TABLE IF NOT EXISTS lol_account (
  riotid VARCHAR(100) NOT NULL,
  leagueId VARCHAR(100) PRIMARY KEY, 
  summonerId VARCHAR(100) NOT NULL UNIQUE,
  puuid VARCHAR(100) NOT NULL UNIQUE,
  leaguePoints INT NOT NULL, -- Correction ici
  rank VARCHAR(10) NOT NULL,
  tier VARCHAR(10) NOT NULL,
  losses INT NOT NULL, -- Correction ici
  wins INT NOT NULL, -- Correction ici
  hotStreak BOOLEAN NOT NULL,
  freshBlood BOOLEAN NOT NULL,
  veteran BOOLEAN NOT NULL,
  inactive BOOLEAN NOT NULL,
  region_lol_account VARCHAR(4) NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  riot_api_last_checked DATETIME DEFAULT CURRENT_TIMESTAMP -- Attribut pour stocker la dernière vérification avec l'API Riot
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Ajout de la colonne added_at pour la date d'ajout du compte LOL
-- La colonne added_at est ajoutée avec une valeur par défaut de l'horodatage actuel
ALTER TABLE lol_account
ADD COLUMN added_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Table des groupes
CREATE TABLE IF NOT EXISTS group_lol (
  id_group VARCHAR(100) PRIMARY KEY, 
  name_groups VARCHAR(100) NOT NULL,
  description_group TEXT,
  created_by_User VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (created_by_User) REFERENCES User(id_User) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table des membres des groupes
CREATE TABLE IF NOT EXISTS group_members (
  id_group_members VARCHAR(100) PRIMARY KEY, 
  group_id VARCHAR(100) NOT NULL,
  id_account VARCHAR(100) NOT NULL,
  riotid VARCHAR(100) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (group_id) REFERENCES group_lol(id_group) ON DELETE CASCADE,
  FOREIGN KEY (id_account) REFERENCES User(id_User) ON DELETE CASCADE,
  FOREIGN KEY (riotid) REFERENCES lol_account(riotid) ON DELETE CASCADE,
  -- Contraintes d'unicité
  UNIQUE (id_group_members, group_id, id_account), -- Un seul membre par groupe
  UNIQUE (id_group_members, riotid) -- Plusieurs lol_account possibles par groupe
)ENGINE=InnoDB DEFAULT CHARSET=utf8;