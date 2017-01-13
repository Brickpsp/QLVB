import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '/client/layouts/mainLayout.jsx';
import Main from '/client/views/main.jsx';
import Page1 from '../views/page1.jsx';
import Page2 from '../views/page2.jsx';
FlowRouter.route("/", {
  action() {
    mount(MainLayout, {
      content:
      <Main />
    });
  } 
});

FlowRouter.route("/vbden", {
  action() {
    mount(MainLayout, {
      content:
      <Page1 />
    });
  } 
});


FlowRouter.route("/vbdi", {
  action() {
    mount(MainLayout, {
      content:
      <Page2 />
    });
  } 
});


FlowRouter.route('/file/:filename', {
    action(params, queryParams) {       
        window.open('/file/' + params.filename);
        FlowRouter.redirect('/');        
    },    
});

