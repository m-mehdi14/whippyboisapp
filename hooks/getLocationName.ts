/* eslint-disable prettier/prettier */
import axios from 'axios';

export const getGeocode = async (latitude: any, longitude: any) => {
  const apiKey = 'AIzaSyBuzqzsIcuhUYAovZzlaj8ANGsKNk6ZTgE'; // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      // Extract the formatted address; adjust based on your specific needs
      return response.data.results[0].formatted_address;
    } else {
      throw new Error('Geocoding failed');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
