import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Modal, Image, Input, Button, Tooltip } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { FC, useEffect, useState } from 'react';
import { fallbackImage } from '../../utils';
import './UpdateImages.scss';
import { IProductImageResponse } from '../../interfaces';

interface IUpdateImagesProps {
  open: boolean;
  handleCancel?: () => void;
  handleSubmit?: (images: IProductImageResponse[]) => void;
  initialValues: IProductImageResponse[];
}

const UpdateImages: FC<IUpdateImagesProps> = ({
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateImagesProps) => {
  const [images, setImages] = useState<IProductImageResponse[]>([]);
  const [selectedImage, setSelectedImage] = useState<IProductImageResponse>();
  const [inputValue, setInputValue] = useState<string>('');
  const handleOk = () => {
    handleSubmit && handleSubmit(images);
  };

  const handleAddImage = () => {
    setImages([
      ...images,
      {
        id: uuidv4(),
        url: inputValue,
      },
    ]);
    setInputValue('');
  };

  const handleEditImage = (image: IProductImageResponse) => {
    setInputValue(image.url);
    setSelectedImage(image);
  };

  const handleSaveImage = () => {
    setImages((prev) => {
      const index = prev.findIndex((x) => x.id === selectedImage?.id);
      if (index === -1) {
        return prev;
      }
      prev.splice(index, 1, {
        ...prev[index],
        url: inputValue,
      });
      return [...prev];
    });
    setSelectedImage(undefined);
    setInputValue('');
  };

  const handleCancelEdit = () => {
    setSelectedImage(undefined);
    setInputValue('');
  };

  const handleDeleteImage = (image: IProductImageResponse) => {
    setImages((prev) => prev.filter((x) => x.id !== image.id));
  };

  useEffect(() => {
    setImages(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title={`Update product images`}
      open={open}
      bodyStyle={{ paddingTop: '16px', paddingBottom: '16px' }}
      maskClosable={false}
      onOk={handleOk}
      onCancel={() => handleCancel && handleCancel()}
    >
      <div className="input-control">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          style={{ marginLeft: '12px' }}
          type="primary"
          onClick={() => (selectedImage ? handleSaveImage() : handleAddImage())}
        >
          {selectedImage ? 'Update' : 'Add'} image
        </Button>
      </div>
      <span className="image-container">
        <Image.PreviewGroup>
          {images?.map((x) => (
            <span key={x.id} className="image-item">
              <Image
                width={140}
                height={140}
                src={x.url}
                fallback={fallbackImage}
              />
              <div>
                {selectedImage && selectedImage.id === x.id ? (
                  <Tooltip title="Cancel">
                    <Button
                      type="text"
                      icon={<SaveOutlined />}
                      onClick={() => {
                        handleCancelEdit();
                      }}
                    ></Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Update image">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        handleEditImage(x);
                      }}
                    ></Button>
                  </Tooltip>
                )}
                <Tooltip title="Delete image">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      handleDeleteImage(x);
                    }}
                  ></Button>
                </Tooltip>
              </div>
            </span>
          ))}
        </Image.PreviewGroup>
      </span>
    </Modal>
  );
};

export default UpdateImages;
