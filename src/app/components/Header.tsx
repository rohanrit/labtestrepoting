'use client';

import React, {useState} from 'react';
import './header.css';
import Nav from './Nav';
import Sci from './Sci';

export const Header = () => {
  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
            {/* <img src="" alt="" /> */}
            <h1>Digital Lab</h1>
            </a>
            <Nav/>
            <div className="position-relative">
                <Sci/>
            </div>
        </div>
    </header>
  )
}
