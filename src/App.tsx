import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from './modules/modal/Modal';
import Preview from './modules/preview/Preview';
import List from './modules/list/List';
import { IImageList } from './interfaces/interface';
import axios from 'axios';
import { base_api_url, UPLOAD_IMAGE_WIDTH, UPLOAD_IMAGE_HEIGHT } from './constants';


type AppState = {
  showPopup: boolean,
  url: string,
  images: IImageList[]
}
const initialState = {
  showPopup: false,
  url: '',
  images: []
}


function App() {
  const ref = React.createRef<HTMLInputElement>();

  const [state, setState] = useState<AppState>(initialState)
  const { showPopup } = state;

  useEffect(() => {
    fetchImages()
  }, [showPopup])

  /**
   * on image select validate image dimensions and creat blob url for future use
   * @param e HTMLInputElement
   */
  function onImageChange(e: any) {
    let selectedFile = e.target.files[0]
    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = function () {
      if (img.width === UPLOAD_IMAGE_WIDTH && img.height === UPLOAD_IMAGE_HEIGHT) {
        setState({ ...state, url, showPopup: true })
      }
      else {
        URL.revokeObjectURL(url);
        alert(`Image dimensions should be ${UPLOAD_IMAGE_WIDTH}x${UPLOAD_IMAGE_HEIGHT}`)
      }
    };
    img.src = url;
    e.target.value = '';
  }

  /**
   * on closing popup revoke object url to avoid memory leak
   * @summary hide popup 
   */
  function hidePreview() {
    URL.revokeObjectURL(state.url)
    setState({ ...state, url: '', showPopup: false })
  }

  /**
   * fetch latest cropped images
   */
  async function fetchImages() {
    try {
      let result = await axios.get<IImageList[]>('/api/images', { baseURL: base_api_url })
      if (result)
        setState({ ...state, images: result.data })
    }
    catch (e) { console.log(e) }
  }

  return (
    < div className="container mt-4" >
      <h3>Image Resizer</h3>
      <input ref={ref} className="d-none" type="file" onChange={onImageChange} />
      <button className="btn btn-sm btn-primary" onClick={() => ref.current?.click()}>Upload</button> &nbsp;
      <small>Upload image with dimensions {UPLOAD_IMAGE_WIDTH}x{UPLOAD_IMAGE_HEIGHT}</small>

      {
        showPopup ?
          (
            <Modal heading="Image Preview" onClose={hidePreview}>
              {/* Modal view used via react portal to show cropping tool in popup*/}
              <Preview url={state.url} onClose={hidePreview} />
            </Modal>
          )
          : ''
      }
      {/* showing cropped images */}
      <List images={state.images} />
    </div >

  );
}

export default App;
