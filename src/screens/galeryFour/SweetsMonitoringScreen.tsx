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

import { sweetsMonitoringSchema, SweetsMonitoringFormData } from '../../types/galleryFour/sweetsMonitoringSchema';

export function SweetsMonitoringScreen() {
  const navigation = useNavigation<any>();

  const { control, handleSubmit } = useForm<SweetsMonitoringFormData>({
    resolver: zodResolver(sweetsMonitoringSchema) as any,
    defaultValues: {
      data: new Date(),
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = (data: SweetsMonitoringFormData) => {
    console.log("Elaboração de Doces Salva:", data);
    Alert.alert("Sucesso", "Monitoramento de Doces registado com sucesso!");
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

  
  const IngredientCard = ({ title, prefix }: { title: string, prefix: string }) => (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardTitle}>{title}</Text>
      <View style={styles.row}>
        <InputGroup label="Variedade/Marca" name={`${prefix}.variedade_marca`} flex={2} />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="Fornecedor" name={`${prefix}.fornecedor`} flex={2} />
        <InputGroup label="Peso (Kg)" name={`${prefix}.peso_kg`} keyboard="numeric" />
      </View>
    </View>
  );

  
  const AnaliseCard = ({ title, prefix }: { title: string, prefix: string }) => (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardTitle}>{title}</Text>
      <View style={styles.row}>
        <InputGroup label="°Brix (SST)" name={`${prefix}.brix`} keyboard="numeric" />
        <InputGroup label="Acidez ATT(%)" name={`${prefix}.acidez`} keyboard="numeric" />
      </View>
      <View style={[styles.row, { marginTop: 10 }]}>
        <InputGroup label="SST/ATT" name={`${prefix}.relacao`} keyboard="numeric" />
        <InputGroup label="pH" name={`${prefix}.ph`} keyboard="numeric" />
      </View>
    </View>
  );

  
  const EmbalagemCard = ({ title, prefix }: { title: string, prefix: string }) => (
    <View style={styles.innerCard}>
      <Text style={styles.innerCardTitle}>{title}</Text>
      <View style={styles.row}>
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
          <View style={[styles.headerIconContainer, { backgroundColor: '#FFEDD5' }]}>
            <MaterialCommunityIcons name="food-apple" size={32} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Elaboração de Doces</Text>
            <Text style={styles.headerSubtitle}>Monitoramento de Produção</Text>
          </View>
        </View>

        {/* 1. RECEPÇÃO E DADOS GERAIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Recepção e Resumo</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DATA</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <MaterialIcons name="calendar-today" size={16} color="#475569" style={{ marginRight: 8 }} />
                  <Text style={styles.dateText}>{new Date().toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
              </View>
              <InputGroup label="Produtor" name="produtor" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Fruta" name="fruta" />
              <InputGroup label="Variedade" name="variedade" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Peso Total(Kg)" name="peso_total_kg" keyboard="numeric" />
              <InputGroup label="Hora Início" name="hora_ini" placeholder="00:00" />
              <InputGroup label="Hora Fim" name="hora_fim" placeholder="00:00" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Vol. Polpa(Kg)" name="vol_polpa_kg" keyboard="numeric" />
              <InputGroup label="Vol. Doce(Kg)" name="vol_doce_kg" keyboard="numeric" />
            </View>

            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Total Potes" name="total_potes" keyboard="numeric" />
              <InputGroup label="Total Caixas" name="total_caixas" keyboard="numeric" />
            </View>
          </View>
        </View>

        {/* 2. INGREDIENTES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Ingredientes Utilizados</Text>
          <View style={styles.sectionBody}>
            <IngredientCard title="Fruta / Blender" prefix="ingrediente_fruta" />
            <IngredientCard title="Água" prefix="ingrediente_agua" />
            <IngredientCard title="Açúcar" prefix="ingrediente_acucar" />
            <IngredientCard title="Pectina" prefix="ingrediente_pectina" />
            <IngredientCard title="Suco" prefix="ingrediente_suco" />
          </View>
        </View>

        {/* 3. ANÁLISES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Análises Físico-Químicas</Text>
          <View style={styles.sectionBody}>
            <AnaliseCard title="Análise da Fruta" prefix="analise_fruta" />
            <AnaliseCard title="Análise do Doce/Geleia" prefix="analise_doce" />
          </View>
        </View>

        {/* 4. CONTROLE DE PERDAS (PRODUÇÃO) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Controle de Produção (Perdas)</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <InputGroup label="Ponto Preto" name="perda_ponto_preto" keyboard="numeric" />
              <InputGroup label="Corpo Estranho" name="perda_corpo_estranho" keyboard="numeric" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Pote Quebrado" name="perda_pote_quebrado" keyboard="numeric" />
              <InputGroup label="Pote Contaminado" name="perda_pote_contaminado" keyboard="numeric" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Tampa Amassada" name="perda_tampa_amassada" keyboard="numeric" />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Falta/Lote" name="perda_falta_lote" placeholder="Descrição do lote ausente" flex={2} />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <InputGroup label="Extras" name="perda_extras" placeholder="Outras perdas" flex={2} />
            </View>
          </View>
        </View>

        {/* 5. PERDAS DE EMBALAGEM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Perdas de Embalagem</Text>
          <View style={styles.sectionBody}>
            <EmbalagemCard title="Potes" prefix="emb_potes" />
            <EmbalagemCard title="Tampas" prefix="emb_tampas" />
            <EmbalagemCard title="Rótulos" prefix="emb_rotulos" />
          </View>
        </View>

        {/* 6. OBSERVAÇÕES E ASSINATURAS */}
        <View style={styles.card}>
          <InputGroup label="Observações Gerais" name="observacoes" placeholder="Algum comentário sobre a produção?" />
          <View style={{ height: 16 }} />
          <InputGroup label="Assinatura do Responsável" name="assinatura_responsavel" placeholder="Nome / Visto" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Salvar Monitoramento de Doces</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: "800", color: '#0F172A', padding: 16, backgroundColor: '#FFF7ED', borderBottomWidth: 1, borderBottomColor: '#FED7AA', textTransform: 'uppercase' },
  sectionBody: { padding: 16 },

  innerCard: { backgroundColor: '#FAFAFA', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  innerCardTitle: { fontSize: 14, fontWeight: '800', color: '#EA580C', marginBottom: 12, textTransform: 'uppercase' },

  row: { flexDirection: "row", gap: 10, alignItems: 'flex-end' },
  label: { fontSize: 10, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },

  submitButton: { backgroundColor: "#EA580C", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#EA580C", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});