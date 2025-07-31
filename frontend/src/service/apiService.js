import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

const apiLogin = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

export class ServiceAPI {
  static async processRegistrationDocument(file) {
    try {
      const formData = new FormData()
      formData.append('document', file)
      const response = await api.post('/vehicles/process-registration-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      console.error('Error processing document:', error)
      throw error
    }
  }

  static async fetchNationalities() {
    try {
      const response = await api.get('/countries')
      // axios da throw la eroare automat => nu mai e nevoie de if (!response.ok)
      return response.data.data || response.data
      // in  axios, 'response.data' e deja format JSON
    } catch (error) {
      console.error('Error fetching countries:', error)
      return []
      // ^^ evitam sa returneze undefined, care poate face sa dea crash
    }
  }

  static async fetchCounties() {
    try {
      const response = await api.get('/counties')
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching counties:', error)
      return []
    }
  }

  static async fetchCities(city) {
    try {
      const response = await api.get(`/cities/${city}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching cities:', error)
      return []
    }
  }

  static async fetchOffers(product) {
    try {
      const response = await api.post('/offer', product)
      // method: 'POST' -> api.post(..), content-type este JSON impkicit in axios, si stringify se face direct
      return response.data
    } catch (error) {
      console.error('Error fetching offers:', error)
      throw error
    }
  }

  static async fetchPolicy(request) {
    try {
      const response = await api.post('/policy', request)
      return response.data
    } catch (error) {
      console.error('Error fetching policy:', error)
      throw error
    }
  }

  static async fetchOfferPdf(offerId) {
    try {
      const response = await api.get(`/offer/${offerId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching offer PDF:', error)
      throw error
    }
  }

  static async fetchDataForPerson(jsonToSend) {
    try {
      const response = await api.post(`/person`, jsonToSend)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  static async fetchDataForVehicle(jsonToSend) {
    try {
      const response = await api.post(`/vehicle`, jsonToSend)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }


}

export default apiLogin
