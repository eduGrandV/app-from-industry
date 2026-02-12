import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export function GalleryHubScreen() {
  const navigation = useNavigation<any>();

  const galleries = [
    {
      id: 1,
      title: "Análises Laboratoriais",
      subtitle: "Resultados e exames",
      icon: "flask",
      color: "#E8F5E9",
      iconColor: "#2E7D32",
      route: "GalleryOne",
    },
    {
      id: 2,
      title: "ETA",
      subtitle: "Estação de Tratamento de Água",
      icon: "water-pump",
      color: "#E3F2FD",
      iconColor: "#1565C0",
      route: "GalleryTwo",
    },
    {
      id: 3,
      title: "Limpeza e Controle",
      subtitle: "Registros e monitoramento",
      icon: "broom",
      color: "#FFF3E0",
      iconColor: "#EF6C00",
      route: "GalleryThree",
    },
    {
      id: 4,
      title: "Controle e Monitoramento",
      subtitle: "Elaboração de relatórios",
      icon: "chart-box",
      color: "#F3E5F5",
      iconColor: "#7B1FA2",
      route: "GalleryFor",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galerias</Text>
        <Text style={styles.headerSubtitle}>Selecione um módulo</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {galleries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: item.iconColor + '15' }]}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color={item.iconColor}
                  />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={item.iconColor}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  content: {
    padding: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});