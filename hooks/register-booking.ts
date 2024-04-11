/* eslint-disable prettier/prettier */
import {doc, getFirestore, setDoc} from 'firebase/firestore';
import {app} from './firebaseConfig';

interface registerBookingProps {
  quatity: string;
  date: Date;
  number: string;
  address: string;
  location: string;
  user: any;
}

export const registerBooking = async (options: registerBookingProps) => {
  try {
    const {quatity, date, number, address, location, user} = options;
    let db = getFirestore(app);

    if (!options || !user) {
      return {
        error: 'Please fill all the fields',
      };
    }

    await setDoc(doc(db, 'booking', user.user?.userId), {
      name: user.user?.name,
      email: user.user?.email,
      role: user.user?.role,
      userId: user.user.userId,
      booking: {
        quatity,
        date,
        number,
        address,
        location,
      },
    });

    return {
      success: 'Booked successfully!',
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
