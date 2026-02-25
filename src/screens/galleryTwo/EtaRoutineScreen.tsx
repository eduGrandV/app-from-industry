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
  Switch,
} from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  EtaRoutineFormData,
  etaRoutineSchema,
} from "../../types/galeryTwo/etaRoutineSchema";

export function EtaRoutineScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EtaRoutineFormData>({
    resolver: zodResolver(etaRoutineSchema) as any,
    defaultValues: {
      data: new Date(),
      responsavel: "",
      manha_hora: "",
      tarde_hora: "",

      manha_barrilha: undefined,
      manha_sulfato: undefined,
      manha_cloro_sol: undefined,
      tarde_barrilha: undefined,
      tarde_sulfato: undefined,
      tarde_cloro_sol: undefined,

      manha_limpeza_filtros: false,
      manha_abertura_valvulas: false,
      tarde_limpeza_filtros: false,
      tarde_abertura_valvulas: false,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const phManha = useWatch({ control, name: "manha_ph_agua_bruta" });
  const phTarde = useWatch({ control, name: "tarde_ph_agua_bruta" });

  const onSubmit = (data: EtaRoutineFormData) => {
    console.log("Formulário ETA Validado:", data);
    Alert.alert("Sucesso", "Registro FOR-BP-05 salvo!");
  };

  const SolutionCard = ({
    title,
    subtitle,
    prefix,
    color,
  }: {
    title: string;
    subtitle: string;
    prefix: string;
    color: string;
  }) => (
    <View style={[styles.solutionCard, { borderLeftColor: color }]}>
      <View style={styles.solutionHeader}>
        <Text style={styles.solutionTitle}>{title}</Text>
        <Text style={styles.solutionSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colTitle}>Água (L)</Text>
        <Text style={styles.colTitle}>Prod. (g)</Text>
        <Text style={styles.colTitle}>Fluxo (%)</Text>
      </View>

      <View style={styles.tableRow}>
        <Controller
          control={control}
          name={`${prefix}.agua_L` as any}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.miniInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#B0BEC5"
            />
          )}
        />
        <Controller
          control={control}
          name={`${prefix}.produto_g` as any}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.miniInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#B0BEC5"
            />
          )}
        />
        <Controller
          control={control}
          name={`${prefix}.fluxo_pct` as any}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.miniInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ""}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#B0BEC5"
            />
          )}
        />
      </View>
    </View>
  );

  const BooleanRow = ({ label, name }: { label: string; name: any }) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchContainer}>
            <Text
              style={[styles.switchText, !value && styles.switchTextInactive]}
            >
              {value ? "SIM" : "NÃO"}
            </Text>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#b2dfdb" }}
              thumbColor={value ? "#00897B" : "#9e9e9e"}
              onValueChange={onChange}
              value={value}
            />
          </View>
        )}
      />
    </View>
  );

  const renderTurno = (
    turno: "Manhã" | "Tarde",
    prefixo: "manha" | "tarde",
  ) => {
    const isManha = turno === "Manhã";
    const currentPh = isManha ? phManha : phTarde;

    const showPhWarning = currentPh
      ? Number(currentPh) < 6.6 && Number(currentPh) > 0
      : false;

    return (
      <View style={styles.section}>
        <View
          style={[
            styles.sectionHeader,
            { backgroundColor: isManha ? "#FFF3E0" : "#E8EAF6" },
          ]}
        >
          <MaterialIcons
            name={isManha ? "wb-sunny" : "nights-stay"}
            size={24}
            color={isManha ? "#F57C00" : "#3F51B5"}
          />
          <Text
            style={[
              styles.sectionTitle,
              { color: isManha ? "#EF6C00" : "#283593" },
            ]}
          >
            Turno da {turno}
          </Text>
        </View>

        <View style={styles.sectionBody}>
          <View style={styles.rowMain}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hora</Text>
              <Controller
                control={control}
                name={`${prefixo}_hora`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="00:00"
                    placeholderTextColor="#B0BEC5"
                    keyboardType="numbers-and-punctuation"
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>pH Água Bruta</Text>
              <Controller
                control={control}
                name={`${prefixo}_ph_agua_bruta`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      showPhWarning ? styles.inputWarning : null,
                    ]}
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    placeholder="6 a 9.5"
                    placeholderTextColor="#B0BEC5"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cloro Água</Text>
              <Controller
                control={control}
                name={`${prefixo}_cloro_agua_clorada`}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value ? String(value) : ""}
                    onChangeText={onChange}
                    placeholder="0.2 a 2"
                    placeholderTextColor="#B0BEC5"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
          </View>

          {showPhWarning && (
            <View style={styles.warningBox}>
              <MaterialIcons name="warning" size={20} color="#D32F2F" />
              <Text style={styles.warningText}>
                OBS.: pH abaixo de 6.6! Utilizar Barrilha abaixo.
              </Text>
            </View>
          )}

          <Text style={styles.subHeader}>Soluções Químicas</Text>

          <SolutionCard
            title="Solução de Barrilha"
            subtitle="pH < 6.6"
            prefix={`${prefixo}_barrilha`}
            color="#795548"
          />

          <SolutionCard
            title="Solução de Sulfato"
            subtitle="Al₂(SO₄)₃ (5 a 70 mg/L)"
            prefix={`${prefixo}_sulfato`}
            color="#1976D2"
          />

          <SolutionCard
            title="Solução de Cloro"
            subtitle="1.5 a 2 mg/L"
            prefix={`${prefixo}_cloro_sol`}
            color="#00796B"
          />

          <View style={styles.divider} />

          <Text style={styles.subHeader}>Rotina Operacional</Text>
          <View style={styles.operationalBox}>
            <BooleanRow
              label="Limpeza dos Filtros"
              name={`${prefixo}_limpeza_filtros`}
            />
            <View style={styles.separator} />
            <BooleanRow
              label="Abertura das Válvulas"
              name={`${prefixo}_abertura_valvulas`}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Gerais</Text>

          <View style={styles.rowMain}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Data</Text>
              <Controller
                control={control}
                name="data"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialCommunityIcons
                      name="calendar"
                      size={20}
                      color="#546E7A"
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
                    if (selectedDate) {
                    }
                  }}
                />
              )}
            </View>

            <View style={{ flex: 2 }}>
              <Text style={styles.label}>Responsável</Text>
              <Controller
                control={control}
                name="responsavel"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Nome do operador"
                    placeholderTextColor="#B0BEC5"
                  />
                )}
              />
            </View>
          </View>
        </View>

        {renderTurno("Manhã", "manha")}
        {renderTurno("Tarde", "tarde")}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Salvar Registro Diário</Text>
          <MaterialCommunityIcons name="check-all" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9", 
  },
  content: {
    padding: 20,
    paddingBottom: 60, 
  },

  
  header: {
    marginBottom: 24,
    alignItems: "center",
    paddingVertical: 10,
  },
   card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20, 
    padding: 20,
    marginBottom: 20,
    
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)", 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155", 
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 28,
    
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9", 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  sectionBody: {
    padding: 20,
  },

  
  rowMain: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#64748B", 
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase", 
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5, 
    borderColor: "#E2E8F0", 
    borderRadius: 12,
    paddingVertical: 12, 
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC", 
    color: "#0F172A",
    fontWeight: "500",
  },
  inputWarning: {
    borderColor: "#FECACA", 
    backgroundColor: "#FEF2F2", 
    color: "#991B1B",
  },

  
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED", 
    borderWidth: 1,
    borderColor: "#FFEDD5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  warningText: {
    color: "#C2410C", 
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },

  
  subHeader: {
    fontSize: 13,
    fontWeight: "800",
    color: "#94A3B8", 
    marginTop: 12,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  
  solutionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 5, 
    borderWidth: 1,
    borderColor: "#E2E8F0",
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  solutionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  solutionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  solutionSubtitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },

  
  tableHeader: {
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  colTitle: {
    flex: 1,
    fontSize: 10,
    textAlign: "center",
    color: "#94A3B8",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    gap: 8,
  },
  miniInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 8, 
    paddingHorizontal: 4,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#F8FAFC",
    color: "#334155",
  },

  
  operationalBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  switchLabel: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  switchText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669", 
    letterSpacing: 0.5,
  },
  switchTextInactive: {
    color: "#CBD5E1", 
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },

  
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  dateText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },

  submitButton: {
    backgroundColor: "#1E293B", 
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
