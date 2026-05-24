import FormField from '@/components/admin/form-field';
import SearchableSelect from '@/components/admin/searchable-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { ProductTemplateField } from '@/types/product';

type Props = {
    options: ProductTemplateField[];
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
    errors: Record<string, string>;
};

export function buildVariantName(
    options: ProductTemplateField[],
    values: Record<string, string>,
): string {
    const parts = [...options]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((option) => {
            const value = (values[option.key] ?? '').trim();

            if (!value) {
                return null;
            }

            if (option.type === 'boolean') {
                return value === '1' || value.toLowerCase() === 'yes'
                    ? option.label
                    : null;
            }

            return value;
        })
        .filter(Boolean);

    return parts.length > 0 ? parts.join(' / ') : '';
}

export default function VariantOptionFields({
    options,
    values,
    onChange,
    errors,
}: Props) {
    const sorted = [...options].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    return (
        <>
            {sorted.map((option) => {
                const fieldId = `option_values_${option.key}`;
                const error = errors[`option_values.${option.key}`];
                const value = values[option.key] ?? '';

                if (option.type === 'boolean') {
                    const checked = value === '1' || value.toLowerCase() === 'yes';

                    return (
                        <div
                            key={option.key}
                            className="flex items-start gap-3 rounded-lg border border-sidebar-border/60 bg-muted/20 px-4 py-3"
                        >
                            <input
                                type="hidden"
                                name={`option_values[${option.key}]`}
                                value={checked ? '1' : '0'}
                            />
                            <Checkbox
                                id={fieldId}
                                checked={checked}
                                onCheckedChange={(next) =>
                                    onChange(option.key, next === true ? '1' : '0')
                                }
                            />
                            <div className="grid gap-1">
                                <label
                                    htmlFor={fieldId}
                                    className="text-sm font-medium leading-none"
                                >
                                    {option.label}
                                    {option.required ? ' *' : ''}
                                </label>
                                {error && (
                                    <p className="text-xs text-destructive">{error}</p>
                                )}
                            </div>
                        </div>
                    );
                }

                if (
                    (option.type === 'select' || option.type === 'swatch') &&
                    option.options &&
                    option.options.length > 0
                ) {
                    return (
                        <FormField
                            key={option.key}
                            label={`${option.label}${option.required ? ' *' : ''}`}
                            htmlFor={fieldId}
                            error={error}
                        >
                            <input
                                type="hidden"
                                name={`option_values[${option.key}]`}
                                value={value}
                            />
                            <SearchableSelect
                                id={fieldId}
                                value={value}
                                onValueChange={(next) => onChange(option.key, next)}
                                placeholder={`Select ${option.label.toLowerCase()}…`}
                                searchPlaceholder={`Search ${option.label.toLowerCase()}…`}
                                options={option.options.map((entry) => ({
                                    value: entry,
                                    label: entry,
                                }))}
                            />
                        </FormField>
                    );
                }

                return (
                    <FormField
                        key={option.key}
                        label={`${option.label}${option.required ? ' *' : ''}`}
                        htmlFor={fieldId}
                        error={error}
                    >
                        <Input
                            id={fieldId}
                            name={`option_values[${option.key}]`}
                            value={value}
                            onChange={(event) =>
                                onChange(option.key, event.target.value)
                            }
                            placeholder={`Enter ${option.label.toLowerCase()}`}
                            required={option.required}
                        />
                    </FormField>
                );
            })}
        </>
    );
}
