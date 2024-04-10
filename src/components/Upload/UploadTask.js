import React, { useState } from "react";
import { Button, Progress, Upload } from "antd";
import axios from "axios";
import { BsUpload } from "react-icons/bs";

const UploadTask = () => {
  const [files, setFiles] = useState({});

  const handleBeforeFileUpload = ({ file }) => {
    // Check file size
    // If pass
    // return true
    // If not pass
    // return false;
  };

  const handleFileUpload = ({ file }) => {
    setFiles((prev) => ({ ...prev, [file.uid]: file }));

    // Add field progress to object file in state
    const getFileObject = (progress, estimated) => {
      return {
        name: file.name,
        uid: file.uid,
        progress: progress,
        estimated: estimated || 0,
      };
    };

    // Call api to upload file to firebase
    axios.post("url", file, {
      onUploadProgress: (event) => {
        // Add field progress to object file in state
        setFiles((prev) => {
          return {
            ...prev,
            [file.uid]: getFileObject(event.progress, event.estimated),
          };
        });
      },
    });
  };

  const getTimeString = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds / 60 - hours * 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60 - hours * 3600);
    const timeString = `${seconds} sec`;

    if (minutes) timeString = `${minutes} min ${timeString}`;

    if (hours) timeString = `${hours} hrs ${timeString}`;

    return timeString;
  };

  // Total time if multipla file is availabel
  // const totalTime = getTimeString(Object.values(files).reduce((total, current) => {
  //   return total + current.estimated;
  // }, 0));

  return (
    <>
      <Upload.Dragger
        className=""
        multiple={false}
        customRequest={handleFileUpload}
        showUploadList={{ showRemoveIcon: true }}
        accept=".png,.jpeg,.doc,.pdf"
        beforeUpload={handleBeforeFileUpload}
        progress={{
          strokeWidth: 3,
          strokeColor: {
            "0%": "#108ee9",
            "100%": "#87d068",
          },
          style: { top: 15 },
          format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        }}
      >
        Drag here
        <br />
        OR
        <br />
        <Button>Click here</Button>
      </Upload.Dragger>
      {Object.values(files).map((file, index) => (
        <div>
          <p>{file.name}</p>
          <p>
            is being upload in {Math.ceil(getTimeString(file.estimated))}{" "}
            seconds
          </p>
          <Progress percent={Math.ceil(file.progress * 100)} />
        </div>
      ))}
    </>
  );
};

export default UploadTask;
