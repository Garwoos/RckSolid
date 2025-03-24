-- Compte utilisateur
CREATE TABLE IF NOT EXISTS Users (
  id_User VARCHAR(100) PRIMARY KEY, 
  mail_User VARCHAR(100) NOT NULL UNIQUE,
  password_User VARCHAR(100) NOT NULL,
  name_User VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- TIMESTAMPTZ remplacé par DATETIME
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Comptes LOL
CREATE TABLE IF NOT EXISTS lol_account (
  riotid VARCHAR(100) NOT NULL,
  leagueId VARCHAR(100) PRIMARY KEY, 
  summonerId VARCHAR(100) NOT NULL UNIQUE,
  puuid VARCHAR(100) NOT NULL UNIQUE,
  leaguePoints INT NOT NULL, -- Correction ici
  `rank` VARCHAR(10) NOT NULL, -- Enclosed in backticks to avoid syntax error
  tier VARCHAR(10) NOT NULL,
  losses INT NOT NULL, -- Correction ici
  wins INT NOT NULL, -- Correction ici
  hotStreak BOOLEAN NOT NULL,
  freshBlood BOOLEAN NOT NULL,
  veteran BOOLEAN NOT NULL,
  inactive BOOLEAN NOT NULL,
  region_lol_account VARCHAR(4) NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  riot_api_last_checked DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Update timestamp on data change
  INDEX (riotid) -- Added index to resolve foreign key constraint issue
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table des comptes lol liés aux utilisateurs
CREATE TABLE IF NOT EXISTS user_lol_account (
  id_user_lol_account VARCHAR(100) PRIMARY KEY, 
  summonerId VARCHAR(100) NOT NULL UNIQUE,
  id_User VARCHAR(100) NOT NULL,
  FOREIGN KEY (summonerId) REFERENCES lol_account(summonerId) ON DELETE CASCADE,
  FOREIGN KEY (id_User) REFERENCES Users(id_User) ON DELETE CASCADE
  -- Contrainte d'unicité
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Table des groupes
CREATE TABLE IF NOT EXISTS group_lol (
  id_group VARCHAR(100) PRIMARY KEY, 
  name_groups VARCHAR(100) NOT NULL,
  description_group TEXT,
  created_by_User VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (created_by_User) REFERENCES Users(id_User) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table des membres des groupes
CREATE TABLE IF NOT EXISTS group_members (
  id_group_members VARCHAR(100) PRIMARY KEY, 
  group_id VARCHAR(100) NOT NULL,
  id_account VARCHAR(100) NOT NULL,
  riotid VARCHAR(100) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (group_id) REFERENCES group_lol(id_group) ON DELETE CASCADE,
  FOREIGN KEY (id_account) REFERENCES Users(id_User) ON DELETE CASCADE,
  FOREIGN KEY (riotid) REFERENCES lol_account(riotid) ON DELETE CASCADE,
  -- Contraintes d'unicité
  UNIQUE (id_group_members, group_id, id_account), -- Un seul membre par groupe
  UNIQUE (id_group_members, riotid) -- Plusieurs lol_account possibles par groupe
)ENGINE=InnoDB DEFAULT CHARSET=utf8;