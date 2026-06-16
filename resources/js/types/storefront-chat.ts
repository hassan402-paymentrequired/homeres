import type { StorefrontProduct } from '@/types/storefront-product';

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    products?: StorefrontProduct[];
};
