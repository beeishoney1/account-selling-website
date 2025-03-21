import React from 'react';
import './style/MainPage.css'; // Import custom CSS for styling
import productImage from '../Img/main1.jpg'; // Import the image

const MainPage = () => {
    return (
        <div className="main-page-container">
            <h1 className="main-page-title">Welcome to PlantXBlox</h1>
            <div className="main-page-content">
                <img src={productImage} alt="Product" className="main-page-image" />
                <div className="main-page-details">
                    <p className="main-page-text">BloxFruit Main ( OnStock ✅) <br/> <br/>

                            Darkblade V3 + New Ft + 12Perms <br/> <br/>

                            Gamepass - All Gamepass (+2) <br/> <br/>

                            Perm - Dragon / Dough / Sipirt / Rumble / Portal / Buddha / Ice / Dark / Bomn / Blade <br/> <br/>

                            V4 - Shark Cybrog Mink (T10) <br/> <br/>

                            Summon SB / Bounty - 26M <br/> <br/>

                            Gm (Rc Safe 100%)

                            </p> 
                    <p className="main-page-price">Price: 260,000 MMK</p>
                    <a className="main-page-button" href="https://t.me/UzuiTengen0" target="_blank" rel="noopener noreferrer">Buy Now</a> <p>Telegram - @UzuiTengen0</p>
                </div>
            </div>
        </div>
    );
};

export default MainPage;