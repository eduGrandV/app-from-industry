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
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { extractionControlSchema, ExtractionControlFormData } from '../../types/galleryFour/extractionControlSchema';

export function ExtractionControlScreen() {
  const navigation = useNavigation();

  const { control, handleSubmit, setValue } = useForm<ExtractionControlFormData>({
    resolver: zodResolver(extractionControlSchema) as any,
    defaultValues: {
      ano_mes: `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      data_recepcao: new Date(),
      tambores: [{ numero: '', volume_L: 0 }], 
    }
  });

  
  const { fields: tamborFields, append: addTambor, remove: removeTambor } = useFieldArray({
    control,
    name: "tambores"
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  
  const tamboresWatch = useWatch({ control, name: "tambores" }) || [];
  const totalVolume = tamboresWatch.reduce((acc, curr) => acc + (Number(curr.volume_L) || 0), 0);

  const onSubmit = (data: ExtractionControlFormData) => {
    console.log("Controle de Extração Salvo:", data);
    Alert.alert("Sucesso", "Controle de Extração de Suco salvo com sucesso!");
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

  
  const TempStepCard = ({ title, prefix }: { title: string, prefix: string }) => (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardTitle}>{title}</Text>
      <View style={styles.row}>
        <InputGroup label="Temp Inicial" name={`${prefix}.temp_ini`} placeholder="°C" keyboard="numeric" />
        <InputGroup label="Temp Final" name={`${prefix}.temp_fim`} placeholder="°C" keyboard="numeric" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="Hora Inicial" name={`${prefix}.hora_ini`} placeholder="00:00" />
        <InputGroup label="Hora Final" name={`${prefix}.hora_fim`} placeholder="00:00" />
      </View>
    </View>
  );

  
  const AnaliseCard = ({ title, prefix }: { title: string, prefix: string }) => (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardTitle}>{title}</Text>
      <View style={styles.row}>
        <InputGroup label="°Brix/SST" name={`${prefix}.brix`} keyboard="numeric" />
        <InputGroup label="Acidez ATT(%)" name={`${prefix}.acidez`} keyboard="numeric" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="SST/ATT" name={`${prefix}.relacao`} keyboard="numeric" />
        <InputGroup label="pH" name={`${prefix}.ph`} keyboard="numeric" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="Dens. (g/cm³)" name={`${prefix}.densidade`} keyboard="numeric" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="fruit-grapes" size={32} color="#7E22CE" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Controle de Extração</Text>
            <Text style={styles.headerSubtitle}>Suco de Uva</Text>
          </View>
          <View style={{ width: 80 }}>
            <InputGroup label="Mês/Ano" name="ano_mes" placeholder="YYYY/MM" />
          </View>
        </View>

        {/* 1. RECEPÇÃO DA UVA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Recepção da Uva</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DATA</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString('pt-BR')} {/* Simplificado para o visual */}
                  </Text>
                </TouchableOpacity>
              </View>
              <InputGroup label="Produtor" name="produtor" placeholder="Nome" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Área" name="area" placeholder="Setor" />
              <InputGroup label="Variedade" name="variedade" placeholder="Tipo de uva" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Qtd. Caixas" name="qtd_caixas" keyboard="numeric" />
              <InputGroup label="Peso Total (kg)" name="peso_total_kg" keyboard="numeric" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Início Extração" name="hora_ini_extracao" placeholder="00:00" />
              <InputGroup label="Fim Extração" name="hora_fim_extracao" placeholder="00:00" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Rendimento Liq. (%)" name="rendimento_liq_pct" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 2. INSUMOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Insumos</Text>
          <View style={styles.sectionBody}>
            <Text style={styles.subHeader}>Enzima</Text>
            <View style={styles.row}>
              <InputGroup label="Tipo" name="enzima_tipo" />
              <InputGroup label="Fornecedor" name="enzima_forn" />
              <InputGroup label="Total (ml)" name="enzima_total_ml" keyboard="numeric" />
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.subHeader}>Bags</Text>
            <View style={styles.row}>
              <InputGroup label="Lote Nº" name="bag_lote" />
              <InputGroup label="Fornecedor" name="bag_forn" />
              <InputGroup label="Não Conf." name="bag_nao_conforme" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 3. CONTROLE DE TEMPERATURA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Controle de Temperatura</Text>
          <View style={styles.sectionBody}>
            <TempStepCard title="Tratamento Enzimático" prefix="temp_enzimatico" />
            <TempStepCard title="Pasteurização" prefix="temp_pasteurizacao" />
            <TempStepCard title="Envase" prefix="temp_envase" />
          </View>
        </View>

        {/* 4. ANÁLISES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Análise Físico-Química</Text>
          <View style={styles.sectionBody}>
            <AnaliseCard title="Análise da Uva" prefix="analise_uva" />
            <AnaliseCard title="Análise do Suco" prefix="analise_suco" />
          </View>
        </View>

        {/* 5. ESTABILIZAÇÃO / TAMBORES (LISTA DINÂMICA) */}
        <View style={styles.section}>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 }]}>
            <Text style={styles.sectionTitle}>5. Armazenagem (Tambores)</Text>
            <Text style={styles.totalBadge}>Total: {totalVolume} L</Text>
          </View>
          
          <View style={styles.sectionBody}>
            {tamborFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicRow}>
                <View style={styles.row}>
                  <InputGroup label={`Tambor Nº`} name={`tambores.${index}.numero`} />
                  <InputGroup label="Volume (L)" name={`tambores.${index}.volume_L`} keyboard="numeric" />
                  
                  {tamborFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeTambor(index)} style={styles.removeBtn}>
                      <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={() => addTambor({ numero: '', volume_L: 0 })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#0284C7" />
              <Text style={styles.addText}>Adicionar Tambor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. ASSINATURAS E OBS */}
        <View style={styles.card}>
          <InputGroup label="Observações" name="observacao" placeholder="Ocorrências no processo..." />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura do Analista" name="assinatura_analista" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura da Gerência" name="assinatura_gerencia" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Salvar Controle de Extração</Text>
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
  headerIconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 16, color: "#64748B", fontWeight: "600" },

  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: "#E2E8F0" },
  
  section: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden", marginBottom: 20, shadowColor: "#64748B", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, elevation: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: '#0F172A', padding: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', textTransform: 'uppercase' },
  sectionBody: { padding: 16 },

  innerCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  innerCardTitle: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 12, textTransform: 'uppercase' },

  row: { flexDirection: "row", gap: 12, alignItems: 'flex-end' },
  label: { fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  
  dateButton: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },

  subHeader: { fontSize: 13, fontWeight: "800", color: "#475569", marginBottom: 10, textTransform: "uppercase" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 16 },

  
  dynamicRow: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  removeBtn: { padding: 10, backgroundColor: '#FEE2E2', borderRadius: 10, height: 44, justifyContent: 'center' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: '#F0F9FF', borderRadius: 12, borderWidth: 1, borderColor: '#BAE6FD', borderStyle: 'dashed' },
  addText: { color: '#0284C7', fontWeight: '700', fontSize: 14 },
  totalBadge: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, color: '#fff', fontWeight: 'bold', fontSize: 12, overflow: 'hidden' },

  submitButton: { backgroundColor: "#7E22CE", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#7E22CE", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});