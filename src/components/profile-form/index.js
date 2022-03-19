import React, { useEffect, useState } from "react";
import { Form, Button, Input, Upload, DatePicker, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "style.css";

function ProfileForm({ profile, handleSubmit, countries, cities }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(profile);
  }, [form, profile]);

  const [loading, setLoading] = useState(false);
  const [imgUrlIn, setImgUrl] = useState("");

  const config = {
    name: "file",
    action: "/api/v1/files",
    headers: { "X-Token": localStorage.getItem("token") },
    maxCount: 1,
    onChange(data) {},
    onDrop(e) {},
  };

  const normFile = (e) => {
    if (e.file.status === "done") {
      return { ["_id"]: e.file.response.result._id };
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => callback(reader.result));
  };
  const getBase64Preview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Preview(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImgUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const render = {
    uploadButton: () => {
      return (
        <div>
          {loading ? (
            <LoadingOutlined />
          ) : profile?.avatar ? (
            <img src={profile?.avatar.url} alt="avatar" style={{ width: "100%" }} />
          ) : (
            <PlusOutlined />
          )}
        </div>
      );
    },
  };

  return (
    <div className={"wrapper"}>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item label="Имя" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Фамилия" name="surname">
          <Input />
        </Form.Item>
        <Form.Item label="Отчество" name="middlename">
          <Input />
        </Form.Item>
        <Form.Item label="Номер телефона" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Дата рождения" name="birthday">
          <DatePicker format={"YYYY-MM-DD"} />
        </Form.Item>

        <Form.Item name="country" label="Страна">
          <Select placeholder="Выберите страну">
            {countries &&
              countries.map((country) => (
                <Select.Option key={country._id} value={country._id}>
                  {country.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="city" label="Город">
          <Select placeholder="Выберите город">
            {cities &&
              cities.map((city) => (
                <Select.Option key={city._id} value={city._id}>
                  {city.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 11 }}
          style={{ marginBottom: "0px" }}
          name="avatar"
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            headers={{ "X-Token": localStorage.getItem("token") }}
            action="/api/v1/files"
            onChange={handleChange}
            onPreview={handlePreview}
          >
            {imgUrlIn ? (
              <img src={imgUrlIn} alt="avatar" style={{ width: "100%" }} />
            ) : (
              render.uploadButton()
            )}
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default React.memo(ProfileForm);
