import { mockUser } from './mockUser'

const mockApiLogin = {
  async get(url) {
    if (url === '/user') {
      const token = localStorage.getItem('authToken')
      if (token === 'fake-jwt-token') {
        return {
          data: mockUser,
        }
      } else {
        throw new Error('Unauthorized')
      }
    }

    throw new Error('Mock endpoint not implemented: ' + url)
  },
}

export default mockApiLogin
