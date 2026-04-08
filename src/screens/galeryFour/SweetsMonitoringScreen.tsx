import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { DraftService } from "../../services/DraftService";
import {
  SweetsMonitoringFormData,
  sweetsMonitoringSchema,
} from "../../types/galleryFour/sweetsMonitoringSchema";

const DRAFT_KEY = "@draft_sweets_monitoring";

const InputGroup = ({
  label,
  name,
  control,
  placeholder,
  keyboard = "default",
  flex = 1,
}: any) => (
  <View style={{ flex }}>
    <Text style={styles.labelModern}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={styles.inputModern}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value ? String(value) : ""}
          keyboardType={keyboard}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
        />
      )}
    />
  </View>
);

const IngredientCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCardModern}>
    <Text style={styles.innerCardTitleModern}>{title}</Text>
    <View style={styles.row}>
      <InputGroup
        control={control}
        label="Variedade/Marca"
        name={`${prefix}.variedade_marca`}
        flex={2}
      />
    </View>
    <View style={[styles.row, { marginTop: 12 }]}>
      <InputGroup
        control={control}
        label="Fornecedor"
        name={`${prefix}.fornecedor`}
        flex={2}
      />
      <InputGroup
        control={control}
        label="Peso (Kg)"
        name={`${prefix}.peso_kg`}
        keyboard="numeric"
      />
    </View>
  </View>
);

const AnaliseCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCardModern}>
    <Text style={styles.innerCardTitleModern}>{title}</Text>
    <View style={styles.row}>
      <InputGroup
        control={control}
        label="°Brix (SST)"
        name={`${prefix}.brix`}
        keyboard="numeric"
      />
      <InputGroup
        control={control}
        label="Acidez ATT(%)"
        name={`${prefix}.acidez`}
        keyboard="numeric"
      />
    </View>
    <View style={[styles.row, { marginTop: 12 }]}>
      <InputGroup
        control={control}
        label="SST/ATT"
        name={`${prefix}.relacao`}
        keyboard="numeric"
      />
      <InputGroup
        control={control}
        label="pH"
        name={`${prefix}.ph`}
        keyboard="numeric"
      />
    </View>
  </View>
);

const EmbalagemCard = ({ title, prefix, control }: any) => (
  <View style={styles.innerCardModern}>
    <Text style={styles.innerCardTitleModern}>{title}</Text>
    <View style={styles.row}>
      <InputGroup
        control={control}
        label="Fornecedor"
        name={`${prefix}.fornecedor`}
        flex={2}
      />
    </View>
    <View style={[styles.row, { marginTop: 12 }]}>
      <InputGroup
        control={control}
        label="Não Conforme"
        name={`${prefix}.nao_conforme`}
        keyboard="numeric"
      />
      <InputGroup
        control={control}
        label="Quebra Estoq."
        name={`${prefix}.quebra_estoque`}
        keyboard="numeric"
      />
    </View>
  </View>
);

export function SweetsMonitoringScreen() {
  const navigation = useNavigation<any>();
  const { usuarioId } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const emptyRecepcao = {
    turno: "",
    produtor: "",
    fruta: "",
    variedade: "",
    peso_total_kg: 0,
    hora_ini: "",
    hora_fim: "",
    vol_polpa_kg: 0,
    vol_doce_kg: 0,
    total_potes: 0,
    total_caixas: 0,
  };
  const emptyIngredientes = {
    ingrediente_fruta: { variedade_marca: "", fornecedor: "", peso_kg: 0 },
    ingrediente_agua: { variedade_marca: "", fornecedor: "", peso_kg: 0 },
    ingrediente_acucar: { variedade_marca: "", fornecedor: "", peso_kg: 0 },
    ingrediente_pectina: { variedade_marca: "", fornecedor: "", peso_kg: 0 },
    ingrediente_suco: { variedade_marca: "", fornecedor: "", peso_kg: 0 },
  };
  const emptyAnalises = {
    analise_fruta: { brix: 0, acidez: 0, relacao: 0, ph: 0 },
    analise_doce: { brix: 0, acidez: 0, relacao: 0, ph: 0 },
  };
  const emptyPerdasProd = {
    perda_ponto_preto: 0,
    perda_corpo_estranho: 0,
    perda_pote_quebrado: 0,
    perda_pote_contaminado: 0,
    perda_tampa_amassada: 0,
    perda_falta_lote: "",
    perda_extras: "",
  };
  const emptyPerdasEmb = {
    emb_potes: { fornecedor: "", nao_conforme: 0, quebra_estoque: 0 },
    emb_tampas: { fornecedor: "", nao_conforme: 0, quebra_estoque: 0 },
    emb_rotulos: { fornecedor: "", nao_conforme: 0, quebra_estoque: 0 },
  };

  const { control, handleSubmit, reset, watch } =
    useForm<SweetsMonitoringFormData>({
      resolver: zodResolver(sweetsMonitoringSchema) as any,
      defaultValues: {
        data: new Date(),
        lote_produto: "",
        recepcoes: [emptyRecepcao],
        ingredientes: [emptyIngredientes],
        analises: [emptyAnalises],
        perdas_producao: [emptyPerdasProd],
        perdas_embalagem: [emptyPerdasEmb],
      },
    });

  const {
    fields: recFields,
    append: addRec,
    remove: remRec,
  } = useFieldArray({ control, name: "recepcoes" });
  const {
    fields: ingFields,
    append: addIng,
    remove: remIng,
  } = useFieldArray({ control, name: "ingredientes" });
  const {
    fields: anaFields,
    append: addAna,
    remove: remAna,
  } = useFieldArray({ control, name: "analises" });
  const {
    fields: prodFields,
    append: addProd,
    remove: remProd,
  } = useFieldArray({ control, name: "perdas_producao" });
  const {
    fields: embFields,
    append: addEmb,
    remove: remEmb,
  } = useFieldArray({ control, name: "perdas_embalagem" });

  useEffect(() => {
    const carregarRascunho = async () => {
      const rascunhoSalvo = await DraftService.getDraft(DRAFT_KEY);
      if (rascunhoSalvo) {
        if (rascunhoSalvo.data)
          rascunhoSalvo.data = new Date(rascunhoSalvo.data);
        reset(rascunhoSalvo);
      }
    };
    carregarRascunho();
  }, [reset]);

  const {
    fields: brixFields,
    append: addBrix,
    remove: removeBrix,
  } = useFieldArray({
    control,
    name: "brix_horarios",
  });

  const formAtual = watch();
  useEffect(() => {
    DraftService.saveDraft(DRAFT_KEY, formAtual);
  }, [formAtual]);

  const onSubmit = async (data: SweetsMonitoringFormData) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: usuarioId };
      await api.post("/sweets", payload);
      Alert.alert("Sucesso", "Análise salva com sucesso!");
      reset({
        data: new Date(),
        lote_produto: "",
        recepcoes: [emptyRecepcao],
        ingredientes: [emptyIngredientes],
        analises: [emptyAnalises],
        perdas_producao: [emptyPerdasProd],
        perdas_embalagem: [emptyPerdasEmb],
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao salvar análise.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerContainer}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="food-apple"
                size={40}
                color="#fff"
              />
            </View>
            <Text style={styles.headerTitle}>Elaboração de Doces</Text>
            <Text style={styles.headerSubtitle}>Monitoramento de Produção</Text>
          </View>

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="info" size={22} color="#EA580C" />
              <Text style={styles.cardHeaderTitle}>Informações Gerais</Text>
            </View>

            <View style={styles.rowMain}>
              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Data de Produção</Text>
                <TouchableOpacity
                  style={styles.dateButtonModern}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons name="event" size={20} color="#EA580C" />
                  <Controller
                    control={control}
                    name="data"
                    render={({ field: { value } }) => (
                      <Text style={styles.dateButtonTextModern}>
                        {value
                          ? new Date(value).toLocaleDateString("pt-BR")
                          : "Selecionar data"}
                      </Text>
                    )}
                  />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate?: Date) => {
                      setShowDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        const { onChange } = control._formValues;
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.halfField}>
                <InputGroup
                  control={control}
                  label="Lote do Produto"
                  name="lote_produto"
                  placeholder="Ex: DOCE-102"
                />
              </View>
            </View>
          </View>

          
          <View style={styles.sectionBlockModern}>
            <Text style={styles.sectionBlockTitle}>1. Receção e Produção</Text>
            {recFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCardModern}>
                <View style={styles.dynamicHeaderModern}>
                  <Text style={styles.dynamicTitle}>
                    Lote / Receção {index + 1}
                  </Text>
                  {recFields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => remRec(index)}
                      style={styles.removeBtnModern}
                    >
                      <MaterialIcons name="close" size={20} color="#EA580C" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup
                    control={control}
                    label="Turno"
                    name={`recepcoes.${index}.turno`}
                    placeholder="Ex: Manhã"
                  />
                  <InputGroup
                    control={control}
                    label="Produtor"
                    name={`recepcoes.${index}.produtor`}
                  />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup
                    control={control}
                    label="Fruta"
                    name={`recepcoes.${index}.fruta`}
                  />
                  <InputGroup
                    control={control}
                    label="Variedade"
                    name={`recepcoes.${index}.variedade`}
                  />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup
                    control={control}
                    label="Hora Início"
                    name={`recepcoes.${index}.hora_ini`}
                    placeholder="00:00"
                  />
                  <InputGroup
                    control={control}
                    label="Hora Fim"
                    name={`recepcoes.${index}.hora_fim`}
                    placeholder="00:00"
                  />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                  <InputGroup
                    control={control}
                    label="Peso Total (Kg)"
                    name={`recepcoes.${index}.peso_total_kg`}
                    keyboard="numeric"
                  />
                  <InputGroup
                    control={control}
                    label="Total Potes"
                    name={`recepcoes.${index}.total_potes`}
                    keyboard="numeric"
                  />
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addRec(emptyRecepcao)}
            >
              <MaterialIcons name="add" size={20} color="#EA580C" />
              <Text style={styles.addButtonText}>Adicionar Receção</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.sectionBlockModern}>
            <Text style={styles.sectionBlockTitle}>
              2. Ingredientes Utilizados
            </Text>
            {ingFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCardModern}>
                <View style={styles.dynamicHeaderModern}>
                  <Text style={styles.dynamicTitle}>
                    Bloco Ingredientes {index + 1}
                  </Text>
                  {ingFields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => remIng(index)}
                      style={styles.removeBtnModern}
                    >
                      <MaterialIcons name="close" size={20} color="#EA580C" />
                    </TouchableOpacity>
                  )}
                </View>
                <IngredientCard
                  control={control}
                  title="Fruta/Blender"
                  prefix={`ingredientes.${index}.ingrediente_fruta`}
                />
                <IngredientCard
                  control={control}
                  title="Água"
                  prefix={`ingredientes.${index}.ingrediente_agua`}
                />
                <IngredientCard
                  control={control}
                  title="Açúcar"
                  prefix={`ingredientes.${index}.ingrediente_acucar`}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addIng(emptyIngredientes)}
            >
              <MaterialIcons name="add" size={20} color="#EA580C" />
              <Text style={styles.addButtonText}>Adicionar Ingredientes</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.sectionBlockModern}>
            <Text style={styles.sectionBlockTitle}>
              3. Análises Físico-Químicas
            </Text>
            {anaFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCardModern}>
                <View style={styles.dynamicHeaderModern}>
                  <Text style={styles.dynamicTitle}>Análise {index + 1}</Text>
                  {anaFields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => remAna(index)}
                      style={styles.removeBtnModern}
                    >
                      <MaterialIcons name="close" size={20} color="#EA580C" />
                    </TouchableOpacity>
                  )}
                </View>
                <AnaliseCard
                  control={control}
                  title="Análise da Fruta"
                  prefix={`analises.${index}.analise_fruta`}
                />
                <AnaliseCard
                  control={control}
                  title="Análise do Doce/Geleia"
                  prefix={`analises.${index}.analise_doce`}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addAna(emptyAnalises)}
            >
              <MaterialIcons name="add" size={20} color="#EA580C" />
              <Text style={styles.addButtonText}>Nova Análise</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.sectionBlockModern}>
            <Text style={styles.sectionBlockTitle}>4. Perdas de Produção</Text>
            {prodFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCardModern}>
                <View style={styles.dynamicHeaderModern}>
                  <Text style={styles.dynamicTitle}>
                    Registo de Perdas {index + 1}
                  </Text>
                  {prodFields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => remProd(index)}
                      style={styles.removeBtnModern}
                    >
                      <MaterialIcons name="close" size={20} color="#EA580C" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.row}>
                  <InputGroup
                    control={control}
                    label="Pote Quebrado"
                    name={`perdas_producao.${index}.perda_pote_quebrado`}
                    keyboard="numeric"
                  />
                  <InputGroup
                    control={control}
                    label="Contaminado"
                    name={`perdas_producao.${index}.perda_pote_contaminado`}
                    keyboard="numeric"
                  />
                  <InputGroup
                    control={control}
                    label="Corpo Est."
                    name={`perdas_producao.${index}.perda_corpo_estranho`}
                    keyboard="numeric"
                  />
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addProd(emptyPerdasProd)}
            >
              <MaterialIcons name="add" size={20} color="#EA580C" />
              <Text style={styles.addButtonText}>Registo de Perdas</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.sectionBlockModern}>
            <Text style={styles.sectionBlockTitle}>5. Perdas de Embalagem</Text>
            {embFields.map((field, index) => (
              <View key={field.id} style={styles.dynamicCardModern}>
                <View style={styles.dynamicHeaderModern}>
                  <Text style={styles.dynamicTitle}>
                    Perdas Embalagem {index + 1}
                  </Text>
                  {embFields.length > 1 && (
                    <TouchableOpacity
                      onPress={() => remEmb(index)}
                      style={styles.removeBtnModern}
                    >
                      <MaterialIcons name="close" size={20} color="#EA580C" />
                    </TouchableOpacity>
                  )}
                </View>
                <EmbalagemCard
                  control={control}
                  title="Potes"
                  prefix={`perdas_embalagem.${index}.emb_potes`}
                />
                <EmbalagemCard
                  control={control}
                  title="Tampas"
                  prefix={`perdas_embalagem.${index}.emb_tampas`}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addEmb(emptyPerdasEmb)}
            >
              <MaterialIcons name="add" size={20} color="#EA580C" />
              <Text style={styles.addButtonText}>Perdas Embalagem</Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="schedule" size={22} color="#EA580C" />
              <Text style={styles.cardHeaderTitle}>Tempos de Processo</Text>
            </View>

            <Text style={styles.subHeaderModern}>Envase</Text>
            <View style={styles.row}>
              <InputGroup
                control={control}
                label="Início"
                name="hora_ini_envase"
                placeholder="00:00"
                keyboard="numbers-and-punctuation"
              />
              <InputGroup
                control={control}
                label="Fim"
                name="hora_fim_envase"
                placeholder="00:00"
                keyboard="numbers-and-punctuation"
              />
            </View>

            <Text style={[styles.subHeaderModern, { marginTop: 16 }]}>
              Pasteurização
            </Text>
            <View style={styles.row}>
              <InputGroup
                control={control}
                label="Início"
                name="hora_ini_pasteurizacao"
                placeholder="00:00"
                keyboard="numbers-and-punctuation"
              />
              <InputGroup
                control={control}
                label="Fim"
                name="hora_fim_pasteurizacao"
                placeholder="00:00"
                keyboard="numbers-and-punctuation"
              />
            </View>
          </View>

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="thermostat" size={22} color="#EA580C" />
              <Text style={styles.cardHeaderTitle}>
                Monitoramento de Produção (°Brix)
              </Text>
            </View>

            {brixFields.map((field, index) => (
              <View
                key={field.id}
                style={[
                  styles.row,
                  { alignItems: "flex-end", marginBottom: 12 },
                ]}
              >
                <InputGroup
                  control={control}
                  label={`Horário ${index + 1}`}
                  name={`brix_horarios.${index}.horario`}
                  placeholder="00:00"
                />
                <View style={{ width: 12 }} />
                <InputGroup
                  control={control}
                  label="°Brix"
                  name={`brix_horarios.${index}.brix`}
                  placeholder="Valor"
                  keyboard="numeric"
                />

                <TouchableOpacity
                  onPress={() => removeBrix(index)}
                  style={styles.deleteButton}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButtonModern}
              onPress={() => addBrix({ horario: "", brix: undefined })}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={20}
                color="#EA580C"
              />
              <Text style={styles.addButtonText}>
                Adicionar Leitura de °Brix
              </Text>
            </TouchableOpacity>
          </View>

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="check" size={22} color="#EA580C" />
              <Text style={styles.cardHeaderTitle}>Validação Geral</Text>
            </View>

            <InputGroup
              control={control}
              label="Observações do Dia"
              name="observacoes"
              placeholder="Algum comentário global sobre o dia?"
            />
            <View style={{ height: 16 }} />
            <InputGroup
              control={control}
              label="Assinatura do Responsável"
              name="assinatura_responsavel"
              placeholder="Nome / Visto"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Guardar Monitoramento</Text>
                <MaterialCommunityIcons
                  name="content-save-all"
                  size={24}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },

  headerContainer: {
    backgroundColor: "#EA580C",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginTop: 4,
  },

  modernCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 10,
  },

  sectionBlockModern: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  sectionBlockTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EA580C",
    marginBottom: 16,
  },

  rowMain: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  labelModern: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputModern: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  dateButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    gap: 10,
  },
  dateButtonTextModern: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
  },

  dynamicCardModern: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FED7AA",
    marginBottom: 16,
  },
  dynamicHeaderModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FED7AA",
  },
  dynamicTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EA580C",
  },
  removeBtnModern: {
    padding: 6,
    backgroundColor: "#FFEDD5",
    borderRadius: 8,
  },

  innerCardModern: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  innerCardTitleModern: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EA580C",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  subHeaderModern: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 12,
    marginTop: 8,
  },

  addButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDBA74",
    borderStyle: "dashed",
  },
  addButtonText: {
    color: "#EA580C",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButton: {
    padding: 12,
    marginBottom: 4,
  },
  saveButton: {
    backgroundColor: "#EA580C",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
