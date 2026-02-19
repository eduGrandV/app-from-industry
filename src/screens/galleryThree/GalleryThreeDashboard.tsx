import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function GalleryThreeDashboard() {
  const navigation = useNavigation<any>();

  
  const navigateToLog = (areaName: string) => {
    navigation.navigate('CleaningLog', { areaName });
  };

  return (
    <View style={styles.container}>
      

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* LINHA DE ENVASE */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateToLog('Linha de Envase')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <MaterialCommunityIcons name="bottle-soda-classic" size={28} color="#0284C7" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Linha de Envase</Text>
            <Text style={styles.cardSubtitle}>Registro de limpeza diário</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* REGISTRO DE EXTRAÇÃO */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateToLog('Registro de Extração')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
            <FontAwesome5 name="seedling" size={24} color="#16A34A" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Registro de Extração</Text>
            <Text style={styles.cardSubtitle}>Controle de sanitização</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/*  LINHA DE VINHO */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigateToLog('Linha de Vinho')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FAE8FF' }]}>
            <MaterialCommunityIcons name="glass-wine" size={28} color="#9333EA" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Linha de Vinho</Text>
            <Text style={styles.cardSubtitle}>Higienização de tanques</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        {/* OPÇÃO 4: pragas */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('PestControl')} // Nome definido no navigator
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <MaterialCommunityIcons name="spider" size={28} color="#B91C1C" />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>Controle de Pragas</Text>
            <Text style={styles.cardSubtitle}>Monitoramento de áreas</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  content: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  textBox: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#94A3B8' },
});