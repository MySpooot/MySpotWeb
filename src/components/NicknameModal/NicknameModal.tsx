import React, { FC, useState, useCallback } from 'react';

import { Container, Title, BtnArea } from './styles';
import { updateUserNicknameMypage } from 'src/api/auth';
import { useMeState } from 'src/atoms';
import Modal from 'src/components/Modal';
import Button from 'src/components/Button';
import Input from 'src/components/Input';

interface NicknameProps {
    setClose: () => void;
}
const NicknameModal: FC<NicknameProps> = ({ setClose }) => {
    const { setMe } = useMeState();
    const [inputValue, setInputValue] = useState('');

    const saveNickname = useCallback(
        async (value: string) => {
            const me = await updateUserNicknameMypage({ nickname: value });

            setMe(me);
            setClose();
        },
        [setClose, setMe]
    );

    return (
        <Modal>
            <Container>
                <Title>닉네임</Title>
                <Input
                    maxLength={30}
                    style={{ margin: '1.25rem' }}
                    value={inputValue}
                    autoFocus
                    onChange={event => setInputValue(event.target.value)}
                />
                <BtnArea>
                    <Button className='btn-half' popup onClick={setClose}>
                        닫기
                    </Button>
                    <Button className='btn-half' type='primary' popup onClick={() => saveNickname(inputValue)}>
                        저장하기
                    </Button>
                </BtnArea>
            </Container>
        </Modal>
    );
};

export default NicknameModal;
