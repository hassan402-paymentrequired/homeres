import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import FormField from '@/components/admin/form-field';
import SearchableSelect from '@/components/admin/searchable-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    TEMPLATE_FIELD_TYPES,
    createEmptyField,
    type EditableTemplateField,
} from '@/types/product-template';

type Props = {
    title: string;
    description: string;
    fields: EditableTemplateField[];
    onChange: (fields: EditableTemplateField[]) => void;
    errors: Record<string, string>;
    namePrefix: 'spec_fields' | 'variant_options';
};

export default function TemplateFieldsEditor({
    title,
    description,
    fields,
    onChange,
    errors,
    namePrefix,
}: Props) {
    const updateField = (
        index: number,
        patch: Partial<EditableTemplateField>,
    ) => {
        onChange(
            fields.map((field, i) =>
                i === index ? { ...field, ...patch } : field,
            ),
        );
    };

    const removeField = (index: number) => {
        onChange(fields.filter((_, i) => i !== index));
    };

    const moveField = (index: number, direction: -1 | 1) => {
        const target = index + direction;

        if (target < 0 || target >= fields.length) {
            return;
        }

        const next = [...fields];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const addField = () => {
        onChange([...fields, createEmptyField()]);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

            {fields.length === 0 ? (
                <p className="rounded-lg border border-dashed border-sidebar-border/70 px-4 py-6 text-sm text-muted-foreground">
                    No fields yet. Add one to define how products in this
                    template are structured.
                </p>
            ) : (
                <div className="space-y-4">
                    {fields.map((field, index) => {
                        const showOptions = ['select', 'swatch'].includes(
                            field.type,
                        );

                        return (
                            <div
                                key={field.id}
                                className="rounded-lg border border-sidebar-border/70 bg-muted/10 p-4"
                            >
                                <input
                                    type="hidden"
                                    name={`${namePrefix}[${index}][key]`}
                                    value={field.key}
                                />
                                <input
                                    type="hidden"
                                    name={`${namePrefix}[${index}][type]`}
                                    value={field.type}
                                />
                                <input
                                    type="hidden"
                                    name={`${namePrefix}[${index}][required]`}
                                    value={field.required ? '1' : '0'}
                                />
                                {showOptions && (
                                    <input
                                        type="hidden"
                                        name={`${namePrefix}[${index}][options]`}
                                        value={field.options}
                                    />
                                )}

                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                        Field {index + 1}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            disabled={index === 0}
                                            onClick={() => moveField(index, -1)}
                                            aria-label="Move up"
                                        >
                                            <ChevronUp className="size-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            disabled={
                                                index === fields.length - 1
                                            }
                                            onClick={() => moveField(index, 1)}
                                            aria-label="Move down"
                                        >
                                            <ChevronDown className="size-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => removeField(index)}
                                            aria-label="Remove field"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        label="Label"
                                        htmlFor={`${namePrefix}_${index}_label`}
                                        error={
                                            errors[`${namePrefix}.${index}.label`]
                                        }
                                    >
                                        <Input
                                            id={`${namePrefix}_${index}_label`}
                                            name={`${namePrefix}[${index}][label]`}
                                            value={field.label}
                                            onChange={(event) =>
                                                updateField(index, {
                                                    label: event.target.value,
                                                })
                                            }
                                            placeholder="e.g. Dimensions"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Key"
                                        htmlFor={`${namePrefix}_${index}_key`}
                                        hint="Optional — auto-generated from label if empty."
                                        error={
                                            errors[`${namePrefix}.${index}.key`]
                                        }
                                    >
                                        <Input
                                            id={`${namePrefix}_${index}_key`}
                                            value={field.key}
                                            onChange={(event) =>
                                                updateField(index, {
                                                    key: event.target.value,
                                                })
                                            }
                                            placeholder="e.g. dimensions"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Type"
                                        htmlFor={`${namePrefix}_${index}_type`}
                                        error={
                                            errors[`${namePrefix}.${index}.type`]
                                        }
                                    >
                                        <SearchableSelect
                                            id={`${namePrefix}_${index}_type`}
                                            value={field.type}
                                            onValueChange={(value) =>
                                                updateField(index, {
                                                    type: value,
                                                })
                                            }
                                            placeholder="Select type…"
                                            searchPlaceholder="Search types…"
                                            options={[...TEMPLATE_FIELD_TYPES]}
                                        />
                                    </FormField>

                                    <div className="flex items-end pb-2">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id={`${namePrefix}_${index}_required`}
                                                checked={field.required}
                                                onCheckedChange={(checked) =>
                                                    updateField(index, {
                                                        required:
                                                            checked === true,
                                                    })
                                                }
                                            />
                                            <label
                                                htmlFor={`${namePrefix}_${index}_required`}
                                                className="text-sm font-medium leading-none"
                                            >
                                                Required
                                            </label>
                                        </div>
                                    </div>

                                    {showOptions && (
                                        <FormField
                                            label="Options"
                                            htmlFor={`${namePrefix}_${index}_options`}
                                            hint="One option per line."
                                            className="sm:col-span-2"
                                            error={
                                                errors[
                                                    `${namePrefix}.${index}.options`
                                                ]
                                            }
                                        >
                                            <Textarea
                                                id={`${namePrefix}_${index}_options`}
                                                value={field.options}
                                                onChange={(event) =>
                                                    updateField(index, {
                                                        options:
                                                            event.target.value,
                                                    })
                                                }
                                                rows={4}
                                                placeholder={'Small\nMedium\nLarge'}
                                            />
                                        </FormField>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Button type="button" variant="outline" onClick={addField}>
                <Plus className="size-4" />
                Add field
            </Button>
        </div>
    );
}
