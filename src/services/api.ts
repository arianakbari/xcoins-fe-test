import axios from "axios";

// in real application we shouldn't place api key here but for the purpose of this app is ok.
const API_KEY = "9f788afdc01ed692098a";
const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const { data } = await axios.get(
      `https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&apiKey=${API_KEY}`
    );
    return data.results[`${fromCurrency}_${toCurrency}`].val;
  } catch (error) {
    // do some global error handling
    throw error;
  }
};

export default getExchangeRate;
