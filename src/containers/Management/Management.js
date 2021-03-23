import React, { useRef, useContext, useState, useLayoutEffect, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Table, Button, Tooltip, Upload, message } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { EditOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import Imgur from './Imgur';

// c32bd8951e7600cfbd44c686409ee86b751a68d8

import 'antd/dist/antd.css';

const test = new Imgur({
  clientid: 'b710b6e755baf00', // You can change this ClientID
  callback: (res) => { console.log(res); }
});

// console.log(Imgur);

const Container = styled.div.attrs(props => ({
  style: props.style
}))`
  display: block;
  max-width: 1440px;
  margin: 0 auto;
`;

const columnsSetting = ({ onChangeData = () => { }, editMode = false }) => [
  {
    title: 'title',
    dataIndex: 'title',
    key: 'name',
  },
  {
    title: 'pic',
    dataIndex: 'pic',
    key: 'pic',
  },
  {
    title: 'des',
    dataIndex: 'des',
    key: 'des',
    render(val, record) {
      const { _id } = record;
      return editMode ? (
        <CKEditor
          editor={ClassicEditor}
          data={val}
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const des = editor.getData();
            onChangeData(_id, 'des', des);
          }}
          onBlur={(event, editor) => {
            // console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            // console.log('Focus.', editor);
          }}
        />
      ) : val;
    }
  },
];

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
function Management(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (editMode) { setTempData(data); }
  }, [editMode]);

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
    const newData = tempData.reduce((prev, curr) => {
      if (curr._id === id) {
        return [...prev, { ...curr, [key]: val }];
      }
      return [...prev, curr];
    }, []);
    setTempData(newData);
  }

  async function onSave() {
    setLoading(true);
    const diff = _.differenceWith(data, tempData, _.isEqual);
    await asyncForEach(diff, async (obj) => {
      const { _id } = obj;
      const res = await axios({
        url: `https://mainpage-1c62.restdb.io/rest/data/${_id}`,
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'x-apikey': '005e404c56a25d2edc1adbd3aa32c248a09a5',
        },
        data: obj
      });
    });
    await getData();
    setEditMode(false);
    setLoading(false);
  }

  const columns = columnsSetting({ onChangeData, editMode });

  const ppp = {
    name: 'file',
    action: 'https://api.imgur.com/3/image',
    headers: {
      // ':authority': 'api.imgur.com',
      // ':method': 'POST',
      // ':path': '/3/image',
      // ':scheme': 'https',
      'Access-Control-Expose-Headers': 'Content-Disposition',
      Authorization: 'Client-ID b710b6e755baf00',
      'Content-Type': 'multipart/form-data'
    },
    beforeUpload: (file) => {
      console.log(file);
      const formData = new FormData();
      formData.append('image', file);
      return formData;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Container>
      <Upload {...ppp}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>

      <Button
        type="primary"
        shape="circle"
        icon={editMode ? <SaveOutlined /> : <EditOutlined />}
        onClick={() => (editMode ? onSave(!editMode) : setEditMode(true))}
      />
      <Table dataSource={editMode ? tempData : data} columns={columns} loading={loading} rowKey="_id" />
    </Container>
  );
}

export default Management;
