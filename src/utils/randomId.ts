export const randomId = (length = 16) => {
  const alphabet = "qwertyuiopasdfghjklzxcvbnm0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
};
