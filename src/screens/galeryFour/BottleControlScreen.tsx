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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  bottleControlSchema,
  BottleControlFormData,
} from "../../types/galleryFour/bottleControlSchema";

export function BottleControlScreen() {
  const navigation = useNavigation<any>();

  const { control, handleSubmit, setValue } = useForm<BottleControlFormData>({
    resolver: zodResolver(bottleControlSchema) as any,
    defaultValues: {
      ano_mes: `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      data: new Date(),
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = (data: BottleControlFormData) => {
    console.log("Controle de Garrafas Salvo:", data);
    Alert.alert("Sucesso", "Controle de Garrafas registrado com sucesso!");
    navigation.goBack();
  };

  const handleScanBarcode = () => {
    navigation.navigate("BarcodeScanner", {
      onScan: (codigo: string) => {
        setValue("codigo_barras", codigo);
      },
    });
  };

  const InputGroup = ({
    label,
    name,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons
              name="bottle-wine"
              size={32}
              color="#0284C7"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Controle de Garrafas</Text>
            <Text style={styles.headerSubtitle}>
              Inspeção e Rastreabilidade
            </Text>
          </View>
          <View style={{ width: 80 }}>
            <InputGroup label="Mês/Ano" name="ano_mes" placeholder="YYYY/MM" />
          </View>
        </View>

        {/* 1. IDENTIFICAÇÃO E DADOS GERAIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Identificação do Lote</Text>
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
                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString("pt-BR")}
                  </Text>
                </TouchableOpacity>
              </View>
              <InputGroup
                label="Lote de Produção"
                name="lote_producao"
                placeholder="Ex: L-001"
              />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup
                label="Modelo da Garrafa"
                name="modelo_garrafa"
                placeholder="Tipo/Capacidade"
              />
              <InputGroup
                label="Lote da Garrafa"
                name="lote_garrafa"
                placeholder="Lote do vasilhame"
              />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup
                label="Fornecedor"
                name="fornecedor"
                placeholder="Fabricante do vidro"
              />
            </View>
          </View>
        </View>

        {/* 2. CÓDIGO DE BARRAS / RASTREABILIDADE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Rastreabilidade</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.label}>CÓDIGO DE BARRAS (EAN)</Text>
            <View style={styles.barcodeContainer}>
              <Controller
                control={control}
                name="codigo_barras"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.barcodeInput}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ""}
                    keyboardType="numeric"
                    placeholder="Digite ou escaneie o código..."
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanBarcode}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. NÃO CONFORMIDADES (PERDAS) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Não Conformidades</Text>
          <View style={styles.sectionBody}>
            <View style={styles.ncGrid}>
              <View style={styles.ncCard}>
                <InputGroup
                  label="G.D."
                  name="nc_gd"
                  placeholder="0"
                  keyboard="numeric"
                />
                <Text style={styles.ncSubtitle}>Garrafas Defeituosas</Text>
              </View>

              <View style={styles.ncCard}>
                <InputGroup
                  label="G.C."
                  name="nc_gc"
                  placeholder="0"
                  keyboard="numeric"
                />
                <Text style={styles.ncSubtitle}>Garrafas Contaminadas</Text>
              </View>

              <View style={styles.ncCard}>
                <InputGroup
                  label="Perdas"
                  name="nc_perdas"
                  placeholder="0"
                  keyboard="numeric"
                />
                <Text style={styles.ncSubtitle}>No Processo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. ASSINATURAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitleSmall}>
            4. Validação e Responsáveis
          </Text>
          <InputGroup
            label="Assinatura do Operador"
            name="assinatura_operador"
            placeholder="Operador da linha"
          />
          <View style={{ height: 16 }} />
          <InputGroup
            label="Assinatura do Analista"
            name="assinatura_analista"
            placeholder="Analista de Qualidade"
          />
          <View style={{ height: 16 }} />
          <InputGroup
            label="Assinatura da Gerência"
            name="assinatura_gerencia"
            placeholder="Gerente de Produção"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Salvar Controle de Garrafas</Text>
          <MaterialCommunityIcons
            name="content-save-check"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#E0F2FE",
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
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    textTransform: "uppercase",
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  sectionBody: { padding: 16 },

  row: { flexDirection: "row", gap: 12, alignItems: "flex-end" },
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

  // Código de Barras
  barcodeContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  barcodeInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
    fontWeight: "600",
    letterSpacing: 1,
  },
  scanButton: {
    backgroundColor: "#0284C7",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 4,
  },

  ncGrid: { flexDirection: "row", gap: 10 },
  ncCard: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  ncSubtitle: {
    fontSize: 10,
    color: "#991B1B",
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
    textTransform: "uppercase",
  },

  submitButton: {
    backgroundColor: "#0284C7",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    shadowColor: "#0284C7",
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
