import React from 'react';
import '/public/css/base.css';
import '/public/css/fonts.css';
import '/public/css/datetime.css';
import '/node_modules/react-mdl/extra/material.css';
import '/node_modules/react-mdl/extra/material.js';
import 'react-date-picker/index.css'
data = new Mongo.Collection('data');
data2 = new Mongo.Collection('data2');

// <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
//<meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
DocHead.addMeta({name: "viewport", content: "width=device-width, initial-scale=1"});
DocHead.setTitle('Quản Lý Công Văn');
export const MainLayout = ({content}) => (  
  <div>         
            
        <div>{content}</div>             
 </div>
);