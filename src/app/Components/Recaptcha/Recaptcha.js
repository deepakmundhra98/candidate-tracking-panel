"use client";

import { useEffect } from 'react';
import axios from 'axios';
import BaseAPI from '@/app/BaseAPI/BaseAPI';

const Recaptcha = ({ setConstantsData }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(BaseAPI + "/getconstants", null, {
                    headers: {
                        "content-type": "Application/json",
                        // Authorization: "Bearer " + token,
                    }
                });

                console.log(response.data);
                setConstantsData(response.data.response);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, [setConstantsData]); // Include setConstantsData in dependency array

};

export default Recaptcha;


