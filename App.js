import { StatusBar } from "expo-status-bar";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";
import ListItem from "./components/ListItem";
import Chart from "./components/Chart";
import { SAMPLE_DATA } from "./assets/data/SampleData";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { getMarketData } from "./services/cryptoService";

const ListHeader = () => (
  <>
    <View style={styles.titleWrapper}>
      <Text style={styles.largeTitle}>Current Market Value</Text>
    </View>
    <View style={styles.divider} />
  </>
);
//
export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      const marketData = await getMarketData();
      setData(marketData);
    };

    fetchMarketData();
  }, []); //runs only once
  //
  //we need the most recent clicked data for chart
  const [selectedCoinData, setSelectedCoinData] = useState(null);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables to specify the size of char from bottom of screen
  const snapPoints = useMemo(() => ["45%"], []);

  //this function opens the chart on press
  const openModal = (item) => {
    setSelectedCoinData(item);
    bottomSheetModalRef.current.present();
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <ListHeader />
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              symbol={item.symbol}
              currentPrice={item.current_price}
              priceChangePercentage7d={
                item.price_change_percentage_7d_in_currency
              }
              logoUrl={item.image}
              onPress={() => openModal(item)}
            />
          )}
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={styles.bottomSheet}
        >
          {selectedCoinData ? (
            <Chart
              currentPrice={selectedCoinData.current_price}
              logoUrl={selectedCoinData.image}
              name={selectedCoinData.name}
              priceChangePercentage7d={
                selectedCoinData.price_change_percentage_7d_in_currency
              }
              sparkline={selectedCoinData?.sparkline_in_7d.price}
              symbol={selectedCoinData.symbol}
            />
          ) : null}
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    backgroundColor: "#daebde",
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleWrapper: {
    marginTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#a9abb1",
    marginHorizontal: 16,
    marginTop: 16,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
