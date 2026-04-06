import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker"; 
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";

type Operador = {
  id: number;
  nmUsuario: string;
};

export function LoginScreen() {
  const [modo, setModo] = useState<"selecionar" | "cadastrar">("selecionar");
  
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const { entrarNoTurno } = useContext(AuthContext);

  // Busca os operadores ao carregar a tela
  useEffect(() => {
    carregarOperadores();
  }, []);

  async function carregarOperadores() {
    try {
      const response = await api.get("/auth/operadores");
      setOperadores(response.data);
      if (response.data.length > 0) {
        setSelectedId(response.data[0].id); // Seleciona o primeiro por padrão
      }
    } catch (error) {
      console.error("Erro ao carregar operadores:", error);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleAcao() {
    setLoading(true);

    try {
      let response;

      if (modo === "selecionar") {
        if (!selectedId) {
          Alert.alert("Atenção", "Selecione um operador na lista.");
          setLoading(false);
          return;
        }
        // Bate na rota de login enviando o ID
        response = await api.post("/auth/app/login", { id: selectedId });
      } else {
        if (novoNome.trim() === "") {
          Alert.alert("Atenção", "Digite o nome para cadastrar.");
          setLoading(false);
          return;
        }
        // Bate na rota de cadastro enviando o nome
        response = await api.post("/auth/app/cadastrar", { nome: novoNome.trim() });
      }

      const idRealDoBanco = response.data.usuarioId;
      const nomeOficial = response.data.nome;

      await entrarNoTurno(idRealDoBanco, nomeOficial);
    } catch (error: any) {
      console.error("Erro na autenticação:", error);
      const mensagemErro = error.response?.data?.error || "Erro de conexão com o servidor.";
      Alert.alert("Falha", mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={48} color="#0F172A" />
            </View>
            <Text style={styles.title}>Controle de Produção</Text>
            <Text style={styles.subtitle}>Identifique-se para iniciar o turno</Text>
          </View>

          <View style={styles.formSection}>
            
            {/* ABAS (TOGGLE) */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, modo === "selecionar" && styles.tabActive]}
                onPress={() => setModo("selecionar")}
              >
                <Text style={[styles.tabText, modo === "selecionar" && styles.tabTextActive]}>
                  Já sou cadastrado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, modo === "cadastrar" && styles.tabActive]}
                onPress={() => setModo("cadastrar")}
              >
                <Text style={[styles.tabText, modo === "cadastrar" && styles.tabTextActive]}>
                  Novo Cadastro
                </Text>
              </TouchableOpacity>
            </View>

            {/* CONTEÚDO DINÂMICO */}
            {modo === "selecionar" ? (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-group-outline" size={22} color="#0F172A" style={styles.inputIcon} />
                {loadingUsers ? (
                  <ActivityIndicator size="small" color="#0F172A" style={{ flex: 1 }} />
                ) : (
                  <Picker
                    selectedValue={selectedId}
                    onValueChange={(itemValue) => setSelectedId(itemValue)}
                    style={{ flex: 1, color: "#0F172A" }}
                    dropdownIconColor="#0F172A"
                  >
                    {operadores.map((op) => (
                      <Picker.Item key={op.id} label={`${op.id} - ${op.nmUsuario}`} value={op.id} />
                    ))}
                  </Picker>
                )}
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={22}
                  color={isFocused ? "#0F172A" : "#94A3B8"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, isFocused && styles.inputFocused]}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#94A3B8"
                  value={novoNome}
                  onChangeText={setNovoNome}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAcao}
              disabled={loading || loadingUsers}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name={modo === "selecionar" ? "login-variant" : "account-check"}
                    size={20}
                    color="#FFFFFF"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    {modo === "selecionar" ? "Iniciar Turno" : "Cadastrar e Entrar"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sistema de gestão de produção</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 },
  
  headerSection: { alignItems: "center", marginBottom: 32 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: "#F1F5F9" },
  title: { fontSize: 28, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5, marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#64748B", fontWeight: "500", lineHeight: 22, textAlign: "center" },
  
  formSection: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: "#F1F5F9" },
  
  tabContainer: { flexDirection: "row", backgroundColor: "#F1F5F9", borderRadius: 12, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  tabTextActive: { color: "#0F172A", fontWeight: "700" },

  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, backgroundColor: "#FFFFFF", marginBottom: 24, paddingHorizontal: 16, minHeight: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#0F172A", fontWeight: "500" },
  inputFocused: { borderColor: "#0F172A" },
  
  button: { backgroundColor: "#0F172A", paddingVertical: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonIcon: { marginRight: 8 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  
  footer: { marginTop: 32, alignItems: "center" },
  footerText: { fontSize: 12, color: "#94A3B8", fontWeight: "500" },
});