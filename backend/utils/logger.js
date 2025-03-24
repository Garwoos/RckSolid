import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../../logs/app.log');

// Ensure the log file exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '', 'utf8');
}

function writeLog(level, messages) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message: messages.join(' ')
  };
  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n', 'utf8');
}

export const logger = {
  info: (...messages) => {
    console.log("[INFO]:", ...messages);
    writeLog('info', messages);
  },
  error: (...messages) => {
    console.error("[ERROR]:", ...messages);
    writeLog('error', messages);
  },
  debug: (...messages) => {
    console.debug("[DEBUG]:", ...messages);
    writeLog('debug', messages);
  }
};
