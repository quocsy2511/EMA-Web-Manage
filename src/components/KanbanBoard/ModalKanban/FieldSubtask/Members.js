import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getMember } from "../../../../apis/users";
import { Avatar, Tooltip } from "antd";
import AnErrorHasOccured from "../../../Error/AnErrorHasOccured";
import LoadingComponentIndicator from "../../../Indicator/LoadingComponentIndicator";

const Members = ({ userId, size = "default" }) => {
  const { data, isError, isLoading } = useQuery(
    ["memberEmployee", userId],
    () => getMember({ userId }),
    {
      select: (data) => {
        return data;
      },
      enabled: !!userId,
    }
  );

  return (
    <
      // key={data?.id}
      // className="flex flex-row justify-start items-center bg-transparent  rounded-md p-1 cursor-pointer"
    >
      {!isLoading ? (
        !isError ? (
          <Tooltip key="avatar" title={data?.fullName} placement="top">
            <Avatar src={data?.avatar} size={size} />
          </Tooltip>
        ) : (
          <AnErrorHasOccured />
        )
      ) : (
        <LoadingComponentIndicator />
      )}
    </>
  );
};

export default Members;
