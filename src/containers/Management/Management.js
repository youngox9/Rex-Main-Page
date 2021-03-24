import React, { useRef, useContext, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, Button, Tooltip, Upload, message, Modal, Form, Input, Checkbox } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';
import $ from 'jquery';
import ManagementModal from './ManagementModal';
import 'antd/dist/antd.css';

const Container = styled.div.attrs(props => ({
  style: props.style
}))`
  display: block;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 64px;
`;

const ModalContent = styled.div.attrs(props => ({
  style: props.style
}))`
  .thumbnail {
    display: inline-block;
    width: 200px;
    height: 100px;
    margin-right: 6px;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    .remove-btn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%,-50%);
    }
  }
`;

const columnsSetting = ({ onFileChange, onChangeData = () => { }, editMode = false, setSelectedId }) => [
  {
    title: 'title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'edit',
    dataIndex: 'edit',
    key: 'edit',
    width: '100',
    render(val, record) {
      return (
        <Button
          type="primary"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => setSelectedId(record._id)}
        />
      );
    }
  }
];

function Management(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    const { data: newData } = await axios({
      url: 'https://mainpage-1c62.restdb.io/rest/data',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-apikey': '005e404c56a25d2edc1adbd3aa32c248a09a5',
      }
    });
    setData(newData);
    setLoading(false);
  }

  function onChangeData(id, key, val) {
    const newData = data.reduce((prev, curr) => {
      if (curr._id === id) {
        return [...prev, { ...curr, [key]: val }];
      }
      return [...prev, curr];
    }, []);
    setData(newData);
  }

  async function onSave(record) {
    setLoading(true);
    const { _id } = record;
    const res = await axios({
      url: `https://mainpage-1c62.restdb.io/rest/data/${_id}`,
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'x-apikey': '005e404c56a25d2edc1adbd3aa32c248a09a5',
      },
      data: record
    });
    setSelectedId(null);
    await getData();
    setLoading(false);
  }

  const columns = columnsSetting({ onChangeData, setSelectedId });

  const selectedRecord = data.find(obj => obj._id === selectedId) || {};

  // console.log(pic);
  return (
    <Container>
      <Table dataSource={data} columns={columns} loading={loading} rowKey="_id" />
      <ManagementModal
        isOpen={!!selectedId}
        selectedRecord={selectedRecord}
        onSave={onSave}
        onCancel={() => setSelectedId(null)}
      />
    </Container>
  );
}

export default Management;
