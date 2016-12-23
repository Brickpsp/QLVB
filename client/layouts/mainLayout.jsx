import React from 'react';
import '/public/css/base.css';
import '/public/css/fonts.css';
import '/public/css/datetime.css';
import '/node_modules/react-mdl/extra/material.css';
import '/node_modules/react-mdl/extra/material.js';

DocHead.setTitle('Quản Lý Công Văn');
export const MainLayout = ({content}) => (  
  <div>  
   
     <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>   
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
     
        <div>{content}</div>         
    
 </div>
);