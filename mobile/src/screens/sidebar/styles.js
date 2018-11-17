const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 12 : deviceWidth / 12,
    top: Platform.OS === "android" ? deviceHeight / 7 : deviceHeight / 7,
    width: 210,
    height: 27,
    resizeMode: "cover"
  },
  userInfo: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 12 : deviceWidth / 12,
    top: Platform.OS === "android" ? deviceHeight / 14 : deviceHeight / 14,
  },
  header: {
    height: deviceHeight / 3.5,
  },
  body: {
    height: deviceHeight / 1.68,
  },
  logout: {
    height: deviceHeight / 14,
    borderTopWidth:1,
    borderBottomWidth:1,
  },
  rowVersion: {
    flex: 1,
    alignContent: "center",
  },
  colVersion: {
    alignItems: "center",
    width: "47%"
  },
  colTerms: {
    justifyContent: "center",
    alignItems: "center",
    width: "6%"
  },
  textVersion:{
    fontSize: 18,
    textDecorationLine: "underline",
  },
  icon: {
    color: "#777",
    fontSize: 26,
    width: 30
  },
  footerIcon: {
    color: "red",
    fontSize: 26,
    width: 30
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 18,
    marginLeft: 20
  },
  footerText: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 18,
    marginLeft: 20,
    color: "red"
  }
};
