import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import FakeStatusBar from '../components/FakeStatusBar';
import CurvedHeader from '../components/CurvedHeader';
import VerifiedBadge from '../components/VerifiedBadge';

const STEPS = [
  { label: 'Confirmed', state: 'done' },
  { label: 'On the way', state: 'current' },
  { label: 'Arrived', state: 'todo' },
];

export default function TrackExpertScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <FakeStatusBar />
        <CurvedHeader
          title="Track your expert"
          onBack={() => navigation.goBack()}
          rightIcon="ellipsis-horizontal"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Expert is on the way</Text>

        {/* Progress stepper */}
        <View style={styles.stepper}>
          {STEPS.map((step, index) => (
            <View key={step.label} style={styles.step}>
              <View style={styles.stepDotRow}>
                {index > 0 && (
                  <View style={[styles.stepLine, index === 1 && styles.stepLineActive]} />
                )}
                <View
                  style={[
                    styles.stepDot,
                    step.state === 'done' && styles.stepDotDone,
                    step.state === 'current' && styles.stepDotCurrent,
                  ]}
                />
                {index < STEPS.length - 1 && (
                  <View style={[styles.stepLine, step.state === 'done' && styles.stepLineActive]} />
                )}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.stepLabels}>
          {STEPS.map((step) => (
            <Text
              key={step.label}
              style={[styles.stepLabel, step.state === 'current' && styles.stepLabelCurrent]}
            >
              {step.label}
            </Text>
          ))}
        </View>

        {/* Map */}
        <Image source={require('../../assets/map.png')} style={styles.map} resizeMode="cover" />

        {/* Expert card */}
        <View style={styles.expertCard}>
          <Image source={require('../../assets/expert_maya_small.png')} style={styles.expertImage} />
          <View style={styles.expertText}>
            <View style={styles.expertNameRow}>
              <Text style={styles.expertName}>Maya Johnson</Text>
              <VerifiedBadge size={16} />
            </View>
            <Text style={styles.expertService}>Home cleaning specialist</Text>
          </View>
          <Text style={styles.rating}>
            <Ionicons name="star-outline" size={16} color={theme.colors.orange} /> 4.9
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrap: { backgroundColor: theme.colors.lavender },
  scroll: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 18 },
  heading: { fontSize: 22, fontWeight: '800', color: theme.colors.navy },
  stepper: { flexDirection: 'row', marginTop: 18 },
  step: { flex: 1 },
  stepDotRow: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.lavenderMid },
  stepDotDone: { backgroundColor: theme.colors.indigo },
  stepDotCurrent: { backgroundColor: theme.colors.orange },
  stepLine: { flex: 1, height: 3, backgroundColor: theme.colors.trackLight },
  stepLineActive: { backgroundColor: theme.colors.indigo },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  stepLabel: { color: theme.colors.textMuted, fontSize: 12, textAlign: 'center', flex: 1 },
  stepLabelCurrent: { color: theme.colors.navy, fontWeight: '700' },
  map: { width: '100%', height: 280, borderRadius: 24, marginTop: 18 },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.card,
    padding: 14,
    marginTop: 18,
  },
  expertImage: { width: 64, height: 64, borderRadius: 16 },
  expertText: { flex: 1 },
  expertNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expertName: { fontSize: 16, fontWeight: '800', color: theme.colors.navy },
  expertService: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  rating: { color: theme.colors.navy, fontWeight: '700' },
});
