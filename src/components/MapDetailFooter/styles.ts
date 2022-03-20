import styled from '@emotion/styled';

import { Color } from 'src/Constants';
import Icon from 'src/components/Icon';

export const Container = styled.footer`
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    padding-top: 0.625rem;
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.1);
`;

export const Top = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid ${Color.grey[200]};
`;

export const LikeArea = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    .count {
        margin-left: 0.25rem;
        color: ${Color.grey[600]};
        font-size: 0.5rem;
    }
`;

export const LikeIcon = styled(Icon)`
    width: 1.25rem;
    height: 1.25rem;
`;

export const BookmarkIcon = styled(Icon)`
    width: 1.25rem;
    height: 1.25rem;
    margin-left: 1.25rem;
    cursor: pointer;
`;

export const Bottom = styled.div`
    display: flex;
    padding: 0.625rem 1rem 1.25rem;
`;

export const BackIcon = styled(Icon)`
    width: 2.25rem;
    height: 2.25rem;
`;
