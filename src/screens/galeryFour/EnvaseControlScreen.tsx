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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { envaseControlSchema, EnvaseControlFormData } from '../../types/galleryFour/envaseControlSchema';

export function EnvaseControlScreen() {
  const navigation = useNavigation<any>();

  const { control, handleSubmit } = useForm<EnvaseControlFormData>({
    resolver: zodResolver(envaseControlSchema) as any,
    defaultValues: {
      ano_mes: `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      data: new Date(),
      
      embalagens: [
        { data_embalagem: '', garrafas_embaladas: 0, total_caixas: 0 },
        { data_embalagem: '', garrafas_embaladas: 0, total_caixas: 0 },
        { data_embalagem: '', garrafas_embaladas: 0, total_caixas: 0 }
      ],
    }
  });

  
  const { fields: embalagemFields, append: addEmbalagem, remove: removeEmbalagem } = useFieldArray({
    control,
    name: "embalagens"
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = (data: EnvaseControlFormData) => {
    console.log("Controle de Envase Salvo:", data);
    Alert.alert("Sucesso", "Controle de Envase e Rotulagem salvo com sucesso!");
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

  
  const InsumoCard = ({ title, prefix, icon, color }: { title: string, prefix: string, icon: any, color: string }) => (
    <View style={[styles.insumoCard, { borderTopColor: color }]}>
      <View style={styles.insumoHeader}>
        <MaterialCommunityIcons name={icon} size={20} color={color} />
        <Text style={[styles.insumoTitle, { color }]}>{title}</Text>
      </View>
      
      <View style={styles.row}>
        <InputGroup label="Lote N° (1)" name={`${prefix}.lote_1`} placeholder="Linha 1" />
        <InputGroup label="Lote N° (2)" name={`${prefix}.lote_2`} placeholder="Linha 2" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="Fornecedor" name={`${prefix}.fornecedor`} flex={2} />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="Não Conforme" name={`${prefix}.nao_conforme`} keyboard="numeric" />
        <InputGroup label="Quebra Estoq." name={`${prefix}.quebra_estoque`} keyboard="numeric" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: '#EDE9FE' }]}>
            <MaterialCommunityIcons name="factory" size={32} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Envase e Rotulagem</Text>
            <Text style={styles.headerSubtitle}>Suco de Uva</Text>
          </View>
          <View style={{ width: 80 }}>
            <InputGroup label="Mês/Ano" name="ano_mes" placeholder="MM/YY" />
          </View>
        </View>

        {/* 1. DADOS INICIAIS DA LINHA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Dados da Linha</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DATA</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>{new Date().toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
              </View>
              <InputGroup label="Lote N°" name="lote_numero" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Mod. Garrafa/Tampa" name="modelo_garrafa_tampa" flex={2} />
              <InputGroup label="Temp. Envase(°C)" name="temp_envase_c" keyboard="numeric" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Hora Início" name="hora_ini" placeholder="00:00" />
              <InputGroup label="Hora Fim" name="hora_fim" placeholder="00:00" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Vol. Transf.(L)" name="vol_transferido_L" keyboard="numeric" />
              <InputGroup label="Total Garrafas" name="total_garrafas" keyboard="numeric" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Rend. Líq(%)" name="rendimento_liq_pct" keyboard="numeric" />
              <InputGroup label="Tambor/Bag N°" name="tambor_bag_numero" />
            </View>
          </View>
        </View>

        {/* 2. ANÁLISES DO SUCO (PÓS-ENVASE) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Análises Pós-Envase</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <InputGroup label="°Brix/SST" name="brix" keyboard="numeric" />
              <InputGroup label="Acidez ATT(%)" name="acidez" keyboard="numeric" />
              <InputGroup label="Rel(SST/ATT)" name="relacao" keyboard="numeric" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="pH" name="ph" keyboard="numeric" />
              <InputGroup label="Dens.(g/cm³)" name="densidade" keyboard="numeric" />
              <InputGroup label="Cor (520nm)" name="cor_520nm" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 3. AVALIAÇÃO DE PERDAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Avaliação de Perdas</Text>
          <View style={styles.sectionBody}>
            <View style={styles.gridPerdas}>
              <View style={styles.perdaItem}>
                <InputGroup label="G.F*" name="perda_gf" keyboard="numeric" />
                <Text style={styles.perdaLegenda}>Fermentadas</Text>
              </View>
              <View style={styles.perdaItem}>
                <InputGroup label="G.C*" name="perda_gc" keyboard="numeric" />
                <Text style={styles.perdaLegenda}>Contaminadas</Text>
              </View>
              <View style={styles.perdaItem}>
                <InputGroup label="G.A*" name="perda_ga" keyboard="numeric" />
                <Text style={styles.perdaLegenda}>Para Análise</Text>
              </View>
              <View style={styles.perdaItem}>
                <InputGroup label="G.D*" name="perda_gd" keyboard="numeric" />
                <Text style={styles.perdaLegenda}>Defeituosas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. INSUMOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Controle de Insumos</Text>
          <View style={styles.sectionBody}>
            <InsumoCard title="Garrafas" prefix="insumo_garrafa" icon="bottle-wine" color="#0284C7" />
            <InsumoCard title="Tampas" prefix="insumo_tampa" icon="bottle-tonic" color="#16A34A" />
            <InsumoCard title="Rótulos" prefix="insumo_rotulo" icon="tag-multiple" color="#EA580C" />
          </View>
        </View>

        {/* 5. EMBALAGEM (LISTA DINÂMICA) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Registro de Embalagem</Text>
          <View style={styles.sectionBody}>
            
            {embalagemFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicRow}>
                <View style={styles.row}>
                  <InputGroup label="Data (DD/MM)" name={`embalagens.${index}.data_embalagem`} />
                  <InputGroup label="Garr. Embaladas" name={`embalagens.${index}.garrafas_embaladas`} keyboard="numeric" />
                  <InputGroup label="Total Caixas" name={`embalagens.${index}.total_caixas`} keyboard="numeric" />
                  
                  {/* Botão Remover Linha */}
                  {embalagemFields.length > 1 && (
                    <TouchableOpacity onPress={() => removeEmbalagem(index)} style={styles.removeBtn}>
                      <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={() => addEmbalagem({ data_embalagem: '', garrafas_embaladas: 0, total_caixas: 0 })}>
              <MaterialIcons name="add-circle-outline" size={20} color="#8B5CF6" />
              <Text style={styles.addText}>Adicionar Linha de Embalagem</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* 6. ASSINATURAS E OBS */}
        <View style={styles.card}>
          <InputGroup label="Observações / Ocorrências" name="observacao" placeholder="Algo fora do padrão?" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura Operador" name="assinatura_operador" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura Analista" name="assinatura_analista" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura Gerência" name="assinatura_gerencia" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Salvar Controle de Envase</Text>
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
  sectionBody: { padding: 16 },

  row: { flexDirection: "row", gap: 10, alignItems: 'flex-end' },
  label: { fontSize: 10, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  
  dateButton: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },

  
  gridPerdas: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  perdaItem: { width: '48%', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA' },
  perdaLegenda: { fontSize: 10, color: '#991B1B', fontWeight: '700', marginTop: 6, textAlign: 'center', textTransform: 'uppercase' },

  
  insumoCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, borderTopWidth: 4 },
  insumoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  insumoTitle: { fontSize: 15, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  
  dynamicRow: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  removeBtn: { padding: 10, backgroundColor: '#FEE2E2', borderRadius: 10, height: 42, justifyContent: 'center' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: '#F3E8FF', borderRadius: 12, borderWidth: 1, borderColor: '#D8B4FE', borderStyle: 'dashed' },
  addText: { color: '#7E22CE', fontWeight: '700', fontSize: 14 },

  submitButton: { backgroundColor: "#8B5CF6", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});