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
  SafeAreaView,
} from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import { LabWineFormData, labWineSchema } from '../../types/galeryOne/labWineSchema';

export function LabWineScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(labWineSchema),
    defaultValues: {
      data: new Date(),
      analista: '',
      marca_tanque: '',
      lote: '',
      alcool: '',
      densidade: '',
      acidez_total: '',
      acidez_volatil: '',
      so2_total: '',
      so2_livre: '',
      turbidez: '',
      indice_cor: '',
      ph: '',
      acucar: '',
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const acucarValor = useWatch({ control, name: 'acucar' });
  const getClassificacao = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return null;
    if (val <= 4) return { label: 'SECO (≤4)', color: '#4caf50' };
    if (val > 25 && val <= 80) return { label: 'SUAVE (>25 ≤80)', color: '#9c27b0' };
    return { label: 'OUTRO INTERVALO', color: '#ff9800' };
  };
  const classificacao = getClassificacao(Number(acucarValor));

  const onSubmit = (data: LabWineFormData) => {
    console.log("Formulário Vinho Salvo:", data);
    Alert.alert("Sucesso", "Análise de Vinho registrada!");
  };

  const renderInput = (
    name: string,
    label: string,
    keyboardType: 'default' | 'numeric' = 'default',
    placeholder?: string,
    helperText?: string
  ) => {
    const errorObj = (errors as any)[name];
    const errorMessage = errorObj?.message;

    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {helperText && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
        <Controller
          control={control}
          name={name as any}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errorMessage && styles.inputError,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ''}
              keyboardType={keyboardType}
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              placeholderTextColor="#94a3b8"
            />
          )}
        />
        {errorMessage && (
          <Text style={styles.errorText}>
            {errorMessage as string}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Análise de Vinho</Text>
          <Text style={styles.sectionSubtitle}>Preencha os dados da análise físico-química</Text>
        </View>

        {/* Seção 1: Identificação da Amostra */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="wine-bar" size={20} color="#004d40" />
            <Text style={styles.sectionTitleSmall}>Identificação da Amostra</Text>
          </View>

          {renderInput('analista', 'Analista Responsável', 'default', 'Digite o nome do analista')}

          {/* Linha com Data e Marca/Tanque */}
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Data da Análise</Text>
              <Controller
                control={control}
                name="data"
                render={({ field: { value, onChange } }) => {
                  const dateValue = value instanceof Date ? value : new Date();
                  return (
                    <View>
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="calendar-today" size={20} color="#004d40" />
                        <Text style={styles.dateButtonText}>
                          {dateValue.toLocaleDateString('pt-BR')}
                        </Text>
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={dateValue}
                          mode="date"
                          display="default"
                          onChange={(_, date) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (date) onChange(date);
                          }}
                        />
                      )}
                    </View>
                  );
                }}
              />
            </View>
            
            <View style={styles.tanqueContainer}>
              {renderInput('marca_tanque', 'Marca / Tq', 'default', 'Ex: Reserva 45')}
            </View>
          </View>

          {renderInput('lote', 'Lote', 'default', 'Digite o número do lote')}
        </View>

        {/* Seção 2: Parâmetros Analíticos */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="science" size={20} color="#004d40" />
            <Text style={styles.sectionTitleSmall}>Parâmetros Analíticos</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('alcool', 'Álcool (%)', 'numeric', 'Digite % álcool', 'Ref: ≥8,6 ≤14')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('densidade', 'Densidade', 'numeric', 'Digite densidade', 'Ref: 0,992 - 0,998')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('acidez_total', 'Acidez Total', 'numeric', 'Digite g/L', 'Ref: 3 a 9,75 g/L')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('acidez_volatil', 'Ac. Volátil', 'numeric', 'Digite g/L', 'Máx: 1,2 g/L')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('so2_total', 'SO2 Total', 'numeric', 'Digite g/L', 'Máx: 0,35 g/L')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('so2_livre', 'SO2 Livre', 'numeric', 'Digite valor', 'Ref: 0,020 a 0,030')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('turbidez', 'Turbidez (NTU)', 'numeric', 'Digite NTU', 'Ref: < 10')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('indice_cor', 'Cor (IC)', 'numeric', 'Digite índice', '420 + 520 + 620')}
            </View>
          </View>

          {renderInput('ph', 'pH', 'numeric', 'Digite valor pH', '3,1-3,4 (B) / 3,3-3,6 (T)')}
        </View>

        {/* Seção 3: Açúcar Residual */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="opacity" size={20} color="#004d40" />
            <Text style={styles.sectionTitleSmall}>Açúcar Residual</Text>
          </View>

          <View style={styles.acucarRow}>
            <View style={styles.acucarInputContainer}>
              {renderInput('acucar', 'Açúcar (g/L)', 'numeric', 'Digite valor exato', 'Preencher valor exato')}
            </View>
            
            <View style={styles.classificacaoContainer}>
              <Text style={styles.classificacaoLabel}>Classificação</Text>
              {classificacao ? (
                <View style={[styles.classificacaoChip, { backgroundColor: classificacao.color }]}>
                  <MaterialIcons name="check-circle" size={16} color="#fff" />
                  <Text style={styles.classificacaoText}>{classificacao.label}</Text>
                </View>
              ) : (
                <View style={styles.classificacaoPlaceholder}>
                  <Text style={styles.classificacaoPlaceholderText}>Digite o valor</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#004d40' }]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Salvar Análise</Text>
          <MaterialIcons name="save-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: '#004d40',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 12,
    marginTop: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitleSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004d40',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  dateContainer: {
    flex: 0.5,
  },
  tanqueContainer: {
    flex: 0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  helperText: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  halfInput: {
    flex: 1,
  },
  acucarRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  acucarInputContainer: {
    flex: 0.6,
  },
  classificacaoContainer: {
    flex: 0.4,
    alignItems: 'center',
  },
  classificacaoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  classificacaoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classificacaoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  classificacaoPlaceholder: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  classificacaoPlaceholderText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});