import { v4 as uuidv4 } from 'uuid';

export const generateVerificationToken = () => {
  // Generate a random token using UUID v4
  const token = uuidv4();

  // Set expiry to 2 minutes from now
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 2);

  return { 
    token, 
    expiry 
  };
};