import AsyncStorage from "@react-native-async-storage/async-storage";

export const DraftService = {
  /**
   *  para savaaar silenciosamente os dados
   * @param key nome telaaa
   * @param data dados da telaaa
   */

  async saveDraft(key: string, data: any) {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar rascunho da chave ${key}:`, error);
    }
  },

  /**
   * Busca o rascunho salvo quando o operador reabrir a tela
   * @param key Nome  da tela
   * @returns Os dados salvos ou null se não houver rascunho
   */

  async getDraft(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erro ao buscar rascunho da chave ${key}:`, error);
      return null;
    }
  },

  /**
   * Apaga o rascunho do celular, usado quando ele finalmente envia o formulário oficial.
   * @param key nome único da tela
   */

  async clearDraft(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Erro ao limpar rascunho da chave ${key}:`, e);
    }
  },
};
