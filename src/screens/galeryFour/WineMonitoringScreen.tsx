import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { wineMonitoringSchema, WineMonitoringFormData } from '../../types/galleryFour/wineMonitoringSchema';

export function WineMonitoringScreen() {
  const navigation = useNavigation<any>();

  const { control, handleSubmit } = useForm<WineMonitoringFormData>({
    resolver: zodResolver(wineMonitoringSchema) as any,
    defaultValues: {
      recepcoes: [{ data_recepcao: '', produtor: '', area: '', variedade: '', qtd_caixas: 0, peso_uva_kg: 0, volume_l: 0, rendimento_pct: 0 }],
      vinificacoes: [{ data_hora: '', temp_c: 0, densidade: 0, aroma: '', remontagem: '', trasfega: '', turbidez: '', acucar_correcao: '', levedura_clarificante: '', conservante_antiox: '', tanque_vol: '' }],
      
      
      analises_mosto: [{ variedade: '', brix: 0, att: 0, ratio: 0, ph: 0, densidade: 0, observacao: '' }],
      analises_vinho: [{ densidade: 0, alcool: 0, acidez: 0, acidez_volatil: 0, so2_total: 0, so2_livre: 0, acucar: 0, cor_620: 0, turbidez: 0 }],
      
      assinatura_gerencia: '',
      assinatura_analista: '',
    }
  });

  const { fields: recepcaoFields, append: addRecepcao, remove: removeRecepcao } = useFieldArray({ control, name: "recepcoes" });
  const { fields: vinificacaoFields, append: addVinificacao, remove: removeVinificacao } = useFieldArray({ control, name: "vinificacoes" });
  
  
  const { fields: mostoFields, append: addMosto, remove: removeMosto } = useFieldArray({ control, name: "analises_mosto" });
  const { fields: vinhoFields, append: addVinho, remove: removeVinho } = useFieldArray({ control, name: "analises_vinho" });

  const onSubmit = (data: WineMonitoringFormData) => {
    console.log("Elaboração de Vinhos Salva:", data);
    Alert.alert("Sucesso", "Monitoramento de Vinhos registado com sucesso!");
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
          <View style={[styles.headerIconContainer, { backgroundColor: '#FCE7F3' }]}>
            <MaterialCommunityIcons name="glass-wine" size={32} color="#9D174D" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Elaboração de Vinhos</Text>
            <Text style={styles.headerSubtitle}>Monitoramento do Processo</Text>
          </View>
        </View>

        {/* 1. RECEPÇÃO DE UVA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Recepção de Uva</Text>
          <View style={styles.sectionBody}>
            {recepcaoFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCard}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>Lote / Receção #{index + 1}</Text>
                  {recepcaoFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeRecepcao(index)}><MaterialIcons name="delete" size={20} color="#EF4444" /></TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup label="Data (DD/MM)" name={`recepcoes.${index}.data_recepcao`} />
                  <InputGroup label="Produtor" name={`recepcoes.${index}.produtor`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Área" name={`recepcoes.${index}.area`} />
                  <InputGroup label="Variedade" name={`recepcoes.${index}.variedade`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Qtd. Caixas" name={`recepcoes.${index}.qtd_caixas`} keyboard="numeric" />
                  <InputGroup label="Peso (Kg)" name={`recepcoes.${index}.peso_uva_kg`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Volume (L)" name={`recepcoes.${index}.volume_l`} keyboard="numeric" />
                  <InputGroup label="Rend. Líq (%)" name={`recepcoes.${index}.rendimento_pct`} keyboard="numeric" />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addRecepcao({ data_recepcao: '', produtor: '', area: '', variedade: '', qtd_caixas: 0, peso_uva_kg: 0, volume_l: 0, rendimento_pct: 0 })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#9D174D" />
              <Text style={styles.addText}>Adicionar Nova Receção</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. MONITORAMENTO DE VINIFICAÇÃO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Monitoramento de Vinificação</Text>
          <View style={styles.sectionBody}>
            {vinificacaoFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCard}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>Registo de Vinificação #{index + 1}</Text>
                  {vinificacaoFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeVinificacao(index)}><MaterialIcons name="delete" size={20} color="#EF4444" /></TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup label="Data / Hora" name={`vinificacoes.${index}.data_hora`} placeholder="DD/MM - 00:00" />
                  <InputGroup label="Temp. (°C)" name={`vinificacoes.${index}.temp_c`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Densidade" name={`vinificacoes.${index}.densidade`} keyboard="numeric" />
                  <InputGroup label="Aroma" name={`vinificacoes.${index}.aroma`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Remontagem" name={`vinificacoes.${index}.remontagem`} />
                  <InputGroup label="Trasfega" name={`vinificacoes.${index}.trasfega`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Turbidez" name={`vinificacoes.${index}.turbidez`} />
                  <InputGroup label="Açúcar/Correção" name={`vinificacoes.${index}.acucar_correcao`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Levedura/Clarif." name={`vinificacoes.${index}.levedura_clarificante`} />
                  <InputGroup label="Conser./Antiox" name={`vinificacoes.${index}.conservante_antiox`} />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Tanque / Vol.(L)" name={`vinificacoes.${index}.tanque_vol`} placeholder="Ex: TQ01 - 500L" />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addVinificacao({ data_hora: '', temp_c: 0, densidade: 0, aroma: '', remontagem: '', trasfega: '', turbidez: '', acucar_correcao: '', levedura_clarificante: '', conservante_antiox: '', tanque_vol: '' })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#9D174D" />
              <Text style={styles.addText}>Adicionar Registo de Vinificação</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. ANÁLISES DO MOSTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Análises do Mosto</Text>
          <View style={styles.sectionBody}>
            {mostoFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCard}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>Amostra Mosto #{index + 1}</Text>
                  {mostoFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeMosto(index)}><MaterialIcons name="delete" size={20} color="#EF4444" /></TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup label="Variedade" name={`analises_mosto.${index}.variedade`} flex={2} />
                  <InputGroup label="°Brix" name={`analises_mosto.${index}.brix`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="ATT (%)" name={`analises_mosto.${index}.att`} keyboard="numeric" />
                  <InputGroup label="Ratio" name={`analises_mosto.${index}.ratio`} keyboard="numeric" />
                  <InputGroup label="pH" name={`analises_mosto.${index}.ph`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Dens.(g/cm³)" name={`analises_mosto.${index}.densidade`} keyboard="numeric" />
                  <InputGroup label="Observações" name={`analises_mosto.${index}.observacao`} flex={2} />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addMosto({ variedade: '', brix: 0, att: 0, ratio: 0, ph: 0, densidade: 0, observacao: '' })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#9D174D" />
              <Text style={styles.addText}>Adicionar Análise de Mosto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. ANÁLISES DO VINHO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Análises do Vinho</Text>
          <View style={styles.sectionBody}>
            {vinhoFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCard}>
                <View style={styles.dynamicHeader}>
                  <Text style={styles.dynamicTitle}>Amostra Vinho #{index + 1}</Text>
                  {vinhoFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeVinho(index)}><MaterialIcons name="delete" size={20} color="#EF4444" /></TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup label="Dens.(g/cm³)" name={`analises_vinho.${index}.densidade`} keyboard="numeric" />
                  <InputGroup label="Álcool (%)" name={`analises_vinho.${index}.alcool`} keyboard="numeric" />
                  <InputGroup label="Acidez (g/l)" name={`analises_vinho.${index}.acidez`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Ac. Volátil" name={`analises_vinho.${index}.acidez_volatil`} keyboard="numeric" />
                  <InputGroup label="SO² Total" name={`analises_vinho.${index}.so2_total`} keyboard="numeric" />
                  <InputGroup label="SO² Livre" name={`analises_vinho.${index}.so2_livre`} keyboard="numeric" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup label="Açúcar (g/l)" name={`analises_vinho.${index}.acucar`} keyboard="numeric" />
                  <InputGroup label="Cor (620)" name={`analises_vinho.${index}.cor_620`} keyboard="numeric" />
                  <InputGroup label="Turb.(NTU)" name={`analises_vinho.${index}.turbidez`} keyboard="numeric" />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => addVinho({ densidade: 0, alcool: 0, acidez: 0, acidez_volatil: 0, so2_total: 0, so2_livre: 0, acucar: 0, cor_620: 0, turbidez: 0 })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#9D174D" />
              <Text style={styles.addText}>Adicionar Análise de Vinho</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. ASSINATURAS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitleSmall}>5. Responsáveis</Text>
          <InputGroup label="Assinatura do Analista" name="assinatura_analista" placeholder="Nome / Visto" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura da Gerência" name="assinatura_gerencia" placeholder="Nome / Visto" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Guardar Monitoramento</Text>
          <MaterialCommunityIcons name="content-save-all" size={24} color="#fff" />
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
  sectionTitleSmall: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 16, textTransform: 'uppercase' },
  sectionBody: { padding: 16 },
  row: { flexDirection: "row", gap: 10, alignItems: 'flex-end' },
  label: { fontSize: 10, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  dynamicCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  dynamicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 8 },
  dynamicTitle: { fontSize: 14, fontWeight: '800', color: '#9D174D', textTransform: 'uppercase' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: '#FCE7F3', borderRadius: 12, borderWidth: 1, borderColor: '#FBCFE8', borderStyle: 'dashed' },
  addText: { color: '#9D174D', fontWeight: '700', fontSize: 14 },
  submitButton: { backgroundColor: "#9D174D", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#9D174D", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});