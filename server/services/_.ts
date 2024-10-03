import swaggerJsDoc from 'swagger-jsdoc';
import { BRIGHT, FG_BLUE, FG_CYAN, FG_GREEN, FG_MAGENTA, FG_YELLOW, IS_PROD, MONGODB_URI, MONGODB_URI_PROD, RESET, SERVER_PORT, SITE_URL } from './const';
// import { backupDatabase } from '@server/backup';
// import { sendScheduledNotifications, checkPendingTransactions } from './mycron';
import cron from 'node-cron';
//
/** LOGS ========================================================================
 * @param {string} type - (success, warning, error, or info).
 * @param {string} content
 * @eg {success} : _bo_log_('success', 'message')
 * @eg {warning} : _bo_log_('warning', 'message')
 * @eg {error} : _bo_log_('error', 'message')
============================================================================== */
export function _bo_log_(type: string, content: string) {
    let color: string;
    let label: string;

    switch (type.toLowerCase()) {
        case 'success':
            color = FG_GREEN;
            label = "SUCCESS";
            break;
        case 'warning':
            color = FG_YELLOW;
            label = "WARNING";
            break;
        case 'error':
            color = FG_MAGENTA;
            label = "ERROR";
            break;
        default:
            color = "";
            label = "INFO";
            break;
    }

    // console.log(`= Log : ${label.toLowerCase()} =================`);
    console.log(`${_bo_get_now_()} | ${BRIGHT}${color}[${label}]${RESET} ${content}`);
}

/* ======================================================================================
|     on Get Now
======================================================================================*/
//
export const _bo_get_now_ = () => {
    const date = new Date();

    // Convertir la date en UTC+3
    const utc3Date = new Date(date.getTime() + 3 * 60 * 60 * 1000);

    // Récupérer les éléments de la date
    const day = String(utc3Date.getUTCDate()).padStart(2, '0');
    const month = String(utc3Date.getUTCMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = utc3Date.getUTCFullYear();

    // Récupérer les éléments de l'heure
    const hours = String(utc3Date.getUTCHours()).padStart(2, '0');
    const minutes = String(utc3Date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(utc3Date.getUTCSeconds()).padStart(2, '0');

    // Retourner la date formatée
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/* ======================================================================================
|     on Construct
======================================================================================*/
//
const _bo_server_ = () => {
    const envColor = IS_PROD ? FG_GREEN : FG_YELLOW;
    console.log('================================================================================');
    console.log(`🚀 ${_bo_get_now_()} | ${FG_BLUE}${BRIGHT} Server is now in live!${RESET}`);
    console.log(`🌍 ${_bo_get_now_()} | ${FG_CYAN} Environment: ${envColor}${IS_PROD ? 'Production' : 'local'} - ${process.env.NODE_ENV}${RESET}`);
    console.log(`🔧 ${_bo_get_now_()} | ${FG_MAGENTA} Running on port: ${BRIGHT}${SERVER_PORT}${RESET}`);
    console.log('--------------------------------------------------------------------------------');
    
    // - Planification de la sauvegarde tous les dimanches à 23h59
    cron.schedule('59 23 * * 0', () => {
        _bo_log_('', 'Démarrage de la sauvegarde de la base de données à la fin de la semaine...');
        //     backupDatabase(IS_PROD ? MONGODB_URI_PROD : MONGODB_URI);
    });

    cron.schedule('*/1 * * * *', () => {
        _bo_log_('', 'Vérification des notifications programmées...');
        //     sendScheduledNotifications();
    });

    // CORN for : update transacation 
    - cron.schedule('*/5 * * * *', () => {
        _bo_log_('', 'Vérification des transactions en attente');
        //     checkPendingTransactions();
    });

}


/* ======================================================================================
|     Swagger by me
======================================================================================*/
//
export const _bo_swagger_ = () => {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Soavadi API',
                version: '1.0.0',
                description: 'API documentation pour Soavadi',
            },
            servers: [
                {
                    url: SITE_URL,
                },
            ],
        },
        apis: ['./routes/*.ts'], // Path to route files
    };
    return swaggerJsDoc(swaggerOptions);
}

export default _bo_server_