import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatProductCard from '@/components/storefront/chat/chat-product-card';
import { sendChatMessages } from '@/lib/storefront-chat';
import type { ChatMessage } from '@/types/storefront-chat';

const WELCOME: ChatMessage = {
    role: 'assistant',
    content:
        'Hello — I am the Homère assistant. Ask me about products, shipping, returns, or our showroom and I will help you find what you need.',
};

export default function ChatWidget() {
    const { aiChatEnabled } = usePage<{ aiChatEnabled: boolean }>().props;
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback(() => {
        const list = listRef.current;

        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (open) {
            scrollToBottom();
            inputRef.current?.focus();
        }
    }, [open, messages, loading, scrollToBottom]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const sendMessage = async () => {
        const text = input.trim();

        if (!text || loading) {
            return;
        }

        setError(null);
        setInput('');

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: 'user', content: text },
        ];

        setMessages(nextMessages);
        setLoading(true);

        try {
            const result = await sendChatMessages(nextMessages);

            if (!result.ok) {
                setError(result.message);

                return;
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: result.reply,
                    products:
                        result.products.length > 0
                            ? result.products
                            : undefined,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        void sendMessage();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            void sendMessage();
        }
    };

    if (!aiChatEnabled) {
        return null;
    }

    return (
        <>
            {open && (
                <div
                    role="dialog"
                    aria-label="Homère shopping assistant"
                    style={{
                        position: 'fixed',
                        bottom: '88px',
                        right: '20px',
                        width: 'min(400px, calc(100vw - 32px))',
                        height: 'min(560px, calc(100vh - 120px))',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 9500,
                        overflow: 'hidden',
                        border: '1px solid #ececec',
                    }}
                >
                    <header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 18px',
                            borderBottom: '1px solid #eee',
                            background: '#060606',
                            color: '#fff',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Homère Assistant
                            </p>
                            <p
                                style={{
                                    margin: '4px 0 0',
                                    fontSize: '10px',
                                    fontWeight: 300,
                                    opacity: 0.75,
                                }}
                            >
                                Product search & help
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: '20px',
                                lineHeight: 1,
                                cursor: 'pointer',
                                padding: '4px',
                            }}
                        >
                            ×
                        </button>
                    </header>

                    <div
                        ref={listRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        {messages.map((message, index) => {
                            const isUser = message.role === 'user';

                            return (
                                <div
                                    key={`${message.role}-${index}`}
                                    style={{
                                        alignSelf: isUser
                                            ? 'flex-end'
                                            : 'flex-start',
                                        maxWidth: '92%',
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '10px 14px',
                                            borderRadius: isUser
                                                ? '14px 14px 4px 14px'
                                                : '14px 14px 14px 4px',
                                            background: isUser
                                                ? '#060606'
                                                : '#f5f5f3',
                                            color: isUser ? '#fff' : '#060606',
                                            fontSize: '12px',
                                            lineHeight: 1.55,
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {message.content}
                                    </div>
                                    {message.products &&
                                        message.products.length > 0 && (
                                            <div
                                                style={{
                                                    marginTop: '10px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                }}
                                            >
                                                {message.products.map(
                                                    (product) => (
                                                        <ChatProductCard
                                                            key={product.id}
                                                            product={product}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                        {loading && (
                            <div
                                style={{
                                    alignSelf: 'flex-start',
                                    padding: '10px 14px',
                                    borderRadius: '14px 14px 14px 4px',
                                    background: '#f5f5f3',
                                    fontSize: '12px',
                                    color: '#666',
                                }}
                            >
                                Thinking…
                            </div>
                        )}
                    </div>

                    {error && (
                        <p
                            style={{
                                margin: '0 16px 8px',
                                fontSize: '11px',
                                color: '#b42318',
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: '12px 16px 16px',
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-end',
                        }}
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about products or policies…"
                            rows={2}
                            disabled={loading}
                            style={{
                                flex: 1,
                                resize: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '12px',
                                lineHeight: 1.4,
                                outline: 'none',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '10px',
                                fontWeight: 500,
                                letterSpacing: '1.2px',
                                textTransform: 'uppercase',
                                padding: '12px 14px',
                                border: 'none',
                                borderRadius: '10px',
                                cursor:
                                    loading || !input.trim()
                                        ? 'not-allowed'
                                        : 'pointer',
                                background:
                                    loading || !input.trim()
                                        ? '#ccc'
                                        : '#060606',
                                color: '#fff',
                                flexShrink: 0,
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label={open ? 'Close chat' : 'Open chat assistant'}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#060606',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
                    zIndex: 9500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                }}
            >
                {open ? '×' : '✦'}
            </button>
        </>
    );
}
