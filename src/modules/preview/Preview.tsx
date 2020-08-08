import React, { memo, useState } from 'react'
import Crop from '../cropper/Crop'
import { sizes, sizeTypes } from './sizes';
import clsx from 'clsx';
import axios from 'axios';
import { base_api_url } from '../../constants';
import { blobUrltoFileHelper } from '../../utils';


type PreviewProps = {
  onClose: () => void,
  url: string
}

type PreviewState = {
  [key in sizeTypes]: string
}


function Preview(props: PreviewProps) {

  const [active, setActive] = useState<sizeTypes>('horizontal');
  const [loading, setLoader] = useState<boolean>(false);
  const [croppedUrls, setCroppedUrls] = useState<PreviewState>({ gallery: '', horizontal_small: '', horizontal: '', vertical: '' });

  /**
   * on save convert blob urls to files and upload to the server
   * trigger close the popup fn
   */
  const onSave = async () => {
    let fileData = new FormData();
    let selectedFiles: File[] = await blobUrltoFileHelper<PreviewState>(croppedUrls);
    selectedFiles.forEach(file => fileData.append('image', file, file.name));

    setLoader(true);
    await axios({
      method: 'post',
      url: '/api/upload',
      baseURL:base_api_url,
      data: fileData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).catch(e => {
      alert(e);
      setLoader(false);
    });

    close();
  }

  /**
   * update respective bolb urls in state
   * @param name typeof image being cropped 
   * @param value blob url 
   */
  const onImageCrop = (name: keyof PreviewState, value: string) => {
    let newState = { ...croppedUrls };
    newState[name] = value;
    setCroppedUrls(newState);
  }

  const close = () => {
    Object.values(croppedUrls).forEach(url => URL.revokeObjectURL(url));
    props.onClose();
  }

  return (

    <>
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        {
          sizes.map((item) => (
            <li key={item.id} className="nav-item" onClick={() => setActive(item.id)}>
              <a className={clsx('nav-link', { active: active === item.id })} id="home-tab" role="tab" aria-controls="home">{item.label}</a>
            </li>
          ))
        }
      </ul>
      <div className="tab-content" id="myTabContent">
        {
          sizes.map((item) => (
            <div key={item.id} className={clsx('tab-pane', 'fade', 'show', { active: active === item.id })} id="home" role="tabpanel" aria-labelledby="home-tab">
              <Crop crop={item.crop} src={props.url} onImageCrop={(value: string) => onImageCrop(item.id, value)} />
            </div>

          ))
        }
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close}>Close</button>
        <button type="button" className="btn btn-primary" onClick={onSave} disabled={loading}>
          {loading ? 'Saving changes...' : 'Save Changes'}
        </button>
      </div>
    </>
  )
}

export default memo(Preview)