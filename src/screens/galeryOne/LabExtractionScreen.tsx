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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import { labExtractionSchema, LabExtractionFormData } from '../../types/galeryOne/labExtractionSchema';

export function LabExtractionScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(labExtractionSchema),
    defaultValues: {
      data: new Date(),
      variedade: '',
      fornecedor: '',
      naoh: '',
      brix: '',
      acidez: '',
      ph: '',
      ratio: '',
      densidade: '',
      temp: '',
      aroma: '',
      cor: '',
      qtde_bag: '',
      sequencia: '',
      volume: '',
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = (data: LabExtractionFormData) => {
    console.log("Dados Extração:", data);
    Alert.alert("Sucesso", "Dados de extração salvos!");
  };

  const renderInput = (
    name: string,
    label: string,
    keyboardType: 'default' | 'numeric' = 'default',
    placeholder?: string
  ) => {
    const errorObj = (errors as any)[name];
    const errorMessage = errorObj?.message;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
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
          <Text style={styles.sectionTitle}>Dados da Extração</Text>
          <Text style={styles.sectionSubtitle}>Preencha as informações da análise de extração</Text>
        </View>

        {/* Seção 1: Identificação */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="fingerprint" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Identificação</Text>
          </View>

          {/* Campo de Data */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data da Análise</Text>
            <Controller
              control={control}
              name="data"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="calendar-today" size={20} color="#6200ee" />
                    <Text style={styles.dateButtonText}>
                      {value ? new Date(value as any).toLocaleDateString('pt-BR') : 'Selecionar Data'}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={value ? new Date(value as any) : new Date()}
                      mode="date"
                      display="default"
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

          {renderInput('variedade', 'Variedade', 'default', 'Digite a variedade')}
          {renderInput('fornecedor', 'Fornecedor', 'default', 'Digite o fornecedor')}
        </View>

        {/* Seção 2: Química */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="science" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Análise Química</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('naoh', 'NaOH', 'numeric', 'Digite NaOH')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('brix', '°Brix', 'numeric', 'Digite °Brix')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('acidez', 'Acidez (%)', 'numeric', 'Digite acidez')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('ph', 'pH', 'numeric', 'Digite pH')}
            </View>
          </View>

          {renderInput('ratio', 'Ratio', 'numeric', 'Digite o ratio')}
        </View>

        {/* Seção 3: Físico & Sensorial */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="thermostat" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Físico & Sensorial</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('densidade', 'Densidade', 'numeric', 'Digite densidade')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('temp', 'Temp (°C)', 'numeric', 'Digite temperatura')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('aroma', 'Aroma', 'default', 'Descreva o aroma')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('cor', 'Cor', 'default', 'Descreva a cor')}
            </View>
          </View>
        </View>

        {/* Seção 4: Produção */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="factory" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Produção</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('qtde_bag', 'Qtde. Bag', 'numeric', 'Digite quantidade')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('sequencia', 'Sequência', 'numeric', 'Digite sequência')}
            </View>
          </View>

          {renderInput('volume', 'Volume (L)', 'numeric', 'Digite volume em litros')}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Salvar Extração</Text>
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
    backgroundColor: '#6200ee',
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
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
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
    color: '#1e293b',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfInput: {
    flex: 1
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
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