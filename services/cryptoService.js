//conatins all the functions to get the data from api
import axios from "axios";
import moment from "moment";

/*actual url: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d */

//x-component respond to time and y-component to price
const formatSparkline = (numbers) => {
  //it substracts data that is 7 days from today and converting it into unix time
  const sevenDaysAgo = moment().subtract(7, "days").unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: sevenDaysAgo + (index + 1) * 3600, //incrementing x-value(time) by 1 hour
      y: item,
    };
  });
  return formattedSparkline;
};

const formatMarketData = (data) => {
  let formattedData = []; //stores the formatted data

  data.forEach((item) => {
    const formattedSparkline = formatSparkline(item.sparkline_in_7d.price);

    const formattedItem = {
      ...item, //conatins all same values from above
      sparkline_in_7d: {
        price: formattedSparkline,
      },
    };

    formattedData.push(formattedItem); //appending to list
  });

  return formattedData;
};

//we will call this function from App.js
export const getMarketData = async () => {
  try {
    //api call
    //making this function async means code is going to wait here to get the response from api b
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d"
    );
    const data = response.data; //unique to axios where data is held in response object
    const formattedResponse = formatMarketData(data);
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
  }
};
