import React, { useState, useEffect } from 'react';
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

import { sweetsMonitoringSchema, SweetsMonitoringFormData } from '../../types/galleryFour/sweetsMonitoringSchema';
import { DraftService } from '../../services/DraftService';

const DRAFT_KEY = '@draft_sweets_monitoring';


const InputGroup = ({ label, name, control, placeholder, keyboard = 'default', flex = 1 }: any) => (
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

const IngredientCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCard}>
    <Text style={styles.innerCardTitle}>{title}</Text>
    <View style={styles.row}>
      <InputGroup control={control} label="Variedade/Marca" name={`${prefix}.variedade_marca`} flex={2} />
    </View>
    <View style={[styles.row, { marginTop: 10 }]}>
      <InputGroup control={control} label="Fornecedor" name={`${prefix}.fornecedor`} flex={2} />
      <InputGroup control={control} label="Peso (Kg)" name={`${prefix}.peso_kg`} keyboard="numeric" />
    </View>
  </View>
);

const AnaliseCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCard}>
    <Text style={styles.innerCardTitle}>{title}</Text>
    <View style={styles.row}>
      <InputGroup control={control} label="°Brix (SST)" name={`${prefix}.brix`} keyboard="numeric" />
      <InputGroup control={control} label="Acidez ATT(%)" name={`${prefix}.acidez`} keyboard="numeric" />
    </View>
    <View style={[styles.row, { marginTop: 10 }]}>
      <InputGroup control={control} label="SST/ATT" name={`${prefix}.relacao`} keyboard="numeric" />
      <InputGroup control={control} label="pH" name={`${prefix}.ph`} keyboard="numeric" />
    </View>
  </View>
);

const EmbalagemCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCard}>
    <Text style={styles.innerCardTitle}>{title}</Text>
    <View style={styles.row}>
      <InputGroup control={control} label="Fornecedor" name={`${prefix}.fornecedor`} flex={2} />
    </View>
    <View style={[styles.row, { marginTop: 10 }]}>
      <InputGroup control={control} label="Não Conforme" name={`${prefix}.nao_conforme`} keyboard="numeric" />
      <InputGroup control={control} label="Quebra Estoq." name={`${prefix}.quebra_estoque`} keyboard="numeric" />
    </View>
  </View>
);

export function SweetsMonitoringScreen() {
  const navigation = useNavigation<any>();

  
  const emptyRecepcao = { turno: '', produtor: '', fruta: '', variedade: '', peso_total_kg: 0, hora_ini: '', hora_fim: '', vol_polpa_kg: 0, vol_doce_kg: 0, total_potes: 0, total_caixas: 0 };
  const emptyIngredientes = { ref_lote: '', ingrediente_fruta: { variedade_marca: '', fornecedor: '', peso_kg: 0 }, ingrediente_agua: { variedade_marca: '', fornecedor: '', peso_kg: 0 }, ingrediente_acucar: { variedade_marca: '', fornecedor: '', peso_kg: 0 }, ingrediente_pectina: { variedade_marca: '', fornecedor: '', peso_kg: 0 }, ingrediente_suco: { variedade_marca: '', fornecedor: '', peso_kg: 0 } };
  const emptyAnalises = { ref_lote: '', analise_fruta: { brix: 0, acidez: 0, relacao: 0, ph: 0 }, analise_doce: { brix: 0, acidez: 0, relacao: 0, ph: 0 } };
  const emptyPerdasProd = { ref_lote: '', perda_ponto_preto: 0, perda_corpo_estranho: 0, perda_pote_quebrado: 0, perda_pote_contaminado: 0, perda_tampa_amassada: 0, perda_falta_lote: '', perda_extras: '' };
  const emptyPerdasEmb = { ref_lote: '', emb_potes: { fornecedor: '', nao_conforme: 0, quebra_estoque: 0 }, emb_tampas: { fornecedor: '', nao_conforme: 0, quebra_estoque: 0 }, emb_rotulos: { fornecedor: '', nao_conforme: 0, quebra_estoque: 0 } };

  const { control, handleSubmit, reset, watch } = useForm<SweetsMonitoringFormData>({
    resolver: zodResolver(sweetsMonitoringSchema) as any,
    defaultValues: {
      data: new Date(),
      recepcoes: [emptyRecepcao],
      ingredientes: [emptyIngredientes],
      analises: [emptyAnalises],
      perdas_producao: [emptyPerdasProd],
      perdas_embalagem: [emptyPerdasEmb],
    }
  });

  
  const { fields: recFields, append: addRec, remove: remRec } = useFieldArray({ control, name: "recepcoes" });
  const { fields: ingFields, append: addIng, remove: remIng } = useFieldArray({ control, name: "ingredientes" });
  const { fields: anaFields, append: addAna, remove: remAna } = useFieldArray({ control, name: "analises" });
  const { fields: prodFields, append: addProd, remove: remProd } = useFieldArray({ control, name: "perdas_producao" });
  const { fields: embFields, append: addEmb, remove: remEmb } = useFieldArray({ control, name: "perdas_embalagem" });

  const [showDatePicker, setShowDatePicker] = useState(false);

  
  
  
  useEffect(() => {
    const carregarRascunho = async () => {
      const rascunhoSalvo = await DraftService.getDraft(DRAFT_KEY);
      if (rascunhoSalvo) {
        if (rascunhoSalvo.data) { rascunhoSalvo.data = new Date(rascunhoSalvo.data); }
        reset(rascunhoSalvo);
      }
    };
    carregarRascunho();
  }, [reset]);

  const formAtual = watch();
  useEffect(() => {
    DraftService.saveDraft(DRAFT_KEY, formAtual);
  }, [formAtual]);
  

  const onSubmit = async (data: SweetsMonitoringFormData) => {
    console.log("Elaboração de Doces Salva:", data);
    await DraftService.clearDraft(DRAFT_KEY);
    Alert.alert("Sucesso", "Monitoramento de Doces guardado oficialmente!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: '#FFEDD5' }]}>
            <MaterialCommunityIcons name="food-apple" size={32} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Elaboração de Doces</Text>
            <Text style={styles.headerSubtitle}>Monitoramento Fragmentado</Text>
          </View>
        </View>

        {/* DATA GERAL */}
        <View style={styles.card}>
          <Text style={styles.label}>DATA DE PRODUÇÃO GERAL</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <MaterialIcons name="calendar-today" size={16} color="#475569" style={{ marginRight: 8 }} />
            <Controller
              control={control}
              name="data"
              render={({ field: { value } }) => (
                <Text style={styles.dateText}>
                  {value ? new Date(value).toLocaleDateString('pt-BR') : 'Selecione a data'}
                </Text>
              )}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={new Date()} mode="date" display="default" onChange={(e, selectedDate?: Date) => setShowDatePicker(Platform.OS === 'ios')} />
          )}
        </View>

        {/* 1. RECEÇÃO E RESUMO */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>1. Receção e Produção</Text>
          {recFields.map((field, index) => (
            <View key={field.id} style={styles.dynamicCard}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>Lote / Receção {index + 1}</Text>
                {recFields.length > 1 && (<TouchableOpacity onPress={() => remRec(index)} style={styles.removeBtn}><MaterialIcons name="close" size={20} color="#EA580C" /></TouchableOpacity>)}
              </View>
              <View style={styles.row}>
                <InputGroup control={control} label="Turno" name={`recepcoes.${index}.turno`} placeholder="Ex: Manhã" />
                <InputGroup control={control} label="Produtor" name={`recepcoes.${index}.produtor`} />
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <InputGroup control={control} label="Fruta" name={`recepcoes.${index}.fruta`} />
                <InputGroup control={control} label="Variedade" name={`recepcoes.${index}.variedade`} />
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <InputGroup control={control} label="Hora Início" name={`recepcoes.${index}.hora_ini`} placeholder="00:00" />
                <InputGroup control={control} label="Hora Fim" name={`recepcoes.${index}.hora_fim`} placeholder="00:00" />
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <InputGroup control={control} label="Peso Total (Kg)" name={`recepcoes.${index}.peso_total_kg`} keyboard="numeric" />
                <InputGroup control={control} label="Total Potes" name={`recepcoes.${index}.total_potes`} keyboard="numeric" />
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addMiniBtn} onPress={() => addRec(emptyRecepcao)}>
            <MaterialIcons name="add" size={18} color="#EA580C" />
            <Text style={styles.addMiniText}>Adicionar Receção</Text>
          </TouchableOpacity>
        </View>

        {/* 2. INGREDIENTES */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>2. Ingredientes</Text>
          {ingFields.map((field, index) => (
            <View key={field.id} style={styles.dynamicCard}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>Bloco Ingredientes {index + 1}</Text>
                {ingFields.length > 1 && (<TouchableOpacity onPress={() => remIng(index)} style={styles.removeBtn}><MaterialIcons name="close" size={20} color="#EA580C" /></TouchableOpacity>)}
              </View>
              <InputGroup control={control} label="Lote Referência" name={`ingredientes.${index}.ref_lote`} placeholder="Ex: Lote Manhã" />
              <View style={{height: 12}}/>
              <IngredientCard control={control} title="Fruta/Blender" prefix={`ingredientes.${index}.ingrediente_fruta`} />
              <IngredientCard control={control} title="Água" prefix={`ingredientes.${index}.ingrediente_agua`} />
              <IngredientCard control={control} title="Açúcar" prefix={`ingredientes.${index}.ingrediente_acucar`} />
            </View>
          ))}
          <TouchableOpacity style={styles.addMiniBtn} onPress={() => addIng(emptyIngredientes)}>
            <MaterialIcons name="add" size={18} color="#EA580C" />
            <Text style={styles.addMiniText}>Adicionar Ingredientes</Text>
          </TouchableOpacity>
        </View>

        {/* 3. ANÁLISES */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>3. Análises Físico-Químicas</Text>
          {anaFields.map((field, index) => (
            <View key={field.id} style={styles.dynamicCard}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>Análise {index + 1}</Text>
                {anaFields.length > 1 && (<TouchableOpacity onPress={() => remAna(index)} style={styles.removeBtn}><MaterialIcons name="close" size={20} color="#EA580C" /></TouchableOpacity>)}
              </View>
              <InputGroup control={control} label="Lote Referência" name={`analises.${index}.ref_lote`} placeholder="Ex: Lote 01" />
              <View style={{height: 12}}/>
              <AnaliseCard control={control} title="Análise da Fruta" prefix={`analises.${index}.analise_fruta`} />
              <AnaliseCard control={control} title="Análise do Doce/Geleia" prefix={`analises.${index}.analise_doce`} />
            </View>
          ))}
          <TouchableOpacity style={styles.addMiniBtn} onPress={() => addAna(emptyAnalises)}>
            <MaterialIcons name="add" size={18} color="#EA580C" />
            <Text style={styles.addMiniText}>Nova Análise</Text>
          </TouchableOpacity>
        </View>

        {/* 4. PERDAS PRODUÇÃO */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>4. Perdas de Produção</Text>
          {prodFields.map((field, index) => (
            <View key={field.id} style={styles.dynamicCard}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>Registo de Perdas {index + 1}</Text>
                {prodFields.length > 1 && (<TouchableOpacity onPress={() => remProd(index)} style={styles.removeBtn}><MaterialIcons name="close" size={20} color="#EA580C" /></TouchableOpacity>)}
              </View>
              <InputGroup control={control} label="Lote Referência" name={`perdas_producao.${index}.ref_lote`} placeholder="Ex: Lote 01" />
              <View style={{height: 12}}/>
              <View style={styles.row}>
                <InputGroup control={control} label="Pote Quebrado" name={`perdas_producao.${index}.perda_pote_quebrado`} keyboard="numeric" />
                <InputGroup control={control} label="Contaminado" name={`perdas_producao.${index}.perda_pote_contaminado`} keyboard="numeric" />
                <InputGroup control={control} label="Corpo Est." name={`perdas_producao.${index}.perda_corpo_estranho`} keyboard="numeric" />
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addMiniBtn} onPress={() => addProd(emptyPerdasProd)}>
            <MaterialIcons name="add" size={18} color="#EA580C" />
            <Text style={styles.addMiniText}>Registo de Perdas</Text>
          </TouchableOpacity>
        </View>

        {/* 5. PERDAS EMBALAGEM */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionBlockTitle}>5. Perdas de Embalagem</Text>
          {embFields.map((field, index) => (
            <View key={field.id} style={styles.dynamicCard}>
              <View style={styles.dynamicHeader}>
                <Text style={styles.dynamicTitle}>Perdas Embalagem {index + 1}</Text>
                {embFields.length > 1 && (<TouchableOpacity onPress={() => remEmb(index)} style={styles.removeBtn}><MaterialIcons name="close" size={20} color="#EA580C" /></TouchableOpacity>)}
              </View>
              <InputGroup control={control} label="Lote Referência" name={`perdas_embalagem.${index}.ref_lote`} placeholder="Ex: Potes 500g" />
              <View style={{height: 12}}/>
              <EmbalagemCard control={control} title="Potes" prefix={`perdas_embalagem.${index}.emb_potes`} />
              <EmbalagemCard control={control} title="Tampas" prefix={`perdas_embalagem.${index}.emb_tampas`} />
            </View>
          ))}
          <TouchableOpacity style={styles.addMiniBtn} onPress={() => addEmb(emptyPerdasEmb)}>
            <MaterialIcons name="add" size={18} color="#EA580C" />
            <Text style={styles.addMiniText}>Perdas Embalagem</Text>
          </TouchableOpacity>
        </View>

        {/* 6. VALIDAÇÃO FINAL */}
        <View style={styles.card}>
          <Text style={styles.sectionTitleSmall}>6. Validação Geral</Text>
          <InputGroup control={control} label="Observações do Dia" name="observacoes" placeholder="Algum comentário global sobre o dia?" />
          <View style={{ height: 16 }} />
          <InputGroup control={control} label="Assinatura do Responsável" name="assinatura_responsavel" placeholder="Nome / Visto" />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
          <Text style={styles.submitText}>Guardar Monitoramento Oficial</Text>
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
  
  sectionBlock: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, elevation: 2 },
  sectionBlockTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16, textTransform: 'uppercase' },
  sectionTitleSmall: { fontSize: 14, fontWeight: '800', color: '#EA580C', marginBottom: 16, textTransform: 'uppercase' },

  dynamicCard: { backgroundColor: '#FAFAFA', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 16 },
  dynamicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#FED7AA' },
  dynamicTitle: { fontSize: 14, fontWeight: '800', color: '#EA580C', textTransform: 'uppercase' },
  removeBtn: { padding: 6, backgroundColor: '#FFEDD5', borderRadius: 8 },

  innerCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  innerCardTitle: { fontSize: 13, fontWeight: '800', color: '#EA580C', marginBottom: 12, textTransform: 'uppercase' },

  row: { flexDirection: "row", gap: 10, alignItems: 'flex-end' },
  label: { fontSize: 10, color: "#64748B", marginBottom: 6, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, backgroundColor: "#FFFFFF", color: "#0F172A", fontWeight: "500" },
  
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  dateText: { fontSize: 14, color: "#0F172A", fontWeight: "500" },

  addMiniBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, backgroundColor: '#FFF7ED', borderRadius: 12, borderWidth: 1, borderColor: '#FDBA74', borderStyle: 'dashed' },
  addMiniText: { color: '#EA580C', fontWeight: '800', fontSize: 13 },

  submitButton: { backgroundColor: "#EA580C", borderRadius: 16, paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#EA580C", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});