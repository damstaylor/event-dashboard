<script setup>
import axios from "@/plugins/axios";
import { useMessageStore } from "@/stores/messageStore";
import { useAuthStore } from "@/stores/authStore";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const { authenticate } = useAuthStore();
const router = useRouter();

const data = reactive({
  useLastNameLoginMethod: false,
  valid: false,
  phoneNumberExists: false,
  lastName: "",
  phone: "",
  code: "",
  registrationNumber: "",
  MIN_LENGTH: 5,
  MAX_LENGTH: 8,
});

function toggleLoginMethod() {
  data.useLastNameLoginMethod = !data.useLastNameLoginMethod;
}

function trimMax() {
  if (data.registrationNumber.length > data.MAX_LENGTH) {
    data.registrationNumber = data.registrationNumber.slice(0, data.MAX_LENGTH);
  }
}

async function submit() {
  if (data.useLastNameLoginMethod) {
    loginWithRegistrationNumber();
    return;
  }
  if (data.phoneNumberExists) {
    loginWithCode();
  } else {
    requestCode();
  }
}
async function requestCode() {
  const auth = (
    await axios.post("/api/auth/sendCode", {
      phone: data.phone,
    })
  ).data;
  if (auth) {
    data.phoneNumberExists = true;
  } else {
    useMessageStore().error($t("login.phone_not_found"));
  }
}
async function loginWithCode() {
  const auth = (
    await axios.post("/api/auth/loginWithCode", {
      phone: data.phone,
      code: data.code,
    })
  ).data;

  if (!auth) {
    useMessageStore().error($t("login.incorrect_code"));
    return;
  }

  await authenticate(auth.access_token);

  router.push("/").catch(() => {});
}

async function loginWithRegistrationNumber() {
  const auth = (
    await axios.post("/api/auth/loginWithRegistrationNumber", {
      last_name: data.lastName,
      registration_number: data.registrationNumber,
    })
  ).data;

  if (!auth) {
    useMessageStore().error($t("login.incorrectRegistrationNumber"));
    return;
  }

  await authenticate(auth.access_token);

  router.push("/").catch(() => {});
}
</script>
<template>
  <div>
    <v-row justify="center" dense>
      <v-col cols="12" sm="8" md="6" lg="5" xl="4" align="center">
        <v-card class="mt-5 elevation-12">
          <v-card-title class="text-center pt-3">
            {{ $t("login.title") }}
          </v-card-title>

          <v-form @submit.prevent="submit" v-model="data.valid" v-if="!data.useLastNameLoginMethod">
            <v-card-text class="px-6">
              <v-phone-input
                defaultCountry="fr"
                v-model="data.phone"
                :countryLabel="null"
                :label="$t('login.phone')"
                :placeholder="$t('login.phone')"
                :preferCountries="['fr']"
                :rules="[$v.required()]"
                validate-on="blur"
              ></v-phone-input>
              <v-text-field
                class="prepend-icon-wide"
                v-if="data.phoneNumberExists"
                prepend-icon="mdi-key"
                :label="$t('login.code')"
                v-model="data.code"
                required
                :rules="[$v.required()]"
                type="number"
              ></v-text-field>
            </v-card-text>

            <v-card-actions class="justify-center pb-4">
              <v-btn v-show="!data.phoneNumberExists" type="submit" :disabled="!data.valid" color="secondary">
                {{ $t("login.sendCode") }}
              </v-btn>
              <v-btn v-show="data.phoneNumberExists" type="submit" :disabled="!data.valid" color="secondary">
                {{ $t("login.submit") }}
              </v-btn>
            </v-card-actions>
          </v-form>

          <v-form v-else @submit.prevent="submit" v-model="data.valid">
            <v-card-text class="px-6">
              <v-text-field
                v-model="data.lastName"
                :label="$t('login.lastName')"
                :placeholder="$t('login.lastName')"
              ></v-text-field>
              <v-text-field
                :label="$t('login.registrationNumber')"
                v-model="data.registrationNumber"
                required
                :rules="[$v.required(), $v.minLength(data.MIN_LENGTH), $v.maxLength(data.MAX_LENGTH)]"
                type="number"
                @input="trimMax"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn type="submit" :disabled="data.lastName && !data.valid" color="secondary">
                {{ $t("login.submit") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-btn
          justify="center"
          variant="plain"
          aria-label="Switch login method"
          class="mt-8"
          @click="toggleLoginMethod"
        >
          {{ data.useLastNameLoginMethod ? $t("login.signinWithSms") : $t("login.signinRegistration") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.prepend-icon-wide .v-input__prepend-outer {
  margin: 0 25px;
}
</style>
