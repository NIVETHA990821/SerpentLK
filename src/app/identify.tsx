import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Icon, type IconName } from '@/components/icon';
import { SnakeImage } from '@/components/snake-image';
import { VenomBadge } from '@/components/venom-badge';
import { colors, MAX_WIDTH, radius, space, type } from '@/constants/theme';
import { useAppTheme } from '@/context/app-theme';
import { rankSnakes, type Answers } from '@/utils/identify';

type Option<K extends keyof Answers> = { value: NonNullable<Answers[K]>; label: string; icon: IconName; hint?: string };
type Step<K extends keyof Answers = keyof Answers> = { key: K; question: string; options: Option<K>[] };

const STEPS: Step[] = [
  {
    key: 'place',
    question: 'Where did you see it?',
    options: [
      { value: 'home', label: 'In or near a house or garden', icon: 'home-outline' },
      { value: 'field', label: 'Paddy field, grass or scrub', icon: 'leaf-outline' },
      { value: 'forest', label: 'Forest floor or leaf litter', icon: 'trail-sign-outline' },
      { value: 'tree', label: 'Up in a tree or bush', icon: 'git-branch-outline' },
      { value: 'water', label: 'In or beside water', icon: 'water-outline' },
    ],
  } as Step<'place'>,
  {
    key: 'colour',
    question: 'What was its main colour?',
    options: [
      { value: 'brown', label: 'Brown, tan or sandy', icon: 'ellipse', hint: '#9a7448' },
      { value: 'green', label: 'Green or olive', icon: 'ellipse', hint: '#4f9a3a' },
      { value: 'dark', label: 'Black or very dark', icon: 'ellipse', hint: '#1b1b1f' },
      { value: 'grey', label: 'Grey', icon: 'ellipse', hint: '#8a8d8a' },
    ],
  } as Step<'colour'>,
  {
    key: 'pattern',
    question: 'What pattern did it have?',
    options: [
      { value: 'bands', label: 'Rings or bands across the body', icon: 'reorder-four-outline' },
      { value: 'spots', label: 'Spots, blotches or a chain', icon: 'apps-outline' },
      { value: 'stripes', label: 'Stripes along the body', icon: 'remove-outline' },
      { value: 'plain', label: 'Plain, no clear pattern', icon: 'square-outline' },
    ],
  } as Step<'pattern'>,
  {
    key: 'size',
    question: 'About how long was it?',
    options: [
      { value: 'small', label: 'Short, under half a metre', icon: 'remove-outline' },
      { value: 'medium', label: 'About as long as an arm', icon: 'resize-outline' },
      { value: 'large', label: 'Very long or thick, over 1.5 m', icon: 'expand-outline' },
    ],
  } as Step<'size'>,
  {
    key: 'time',
    question: 'When did you see it?',
    options: [
      { value: 'day', label: 'In daylight', icon: 'sunny-outline' },
      { value: 'night', label: 'At dusk or night', icon: 'moon-outline' },
    ],
  } as Step<'time'>,
];

export default function IdentifyScreen() {
  const { colors: theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= STEPS.length;
  const answered = Object.values(answers).filter(Boolean).length;

  const results = useMemo(() => rankSnakes(answers).slice(0, 6), [answers]);

  const choose = (value: string | undefined) => {
    const key = STEPS[step].key;
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.safety}>
        <Icon name="warning" size={18} color={colors.danger} />
        <Text style={styles.safetyText}>Stay at least two body lengths away. Treat any snake you cannot name as venomous.</Text>
      </View>

      <View style={styles.progressRow} accessibilityLabel={`Step ${Math.min(step + 1, STEPS.length)} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <View key={s.key} style={[styles.progress, i < step && styles.progressDone, i === step && styles.progressNow]} />
        ))}
      </View>

      {!done ? (
        <View style={styles.stepBlock}>
          <Text style={styles.stepCount}>
            Question {step + 1} of {STEPS.length}
          </Text>
          <Text style={styles.question} accessibilityRole="header">
            {STEPS[step].question}
          </Text>
          <View style={styles.options}>
            {STEPS[step].options.map((o) => (
              <Pressable
                key={o.value}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => choose(o.value)}
                accessibilityRole="button"
              >
                <View style={styles.optionIcon}>
                  <Icon name={o.icon} size={22} color={o.hint ?? theme.text} />
                </View>
                <Text style={styles.optionText}>{o.label}</Text>
                <Icon name="chevron-forward" size={18} color={theme.muted} />
              </Pressable>
            ))}
          </View>
          <View style={styles.stepNav}>
            {step > 0 ? (
              <Pressable onPress={() => setStep(step - 1)} hitSlop={10} accessibilityRole="button">
                <Text style={styles.navLink}>Back</Text>
              </Pressable>
            ) : (
              <View />
            )}
            <Pressable onPress={() => choose(undefined)} hitSlop={10} accessibilityRole="button">
              <Text style={styles.navLink}>Not sure, skip</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.stepBlock}>
          <Text style={styles.question} accessibilityRole="header">
            Closest matches
          </Text>
          <Text style={styles.resultsNote}>
            {answered === 0
              ? 'You skipped every question, so these are listed alphabetically.'
              : `Based on ${answered} of your answers. Open a species to check its key features.`}
          </Text>
          {results.map(({ snake, score }) => (
            <Pressable
              key={snake.id}
              style={({ pressed }) => [styles.result, pressed && styles.optionPressed]}
              onPress={() => router.push({ pathname: '/snake/[id]', params: { id: snake.id } })}
              accessibilityRole="button"
              accessibilityLabel={`${snake.name}, ${Math.round(score * 100)} percent match`}
            >
              <SnakeImage snake={snake} style={styles.resultImg} />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.resultName}>{snake.name}</Text>
                <VenomBadge level={snake.venomLevel} />
              </View>
              {answered > 0 && (
                <View style={styles.score}>
                  <Text style={styles.scoreValue}>{Math.round(score * 100)}%</Text>
                  <Text style={styles.scoreLabel}>match</Text>
                </View>
              )}
            </Pressable>
          ))}
          <View style={styles.resultActions}>
            <Button label="Start again" variant="secondary" icon="refresh" onPress={restart} style={{ flex: 1 }} />
            <Button label="First aid" variant="danger" icon="medkit-outline" onPress={() => router.navigate('/first-aid')} style={{ flex: 1 }} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (theme: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: space.lg, paddingBottom: 48, gap: space.lg, width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  safety: { flexDirection: 'row', gap: space.sm, backgroundColor: theme.dangerBackground, borderRadius: radius.md, padding: space.md },
  safetyText: { ...type.small, color: theme.text, flex: 1, fontWeight: '600' },
  progressRow: { flexDirection: 'row', gap: 6 },
  progress: { flex: 1, height: 5, borderRadius: 3, backgroundColor: theme.border },
  progressDone: { backgroundColor: colors.leaf },
  progressNow: { backgroundColor: colors.turmeric },
  stepBlock: { gap: space.md },
  stepCount: { ...type.small, color: theme.muted, fontWeight: '600' },
  question: { ...type.title, color: theme.text },
  options: { gap: space.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: theme.card,
    borderRadius: radius.md,
    padding: space.md,
    minHeight: 60,
  },
  optionPressed: { backgroundColor: theme.soft },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.soft, alignItems: 'center', justifyContent: 'center' },
  optionText: { ...type.bodyStrong, color: theme.text, flex: 1 },
  stepNav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  navLink: { fontSize: 15, fontWeight: '700', color: theme.text, paddingVertical: 6 },
  resultsNote: { ...type.small, color: theme.muted },
  result: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: theme.card, borderRadius: radius.md, padding: space.sm },
  resultImg: { width: 84, height: 60, borderRadius: radius.sm },
  resultName: { ...type.bodyStrong, color: theme.text },
  score: { alignItems: 'center', paddingHorizontal: space.sm },
  scoreValue: { fontSize: 18, fontWeight: '800', color: theme.text },
  scoreLabel: { ...type.caption, color: theme.muted },
  resultActions: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
});
