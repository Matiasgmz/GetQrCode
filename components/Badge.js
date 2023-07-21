import axios from "axios";
import React, { useEffect, useInsertionEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Badge() {
  const [modalVisible, setModalVisible] = useState(false);
  const [badges, setBadges] = useState([]);

  const [badgeSelected, setBadgeSelected] = useState(-1);

  useInsertionEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://10.74.0.59:4000/api/users/badges"
      );
      setBadges(response.data.badges);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getBadgeColor = (rank) => {
    switch (rank) {
      case "BRONZE":
        return "brown";
      case "SILVER":
        return "silver";
      case "GOLD":
        return "gold";
      case "PLATINUM":
        return "gray";
      default:
        return "black";
    }
  };

  const handleDeleteBadge = (id) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGI3ZmVjZTdkZjBmNTA0YTQxNWIxM2UiLCJpYXQiOjE2ODk4NDQ4NTV9.0kOd8JlWAEIuPnVxAO6_f4io7SoIcS73wvNZZghpF8s"; // a effacer

    console.log(id);
    axios.delete("http://10.74.0.59:4000/api/badges/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 50 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.row}>
            {badges.map((badge, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setBadgeSelected(index);
                  setModalVisible(true);
                }}
                style={styles.badge}
              >
                <Image
                  style={styles.imageBadge}
                  source={{
                    uri: badge.picture,
                  }}
                />
                <Text style={styles.textBadge}>{badge.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          {badgeSelected !== -1 && (
            <View style={styles.modalView}>
              <View style={styles.containerIcons}>
                <Ionicons
                  style={styles.iconClose}
                  name="close-circle"
                  onPress={() => setModalVisible(false)}
                  color={"black"}
                  size={45}
                />
              </View>

              <ScrollView>
                <View>
                  <View style={styles.containerImageModal}>
                    <Image
                      style={styles.imageBadgeModal}
                      source={{ uri: badges[badgeSelected].picture }}
                    />
                  </View>

                  <Text style={styles.modalTitle}>
                    {badges[badgeSelected].name}
                  </Text>

                  <Text
                    style={[
                      styles.modalRank,
                      { color: getBadgeColor(badges[badgeSelected].rank) }, // Définir la couleur du texte en fonction du rang du badge
                    ]}
                  >
                    {badges[badgeSelected].rank}
                  </Text>

                  <Text style={styles.modalDescription}>
                    {badges[badgeSelected].description}
                  </Text>

                  <MapView
                    style={{ width: "100%", height: 250, borderRadius: 8 }}
                    minZoomLevel={10}
                    initialRegion={{
                      latitude: badges[badgeSelected].coordinates.latitude,
                      longitude: badges[badgeSelected].coordinates.longitude,
                      latitudeDelta: 5,
                      latitudeDelta: 5,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: badges[badgeSelected].coordinates.latitude,
                        longitude: badges[badgeSelected].coordinates.longitude,
                      }}
                      title={badges[badgeSelected].name}
                    />
                  </MapView>
                </View>
                <View style={{ alignSelf: "center" }}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    title="Supprimer"
                    onPress={() => handleDeleteBadge(badges[badgeSelected]._id)}
                  >
                    <Text style={styles.textDeleteButton}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    flex: 0.8,
    flexWrap: "wrap",
  },
  imageBadge: {
    width: 100,
    height: 100,
  },
  imageBadgeModal: {
    width: 200,
    height: 200,
  },
  badge: {
    marginTop: 10,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  textBadge: {
    width: 85,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalView: {
    margin: 10,
    marginTop: 100,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 650,
  },
  containerIcons: {
    width: "100%",
    alignItems: "flex-end",
    padding: 0,
    backgroundColor: "transparent",
  },
  modalTitle: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 30,
    fontWeight: "bold",
  },
  containerImageModal: {
    flexDirection: "column",
    alignSelf: "center",
  },
  modalDescription: {
    marginTop: 25,
    textAlign: "center",
    marginBottom: 25,
    paddingLeft: 5,
    paddingRight: 5,
  },
  modalRank: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 25,
    fontWeight: "bold",
  },
  iconClose: {
    fontSize: 40,
    color: "red",
  },
  deleteButton: {
    borderRadius: 12,
    width: 200,
    backgroundColor: "red",
    color: "white",
    padding: 10,
    marginTop: 10,
  },
  textDeleteButton: {
    color: "white",
    textAlign: "center",
  },
});
