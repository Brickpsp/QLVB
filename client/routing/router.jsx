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

