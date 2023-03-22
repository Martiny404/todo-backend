import { SortMethod, SortType } from '../types/search-params.interface';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10);

  if (Number.isNaN(newValue)) {
    newValue = opts.default;
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min;
    }

    if (newValue > opts.max) {
      newValue = opts.max;
    }
  }

  return newValue;
}

export function toSortType(value: SortType) {
  if (Object.values(SortType).includes(value)) {
    return value;
  }
  return SortType.DATE;
}

export function toSortMethod(value: SortMethod) {
  if (Object.values(SortMethod).includes(value)) {
    return value;
  }
  return SortMethod.ASC;
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}
