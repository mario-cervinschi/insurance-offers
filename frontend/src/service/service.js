export class Service {
  static reformatNationalitiesForSelector(isForeignPerson, nationalities) {
    if (!isForeignPerson.value) {
      return [{ value: 'RO', label: 'Romania' }]
    }

    return [
      { value: '', label: 'Alege nationalitate' },
      ...nationalities.value.map((n) => ({
        value: n.iso2,
        label: n.nameRO,
      })),
    ]
  }

  static reformatCountriesForSelector(nationalities) {
    return [
      // { value: '', label: 'Alege tara' },
      ...nationalities.value.map((n) => ({
        value: n.iso2,
        label: n.nameRO,
      })),
    ]
  }

  static reformatCountiesForSelector(counties) {
    return [
      // { value: '', label: 'Alege oras' },
      ...counties.value.map((n) => ({
        value: n.code,
        label: n.name,
      })),
    ]
  }

  static reformatCitiesForSelector(cities) {
    return [
      // { value: '', label: 'Alege oras' },
      ...cities.value.map((n) => ({
        value: n.name,
        label: n.name,
      })),
    ]
  }

  static getVehicleTypes() {
    return [
      { label: 'M1 - Autoturisme (max. 8 locuri + șofer)', value: 'M1' },
      { label: 'M1G - Autoturisme off-road (4x4, SUV)', value: 'M1G' },
      { label: 'M2 - Microbuze < 5t cu peste 8 locuri', value: 'M2' },
      { label: 'M2G - Microbuze off-road', value: 'M2G' },
      { label: 'M3 - Autobuze ≥ 5t', value: 'M3' },
      { label: 'M3G - Autobuze off-road', value: 'M3G' },
      { label: 'N1 - Autoutilitare ≤ 3.5t', value: 'N1' },
      { label: 'N1G - Autoutilitare off-road', value: 'N1G' },
      { label: 'N2 - Transport marfă 3.5–12t', value: 'N2' },
      { label: 'N2G - Transport marfă off-road', value: 'N2G' },
      { label: 'N3 - Camioane > 12t', value: 'N3' },
      { label: 'N3G - Camioane off-road', value: 'N3G' },
      { label: 'O1 - Remorci ≤ 0.75t', value: 'O1' },
      { label: 'O2 - Remorci 0.75–3.5t', value: 'O2' },
      { label: 'O3 - Remorci 3.5–10t', value: 'O3' },
      { label: 'O4 - Remorci > 10t', value: 'O4' },
      { label: 'L1e - Mopede 2 roți ≤ 45 km/h', value: 'L1e' },
      { label: 'L2e - Mopede 3 roți', value: 'L2e' },
      { label: 'L3e - Motociclete', value: 'L3e' },
      { label: 'L4e - Motociclete cu ataș', value: 'L4e' },
      { label: 'L5e - Tricicluri cu motor', value: 'L5e' },
      { label: 'L6e - Cvadricele ușoare (≤ 45 km/h)', value: 'L6e' },
      { label: 'L7e - Cvadricele grele (ATV-uri mari)', value: 'L7e' },
      { label: 'T - Tractoare agricole/silvice', value: 'T' },
      { label: 'C - Vehicule mobile construcții', value: 'C' },
      { label: 'R - Mașini agricole remorcate', value: 'R' },
      { label: 'S - Vehicule industriale lente', value: 'S' },
    ]
  }

  static getRegistrationTypes() {
    return [
      { label: 'Alege status vehicul', value: '' },
      { label: 'Inregistrat', value: 'registered' },
      { label: 'Inscris', value: 'recorded' },
      { label: 'Inregistrat temp.', value: 'temporaryRegistered' },
      { label: 'Inscris temp.', value: 'temporaryRecorded' },
    ]
  }

  static getGasTypes() {
    return [
      { label: 'Alege tip carburant', value: '' },
      { label: 'Diesel', value: 'diesel' },
      { label: 'Benzina', value: 'petrol' },
      { label: 'Electric', value: 'electric' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'GPL', value: 'lpg' },
    ]
  }

  static getUsageTypes() {
    return [
      { label: 'Alege utilizare vehicul', value: '' },
      { label: 'Personal', value: 'personal' },
      { label: 'Transport persoane', value: 'passengerTransportation' },
      { label: 'Taxi', value: 'taxi' },
      { label: 'Inchiriere', value: 'carRental' },
      { label: 'Scoala soferi', value: 'drivingSchool' },
      { label: 'Securitate', value: 'security' },
      { label: 'Curierat', value: 'courier' },
      { label: 'Transport marfa', value: 'cargoTransportation' },
      { label: 'Distributie', value: 'distribution' },
    ]
  }
}
