import React from 'react'
import freedomLogo from "/freedomLogo.svg";
import CallIcon from '@mui/icons-material/Call';

const Header = () => {
    return (<>
        <div className='text-white flex md:justify-around justify-between items-center bg-black md:px-6 pr-4 md:py-6 py-4'>
            <span><img src={freedomLogo} alt="freedomLogo" width={244} height={51} className='md:h-auto h-10' /></span>

            <a href="tel:+18669447778"tel='866 944 7778' className='cursor-pointer flex justify-center items-center gap-3 py-2 px-3 rounded-lg md:border-[#D9D9D9]'>
                <span className='rounded-full px-2 py-1.5 bg-blue-400'> <CallIcon fontSize='small'/> </span>
                <span className='font-semibold font-sora md:block hidden'>(+1) 866 944 7778</span>
            </a>

        </div>
    </>
    )
}

export default Header;