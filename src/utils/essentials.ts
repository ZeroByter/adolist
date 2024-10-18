export const randomId = (length = 16) => {
  const alphabet = "qwertyuiopasdfghjklzxcvbnm0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
};

export const generateSubstrings = (str: string, minLength = 1) => {
  const substrings = [];
  for (let len = minLength; len <= str.length; len++) {
    for (let i = 0; i <= str.length - len; i++) {
      substrings.push(str.substring(i, i + len));
    }
  }
  return substrings;
};
