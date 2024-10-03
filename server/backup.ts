import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';



// Fonction pour exécuter la commande mongodump
export const backupDatabase = (URI: string) => {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const date = new Date().toISOString().split('T')[0];
    const backupPath = path.join(backupDir, `backup-${date}.gz`);

    // Utilisation de la commande mongodump pour faire la sauvegarde
    const command = `mongodump --uri=${URI} --archive=${backupPath} --gzip`;
    console.log(command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de la sauvegarde : ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erreur : ${stderr}`);
            return;
        }
        console.log(`Sauvegarde réussie : ${stdout}`);
    });
};
