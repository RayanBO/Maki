// import { parseNumberFromString } from '@server/helpers/utils';
import Historique from '@server/models/historique';
// import Vehicle from '@server/models/Vehicle';
import { getInfoContry } from '@server/services/maps';
import { parseNumberFromString } from '@server/services/utils';
import { Request, Response } from 'express';

interface RideDetails {
    ride: any;
    ridePost: any;
}

interface CreditDetails {
    sender: any;
    receiver: any;
    creditsToSend: number;
}

interface ConnexionDetails {
    user: any;
    device: string;
}

// Unified function to create a new `Historique`
export const createHistorique = async (type: string, subtype: string, details: any, user?: any, vehicle?: any, ride?: any) => {
    try {
        const data: any = {
            type,
            subtype,
            histo_date: new Date(),
            details
        };

        // Add references if they are provided
        if (user) data.user = user._id;
        if (vehicle) data.vehicle = vehicle._id;
        if (ride) data.ride = ride._id;
        
        const histo = new Historique(data);
        await histo.save();
        return histo;
    } catch (error) {
        console.log(error);
    }
};



/* ===============================================================================
|         Détails 
=============================================================================== */

// Helper function to generate ride history details
const generateRideDetails = async (rideDetails: RideDetails) => {
    const { ride, ridePost } = rideDetails;
    const region = await getInfoContry(ride.start_location.latitude, ride.start_location.longitude);
    // const vehicle = await Vehicle.findById(ridePost.vehicle_id);

    return {
        region,
        client: {
            _id: ride.passenger_id,
            confirm_cours_at: new Date(),
        },
        driver: {
            driver_fullname: ridePost.driver_fullname,
            driver_picture: ridePost.driver_picture,
            driver_montant: ridePost.driver_montant,
            driver_payment_mode: ridePost.driver_payment_mode,
            driver_position: ridePost.driver_position,
            postule_at: ridePost.created_at,
        },
        // vehicle,
        distance_course: {
            etym_distance_str: ride.etym_distance,
            etym_distance: parseNumberFromString(ride.etym_distance, 'km'),
            etym_time_str: ride.etym_time,
            etym_time: parseNumberFromString(ride.etym_time, 'min'),
        }
    };
};

// Helper function to generate credit transfer details
const generateCreditTransferDetails = (creditDetails: CreditDetails) => {
    const { sender, receiver, creditsToSend } = creditDetails;

    return {
        sender: {
            _id: sender._id,
            fullname: `${sender.firstname} ${sender.lastname}`,
            credits_before: sender.infos_client.credits + creditsToSend,
            credits_after: sender.infos_client.credits,
        },
        receiver: {
            _id: receiver._id,
            fullname: `${receiver.firstname} ${receiver.lastname}`,
            credits_before: receiver.infos_client.credits - creditsToSend,
            credits_after: receiver.infos_client.credits,
        },
        amount_transferred: creditsToSend,
    };
};

// Helper function to generate login details
const generateConnexionDetails = (connexionDetails: ConnexionDetails) => {
    const { user, device } = connexionDetails;

    return {
        client: {
            _id: user?._id,
            email: user?.email,
            login_at: new Date(),
            device: device,
        }
    };
};

/* ===============================================================================
|         Init and insert 
=============================================================================== */

// export const new_histo_rides = async (ride: any, ridePost: any) => {
//     const rideDetails = await generateRideDetails({ ride, ridePost });
//     return await createHistorique('COURSE', 'ACCEPT', rideDetails, { _id: ride.passenger_id }, await Vehicle.findById(ridePost.vehicle_id), { _id: ride._id });
// };

// export const new_histo_ride_start = async (ride: any, ridePost: any) => {
//     const rideDetails = await generateRideDetails({ ride, ridePost });
//     return await createHistorique('COURSE', 'START', rideDetails, { _id: ride.passenger_id }, await Vehicle.findById(ridePost.vehicle_id), { _id: ride._id });
// };

// export const new_histo_ride_end = async (ride: any, ridePost: any) => {
//     const rideDetails = await generateRideDetails({ ride, ridePost });
//     return await createHistorique('COURSE', 'COMPLETED', rideDetails, { _id: ride.passenger_id }, await Vehicle.findById(ridePost.vehicle_id), { _id: ride._id });
// };


//  CREDIT    -----------------------------------------------------------------------

export const new_histo_credit_transfer = async (sender: any, receiver: any, creditsToSend: number) => {
    const creditDetails = generateCreditTransferDetails({ sender, receiver, creditsToSend });
    return await createHistorique('CREDIT', 'TRANSFER', creditDetails, { _id: sender._id }, undefined, undefined);
};


//  SEND Email or SMS    -----------------------------------------------------------------------

export const new_histo_send_email = async (email: string, type: string) => {
    return await createHistorique('SEND', 'EMAIL', {
        email: email,
        type: type === 'Restor password' ? 'RESTORATION MOT DE PASSE' : 'CREATION COMPTE'
    });
};

export const new_histo_send_sms = async (numero: string) => {
    return await createHistorique('SEND', 'SMS', {
        numero: numero,
        type: 'CONFIRMATION NUM TELEPHONE'
    });
};


//  AUTH    -----------------------------------------------------------------------

export const new_histo_login = async (user: any, device: string) => {
    const details = generateConnexionDetails({ user, device });
    return await createHistorique('AUTH', 'SIGN-IN', details, user);
};

export const new_histo_register = async (user: any) => {
    const details = generateConnexionDetails({ ...user });
    return await createHistorique('AUTH', 'SIGN-UP', details, user);
};


/* ===============================================================================
|         SELECT get All
=============================================================================== */
export const getAllHistoriques = async (req: Request, res: Response) => {
    try {
        const { type, subtype, startDate, endDate } = req.query;
        const filter: any = {};

        if (type) filter.type = type;
        if (subtype) filter.subtype = subtype;
        if (startDate || endDate) {
            filter.histo_date = {};
            if (startDate) filter.histo_date.$gte = new Date(startDate as string);
            if (endDate) filter.histo_date.$lte = new Date(endDate as string);
        }

        const historiques = await Historique.find(filter)
            .populate('user', 'firstname lastname email') // Populate user details
            .populate('vehicle', 'model brand') // Populate vehicle details
            .populate('ride', 'start_location end_location') // Populate ride details
            .sort({ histo_date: -1 });

        return res.status(200).json({ success: true, historiques });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve historiques', error });
    }
};

