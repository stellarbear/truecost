export const remail = (email: string): any => ({$regex: email.trim(), $options: 'i'});