import React, { FC, useCallback, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createUserImg } from 'src/api/auth';
import { Container, UpdateBtn, UserInfo, LogoutBtn, User, Locations, LocationCard, InputImg, SavedTitle, Divider } from './styles';
import HeaderWithLeftArrow from 'src/components/HeaderWithLeftArrow';
import { Path } from 'src/Constants';
import { useMeState, useMyLocationState } from 'src/atoms';
import { getMyLocation, deleteMyLocation, GetMyLocationResponse } from 'src/api/marker';
import Loading from 'src/components/Loading';
import useAlert from 'src/hooks/useAlert';
import NickNameUpdateModal from 'src/components/NicknameModal';

import mypage from 'src/assets/mypage/user-img.png';
import camera from 'src/assets/mypage/camera.png';
import edit from 'src/assets/mypage/nickname_edit.jpg';

const MyPage: FC = () => {
    const navigate = useNavigate();
    const client = useQueryClient();

    const { me, setMe } = useMeState();
    const { alert, confirm } = useAlert();
    const { setLocations } = useMyLocationState();

    const [nicknamePopup, setNicknamePopup] = useState(false);

    const { data: locations } = useQuery('getLocations', () => getMyLocation({ offset: 0, limit: 50 }), {
        onSuccess: response => {
            setLocations(response);
        }
    });
    const { mutate: deleteLocation } = useMutation(deleteMyLocation, {
        onMutate: ({ addressId }) => {
            setLocations(locations => {
                if (!locations) return;

                return locations.filter(location => {
                    return location.addressId !== addressId;
                });
            });
        }
    });

    const onClickLocation = useCallback(
        (addressId: number) => {
            navigate(`${Path.myPage}/${addressId}`);
        },
        [navigate]
    );

    const onDeleteClick = useCallback(
        async (addressId: number) => {
            const flag = await confirm('????????? ????????? ???????????????????');

            if (flag) {
                deleteLocation({ addressId });

                client.setQueryData<GetMyLocationResponse[] | undefined>('getLocations', data => {
                    return data?.filter(location => {
                        return location.addressId !== addressId;
                    });
                });
            }
        },
        [deleteLocation, client, confirm]
    );

    const onClickHome = useCallback(() => {
        navigate(Path.home);
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setMe(undefined);
        navigate(Path.login);
    }, [navigate, setMe]);

    const onChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const img = e.target.files?.[0];
            if (!img) return;

            if (img.size > 1024 * 1024 * 5) {
                await alert('???????????? ????????? 5MB??? ?????? ??? ????????????.');
            }

            const formData = new FormData();
            formData.append('file', img);

            const resultThumnail = await createUserImg({ file: formData });

            await alert('????????? ????????? ?????????????????????.');

            setMe(me => {
                if (!me) return;
                return { ...me, thumbnail: resultThumnail };
            });
        },
        [alert, setMe]
    );

    const updateNickname = useCallback(() => {
        setNicknamePopup(true);
    }, [setNicknamePopup]);

    const inputRef = useRef<HTMLInputElement>(null);

    const onClickFileInput = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const mypageHeaderStyle = {
        width: '100%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
        fontSize: '1.25rem'
    };

    return (
        <Container>
            <HeaderWithLeftArrow style={mypageHeaderStyle} onLeftArrowClick={() => onClickHome()}>
                ???????????????
                <LogoutBtn onClick={logout}>????????????</LogoutBtn>
            </HeaderWithLeftArrow>
            <UserInfo>
                <User>
                    <input ref={inputRef} accept='image/jpg,impge/png,image/jpeg,image/gif' className='profile_img' type='file' onChange={onChange} />
                    <InputImg>
                        <img className='mypage-img' src={me?.thumbnail || mypage} onClick={() => onClickFileInput()} />
                        <img className='upload-img' src={camera} onClick={() => onClickFileInput()} />
                    </InputImg>
                    <div className='user-txt'>{me?.nickname}</div>
                    <img src={edit} onClick={updateNickname} />
                </User>
            </UserInfo>
            <SavedTitle>????????? ??????</SavedTitle>
            <Divider />

            <Locations>
                {!locations && <Loading />}
                {locations?.map(({ id, name, address, roadAddress, addressId }) => (
                    <LocationCard key={id}>
                        <div style={{ display: 'flex', flexDirection: 'column' }} onClick={() => onClickLocation(addressId)}>
                            <div className='location-title'>{name}</div>
                            <div className='location-address'>{roadAddress}</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='jibun-label'>??????</div>
                                <div className='jibun-address'>{address}</div>
                            </div>
                        </div>
                        <UpdateBtn onClick={() => onDeleteClick(addressId)}>??????</UpdateBtn>
                    </LocationCard>
                ))}
            </Locations>
            {nicknamePopup && <NickNameUpdateModal setClose={() => setNicknamePopup(false)} />}
        </Container>
    );
};

export default MyPage;
