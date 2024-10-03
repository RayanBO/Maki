declare module 'sib-api-v3-sdk' {
    export class ApiClient {
        static instance: ApiClient;
        authentications: { [key: string]: { apiKey: string } };
    }

    export class TransactionalEmailsApi {
        sendTransacEmail(email: SendSmtpEmail): Promise<any>;
    }

    export class SendSmtpEmail {
        to: Array<{ email: string }>;
        sender: { email: string, name: string };
        subject: string;
        textContent?: string;
        htmlContent?: string;
    }
}
