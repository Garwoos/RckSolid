-- Compte utilisateur
CREATE TABLE IF NOT EXISTS account (
  id VARCHAR(255) PRIMARY KEY, -- UUID remplacé par CHAR(36)
  mail VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  pseudo VARCHAR(255) NOT NULL,
);

-- Comptes LOL
CREATE TABLE IF NOT EXISTS lol_account (
  id VARCHAR(255) PRIMARY KEY, -- UUID remplacé par CHAR(36)
  account_id VARCHAR(255) NOT NULL,
  summoner_name VARCHAR(255) NOT NULL,
  region VARCHAR(50) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE
);

-- Table des groupes
CREATE TABLE IF NOT EXISTS groups (
  id VARCHAR(255) PRIMARY KEY, -- UUID remplacé par CHAR(36)
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (created_by) REFERENCES account(id) ON DELETE CASCADE
);

-- Table des membres des groupes
CREATE TABLE IF NOT EXISTS group_members (
  id VARCHAR(255) PRIMARY KEY, -- UUID remplacé par CHAR(36)
  group_id VARCHAR(255) NOT NULL,
  account_id VARCHAR(255) NOT NULL,
  lol_account_id VARCHAR(255) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- TIMESTAMPTZ remplacé par DATETIME
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
  FOREIGN KEY (lol_account_id) REFERENCES lol_account(id) ON DELETE CASCADE,
  UNIQUE (group_id, account_id), -- Un seul account par groupe
  UNIQUE (group_id, lol_account_id) -- Plusieurs lol_account possibles par groupe
);