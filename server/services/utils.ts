import type { ServerAnswer } from "@server/services/types";
import Setting from "@server/models/setting";
import { _bo_log_ } from "./_";
export const initializeSettings = async () => {
    try {
        const settings = await Setting.findOne();
        if (!settings) {
            const newSetting = new Setting({
                version: '1.0.0',
                appName: 'Soavadi',
                logo_url: 'https://api.soavadi.com/uploads/logo/logo.png',
                logo_text_url: 'https://api.soavadi.com/uploads/logo/logo-text.png',
                commission_percentage: 12,  // Valeur par défaut
                declarationSurLhonneur: {
                    declaration: `
                    Je jure sur l'honneur être légalement habilité à exercer une activité professionnelle de transport de personnes.
                    Mon inscription m'engage personnellement et juridiquement, et pourra être utilisée par les administrateurs de l'application Soavadi, ou par toute autre instance d'autorité publique, en cas de contrôle ou d'incident relatif à la pratique de cette activité.
                    `,
                    signature: "Je reconnais avoir lu et accepté les conditions Générales d'utilisation"
                },
                bonus_parainage_client: 2000,
                bonus_parainage_driver: 10000,
                prix_recommande: [
                    {
                        label: 'Voitures',
                        is_prix_personnalise: false,
                        montant_personalise: 0,
                        montant_moyen_constate: 3200
                    },
                    {
                        label: 'Taxis',
                        is_prix_personnalise: false,
                        montant_personalise: 0,
                        montant_moyen_constate: 2900
                    },
                    {
                        label: 'Taxis-motos',
                        is_prix_personnalise: false,
                        montant_personalise: 0,
                        montant_moyen_constate: 1800
                    },
                    {
                        label: '4x4',
                        is_prix_personnalise: false,
                        montant_personalise: 0,
                        montant_moyen_constate: 4100
                    },
                    {
                        label: 'Bajaj',
                        is_prix_personnalise: false,
                        montant_personalise: 0,
                        montant_moyen_constate: 2100
                    }
                ]
            });
            await newSetting.save();
            _bo_log_('success', 'Paramètres initialisés avec succès.');
        } else if (settings.commission_percentage === undefined) {
            settings.commission_percentage = 12;  // Valeur par défaut si elle n'existe pas
            await settings.save();
            _bo_log_('success', 'Pourcentage de commission ajouté aux paramètres.');
        }
    } catch (error) {
        _bo_log_('error', 'Erreur lors de l\'initialisation des paramètres');
        console.log(error);
    }
};



/**
 * Various utility functions
 */

/**
 * Returns server result as JSON
 * @param {string} message the answer message
 * @param {any} payload the JSON payload to return
 * @returns ServerAnswer object
 */
export const answer = (message: string, payload?: any): ServerAnswer => ({
    payload: payload || undefined,
    message,
});

export function parseNumberFromString(value: string, unit: string): number {
    const parsedValue = value.replace(unit, '').trim();
    return parseFloat(parsedValue);
}

export const getAppellation = (firstname: string, lastname: string): string => {
    const lastInitial = lastname ? `${lastname.charAt(0)}.` : '';
    return `${firstname} ${lastInitial}`;
};
