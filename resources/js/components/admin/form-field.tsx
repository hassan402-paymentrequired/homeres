import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    htmlFor: string;
    hint?: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
};

export default function FormField({
    label,
    htmlFor,
    hint,
    error,
    className,
    children,
}: Props) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                    {hint}
                </p>
            ) : null}
            <InputError message={error} />
        </div>
    );
}

export function FormSection({
    title,
    description,
    children,
    className,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn('space-y-4', className)}>
            <div>
                {title ? <h2 className="text-sm font-medium tracking-wide">{title}</h2> : null}
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{children}</div>
        </section>
    );
}

export const formSpanTwo = 'lg:col-span-2';
