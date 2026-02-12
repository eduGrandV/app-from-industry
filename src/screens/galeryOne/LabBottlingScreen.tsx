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

import { LabBottlingFormData, labBottlingSchema } from '../../types/galeryOne/labBottlingSchema';

export function LabBottlingScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(labBottlingSchema),
    defaultValues: {
      data: new Date(),
      lote: '',
      modelo_garrafa: '',
      naoh: '',
      brix: '',
      acidez: '',
      ratio: '',
      ph: '',
      densidade: '',
      cor_520nm: '',
      sensorial: '',
      observacao: '',
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = (data: LabBottlingFormData) => {
    console.log("Dados Envase:", data);
    Alert.alert("Sucesso", "Envase registrado!");
  };

  const renderInput = (
    name: string,
    label: string,
    keyboardType: 'default' | 'numeric' = 'default',
    placeholder?: string,
    multiline: boolean = false
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
                multiline ? styles.textArea : styles.input,
                errorMessage && styles.inputError,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ''}
              keyboardType={keyboardType}
              placeholder={placeholder || `Digite ${label.toLowerCase()}`}
              placeholderTextColor="#94a3b8"
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              textAlignVertical={multiline ? 'top' : 'center'}
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
          <Text style={styles.sectionTitle}>Dados do Envase</Text>
          <Text style={styles.sectionSubtitle}>Preencha as informações da análise de envase</Text>
        </View>

        {/* Seção 1: Rastreabilidade */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="qr-code-scanner" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Rastreabilidade</Text>
          </View>

          {/* Linha com Data e Lote */}
          <View style={styles.row}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Data</Text>
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
                        <MaterialIcons name="calendar-today" size={20} color="#6200ee" />
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
            
            <View style={styles.loteContainer}>
              {renderInput('lote', 'Lote', 'default', 'Número do lote')}
            </View>
          </View>

          {renderInput('modelo_garrafa', 'Modelo da Garrafa', 'default', 'Digite o modelo da garrafa')}
        </View>

        {/* Seção 2: Físico-Química */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="science" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Análise Físico-Química</Text>
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
              {renderInput('ratio', 'Ratio', 'numeric', 'Digite ratio')}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput('ph', 'pH', 'numeric', 'Digite pH')}
            </View>
            <View style={styles.halfInput}>
              {renderInput('densidade', 'Densidade (g.cm³)', 'numeric', 'Digite densidade')}
            </View>
          </View>

          {renderInput('cor_520nm', 'Cor (520 nm)', 'numeric', 'Digite valor em nm')}
        </View>

        {/* Seção 3: Qualitativo */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="rate-review" size={20} color="#6200ee" />
            <Text style={styles.sectionTitleSmall}>Análise Qualitativa</Text>
          </View>

          {renderInput('sensorial', 'Análise Sensorial', 'default', 'Descreva a análise sensorial...', true)}
          {renderInput('observacao', 'Observações Gerais', 'default', 'Adicione observações relevantes...', true)}
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Finalizar Envase</Text>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  dateContainer: {
    flex: 0.50,
  },
  loteContainer: {
    flex: 0.50,
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
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
    height: 100,
    textAlignVertical: 'top',
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