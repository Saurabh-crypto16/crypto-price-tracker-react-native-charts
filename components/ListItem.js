import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//touchableOpacity changes opacity of component when touched

const ListItem = ({
  name,
  symbol,
  currentPrice,
  priceChangePercentage7d,
  logoUrl,
  onPress,
}) => {
  //color will be green if +ve price change else red
  const priceChangeColor = priceChangePercentage7d > 0 ? "#34c759" : "#ff3830";
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemWrapper}>
        {/*Left side*/}
        <View style={styles.leftWrapper}>
          <Image
            source={{
              uri: logoUrl,
            }}
            style={styles.image}
          />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{symbol.toUpperCase()}</Text>
          </View>
        </View>
        {/*Right side*/}
        <View style={styles.rightWrapper}>
          <Text style={styles.title}>
            ${currentPrice.toLocaleString("en-US", { currency: "USD" })}
          </Text>
          <Text style={[styles.subtitle, { color: priceChangeColor }]}>
            {priceChangePercentage7d.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
  image: {
    height: 48,
    width: 48,
  },
  titleWrapper: { marginLeft: 8 },
  title: { fontSize: 18 },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: "#a9abb1",
  },
});
