const axios = require('axios')

// Environment variables
const FIXER_KEY = process.env.FIXER_KEY
// Formatting the fixer api URL
const apiUrlFormatted = `http://data.fixer.io/api/latest?access_key=${FIXER_KEY}&format=1` 

// Rest countries currency api url
const rcApiUrl = `https://restcountries.eu/rest/v2/currency/`

const getExchangeRate = async (fromCurrency, toCurrency) => {
    // Request to fixer api
    const response = await axios.get(apiUrlFormatted)
    
    // All rates
    const rate = response.data.rates
    
    // Euro
    const euro = 1 / rate[fromCurrency]
    // Exchange rate
    const exchangeRate = euro * rate[toCurrency]

    if (isNaN(exchangeRate)) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}.`)
    }

    return exchangeRate
}


const getCountries = async (toCurrency) => {
    try {
        // Formatting rest countries api url
        const rcApiUrlFormatted = rcApiUrl + (toCurrency.toLowerCase())
        
        const response = await axios.get(rcApiUrlFormatted)

        // Mapping response data and returning
        return response.data.map((country) => country.name)
    } catch (error) {
        throw new Error(`Unable to get countries that use ${toCurrency}.`)        
    }
}


const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency)
    const countries = await getCountries(toCurrency)

    // Converted amount
    const convertedAmount = (amount * exchangeRate).toFixed(2)

    return {convertedAmount, countries}
}
