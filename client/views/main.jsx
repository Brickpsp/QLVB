import React, { Component } from 'react';

var ReactDom = require('react-dom');

import { Layout, Header, Content, Icon, Button, FABButton, List, ListItem } from 'react-mdl';


export default class Main extends React.Component {
    constructor(props) {
        super();
        this.state = {
            ip: false,
            choosepage: 0
        }

    }

    getip() {
        if (!this.state.form)
            this.setState({ ip: !this.state.ip });
    }

    componentDidMount() {
        Meteor.call("getip", (error, result) => {
            if (error) {
                console.log(error)
            }
            else {

                this.setState({ ip_addr: result });
            }

        })
    }

    choosepage(page) {
        if (page == 1) {            
            FlowRouter.go("/vbden");
        }
        if (page == 2) {
            FlowRouter.go("/vbdi");
        }
    }

    returnHomePage() {
        this.setState({ choosepage: 0 });
    }

    render() {

        return (
            <div>
                <Layout fixedHeader>
                    <Header style={{ background: "rgb(63,81,181)" }} title={<span style={{ fontSize: 32 }}>Quản Lý Văn Bản v1.0</span>} scroll >
                    </Header>
                    <Content>
                        {
                            this.state.ip ?
                                <div style={{ background: 'floralwhite', position: "absolute", bottom: "60px", left: "60px" }}>
                                    <List>
                                        {
                                            this.state.ip_addr.map(function (ip) {
                                                return <ListItem key={ip} style={{ color: 'black' }}>IP: {ip}</ListItem>
                                            })

                                        }
                                        <ListItem>Email : thhoang99@gmail.com</ListItem>

                                    </List>


                                </div>
                                :
                                <div />
                        }

                        <Button accent ripple className="page" style={{ fontWeight: "normal", height: "500px", position: "absolute" }} onClick={this.choosepage.bind(this, 1)}>
                            <Icon name="archive" style={{ fontSize: "120px", color: "forestgreen" }} />
                            <a>Văn Bản Đến</a>
                        </Button>

                        <Button accent ripple className="page" style={{ fontWeight: "normal", right: "0", height: "500px", position: "absolute" }} onClick={this.choosepage.bind(this, 2)}>
                            <Icon name="unarchive" style={{ fontSize: "120px", color: "forestgreen" }} />
                            <a>Văn Bản Đi</a>
                        </Button>
                        <FABButton colored ripple onClick={this.getip.bind(this)} style={{ position: "absolute", bottom: "10px", left: "10px" }}>

                            <Icon name="event_note" />
                        </FABButton>

                    </Content>

                </Layout>;

            </div>

        )
    }
}
