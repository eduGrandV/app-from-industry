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
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { DraftService } from "../../services/DraftService";
import {
  WaterQualityFormData,
  waterQualitySchema,
} from "../../types/galeryTwo/waterQualitySchema";

const DRAFT_KEY = "@draft_water_quality";
const RenderInput = ({
  label,
  name,
  control,
  placeholder,
  keyboardType = "default",
  errors,
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={[styles.input, errors[name] && styles.inputError]}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value ? String(value) : ""}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
        />
      )}
    />
    {errors[name] && (
      <Text style={styles.errorText}>{errors[name].message}</Text>
    )}
  </View>
);

export function WaterQualityScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { usuarioId, nomeOperador } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<WaterQualityFormData>({
    resolver: zodResolver(waterQualitySchema) as any,
    defaultValues: {
      data: new Date(),
      responsavel: nomeOperador || String(usuarioId),
      turno: undefined,
      hora: "",
      obs: "",
    },
  });

  useEffect(() => {
    const carregarRascunho = async () => {
      const rascunhoSalvo = await DraftService.getDraft(DRAFT_KEY);
      if (rascunhoSalvo) {
        if (rascunhoSalvo.data)
          rascunhoSalvo.data = new Date(rascunhoSalvo.data);
        reset(rascunhoSalvo);
      }
    };
    carregarRascunho();
  }, [reset]);

  const formAtual = watch();
  useEffect(() => {
    DraftService.saveDraft(DRAFT_KEY, formAtual);
  }, [formAtual]);

  const onSubmit = async (data: WaterQualityFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: usuarioId };
      await api.post("/water-quality", payload);

      Alert.alert(
        "Sucesso",
        `Análise do turno da ${data.turno} salva com sucesso!`,
      );

      reset({
        data: new Date(),
        responsavel: nomeOperador || String(usuarioId),
        turno: undefined,
        hora: "",
        obs: "",
        ph_01: undefined,
        ph_03: undefined,
        cloro_02: undefined,
        cloro_03: undefined,
        turbidez_01: undefined,
        turbidez_03: undefined,
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível salvar a análise.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="assignment" size={22} color="#667eea" />
              <Text style={styles.cardHeaderTitle}>Informações da Coleta</Text>
            </View>

            
            <View style={styles.inputContainerModern}>
              <Text style={styles.labelModern}>Data do Registro</Text>
              <Controller
                control={control}
                name="data"
                render={({ field: { value, onChange } }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.dateButtonModern}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <MaterialIcons name="event" size={20} color="#667eea" />
                      <Text style={styles.dateButtonTextModern}>
                        {value
                          ? new Date(value).toLocaleDateString("pt-BR")
                          : "Selecionar data"}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(e, selectedDate) => {
                          setShowDatePicker(Platform.OS === "ios");
                          if (selectedDate) onChange(selectedDate);
                        }}
                      />
                    )}
                  </View>
                )}
              />
            </View>

            
            <RenderInput
              name="responsavel"
              label="Responsável Técnico"
              placeholder="Nome completo ou rubrica"
              control={control}
              errors={errors}
            />

            
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
                <Text style={styles.analysisTitle}>Resultados da Coleta</Text>
                <Text style={styles.analysisSubtitle}>
                  Preencha os parâmetros medidos
                </Text>
              </View>
            </View>

            <RenderInput
              name="hora"
              label="Horário da Coleta"
              placeholder="Ex: 08:30"
              control={control}
              errors={errors}
            />

            
            <View style={styles.parameterSection}>
              <View style={styles.parameterHeader}>
                <View style={[styles.parameterBadge, styles.phBadge]}>
                  <Text style={[styles.parameterBadgeText, styles.phBadgeText]}>
                    pH
                  </Text>
                </View>
                <Text style={styles.parameterRange}>
                  Faixa ideal: 6.0 - 9.5
                </Text>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="ph_01"
                    label="Água Bruta"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="ph_03"
                    label="Água Tratada"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            
            <View style={styles.parameterSection}>
              <View style={styles.parameterHeader}>
                <View style={[styles.parameterBadge, styles.cloroBadge]}>
                  <Text
                    style={[styles.parameterBadgeText, styles.cloroBadgeText]}
                  >
                    Cloro
                  </Text>
                </View>
                <Text style={styles.parameterRange}>
                  Faixa ideal: 0.2 - 5.0 mg/L
                </Text>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="cloro_02"
                    label="Água Clorada"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="cloro_03"
                    label="Água Tratada"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            
            <View style={styles.parameterSection}>
              <View style={styles.parameterHeader}>
                <View style={[styles.parameterBadge, styles.turbidezBadge]}>
                  <Text
                    style={[
                      styles.parameterBadgeText,
                      styles.turbidezBadgeText,
                    ]}
                  >
                    Turbidez
                  </Text>
                </View>
                <Text style={styles.parameterRange}>Máximo: 5.0 NTU</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="turbidez_01"
                    label="Água Bruta"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <RenderInput
                    name="turbidez_03"
                    label="Água Tratada"
                    placeholder="Valor"
                    control={control}
                    errors={errors}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            
            <View style={styles.obsSection}>
              <RenderInput
                name="obs"
                label="Observações / Ações Corretivas"
                placeholder="Descreva qualquer ação realizada"
                control={control}
                errors={errors}
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
                <Text style={styles.saveButtonText}>Finalizar Registro</Text>
                <MaterialIcons name="check-circle" size={24} color="#fff" />
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
    backgroundColor: "#f0f4f8",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  modernCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop:20,
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
    borderBottomColor: "#e2e8f0",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 10,
  },
  // Inputs modernos
  inputContainerModern: {
    marginBottom: 16,
  },
  labelModern: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  // Date button moderno
  dateButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    gap: 10,
  },
  dateButtonTextModern: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },
  // Radio buttons modernos
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
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  radioBtnManhaActive: {
    borderColor: "#f59e0b",
    backgroundColor: "#f59e0b",
  },
  radioBtnTardeActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#3b82f6",
  },
  radioTxtModern: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
  },
  radioTxtActive: {
    color: "#fff",
  },
  // Card de análise
  analysisCard: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  analysisIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  analysisSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  // Seções de parâmetros
  parameterSection: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  parameterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  parameterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  parameterBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  phBadge: {
    backgroundColor: "#e0f2fe",
  },
  phBadgeText: {
    color: "#0284c7",
  },
  cloroBadge: {
    backgroundColor: "#dcfce7",
  },
  cloroBadgeText: {
    color: "#16a34a",
  },
  turbidezBadge: {
    backgroundColor: "#fef3c7",
  },
  turbidezBadgeText: {
    color: "#d97706",
  },
  parameterRange: {
    fontSize: 11,
    color: "#94a3b8",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  obsSection: {
    marginTop: 8,
  },
  // Botão de salvar
  saveButton: {
    backgroundColor: "#10b981",
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Mantendo estilos originais
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 6 },
});
