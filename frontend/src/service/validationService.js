export class ValidationService {
  static validateCNP(cnp) {
    if (!/^\d{13}$/.test(cnp)) {
      return { isValid: false, message: 'CNP trebuie sa contina 13 cifre' }
    }

    const firstDigit = parseInt(cnp[0])
    if (firstDigit < 1 || firstDigit > 8) {
      return { isValid: false, message: 'Prima cifra din CNP este invalida' }
    }

    const yearDigits = cnp.substring(1, 3)
    const month = parseInt(cnp.substring(3, 5))
    const day = parseInt(cnp.substring(5, 7))

    if (month < 1 || month > 12) {
      return { isValid: false, message: 'Luna din CNP este invalida' }
    }

    if (day < 1 || day > 31) {
      return { isValid: false, message: 'Ziua din CNP este invalida' }
    }

    let year
    switch (firstDigit) {
      case 1:
      case 2:
        year = 1900 + parseInt(yearDigits)
        break
      case 3:
      case 4:
        year = 1800 + parseInt(yearDigits)
        break
      case 5:
      case 6:
        year = 2000 + parseInt(yearDigits)
        break
      case 7:
      case 8:
        year = 1900 + parseInt(yearDigits)
        break
      default:
        return { isValid: false, message: 'Prima cifra din CNP este invalida' }
    }

    const birthDate = new Date(year, month - 1, day)
    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() + 1 !== month ||
      birthDate.getDate() !== day
    ) {
      return { isValid: false, message: 'Data nasterii din CNP este invalida' }
    }

    const today = new Date()
    let age = today.getFullYear() - year
    if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) {
      age--
    }
    if (age < 18) {
      return { isValid: false, message: 'Trebuie sa ai minim 18 ani' }
    }

    const controlWeights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
    let sum = 0

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnp[i]) * controlWeights[i]
    }

    const controlDigit = sum % 11
    const expectedControl = controlDigit < 10 ? controlDigit : 1

    if (parseInt(cnp[12]) !== expectedControl) {
      return { isValid: false, message: 'Cifra de control din CNP este invalida' }
    }

    return { isValid: true, message: '' }
  }

  static validateCUI(cui) {
    const cleanCUI = cui.replace(/^RO/i, '')

    if (!/^\d{2,10}$/.test(cleanCUI)) {
      return { isValid: false, message: 'CUI invalid' }
    }

    return { isValid: true, message: '' }
  }

  static validateTaxId(taxId, isLegalEntity) {
    if (!taxId) {
      return { isValid: false, message: 'Camp necesar' }
    }

    if (!isLegalEntity) {
      return this.validateCNP(taxId)
    } else {
      const cnpValidation = this.validateCNP(taxId)
      if (cnpValidation.isValid) {
        return cnpValidation
      }

      const cuiValidation = this.validateCUI(taxId)
      if (cuiValidation.isValid) {
        return cuiValidation
      }

      return { isValid: false, message: 'CNP sau Cod de inregistrare firma invalid' }
    }
  }

  static validatePhoneNumber(phone) {
    const phoneRegex = /^(\+40|0040|0)?\s?7\d{8}$/
    const cleanedPhone = phone.replace(/\s/g, '')
    const isValid = phoneRegex.test(cleanedPhone)
    return {
      isValid,
      message: isValid ? '' : 'Numar de telefon invalid',
    }
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    return {
      isValid,
      message: isValid ? '' : 'Email invalid',
    }
  }

  static validateBirthdate(birthdate) {
    if (!birthdate) {
      return { isValid: false, message: 'Camp necesar' }
    }

    const today = new Date()
    const birth = new Date(birthdate)

    if (isNaN(birth.getTime())) {
      return { isValid: false, message: 'Data invalida' }
    }

    if (birth > today) {
      return { isValid: false, message: 'Data nu poate fi in viitor' }
    }

    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    if (age < 18) {
      return { isValid: false, message: 'Trebuie sa ai minim 18 ani' }
    }

    return { isValid: true, message: '' }
  }

  static validateDateBeforeToday(date) {
    const inputDate = new Date(date)
    const today = new Date()

    inputDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const isValid = inputDate < today
    return {
      isValid,
      message: isValid ? '' : 'Data trebuie sa fie inainte de azi',
    }
  }

  static validateDateAfterToday(date) {
    const inputDate = new Date(date)
    const today = new Date()

    inputDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const isValid = inputDate > today
    return {
      isValid,
      message: isValid ? '' : 'Data trebuie sa fie dupa azi',
    }
  }
}
