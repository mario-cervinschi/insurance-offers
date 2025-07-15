import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    personPolicyholderValues: {},
    personOwnerValues: {},
    vehicleValues: {},
    pti: '',
    isPolicyLegalEntity: '',
    isOwnerLegalEntity: '',
    cityCode: '',
  }),
  actions: {
    setPolicyholder(data) {
      this.personPolicyholderValues = data
    },
    setOwner(data) {
      this.personOwnerValues = data
    },
    setVehicle(data) {
      this.vehicleValues = data
    },
    setPTI(pti) {
      this.pti = pti
    },
    setPolicyLegalEntity(data) {
      this.isPolicyLegalEntity = data
    },
    setOwnerLegalEntity(data) {
      this.isOwnerLegalEntity = data
    },
    clear() {
      this.personPolicyholderValues = {}
      this.personOwnerValues = {}
      this.vehicleValues = {}
      this.pti = ''
      this.isPolicyLegalEntity = ''
      this.isOwnerLegalEntity = ''
    },
  },
  persist: true,
})
