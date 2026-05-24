import type { ProductTemplateField, ProductTemplateRules } from '@/types/product';

export type ProductTemplateRecord = {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    spec_fields: ProductTemplateField[];
    variant_options: ProductTemplateField[];
    rules: ProductTemplateRules;
    is_system: boolean;
    created_at?: string | null;
    updated_at?: string | null;
};

export type ProductTemplateRow = ProductTemplateRecord & {
    categories_count: number;
    spec_fields_count: number;
    variant_options_count: number;
};

export type ProductTemplateBreadcrumb = {
    id: string;
    name: string;
    href: string;
};

export type ProductTemplateStats = {
    categories_count: number;
};

export type ProductTemplateCategorySummary = {
    id: string;
    name: string;
};

export const TEMPLATE_FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Long text' },
    { value: 'select', label: 'Select' },
    { value: 'swatch', label: 'Swatch / colour' },
    { value: 'boolean', label: 'Yes / no' },
] as const;

export const PRICING_MODE_OPTIONS = [
    { value: 'fixed', label: 'Fixed price' },
    { value: 'on_request', label: 'Price on request' },
] as const;

export const SPECS_LAYOUT_OPTIONS = [
    { value: 'single', label: 'Single column' },
    { value: 'two_column', label: 'Two columns' },
] as const;

export type EditableTemplateField = {
    id: string;
    key: string;
    label: string;
    type: string;
    required: boolean;
    options: string;
};

export function toEditableFields(
    fields: ProductTemplateField[],
): EditableTemplateField[] {
    return fields.map((field) => ({
        id: field.key,
        key: field.key,
        label: field.label,
        type: field.type,
        required: field.required ?? false,
        options: (field.options ?? []).join('\n'),
    }));
}

let emptyFieldCounter = 0;

export function createEmptyField(): EditableTemplateField {
    const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `field-${++emptyFieldCounter}`;

    return {
        id,
        key: '',
        label: '',
        type: 'text',
        required: false,
        options: '',
    };
}

export function toSubmitFields(fields: EditableTemplateField[]) {
    return fields
        .filter((field) => field.label.trim() !== '')
        .map((field) => ({
            key: field.key.trim(),
            label: field.label.trim(),
            type: field.type,
            required: field.required,
            options: field.options,
        }));
}
