import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  PanResponder, 
  Animated,  
  StyleSheet, 
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [storedText, setStoredText] = useState<string>("");
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const fetchVoices = async () => {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      console.log(availableVoices);
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].identifier);
      }
    };
    fetchVoices();
  }, []);

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
        console.log("Text loaded successfully:", text);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const speak = () => {
    const voiceToUse = selectedVoice || voices[0]?.identifier || null;
  
    if (!voiceToUse) {
      alert("No available voices on this device.");
      return;
    }
  
    Speech.speak(storedText || "Hello! Type something and save it.", {
      voice: voiceToUse,
      pitch: 1.0,
      rate: 1.0,
    });
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

      <Text style={styles.title}>Select a Voice:</Text>
      <View style={styles.voiceListContainer}>
        <FlatList
          data={voices}
          keyExtractor={(item) => item.identifier}
          style={{ maxHeight: 200 }} 
          nestedScrollEnabled={true} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.voiceItem,
                selectedVoice === item.identifier && styles.selectedVoice,
              ]}
              onPress={() => setSelectedVoice(item.identifier)}
            >
              <Text style={styles.voiceText}>{item.name} ({item.language})</Text>
            </TouchableOpacity>
          )}
        />
      </View>

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
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  draggableText: {
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  voiceListContainer: {
    maxHeight: 200, 
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  voiceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  selectedVoice: {
    backgroundColor: "#d0f0c0",
  },
  voiceText: {
    fontSize: 16,
  },
});

export default App;
