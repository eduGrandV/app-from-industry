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
      subtitle: "Controle físico-químico e qualidade",
      icon: "flask-outline",
      color: "#FFFFFF",
      iconBg: "#ECFCCB", // Verde limão bem claro
      iconColor: "#4D7C0F",
      route: "GalleryOne",
    },
    {
      id: 2,
      title: "Tratamento de Água (ETA)",
      subtitle: "Monitoramento e rotina da ETA",
      icon: "water-pump",
      color: "#FFFFFF",
      iconBg: "#E0F2FE", // Azul claro
      iconColor: "#0284C7",
      route: "GalleryTwo",
    },
    {
      id: 3,
      title: "Higienização e Pragas",
      subtitle: "Registros de limpeza e controle",
      icon: "clipboard-check-outline",
      color: "#FFFFFF",
      iconBg: "#FFEDD5", // Laranja claro
      iconColor: "#C2410C",
      route: "GalleryThree",
    },
    {
      id: 4,
      title: "Produção e Envase",
      subtitle: "Extração, vinificação e embalagem",
      icon: "factory",
      color: "#FFFFFF",
      iconBg: "#F3E8FF", // Roxo claro
      iconColor: "#7E22CE",
      route: "GalleryFor", // Mantive o seu nome de rota original
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="view-dashboard" size={32} color="#0F172A" />
          <Text style={styles.headerTitle}>Painel Central</Text>
        </View>
        <Text style={styles.headerSubtitle}>Selecione um módulo de operação</Text>
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
                <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
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
                    size={24}
                    color="#CBD5E1"
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
    backgroundColor: "#F1F5F9",
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 12,
  },
});