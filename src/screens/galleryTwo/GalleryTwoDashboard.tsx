import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export function GalleryTwoDashboard() {
  const navigation = useNavigation<any>();

  const menuItems = [
    {
      id: 1,
      title: 'Controle de Água',
      subtitle: 'pH, Cloro e Turbidez',
      icon: <MaterialCommunityIcons name="water-check" size={32} color="#0288D1" />,
      screen: 'WaterQuality', 
      color: '#E1F5FE',
      iconColor: '#0288D1'
    },
    {
      id: 2,
      title: 'Rotina da ETA', 
      subtitle: 'Tratamento e Química', 
      icon: <MaterialCommunityIcons name="factory" size={28} color="#EF6C00" />, 
      screen: 'EtaRoutine', 
      color: '#FFF3E0', 
      iconColor: '#EF6C00'
    }
  ];

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#fff' }]}>
                  {item.icon}
                </View>
                <MaterialIcons name="arrow-forward" size={24} color={item.iconColor} style={{ opacity: 0.6 }} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: item.iconColor }]}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  content: { padding: 20 },
  grid: { gap: 16 },
  card: {
    borderRadius: 20, padding: 24, height: 160,
    justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, elevation: 4
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  textContainer: {},
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: '#475569', fontWeight: '500' },
});