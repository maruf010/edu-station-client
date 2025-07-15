import React from 'react';
import { CircleLoader, PulseLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div>
                <CircleLoader
                    margin={2}
                    size={50}
                    color="#FFA500"
                />
            </div>
        </div>
    );
};

export default Loading;