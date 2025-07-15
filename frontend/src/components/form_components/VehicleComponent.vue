<script setup>
import { ref, watch } from 'vue';
import InputComponent from '../form_inputs/InputComponent.vue';
import SelectorComponent from '../form_inputs/SelectorComponent.vue';
import { Service } from '@/service/service';
import { ValidationService } from '@/service/validationService';
import RadioComponent from '../form_inputs/RadioComponent.vue';

const props = defineProps({
    initialValues: Object,
});


const inputRefs = ref([]);

const setInputRef = (el, index) => {
    if (el) {
        inputRefs.value[index] = el;
    }
};

const driverLastName = ref("");
const driverFirstName = ref("");
const driverTaxId = ref("");
const driverIdentif = ref("");
const driverMobileNumber = ref("");

const licensePlate = ref("");
const registrationType = ref("");
const vin = ref("");
const vehicleType = ref("");
const brand = ref("");
const model = ref("");
const year = ref("");
const displacement = ref("");
const power = ref("");
const weight = ref("");
const seats = ref("");
const fuelType = ref("");
const firstReg = ref("");
const ptiExpiryDate = ref("");
const usage = ref("");
const vehicleCIV = ref("");
const currentMileage = ref("");
const carForDisabled = ref(false);
const isLeased = ref(false);

const errorPTI = ref('');
const errorTaxId = ref('Camp necesar');
const errorPhone = ref('Camp necesar');
const errorLicensePlate = ref('');
const errorDisplacement = ref('');
const errorPower = ref('');
const errorSeats = ref('');
const errorFuelType = ref('');

watch(driverMobileNumber, (changedMobileNumber) => {
    if (changedMobileNumber === "") {
        errorPhone.value = "Camp necesar";
        return;
    }
    const result = ValidationService.validatePhoneNumber(changedMobileNumber);
    errorPhone.value = result.message;

});

watch(driverTaxId, (changedTaxId) => {
    const result = ValidationService.validateCNP(changedTaxId);
    errorTaxId.value = result.message;
});

watch(ptiExpiryDate, (newPtiExpiryDate) => {

    if (ValidationService.validateDateAfterToday(newPtiExpiryDate)) {
        errorPTI.value = "OK";
    } else {
        errorPTI.value = "ITP expirat"
    }

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

    const isRegistered = ['registered', 'temporaryRegistered'].includes(registrationType.value);
    const isElectric = fuelType.value === 'electric';
    const isTrailer = /^O[1-4]$/i.test(vehicleType.value);

    let isValid = true;

    errorLicensePlate.value = '';
    errorDisplacement.value = '';
    errorPower.value = '';
    errorSeats.value = '';
    errorFuelType.value = '';

    if (!driverLastName.value) isValid = false;
    if (!driverFirstName.value) isValid = false;
    if (!driverIdentif.value || errorTaxId.value !== '') isValid = false;
    if (!driverMobileNumber.value || (errorPhone.value !== '' && errorPhone.value !== 'OK')) isValid = false;
    if (!registrationType.value) isValid = false;

    if (isRegistered && !licensePlate.value) {
        errorLicensePlate.value = 'Camp necesar pentru vehicule inmatriculate';
        isValid = false;
    }

    if (!vin.value) isValid = false;
    if (!vehicleType.value) isValid = false;
    if (!brand.value) isValid = false;
    if (!model.value) isValid = false;
    if (!year.value) isValid = false;
    if (!weight.value) isValid = false;
    if (!usage.value) isValid = false;
    if (!vehicleCIV.value) isValid = false;
    if (!currentMileage.value) isValid = false;
    if (!driverTaxId.value) isValid = false;

    if (!isTrailer && !isElectric && !displacement.value) {
        errorDisplacement.value = 'Camp necesar pentru vehicule non-electrice';
        isValid = false;
    }

    if (!isTrailer) {
        if (!power.value) {
            errorPower.value = 'Camp necesar pentru vehicule non-remorca';
            isValid = false;
        }
        if (!seats.value) {
            errorSeats.value = 'Camp necesar pentru vehicule non-remorca';
            isValid = false;
        }
        if (!fuelType.value) {
            errorFuelType.value = 'Camp necesar pentru vehicule non-remorca';
            isValid = false;
        }
    }

    return isValid;
};

const setValues = (data) => {
    if (!data) return;

    const driverData = data.driver?.[0] || {};

    driverLastName.value = driverData.lastName || '';
    driverFirstName.value = driverData.firstName || '';
    driverTaxId.value = driverData.taxId || '';
    driverIdentif.value = driverData.identification?.idNumber || '';
    driverMobileNumber.value = driverData.mobileNumber || '';

    licensePlate.value = data.licensePlate || '';
    registrationType.value = data.registrationType || '';
    vin.value = data.vin || '';
    vehicleType.value = data.vehicleType || '';
    brand.value = data.brand || '';
    model.value = data.model || '';
    year.value = data.yearOfConstruction || '';
    displacement.value = data.engineDisplacement || '';
    power.value = data.enginePower || '';
    weight.value = data.totalWeight || '';
    seats.value = data.seats || '';
    fuelType.value = data.fuelType || '';
    firstReg.value = data.firstRegistration || '';
    usage.value = data.usageType || '';
    vehicleCIV.value = data.identification?.idNumber || '';
    currentMileage.value = data.currentMileage || '';
    carForDisabled.value = data.hasMobilityModifications || false;
    isLeased.value = data.isLeased || false;
};

watch(() => props.initialValues, (newVal) => {
    if (newVal) setValues(newVal);
}, { immediate: true });

const getValues = () => {
    return {
        driver: [{
            lastName: driverLastName.value,
            firstName: driverFirstName.value,
            taxId: driverTaxId.value,
            identification: {
                idNumber: driverIdentif.value
            },
            mobileNumber: driverMobileNumber.value
        }],
        licensePlate: licensePlate.value,
        registrationType: registrationType.value,
        vin: vin.value,
        vehicleType: vehicleType.value,
        brand: brand.value,
        model: model.value,
        yearOfConstruction: year.value,
        engineDisplacement: displacement.value,
        enginePower: power.value,
        totalWeight: weight.value,
        seats: seats.value,
        fuelType: fuelType.value,
        firstRegistration: firstReg.value,
        usageType: usage.value,
        identification: {
            idNumber: vehicleCIV.value,
        },
        currentMileage: currentMileage.value,
        hasMobilityModifications: carForDisabled.value,
        isLeased: isLeased.value
    }
};

const getPTI = () => {
    return { expirationDatePti: ptiExpiryDate.value };
}

defineExpose({
    getValues,
    getPTI,
    validate
});

</script>

<template>
    <div class="my-4">

        <h5 class="text-xl font-semibold text-white">Informatii sofer</h5>
        <hr class="mt-2 border-gray-200">

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 0)" class="col-span-1" id="driverLastName" labelData="Nume"
                type="text" v-model="driverLastName" :dark="true"
                :errorMessage="driverLastName === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 1)" class="col-span-1" id="driverFirstName"
                labelData="Prenume" type="text" v-model="driverFirstName" :dark="true"
                :errorMessage="driverFirstName === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 2)" class="col-span-1" id="driverTaxId" labelData="CNP"
                type="text" v-model="driverTaxId" :dark="true" :errorMessage="errorTaxId">
            </InputComponent>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div></div>
            <InputComponent :ref="(el) => setInputRef(el, 3)" id="driverIdentif" labelData="Serie / numar" type="text"
                v-model="driverIdentif" :dark="true" :errorMessage="driverIdentif === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 4)" id="driverMobileNumber" labelData="Telefon" type="text"
                v-model="driverMobileNumber" :dark="true"
                :errorMessage="(errorPhone !== '' && errorPhone !== 'OK') ? errorPhone.valueOf() : ''">
            </InputComponent>
            <div></div>
        </div>

        <h5 class="text-xl font-semibold text-white">Informatii vehicul</h5>
        <hr class="mt-2">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 5)" id="licensePlate" labelData="Nr Inmatriculare" type="text"
                v-model="licensePlate" :dark="true" :errorMessage="errorLicensePlate">
            </InputComponent>
            <SelectorComponent :ref="(el) => setInputRef(el, 6)" id="registrationType" labelData="Status"
                :options="Service.getRegistrationTypes()" v-model="registrationType"
                :errorMessage="registrationType === '' ? 'Camp necesar' : ''" />
            <InputComponent :ref="(el) => setInputRef(el, 7)" id="vin" labelData="Sasiu" type="text" v-model="vin"
                :dark="true" :errorMessage="vin === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <SelectorComponent :ref="(el) => setInputRef(el, 8)" id="vehicleType" labelData="Tip"
                :options="Service.getVehicleTypes()" v-model="vehicleType"
                :errorMessage="vehicleType === '' ? 'Camp necesar' : ''" />
        </div>

        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
            <InputComponent :ref="(el) => setInputRef(el, 9)" id="brand" labelData="Brand" type="text" v-model="brand"
                :dark="true" :errorMessage="brand === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 10)" id="model" labelData="Model" type="text" v-model="model"
                :dark="true" :errorMessage="model === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 11)" id="year" labelData="An" type="number" v-model="year"
                :dark="true" :errorMessage="year === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 12)" id="displacement" labelData="Capacitate" type="number"
                v-model="displacement" :dark="true" :errorMessage="errorDisplacement">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 13)" id="power" labelData="Putere" type="number"
                v-model="power" :dark="true" :errorMessage="errorPower">
            </InputComponent>
            <InputComponent :ref="(el) => setInputRef(el, 14)" id="weight" labelData="MTA (kg)" type="number"
                v-model="weight" :dark="true" :errorMessage="weight === '' ? 'Camp necesar' : ''">
            </InputComponent>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
            <InputComponent class="col-span-1" :ref="(el) => setInputRef(el, 15)" id="seats" labelData="Locuri"
                type="number" v-model="seats" :dark="true" :errorMessage="errorSeats">
            </InputComponent>
            <SelectorComponent class="col-span-1" :ref="(el) => setInputRef(el, 16)" id="fuelType"
                labelData="Combustibil" :options="Service.getGasTypes()" v-model="fuelType"
                :errorMessage="errorFuelType" />
            <InputComponent :ref="(el) => setInputRef(el, 17)" id="firstReg" labelData="Prima inreg." type="date"
                v-model="firstReg" :dark="true" :errorMessage="firstReg === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <InputComponent id="ptiExpiryDate" labelData="Expirare ITP" type="date" v-model="ptiExpiryDate" :dark="true"
                :errorMessage="(errorPTI !== '' && errorPTI !== 'OK') ? errorPTI.valueOf() : ''"
                :infoMessage="errorPTI === '' ? 'Camp necesar pentru unii asiguratori' : ''">
            </InputComponent>
            <SelectorComponent :ref="(el) => setInputRef(el, 18)" id="usage" labelData="Utilizare"
                :options="Service.getUsageTypes()" v-model="usage" :errorMessage="usage === '' ? 'Camp necesar' : ''" />
            <InputComponent :ref="(el) => setInputRef(el, 19)" id="vehicleCIV" labelData="CIV" type="text"
                v-model="vehicleCIV" :dark="true" :errorMessage="vehicleCIV === '' ? 'Camp necesar' : ''">
            </InputComponent>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="hidden md:block"></div>
            <InputComponent class="md:col-span-2" :ref="(el) => setInputRef(el, 20)" id="currentMileage"
                labelData="Numar km" type="number" v-model="currentMileage" :dark="true"
                :errorMessage="currentMileage === '' ? 'Camp necesar' : ''">
            </InputComponent>
            <div class="hidden md:block"></div>
            <div class="flex gap-2 items-center flex-1 mt-6 col-span-2 md:justify-normal justify-center">
                <p class="mb-1 text-white tracking-wide font-medium">Modificari dizabilitati</p>
                <RadioComponent v-model="carForDisabled" :options="[
                    { label: 'Nu', value: false },
                    { label: 'Da', value: true }
                ]" :name="'disabled'" :dark="true" />
            </div>
            <div class="flex gap-2 items-center flex-1 mt-6 col-span-2 md:justify-end justify-center">
                <p class="mb-1 text-white tracking-wide font-medium">Leased</p>
                <RadioComponent v-model="isLeased" :options="[
                    { label: 'Nu', value: false },
                    { label: 'Da', value: true }
                ]" :name="'leased'" :dark="true" />
            </div>
        </div>


    </div>
</template>
