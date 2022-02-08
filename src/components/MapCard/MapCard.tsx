import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router';

import { Card, MapBtn, UpdateMap, CardText } from './styles';
import { Path } from 'src/Constants';
import share from 'src/assets/main/ic-share.svg';
import remove from 'src/assets/main/ic-remove.svg';

// import { deleteMap } from 'src/api/map';
interface MapCardProps {
    map: { id: number; mapName: string; isPrivate: boolean };
}

const MapCard: FC<MapCardProps> = ({ map }) => {
    const navigate = useNavigate();

    const [showTooltip, setShowTooltip] = useState(true);

    const onClickItem = () => {
        navigate(`${Path.myMap}/${map.id}`);
    };

    const openTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    const deleteItem = (mapId: number) => {
        console.log(mapId);
    };

    return (
        <Card>
            <CardText onClick={onClickItem}>
                <span className='map-title'>{map.mapName}</span>
                <span className='create-date'>{map.mapName}</span>
            </CardText>
            <UpdateMap active={showTooltip}>
                <div className='vertical-circle' onClick={openTooltip}>
                    <span className='see-more'>
                        <MapBtn style={{ borderRightWidth: '1px', borderRightColor: '#e8e8e8', borderRightStyle: 'solid' }}>
                            <img className='ic-share' src={share}></img>공유
                        </MapBtn>

                        <MapBtn onClick={() => deleteItem(map.id)}>
                            <img className='ic-remove' src={remove}></img>삭제
                        </MapBtn>
                    </span>
                </div>
            </UpdateMap>
        </Card>
    );
};

export default MapCard;
