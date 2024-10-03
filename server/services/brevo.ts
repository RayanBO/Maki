// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';
import { BREVO_API_KEY } from '@server/services/const';
// import { email_confirmation_content } from '@server/services/vu_email';
import axios from 'axios';
import { _bo_log_ } from '@server/services/_';
// import { new_histo_send_email, new_histo_send_sms } from '@server/controllers/historique';


const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendConfirmationEmail = async (toEmail: string, code: string, type: string = 'Creation compte') => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.sender = { email: 'innovita.dev@gmail.com', name: 'Soavadi' };
    sendSmtpEmail.subject = 'Code de Confirmation';
    sendSmtpEmail.textContent = `Votre code de confirmation est : ${code}`;
    // sendSmtpEmail.htmlContent = type === 'Restor password' ? await email_confirmation_content(code, 'Creation compte') : await email_confirmation_content(code)

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        _bo_log_('success', `Email envoyé avec succès: ${data}`)

		// -> add Historique
		// await new_histo_send_email(toEmail, type)

    } catch (error) {
        _bo_log_('success', `Erreur d'envoi mail: ${error}`)
    }
};



const client_id = "ZEixun8h9YeEGpsL0MjaUCt4YWu1FVYa";
const client_secret = "Y5KieLVyeqAmp54y";

// Fonction pour obtenir le token d'accès OAuth2
const getToken = async () => {
    const auth = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;
    console.log("auth");
    console.log(auth);

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const response = await axios.post('https://api.orange.com/oauth/v3/token', params, {
            headers: {
                'Authorization': auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Erreur lors de l'obtention du token :", error);
        throw new Error("Échec de l'authentification pour obtenir le token.");
    }
};

// Fonction pour envoyer un SMS via Orange API
const devPhoneNumber = 261344974196
const ORANGE_API_URL = `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${devPhoneNumber}/requests`; // Remplacez par l'URL de l'API SMS
export const sendConfirmationSMS = async (toPhoneNumber: string, code: string) => {
    const token = await getToken(); // Obtenez le token d'accès    
    const smsData = {
        outboundSMSMessageRequest: {
            address: `tel:+${toPhoneNumber}`,
            senderAddress: `tel:+${devPhoneNumber}`,
            senderName: "SOAVADI",
            outboundSMSTextMessage: {
                message: `Votre code de confirmation est : ${code}`,
            },
        },
    };

    try {
        const response = await axios.post(
            ORANGE_API_URL,
            smsData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Utilisez le token d'accès ici
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('success', `SMS envoyé avec succès à +${toPhoneNumber}`);
		// -> add Historique
		// await new_histo_send_sms(toPhoneNumber)
    } catch (error) {
        console.error('error', `Erreur d'envoi SMS: ${error}`);
    }
};



