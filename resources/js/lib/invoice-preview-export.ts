import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function stripBackdropFilters(root: HTMLElement): void {
    const walk = (node: Element): void => {
        if (node instanceof HTMLElement) {
            node.style.setProperty('backdrop-filter', 'none', 'important');
            node.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
        }

        for (const child of node.children) {
            walk(child);
        }
    };

    walk(root);
}

function captureScaleForElement(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const logicalW = Math.max(1, rect.width);
    const logicalH = Math.max(1, rect.height);
    const maxEdge = 4096;

    return Math.min(2, maxEdge / logicalW, maxEdge / logicalH);
}

function sanitizeFilenameBase(raw: string): string {
    const trimmed = raw.replace(/[/\\?%*:|"<>]/g, '-').trim();

    return trimmed.slice(0, 120) || 'invoice';
}

function pxToMm(px: number): number {
    return (px * 25.4) / 96;
}

export async function exportInvoicePreviewNode(
    element: HTMLElement,
    opts: {
        filenameBase: string;
        format: 'png' | 'pdf';
    },
): Promise<void> {
    const scale = captureScaleForElement(element);

    const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: false,
        onclone: (_clonedDoc, clonedElement) => {
            stripBackdropFilters(clonedElement);
            clonedElement.style.backgroundColor = '#ffffff';
        },
    });

    if (canvas.width < 1 || canvas.height < 1) {
        throw new Error('Capture produced an empty image.');
    }

    const base = sanitizeFilenameBase(opts.filenameBase);

    if (opts.format === 'png') {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `${base}.png`;
        a.rel = 'noopener';
        document.body.append(a);
        a.click();
        a.remove();

        return;
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const wMm = pxToMm(canvas.width);
    const hMm = pxToMm(canvas.height);

    if (!Number.isFinite(wMm) || !Number.isFinite(hMm) || wMm <= 0 || hMm <= 0) {
        throw new Error('Invalid page size for PDF.');
    }

    const pdf = new jsPDF({
        orientation: wMm >= hMm ? 'l' : 'p',
        unit: 'mm',
        format: [wMm, hMm],
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, wMm, hMm, undefined, 'FAST');
    pdf.save(`${base}.pdf`);
}

export function pickFirstVisibleElement(
    ...candidates: readonly (HTMLElement | null | undefined)[]
): HTMLElement | null {
    for (const el of candidates) {
        if (!el) {
            continue;
        }

        const { width, height } = el.getBoundingClientRect();

        if (width >= 1 && height >= 1) {
            return el;
        }
    }

    for (const el of candidates) {
        if (el) {
            return el;
        }
    }

    return null;
}
