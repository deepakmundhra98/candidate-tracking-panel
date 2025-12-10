"use Server"
import axios from "axios";
import BaseAPI from "/src/app/BaseAPI/BaseAPI";

export const getData = async () => {
    try {
        const response = await axios.post(BaseAPI + "/jobs/listing");
        return response.data.response; // Return the data instead of setting state
        return setLoading(true);
        
      } catch (error) {
        console.log(error.message);
        throw error; // Rethrow the error to handle it in the calling function
      }
       
    }

  
  export const getDescriptionData = async (slug) => {
    // const params = params.slug;
    
    try {
      const response = await axios.post(
        BaseAPI + `/jobs/description/${slug}`,
        null,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log(response.data.response)
      return response.data.response;
    } catch (error) {
      console.log(error.message);
    }
  };













