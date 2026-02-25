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
  SafeAreaView,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { labExtractionSchema, LabExtractionFormData } from '../../types/galeryOne/labExtractionSchema';
import { DraftService } from '../../services/DraftService';

const DRAFT_KEY = '@draft_lab_extraction';


const InputGroup = ({ label, name, control, errors, placeholder, keyboardType = 'default', width = 'full' }: any) => {
  const errorMessage = errors?.[name]?.message;
  return (
    <View style={width === 'half' ? styles.halfInput : styles.fullInput}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errorMessage && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ? String(value) : ''}
            keyboardType={keyboardType}
            placeholder={placeholder || `Digite ${label.toLowerCase()}`}
            placeholderTextColor="#94a3b8"
          />
        )}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};


const MultiSelectChipsWithAdd = ({ control, name, label, defaultOptions }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [customColor, setCustomColor] = useState('');

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const selectedValues = Array.isArray(value) ? value : [];
          
          const allOptions = Array.from(new Set([...defaultOptions, ...selectedValues]));

          const toggleSelection = (opt: string) => {
            if (selectedValues.includes(opt)) onChange(selectedValues.filter(v => v !== opt));
            else onChange([...selectedValues, opt]);
          };

          const handleAddCustom = () => {
            const trimmed = customColor.trim();
            if (trimmed !== '') {
              if (!selectedValues.includes(trimmed)) {
                onChange([...selectedValues, trimmed]);
              }
              setCustomColor('');
              setIsAdding(false);
            }
          };

          return (
            <View style={styles.chipsContainer}>
              {allOptions.map((opt: string) => {
                const isSelected = selectedValues.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleSelection(opt)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}

              {!isAdding ? (
                <TouchableOpacity style={styles.chipAddButton} onPress={() => setIsAdding(true)}>
                  <MaterialIcons name="add" size={18} color="#6200ee" />
                  <Text style={styles.chipAddText}>Outra Cor</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.customChipInputContainer}>
                  <TextInput
                    style={styles.customChipInput}
                    value={customColor}
                    onChangeText={setCustomColor}
                    placeholder="Digite a cor..."
                    autoFocus
                    onSubmitEditing={handleAddCustom}
                  />
                  <TouchableOpacity style={styles.customChipConfirm} onPress={handleAddCustom}>
                    <MaterialIcons name="check" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.customChipCancel} onPress={() => setIsAdding(false)}>
                    <MaterialIcons name="close" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export function LabExtractionScreen() {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<LabExtractionFormData>({
    resolver: zodResolver(labExtractionSchema) as any,
    defaultValues: {
      data: new Date(),
      variedade: '',
      fornecedor: '',
      naoh: 0, brix: 0, acidez: 0, ph: 0, ratio: 0, densidade: 0, temp: 0, aroma: '',
      cor: [], 
      qtde_bag: 0,
      volume: 0,
      sequencias: [{ inicio: 0, fim: 0 }], 
    }
  });

  const { fields: seqFields, append: addSeq, remove: removeSeq } = useFieldArray({
    control,
    name: "sequencias"
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  
  
  
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
  

  const onSubmit = async (data: LabExtractionFormData) => {
    console.log("Dados Extração:", data);
    await DraftService.clearDraft(DRAFT_KEY);
    Alert.alert("Sucesso", "Dados de extração laboratorial salvos!");
  };

  const coresBase = [""];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Dados da Extração</Text>
          <Text style={styles.sectionSubtitle}>Preencha as informações da análise de extração</Text>
        </View>

        {/* 1. IDENTIFICAÇÃO */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="fingerprint" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Identificação</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data da Análise</Text>
            <Controller
              control={control}
              name="data"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                    <MaterialIcons name="calendar-today" size={20} color="#6200ee" />
                    <Text style={styles.dateButtonText}>
                      {value ? new Date(value as any).toLocaleDateString('pt-BR') : 'Selecionar Data'}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={value ? new Date(value as any) : new Date()}
                      mode="date" display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) onChange(selectedDate);
                      }}
                    />
                  )}
                </View>
              )}
            />
          </View>

          <InputGroup name="variedade" label="Variedade" control={control} errors={errors} />
          <InputGroup name="fornecedor" label="Fornecedor" control={control} errors={errors} />
        </View>

        {/* 2. QUÍMICA */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="science" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Análise Química</Text>
          </View>

          <View style={styles.row}>
            <InputGroup name="naoh" label="NaOH" keyboardType="numeric" width="half" control={control} errors={errors} />
            <InputGroup name="brix" label="°Brix" keyboardType="numeric" width="half" control={control} errors={errors} />
          </View>
          <View style={styles.row}>
            <InputGroup name="acidez" label="Acidez (%)" keyboardType="numeric" width="half" control={control} errors={errors} />
            <InputGroup name="ph" label="pH" keyboardType="numeric" width="half" control={control} errors={errors} />
          </View>

          <InputGroup name="ratio" label="Ratio" keyboardType="numeric" control={control} errors={errors} />
        </View>

        {/* 3. FÍSICO & SENSORIAL */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="thermostat" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Físico & Sensorial</Text>
          </View>

          <View style={styles.row}>
            <InputGroup name="densidade" label="Densidade" keyboardType="numeric" width="half" control={control} errors={errors} />
            <InputGroup name="temp" label="Temp (°C)" keyboardType="numeric" width="half" control={control} errors={errors} />
          </View>

          <InputGroup name="aroma" label="Aroma" control={control} errors={errors} />
          
          {/* Múltipla Escolha de Cores com Botão + */}
          <MultiSelectChipsWithAdd control={control} name="cor" label="Cor(es) da Amostra" defaultOptions={coresBase} />
        </View>

        {/* 4. PRODUÇÃO E SEQUÊNCIA DE BAGS */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="factory" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Produção e Sequência de Bags</Text>
          </View>

          <View style={styles.row}>
            <InputGroup name="qtde_bag" label="Total de Bags (Unid)" keyboardType="numeric" width="half" control={control} errors={errors} />
            <InputGroup name="volume" label="Volume Total (L)" keyboardType="numeric" width="half" control={control} errors={errors} />
          </View>

          <Text style={styles.label}>SEQUÊNCIA(S) DE ENCHIMENTO</Text>
          <View style={styles.seqCard}>
            {seqFields.map((field, index) => (
              <View key={field.id} style={styles.seqRow}>
                <View style={styles.seqInputBlock}>
                  <InputGroup name={`sequencias.${index}.inicio`} label="Nº Inicial" keyboardType="numeric" width="half" control={control} errors={errors} placeholder="Ex: 1" />
                </View>
                
                <View style={styles.seqDivider}>
                  <Text style={styles.seqDividerText}>até</Text>
                </View>
                
                <View style={styles.seqInputBlock}>
                  <InputGroup name={`sequencias.${index}.fim`} label="Nº Final" keyboardType="numeric" width="half" control={control} errors={errors} placeholder="Ex: 50" />
                </View>

                {seqFields.length > 1 && (
                  <TouchableOpacity onPress={() => removeSeq(index)} style={styles.seqRemoveBtn}>
                    <MaterialIcons name="close" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.seqAddBtn} onPress={() => addSeq({ inicio: 0, fim: 0 })}>
              <MaterialIcons name="add" size={16} color="#6200ee" />
              <Text style={styles.seqAddText}>Adicionar Outra Sequência</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Salvar Extração</Text>
          <MaterialIcons name="save-alt" size={20} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingVertical: 28, paddingHorizontal: 24, backgroundColor: '#6200ee', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  content: { padding: 20, paddingBottom: 40 },
  formSection: { marginBottom: 32, alignItems: 'center' },
  sectionTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#1e293b' },
  sectionSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', maxWidth: '80%', lineHeight: 20 },
  sectionContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  sectionTitleSmall: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginLeft: 12 },
  
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8, textTransform: 'uppercase' },
  fullInput: { marginBottom: 20, flex: 1 },
  halfInput: { marginBottom: 20, flex: 1 },
  
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, backgroundColor: '#fff', color: '#1e293b', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: '500' },
  
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  dateButtonText: { flex: 1, fontSize: 16, color: '#1e293b', marginLeft: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  chipSelected: { backgroundColor: '#F3E8FF', borderColor: '#6200ee', borderWidth: 1.5 },
  chipText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  chipTextSelected: { color: '#6200ee', fontWeight: '800' },
  
  chipAddButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#6200ee', borderStyle: 'dashed', gap: 4 },
  chipAddText: { fontSize: 13, color: '#6200ee', fontWeight: '700' },
  
  customChipInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1', paddingLeft: 12, overflow: 'hidden' },
  customChipInput: { minWidth: 100, fontSize: 13, color: '#1E293B', paddingVertical: 8 },
  customChipConfirm: { padding: 8, backgroundColor: '#6200ee' },
  customChipCancel: { padding: 8, backgroundColor: '#FEE2E2' },

  
  seqCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  seqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  seqInputBlock: { flex: 1 },
  seqDivider: { marginHorizontal: 10, marginTop: 15 },
  seqDividerText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  seqRemoveBtn: { marginTop: 15, marginLeft: 10, padding: 8, backgroundColor: '#FEE2E2', borderRadius: 8 },
  seqAddBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, backgroundColor: '#F3E8FF', borderRadius: 8, borderWidth: 1, borderColor: '#D8B4FE', borderStyle: 'dashed' },
  seqAddText: { color: '#6200ee', fontWeight: '700', fontSize: 13 },

  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6200ee', borderRadius: 12, paddingVertical: 16, marginTop: 24, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});