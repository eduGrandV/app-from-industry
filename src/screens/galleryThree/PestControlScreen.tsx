import React, { useContext, useState } from "react";
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
  KeyboardAvoidingView,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  pestControlSchema,
  PestControlFormData,
  AREAS_PRAGAS,
  PESTS_LIST,
} from "../../types/galleryThree/pestControlSchema";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const PEST_ICONS: Record<string, any> = {
  Rato: "rodent",
  Aranha: "spider",
  Escorpião: "bug",
  Barata: "bug-outline",
  Grilo: "bug",
  Pássaro: "bird",
  Cobra: "snake",
  Outros: "alert",
};

export function PestControlScreen() {
  const navigation = useNavigation();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<PestControlFormData>({
      resolver: zodResolver(pestControlSchema) as any,
      defaultValues: {
        data: new Date(),
        responsavel: "",
        observacoes_gerais: "",
        registros: {},
      },
    });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState<{
    area: string;
    pest: string;
  } | null>(null);

  const { usuarioId, nomeOperador} = useContext(AuthContext);

  const formValues = watch();

  const trapNumbers = Array.from({ length: 101 }, (_, i) => String(i));

  const onSubmit = async (data: PestControlFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        usuarioId: usuarioId,
      };
      console.log("📦 SAINDO DO APP:", JSON.stringify(payload, null, 2));

      await api.post("/pest-control", payload);

      Alert.alert("Sucesso", "Análise salva com sucesso!");

      reset({
        data: new Date(),
        responsavel: "",
        observacoes_gerais: "",
        registros: {},
      });
    } catch (error: any) {
      console.error("Erro ao salvar :", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Não foi possível conectar ao servidor para salvar a análise.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const PestCounter = ({ area, pest }: { area: string; pest: string }) => {
    const fieldKey = `${area}_${pest}`;

    const currentData = (formValues.registros as any)?.[fieldKey] || {
      quantidade: 0,
      armadilha: "0",
    };
    const quantity = currentData.quantidade;
    const trap = currentData.armadilha;

    const updateValue = (newQty: number, newTrap: string) => {
      setValue(`registros.${fieldKey}`, {
        quantidade: newQty,
        armadilha: newTrap,
      });
    };

    const isActive = quantity > 0;

    const openPicker = () => {
      setCurrentPickerField({ area, pest });
      setPickerVisible(true);
    };

    const iconName = PEST_ICONS[pest] || "bug";

    return (
      <View
        style={[
          styles.counterContainer,
          isActive && styles.counterContainerActive,
        ]}
      >
        <View style={styles.pestInfo}>
          <View
            style={[
              styles.pestIconContainer,
              isActive && styles.pestIconContainerActive,
            ]}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={20}
              color={isActive ? "#B91C1C" : "#64748B"}
            />
          </View>
          <Text style={[styles.pestName, isActive && styles.pestNameActive]}>
            {pest}
          </Text>
        </View>

        <View style={styles.controlsWrapper}>
          
          <TouchableOpacity style={styles.trapSelector} onPress={openPicker}>
            <Text style={styles.trapSelectorLabel}>Armadilha</Text>
            <View style={styles.trapSelectorValue}>
              <Text
                style={[
                  styles.trapSelectorText,
                  isActive && styles.trapSelectorTextActive,
                ]}
              >
                {trap}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={20}
                color={isActive ? "#B91C1C" : "#64748B"}
              />
            </View>
          </TouchableOpacity>

          
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={() => updateValue(Math.max(0, quantity - 1), trap)}
              style={styles.stepBtn}
            >
              <MaterialIcons name="remove" size={16} color="#475569" />
            </TouchableOpacity>

            <Text
              style={[styles.stepValue, isActive && styles.stepValueActive]}
            >
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => updateValue(quantity + 1, trap)}
              style={[styles.stepBtn, styles.stepBtnAdd]}
            >
              <MaterialIcons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const TrapPickerModal = () => {
    if (!currentPickerField) return null;

    const fieldKey = `${currentPickerField.area}_${currentPickerField.pest}`;
    const currentData = (formValues.registros as any)?.[fieldKey] || {
      quantidade: 0,
      armadilha: "0",
    };
    const currentTrap = currentData.armadilha;

    const selectTrap = (trapNumber: string) => {
      setValue(`registros.${fieldKey}`, {
        quantidade: currentData.quantidade,
        armadilha: trapNumber,
      });
      setPickerVisible(false);
      setCurrentPickerField(null);
    };

    return (
      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setPickerVisible(false);
          setCurrentPickerField(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Armadilha</Text>
              <Text style={styles.modalSubtitle}>
                {currentPickerField.area} - {currentPickerField.pest}
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => {
                  setPickerVisible(false);
                  setCurrentPickerField(null);
                }}
              >
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={trapNumbers}
              keyExtractor={(item) => item}
              numColumns={5}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.trapOption,
                    currentTrap === item && styles.trapOptionActive,
                  ]}
                  onPress={() => selectTrap(item)}
                >
                  <Text
                    style={[
                      styles.trapOptionText,
                      currentTrap === item && styles.trapOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
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
        >
        

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="assignment" size={22} color="#B91C1C" />
              <Text style={styles.cardHeaderTitle}>
                Informações do Monitoramento
              </Text>
            </View>

            <View style={styles.rowMain}>
              <View style={styles.halfField}>
                <Text style={styles.labelModern}>Data do Registro</Text>
                <Controller
                  control={control}
                  name="data"
                  render={({ field: { value, onChange } }) => (
                    <TouchableOpacity
                      style={styles.dateButtonModern}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <MaterialIcons name="event" size={20} color="#B91C1C" />
                      <Text style={styles.dateButtonTextModern}>
                        {value
                          ? new Date(value).toLocaleDateString("pt-BR")
                          : "Selecionar data"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={formValues.data || new Date()}
                    mode="date"
                    display="default"
                    onChange={(
                      event: DateTimePickerEvent,
                      selectedDate?: Date,
                    ) => {
                      setShowDatePicker(Platform.OS === "ios");
                      if (selectedDate) {
                        setValue("data", selectedDate);
                      }
                    }}
                  />
                )}
              </View>

             
            </View>
          </View>

          
          {AREAS_PRAGAS.map((area, index) => (
            <View key={index} style={styles.areaCard}>
              <View style={styles.areaHeader}>
                <View style={styles.areaNumber}>
                  <Text style={styles.areaNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.areaTitle}>{area}</Text>
              </View>
              <View style={styles.gridPests}>
                {PESTS_LIST.map((pest) => (
                  <PestCounter key={pest} area={area} pest={pest} />
                ))}
              </View>
            </View>
          ))}

          
          <View style={styles.modernCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="notes" size={22} color="#B91C1C" />
              <Text style={styles.cardHeaderTitle}>Observações Gerais</Text>
            </View>
            <Controller
              control={control}
              name="observacoes_gerais"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.inputModern, styles.textArea]}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  placeholder="Alguma anomalia encontrada? Descreva aqui..."
                  placeholderTextColor="#94A3B8"
                  textAlignVertical="top"
                />
              )}
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
                <Text style={styles.saveButtonText}>
                  Finalizar Monitoramento
                </Text>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={24}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>

          
          <TrapPickerModal />
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


  modernCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    marginTop:20,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
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

  areaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  areaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  areaNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#B91C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  areaNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  areaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  gridPests: {
    padding: 12,
    gap: 8,
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  counterContainerActive: {
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
  pestInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  pestIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  pestIconContainerActive: {
    backgroundColor: "#FEE2E2",
  },
  pestName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  pestNameActive: {
    color: "#991B1B",
    fontWeight: "700",
  },
  controlsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trapSelector: {
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 8,
  },
  trapSelectorLabel: {
    fontSize: 10,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  trapSelectorValue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  trapSelectorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  trapSelectorTextActive: {
    color: "#B91C1C",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stepBtnAdd: {
    backgroundColor: "#B91C1C",
    borderColor: "#B91C1C",
  },
  stepValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748B",
    width: 30,
    textAlign: "center",
  },
  stepValueActive: {
    color: "#B91C1C",
  },

  saveButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#B91C1C",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  modalClose: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  modalList: {
    padding: 16,
  },
  trapOption: {
    flex: 1,
    minWidth: "18%",
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  trapOptionActive: {
    backgroundColor: "#B91C1C",
    borderColor: "#B91C1C",
  },
  trapOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
  trapOptionTextActive: {
    color: "#FFFFFF",
  },
});
