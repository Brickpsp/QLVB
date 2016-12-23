import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
var ReactDom = require('react-dom');
import { DateField, DatePicker } from 'react-date-picker'
import 'react-date-picker/index.css'
import { Layout, Table, TableHeader, Header, Navigation, Drawer, Content, Button, Badge, Icon, Textfield, Card, CardTitle, CardText, CardActions, Grid, Cell, ProgressBar } from 'react-mdl';
data = new Mongo.Collection('data');
var g_data = {};

export default class Main extends TrackerReact(React.Component) {
    constructor(props) {
        super();
        this.state = {
            subscription: {
                data: Meteor.subscribe("allData")
            },
            form: false,
            alert: true,
            refresh: true
        }
        Session.set('search', "");

    }

    componentDidMount() {
        setInterval(this.updateInterval(), 10000);
    }

    componentWillUnmount() {
        this.state.subscription.data.stop();
    }

    openform() {
        this.setState({ alert: false });
        this.setState({ form: !this.state.form });
    }

    closeform() {
        this.setState({ form: false });
    }

    submitform() {
        Session.set('search', "");
        var title = this.refs.title.inputRef.value.trim();
        var codecv = this.refs.codecv.inputRef.value.trim();
        var note = this.refs.note.inputRef.value.trim();
        var expiryDate = this.refs.expiryDate.field.displayValue.trim();

        if (title && codecv && expiryDate) {

            Meteor.call("adddata", title, codecv, expiryDate, note, (error) => {
                if (error) {
                    Bert.alert("Lỗi");
                }
                else {
                    Bert.alert('Đã Tạo Công Văn"' + title + '\"', 'info', 'growl-top-right');

                }
            });
        }

        //this.refs.fileUpload.inputRef.files[0]

        this.setState({ form: false });
        this.setState({ refresh: !this.state.refresh });
    }

    updateInterval() {
        setTimeout(function () {
            this.setState({ refresh: !this.state.refresh });
            this.updateInterval();
        }.bind(this), 3 * 60 * 60 * 1000);
    }

    get_datas() {
        var datas;
        if (this.state.subscription.data.ready()) {
            var now = new Date();

            if (Session.get('search') == "") {
                datas = data.find({ $where: function () { return ((new Date(this.expiryDate) - now) / 86400000 >= 0) } }, { sort: { 'CreateAT': -1 }, limit: 50 }).fetch();
            }
            else {
                datas = data.find({ $where: function () { return (this.codecv.includes(Session.get('search'))) } }, { sort: { 'CreateAT': -1 }, limit: 50 }).fetch();
            }
            if (this.state.alert) {
                var cnt = 0
                datas.forEach(function (item) {
                    Meteor.call("updateData", item, (error) => {
                        if (error) {
                            console.log("fail update")
                        }
                    });
                    if (item.state == 1) {
                        cnt++;
                    }
                });

                if (cnt > 0 && Session.get('search') == "")
                    Bert.alert(cnt + ' Công Văn Cần Giải Quyết', 'danger', 'growl-top-right');
            }
        }

        return datas;


    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            Session.set('search', this.refs.search.inputRef.value.trim());
            loading = false;
        }
    }



    render() {
        g_data = this.get_datas();

        return (
            <div>
                <Layout>
                    <Header style={{ background: "cadetblue" }} title={<span style={{ fontSize: 32 }}>Thông Báo Thời Hạn Công Văn</span>} scroll>

                        <Textfield
                            onChange={() => { } }
                            label="Search"
                            style={{ right: "1%", color: "#ddd" }}
                            expandable
                            expandableIcon="search"
                            ref="search"
                            onKeyPress={this._handleKeyPress.bind(this)}

                            />

                        <Button raised accent ripple onClick={this.openform.bind(this)}>Thêm Công Văn</Button>
                        {this.state.refresh ? <div /> : <a />}

                    </Header>

                    <Content>
                        {
                            this.state.form ?
                                <div className="Form" >
                                    <Card shadow={0} style={{ width: '80%', margin: 'auto' }}>
                                        <CardTitle style={{ color: '#fff', height: '120px', background: 'lightsalmon' }}>Nhập Công Văn</CardTitle>
                                        <CardText style={{ height: '100%' }}>
                                            <Grid>
                                                <Cell col={6}><Textfield
                                                    ref="title"
                                                    label="Tên Công Văn"
                                                    floatingLabel
                                                    style={{ width: '600px' }}
                                                    /></Cell>
                                                <Cell col={4}>
                                                    <div className="label_dt">Ngày hết hạn</div>
                                                    <DateField className="rdt"
                                                        ref="expiryDate"
                                                        dateFormat="YYYY-MM-DD"
                                                        forceValidDate={true}
                                                        updateOnDateClick={true}
                                                        collapseOnDateClick={true}
                                                        defaultValue={new Date()}
                                                        showClock={false}
                                                        >
                                                        <DatePicker
                                                            navigation={true}
                                                            locale="en"
                                                            forceValidDate={true}
                                                            highlightWeekends={true}
                                                            highlightToday={true}
                                                            weekNumbers={true}
                                                            weekStartDay={0}
                                                            footer={false}
                                                            />
                                                    </DateField>
                                                </Cell>
                                                <Cell col={2}>
                                                    <Textfield
                                                        onChange={() => { } }
                                                        label="Mã Công Văn"
                                                        ref="codecv"
                                                        floatingLabel
                                                        style={{ width: '600px' }}
                                                        />
                                                </Cell>
                                            </Grid>
                                            <Grid>
                                                <Cell col={12}>
                                                    <Textfield
                                                        ref="note"
                                                        label="Ghi Chú"
                                                        floatingLabel
                                                        style={{ width: '100%' }}
                                                        />
                                                </Cell>

                                            </Grid>
                                            <Grid>
                                                <Cell col={6} >
                                                    <Textfield
                                                        label="Not Use"
                                                        floatingLabel
                                                        style={{ visibility: "hidden" }}
                                                        />
                                                </Cell>

                                            </Grid>
                                            <Grid style={{ whiteSpace: "nowrap" }}>
                                                <Cell col={9} />
                                                <Cell col={2}><Button raised colored ripple style={{ fontWeight: "normal", width: '100%' }} onClick={this.submitform.bind(this)}>Đồng Ý</Button></Cell>
                                                <Cell col={1}><Button raised ripple style={{ fontWeight: "normal" }} onClick={this.closeform.bind(this)}>Hủy Bỏ</Button></Cell>


                                            </Grid>


                                        </CardText>


                                    </Card>
                                </div>
                                :
                                <div />
                        }
                        <div className="page-content" >
                            {
                                this.state.subscription.data.ready() ?
                                    <Table
                                        style={{ width: "100%" }}
                                        sortable
                                        shadow={2}
                                        rows={g_data}
                                        >
                                        <TableHeader
                                            name="title"
                                            >
                                            Tên Công Văn
                                        </TableHeader>
                                        <TableHeader
                                            name="note"
                                            >
                                            Ghi Chú
                                        </TableHeader>
                                        <TableHeader
                                            name="codecv"

                                            >
                                            Mã Công Văn
                                        </TableHeader>
                                        <TableHeader
                                            name="state"
                                            cellFormatter={(state) => state == 1 ?
                                                <div style={{ background: "red" }}>
                                                    <span style={{ color: 'white', fontSize: 12 }}><strong>Công văn này gần hết hạn</strong></span>
                                                </div>
                                                :
                                                state == 0 ?
                                                    <div>Còn trong thời hạn</div>
                                                    :
                                                    <div style={{ background: "gray" }}>
                                                        <span style={{ color: 'white', fontSize: 12 }}><strong>Công văn này hết hạn</strong></span>
                                                    </div>
                                            }
                                            >
                                            Tình Trạng
                                        </TableHeader>
                                        <TableHeader
                                            name="expiryDate"
                                            cellFormatter={(expiryDate) => new Date(expiryDate).toLocaleDateString()}
                                            >
                                            Ngày Hết Hạn
                                        </TableHeader>
                                    </Table>
                                    :
                                    <ProgressBar style={{ width: "100%" }} indeterminate />
                            }

                        </div>
                    </Content>
                </Layout>


            </div>

        )
    }
}
