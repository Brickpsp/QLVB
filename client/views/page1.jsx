import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
var ReactDom = require('react-dom');
var Dropzone = require('react-dropzone');
import { DateField, DatePicker } from 'react-date-picker'
import { Layout, Table, TableHeader, Header, Content, Button, Icon, Textfield, Card, CardTitle, CardText, CardActions, Grid, Cell, ProgressBar, FABButton, IconButton, Chip, ChipContact } from 'react-mdl';

var filedata;
var filename;

export default class Page1 extends TrackerReact(React.Component) {
    constructor(props) {
        super();
        this.state = {
            subscription: {
                data: Meteor.subscribe("allData")
            },
            form: false,
            alert: true,
            refresh: true,

        }
        if (Meteor.isClient) {
            Session.set('search', "");

        }
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

    deleteData(id) {
        Meteor.call('deleteData', id);
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
        var expiryDate = this.refs.expiryDate.field.displayValue.trim();
        if (title && codecv && expiryDate) {

            Meteor.call("adddata", title, codecv, expiryDate, filedata, filename, nk_cv, dvxl, "vbden", (error) => {
                if (error) {
                    Bert.alert("Lỗi, cần ít nhất thông tin về tên, mã số và ngày hết hạn của văn bản");
                }
                else {
                    Bert.alert('Đã Tạo Công Văn"' + title + '\"', 'info', 'growl-top-left');

                }
            });
        }
        this.setState({ form: false });
        this.setState({ refresh: !this.state.refresh });
        this.setState({ textOnDrop: "" });
        filedata = null;
        filename = null;
    }

    updateInterval() {
        setTimeout(function () {
            this.setState({ refresh: !this.state.refresh });
            this.updateInterval();
        }.bind(this), 3 * 60 * 60 * 1000);
    }

    homepage() {
        FlowRouter.go("/");
    }

    get_datas() {
        var datas;
        if (this.state.subscription.data.ready()) {
            var now = new Date();

            if (Session.get('search') == "") {
                datas = data.find({ $where: function () { return ((new Date(this.expiryDate) - now) / 86400000 >= 0) } }, { sort: { 'CreateAT': -1 } }).fetch();
            }
            else {
                datas = data.find({ $where: function () { return (this.codecv.includes(Session.get('search'))) } }, { sort: { 'CreateAT': -1 } }).fetch();
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
                    Bert.alert(cnt + ' Công Văn Cần Giải Quyết', 'danger', 'growl-top-left');
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
        var g_data = this.get_datas();


        return (
            <div>
                <Layout fixedHeader>
                    <Header style={{ background: "cadetblue" }} title={<span style={{ fontSize: 32 }}>QUẢN LÝ VĂN BẢN ĐẾN</span>} scroll >
                        <Textfield
                            onChange={() => { this.closeform() }}
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
                                this.state.subscription.data.ready() ?
                                    <div className="table-content">
                                        <Table
                                            style={{ width: "100%" }}
                                            sortable
                                            shadow={2}
                                            rows={g_data}
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
                                                cellFormatter={(filename) => filename ? <IconButton name="file_download" colored href={"/file/" + filename} /> : <div />}
                                            >
                                                Lưu Trữ
                                        </TableHeader>

                                            <TableHeader
                                                name="state"
                                                cellFormatter={(state) => state == 1 ?
                                                    <Chip>
                                                        <ChipContact className="mdl-color--red mdl-color-text--white"><b>!</b></ChipContact>
                                                        <span style={{ color: 'red', fontSize: 12 }}><strong>Văn bản này gần hết hạn</strong></span>
                                                    </Chip>

                                                    :
                                                    state == 0 ?
                                                        <Chip>
                                                            <ChipContact className="mdl-color--green"></ChipContact>
                                                            <span style={{ fontSize: 12 }}><strong>Còn trong thời hạn</strong></span>
                                                        </Chip>
                                                        :

                                                        <Chip>
                                                            <span style={{ fontSize: 12 }}><strong>Văn bản này đã hết hạn</strong></span>
                                                        </Chip>
                                                }
                                            >
                                                Tình Trạng
                                        </TableHeader>
                                            <TableHeader
                                                name="expiryDate"
                                                cellFormatter={(expiryDate) => new Date(expiryDate).toLocaleDateString().replace(/\//g, '-')}
                                            >
                                                Ngày Hết Hạn
					                    </TableHeader>
                                            <TableHeader
                                                name="_id"
                                                cellFormatter={(_id) => <IconButton name="cancel" style={{ color: "red" }} onClick={this.deleteData.bind(this, _id)} />}
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
