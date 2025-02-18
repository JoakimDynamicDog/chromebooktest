import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  PanResponder, 
  Animated,  
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [storedText, setStoredText] = useState<string>("");
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const saveData = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem("storedText", text);
      console.log("Text saved successfully:", text);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const loadData = async (): Promise<void> => {
    try {
      const value = await AsyncStorage.getItem("storedText");
      if (value !== null) {
        setStoredText(value);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const speak = (): void => {
    Speech.speak(storedText || "Hello! Type something and save it.");
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        position.extractOffset();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type something"
        value={text}
        onChangeText={setText}
      />
      
      <TouchableOpacity onPress={saveData} style={[styles.button, styles.buttonBlue]}>
        <Text style={styles.buttonText}>Save to Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={loadData} style={[styles.button, styles.buttonGreen]}>
        <Text style={styles.buttonText}>Load from Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={speak} style={[styles.button, styles.buttonPurple]}>
        <Text style={styles.buttonText}>Speaka</Text>
      </TouchableOpacity>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.draggable, { transform: [{ translateX: position.x }, { translateY: position.y }] }]}
      >
        <Text style={styles.draggableText}>Dra maj</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: "80%",
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonBlue: {
    backgroundColor: "blue",
  },
  buttonGreen: {
    backgroundColor: "green",
  },
  buttonPurple: {
    backgroundColor: "purple",
  },
  draggable: {
    width: 100,
    height: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  draggableText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default App;
