
interface ISizes {
  label: string,
  id: sizeTypes,
  crop: ReactCrop.Crop
}
export type sizeTypes = 'horizontal' | 'vertical' | 'horizontal_small' | 'gallery'

export const sizes: ISizes[] = [
  {
    label: 'Horizontal',
    id: "horizontal",
    crop: { width: 755, height: 450 }
  },
  {
    label: 'Vertical',
    id: "vertical",
    crop: { width: 365, height: 450 }
  },
  {
    label: 'Horizontal Small',
    id: "horizontal_small",
    crop: { width: 365, height: 212 }
  },
  {
    label: 'Gallery',
    id: "gallery",
    crop: { width: 380, height: 380 }
  },
]