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

-- Comptes LOL
CREATE TABLE IF NOT EXISTS lol_account (
  id_Account VARCHAR(100) PRIMARY KEY, 
  id_User VARCHAR(100) NOT NULL,
  name_lol_Account VARCHAR(100) NOT NULL,
  region_lol_account VARCHAR(4) NOT NULL,
  FOREIGN KEY (id_User) REFERENCES User(id_User) ON DELETE CASCADE
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
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
  lol_account_id VARCHAR(100) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (group_id) REFERENCES group_lol(id_group) ON DELETE CASCADE,
  FOREIGN KEY (id_account) REFERENCES User(id_User) ON DELETE CASCADE,
  FOREIGN KEY (lol_account_id) REFERENCES lol_account(id_Account) ON DELETE CASCADE,
  -- Contraintes d'unicité
  UNIQUE (id_group_members, group_id, id_account), -- Un seul membre par groupe
  UNIQUE (id_group_members, lol_account_id) -- Plusieurs lol_account possibles par groupe
)ENGINE=InnoDB DEFAULT CHARSET=utf8;