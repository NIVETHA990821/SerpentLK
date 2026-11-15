
import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/context/app-theme';
import { useLanguage } from '@/i18n/LanguageProvider';
import firstAid from '@/data/firstAid.json';
import { hospitals } from '@/data/hospitals';

type Section = 'do' | 'dont' | 'hospitals';

export default function FirstAidScreen() {
  const [section, setSection] = useState<Section>('do');

  const { colors } = useAppTheme();
  const { t } = useLanguage();

  const callEmergency = () => {
    Linking.openURL(
      `tel:${firstAid.emergencyNumber}`
    ).catch(() => {});
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.pageTitle,
            { color: colors.text },
          ]}
        >
          {t("snakebiteFirstAid")}
        </Text>


      </View>

      <Pressable
        style={styles.emergencyCard}
        onPress={callEmergency}
        accessibilityRole="button"
        accessibilityLabel="Call emergency ambulance 1990"
      >
        <Text style={styles.phoneIcon}>📞</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.emergencyLabel}>
            {t("ambulance")}
          </Text>

          <Text style={styles.emergencyTitle}>
            {t("callNow")}
          </Text>

          <Text style={styles.emergencySubtitle}>
            {t("ambulanceService")}
          </Text>

          <Text style={styles.emergencySmall}>
            {t("emergencyPhone")}
          </Text>
        </View>

        <Text style={styles.emergencyArrow}>›</Text>
      </Pressable>

      <View
        style={[
          styles.notice,
          {
            backgroundColor: colors.soft,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.noticeText,
            { color: colors.text },
          ]}
        >
          ⚠️ {t('firstAidNotice')}
        </Text>
      </View>

      <View style={styles.tabs}>
        {(
          [
            { id: 'do', label: `✔ ${t('whatToDo')}` },
            { id: 'dont', label: `✖ ${t('whatNotToDo')}` },
            { id: 'hospitals', label: `🏥 ${t('hospitals')}` },
          ] as const
        ).map((item) => {
          const selected = section === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => setSection(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selected
                    ? '#1967BD'
                    : colors.card,
                  borderColor: selected
                    ? '#1967BD'
                    : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selected
                      ? '#FFFFFF'
                      : colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {section === 'do' && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            {t("whatToDoAfter")}
          </Text>

          {firstAid.steps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>
                  {index + 1}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: colors.text },
                  ]}
                >
                  {step.title}
                </Text>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.muted },
                  ]}
                >
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {section === 'dont' && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            {t("whatNotToDo")}
          </Text>

          {firstAid.donts.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.dangerBackground,
                  borderColor: colors.dangerText,
                },
              ]}
            >
              <Text style={styles.crossIcon}>✖</Text>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: colors.dangerText },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardDescription,
                    { color: colors.text },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {section === 'hospitals' && (
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            {t("majorHospitals")}
          </Text>

          <Text
            style={[
              styles.hospitalIntro,
              { color: colors.muted },
            ]}
          >
            {t('hospitalIntro')}
          </Text>

          <View
            style={[
              styles.hospitalWarning,
              {
                backgroundColor: colors.soft,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.text, lineHeight: 21 }}>
              {t('hospitalWarning')}
            </Text>
          </View>

          {hospitals.map((hospital) => (
            <View
              key={hospital.id}
              style={[
                styles.hospitalCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.hospitalIcon,
                  { backgroundColor: colors.soft },
                ]}
              >
                <Text style={{ fontSize: 25 }}>🏥</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.hospitalName,
                    { color: colors.text },
                  ]}
                >
                  {hospital.name}
                </Text>

                <Text
                  style={[
                    styles.hospitalLocation,
                    { color: colors.muted },
                  ]}
                >
                  {hospital.district} District •{' '}
                  {hospital.province} Province
                </Text>

                <Text style={styles.hospitalCategory}>
                  {hospital.category}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View
        style={[
          styles.references,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.referencesTitle,
            { color: colors.text },
          ]}
        >
          {t("medicalReferences")}
        </Text>

        <Text
          style={[
            styles.referencesText,
            { color: colors.muted },
          ]}
        >
          • Sri Lanka Medical Association snakebite guidance
          {'\n'}
          • World Health Organization snakebite guidance
        </Text>

        <Text
          style={[
            styles.referencesNote,
            { color: colors.muted },
          ]}
        >
          {t('guidanceReview')}
        </Text>
      </View>

      <Text
        style={[
          styles.footer,
          { color: colors.muted },
        ]}
      >
        {firstAid.disclaimer}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 45,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 18,
  },
  pageTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: '800',
  },
  emergencyCard: {
    backgroundColor: '#C62828',
    borderRadius: 17,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  phoneIcon: {
    fontSize: 32,
  },
  emergencyLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    marginVertical: 4,
  },
  emergencySubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emergencySmall: {
    color: '#FFE3E0',
    fontSize: 12,
    marginTop: 5,
  },
  emergencyArrow: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  notice: {
    padding: 17,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 17,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#276B42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 23,
  },
  crossIcon: {
    color: '#D32F2F',
    fontSize: 22,
    fontWeight: 'bold',
  },
  hospitalIntro: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  hospitalWarning: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  hospitalCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  hospitalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },
  hospitalLocation: {
    fontSize: 13,
    lineHeight: 20,
  },
  hospitalCategory: {
    fontSize: 12,
    color: '#39A36D',
    marginTop: 5,
    fontWeight: '700',
  },
  references: {
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
  },
  referencesTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  referencesText: {
    fontSize: 13,
    lineHeight: 24,
  },
  referencesNote: {
    fontSize: 12,
    lineHeight: 20,
    marginTop: 10,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 20,
  },
});
