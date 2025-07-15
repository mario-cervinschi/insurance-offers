<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import InputComponent from '../form_inputs/InputComponent.vue';
import SelectorComponent from '../form_inputs/SelectorComponent.vue';
import { ValidationService } from '@/service/validationService';
import { ServiceAPI } from '@/service/apiService';
import { Service } from '@/service/service';
import RadioComponent from '../form_inputs/RadioComponent.vue';

const inputRefs = ref([]);

const setInputRef = (el, index) => {
    if (el) {
        inputRefs.value[index] = el;
    }
};

const props = defineProps({
    componentId: {
        type: String,
        required: true,
        default: 'default'
    },
    title: {
        type: String,
        default: `Detalii asigurare`
    },
    initialValues: Object,
    initialEntity: Boolean,
});

const isLegalEntity = ref(false);

const businessName = ref(""); //req if legal entity
const companyRegistryNumber = ref(""); //req if legal entity
const caenCode = ref(""); //req if legal entity
const lastName = ref(""); //req if NOT
const firstName = ref(""); //req if NOT
const isForeignPerson = ref(false);
const taxId = ref(""); //REQ
const nationality = ref("RO"); //req if foreign person
const citizenship = ref("RO"); //req if foreign person
const gender = ref(""); //req if foreign person
const birthdate = ref(""); //req if foreign person
const email = ref("");
const mobileNumber = ref("")

const identificationIdType = ref(''); //REQ
const identificationIdNumber = ref(""); //REQ
const identificationIssueAuthority = ref("");
const identificationIssueDate = ref("");

const drivingLicenseIssueDate = ref(""); //REQ if wanted idk

const addressCountry = ref("");
const addressCounty = ref(""); // REQ
const addressCity = ref("") // REQ
const addressCityCode = ref("") // REQ
const addressStreet = ref("") // REQ
const addressHouseNumber = ref("");
const addressBuilding = ref("");
const addressStaircase = ref("");
const addressApartment = ref("");
const addressFloor = ref("");
const addressPostcode = ref("");

const personHasDisability = ref(false);
const personIsRetired = ref(false);

const nationalities = ref([]);
const counties = ref([]);
const cities = ref([]);

const errorTaxId = ref('Camp necesar');
const errorCUI = ref('Camp necesar');
const errorBirthdate = ref('Camp necesar');
const errorReleaseDateIdentif = ref('');
const errorReleaseDateAuto = ref('Camp necesar');
const errorEmail = ref('');
const errorPhone = ref('');

const getUniqueId = (x) => `${props.componentId}_${x}`;
const getUniqueName = (x) => `${props.componentId}_${x}`;

const fetchNationalities = async () => {
    if (nationalities.value.length === 0) {
        const data = await ServiceAPI.fetchNationalities();
        nationalities.value = data;
    }
}

const fetchCounties = async () => {
    const data = await ServiceAPI.fetchCounties();
    if (data && data.length > 0) {
        counties.value = data.filter(county => county.country === addressCountry.value);
    } else {
        counties.value = [];
    }
};

const fetchCities = async (city) => {
    const data = await ServiceAPI.fetchCities(city);
    cities.value = data;
};

const nationalityOptions = computed(() => {
    if (!isForeignPerson.value) {
        if (nationality.value !== 'RO') {
            nationality.value = 'RO'
        }
    }
    return Service.reformatNationalitiesForSelector(isForeignPerson, nationalities);
})

const countryOptions = computed(() => {
    return Service.reformatCountriesForSelector(nationalities);
})

const countyOptions = computed(() => {
    return Service.reformatCountiesForSelector(counties);
})

const cityOptions = computed(() => {
    return Service.reformatCitiesForSelector(cities);
})

const onNationalityClick = () => {
    fetchNationalities();
}

watch(taxId, (changedTaxId) => {
    const result = ValidationService.validateTaxId(changedTaxId, isLegalEntity.value);
    errorTaxId.value = result.message;
});

watch(companyRegistryNumber, (changedCompanyRegistryNumber) => {
    if (changedCompanyRegistryNumber === "") {
        errorCUI.value = "Camp necesar";
        return;
    }
    const result = ValidationService.validateTaxId(changedCompanyRegistryNumber, isLegalEntity.value);
    errorCUI.value = result.message;
});

watch(identificationIssueDate, (changedIdentificaitonIssueDate) => {
    if (changedIdentificaitonIssueDate === "") {
        errorReleaseDateIdentif.value = "";
        return;
    }
    const result = ValidationService.validateDateBeforeToday(changedIdentificaitonIssueDate);
    errorReleaseDateIdentif.value = result.message;
})

watch(drivingLicenseIssueDate, (changedDrivingLicenseIssueDate) => {
    if (changedDrivingLicenseIssueDate === "") {
        errorReleaseDateAuto.value = "Camp necesar";
        return;
    }
    const result = ValidationService.validateDateBeforeToday(changedDrivingLicenseIssueDate);
    errorReleaseDateAuto.value = result.message;
})

watch(email, (changedEmail) => {
    if (changedEmail === "") {
        errorEmail.value = "";
        return;
    }
    const result = ValidationService.validateEmail(changedEmail);
    if (result) {
        errorEmail.value = "OK";
    } else {
        errorEmail.value = "Adresa invalida";
    }
})

watch(mobileNumber, (changedMobileNumber) => {
    if (changedMobileNumber === "") {
        errorPhone.value = "";
        return;
    }
    const result = ValidationService.validatePhoneNumber(changedMobileNumber);
    if (result) {
        errorPhone.value = "OK";
    } else {
        errorPhone.value = "Numar invalid";
    }
});

watch(isForeignPerson, (val) => {
    if (!val) {
        nationality.value = "RO"
        citizenship.value = "RO"
    } else {
        nationality.value = "";
        citizenship.value = "";
    }
})

let cityWatchInitialized = false;

watch(addressCity, (newCityName) => {
    if (!cityWatchInitialized) {
        cityWatchInitialized = true;
        return;
    }
    const selectedCity = cities.value.find(city => city.name === newCityName);
    if (selectedCity) {
        addressCityCode.value = selectedCity.siruta || "";
    } else {
        addressCityCode.value = "";
    }
});

watch(addressCountry, (newCountry) => {
    if (newCountry) {
        fetchCounties(newCountry);
    } else {
        counties.value = [];
    }
});

watch(isLegalEntity, (val) => {
    if (!val) {
        businessName.value = "";
        caenCode.value = "";
        companyRegistryNumber.value = "";
        identificationIdNumber.value = "";
        identificationIdType.value = "";
        identificationIssueAuthority.value = "";
        identificationIssueDate.value = "";
    }
})

watch(addressCounty, (newCounty) => {
    if (newCounty) {
        fetchCities(newCounty);
    } else {
        counties.value = [];
    }
});

watch(birthdate, (newBirthDate) => {
    const result = ValidationService.validateBirthdate(newBirthDate);
    errorBirthdate.value = result.message;
});

const triggerValidation = () => {
    inputRefs.value.forEach(inputRef => {
        if (inputRef && inputRef.triggerValidation) {
            inputRef.triggerValidation();
        }
    });
};

const validate = () => {
    triggerValidation();

    if (isLegalEntity.value) {
        if (!businessName.value) {
            return false;
        }
        if (!companyRegistryNumber.value || errorCUI.value !== '') {
            return false;
        }
        if (!caenCode.value) {
            return false;
        }
    } else {
        if (!identificationIdNumber.value) {
            return false;
        }
        if (!identificationIdType.value) {
            return false;
        }
    }

    if (!lastName.value) {
        return false;
    }
    if (!firstName.value) {
        return false;
    }
    if (!taxId.value || errorTaxId.value !== '') {
        return false;
    }

    if (email.value !== '' && errorEmail.value !== 'OK') {
        return false;
    }
    if (mobileNumber.value !== '' && errorPhone.value !== 'OK') {
        return false;
    }

    if (isForeignPerson.value) {
        if (!nationality.value) {
            return false;
        }
        if (!citizenship.value) {
            return false;
        }
        if (!gender.value) {
            return false;
        }
        if (!birthdate.value || errorBirthdate.value !== '') {
            return false;
        }
    }

    if (errorReleaseDateIdentif.value) return false;

    if (!drivingLicenseIssueDate.value) {
        return false;
    }

    if (!addressCountry.value) {
        return false;
    }
    if (!addressCounty.value) {
        return false;
    }
    if (!addressCity.value) {
        return false;
    }
    if (!addressStreet.value) {
        return false;
    }
    if (!addressHouseNumber.value) {
        return false;
    }

    return true;
};

const setValues = (values) => {
    if (!values) return;

    isLegalEntity.value = values.legalEntity || false;
    lastName.value = values.lastName || '';
    firstName.value = values.firstName || '';
    isForeignPerson.value = values.isForeignPerson || false;
    taxId.value = values.taxId || '';
    nationality.value = values.nationality || 'RO';
    citizenship.value = values.citizenship || 'RO';
    gender.value = values.gender || '';
    birthdate.value = values.birthdate || '';
    email.value = values.email || '';
    mobileNumber.value = values.mobileNumber || '';

    identificationIdType.value = values.identification?.idType || '';
    identificationIdNumber.value = values.identification?.idNumber || '';
    identificationIssueAuthority.value = values.identification?.issueAuthority || '';
    identificationIssueDate.value = values.identification?.issueDate || '';

    drivingLicenseIssueDate.value = values.drivingLicense?.issueDate || '';

    addressCountry.value = values.address?.country || '';
    addressCounty.value = values.address?.county || '';
    addressCity.value = values.address?.city || '';
    addressCityCode.value = values.address?.cityCode || '';
    addressStreet.value = values.address?.street || '';
    addressHouseNumber.value = values.address?.houseNumber || '';
    addressBuilding.value = values.address?.building || '';
    addressStaircase.value = values.address?.staircase || '';
    addressApartment.value = values.address?.apartment || '';
    addressFloor.value = values.address?.floor || '';
    addressPostcode.value = values.address?.postcode || '';

    personHasDisability.value = values.hasDisability || false;
    personIsRetired.value = values.isRetired || false;

    businessName.value = values.businessName || '';
    companyRegistryNumber.value = values.companyRegistryNumber || '';
    caenCode.value = values.caenCode || '';
};

watch(() => props.initialValues, (newVal) => {
    if (newVal) setValues(newVal);
}, { immediate: true });

watch(() => props.initialEntity, (newVal) => {
    if (newVal) isLegalEntity.value = newVal;
}, { immediate: true });

const getLegalEntity = () => { return isLegalEntity.value };

const getValues = () => {
    const values = {
        lastName: lastName.value,
        firstName: firstName.value,
        isForeignPerson: isForeignPerson.value,
        taxId: taxId.value,
        nationality: nationality.value,
        citizenship: citizenship.value,
        gender: gender.value,
        birthdate: birthdate.value,
        email: email.value,
        mobileNumber: mobileNumber.value,
        identification: {
            idType: identificationIdType.value,
            idNumber: identificationIdNumber.value,
            issueAuthority: identificationIssueAuthority.value,
            issueDate: identificationIssueDate.value
        },
        drivingLicense: {
            issueDate: drivingLicenseIssueDate.value
        },
        address: {
            country: addressCountry.value,
            county: addressCounty.value,
            city: addressCity.value,
            cityCode: addressCityCode.value,
            street: addressStreet.value,
            houseNumber: addressHouseNumber.value,
            building: addressBuilding.value,
            staircase: addressStaircase.value,
            apartment: addressApartment.value,
            floor: addressFloor.value,
            postcode: addressPostcode.value
        },
        hasDisability: personHasDisability.value,
        isRetired: personIsRetired.value
    };

    if (businessName.value !== "") {
        values.businessName = businessName.value,
            values.companyRegistryNumber = companyRegistryNumber.value,
            values.caenCode = caenCode.value;
    }

    return values;
};

defineExpose({
    getValues,
    validate,
    getLegalEntity
});

onMounted(() => {
    fetchNationalities();
}) 
</script>

<template>
    <div class="my-4">

        <h5 class="text-xl font-semibold text-white">Informatii personale</h5>
        <hr class="mt-2 border-gray-200">

        <RadioComponent v-model="isLegalEntity" :options="[
            { label: 'Persoana fizica', value: false },
            { label: 'Persoana juridica', value: true }
        ]" :name="getUniqueId('entityType')" :dark="true" :ref="(el) => setInputRef(el, 0)" />

        <div v-if="isLegalEntity" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 1)" :id="getUniqueId('businessName')" labelData="Nume afacere"
                type="text" v-model="businessName" :dark="true"
                :errorMessage="businessName === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 2)" :id="getUniqueId('regCode')" labelData="Cod inregistrare"
                type="text" v-model="companyRegistryNumber" :dark="true" :errorMessage="errorCUI"></InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 3)" :id="getUniqueId('caen')" labelData="CAEN" type="text"
                v-model="caenCode" :dark="true" :errorMessage="caenCode === '' ? 'Camp necesar' : ''">
            </InputComponent>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 4)" :id="getUniqueId('lastName')" labelData="Nume" type="text"
                v-model="lastName" :dark="true" :errorMessage="lastName === '' ? 'Camp necesar' : ''"></InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 5)" :id="getUniqueId('firstName')" labelData="Prenume"
                type="text" v-model="firstName" :dark="true" :errorMessage="firstName === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 6)" :id="getUniqueId('taxId')" labelData="CNP" type="text"
                v-model="taxId" :dark="true" :errorMessage="errorTaxId">
            </InputComponent>
        </div>

        <div :class="[
            'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
            // isForeignPerson ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        ]">
            <!-- Not foreign (false) -->
            <RadioComponent class="col-span-1 sm:col-span-2 md:col-span-1" v-model="isForeignPerson" :options="[
                { label: 'Roman', value: false },
                { label: 'Strain', value: true }
            ]" :name="getUniqueId('foreign')" :dark="true" />

            <SelectorComponent class="col-span-1 sm:col-span-1" :ref="(el) => setInputRef(el, 7)"
                :id="getUniqueId('nationality')" labelData="Nationalitate" :options="nationalityOptions"
                v-model="nationality" :disabled="!isForeignPerson" @click="onNationalityClick"
                :errorMessage="nationality === '' ? 'Camp necesar' : ''" />
            <SelectorComponent class="col-span-1 sm:col-span-1" :ref="(el) => setInputRef(el, 8)"
                :id="getUniqueId('citizenship')" labelData="Cetatenie" :options="nationalityOptions"
                v-model="citizenship" :disabled="!isForeignPerson" @click="onNationalityClick"
                :errorMessage="citizenship === '' ? 'Camp necesar' : ''" />

            <div v-if="isForeignPerson" class="grid-cols-1"></div>

            <SelectorComponent :ref="(el) => setInputRef(el, 9)" v-if="isForeignPerson" :id="getUniqueId('gender')"
                labelData="Sex" :options="[{ 'value': 'm', 'label': 'Masculin' }, { 'value': 'f', 'label': 'Feminin' }]"
                v-model="gender" @click="onNationalityClick" :errorMessage="gender === '' ? 'Camp necesar' : ''" />

            <InputComponent :ref="(el) => setInputRef(el, 10)" v-if="isForeignPerson" :id="getUniqueId('birthDate')"
                labelData="Data nastere" type="date" v-model="birthdate" :dark="true" :errorMessage="errorBirthdate">
            </InputComponent>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputComponent :id="getUniqueId('email')" labelData="Email" type="text" v-model="email" :dark="true"
                :errorMessage="(errorEmail !== '' && errorEmail !== 'OK') ? errorEmail.valueOf() : ''"
                :infoMessage="errorEmail === '' ? 'Camp necesar pentru anumiti asiguratori' : ''">
            </InputComponent>
            <InputComponent :id="getUniqueId('phone')" labelData="Telefon (RO)" type="text" v-model="mobileNumber"
                :dark="true" :errorMessage="(errorPhone !== '' && errorPhone !== 'OK') ? errorPhone.valueOf() : ''"
                :infoMessage="errorPhone === '' ? 'Camp necesar pentru anumiti asiguratori' : ''">
            </InputComponent>
        </div>

        <div v-if="!isLegalEntity">
            <h5 class="text-xl font-semibold text-white">Date identificare</h5>
            <hr class="mt-2 border-gray-200">

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <SelectorComponent :ref="(el) => setInputRef(el, 11)" :id="getUniqueId('idType')" labelData="Tip"
                    :options="[{ 'value': 'CI', 'label': 'CI' }, { 'value': 'PASSPORT', 'label': 'Pasaport' }]"
                    v-model="identificationIdType" :errorMessage="identificationIdType === '' ? 'Camp necesar' : ''" />
                <InputComponent :ref="(el) => setInputRef(el, 12)" :id="getUniqueId('idNumber')"
                    labelData="Serie si numar" type="text" v-model="identificationIdNumber" :dark="true"
                    :errorMessage="(identificationIdNumber === '') ? 'Camp necesar' : ''">
                </InputComponent>
                <InputComponent :id="getUniqueId('issueAuth')" labelData="Unitate emitenta" type="text"
                    v-model="identificationIssueAuthority" :dark="true">
                </InputComponent>
                <InputComponent :id="getUniqueId('issueDate')" labelData="Data eliberare" type="date"
                    v-model="identificationIssueDate" :dark="true" :errorMessage="errorReleaseDateIdentif">
                </InputComponent>
            </div>
        </div>

        <h5 class="text-xl font-semibold text-white">Date permis auto</h5>
        <hr class="mt-2 border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 13)" :id="getUniqueId('driverLicense')"
                labelData="Data eliberare permis" type="date" v-model="drivingLicenseIssueDate" :dark="true"
                :errorMessage="errorReleaseDateAuto">
            </InputComponent>
        </div>

        <h5 class="text-xl font-semibold text-white">Adresa</h5>
        <hr class="mt-2 border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <SelectorComponent :ref="(el) => setInputRef(el, 14)" :id="getUniqueId('country')" labelData="Tara"
                :options="countryOptions" v-model="addressCountry" @click="onNationalityClick"
                :errorMessage="addressCountry === '' ? 'Camp necesar' : ''" />
            <SelectorComponent :ref="(el) => setInputRef(el, 15)" :id="getUniqueId('county')" labelData="Judet"
                :options="countyOptions" v-model="addressCounty"
                :errorMessage="addressCounty === '' ? 'Camp necesar' : ''" />
            <SelectorComponent :ref="(el) => setInputRef(el, 16)" :id="getUniqueId('city')" labelData="Oras"
                :options="cityOptions" v-model="addressCity" :errorMessage="addressCity === '' ? 'Camp necesar' : ''" />
            <InputComponent :ref="(el) => setInputRef(el, 17)" :id="getUniqueId('street')" labelData="Strada"
                type="text" v-model="addressStreet" :dark="true"
                :errorMessage="(addressStreet === '') ? 'Camp necesar' : ''">
            </InputComponent>
        </div>

        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 18)" :id="getUniqueId('houseNr')" labelData="Numar"
                type="text" v-model="addressHouseNumber" :dark="true"
                :errorMessage="(addressHouseNumber === '') ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 19)" :id="getUniqueId('block')" labelData="Bloc" type="text"
                v-model="addressBuilding" :dark="true" :errorMessage="(addressBuilding === '') ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :id="getUniqueId('stair')" labelData="Scara" type="text" v-model="addressStaircase"
                :dark="true" :infoMessage="(addressStaircase === '') ? 'Camp necesar pentru unii asiguratori' : ''">
            </InputComponent>
            <InputComponent :id="getUniqueId('ap')" labelData="Ap" type="text" v-model="addressApartment" :dark="true"
                :infoMessage="(addressApartment === '') ? 'Camp necesar pentru unii asiguratori' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 20)" :id="getUniqueId('floor')" labelData="Etaj" type="text"
                v-model="addressFloor" :dark="true" :errorMessage="(addressFloor === '') ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 21)" :id="getUniqueId('postcode')" labelData="Cod Postal"
                type="text" v-model="addressPostcode" :dark="true"
                :errorMessage="(addressPostcode === '') ? 'Camp necesar' : ''">
            </InputComponent>
        </div>

        <h5 class="text-xl font-semibold text-white">Date aditionale</h5>
        <hr class="mt-2 border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div class="flex gap-2 items-center justify-center sm:justify-normal flex-1">
                <p class="mb-1 text-white tracking-wide font-medium">Dizabilitati</p>
                <RadioComponent v-model="personHasDisability" :options="[
                    { label: 'Nu', value: false },
                    { label: 'Da', value: true }
                ]" :name="getUniqueName('disability')" :dark="true" />
            </div>

            <div class="flex gap-2 items-center justify-center sm:justify-normal flex-1">
                <p class="mb-1 text-white tracking-wide font-medium">Pensionar</p>
                <RadioComponent v-model="personIsRetired" :options="[
                    { label: 'Nu', value: false },
                    { label: 'Da', value: true }
                ]" :name="getUniqueName('retired')" :dark="true" />
            </div>
        </div>
    </div>
</template>