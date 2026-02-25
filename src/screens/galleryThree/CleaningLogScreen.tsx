import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  CleaningLogFormData,
  cleaningLogSchema,
} from "../../types/galleryThree/cleaningLogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { DraftService } from "../../services/DraftService";

type ParamList = {
  CleaningLog: { areaName: string };
};

const SOLUTIONS_MAP = {
  S1: { name: "Soda Cáustica", color: "#1E293B", icon: "flask" },
  S2: { name: "Ácido Nítrico", color: "#B91C1C", icon: "flask-outline" },
  S3: { name: "Ácido Peracético", color: "#C2410C", icon: "flask-outline" },
  S4: { name: "Hipoclorito", color: "#047857", icon: "water" },
};

const InputGroup = ({
  label,
  name,
  control,
  placeholder,
  keyboard = "default",
  width = "full",
}: any) => (
  <View style={width === "half" ? styles.halfInput : styles.fullInput}>
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

const SolutionButton = ({ type, selectedSolution, setValue }: any) => {
  const isSelected = selectedSolution?.includes(type);
  const info = SOLUTIONS_MAP[type as keyof typeof SOLUTIONS_MAP];

  const toggleSelection = () => {
    const currentSelection = selectedSolution || [];
    if (currentSelection.includes(type)) {
      setValue(
        "tipo_solucao",
        currentSelection.filter((item: string) => item !== type),
      );
    } else {
      setValue("tipo_solucao", [...currentSelection, type]);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.solutionBtn,
        isSelected && { backgroundColor: info.color, borderColor: info.color },
      ]}
      onPress={toggleSelection}
      activeOpacity={0.7}
    >
      <View style={styles.solutionContent}>
        <Text style={[styles.solutionCode, isSelected && styles.textWhite]}>
          {type}
        </Text>
        <Text style={[styles.solutionName, isSelected && styles.textWhite]}>
          {info.name}
        </Text>
      </View>
      {isSelected && (
        <MaterialIcons
          name="check-circle"
          size={16}
          color="#fff"
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
};

export function CleaningLogScreen() {
  const route = useRoute<RouteProp<ParamList, "CleaningLog">>();
  const navigation = useNavigation();
  const { areaName } = route.params || { areaName: "Área Desconhecida" };

  const DRAFT_KEY = `@draft_cleaning_${areaName.replace(/\s+/g, "_")}`;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CleaningLogFormData>({
    resolver: zodResolver(cleaningLogSchema) as any,
    defaultValues: {
      area: areaName,
      data: new Date(),
      tipo_solucao: [],
      operador: "",
      responsavel_analista: "",
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const selectedSolution = watch("tipo_solucao");

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
  }, [reset, DRAFT_KEY]);

  const formAtual = watch();
  useEffect(() => {
    DraftService.saveDraft(DRAFT_KEY, formAtual);
  }, [formAtual, DRAFT_KEY]);

  const onSubmit = async (data: CleaningLogFormData) => {
    const nomesLidos =
      data.tipo_solucao
        ?.map(
          (sigla) => SOLUTIONS_MAP[sigla as keyof typeof SOLUTIONS_MAP].name,
        )
        .join(", ") || "N/A";

    const dadosFinais = {
      ...data,
      nome_solucao_legivel: nomesLidos,
    };

    console.log(dadosFinais);
    await DraftService.clearDraft(DRAFT_KEY);
    Alert.alert(
      "Sucesso",
      `Registro de Limpeza (${areaName}) salvo com sucesso!`,
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons
              name="spray-bottle"
              size={28}
              color="#334155"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Registro de Limpeza</Text>
            <Text style={styles.headerSubtitle}>{areaName}</Text>
          </View>
        </View>

        {/* --- DADOS INICIAIS --- */}
        <View style={styles.card}>
          <View style={styles.rowMain}>
            <View style={{ flex: 1, marginRight: 12 }}>
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
            <InputGroup
              control={control}
              label="pH Água Inicial"
              name="ph_agua_inicial"
              placeholder="0.0"
              keyboard="numeric"
              width="half"
            />
          </View>
        </View>

        {/* --- LIMPEZA / SANITIZAÇÃO --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="science" size={20} color="#0284C7" />
            <Text style={[styles.sectionTitle, { color: "#0369A1" }]}>
              Sanitização Química
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <Text style={styles.subHeader}>
              Selecione as Soluções (Pode marcar várias)
            </Text>

            {/* Grid de Soluções Modificado */}
            <View style={styles.solutionGrid}>
              <SolutionButton
                type="S1"
                selectedSolution={selectedSolution}
                setValue={setValue}
              />
              <SolutionButton
                type="S2"
                selectedSolution={selectedSolution}
                setValue={setValue}
              />
              <SolutionButton
                type="S3"
                selectedSolution={selectedSolution}
                setValue={setValue}
              />
              <SolutionButton
                type="S4"
                selectedSolution={selectedSolution}
                setValue={setValue}
              />
            </View>
            {errors.tipo_solucao && (
              <Text style={styles.errorText}>
                {errors.tipo_solucao.message}
              </Text>
            )}

            <View style={styles.divider} />

            <View style={styles.rowMain}>
              <InputGroup
                control={control}
                label="Início (Hora)"
                name="hora_inicio_limpeza"
                placeholder="00:00"
                width="half"
              />
              <View style={{ width: 12 }} />
              <InputGroup
                control={control}
                label="Fim (Hora)"
                name="hora_fim_limpeza"
                placeholder="00:00"
                width="half"
              />
            </View>

            <View style={styles.rowMain}>
              <InputGroup
                control={control}
                label="Concentração (%)"
                name="concentracao_pct"
                placeholder="%"
                keyboard="numeric"
                width="half"
              />
              <View style={{ width: 12 }} />
              <InputGroup
                control={control}
                label="Temperatura (°C)"
                name="temperatura_c"
                placeholder="°C"
                keyboard="numeric"
                width="half"
              />
            </View>
          </View>
        </View>

        {/* --- ENXÁGUE --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="water-pump"
              size={20}
              color="#059669"
            />
            <Text style={[styles.sectionTitle, { color: "#047857" }]}>
              Enxágue Final
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.rowMain}>
              <InputGroup
                control={control}
                label="Início (Hora)"
                name="hora_inicio_enxague"
                placeholder="00:00"
                width="half"
              />
              <View style={{ width: 12 }} />
              <InputGroup
                control={control}
                label="Fim (Hora)"
                name="hora_fim_enxague"
                placeholder="00:00"
                width="half"
              />
            </View>
            <View style={{ marginTop: 12 }} />
            <InputGroup
              control={control}
              label="pH Água de Enxágue"
              name="ph_agua_enxague"
              placeholder="0.0"
              keyboard="numeric"
              width="full"
            />
          </View>
        </View>

        {/* --- RODAPÉ --- */}
        <View style={styles.card}>
          <InputGroup
            control={control}
            label="Observações / Ocorrências"
            name="observacao"
            placeholder="Digite aqui..."
            width="full"
          />
          <View style={{ height: 16 }} />
          <InputGroup
            control={control}
            label="Nome do Operador"
            name="operador"
            placeholder="Quem realizou a limpeza?"
            width="full"
          />
          <View style={{ height: 16 }} />
          <InputGroup
            control={control}
            label="Responsável / Analista"
            name="responsavel_analista"
            placeholder="Assinatura do responsável"
            width="full"
          />

          {areaName === "Linha de Vinho" && (
            <>
              <View style={{ height: 16 }} />
              <InputGroup
                control={control}
                label="Visto da Gerência"
                name="responsavel_gerencia"
                placeholder="Assinatura do Gerente"
                width="full"
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Salvar Registro</Text>
          <MaterialIcons name="save-alt" size={24} color="#fff" />
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
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
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
    backgroundColor: "#FAFAFA",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionBody: { padding: 20 },

  rowMain: { flexDirection: "row", alignItems: "center" },
  fullInput: { flex: 1 },
  halfInput: { flex: 1 },

  label: {
    fontSize: 11,
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
  dateButton: {
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
  dateText: { fontSize: 15, color: "#334155", fontWeight: "500" },
  subHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 12,
    textTransform: "uppercase",
  },

  solutionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  solutionBtn: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    minHeight: 70,
    justifyContent: "center",
    position: "relative",
  },
  solutionContent: { alignItems: "flex-start" },
  solutionCode: {
    fontSize: 16,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 2,
  },
  solutionName: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  textWhite: { color: "#FFFFFF" },
  checkIcon: { position: "absolute", top: 8, right: 8 },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 20 },

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
