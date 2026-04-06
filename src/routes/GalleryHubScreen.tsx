import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthContext } from "../contexts/AuthContext";

interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  route: string;
}

export function GalleryHubScreen() {
  const navigation = useNavigation<any>();
  const { nomeOperador, sairDoTurno } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Encerrar Sessão",
      `${nomeOperador || "Operador"}, deseja realmente encerrar sua sessão?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Encerrar",
          style: "destructive",
          onPress: () => sairDoTurno(),
        },
      ]
    );
  };

  const galleries: GalleryItem[] = [
    {
      id: 1,
      title: "Análises Laboratoriais",
      subtitle: "Controle físico-químico e qualidade",
      icon: "flask-outline",
      iconBg: "#ECFCCB",
      iconColor: "#4D7C0F",
      route: "GalleryOne",
    },
    {
      id: 2,
      title: "Tratamento de Água",
      subtitle: "Monitoramento e rotina da ETA",
      icon: "water-pump",
      iconBg: "#E0F2FE",
      iconColor: "#0284C7",
      route: "GalleryTwo",
    },
    {
      id: 3,
      title: "Higienização e Pragas",
      subtitle: "Registros de limpeza e controle",
      icon: "clipboard-check-outline",
      iconBg: "#FFEDD5",
      iconColor: "#C2410C",
      route: "GalleryThree",
    },
    {
      id: 4,
      title: "Produção e Envase",
      subtitle: "Extração, vinificação e embalagem",
      icon: "factory",
      iconBg: "#F3E8FF",
      iconColor: "#7E22CE",
      route: "GalleryFor",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Bem-vindo(a)</Text>
              <Text style={styles.userName}>
                {nomeOperador || "Operador"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="logout-variant"
                size={20}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerMain}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={32}
                color="#0F172A"
              />
              <Text style={styles.headerTitle}>Painel de Controle</Text>
            </View>
            <Text style={styles.headerDescription}>
              Selecione um módulo para iniciar as operações
            </Text>
          </View>
        </View>

        <View style={styles.galleryGrid}>
          {galleries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.cardContent}>
                <View
                  style={[styles.iconContainer, { backgroundColor: item.iconBg }]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={item.iconColor}
                  />
                </View>

                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={styles.chevronContainer}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#94A3B8"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  headerMain: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerDescription: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 22,
  },
  galleryGrid: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    lineHeight: 18,
  },
  chevronContainer: {
    marginLeft: 12,
    opacity: 0.6,
  },
  footerSpacer: {
    height: 20,
  },
});