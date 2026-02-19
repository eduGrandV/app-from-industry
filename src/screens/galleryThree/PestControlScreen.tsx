import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  pestControlSchema,
  PestControlFormData,
  AREAS_PRAGAS,
  PESTS_LIST,
} from "../../types/galleryThree/pestControlSchema";

const PEST_ICONS: Record<string, any> = {
  Rato: "rodent",
  Aranha: "spider",
  Escorpião: "bug",
  Barata: "bug-outline",
  Grilo: "bug",
  Pássaro: "bird",
  Cobra: "snake",
  Outros: "alert",
};

export function PestControlScreen() {
  const navigation = useNavigation();

  const { control, handleSubmit, setValue, watch } =
    useForm<PestControlFormData>({
      resolver: zodResolver(pestControlSchema) as any,
      defaultValues: {
        data: new Date(),
        responsavel: "",
        observacoes_gerais: "",
        registros: {}, // Inicia vazio
      },
    });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const formValues = watch(); // Para atualizar os contadores visualmente

  const onSubmit = (data: PestControlFormData) => {
    const ocorrencias = Object.entries(data.registros || {}).filter(
      ([_, count]) => count > 0,
    );

    console.log("Controle de Pragas:", { ...data, ocorrencias });

    if (ocorrencias.length > 0) {
      Alert.alert(
        "Atenção",
        `Foram registradas ${ocorrencias.length} ocorrências de pragas.`,
      );
    } else {
      Alert.alert("Sucesso", "Nenhuma praga detectada. Registro salvo!");
    }
    navigation.goBack();
  };

  // Contador Individual
  const PestCounter = ({ area, pest }: { area: string; pest: string }) => {
    // Cria uma chave única para area e doença
    const fieldKey = `registros.${area}_${pest}`;

    // Pega valor atual
    const currentValue =
      (formValues.registros as any)?.[`${area}_${pest}`] || 0;

    const handleIncrement = () => {
      setValue(`registros.${area}_${pest}`, currentValue + 1);
    };

    const handleDecrement = () => {
      if (currentValue > 0) {
        setValue(`registros.${area}_${pest}`, currentValue - 1);
      }
    };

    const iconName = PEST_ICONS[pest] || "bug";
    const isActive = currentValue > 0;

    return (
      <View
        style={[
          styles.counterContainer,
          isActive && styles.counterContainerActive,
        ]}
      >
        <View style={styles.pestInfo}>
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={isActive ? "#B91C1C" : "#64748B"}
          />
          <Text style={[styles.pestName, isActive && styles.pestNameActive]}>
            {pest}
          </Text>
        </View>

        <View style={styles.stepper}>
          <TouchableOpacity onPress={handleDecrement} style={styles.stepBtn}>
            <MaterialIcons name="remove" size={16} color="#475569" />
          </TouchableOpacity>

          <Text style={[styles.stepValue, isActive && styles.stepValueActive]}>
            {currentValue}
          </Text>

          <TouchableOpacity
            onPress={handleIncrement}
            style={[styles.stepBtn, styles.stepBtnAdd]}
          >
            <MaterialIcons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialIcons name="pest-control" size={28} color="#B91C1C" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Controle de Pragas</Text>
            <Text style={styles.headerSubtitle}>Monitoramento Diário</Text>
          </View>
        </View>

        {/* Dados Gerais */}
        <View style={styles.card}>
          <Text style={styles.sectionTitleSmall}>DADOS GERAIS</Text>
          <View style={styles.rowMain}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>DATA</Text>
              <Controller
                control={control}
                name="data"
                render={({ field: { value } }) => (
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons
                      name="calendar-today"
                      size={18}
                      color="#475569"
                    />
                    <Text style={styles.dateText}>
                      {value
                        ? new Date(value).toLocaleDateString("pt-BR")
                        : "Hoje"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(
                    event: DateTimePickerEvent,
                    selectedDate?: Date,
                  ) => {
                    setShowDatePicker(Platform.OS === "ios");
                  }}
                />
              )}
            </View>

            <View style={{ flex: 1.5 }}>
              <Text style={styles.label}>RESPONSÁVEL</Text>
              <Controller
                control={control}
                name="responsavel"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Nome"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/*  LOOP DAS ÁREAS  */}
        {AREAS_PRAGAS.map((area, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndex}>
                <Text style={styles.sectionIndexText}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{area}</Text>
            </View>

            <View style={styles.gridPests}>
              {PESTS_LIST.map((pest) => (
                <PestCounter key={pest} area={area} pest={pest} />
              ))}
            </View>
          </View>
        ))}

        {/* Rodapé Obs */}
        <View style={styles.card}>
          <Text style={styles.label}>OBSERVAÇÕES GERAIS</Text>
          <Controller
            control={control}
            name="observacoes_gerais"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                onChangeText={onChange}
                value={value}
                multiline
                placeholder="Alguma anomalia encontrada?"
                placeholderTextColor="#94A3B8"
              />
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Finalizar Monitoramento</Text>
          <MaterialCommunityIcons name="shield-check" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 20, paddingBottom: 60 },

  header: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  headerSubtitle: { fontSize: 15, color: "#64748B", fontWeight: "600" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
  },
  sectionIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIndexText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    textTransform: "uppercase",
    flex: 1,
  },
  sectionTitleSmall: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  rowMain: { flexDirection: "row", gap: 12 },
  label: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F8FAFC",
    gap: 10,
  },
  dateText: { fontSize: 14, color: "#334155", fontWeight: "500" },

  // Grid de Pragas
  gridPests: { padding: 12, gap: 8 },

  // Estilo do Contador
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  counterContainerActive: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },

  pestInfo: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  pestName: { fontSize: 14, fontWeight: "600", color: "#475569" },
  pestNameActive: { color: "#991B1B", fontWeight: "700" },

  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnAdd: { backgroundColor: "#334155" },
  stepValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
    width: 20,
    textAlign: "center",
  },
  stepValueActive: { color: "#B91C1C" },

  submitButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#B91C1C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
