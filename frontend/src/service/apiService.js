export class ServiceAPI {
  static async fetchNationalities() {
    try {
      const response = await fetch('http://localhost:8000/api/countries')
      if (!response.ok) throw new Error('Failed to fetch countries')
      const data = await response.json()

      return data.data || data
    } catch (error) {
      console.error(error)
    }
  }

  static async fetchCounties() {
    try {
      const response = await fetch('http://localhost:8000/api/counties')
      if (!response.ok) throw new Error('Failed to fetch counties')
      const data = await response.json()

      return data.data || data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  static async fetchCities(city) {
    try {
      const response = await fetch('http://localhost:8000/api/cities/' + city)
      if (!response.ok) throw new Error('Failed to fetch counties')
      const data = await response.json()

      return data.data || data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  static async fetchOffers(product) {
    try {
      const response = await fetch('http://localhost:8000/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  }

  static async fetchPolicy(request) {
    try {
      const response = await fetch('http://localhost:8000/api/policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  }

  static async fetchOfferPdf(offerId) {
    try {
      const response = await fetch(`http://localhost:8000/api/offer/${offerId}`)

      if (!response.ok) {
        throw new Error('API error')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching offer pdf:', error)
      throw error
    }
  }
}
