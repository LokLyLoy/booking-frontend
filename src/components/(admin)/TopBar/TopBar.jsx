import React from 'react';
import Image from "next/image";

const TopBar = () => {
    return (
        <div>
            <div>
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    width="50"
                    height="50"
                />
            </div>
        </div>
    );
};

export default TopBar;