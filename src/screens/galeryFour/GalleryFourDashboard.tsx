import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function GalleryForDashboard() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card 1: Análise Sensorial de Suco */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("SensoryAnalysis", { type: "Suco" })
          }
        >
          <View style={[styles.iconBox, { backgroundColor: "#FEF08A" }]}>
            <MaterialCommunityIcons
              name="cup-water"
              size={28}
              color="#CA8A04"
            />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Análise de Suco</Text>
            <Text style={styles.cardSubtitle}>Sabor, cor, aroma e acidez</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
        {/* Card 2: Análise Sensorial de Geleia/Doce */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("SensoryAnalysis", { type: "Geleia_Doce" })
          }
        >
          <View style={[styles.iconBox, { backgroundColor: "#FBCFE8" }]}>
            <MaterialCommunityIcons
              name="food-apple"
              size={28}
              color="#DB2777"
            />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Análise de Geleia/Doce</Text>
            <Text style={styles.cardSubtitle}>Textura, aparência e doçura</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ExtractionControl")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
            <MaterialCommunityIcons
              name="fruit-grapes"
              size={28}
              color="#7E22CE"
            />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Controle de Extração</Text>
            <Text style={styles.cardSubtitle}>
              Rendimento, Tambores e Análises
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("BottleControl")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#E0F2FE" }]}>
            <MaterialCommunityIcons
              name="bottle-wine"
              size={28}
              color="#0284C7"
            />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Controle de Garrafas</Text>
            <Text style={styles.cardSubtitle}>Rastreabilidade e perdas</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("EnvaseControl")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#EDE9FE" }]}>
            <MaterialCommunityIcons name="factory" size={28} color="#8B5CF6" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Controle de Envase</Text>
            <Text style={styles.cardSubtitle}>Envase, rotulagem e insumos</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
     {/* Card: Monitoramento de Uvas Passas */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("RaisinMonitoring")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFEDD5" }]}>
            <MaterialCommunityIcons name="fruit-grapes-outline" size={28} color="#C2410C" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Monitoramento de Uvas Passas</Text>
            <Text style={styles.cardSubtitle}>Processo de secagem e rendimento</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>

        {/* Card: Monitoramento de Vinhos */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("WineMonitoring")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FCE7F3" }]}>
            <MaterialCommunityIcons name="glass-wine" size={28} color="#9D174D" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Elaboração de Vinhos</Text>
            <Text style={styles.cardSubtitle}>Vinificação e análises laboratoriais</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>

        {/* Card: Monitoramento de Doces */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SweetsMonitoring")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#FFEDD5" }]}>
            <MaterialCommunityIcons name="food-apple" size={28} color="#EA580C" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Elaboração de Doces</Text>
            <Text style={styles.cardSubtitle}>Ingredientes, produção e perdas</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>

        {/* Card: Monitoramento de Envase */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("PackagingMonitoring")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#CCFBF1" }]}>
            <MaterialCommunityIcons name="pipe-valve" size={28} color="#0F766E" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Monitoramento de Envase</Text>
            <Text style={styles.cardSubtitle}>Controle de equipamentos e jornada</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#CBD5E1"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textBox: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 2,
  },
  cardSubtitle: { fontSize: 13, color: "#94A3B8" },
});
