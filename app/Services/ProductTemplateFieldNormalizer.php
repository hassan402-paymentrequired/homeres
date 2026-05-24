<?php

namespace App\Services;

use Illuminate\Support\Str;

class ProductTemplateFieldNormalizer
{
    /**
     * @param  array<int, array<string, mixed>>|null  $fields
     * @return array<int, array<string, mixed>>
     */
    public function normalize(?array $fields): array
    {
        if ($fields === null) {
            return [];
        }

        $normalized = [];
        $usedKeys = [];

        foreach (array_values($fields) as $position => $field) {
            if (! is_array($field)) {
                continue;
            }

            $label = trim((string) ($field['label'] ?? ''));

            if ($label === '') {
                continue;
            }

            $key = trim((string) ($field['key'] ?? ''));

            if ($key === '') {
                $key = Str::slug($label, '_') ?: 'field';
            }

            $key = $this->uniqueKey($key, $usedKeys);
            $usedKeys[] = $key;

            $type = (string) ($field['type'] ?? 'text');
            $entry = [
                'key' => $key,
                'label' => $label,
                'type' => $type,
                'required' => filter_var($field['required'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'position' => $position + 1,
            ];

            if (in_array($type, ['select', 'swatch'], true)) {
                $options = $this->normalizeOptions($field['options'] ?? null);

                if ($options !== []) {
                    $entry['options'] = $options;
                }
            }

            $normalized[] = $entry;
        }

        return $normalized;
    }

    /**
     * @return array<int, string>
     */
    private function normalizeOptions(mixed $options): array
    {
        if (is_string($options)) {
            $options = preg_split('/\r\n|\r|\n|,/', $options) ?: [];
        }

        if (! is_array($options)) {
            return [];
        }

        return collect($options)
            ->map(fn ($option): string => trim((string) $option))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @param  array<int, string>  $usedKeys
     */
    private function uniqueKey(string $key, array $usedKeys): string
    {
        $candidate = $key;
        $suffix = 2;

        while (in_array($candidate, $usedKeys, true)) {
            $candidate = $key.'_'.$suffix;
            $suffix++;
        }

        return $candidate;
    }
}
