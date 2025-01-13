import React, { useState } from "react";
import { View, TouchableOpacity, Text, Animated, Easing } from "react-native";

const SpecializationList = ({
  specializations,
  selectedSpecialization,
  handleSpecializationChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // Handle expanding or collapsing the section
  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const expandStyle = {
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, specializations.length * 50], // Adjust height per item
    }),
    overflow: "hidden",
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity onPress={toggleExpand} style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {expanded ? "Hide Specializations" : "Show Specializations"}
        </Text>
      </TouchableOpacity>

      <Animated.View style={expandStyle}>
        {specializations.map((specialization) => (
          <TouchableOpacity
            key={specialization}
            onPress={() => handleSpecializationChange(specialization)}
            style={{
              padding: 10,
              backgroundColor:
                selectedSpecialization === specialization ? "#ccc" : "#fff",
              marginVertical: 5,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ flex: 1 }}>{specialization}</Text>
            {selectedSpecialization === specialization && (
              <Text style={{ color: "#007bff", fontWeight: "bold" }}>
                Selected
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default SpecializationList;
