import styled from '@emotion/styled';
import React, { FC, InputHTMLAttributes, useEffect } from 'react';

import { Color } from 'src/Constants';
import useKeyPress from 'src/hooks/useKeyPress';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    fullWidth?: boolean;
    onEnterPress?: () => void;
    autoFocus?: boolean;
}

const Input: FC<InputProps> = ({ fullWidth = true, onEnterPress, autoFocus, style, children, ...props }) => {
    const { keyPressRef } = useKeyPress<HTMLInputElement>('Enter', () => onEnterPress?.(), { runOnlyFocusedElement: true });

    useEffect(() => {
        if (!autoFocus || !keyPressRef.current) return;

        keyPressRef.current.focus();
    }, [autoFocus, keyPressRef]);

    return (
        <Container fullWidth={fullWidth} style={style} onClick={() => keyPressRef.current?.focus()}>
            <InputBox ref={keyPressRef} {...props} />
            {children}
        </Container>
    );
};

const Container = styled.div<{ fullWidth: boolean }>`
    display: flex;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    height: 3.75rem;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${Color.grey[300]};
    border-radius: 0.25rem;
    cursor: text;
`;

const InputBox = styled.input`
    width: 100%;
    border: none;
    outline: none;

    &::placeholder {
        color: ${Color.grey[400]};
    }
`;

export default Input;
