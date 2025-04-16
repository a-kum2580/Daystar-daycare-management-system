const generateSecurePassword = () => {
  const length = 12; // Password length
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  let password = '';
  
  // Ensure at least one character from each set
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length));

  // Fill the rest with random characters
  const allChars = Object.values(charset).join('');
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

module.exports = {
  generateSecurePassword
}; 