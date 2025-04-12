/**
 * Calculate age in years from birthdate
 * @param birthDate - Date of birth
 * @returns Age in years
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // If birth month hasn't occurred yet this year or if birth month is current month
    // but birth day hasn't occurred yet, subtract one year from age
    if (
      monthDifference < 0 || 
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    
    return age;
  }
  