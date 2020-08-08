import React, { memo } from 'react';
import { IImageList } from '../../interfaces/interface';

type listProps = {
  images: IImageList[]
}

function List(props: listProps) {
  return (
    <>
      {props.images.map(image => (
        <div key={image.name}>
          <h3 className="mt-4">{image.name}</h3>
          <img src={image.url} alt={image.name}></img>
        </div>
      ))
      }
    </>
  )
}

export default memo(List)