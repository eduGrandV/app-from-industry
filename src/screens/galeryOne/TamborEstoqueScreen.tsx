import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface Tambor {
  id: number;
  numeroTambor: string;
  dataEnvaseBag: string;
  variedadeUva: string;
  fornecedor?: string;
  acidez: number | null;
  relacao: number | null;
  motivoBaixa?: string;
  observacaoBaixa?: string;
  dataBaixa?: string;
}

export function TamborEstoqueScreen() {
  const navigation = useNavigation<any>();
  const { usuarioId } = useContext(AuthContext);

  const [abaAtual, setAbaAtual] = useState<"DISPONIVEIS" | "BAIXADOS">(
    "DISPONIVEIS",
  );
  const [tambores, setTambores] = useState<Tambor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [tamborSelecionado, setTamborSelecionado] = useState<Tambor | null>(
    null,
  );
  const [motivoBaixa, setMotivoBaixa] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [observacaoBaixa, setObservacaoBaixa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
  const [filtroVariedade, setFiltroVariedade] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const opcoesMotivo = ["Venda", "Contaminado", "Fermentado", "Outros"];

  const loadTambores = async () => {
    setLoading(true);
    try {
      if (abaAtual === "DISPONIVEIS") {
        const response = await api.get("/tambores/disponiveis");
        setTambores(response.data);
      } else {
        const response = await api.get("/tambores/baixados");
        setTambores(response.data);
      }
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

  const tamboresFiltrados = tambores.filter((t) => {
    const termoPesquisa = search.toLowerCase();
    const matchBusca = t.numeroTambor.toLowerCase().includes(termoPesquisa);

    const matchVariedade = filtroVariedade
      ? t.variedadeUva.toLowerCase().includes(filtroVariedade.toLowerCase())
      : true;

    const matchFornecedor =
      filtroFornecedor && t.fornecedor
        ? t.fornecedor.toLowerCase().includes(filtroFornecedor.toLowerCase())
        : true;

    const matchData = filtroData
      ? new Date(t.dataEnvaseBag)
          .toLocaleDateString("pt-BR")
          .includes(filtroData)
      : true;

    return matchBusca && matchVariedade && matchFornecedor && matchData;
  });

  const limparFiltros = () => {
    setFiltroVariedade("");
    setFiltroFornecedor("");
    setFiltroData("");
    setModalFiltroVisible(false);
  };

  const abrirModalBaixa = (tambor: Tambor) => {
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
      Alert.alert(
        "Atenção",
        "Por favor, informe o nome da empresa compradora.",
      );
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

  const renderTamborDisponivel = ({ item }: { item: Tambor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="barrel" size={20} color="#0284C7" />
          <Text style={styles.badgeText}>Bag/Tambor {item.numeroTambor}</Text>
        </View>
        <Text style={styles.dataText}>
          {new Date(item.dataEnvaseBag).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>🍇 {item.variedadeUva}</Text>
        <Text style={styles.infoText}>🧪 Acidez: {item.acidez || "--"}</Text>
        <Text style={styles.infoText}>📊 Ratio: {item.relacao || "--"}</Text>
      </View>

      <TouchableOpacity
        style={styles.btnBaixa}
        onPress={() => abrirModalBaixa(item)}
      >
        <MaterialCommunityIcons
          name="arrow-down-bold-box"
          size={20}
          color="#fff"
        />
        <Text style={styles.btnBaixaText}>Dar Baixa Manual</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTamborBaixado = ({ item }: { item: Tambor }) => (
    <View
      style={[
        styles.card,
        { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: "#FEE2E2" }]}>
          <MaterialCommunityIcons name="barrel" size={20} color="#EF4444" />
          <Text style={[styles.badgeText, { color: "#EF4444" }]}>
            Bag/Tambor {item.numeroTambor}
          </Text>
        </View>
        <Text style={[styles.dataText, { color: "#EF4444" }]}>
          Baixado em{" "}
          {item.dataBaixa
            ? new Date(item.dataBaixa).toLocaleDateString("pt-BR")
            : "--"}
        </Text>
      </View>

      <View
        style={[
          styles.infoRow,
          { backgroundColor: "#fff", borderColor: "#FECACA", borderWidth: 1 },
        ]}
      >
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={16}
          color="#EF4444"
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.infoText, { color: "#991B1B", flex: 1 }]}>
          <Text style={{ fontWeight: "bold" }}>Motivo: </Text>
          {item.motivoBaixa}
        </Text>
      </View>

      {item.observacaoBaixa ? (
        <Text style={styles.observacaoBaixado}>
          <Text style={{ fontWeight: "bold", color: "#7F1D1D" }}>Obs: </Text>
          {item.observacaoBaixa}
        </Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View
          style={[styles.headerIconContainer, { backgroundColor: "#E0F2FE" }]}
        >
          <MaterialCommunityIcons name="snowflake" size={32} color="#0284C7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Câmara Fria</Text>
          <Text style={styles.headerSubtitle}>Controle de Tambores e Bags</Text>
        </View>
      </View>

      {/* SELETOR DE ABAS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            abaAtual === "DISPONIVEIS" && styles.tabBtnAtivo,
          ]}
          onPress={() => setAbaAtual("DISPONIVEIS")}
        >
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={20}
            color={abaAtual === "DISPONIVEIS" ? "#0284C7" : "#64748B"}
          />
          <Text
            style={[
              styles.tabText,
              abaAtual === "DISPONIVEIS" && styles.tabTextAtivo,
            ]}
          >
            Disponíveis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, abaAtual === "BAIXADOS" && styles.tabBtnAtivo]}
          onPress={() => setAbaAtual("BAIXADOS")}
        >
          <MaterialCommunityIcons
            name="history"
            size={20}
            color={abaAtual === "BAIXADOS" ? "#0284C7" : "#64748B"}
          />
          <Text
            style={[
              styles.tabText,
              abaAtual === "BAIXADOS" && styles.tabTextAtivo,
            ]}
          >
            Histórico (Baixas)
          </Text>
        </TouchableOpacity>
      </View>

      {/* BARRA DE PESQUISA E BOTÃO DE FILTROS */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginVertical: 12,
        }}
      >
        <View style={[styles.searchContainer, { flex: 1, margin: 0 }]}>
          <MaterialCommunityIcons name="magnify" size={24} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar N° Bag/Tambor..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#0284C7",
            padding: 12,
            borderRadius: 8,
            marginLeft: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalFiltroVisible(true)}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* LISTA DE TAMBORES */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0284C7"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={tamboresFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={
            abaAtual === "DISPONIVEIS"
              ? renderTamborDisponivel
              : renderTamborBaixado
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum tambor{" "}
              {abaAtual === "DISPONIVEIS" ? "disponível" : "baixado"}{" "}
              encontrado.
            </Text>
          }
        />
      )}

      {/* MODAL DE BAIXA (POP-UP) */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Baixa Manual - Tambor {tamborSelecionado?.numeroTambor}
            </Text>

            <Text style={styles.label}>Motivo da Baixa*</Text>
            <View style={styles.motivoContainer}>
              {opcoesMotivo.map((motivo) => (
                <TouchableOpacity
                  key={motivo}
                  style={[
                    styles.motivoBtn,
                    motivoBaixa === motivo && styles.motivoBtnAtivo,
                  ]}
                  onPress={() => setMotivoBaixa(motivo)}
                >
                  <Text
                    style={[
                      styles.motivoText,
                      motivoBaixa === motivo && styles.motivoTextAtivo,
                    ]}
                  >
                    {motivo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SELECIONOU VENDA: Pede o nome da empresa */}
            {motivoBaixa === "Venda" && (
              <>
                <Text style={styles.label}>Nome da Empresa Compra*</Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { minHeight: 48, paddingVertical: 12 },
                  ]}
                  placeholder="Ex: Vinícola do Vale"
                  value={nomeEmpresa}
                  onChangeText={setNomeEmpresa}
                />
              </>
            )}

            <Text style={styles.label}>Observação (Opcional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Detalhes adicionais..."
              value={observacaoBaixa}
              onChangeText={setObservacaoBaixa}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#E2E8F0" }]}
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={{ color: "#475569", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#EF4444" }]}
                onPress={handleConfirmarBaixa}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Confirmar Baixa
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE FILTROS AVANÇADOS */}
      <Modal
        visible={modalFiltroVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={styles.modalTitle}>Filtros Avançados</Text>
              <TouchableOpacity onPress={() => setModalFiltroVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>🍇 Variedade</Text>
            <TextInput
              style={[
                styles.textArea,
                { minHeight: 45, paddingVertical: 10, marginBottom: 12 },
              ]}
              placeholder="Ex: Cotton, BRS"
              value={filtroVariedade}
              onChangeText={setFiltroVariedade}
            />

            <Text style={styles.label}>🚜 Fornecedor</Text>
            <TextInput
              style={[
                styles.textArea,
                { minHeight: 45, paddingVertical: 10, marginBottom: 12 },
              ]}
              placeholder="Nome do produtor..."
              value={filtroFornecedor}
              onChangeText={setFiltroFornecedor}
            />

            <Text style={styles.label}>📅 Data da Extração</Text>
            <TextInput
              style={[styles.textArea, { minHeight: 45, paddingVertical: 10 }]}
              placeholder="DD/MM/YYYY"
              value={filtroData}
              onChangeText={setFiltroData}
              keyboardType="numeric"
            />

            <View style={[styles.modalActions, { marginTop: 30 }]}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: "#FEE2E2", flex: 1 },
                ]}
                onPress={limparFiltros}
              >
                <Text style={{ color: "#EF4444", fontWeight: "bold" }}>
                  Limpar Filtros
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: "#0284C7", flex: 1 },
                ]}
                onPress={() => setModalFiltroVisible(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  headerSubtitle: { fontSize: 14, color: "#64748B" },

  tabContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    gap: 8,
  },
  tabBtnAtivo: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#0284C7",
  },
  tabText: { color: "#64748B", fontWeight: "600", fontSize: 14 },
  tabTextAtivo: { color: "#0284C7", fontWeight: "bold" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: { flex: 1, height: 48, marginLeft: 8, color: "#1E293B" },

  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#0284C7", fontWeight: "bold", marginLeft: 6 },
  dataText: { color: "#64748B", fontSize: 13, fontWeight: "500" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: { color: "#334155", fontWeight: "500", fontSize: 13 },
  observacaoBaixado: {
    fontSize: 13,
    color: "#991B1B",
    marginTop: 4,
    fontStyle: "italic",
  },

  btnBaixa: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBaixaText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },

  emptyText: { textAlign: "center", color: "#64748B", marginTop: 40 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
    marginTop: 12,
  },

  motivoContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  motivoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  motivoBtnAtivo: { borderColor: "#0284C7", backgroundColor: "#E0F2FE" },
  motivoText: { color: "#64748B", fontWeight: "500" },
  motivoTextAtivo: { color: "#0284C7", fontWeight: "bold" },

  textArea: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
});
