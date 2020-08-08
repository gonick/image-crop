import React, { PureComponent } from 'react'
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

type CropProps = {
  src: string,
  crop: ReactCrop.Crop,
  onImageCrop: (value: string) => void
}

type CropState = {
  croppedImageUrl: string,
  crop: ReactCrop.Crop,
}


export default class Crop extends PureComponent<CropProps, CropState> {
  imageRef: any;

  constructor(props: CropProps) {
    super(props);
    this.state = {
      croppedImageUrl: '',
      crop: props.crop
    }
  }

  setCrop(crop: ReactCrop.Crop) {
    this.setState({ ...this.state, crop })
  }

  onCropComplete = (crop: ReactCrop.Crop) => {
    this.makeClientCrop(crop);
  };

  onImageLoaded = (image: any) => {
    this.imageRef = image;
  };

  async makeClientCrop(crop: ReactCrop.Crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
      this.props.onImageCrop(croppedImageUrl);
    }
  }

  /**
   * get cropped image as blob url
   */
  getCroppedImg(image: any, crop: ReactCrop.Crop, fileName: string) {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width as number;
    canvas.height = crop.height as number;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (crop.x && crop.y && crop.width && crop.height) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }
    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        window.URL.revokeObjectURL(this.state.croppedImageUrl);
        const url = window.URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  }

  render() {
    return (
      <>
        <ReactCrop src={this.props.src} crop={this.state.crop}
          keepSelection locked
          onChange={newCrop => this.setCrop(newCrop)}
          onComplete={this.onCropComplete.bind(this)}
          onImageLoaded={this.onImageLoaded.bind(this)}
        />
      </>
    )
  }
}
