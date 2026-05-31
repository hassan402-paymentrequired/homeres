export const storefrontInputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.5px',
    color: '#060606',
    background: '#ffffff',
    border: '1px solid #d0d0cc',
    padding: '13px 14px',
    outline: 'none',
    boxSizing: 'border-box',
};

export const storefrontTextareaStyle: React.CSSProperties = {
    ...storefrontInputStyle,
    minHeight: '112px',
    resize: 'vertical',
};

export const storefrontHintStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 300,
    color: '#6b6b6b',
    margin: '6px 0 0',
    letterSpacing: '0.3px',
    lineHeight: 1.6,
};

export const storefrontLabelStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#060606',
    display: 'block',
    marginBottom: '6px',
};

export const storefrontSectionTitleStyle: React.CSSProperties = {
    fontFamily: '"Proza Libre", sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    color: '#060606',
    margin: '0 0 8px',
    letterSpacing: '0.02em',
};

export const storefrontSectionDescriptionStyle: React.CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 300,
    color: '#6b6b6b',
    margin: '0 0 24px',
    letterSpacing: '0.3px',
    lineHeight: 1.6,
};

export const storefrontErrorStyle: React.CSSProperties = {
    color: '#b42318',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    marginTop: '6px',
};

export function storefrontPrimaryButtonStyle(
    processing = false,
    fullWidth = true,
): React.CSSProperties {
    return {
        width: fullWidth ? '100%' : 'auto',
        background: processing ? '#6b6b6b' : '#060606',
        color: '#ffffff',
        border: 'none',
        padding: '16px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        cursor: processing ? 'wait' : 'pointer',
        boxSizing: 'border-box',
    };
}

export function storefrontDestructiveButtonStyle(
    processing = false,
): React.CSSProperties {
    return {
        background: processing ? '#c97a7a' : '#b42318',
        color: '#ffffff',
        border: 'none',
        padding: '14px 20px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: processing ? 'wait' : 'pointer',
    };
}

export const storefrontSecondaryButtonStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    color: '#060606',
    border: '1px solid #d0d0cc',
    padding: '16px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxSizing: 'border-box',
};
