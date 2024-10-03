// import dayjs from 'dayjs';
// // import Transaction from '@server/models/Transaction';
// // import Notification from '@server/models/Notification';
// import User from '@server/models/User';
// import { io } from '..';

// // Fonction qui sera appelée par un cron job toutes les 5 minutes
// export const checkPendingTransactions = async () => {
//     try {
//         // Obtenir la date/heure actuelle moins 5 minutes
//         const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();

//         // Trouver toutes les transactions dont le type est "PAYMENT_REQUEST_PENDING"
//         // et dont la date de création est antérieure à il y a 5 minutes
//         const pendingTransactions = await Transaction.find({
//             statut: 'PAYMENT_REQUEST_PENDING',
//             type: 'MOBILE_MONEY',
//             dateCreation: { $lt: fiveMinutesAgo },
//         });

//         if (pendingTransactions.length > 0) {
//             // Mettre à jour le type des transactions dépassées à "PAYMENT_REQUEST_FAILED"
//             const result = await Transaction.updateMany(
//                 {
//                     _id: { $in: pendingTransactions.map((tx) => tx._id) },
//                 },
//                 {
//                     $set: { statut: 'PAYMENT_REQUEST_FAILED', dateMiseAJour: new Date() },
//                 }
//             );

//             console.log(`${result.modifiedCount} transactions mises à jour avec le statut PAYMENT_REQUEST_FAILED`);
//         } else {
//             console.log('Aucune transaction en attente dépassée.');
//         }
//     } catch (error) {
//         console.error('Erreur lors de la vérification des transactions en attente:', error);
//     }
// };



// // Function to handle sending scheduled notifications
// export const sendScheduledNotifications = async () => {
//     try {
//         const now = new Date();

//         // Find notifications scheduled for the current time or earlier and not yet sent
//         const notifications = await Notification.find({
//             scheduled_at: { $lte: now },
//             sent: false // Ensure we don't resend the same notifications
//         });

//         if (notifications.length > 0) {
//             notifications.forEach(async (notification) => {
//                 const user = await User.findById(notification.owner_id);

//                 if (user) {
//                     // Emit the notification to the user via socket
//                     io.emit(`notif-${user._id}`, {
//                         message: notification!.properties!.first_message,
//                         type: 'notification',
//                     });

//                     // Mark the notification as sent
//                     notification.sent = true;
//                     await notification.save();
//                 }
//             });
//         }
//     } catch (error) {
//         console.error('Error sending scheduled notifications:', error);
//     }
// };