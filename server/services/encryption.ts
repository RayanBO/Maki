import * as crypto from 'crypto';

export function encrypt3DES(data: string, key: string): Buffer {
    const des_iv = Buffer.from("0000000000000000", 'hex');
    const cipher = crypto.createCipheriv('des-ede3-cbc', Buffer.from(key.substring(0, 24)), des_iv);
    let encrypted = cipher.update(data, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
}

export function decrypt3DES(hexData: string, key: string): string {
    if (hexData === "" || hexData === undefined || hexData === null) return ""
    const data = Buffer.from(hexData, 'hex');
    const des_iv = Buffer.from("0000000000000000", 'hex');
    const decipher = crypto.createDecipheriv('des-ede3-cbc', Buffer.from(key.substring(0, 24)), des_iv);
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}

/* =====================================================
Bank version 
*/

// export function encrypt3DESbank(data: string, key: string): string {
//     var hash = crypto.createHmac('SHA256', key).update(PAYLOAD).digest('hex');

//     const des_iv = Buffer.from("0000000000000000", 'hex');
//     const cipher = crypto.createCipheriv('des-ede3-cbc', Buffer.from(key.substring(0, 24)), des_iv);
//     let encrypted = cipher.update(data, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// }

// export function decrypt3DESbank(data: string, key: string): string {
//     const des_iv = Buffer.from("0000000000000000", 'hex');
//     const decipher = crypto.createDecipheriv('des-ede3-cbc', Buffer.from(key.substring(0, 24)), des_iv);
//     let decrypted = decipher.update(data, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }

export function encryptPayload(secret: string, payload: string): string {
    const hash = crypto.createHmac('SHA256', secret)
        .update(payload)
        .digest('hex');
    return hash.toUpperCase();
}



// Decryption function
export function decryptPayload(secret: string, encryptedPayload: string): string {
    const iv = Buffer.from(encryptedPayload.slice(0, 32), 'hex'); // Extract the first 16 bytes (IV)
    const encryptedText = encryptedPayload.slice(32); // Rest is the encrypted data

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}