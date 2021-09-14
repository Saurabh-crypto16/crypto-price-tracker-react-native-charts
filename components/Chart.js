//this renders when any item in the list is pressed
//we need the most recent clicked data in chart component

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartYLabel,
} from "@rainbow-me/animated-charts";
export const { width: SIZE } = Dimensions.get("window");
import { useSharedValue } from "react-native-reanimated";

const Chart = ({
  currentPrice,
  logoUrl,
  name,
  priceChangePercentage7d,
  sparkline,
  symbol,
}) => {
  const latestCurrentPrice = useSharedValue(currentPrice);
  //used to craete a fake delay in loading the app to get the data from api populate properly
  const [chartReady, setChartReady] = useState(false);
  //whenever currentPrice changes as a prop in this component it sets the latestCurrentPrice to currentPrice
  useEffect(() => {
    latestCurrentPrice.value = currentPrice;
    //creating a fake delay in app loading
    setTimeout(() => {
      setChartReady(true);
    }, 0);
  }, [currentPrice]);
  //color will be green if +ve price change else red
  const priceChangeColor = priceChangePercentage7d > 0 ? "#34c759" : "#ff3830";
  //worklet means it will be running on UI thread instead of js thread
  //the chart will show currentPrice is graph is not touched but will show the relative price if graph is clicked
  const formatUSD = (value) => {
    "worklet";
    if (value === "") {
      return `$${latestCurrentPrice.value.toLocaleString("en-US", {
        currency: "USD",
      })}`;
    }
    //formatting to 2 decimal places when graph clicked
    const formattedValue = `$${parseFloat(value)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    return formattedValue;
  };
  return (
    <ChartPathProvider
      data={{ points: sparkline, smoothingStrategy: "bezier" }}
    >
      <View style={styles.chartWrapper}>
        <View style={styles.titlesWrapper}>
          <View style={styles.upperTitles}>
            <View style={styles.upperLeftTitle}>
              <Image
                source={{
                  uri: logoUrl,
                }}
                style={styles.image}
              />
              <Text style={styles.subtitle}>
                {name} ({symbol.toUpperCase()})
              </Text>
            </View>
            <Text style={styles.subtitle}>7d</Text>
          </View>
          <View style={styles.lowerTitles}>
            <ChartYLabel format={formatUSD} style={styles.boldTitle} />
            <Text style={[styles.title, { color: priceChangeColor }]}>
              {priceChangePercentage7d.toFixed(2)}%
            </Text>
          </View>
        </View>
        {chartReady ? (
          <View style={styles.chartLineWrapper}>
            <ChartPath height={SIZE / 2} stroke="black" width={SIZE} />
            <ChartDot style={{ backgroundColor: "black" }} />
          </View>
        ) : null}
      </View>
    </ChartPathProvider>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 16,
  },
  titlesWrapper: {
    marginHorizontal: 16,
  },
  upperTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upperLeftTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#A9ABB1",
  },
  lowerTitles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boldTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
  },
  chartLineWrapper: {
    marginTop: 40,
  },
});

export default Chart;
