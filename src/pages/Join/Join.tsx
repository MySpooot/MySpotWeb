import React, { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { Container } from './styles';
import { updateUserNickname } from '@src/api/auth';
import { Path } from '@src/Constants';
import { meState } from '@src/atom';

const Join: FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [me, setMe] = useRecoilState(meState);

    const [nickname, setNickname] = useState('');

    useEffect(() => {
        if (me) {
            navigate(Path.home);
        }

        if (!state.id || !state.nickname) {
            navigate(Path.login);
        }

        setNickname(state.nickname);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onJoinClick = useCallback(() => {
        console.log('onJoinClick');

        if (!nickname) return;

        updateUserNickname(state.id, nickname).then(me => {
            localStorage.setItem('token', me.token);
            setMe(me);
            navigate(Path.home);
        });
    }, [nickname, setMe, navigate, state.id]);

    const onCancelClick = useCallback(() => {
        console.log('onCancelClick');
    }, []);

    const onNicknameChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setNickname(evt.target.value);
    }, []);

    return (
        <Container>
            <h3>JOIN</h3>
            <h5>닉네임을 입력하고 회원가입을 완료하세요</h5>
            <div>
                <input placeholder='닉네임을 입력해보세요' type='text' value={nickname} onChange={onNicknameChange} />
                <button onClick={onJoinClick}>회원가입</button>
                <button onClick={onCancelClick}>취소</button>
            </div>
        </Container>
    );
};

export default Join;
