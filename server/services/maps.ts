// service/maps.ts

import { Client } from "@googlemaps/google-maps-services-js";
import { GOOGLE_MAPS_API_KEY } from "@server/services/const";

const client = new Client({});

export const getInfoContry = async (latitude: number, longitude: number) => {
    let ret: any = {
        pays: {},
        province: '',
        address: '',
    }

    try {
        const response = await client.reverseGeocode({
            params: {
                latlng: { lat: latitude, lng: longitude },
                key: GOOGLE_MAPS_API_KEY,
            },
        });

        // Extraire les informations requises
        if (response.data.results.length > 0) {
            const result = response.data.results[0];
            ret.pays = {
                name: result.address_components[result.address_components.length-1].long_name,
                code: result.address_components[result.address_components.length-1].short_name,
            };
            ret.province = result.address_components[2].long_name;
            ret.address = result.formatted_address;
        } else {
            throw new Error("No result found");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des informations :", error);
        throw error;
    }    
    return ret;
};
