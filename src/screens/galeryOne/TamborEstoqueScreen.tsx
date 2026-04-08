import React, { useState, useEffect, useContext, useMemo } from "react";
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
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

const FilterSelect = ({ label, icon, value, options, onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.labelModern}>{icon} {label}</Text>
      <TouchableOpacity
        style={styles.selectButtonModern}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectTextModern, !value && { color: "#94A3B8" }]}>
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#38BDF8" />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlayModern} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContentModern}>
            <View style={styles.modalHeaderModern}>
              <Text style={styles.modalTitleModern}>Selecione {label}</Text>
            </View>
            <ScrollView>
              <TouchableOpacity style={styles.modalOptionModern} onPress={() => { onSelect(""); setIsOpen(false); }}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.modalOptionTextModern}>Limpar Seleção</Text>
              </TouchableOpacity>

              {options.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.modalOptionModern, value === opt && styles.modalOptionActiveModern]}
                  onPress={() => { onSelect(opt); setIsOpen(false); }}
                >
                  <Text style={[styles.modalOptionTextModern, value === opt && styles.modalOptionTextActiveModern]}>
                    {opt}
                  </Text>
                  {value === opt && <MaterialCommunityIcons name="check" size={18} color="#10B981" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export function TamborEstoqueScreen() {
  const { usuarioId } = useContext(AuthContext);

  const [abaAtual, setAbaAtual] = useState<"DISPONIVEIS" | "BAIXADOS">("DISPONIVEIS");
  const [tambores, setTambores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [tamborSelecionado, setTamborSelecionado] = useState<any | null>(null);
  const [motivoBaixa, setMotivoBaixa] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [observacaoBaixa, setObservacaoBaixa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
  const [filtroVariedade, setFiltroVariedade] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [cor420Min, setCor420Min] = useState("");
  const [cor420Max, setCor420Max] = useState("");
  const [cor520Min, setCor520Min] = useState("");
  const [cor520Max, setCor520Max] = useState("");
  const [cor620Min, setCor620Min] = useState("");
  const [cor620Max, setCor620Max] = useState("");

  const opcoesMotivo = ["Venda", "Contaminado", "Fermentado", "Outros"];

  const loadTambores = async () => {
    setLoading(true);
    try {
      const endpoint = abaAtual === "DISPONIVEIS" ? "/tambores/disponiveis" : "/tambores/baixados";
      const response = await api.get(endpoint);
      setTambores(response.data);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os tambores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTambores();
    setSearch("");
  }, [abaAtual]);

  const variedadesUnicas = useMemo(() => {
    const vars = tambores.map(t => t.variedadeUva).filter(Boolean);
    return Array.from(new Set(vars)).sort();
  }, [tambores]);

  const fornecedoresUnicos = useMemo(() => {
    const forns = tambores.map(t => t.fornecedor).filter(Boolean);
    return Array.from(new Set(forns)).sort();
  }, [tambores]);

  const parseNumber = (val: string) => {
    if (!val || val.trim() === "") return null;
    return Number(val.replace(",", "."));
  };

  const tamboresFiltrados = tambores.filter((t) => {
    const termoPesquisa = search.toLowerCase();
    const matchBusca = t.numeroTambor.toLowerCase().includes(termoPesquisa);
    const matchVariedade = filtroVariedade === "" || t.variedadeUva === filtroVariedade;
    const matchFornecedor = filtroFornecedor === "" || t.fornecedor === filtroFornecedor;
    const matchData = filtroData ? new Date(t.dataEnvaseBag).toLocaleDateString("pt-BR") === filtroData : true;

    const v420 = t.cor420nm !== null && t.cor420nm !== undefined ? Number(t.cor420nm) : null;
    const v520 = t.cor520nm !== null && t.cor520nm !== undefined ? Number(t.cor520nm) : null;
    const v620 = t.cor620nm !== null && t.cor620nm !== undefined ? Number(t.cor620nm) : null;

    const min420 = parseNumber(cor420Min);
    const max420 = parseNumber(cor420Max);
    const match420 = (min420 === null || (v420 !== null && v420 >= min420)) && (max420 === null || (v420 !== null && v420 <= max420));

    const min520 = parseNumber(cor520Min);
    const max520 = parseNumber(cor520Max);
    const match520 = (min520 === null || (v520 !== null && v520 >= min520)) && (max520 === null || (v520 !== null && v520 <= max520));

    const min620 = parseNumber(cor620Min);
    const max620 = parseNumber(cor620Max);
    const match620 = (min620 === null || (v620 !== null && v620 >= min620)) && (max620 === null || (v620 !== null && v620 <= max620));

    return matchBusca && matchVariedade && matchFornecedor && matchData && match420 && match520 && match620;
  });

  const limparFiltros = () => {
    setFiltroVariedade("");
    setFiltroFornecedor("");
    setFiltroData("");
    setCor420Min("");
    setCor420Max("");
    setCor520Min("");
    setCor520Max("");
    setCor620Min("");
    setCor620Max("");
    setModalFiltroVisible(false);
  };

  const abrirModalBaixa = (tambor: any) => {
    setTamborSelecionado(tambor);
    setMotivoBaixa("");
    setNomeEmpresa("");
    setObservacaoBaixa("");
    setModalVisible(true);
  };

  const handleConfirmarBaixa = async () => {
    if (!motivoBaixa) {
      Alert.alert("Atenção", "Selecione um motivo para a baixa.");
      return;
    }
    if (motivoBaixa === "Venda" && !nomeEmpresa.trim()) {
      Alert.alert("Atenção", "Por favor, informe o nome da empresa compradora.");
      return;
    }

    setIsSubmitting(true);
    try {
      let observacaoFinal = observacaoBaixa;
      if (motivoBaixa === "Venda") {
        observacaoFinal = `Empresa: ${nomeEmpresa.trim()}${observacaoBaixa ? ` | Obs: ${observacaoBaixa}` : ""}`;
      }

      await api.patch(`/tambores/${tamborSelecionado?.id}/baixa`, {
        usuarioId: usuarioId,
        motivoBaixa: motivoBaixa,
        observacaoBaixa: observacaoFinal,
      });

      Alert.alert("Sucesso", "Baixa realizada com sucesso!");
      setModalVisible(false);
      loadTambores();
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao dar baixa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTamborDisponivel = ({ item }: { item: any }) => (
    <View style={styles.cardModern}>
      <View style={styles.cardHeaderModern}>
        <View style={styles.badgeModern}>
          <MaterialCommunityIcons name="barrel" size={18} color="#06B6D4" />
          <Text style={styles.badgeTextModern}>#{item.numeroTambor}</Text>
          
          <Text style={styles.badgeSubTextModern}>({new Date(item.dataEnvaseBag).toLocaleDateString("pt-BR").slice(0, 5)})</Text>
        </View>
        <View style={styles.dateBadgeModern}>
          <MaterialCommunityIcons name="calendar" size={14} color="#64748B" />
          <Text style={styles.dateTextModern}>
            {new Date(item.dataEnvaseBag).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      <View style={styles.infoGridModern}>
        <View style={styles.infoItemModern}>
          <MaterialCommunityIcons name="fruit-grapes" size={18} color="#8B5CF6" />
          <Text style={styles.infoLabelModern}>Variedade</Text>
          <Text style={styles.infoValueModern}>{item.variedadeUva}</Text>
        </View>
        <View style={styles.infoItemModern}>
          <MaterialCommunityIcons name="flask" size={18} color="#EC4899" />
          <Text style={styles.infoLabelModern}>Acidez</Text>
          <Text style={styles.infoValueModern}>{item.acidez || "--"}</Text>
        </View>
        <View style={styles.infoItemModern}>
          <MaterialCommunityIcons name="chart-line" size={18} color="#F59E0B" />
          <Text style={styles.infoLabelModern}>Ratio</Text>
          <Text style={styles.infoValueModern}>{item.relacao || "--"}</Text>
        </View>
      </View>

      <View style={styles.colorSpectrumModern}>
        <View style={styles.colorBarModern}>
          <View style={[styles.colorDotModern, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.colorLabelModern}>420nm</Text>
          <Text style={styles.colorValueModern}>{item.cor420nm || "--"}</Text>
        </View>
        <View style={styles.colorBarModern}>
          <View style={[styles.colorDotModern, { backgroundColor: '#10B981' }]} />
          <Text style={styles.colorLabelModern}>520nm</Text>
          <Text style={styles.colorValueModern}>{item.cor520nm || "--"}</Text>
        </View>
        <View style={styles.colorBarModern}>
          <View style={[styles.colorDotModern, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.colorLabelModern}>620nm</Text>
          <Text style={styles.colorValueModern}>{item.cor620nm || "--"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnBaixaModern} onPress={() => abrirModalBaixa(item)}>
        <MaterialCommunityIcons name="arrow-down-bold-box" size={20} color="#fff" />
        <Text style={styles.btnBaixaTextModern}>Dar Baixa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTamborBaixado = ({ item }: { item: any }) => (
    <View style={[styles.cardModern, styles.cardBaixadoModern]}>
      <View style={styles.cardHeaderModern}>
        <View style={[styles.badgeModern, styles.badgeBaixadoModern]}>
          <MaterialCommunityIcons name="barrel" size={18} color="#EF4444" />
          <Text style={[styles.badgeTextModern, { color: "#EF4444" }]}>#{item.numeroTambor}</Text>
          
          <Text style={[styles.badgeSubTextModern, { color: "#FCA5A5" }]}>({new Date(item.dataEnvaseBag).toLocaleDateString("pt-BR").slice(0, 5)})</Text>
        </View>
        <View style={[styles.dateBadgeModern, styles.dateBadgeBaixadoModern]}>
          <MaterialCommunityIcons name="history" size={14} color="#EF4444" />
          <Text style={[styles.dateTextModern, { color: "#EF4444" }]}>
            {item.dataBaixa ? new Date(item.dataBaixa).toLocaleDateString("pt-BR") : "--"}
          </Text>
        </View>
      </View>

      <View style={styles.motivoCardModern}>
        <MaterialCommunityIcons name="alert-decagram" size={22} color="#EF4444" />
        <Text style={styles.motivoCardTextModern}>
          <Text style={{ fontWeight: "bold" }}>Motivo: </Text>
          {item.motivoBaixa}
        </Text>
      </View>

      {item.observacaoBaixa && (
        <View style={styles.obsCardModern}>
          <MaterialCommunityIcons name="message-text" size={16} color="#991B1B" />
          <Text style={styles.obsCardTextModern}>{item.observacaoBaixa}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      
      <View style={styles.tabContainerModern}>
        <TouchableOpacity
          style={[styles.tabBtnModern, abaAtual === "DISPONIVEIS" && styles.tabBtnAtivoModern]}
          onPress={() => setAbaAtual("DISPONIVEIS")}
        >
          <MaterialCommunityIcons name="check-circle" size={22} color={abaAtual === "DISPONIVEIS" ? "#10B981" : "#64748B"} />
          <Text style={[styles.tabTextModern, abaAtual === "DISPONIVEIS" && styles.tabTextAtivoModern]}>Disponíveis</Text>
          <View style={[styles.tabIndicator, abaAtual === "DISPONIVEIS" && styles.tabIndicatorActive]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtnModern, abaAtual === "BAIXADOS" && styles.tabBtnAtivoModern]}
          onPress={() => setAbaAtual("BAIXADOS")}
        >
          <MaterialCommunityIcons name="history" size={22} color={abaAtual === "BAIXADOS" ? "#F59E0B" : "#64748B"} />
          <Text style={[styles.tabTextModern, abaAtual === "BAIXADOS" && styles.tabTextAtivoModern]}>Histórico</Text>
          <View style={[styles.tabIndicator, abaAtual === "BAIXADOS" && styles.tabIndicatorActive]} />
        </TouchableOpacity>
      </View>

      
      <View style={styles.searchWrapperModern}>
        <View style={styles.searchContainerModern}>
          <MaterialCommunityIcons name="magnify" size={22} color="#38BDF8" />
          <TextInput
            style={styles.searchInputModern}
            placeholder="Buscar tambor..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterBtnModern} onPress={() => setModalFiltroVisible(true)}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>Carregando tambores...</Text>
        </View>
      ) : (
        <FlatList
          data={tamboresFiltrados}
          
          keyExtractor={(item) => String(item.id)}
          renderItem={abaAtual === "DISPONIVEIS" ? renderTamborDisponivel : renderTamborBaixado}
          contentContainerStyle={styles.listContentModern}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="barrel" size={64} color="#64748B" />
              <Text style={styles.emptyText}>Nenhum tambor encontrado</Text>
            </View>
          }
        />
      )}

      
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlayModern}>
          <View style={styles.modalContentModern}>
            <View style={styles.modalHeaderNeon}>
              <MaterialCommunityIcons name="arrow-down-bold-box" size={28} color="#EF4444" />
              <Text style={styles.modalTitleModern}>Baixa Manual</Text>
              <Text style={styles.modalSubtitleModern}>Tambor {tamborSelecionado?.numeroTambor}</Text>
            </View>

            <Text style={styles.labelModern}>Motivo da Baixa</Text>
            <View style={styles.motivoContainerModern}>
              {opcoesMotivo.map((motivo) => (
                <TouchableOpacity
                  key={motivo}
                  style={[styles.motivoBtnModern, motivoBaixa === motivo && styles.motivoBtnAtivoModern]}
                  onPress={() => setMotivoBaixa(motivo)}
                >
                  <Text style={[styles.motivoTextModern, motivoBaixa === motivo && styles.motivoTextAtivoModern]}>
                    {motivo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {motivoBaixa === "Venda" && (
              <>
                <Text style={styles.labelModern}>Empresa Compradora</Text>
                <TextInput
                  style={styles.inputModern}
                  placeholder="Digite o nome da empresa"
                  placeholderTextColor="#94A3B8"
                  value={nomeEmpresa}
                  onChangeText={setNomeEmpresa}
                />
              </>
            )}

            <Text style={styles.labelModern}>Observações</Text>
            <TextInput
              style={[styles.inputModern, styles.textAreaModern]}
              placeholder="Informações adicionais..."
              placeholderTextColor="#94A3B8"
              value={observacaoBaixa}
              onChangeText={setObservacaoBaixa}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActionsModern}>
              <TouchableOpacity style={styles.modalBtnCancelModern} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnTextCancelModern}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalBtnConfirmModern} onPress={handleConfirmarBaixa} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.modalBtnTextConfirmModern}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
      <Modal visible={modalFiltroVisible} transparent animationType="slide">
        <View style={styles.modalOverlayModern}>
          <View style={[styles.modalContentModern, { maxHeight: '85%' }]}>
            <View style={styles.modalHeaderFilterModern}>
              <Text style={styles.modalTitleModern}>Filtros Avançados</Text>
              <TouchableOpacity onPress={() => setModalFiltroVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FilterSelect 
                label="Variedade da Uva" 
                icon="🍇" 
                value={filtroVariedade} 
                options={variedadesUnicas} 
                onSelect={setFiltroVariedade} 
                placeholder="Selecione..."
              />

              <FilterSelect 
                label="Fornecedor" 
                icon="🚜" 
                value={filtroFornecedor} 
                options={fornecedoresUnicos} 
                onSelect={setFiltroFornecedor} 
                placeholder="Selecione..."
              />

              <View style={{ marginBottom: 16 }}>
                <Text style={styles.labelModern}>📅 Data de Extração</Text>
                <TouchableOpacity style={styles.selectButtonModern} onPress={() => setShowDatePicker(true)}>
                  <Text style={[styles.selectTextModern, !filtroData && { color: "#94A3B8" }]}>
                    {filtroData || "Selecionar data..."}
                  </Text>
                  <MaterialCommunityIcons name="calendar" size={22} color="#38BDF8" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={filtroData ? new Date(filtroData.split('/').reverse().join('-')) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type === "set" && selectedDate) {
                        setFiltroData(selectedDate.toLocaleDateString("pt-BR"));
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.colorFilterModern}>
                <View style={styles.colorFilterHeaderModern}>
                  <MaterialCommunityIcons name="palette" size={22} color="#38BDF8" />
                  <Text style={styles.colorFilterTitleModern}>Filtro de Cores</Text>
                </View>

                <Text style={styles.colorLabelModern}>🔴 420nm</Text>
                <View style={styles.rangeContainerModern}>
                  <TextInput style={styles.rangeInputModern} placeholder="Mín" placeholderTextColor="#94A3B8" value={cor420Min} onChangeText={setCor420Min} keyboardType="numeric" />
                  <Text style={styles.rangeSeparatorModern}>→</Text>
                  <TextInput style={styles.rangeInputModern} placeholder="Máx" placeholderTextColor="#94A3B8" value={cor420Max} onChangeText={setCor420Max} keyboardType="numeric" />
                </View>

                <Text style={styles.colorLabelModern}>🟢 520nm</Text>
                <View style={styles.rangeContainerModern}>
                  <TextInput style={styles.rangeInputModern} placeholder="Mín" placeholderTextColor="#94A3B8" value={cor520Min} onChangeText={setCor520Min} keyboardType="numeric" />
                  <Text style={styles.rangeSeparatorModern}>→</Text>
                  <TextInput style={styles.rangeInputModern} placeholder="Máx" placeholderTextColor="#94A3B8" value={cor520Max} onChangeText={setCor520Max} keyboardType="numeric" />
                </View>

                <Text style={styles.colorLabelModern}>🔵 620nm</Text>
                <View style={styles.rangeContainerModern}>
                  <TextInput style={styles.rangeInputModern} placeholder="Mín" placeholderTextColor="#94A3B8" value={cor620Min} onChangeText={setCor620Min} keyboardType="numeric" />
                  <Text style={styles.rangeSeparatorModern}>→</Text>
                  <TextInput style={styles.rangeInputModern} placeholder="Máx" placeholderTextColor="#94A3B8" value={cor620Max} onChangeText={setCor620Max} keyboardType="numeric" />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActionsFilterModern}>
              <TouchableOpacity style={styles.btnClearModern} onPress={limparFiltros}>
                <Text style={styles.btnClearTextModern}>Limpar Tudo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnApplyModern} onPress={() => setModalFiltroVisible(false)}>
                <Text style={styles.btnApplyTextModern}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  
  tabContainerModern: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop:20,
    gap: 12,
  },
  tabBtnModern: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    position: "relative",
  },
  tabBtnAtivoModern: {
    backgroundColor: "#334155",
  },
  tabTextModern: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
  },
  tabTextAtivoModern: {
    color: "#38BDF8",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    width: "50%",
    height: 2,
    backgroundColor: "transparent",
    borderRadius: 2,
  },
  tabIndicatorActive: {
    backgroundColor: "#38BDF8",
  },
  searchWrapperModern: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchContainerModern: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchInputModern: {
    flex: 1,
    height: 48,
    marginLeft: 12,
    color: "#FFF",
    fontSize: 15,
  },
  filterBtnModern: {
    backgroundColor: "#38BDF8",
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  listContentModern: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardModern: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBaixadoModern: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  cardHeaderModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badgeModern: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  badgeSubTextModern: {
    fontSize: 11,
    color: "#94A3B8",
    marginLeft: 4,
  },
  badgeBaixadoModern: {
    backgroundColor: "#FEE2E2",
  },
  badgeTextModern: {
    color: "#06B6D4",
    fontWeight: "bold",
    fontSize: 14,
  },
  dateBadgeModern: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  dateBadgeBaixadoModern: {
    backgroundColor: "#FECACA",
  },
  dateTextModern: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "500",
  },
  infoGridModern: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    gap: 12,
  },
  infoItemModern: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  infoLabelModern: {
    fontSize: 10,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  infoValueModern: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  colorSpectrumModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  colorBarModern: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorDotModern: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  colorLabelModern: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  colorValueModern: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
  },
  btnBaixaModern: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnBaixaTextModern: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  motivoCardModern: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  motivoCardTextModern: {
    flex: 1,
    fontSize: 13,
    color: "#991B1B",
  },
  obsCardModern: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  obsCardTextModern: {
    flex: 1,
    fontSize: 12,
    color: "#991B1B",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlayModern: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContentModern: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    overflow: "hidden",
  },
  modalHeaderNeon: {
    alignItems: "center",
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "#F8FAFC",
  },
  modalHeaderFilterModern: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitleModern: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  modalSubtitleModern: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  labelModern: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginTop: 16,
    marginHorizontal: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectButtonModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectTextModern: {
    fontSize: 15,
    color: "#1E293B",
  },
  inputModern: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    color: "#1E293B",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textAreaModern: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  motivoContainerModern: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 20,
  },
  motivoBtnModern: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  motivoBtnAtivoModern: {
    backgroundColor: "#E0F2FE",
    borderColor: "#38BDF8",
  },
  motivoTextModern: {
    color: "#64748B",
    fontWeight: "500",
  },
  motivoTextAtivoModern: {
    color: "#0284C7",
    fontWeight: "bold",
  },
  modalActionsModern: {
    flexDirection: "row",
    gap: 12,
    margin: 20,
  },
  modalBtnCancelModern: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalBtnConfirmModern: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#EF4444",
  },
  modalBtnTextCancelModern: {
    color: "#64748B",
    fontWeight: "600",
  },
  modalBtnTextConfirmModern: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalActionsFilterModern: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  btnClearModern: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  btnClearTextModern: {
    color: "#EF4444",
    fontWeight: "600",
  },
  btnApplyModern: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#10B981",
  },
  btnApplyTextModern: {
    color: "#FFF",
    fontWeight: "bold",
  },
  colorFilterModern: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  colorFilterHeaderModern: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  colorFilterTitleModern: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0284C7",
  },
  rangeContainerModern: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  rangeInputModern: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#1E293B",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rangeSeparatorModern: {
    color: "#38BDF8",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalHeaderModern: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalOptionModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalOptionActiveModern: {
    backgroundColor: "#E0F2FE",
  },
  modalOptionTextModern: {
    color: "#334155",
    fontSize: 15,
  },
  modalOptionTextActiveModern: {
    color: "#0284C7",
    fontWeight: "bold",
  },
});