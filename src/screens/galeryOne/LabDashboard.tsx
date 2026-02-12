import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export function LabDashboard() {
  const navigation = useNavigation<any>();

  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };

  const menuItems = [
    {
      id: 1,
      title: 'Análise de Laboratório Frutas',
      icon: <FontAwesome5 name="apple-alt" size={28} color="#4CAF50" />,
      screen: 'LabFruit',
      color: '#E8F5E9',
      iconColor: '#2E7D32'
    },
    {
      id: 2,
      title: 'Análise de Laboratório Extração',
      icon: <MaterialIcons name="settings" size={28} color="#FF9800" />,
      screen: 'LabExtraction',
      color: '#FFF3E0',
      iconColor: '#EF6C00'
    },
    {
      id: 3,
      title: 'Análise Físico-Químicas Envase',
      icon: <MaterialCommunityIcons name="bottle-wine" size={28} color="#9C27B0" />,
      screen: 'LabBottling',
      color: '#F3E5F5',
      iconColor: '#7B1FA2'
    },
    {
      id: 4,
      title: 'Análise Físico-Químicas VINHO',
      icon: <Ionicons name="wine" size={28} color="#D32F2F" />,
      screen: 'LabWine',
      color: '#FFEBEE',
      iconColor: '#C62828'
    }
  ];

  return (
    <View style={styles.container}>
     

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Escolha a Análise</Text>
          <Text style={styles.subtitle}>Selecione a categoria para análise laboratorial</Text>
        </View>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => navigateTo(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: item.iconColor + '15' }]}>
                  {React.cloneElement(item.icon, { color: item.iconColor })}
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>Análise laboratorial</Text>
                </View>

                <View style={styles.arrowContainer}>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={item.iconColor}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 8, 
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});