import styled from '@emotion/styled';

import { Color } from 'src/Constants';
import Icon from 'src/components/Icon';

export const Container = styled.button<{ up: boolean }>`
    display: flex;
    width: 8.5rem;
    height: 3rem;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1.25rem;
    border: 1px solid ${Color.grey[200]};
    margin-bottom: ${({ up }) => (up ? '0.75rem' : '1.75rem')};
    background-color: ${Color.white};
    border-radius: 2.75rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
`;

export const ButtonText = styled.div`
    font-size: 1.125rem;
    font-weight: 400;
`;

export const ListIcon = styled(Icon)`
    width: 1.375rem;
    height: 1.375rem;
`;
