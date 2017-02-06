import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
var Dropzone = require('react-dropzone');
var ReactDom = require('react-dom');
import { DateField, DatePicker } from 'react-date-picker'
import { Layout, Table, TableHeader, Header, Content, Button, Icon, Textfield, Card, CardTitle, CardText, CardActions, Grid, Cell, ProgressBar, FABButton, IconButton, } from 'react-mdl';
var filedata;
var filename;

export default class Page2 extends TrackerReact(React.Component) {
    constructor(props) {
        super();
        this.state = {
            subscription: {
                data2: Meteor.subscribe("allData2")
            },
            form: false,
            refresh: true
        }
        if (Meteor.isClient) {
            Session.set('search', "");
        }
    }

    componentWillUnmount() {
        this.state.subscription.data2.stop();
    }

    openform() {
        this.setState({ alert: false });
        this.setState({ form: !this.state.form });
    }

    closeform() {
        this.setState({ form: false });
    }

    deletedata(id) {
        Meteor.call('deletedata2', id);
    }

    onDrop(acceptedFiles, rejectedFiles) {
        //saveFile(acceptedFiles, acceptedFiles.name);
        file = acceptedFiles[0]
        var fileReader = new FileReader()
        if (file) {
            method = 'readAsBinaryString';
            encoding = 'binary';
            filename = file.name;
            this.setState({ textOnDrop: "File " + filename + " sẵn sàng upload" });
            fileReader.onload = function (file) {
                filedata = file.srcElement.result

            }
            fileReader[method](file);
        }
    }

    submitform() {
        Session.set('search', "");
        var title = this.refs.title.inputRef.value.trim();
        var codecv = this.refs.codecv.inputRef.value.trim();
        var nk_cv = this.refs.nk_cv.inputRef.value.trim();
        var dvxl = this.refs.dvxl.inputRef.value.trim();
        var sendDate = this.refs.sendDate.field.displayValue.trim();
        if (title && codecv) {

            Meteor.call("adddata2", title, codecv, sendDate, filedata, filename, nk_cv, dvxl, "vbdi", (error) => {
                if (error) {
                    Bert.alert("Lỗi, cần ít nhất thông tin về tên và mã số văn bản");
                }
                else {
                    Bert.alert('Đã Tạo Công Văn"' + title + '\"', 'info', 'growl-top-right');

                }
            });
        }
        this.setState({ form: false });
        this.setState({ refresh: !this.state.refresh });
        this.setState({ textOnDrop: "" });
        filedata = null;
        filename = null;
    }


    get_data2s() {
        var data2s;
        if (this.state.subscription.data2.ready()) {
            if (Session.get('search') == "") {
                data2s = data2.find({}, { sort: { 'CreateAT': -1 } }).fetch();
            }
            else {
                data2s = data2.find({}, { sort: { 'CreateAT': -1 } }).fetch();
            }
        }

        return data2s;


    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            Session.set('search', this.refs.search.inputRef.value.trim());
            loading = false;
        }
    }

    homepage() {
        FlowRouter.go("/");
    }



    render() {
        var g_data2 = this.get_data2s();

        return (
            <div>
                <Layout fixedHeader>
                    <Header style={{ background: "cadetblue" }} title={<span style={{ fontSize: 32 }}>QUẢN LÝ VĂN BẢN ĐI</span>} scroll >

                        <Textfield
                            onChange={() => { }}
                            label="Search"
                            style={{ right: "1%", color: "#ddd" }}
                            expandable
                            expandableIcon="search"
                            ref="search"
                            onKeyPress={this._handleKeyPress.bind(this)}

                        />

                        <Button raised accent ripple onClick={this.openform.bind(this)}>Thêm Văn Bản</Button>

                        {this.state.refresh ? <div /> : <a />}

                    </Header>

                    <Content style={{ overflow: "hidden" }}>

                        {
                            this.state.form ?
                                <div className="Form" >
                                    <Card shadow={0} style={{ width: '80%', margin: 'auto' }}>
                                        <CardTitle style={{ color: '#fff', background: 'lightsalmon' }}>
                                            Nhập Văn Bản

                                        </CardTitle>
                                        <CardText style={{ height: '100%', overflow: "auto" }}>
                                            <Grid>
                                                <Cell col={8}>
                                                    <Textfield
                                                        onChange={() => { }}
                                                        label="Mã"
                                                        ref="codecv"
                                                        floatingLabel
                                                        style={{ width: '100%' }}
                                                    />
                                                    <Textfield
                                                        ref="title"
                                                        label="Tên"
                                                        floatingLabel
                                                        style={{ width: '100%' }}
                                                    />

                                                    <div className="label_dt">Ngày gửi</div>
                                                    <DateField className="rdt"
                                                        ref="sendDate"
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
                                                    <Textfield
                                                        ref="nk_cv"
                                                        label="Người Ký"
                                                        floatingLabel
                                                        style={{ width: '100%' }}
                                                    />
                                                    <Textfield
                                                        ref="dvxl"
                                                        label="Đơn Vị Xử Lý"
                                                        floatingLabel
                                                        style={{ width: '100%' }}
                                                    />
                                                </Cell>
                                                <Cell col={4}>
                                                    <Dropzone className="dropzone" onDrop={this.onDrop.bind(this)}>
                                                        <div style={{ color: 'black' }}> Kéo Và Thả Văn Bản Cần Lưu Trữ Vào Đây Hoặc Nhấn Vào Đây
                                                        <div style={{ height: "10px" }} />
                                                            <div style={{ color: "red" }}>
                                                                {this.state.textOnDrop}
                                                            </div>
                                                        </div>
                                                    </Dropzone>
                                                </Cell>
                                            </Grid>
                                            <Grid style={{ whiteSpace: "nowrap" }}>
                                                <Cell col={9}> </Cell>
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
                                this.state.subscription.data2.ready() ?
                                    <div className="table-content">
                                        <Table
                                            style={{ width: "100%" }}
                                            sortable
                                            shadow={2}
                                            rows={g_data2}
                                        >
                                            <TableHeader
                                                name="codecv"
                                            >
                                                Mã
                                        </TableHeader>
                                            <TableHeader
                                                name="title"
                                            >
                                                Tên
                                        </TableHeader>
                                            <TableHeader
                                                name="nk_cv"
                                            >
                                                Người Ký
                                        </TableHeader>
                                            <TableHeader
                                                name="dvxl"
                                            >
                                                Đơn Vị Xử Lý
                                        </TableHeader>
                                            <TableHeader
                                                name="filename"
                                                cellFormatter={(filename) => filename != null ? <IconButton name="file_download" colored href={"/file/" + filename} /> : <div />}
                                            >
                                                Lưu Trữ
                                        </TableHeader>
                                            <TableHeader
                                                name="sendDate"
                                                cellFormatter={(sendDate) => new Date(sendDate).toLocaleDateString().replace(/\//g, '-')}
                                            >
                                                Ngày Gửi
					                    </TableHeader>
                                            <TableHeader
                                                name="_id"
                                                cellFormatter={(_id) => <IconButton name="cancel" style={{ color: "red" }} onClick={this.deletedata.bind(this, _id)} />}
                                            >
                                                Xóa
                                        </TableHeader>
                                        </Table>
                                    </div>
                                    :
                                    <ProgressBar style={{ width: "100%" }} indeterminate />
                            }

                        </div>
                        <FABButton ripple onClick={this.homepage.bind(this)} style={{ position: "absolute", bottom: "10px", left: "10px" }}>
                            <Icon name="arrow_back" />
                        </FABButton>

                    </Content>

                </Layout>

            </div>

        )
    }
}
