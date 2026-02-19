import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SensoryAnalysisFormData, sensoryAnalysisSchema } from "../../types/galleryFour/sensoryAnalysisSchema";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type ParamList = {
  SensoryAnalysis: { type: "Suco" | "Geleia_Doce" };
};

// Legenda
const HEDONIC_SCALE = [
  { value: 9, label: "Gostei extremamente" },
  { value: 8, label: "Gostei muito" },
  { value: 7, label: "Gostei moderadamente" },
  { value: 6, label: "Gostei ligeiramente" },
  { value: 5, label: "Nem gostei / nem desgostei" },
  { value: 4, label: "Desgostei ligeiramente" },
  { value: 3, label: "Desgostei moderadamente" },
  { value: 2, label: "Desgostei muito" },
  { value: 1, label: "Desgostei extremamente" },
];

export function SensoryAnalysisScreen() {
  const route = useRoute<RouteProp<ParamList, "SensoryAnalysis">>();
  const navigation = useNavigation();
  const { type } = route.params || { type: "Suco" };

  const isSuco = type === 'Suco';
  const labelProduto = isSuco ? 'do suco' : 'da geleia ou doce';

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SensoryAnalysisFormData>({
    resolver: zodResolver(sensoryAnalysisSchema) as any,
    defaultValues: {
      tipo_analise: type,
      data: new Date(),
      lote: '',
      comentarios: '',
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const formValues = watch();

  const onSubmit = (data: SensoryAnalysisFormData) => {
    // rota para salvar no banco
    console.log(`Análise Sensorial (${type}):`, data);
    Alert.alert("Sucesso", "Avaliação sensorial salva com sucesso!");
    navigation.goBack();
  }

  // Componente de 1 a 9
  const RatingScale = ({ name, question }: { name: any, question: string }) => {
    const currentValue = formValues[name as keyof SensoryAnalysisFormData];
    const hasError = errors[name as keyof SensoryAnalysisFormData];

    return (
      <View style={[styles.ratingContainer, hasError && styles.ratingContainerError]}>
        <Text style={styles.questionText}>
          O quanto você gostou ou desgostou de <Text style={styles.highlightText}>{question}</Text>?
        </Text>
        
        <View style={styles.scaleRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isSelected = currentValue === num;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.scaleCircle,
                  isSelected && styles.scaleCircleActive,
                ]}
                onPress={() => setValue(name, num)}
                activeOpacity={0.7}
              >
                <Text style={[styles.scaleNumber, isSelected && styles.scaleNumberActive]}>
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {hasError && <Text style={styles.errorText}>Por favor, selecione uma nota.</Text>}
      </View>
    );
  };

return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={[styles.headerIconContainer, { backgroundColor: isSuco ? '#FEF08A' : '#FBCFE8' }]}>
            <MaterialCommunityIcons 
              name={isSuco ? "cup-water" : "food-apple"} 
              size={32} 
              color={isSuco ? '#CA8A04' : '#DB2777'} 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Análise Sensorial</Text>
            <Text style={styles.headerSubtitle}>{isSuco ? 'Suco' : 'Geleia e Doce'}</Text>
          </View>
        </View>

        {/* Informações Iniciais */}
        <View style={styles.card}>
          <View style={styles.rowMain}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>DATA DA ANÁLISE</Text>
              <Controller
                control={control}
                name="data"
                render={({ field: { value } }) => (
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons name="calendar-today" size={18} color="#475569" />
                    <Text style={styles.dateText}>
                      {value ? new Date(value).toLocaleDateString('pt-BR') : 'Hoje'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                   
                    if (selectedDate) setValue('data', selectedDate);
                  }}
                />
              )}
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>LOTE {isSuco ? 'DO SUCO' : 'DA GELEIA/DOCE'}</Text>
              <Controller
                control={control}
                name="lote"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Ex: L-1234"
                    placeholderTextColor="#94A3B8"
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Legenda Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info-outline" size={20} color="#0284C7" />
            <Text style={styles.infoTitle}>Escala Hedônica (1 a 9)</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              {HEDONIC_SCALE.slice(0, 5).map(item => (
                <Text key={item.value} style={styles.infoText}>
                  <Text style={styles.infoNumber}>{item.value}</Text> - {item.label}
                </Text>
              ))}
            </View>
            <View style={styles.infoCol}>
              {HEDONIC_SCALE.slice(5, 9).map(item => (
                <Text key={item.value} style={styles.infoText}>
                  <Text style={styles.infoNumber}>{item.value}</Text> - {item.label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* --- QUESTIONÁRIO DINÂMICO --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="assignment" size={20} color="#0F172A" />
            <Text style={styles.sectionTitle}>Avaliação da Amostra</Text>
          </View>
          
          <View style={styles.sectionBody}>
            <RatingScale name="aparencia" question={`sua APARÊNCIA`} />
            <RatingScale name="sabor" question={`seu SABOR`} />
            
            {/* Específicos de Geleia */}
            {!isSuco && <RatingScale name="textura" question={`sua TEXTURA`} />}
            
            {/* Específicos de Suco */}
            {isSuco && <RatingScale name="aroma" question={`seu AROMA`} />}
            
            <RatingScale name="acidez" question={`sua ACIDEZ`} />
            <RatingScale name="docura" question={`sua DOÇURA`} />
            
            {/* Específico de Suco */}
            {isSuco && <RatingScale name="cor" question={`sua COR`} />}
            
            <RatingScale name="avaliacao_global" question={`sua AVALIAÇÃO GLOBAL`} />
          </View>
        </View>

        {/* Comentários Finais */}
        <View style={styles.card}>
          <Text style={styles.label}>COMENTÁRIOS ADICIONAIS</Text>
          <Controller
            control={control}
            name="comentarios"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                onChangeText={onChange}
                value={value}
                multiline
                placeholder="Detalhes sobre a avaliação..."
                placeholderTextColor="#94A3B8"
              />
            )}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Finalizar Análise</Text>
          <MaterialIcons name="check-circle" size={24} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );

}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 20, paddingBottom: 60 },
  
  header: { marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerIconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 16, color: "#64748B", fontWeight: "600", marginTop: 2 },

  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: "rgba(226, 232, 240, 0.8)" },
  
  section: { backgroundColor: "#FFFFFF", borderRadius: 24, overflow: "hidden", marginBottom: 24, shadowColor: "#64748B", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, elevation: 5, borderWidth: 1, borderColor: "#F1F5F9" },
  sectionHeader: { paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", backgroundColor: '#F8FAFC' },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: '#0F172A', textTransform: 'uppercase' },
  sectionBody: { padding: 20 },

  rowMain: { flexDirection: "row", gap: 12 },
  label: { fontSize: 11, color: "#64748B", marginBottom: 8, fontWeight: "700", textTransform: "uppercase" },
  input: { borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, fontSize: 15, backgroundColor: "#F8FAFC", color: "#0F172A", fontWeight: "500" },
  dateButton: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 12, padding: 12, backgroundColor: "#F8FAFC", gap: 10 },
  dateText: { fontSize: 15, color: "#334155", fontWeight: "500" },

  // Info Box (Escala Hedônica)
  infoBox: { backgroundColor: '#F0F9FF', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#BAE6FD' },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: '#0369A1' },
  infoGrid: { flexDirection: 'row', gap: 12 },
  infoCol: { flex: 1, gap: 4 },
  infoText: { fontSize: 11, color: '#0C4A6E', fontWeight: '500' },
  infoNumber: { fontWeight: '800' },

  // Rating Scale Component
  ratingContainer: { marginBottom: 24, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  ratingContainerError: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  questionText: { fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 16, lineHeight: 20 },
  highlightText: { fontWeight: '800', color: '#0F172A' },
  
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scaleCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  scaleCircleActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9', transform: [{ scale: 1.1 }] },
  scaleNumber: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  scaleNumberActive: { color: '#FFFFFF', fontWeight: '800' },

  errorText: { color: '#EF4444', fontSize: 12, marginTop: 8, fontWeight: '600' },

  submitButton: { backgroundColor: "#0F172A", borderRadius: 16, paddingVertical: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 10, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, elevation: 8 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});
