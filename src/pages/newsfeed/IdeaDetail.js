import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/newsfeed/Sidebar';
import Detail from '../../components/newsfeed/Detail';
import Widget from '../../components/newsfeed/Widget';

function IdeaDetail() {

    const {ideaId} = useParams();

    return (
        <div className='bg-white min-h-screen flex max-w-[1500px] mx-auto'>
            <Sidebar/>
            <Detail
                id={ideaId}
            />
            <Widget/>
        </div>
    );
}

export default IdeaDetail;
