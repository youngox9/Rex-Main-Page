import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button, Modal, Input, Upload } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import _ from 'lodash';
import { DeleteFilled, PlusCircleFilled, UploadOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UploadFileBtnStyled = styled(Button)`
  position: relative;
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
`;

const ThumbItem = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  > * {
    margin-right: 6px;
    &:last-child{
      margin-right: 0px;
    }
  }
  .upload-btn {
    position: relative;
    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .thumb {
    display: block;
    width: 50px;
    height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
`;
const ModalContent = styled.div.attrs(props => ({
  style: props.style
}))`
  .form-row {
    /* display: flex;
    .form-col {
      flex: 0 auto;
      max-width: 100%;
    } */
    margin-bottom: 16px
  }
  .thumbnails {
    display: block;
    padding: 6px 0;
    align-items: center;
    
    /* .thumbnail {
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        height: 100px;
        margin-right: 12px;
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        .remove-btn {
          position: absolute;
          top: 0;
          right: 0;
        }
    } */
  }
`;

function UploadFileBtn(props) {
  const { onChange } = props;

  async function onUploadImage(e) {
    let file = e.target.files[0];
    let fd = new FormData();
    fd.append('image', file);
    const res = await axios({
      url: 'https://api.imgur.com/3/upload',
      method: 'POST',
      headers: {
        Authorization: 'Client-ID 72ccd1fa12781f85c8a62aa9939978647fcf0e20'
      },
      data: fd
    });
    const { id, deletehash, link } = res?.data?.data;
    const imgObj = { id, deletehash, link };
    e.target.value = '';
    onChange(imgObj);
  }

  return (
    <UploadFileBtnStyled
      shape="circle"
      icon={<UploadOutlined />}
    >
      <input type="file" onChange={(e) => onUploadImage(e)} />
    </UploadFileBtnStyled>
  );
}

function ManagementModal(props) {
  const { onAdd, isOpen, selectedRecord, onSave, onCancel, action } = props;
  const [tempRecord, setTempRecord] = useState(null);

  // const action = selectedRecord ? 'Edit' : 'Add';

  useEffect(() => {
    setTempRecord(selectedRecord);
  }, [JSON.stringify(selectedRecord)]);

  if (tempRecord === null) return null;

  const { _id, title, pic = [], des = '', cover = {} } = tempRecord;

  function onChangePic(id, imgObj) {
    const newPic = tempRecord.pic.reduce((prev, curr) => {
      if (id === curr.id) {
        return [...prev, imgObj];
      }
      return [...prev, curr];
    }, []);
    setTempRecord({ ...tempRecord, pic: newPic });
  }

  function onRemovePic(id) {
    const newPic = tempRecord.pic.reduce((prev, curr) => {
      if (id === curr.id) {
        return [...prev];
      }
      return [...prev, curr];
    }, []);
    setTempRecord({ ...tempRecord, pic: newPic });
  }

  function onAddPic(id) {
    const newPic = [...pic, { id: uuid() }];
    setTempRecord({ ...tempRecord, pic: newPic });
  }

  function onChange(key, value) {
    const newTemp = { ...tempRecord, [key]: value };
    console.log(newTemp);
    setTempRecord(newTemp);
  }

  function onSubmit() {
    if (action === 'Add') {
      onAdd(tempRecord);
    } else if (action === 'Edit') {
      onSave(tempRecord);
    }
  }

  return (
    <Modal
      title={action}
      visible={isOpen}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <ModalContent>
        <div className="form-row">
          <div className="form-col">title</div>
          <div className="form-col">
            <Input
              type="text"
              value={title}
              onChange={e => onChange('title', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">Cover</div>
          <div className="form-col">
            <ThumbItem>
              <Input
                type="text"
                value={cover.link}
                onChange={e => onChange('cover', ({ ...cover, link: e.target.value }))}
              />
              <UploadFileBtn onChange={(obj) => onChange('cover', obj)} />
              <Button
                icon={<DeleteFilled />}
                shape="circle"
                onClick={() => onChange('cover', {})}
              />
              {cover.link && <div className="thumb" style={{ backgroundImage: `url(${cover.link})` }} />}
            </ThumbItem>
          </div>

        </div>
        <div className="form-row">
          <div className="form-col">PIC</div>
          <div className="form-col">
            <div className="thumbnails">
              {pic.map(imgObj => {
                const { id, deletehash, link } = imgObj;
                if (id) {
                  return (
                    <ThumbItem className="thumb-item" key={id}>
                      <Input
                        type="text"
                        value={link}
                        onChange={e => onChangePic(id, { ...imgObj, link: e.target.value })}
                      />
                      <UploadFileBtn onChange={(obj) => onChangePic(id, obj)} />
                      <Button
                        icon={<DeleteFilled />}
                        shape="circle"
                        onClick={() => onRemovePic(id)}
                      />
                      {link && <div key={id} className="thumb" style={{ backgroundImage: `url(${link})` }} />}
                    </ThumbItem>
                  );
                }
                return null;
              })}
              <Button
                icon={<PlusCircleFilled />}
                shape="circle"
                onClick={onAddPic}
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-col">Des</div>
          <div className="form-col">
            <ReactQuill
              theme="snow"
              value={des}
              onChange={val => onChange('des', val)}
            />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default ManagementModal;
