import { computed, ComputedRef, WritableComputedRef } from 'vue';

type UseLocalizedDateFormatter = {
  longDateTimeFormatter: ComputedRef<Intl.DateTimeFormat>,
  longDateFormatter: ComputedRef<Intl.DateTimeFormat>,
  shortTimeFormatter: ComputedRef<Intl.DateTimeFormat>
};

export default function useLocalizedDateFormatters(locale: WritableComputedRef<string>): UseLocalizedDateFormatter {
  const longDateTimeFormatter = computed(() =>
    new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'long',
      timeStyle: 'short',
    }));

  const longDateFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }));

  const shortTimeFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { timeStyle: 'short' }));

  return {
    longDateTimeFormatter,
    longDateFormatter,
    shortTimeFormatter,
  };
}
