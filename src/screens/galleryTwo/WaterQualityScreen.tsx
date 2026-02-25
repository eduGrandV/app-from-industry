import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  WaterQualityFormData,
  waterQualitySchema,
} from "../../types/galeryTwo/waterQualitySchema";
import { useState, useEffect } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { DraftService } from "../../services/DraftService";

const DRAFT_KEY = "@draft_water_quality";

const RenderInput = ({
  name,
  label,
  placeholder,
  control,
  errors,
  keyboardType = "numeric",
  width = "half",
}: any) => {
  const errorObj = errors[name];
  const errorMessage = errorObj?.message;

  return (
    <View style={width === "half" ? styles.halfInput : styles.fullInput}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errorMessage && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ? String(value) : ""}
            keyboardType={keyboardType}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
          />
        )}
      />
      {errorMessage && <Text style={styles.errorText}>Fora do padrão</Text>}
    </View>
  );
};

const RenderSection = ({ turno, prefixo, color, control, errors }: any) => (
  <View
    style={[
      styles.sectionContainer,
      { borderLeftColor: color, borderLeftWidth: 6 },
    ]}
  >
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons
        name={turno === "Manhã" ? "weather-sunset" : "weather-night"}
        size={24}
        color={color}
      />
      <Text style={[styles.sectionTitleSmall, { color: color }]}>
        Turno da {turno}
      </Text>
    </View>

    {/* Hora */}
    <View style={styles.inputContainer}>
      <RenderInput
        name={`${prefixo}_hora`}
        label="Horário da Coleta"
        placeholder="Ex: 08:30"
        control={control}
        errors={errors}
        keyboardType="default"
        width="full"
      />
    </View>

    {/* pH */}
    <Text style={styles.subHeader}>pH (6.0 a 9.5)</Text>
    <View style={styles.row}>
      <RenderInput
        name={`${prefixo}_ph_01`}
        label="Água Bruta"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
      <RenderInput
        name={`${prefixo}_ph_03`}
        label="Água Tratada"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
    </View>

    {/* Cloro */}
    <Text style={styles.subHeader}>Cloro (0.2 a 5.0)</Text>
    <View style={styles.row}>
      <RenderInput
        name={`${prefixo}_cloro_02`}
        label="Água Clorada"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
      <RenderInput
        name={`${prefixo}_cloro_03`}
        label="Água Tratada"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
    </View>

    {/* Turbidez */}
    <Text style={styles.subHeader}>Turbidez ({"<"} 5.0)</Text>
    <View style={styles.row}>
      <RenderInput
        name={`${prefixo}_turbidez_01`}
        label="Água Bruta"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
      <RenderInput
        name={`${prefixo}_turbidez_03`}
        label="Água Tratada"
        placeholder="Valor"
        control={control}
        errors={errors}
      />
    </View>

    {/* Obs */}
    <View style={{ marginTop: 8 }}>
      <RenderInput
        name={`${prefixo}_obs`}
        label="Observações / Ações"
        placeholder="Descreva a ação corretiva"
        control={control}
        errors={errors}
        keyboardType="default"
        width="full"
      />
    </View>
  </View>
);

export function WaterQualityScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      responsavel: "",
      manha_hora: "",
      manha_obs: "",
      tarde_hora: "",
      tarde_obs: "",
    },
  });

  useEffect(() => {
    const carregarRascunho = async () => {
      const rascunhoSalvo = await DraftService.getDraft(DRAFT_KEY);
      if (rascunhoSalvo) {
        if (rascunhoSalvo.data) {
          rascunhoSalvo.data = new Date(rascunhoSalvo.data);
        }
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
    console.log("Salvo:", data);
    await DraftService.clearDraft(DRAFT_KEY);
    Alert.alert("Sucesso", "Controle de ETA salvo e rascunho limpo!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- CABEÇALHO GERAL (DATA E RESPONSÁVEL) --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Dia</Text>

          {/* Data */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data do Registro</Text>
            <Controller
              control={control}
              name="data"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons name="event" size={20} color="#6200ee" />
                    <Text style={styles.dateButtonText}>
                      {value
                        ? new Date(value).toLocaleDateString("pt-BR")
                        : "Selecionar"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={value ? new Date(value) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) onChange(selectedDate);
                      }}
                    />
                  )}
                </View>
              )}
            />
          </View>

          {/* Responsável (Assinatura) */}
          <RenderInput
            name="responsavel"
            label="Responsável Técnico"
            placeholder="Nome ou Rubrica"
            control={control}
            errors={errors}
            keyboardType="default"
            width="full"
          />
        </View>

        {/* --- TURNO MANHÃ --- */}
        <RenderSection
          turno="Manhã"
          prefixo="manha"
          color="#FF9800"
          control={control}
          errors={errors}
        />

        {/* --- TURNO TARDE --- */}
        <RenderSection
          turno="Tarde"
          prefixo="tarde"
          color="#3F51B5"
          control={control}
          errors={errors}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Finalizar Diário</Text>
          <MaterialIcons name="check-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 16,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitleSmall: { fontSize: 20, fontWeight: "700" },
  subHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  fullInput: { width: "100%", marginBottom: 12 },
  halfInput: { width: "48%", marginBottom: 12 },

  inputContainer: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  errorText: { color: "#ef4444", fontSize: 11, marginTop: 2 },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  dateButtonText: { marginLeft: 10, fontSize: 15, color: "#334155" },

  saveButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 6,
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
