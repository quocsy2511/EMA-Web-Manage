import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Modal } from "antd";

const DocReviewerModal = () => {
  const docs = [
    { uri: "https://url-to-my-pdf.pdf" }, // Remote file
    // { uri: require("./example-files/pdf.pdf") }, // Local File
  ];

  return (
    <Modal
      //   title={<p className="text-center text-2xl pb-4">Lý do từ chối</p>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={updateIsLoading}
      centered
      //   width={"30%"}
    >
      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
    </Modal>
  );
};

export default DocReviewerModal;
