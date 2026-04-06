import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
  usuarioId: number | null;
  nomeOperador: string | null;
  entrarNoTurno: (id: number, nome: string) => Promise<void>;
  sairDoTurno: () => Promise<void>;
  carregando: boolean; 
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [nomeOperador, setNomeOperador] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Assim que o app abre, ele procura se já tem alguém logado
  useEffect(() => {
    async function carregarDadosDoCofre() {
      const idSalvo = await AsyncStorage.getItem('@FabricaApp:usuarioId');
      const nomeSalvo = await AsyncStorage.getItem('@FabricaApp:nome');

      if (idSalvo && nomeSalvo) {
        setUsuarioId(Number(idSalvo));
        setNomeOperador(nomeSalvo);
      }
      setCarregando(false);
    }
    carregarDadosDoCofre();
  }, []);

  async function entrarNoTurno(id: number, nome: string) {
    await AsyncStorage.setItem('@FabricaApp:usuarioId', String(id));
    await AsyncStorage.setItem('@FabricaApp:nome', nome);
    setUsuarioId(id);
    setNomeOperador(nome);
  }

  async function sairDoTurno() {
    await AsyncStorage.removeItem('@FabricaApp:usuarioId');
    await AsyncStorage.removeItem('@FabricaApp:nome');
    setUsuarioId(null);
    setNomeOperador(null);
  }

  return (
    <AuthContext.Provider value={{ usuarioId, nomeOperador, entrarNoTurno, sairDoTurno, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};