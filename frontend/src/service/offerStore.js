import { defineStore } from 'pinia'

export const useOfferStore = defineStore('offer', {
  state: () => ({
    offerId: '',
    amount: '',
  }),
  actions: {
    setOfferId(data) {
      this.offerId = data
    },
    setAmount(data) {
      this.amount = data
    },
    clear() {
      this.offerId = ''
      this.amount = ''
    },
  },
  persist: true,
})
