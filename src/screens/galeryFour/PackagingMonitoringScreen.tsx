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
  StyleSheet,
} from "react-native";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";


import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { DraftService } from "../../services/DraftService";
import { PackagingMonitoringFormData, packagingMonitoringSchema } from "../../types/galleryFour/packagingMonitoringSchema";

const DRAFT_KEY = "@draft_packaging_monitoring";

const InputGroup = ({
  label,
  name,
  control,
  placeholder,
  keyboard = "default",
  flex = 1,
}: any) => (
  <View style={{ flex }}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={styles.input}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value ? String(value) : ""}
          keyboardType={keyboard}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
        />
      )}
    />
  </View>
);

export function PackagingMonitoringScreen() {
  const navigation = useNavigation<any>();
  const { usuarioId } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const emptyRegistro = {
    horario: "",
    past_pressao: 0,
    past_temp_agua: 0,
    past_temp_suco: 0,
    lav_temp: 0,
    envase_bomba_hz: 0,
    envase_temp_atual: 0,
    envase_temp_garrafa: 0,
    tamp_vazao: 0,
    tamp_perda: 0,
    observacao: "",
  };

  const { control, handleSubmit, reset, watch } =
    useForm<PackagingMonitoringFormData>({
      resolver: zodResolver(packagingMonitoringSchema) as any,
      defaultValues: {
        data: new Date(),
        lote: "",
        registros: [emptyRegistro],

        modelo_garrafa: "",
        jornada_inicio: "",
        jornada_almoco_ini: "",
        jornada_almoco_fim: "",
        jornada_fim: "",
        assinatura_operador: "",
      },
    });

  const {
    fields: registrosFields,
    append: addRegistro,
    remove: removeRegistro,
  } = useFieldArray({
    control,
    name: "registros",
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

  const onSubmit = async (data: PackagingMonitoringFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: usuarioId };
      await api.post("/packaging", payload);
      Alert.alert("Sucesso", "Monitoramento salvo com sucesso!");

      reset({
        data: new Date(),
        lote: "",
        registros: [emptyRegistro],
        modelo_garrafa: "",
        jornada_inicio: "",
        jornada_almoco_ini: "",
        jornada_almoco_fim: "",
        jornada_fim: "",
        assinatura_operador: "",
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao salvar análise.",
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
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.header}>
            <View
              style={[
                styles.headerIconContainer,
                { backgroundColor: "#CCFBF1" },
              ]}
            >
              <MaterialCommunityIcons
                name="pipe-valve"
                size={32}
                color="#0F766E"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Monitoramento Envase</Text>
              <Text style={styles.headerSubtitle}>
                Controle de Equipamentos
              </Text>
            </View>
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Identificação Geral</Text>
            <View style={styles.sectionBody}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>DATA</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons
                      name="calendar-today"
                      size={16}
                      color="#475569"
                      style={{ marginRight: 8 }}
                    />
                    <Controller
                      control={control}
                      name="data"
                      render={({ field: { value } }) => (
                        <Text style={styles.dateText}>
                          {value
                            ? new Date(value).toLocaleDateString("pt-BR")
                            : "Selecione"}
                        </Text>
                      )}
                    />
                  </TouchableOpacity>
                </View>
                <InputGroup
                  control={control}
                  label="Lote N°"
                  name="lote"
                  placeholder="Ex: L-001"
                />
              </View>

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
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. Leituras dos Equipamentos
            </Text>
            <View style={styles.sectionBody}>
              {registrosFields.map((field, index) => (
                <View key={field.id} style={styles.dynamicCard}>
                  <View style={styles.dynamicHeader}>
                    <Text style={styles.dynamicTitle}>LEITURA {index + 1}</Text>
                    {registrosFields.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeRegistro(index)}
                        style={styles.removeBtn}
                      >
                        <MaterialIcons name="close" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  
                  <View
                    style={[
                      styles.equipBlock,
                      { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
                    ]}
                  >
                    <Text style={styles.equipTitle}>
                      <MaterialCommunityIcons
                        name="clipboard-text-outline"
                        size={14}
                      />{" "}
                      Dados da Leitura
                    </Text>
                    <View style={styles.row}>
                      <InputGroup
                        control={control}
                        label="Horário da Leitura"
                        name={`registros.${index}.horario`}
                        placeholder="00:00"
                      />
                      <InputGroup
                        control={control}
                        label="Observações"
                        name={`registros.${index}.observacao`}
                        flex={2}
                      />
                    </View>
                  </View>

                  
                  <View style={styles.equipBlock}>
                    <Text style={styles.equipTitle}>
                      <MaterialCommunityIcons
                        name="thermometer-water"
                        size={14}
                      />{" "}
                      Pasteurizador
                    </Text>
                    <View style={styles.row}>
                      <InputGroup
                        control={control}
                        label="Pressão (Kgf)"
                        name={`registros.${index}.past_pressao`}
                        keyboard="numeric"
                      />
                      <InputGroup
                        control={control}
                        label="T. Água (°C)"
                        name={`registros.${index}.past_temp_agua`}
                        keyboard="numeric"
                      />
                      <InputGroup
                        control={control}
                        label="T. Suco (°C)"
                        name={`registros.${index}.past_temp_suco`}
                        keyboard="numeric"
                      />
                    </View>
                  </View>

                  
                  <View style={styles.equipBlock}>
                    <Text style={styles.equipTitle}>
                      <MaterialCommunityIcons name="water-pump" size={14} />{" "}
                      Lavadora & Envase
                    </Text>
                    <View style={styles.row}>
                      <InputGroup
                        control={control}
                        label="Lav: T.(°C)"
                        name={`registros.${index}.lav_temp`}
                        keyboard="numeric"
                      />
                      <InputGroup
                        control={control}
                        label="Env: Bomba(Hz)"
                        name={`registros.${index}.envase_bomba_hz`}
                        keyboard="numeric"
                      />
                    </View>
                    <View style={[styles.row, { marginTop: 10 }]}>
                      <InputGroup
                        control={control}
                        label="Env: T. Atual(°C)"
                        name={`registros.${index}.envase_temp_atual`}
                        keyboard="numeric"
                      />
                      <InputGroup
                        control={control}
                        label="Env: T. Garrafa(°C)"
                        name={`registros.${index}.envase_temp_garrafa`}
                        keyboard="numeric"
                      />
                    </View>
                  </View>

                  
                  <View style={styles.equipBlock}>
                    <Text style={styles.equipTitle}>
                      <MaterialCommunityIcons name="bottle-tonic" size={14} />{" "}
                      Tampadora
                    </Text>
                    <View style={styles.row}>
                      <InputGroup
                        control={control}
                        label="Vazão (un/h)"
                        name={`registros.${index}.tamp_vazao`}
                        keyboard="numeric"
                      />
                      <InputGroup
                        control={control}
                        label="Perda Tampas"
                        name={`registros.${index}.tamp_perda`}
                        keyboard="numeric"
                      />
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addRegistro(emptyRegistro)}
              >
                <MaterialIcons
                  name="add-circle-outline"
                  size={20}
                  color="#0F766E"
                />
                <Text style={styles.addText}>Adicionar Nova Leitura</Text>
              </TouchableOpacity>
            </View>
          </View>

          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              3. Fechamento do Lote e Jornada
            </Text>
            <View style={styles.sectionBody}>
              <View style={styles.row}>
                <InputGroup
                  control={control}
                  label="Modelo de Garrafa"
                  name="modelo_garrafa"
                  placeholder="Ex: Vidro 1L"
                />
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <InputGroup
                  control={control}
                  label="Início Processo"
                  name="jornada_inicio"
                  placeholder="00:00"
                />
                <InputGroup
                  control={control}
                  label="Fim Processo"
                  name="jornada_fim"
                  placeholder="00:00"
                />
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <InputGroup
                  control={control}
                  label="Almoço (Início)"
                  name="jornada_almoco_ini"
                  placeholder="00:00"
                />
                <InputGroup
                  control={control}
                  label="Almoço (Fim)"
                  name="jornada_almoco_fim"
                  placeholder="00:00"
                />
              </View>
            </View>
          </View>

          
          <View style={styles.card}>
            <Text style={styles.sectionTitleSmall}>4. Validação</Text>
            <InputGroup
              control={control}
              label="Assinatura do Operador"
              name="assinatura_operador"
              placeholder="Nome / Visto do responsável"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? "Salvando..." : "Salvar Monitoramento"}
              </Text>
              {!isSubmitting && (
                <MaterialCommunityIcons
                  name="content-save-all"
                  size={24}
                  color="#fff"
                />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 16, paddingBottom: 60 },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
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
    padding: 20,
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    padding: 16,
    backgroundColor: "#F0FDFA",
    borderBottomWidth: 1,
    borderBottomColor: "#CCFBF1",
    textTransform: "uppercase",
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F766E",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  sectionBody: { padding: 16 },
  row: { flexDirection: "row", gap: 10, alignItems: "flex-end" },
  label: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },
  dynamicCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    borderTopWidth: 4,
    borderTopColor: "#0F766E",
  },
  dynamicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dynamicTitle: { fontSize: 16, fontWeight: "800", color: "#0F766E" },
  removeBtn: { padding: 4, backgroundColor: "#FEE2E2", borderRadius: 8 },
  equipBlock: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  equipTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    backgroundColor: "#CCFBF1",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderStyle: "dashed",
  },
  addText: { color: "#0F766E", fontWeight: "800", fontSize: 14 },
  submitButton: {
    backgroundColor: "#0F766E",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
