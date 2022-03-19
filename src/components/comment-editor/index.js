import React, { createRef, useState } from "react";
import { Form, Button, Input } from "antd";
import useClickOutside from "../../utils/use-click-outside";

function CommentEditor({
  onSubmit,
  onEdit,
  value,
  changeEditorStatus = null,
  editorConfig = { format: "create", value: "" },
}) {
  const [state, setState] = useState(editorConfig.value);
  const editorRef = createRef();
  if (changeEditorStatus) useClickOutside(editorRef, changeEditorStatus);
  return (
    <div className={"Editor"} ref={editorRef}>
      <Form.Item>
        <Input.TextArea rows={2} defaultValue={value} onChange={(value) => setState(value)} />
      </Form.Item>
      <Form.Item>
        {editorConfig.format === "create" && (
          <Button htmlType="submit" onClick={() => onSubmit(state)} type="primary">
            Отправить
          </Button>
        )}
        {editorConfig.format === "edit" && (
          <Button htmlType="submit" onClick={() => onEdit(state)} type="primary">
            Изменить
          </Button>
        )}
      </Form.Item>
    </div>
  );
}

export default CommentEditor;
