import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { raisinMonitoringSchema, RaisinMonitoringFormData } from '../../types/galleryFour/raisinMonitoringSchema';

export function RaisinMonitoringScreen() {
  const navigation = useNavigation<any>();

  const { control, handleSubmit } = useForm<RaisinMonitoringFormData>({
    resolver: zodResolver(raisinMonitoringSchema) as any,
    defaultValues: {
      data_inicio: new Date(),
      data_fim: new Date(),
    }
  });

  const [showDatePickerIni, setShowDatePickerIni] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);

  const onSubmit = (data: RaisinMonitoringFormData) => {
    console.log("Monitoramento Uvas Passas Salvo:", data);
    Alert.alert("Sucesso", "Monitoramento de Uvas Passas registrado!");
    navigation.goBack();
  };

  
  const InputGroup = ({ label, name, placeholder, keyboard = 'default', flex = 1 }: any) => (
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
            value={value ? String(value) : ''}
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: '#FFEDD5' }]}>
            <MaterialCommunityIcons name="fruit-grapes-outline" size={32} color="#C2410C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Uvas Passas</Text>
            <Text style={styles.headerSubtitle}>Monitoramento de Secagem</Text>
          </View>
        </View>

        {/* 1. IDENTIFICAÇÃO DO LOTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Identificação da Fruta</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <InputGroup label="Lote N°" name="lote" placeholder="Ex: L-100" />
              <InputGroup label="Variedade" name="variedade" placeholder="Tipo de uva" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="°Brix (Fruta)" name="brix_fruta" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 2. CRONOGRAMA DE SECAGEM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Cronograma de Processo</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Início do Processo</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePickerIni(true)}>
                  <MaterialIcons name="calendar-today" size={16} color="#475569" style={{ marginRight: 8 }} />
                  <Controller
                    control={control}
                    name="data_inicio"
                    render={({ field: { value } }) => (
                      <Text style={styles.dateText}>
                        {value ? new Date(value).toLocaleDateString('pt-BR') : 'Selecione'}
                      </Text>
                    )}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Fim do Processo</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePickerFim(true)}>
                  <MaterialIcons name="calendar-today" size={16} color="#475569" style={{ marginRight: 8 }} />
                  <Controller
                    control={control}
                    name="data_fim"
                    render={({ field: { value } }) => (
                      <Text style={styles.dateText}>
                        {value ? new Date(value).toLocaleDateString('pt-BR') : 'Selecione'}
                      </Text>
                    )}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* DatePickers ocultos */}
            {showDatePickerIni && (
              <DateTimePicker
                value={new Date()} mode="date" display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePickerIni(Platform.OS === 'ios');
                  
                }}
              />
            )}
            {showDatePickerFim && (
              <DateTimePicker
                value={new Date()} mode="date" display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePickerFim(Platform.OS === 'ios');
                  
                }}
              />
            )}
            
            <View style={[styles.row, { marginTop: 16 }]}>
              <InputGroup label="Temp. de Secagem (°C)" name="temp_secagem_c" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 3. RESULTADOS E RENDIMENTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Rendimento e Finalização</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <InputGroup label="Peso Inicial (Kg)" name="peso_ini_kg" keyboard="numeric" />
              <InputGroup label="Peso Final (Kg)" name="peso_fim_kg" keyboard="numeric" />
            </View>
            
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Rendimento (%)" name="rendimento_pct" keyboard="numeric" />
              <InputGroup label="Teor de Umidade (%)" name="umidade_pct" keyboard="numeric" />
            </View>
            
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Qtd. Embalagem (Un)" name="qtd_embalagem_un" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 4. OBSERVAÇÕES E ASSINATURA */}
        <View style={styles.card}>
          <InputGroup label="Observações do Processo" name="observacao" placeholder="Ex: Anomalias na secagem..." />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura do Analista" name="assinatura_analista" placeholder="Nome/Visto" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Salvar Monitoramento</Text>
          <MaterialCommunityIcons name="content-save-check" size={24} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 16, paddingBottom: 60 },
  header: { marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerIconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 15, color: "#64748B", fontWeight: "600" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: "#E2E8F0" },
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden", marginBottom: 20, shadowColor: "#64748B", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, elevation: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: '#0F172A', padding: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', textTransform: 'uppercase' },
  sectionBody: { padding: 16 },
  row: { flexDirection: "row", gap: 12, alignItems: 'flex-end' },
  label: { fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },
  submitButton: { backgroundColor: "#C2410C", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#C2410C", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});