import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Modal } from "antd";

const DocReviewerModal = ({ isModalOpen }) => {
  const docs = [
    // {
    //   // uri: "https://url-to-my-pdf.pdf",
    //   uri: "https://storage.googleapis.com/hrea-8d10b.appspot.com/contract/%23C-KU98UZ.docx?GoogleAccessId=firebase-adminsdk-sen9c%40hrea-8d10b.iam.gserviceaccount.com&Expires=1893456000&Signature=rwmmtl4dKcG4M7H%2FlwiwqIuk7BJf5qpk1toMuSnPYl6a7Z7pEqJsitDYlzhQjdnq7euMfXJ8T2U8ud9qUKrtVP766RkpjATysx8tGnDvtqKcbH7bK0JK3aZQKLabVZb%2BAlS9J0cbDzuWOKi1EFGlSKeuwO%2FbhIHZDZcTUS1GUS0E3aATdb%2FVHA%2Box1UUjlL5Lsx6dYOZFHB9wmPjmFHloFqFdYs9Z5mZ32Y93X5uTEE36eXNexGFrCR6CH%2BoKGJ%2Bgt6NiY3l%2FWTbUFxR4CKIoy12rzkm6bsVVO8LXccj9G%2FVcup10gfjoAKOa9JLjFF8%2BXq5tSJ%2BADhSDK1E7vE1Vg%3D%3D",
    // }, // Remote file

    { uri: require("../../assets/#C-KU98UZ.docx") }, // Local File
  ];

  return (
    <Modal
      //   title={<p className="text-center text-2xl pb-4">Lý do từ chối</p>}
      open={isModalOpen}
      // onOk={handleOk}
      // onCancel={handleCancel}
      // confirmLoading={updateIsLoading}
      centered
      //   width={"30%"}
    >
      <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
    </Modal>
  );
};

export default DocReviewerModal;
