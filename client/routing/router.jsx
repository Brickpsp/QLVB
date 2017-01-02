import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from '/client/layouts/mainLayout.jsx';
import Main from '/client/views/main.jsx';
FlowRouter.route("/", {
  action() {
    mount(MainLayout, {
      content:
      <Main />
    });
  } 
});

FlowRouter.route('/file/:filename', {
    action(params, queryParams) {       
        window.open('/file/' + params.filename);
        FlowRouter.redirect('/');        
    },    
});

