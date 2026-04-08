import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import {
  EtaRoutineFormData,
  etaRoutineSchema,
} from "../../types/galeryTwo/etaRoutineSchema";

export function EtaRoutineScreen() {
  const { usuarioId, nomeOperador } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EtaRoutineFormData>({
    resolver: zodResolver(etaRoutineSchema) as any,
    defaultValues: {
      data: new Date(),
      responsavel: nomeOperador || String(usuarioId),
      turno: undefined,
      hora: "",
      barrilha: undefined,
      sulfato: undefined,
      cloro_sol: undefined,
      limpeza_filtros: false,
      abertura_valvulas: false,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPh = useWatch({ control, name: "ph_agua_bruta" });
  const showPhWarning = currentPh
    ? Number(currentPh) < 6.6 && Number(currentPh) > 0
    : false;

  const onSubmit = async (data: EtaRoutineFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: usuarioId };
      await api.post("/eta-routine", payload);
      Alert.alert("Sucesso", "Análise salva com sucesso!");
      reset({
        data: new Date(),
        responsavel: nomeOperador || String(usuarioId),
        turno: undefined,
        hora: "",
        barrilha: undefined,
        sulfato: undefined,
        cloro_sol: undefined,
        limpeza_filtros: false,
        abertura_valvulas: false,
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao salvar a análise.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const SolutionCard = ({ title, subtitle, prefix, color }: any) => (
    <View style={[styles.solutionCard, { borderLeftColor: color }]}>
      <View style={styles.solutionHeader}>
        <Text style={styles.solutionTitle}>{title}</Text>
        <Text
          style={[
            styles.solutionSubtitle,
            { backgroundColor: color + "20", color: color },
          ]}
        >
          {subtitle}
        </Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.colTitle}>Água (L)</Text>
        <Text style={styles.colTitle}>Prod. (g)</Text>
        <Text style={styles.colTitle}>Fluxo (%)</Text>
      </View>
      <View style={styles.tableRow}>
        {["agua_L", "produto_g", "fluxo_pct"].map((field) => (
          <Controller
            key={field}
            control={control}
            name={`${prefix}.${field}` as any}
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
        ))}
      </View>
    </View>
  );

  const BooleanRow = ({ label, name }: any) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="assignment" size={22} color="#00897B" />
              <Text style={styles.cardHeaderTitle}>Dados Gerais</Text>
            </View>

            <View style={styles.rowMain}>
              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Data do Registro</Text>
                <Controller
                  control={control}
                  name="data"
                  render={({ field: { value, onChange } }) => (
                    <TouchableOpacity
                      style={styles.dateButtonModern}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <MaterialCommunityIcons
                        name="calendar"
                        size={20}
                        color="#00897B"
                      />
                      <Text style={styles.dateButtonTextModern}>
                        {value
                          ? new Date(value).toLocaleDateString("pt-BR")
                          : "Selecionar data"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={(e, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        const { onChange } = control._formValues;
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Responsável Técnico</Text>
                <Controller
                  control={control}
                  name="responsavel"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.inputModern}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Nome completo ou rubrica"
                      placeholderTextColor="#94A3B8"
                    />
                  )}
                />
              </View>
            </View>

            
            <View style={styles.inputContainerModern}>
              <Text style={styles.labelModern}>Turno da Coleta</Text>
              <Controller
                control={control}
                name="turno"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.radioGroupModern}>
                    {["Manhã", "Tarde"].map((opcao) => (
                      <TouchableOpacity
                        key={opcao}
                        style={[
                          styles.radioBtnModern,
                          value === opcao &&
                            (opcao === "Manhã"
                              ? styles.radioBtnManhaActive
                              : styles.radioBtnTardeActive),
                        ]}
                        onPress={() => onChange(opcao)}
                      >
                        <MaterialCommunityIcons
                          name={
                            opcao === "Manhã"
                              ? "weather-sunset-up"
                              : "weather-night"
                          }
                          size={24}
                          color={value === opcao ? "#fff" : "#64748B"}
                        />
                        <Text
                          style={[
                            styles.radioTxtModern,
                            value === opcao && styles.radioTxtActive,
                          ]}
                        >
                          {opcao}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.turno && (
                <Text style={styles.errorText}>
                  {errors.turno.message as string}
                </Text>
              )}
            </View>
          </View>

          
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <View style={styles.analysisIconContainer}>
                <MaterialCommunityIcons
                  name="water-check"
                  size={28}
                  color="#fff"
                />
              </View>
              <View>
                <Text style={styles.analysisTitle}>Parâmetros e Soluções</Text>
                <Text style={styles.analysisSubtitle}>
                  Preencha os dados da rotina
                </Text>
              </View>
            </View>

            <View style={styles.rowMain}>
              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Horário</Text>
                <Controller
                  control={control}
                  name="hora"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.inputModern}
                      value={value}
                      onChangeText={onChange}
                      placeholder="00:00"
                      keyboardType="numbers-and-punctuation"
                      placeholderTextColor="#94A3B8"
                    />
                  )}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.labelModern}>pH Água Bruta</Text>
                <Controller
                  control={control}
                  name="ph_agua_bruta"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[
                        styles.inputModern,
                        showPhWarning && styles.inputWarning,
                      ]}
                      value={value ? String(value) : ""}
                      onChangeText={onChange}
                      placeholder="6.0 a 9.5"
                      keyboardType="numeric"
                      placeholderTextColor="#94A3B8"
                    />
                  )}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Cloro Água</Text>
                <Controller
                  control={control}
                  name="cloro_agua_clorada"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.inputModern}
                      value={value ? String(value) : ""}
                      onChangeText={onChange}
                      placeholder="0.2 a 2.0"
                      keyboardType="numeric"
                      placeholderTextColor="#94A3B8"
                    />
                  )}
                />
              </View>
            </View>

            {showPhWarning && (
              <View style={styles.warningBoxModern}>
                <MaterialIcons name="warning" size={20} color="#D32F2F" />
                <Text style={styles.warningTextModern}>
                  OBS.: pH abaixo de 6.6! Utilizar Barrilha abaixo.
                </Text>
              </View>
            )}

            <Text style={styles.subHeaderModern}>Soluções Químicas</Text>
            <SolutionCard
              title="Solução de Barrilha"
              subtitle="pH < 6.6"
              prefix="barrilha"
              color="#795548"
            />
            <SolutionCard
              title="Solução de Sulfato"
              subtitle="Al₂(SO₄)₃ (5 a 70 mg/L)"
              prefix="sulfato"
              color="#1976D2"
            />
            <SolutionCard
              title="Solução de Cloro"
              subtitle="1.5 a 2 mg/L"
              prefix="cloro_sol"
              color="#00796B"
            />

            <View style={styles.dividerModern} />

            <Text style={styles.subHeaderModern}>Rotina Operacional</Text>
            <View style={styles.operationalBoxModern}>
              <BooleanRow label="Limpeza dos Filtros" name="limpeza_filtros" />
              <View style={styles.separatorModern} />
              <BooleanRow
                label="Abertura das Válvulas"
                name="abertura_valvulas"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>
                  Salvar Registro Diário
                </Text>
                <MaterialCommunityIcons
                  name="check-all"
                  size={24}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  modernCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 10,
  },
  analysisCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  analysisIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00897B",
    alignItems: "center",
    justifyContent: "center",
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  analysisSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  rowMain: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
  labelModern: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputModern: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  inputWarning: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  dateButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    gap: 10,
  },
  dateButtonTextModern: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },

  inputContainerModern: {
    marginTop: 8,
  },
  radioGroupModern: {
    flexDirection: "row",
    gap: 12,
  },
  radioBtnModern: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  radioBtnManhaActive: {
    borderColor: "#F59E0B",
    backgroundColor: "#F59E0B",
  },
  radioBtnTardeActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#3B82F6",
  },
  radioTxtModern: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
  },
  radioTxtActive: {
    color: "#FFF",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 4,
  },

  warningBoxModern: {
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
  warningTextModern: {
    color: "#C2410C",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },

  subHeaderModern: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 0.5,
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
  dividerModern: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },

  operationalBoxModern: {
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
  separatorModern: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },

  saveButton: {
    backgroundColor: "#1E293B",
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
