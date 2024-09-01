<template>
  <div id="app">
    <h1>Конвертер валют</h1>
    <div class="converter">
      <input
        type="number"
        v-model="amount"
        @input="convertCurrency"
        class="input"
      />
      <select v-model="baseCurrency" @change="fetchExchangeRate" class="select">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <span>в</span>
      <select v-model="targetCurrency" @change="fetchExchangeRate" class="select">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <h2>Результат: {{ convertedAmount }} {{ targetCurrency }}</h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

function getBrowserLocale() {
  const locale = navigator.language || navigator.userLanguage;
  return locale;
}

function getCurrencyByLocale(locale) {
  return axios.post('https://your-api-endpoint.com/getCurrency/', { locale })
    .then(response => { 
      console.log('Response:', response);
      return response.data.currency || (locale.includes('ru') ? 'RUB' : 'USD');
    }).catch(() => {
      return locale.includes('ru') ? 'RUB' : 'USD';
    });
}


export default {
  data() {
    return {
      amount: 1,
      baseCurrency: '',
      targetCurrency: 'USD',
      currencies: [],
      exchangeRate: 1,
      convertedAmount: 0
    };
  },
  created() {
    const locale = getBrowserLocale();
    getCurrencyByLocale(locale).then(currency => {
      this.baseCurrency = currency;
      this.fetchCurrencies();
    });
  },
  methods: {
    fetchCurrencies() {
      axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => {
          //  console.log('Response:', response);
          this.currencies = Object.keys(response.data.rates);         
          this.fetchExchangeRate();
        });
    },
    fetchExchangeRate() {
      if (this.baseCurrency !== this.targetCurrency) {
        axios.get(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`)
          .then(response => {  
            // console.log('Response:', response);
            this.exchangeRate = response.data.rates[this.targetCurrency];
            this.convertCurrency();
          });
      } else {
        this.exchangeRate = 1;
        this.convertCurrency();
      }
    },
    convertCurrency() {
      this.convertedAmount = (this.amount * this.exchangeRate).toFixed(2);
    }
  }
}
</script>

