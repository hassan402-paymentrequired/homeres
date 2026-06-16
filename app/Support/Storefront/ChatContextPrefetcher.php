<?php

namespace App\Support\Storefront;

final class ChatContextPrefetcher
{
    /**
     * @param  list<array{role: string, content: string}>  $messages
     */
    public function build(array $messages): ?string
    {
        $lastUserMessage = collect($messages)
            ->where('role', 'user')
            ->pluck('content')
            ->last();

        if (! is_string($lastUserMessage) || trim($lastUserMessage) === '') {
            return null;
        }

        $helpTopic = $this->detectHelpTopic($lastUserMessage);

        if ($helpTopic !== null) {
            $content = ChatHelpKnowledge::forTopic($helpTopic);

            if ($content !== null) {
                return "Use the following official Homère information to answer the customer. Speak naturally as a boutique assistant. Never mention tools, functions, APIs, or how you retrieved this:\n\n{$content}";
            }
        }

        if ($this->isCapabilityQuestion($lastUserMessage)) {
            return <<<'TEXT'
The customer is asking what you can help with. Answer warmly as a Homère boutique assistant. You can help with:
- Finding products (furniture, lighting, decor, fragrances, accessories)
- Shipping and delivery across Nigeria
- Returns and refunds
- Store location and contact details
- About Homère and our services
Never mention tools, functions, databases, or internal systems.
TEXT;
        }

        return null;
    }

    private function detectHelpTopic(string $message): ?string
    {
        $lower = strtolower($message);

        $topicKeywords = [
            'shipping' => ['shipping', 'delivery', 'deliver', 'ship my order', 'how long'],
            'returns' => ['return', 'refund', 'exchange'],
            'terms' => ['terms and conditions', 'terms of service', 'legal terms'],
            'privacy' => ['privacy', 'personal data', 'my data'],
            'about' => ['about homère', 'about homere', 'who are you', 'your story', 'your mission'],
            'contact' => ['contact', 'email address', 'phone number', 'call you', 'reach you'],
            'store' => ['how to shop', 'how does checkout', 'wishlist work', 'browse the site'],
            'faq' => ['faq', 'frequently asked'],
        ];

        foreach ($topicKeywords as $topic => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($lower, $keyword)) {
                    return $topic;
                }
            }
        }

        return null;
    }

    private function isCapabilityQuestion(string $message): bool
    {
        return (bool) preg_match(
            '/what (can|do) you (help|know|assist)|how can you help|what (topics|information) (can|do)|what are you able/i',
            strtolower($message),
        );
    }
}
