import User from "./User";
// import Vehicle from "./Vehicle";
import { matchPassword } from "@server/services/crypto";


export const getUserLogin = async (email: string, password: string) => {
    try {
        const user = await User.findOne({ email: email }).lean();

        if (user) {
            if (password !== 'WHO') {
                const isValidPassword = await matchPassword(password, user.password);
                if (!isValidPassword)
                    return { message: "Mot de passe incorrect", userVu: null }
            }
            user.password = '';
            user.confirmationCode = '';
            user.tel_confirmationCode = '';

            if (user.is_driver) { //Driver
                // const vehicles = await Vehicle.find({ driver_id: user._id }).lean();
                return {
                    message: 'success', userVu: {
                        ...user,
                        // infos_client: undefined,
                        // vehicle: vehicles
                    }
                };
            } else {  // Client
                return {
                    message: 'success', userVu: {
                        ...user,
                        infos_driver: undefined,
                    }
                };
            }
        }
        return { message: "Compte introuvable", userVu: null }
    } catch (error) {
        return { message: "Compte introuvable", userVu: null }
    }
};


export const getUserByID = async (userId: string) => {
    try {
        const user = await User.findById(userId).lean()
        if (user) {
            user.password = '';
            user.confirmationCode = '';
            user.tel_confirmationCode = '';

            if (user.is_driver) { //Driver
                // const vehicles = await Vehicle.find({ driver_id: user._id }).lean();
                return {
                    message: 'success', userVu: {
                        ...user,
                        // infos_client: undefined,
                        // vehicle: vehicles
                    }
                };
            } else {  // Client
                return {
                    message: 'success', userVu: {
                        ...user,
                        infos_driver: undefined,
                    }
                };
            }
        }
        return { message: "Compte introuvable", userVu: null }
    } catch (error) {
        return { message: "Compte introuvable", userVu: null }
    }
};
