
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  OptionPicker,
  type Option,
} from '@/components/option-picker';
import { palette } from '@/constants/palette';
import { useLanguage } from '@/i18n/LanguageProvider';
import { sightingTranslations } from '@/data/sightingTranslations';
import { themeColors, useAppTheme } from '@/context/app-theme';
import type { Sighting } from '@/types/sighting';
import { displayObservationTime, displaySavedAt } from '@/utils/sighting-time';
import { districts, getSnake, snakes } from '@/utils/snakes';
import { loadSightings, saveSightings } from '@/utils/storage';

const UNKNOWN = 'unknown';
const MAX_IMAGE_LENGTH = 900000;

type FormMode = 'add' | 'edit' | 'repeat';

type FormErrors = {
  species?: string;
  district?: string;
  date?: string;
  observedTime?: string;
  photo?: string;
  save?: string;
};

function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
}

function currentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function validTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  const todayDate = new Date();
  todayDate.setHours(23, 59, 59, 999);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day &&
    parsed <= todayDate
  );
}

export default function AddSightingScreen() {
  const { colors } = useAppTheme();
  const { language } = useLanguage();
  const tr = sightingTranslations[language as keyof typeof sightingTranslations] ?? sightingTranslations.en;
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const params = useLocalSearchParams<{
    mode?: string;
    id?: string;
    snakeId?: string;
  }>();

  const mode: FormMode =
    params.mode === 'edit'
      ? 'edit'
      : params.mode === 'repeat'
        ? 'repeat'
        : 'add';

  const [loading, setLoading] = useState(
    mode !== 'add'
  );

  const [original, setOriginal] = useState<Sighting | null>(
    null
  );

  const [species, setSpecies] = useState<string | null>(
    getSnake(params.snakeId)?.id ?? null
  );

  const [district, setDistrict] = useState<string | null>(
    null
  );

  const [date, setDate] = useState(today());
  const [observedTime, setObservedTime] = useState(currentTime());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [localName, setLocalName] = useState('');
  const [description, setDescription] = useState('');

  const [photoUri, setPhotoUri] = useState<string | null>(
    null
  );

  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    let active = true;

    if (mode === 'add') {
      setLoading(false);
      return;
    }

    setLoading(true);

    loadSightings()
      .then((records) => {
        if (!active) return;

        const found = records.find(
          (item) => item.id === params.id
        );

        if (!found) {
          setErrors({
            save: tr.notFound,
          });
          return;
        }

        setOriginal(found);

        setSpecies(found.snakeId ?? UNKNOWN);
        setLocalName(found.localName ?? '');
        setDescription(found.description ?? '');
        setDistrict(found.district ?? null);
        setLocation(found.location ?? '');

        if (mode === 'edit') {
          setDate(found.date);
          setObservedTime(found.observedTime ?? currentTime());
          setNotes(found.notes ?? '');
          setPhotoUri(found.photoUri ?? null);
        } else {
          // Repeat means a new observation.
          setDate(today());
          setObservedTime(currentTime());
          setNotes('');
          setPhotoUri(null);
        }
      })
      .catch(() => {
        if (active) {
          setErrors({
            save: tr.loadError,
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, params.id, tr]);

  const speciesOptions: Option[] = useMemo(
    () =>
      snakes.map((snake) => ({
        key: snake.id,
        label: snake.name,
        sub: snake.scientificName,
      })),
    []
  );

  const districtOptions: Option[] = useMemo(
    () =>
      districts.map((item) => ({
        key: item.name,
        label: item.name,
        sub: `${item.province} ${tr.province}`,
      })),
    [tr.province]
  );

  const pickImage = async () => {
    if (saving || importing) return;

    setImporting(true);
    setErrors((previous) => ({
      ...previous,
      photo: undefined,
    }));

    try {
      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.25,
          base64: true,
        });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        setErrors((previous) => ({
          ...previous,
          photo: tr.readPhoto,
        }));
        return;
      }

      if (asset.base64.length > MAX_IMAGE_LENGTH) {
        setErrors((previous) => ({
          ...previous,
          photo:
            tr.largePhoto,
        }));
        return;
      }

      const mime =
        asset.mimeType?.startsWith('image/')
          ? asset.mimeType
          : 'image/jpeg';

      setPhotoUri(
        `data:${mime};base64,${asset.base64}`
      );
    } catch {
      setErrors((previous) => ({
        ...previous,
        photo: tr.importError,
      }));
    } finally {
      setImporting(false);
    }
  };

  const save = async () => {
    if (saving || importing || loading) return;

    if (mode !== 'add' && !original) {
      setErrors({
        save: tr.originalMissing,
      });
      return;
    }

    const next: FormErrors = {};

    if (!species) {
      next.species = tr.selectSpecies;
    }

    if (!district) {
      next.district = tr.selectDistrict;
    }

    if (!validDate(date.trim())) {
      next.date =
        tr.invalidDate;
    }

    if (!validTime(observedTime.trim())) {
      next.observedTime = tr.invalidTime;
    }

    if (validDate(date.trim()) && validTime(observedTime.trim())) {
      const [year, month, day] = date.trim().split('-').map(Number);
      const [hour, minute] = observedTime.trim().split(':').map(Number);
      if (new Date(year, month - 1, day, hour, minute).getTime() > Date.now()) {
        next.observedTime = tr.futureTime;
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setSaving(true);

    try {
      const snake =
        species === UNKNOWN
          ? undefined
          : getSnake(species ?? undefined);

      const records = await loadSightings();

      const record: Sighting = {
        id:
          mode === 'edit' && original
            ? original.id
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 9)}`,

        snakeId: snake?.id,
        snakeName: snake?.name ?? 'Unknown snake',
        district: district ?? undefined,
        date: date.trim(),
        observedTime: observedTime.trim(),
        savedAt: mode === 'edit' ? original?.savedAt : new Date().toISOString(),
        location: location.trim(),
        notes: notes.trim(),
        localName: species === UNKNOWN ? localName.trim() || undefined : undefined,
        description: species === UNKNOWN ? description.trim() || undefined : undefined,
        photoUri: photoUri ?? undefined,
      };

      if (mode === 'edit') {
        const exists = records.some(
          (item) => item.id === original?.id
        );

        if (!exists) {
          throw new Error('Original record not found');
        }

        await saveSightings(
          records.map((item) =>
            item.id === original?.id ? record : item
          )
        );
      } else {
        await saveSightings([record, ...records]);
      }

      router.replace('/sightings');
    } catch {
      setErrors({
        save:
          tr.saveError,
      });
    } finally {
      setSaving(false);
    }
  };

  const title =
    mode === 'edit'
      ? tr.editTitle
      : mode === 'repeat'
        ? tr.repeatTitle
        : tr.addTitle;

  const buttonText =
    mode === 'edit'
      ? tr.saveChanges
      : mode === 'repeat'
        ? tr.saveNew
        : tr.saveSighting;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.hint}>
          {tr.loading}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>{title}</Text>

      <Text style={styles.hint}>
        {mode === 'edit'
          ? tr.editHint
          : mode === 'repeat'
            ? tr.repeatHint
            : tr.addHint}
      </Text>

      {mode === 'repeat' && original && (
        <View style={styles.info}>
          <Text style={styles.infoText}>
            {tr.previous} {original.date}
          </Text>
          <Text style={styles.infoText}>
            {tr.separate}
          </Text>
        </View>
      )}

      <OptionPicker
        label={tr.species}
        placeholder={tr.searchSpecies}
        options={speciesOptions}
        extraOption={{
          key: UNKNOWN,
          label: tr.unknownOption,
        }}
        value={species}
        onChange={setSpecies}
        error={errors.species}
      />

      {species === UNKNOWN && (
        <View style={styles.field}>
          <Text style={styles.label}>{tr.localName}</Text>
          <TextInput
            style={styles.input}
            value={localName}
            onChangeText={setLocalName}
            placeholder={tr.localPlaceholder}
            placeholderTextColor={colors.muted}
            maxLength={100}
          />
          <Text style={styles.label}>{tr.appearance}</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder={tr.appearancePlaceholder}
            placeholderTextColor={colors.muted}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.hint}>
            {tr.unknownHint}
          </Text>
        </View>
      )}

      <OptionPicker
        label={tr.district}
        placeholder={tr.searchDistrict}
        options={districtOptions}
        value={district}
        onChange={setDistrict}
        error={errors.district}
      />

      <View style={styles.field}>
        <Text style={styles.label}>
          {tr.date}
        </Text>

        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          maxLength={10}
          keyboardType="numbers-and-punctuation"
        />

        {!!errors.date && (
          <Text style={styles.error}>
            {errors.date}
          </Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{tr.time}</Text>
        <TextInput
          style={styles.input}
          value={observedTime}
          onChangeText={setObservedTime}
          placeholder={tr.timePlaceholder}
          placeholderTextColor={colors.muted}
          maxLength={5}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.hint}>{tr.timeSeen} {displayObservationTime(observedTime)}</Text>
        {!!errors.observedTime && <Text style={styles.error}>{errors.observedTime}</Text>}
      </View>

      {mode === 'edit' && original && (
        <Text style={styles.hint}>{tr.originallySaved} {displaySavedAt(original.savedAt)}</Text>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>
          {tr.location}
        </Text>

        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder={tr.locationPlaceholder}
          placeholderTextColor={colors.muted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          {tr.behaviour}
        </Text>

        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder={tr.behaviourPlaceholder}
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.photoSection}>
        <Text style={styles.label}>
          {tr.picture}
        </Text>

        <Pressable
          style={styles.photoButton}
          onPress={pickImage}
          disabled={saving || importing}
        >
          <Text style={styles.photoButtonText}>
            {importing
              ? tr.importing
              : photoUri
                ? tr.changePicture
                : tr.importPicture}
          </Text>
        </Pressable>

        {photoUri && (
          <View style={styles.previewArea}>
            <Image
              source={{ uri: photoUri }}
              style={styles.preview}
              resizeMode="contain"
            />

            <Pressable
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.removeText}>
                {tr.removePicture}
              </Text>
            </Pressable>
          </View>
        )}

        {!!errors.photo && (
          <Text style={styles.error}>
            {errors.photo}
          </Text>
        )}
      </View>

      {!!errors.save && (
        <Text style={styles.error}>
          {errors.save}
        </Text>
      )}

      <Pressable
        style={[
          styles.saveButton,
          (saving || importing) && styles.disabled,
        ]}
        onPress={save}
        disabled={saving || importing}
      >
        <Text style={styles.saveText}>
          {saving ? tr.saving : buttonText}
        </Text>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => router.replace('/sightings')}
      >
        <Text style={styles.cancelText}>
          {tr.cancel}
        </Text>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          {tr.warning}
        </Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: typeof themeColors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  content: {
    padding: 16,
    paddingBottom: 45,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: c.primary,
  },
  hint: {
    fontSize: 14,
    color: c.muted,
    lineHeight: 22,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: c.primary,
  },
  input: {
    backgroundColor: c.card,
    borderColor: c.border,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: c.text,
  },
  multiline: {
    minHeight: 95,
    paddingTop: 12,
  },
  error: {
    color: palette.highly,
    fontSize: 14,
  },
  photoSection: {
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  photoButton: {
    backgroundColor: c.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  photoButtonText: {
    color: c.white,
    fontWeight: '700',
    fontSize: 15,
  },
  previewArea: {
    gap: 10,
  },
  preview: {
    width: '100%',
    height: 230,
    borderRadius: 12,
    backgroundColor: c.background,
  },
  removeText: {
    textAlign: 'center',
    color: palette.highly,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: c.primary,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  saveText: {
    color: c.white,
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: c.border,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: c.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  info: {
    backgroundColor: c.card,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    gap: 5,
  },
  infoText: {
    color: c.muted,
    lineHeight: 21,
    fontSize: 13,
  },
});
